/**
 * Collapse WET-BOEW / jQuery Validate errors for Webform checkbox *groups* so:
 *  - "at least one checked" is enforced via require_from_group
 *  - only ONE inline error is rendered for the whole set
 *  - only ONE item appears in the WET error summary
 *  - checking ANY checkbox in the set clears the group error
 *
 * How it works (high level):
 *  1) We wait until WET's validator is initialized on the form.
 *  2) We discover checkbox groups by looking for inputs named like base[option]
 *     that also have data-rule-require_from_group (added in PHP preprocess).
 *  3) We register jQuery Validate "groups" for each base so the set acts as one field.
 *  4) We only *place* an inline error label for the FIRST checkbox of each base.
 *     (The others are skipped to avoid duplicate labels.)
 *  5) We de-duplicate the validator's error list in invalidHandler so WET's top
 *     summary only contains one entry per base.
 *  6) We prevent submission when the validator reports invalid, covering
 *     normal submit + Enter key + direct submit-button clicks.
 */

(function ($, Drupal, once) {
  Drupal.behaviors.wetGroupOneMessage = {
    attach(context) {
      // Bind this behavior once per element with .wb-frmvld.
      const hosts = once('wetGroupOneMessage', '.wb-frmvld', context);

      hosts.forEach((host) => {
        const $host = $(host);

        // Find the <form> that is being validated.
        // In WxT it’s usually a child of .wb-frmvld.
        const $form = $host.is('form') ? $host : $host.find('form').first();
        if (!$form.length) return;

        /**
         * Given a name like "select_from_the_following[2]" return the base "select_from_the_following".
         * Returns null for non-array names.
         */
        const baseOf = (name) => (name || '').match(/^([^\[]+)\[.+\]$/)?.[1] || null;

        /**
         * Discover checkbox groups on the form.
         * We only consider checkboxes that:
         *   - have a name like base[option]
         *   - and have data-rule-require_from_group (added server-side)
         *
         * Returns a map: { baseName: [ "base[1]", "base[2]", ... ] }
         */
        function discoverGroups() {
          const map = {};
          $form.find('input[type=checkbox][name*="["][data-rule-require_from_group]').each(function () {
            const base = baseOf(this.name);
            if (!base) return;
            (map[base] ||= []).push(this.name);
          });
          return map;
        }

        /**
         * Wire our grouping + dedup logic into the existing validator instance.
         * @param {Object} v - jQuery Validate instance stored on the form by WET.
         */
        function wire(v) {
          const groups = discoverGroups();

          // 1) Register one jQuery Validate "group" per checkbox base.
          //    This makes jQuery Validate treat multiple field names as one logical group
          //    when deciding which single label/entry to render.
          v.settings.groups = v.settings.groups || {};
          Object.keys(groups).forEach((base) => {
            // Names must be space-separated for JQV "groups".
            v.settings.groups[base] = groups[base].join(' ');
          });

          // Precompute the "first" field name for each base; duplicates will be suppressed.
          const firstOf = {};
          Object.keys(groups).forEach((base) => {
            firstOf[base] = groups[base][0];
          });

          // Shadow a local baseOf so inner functions have it in scope (performance/readability).
          const baseOf = (name) => (name || '').match(/^([^\[]+)\[.+\]$/)?.[1] || null;

          // 2) Override errorPlacement to only place the inline label for the FIRST checkbox.
          //    This avoids multiple inline labels stacked under the group.
          const origPlace = v.settings.errorPlacement || function (error, element) { error.insertAfter(element); };
          v.settings.errorPlacement = function (error, element) {
            const name = element.attr('name');
            const base = baseOf(name);

            // If this is part of a checkbox base and it's NOT the first item,
            // skip placing the label entirely (the "first" item will get it).
            if (base && name !== firstOf[base]) {
              return;
            }
            return origPlace(error, element);
          };

          // 3) Override invalidHandler to de-duplicate BEFORE WET composes its summary.
          //    We reduce validator.errorList/errorMap to contain only the first failing
          //    element of each base, so the top summary has one entry per group.
          const origInvalid = v.settings.invalidHandler || $.noop;
          v.settings.invalidHandler = function (formEl, validator) {
            const seen = new Set();
            const list = [];
            const map = {};
            validator.errorList.forEach((item) => {
              const nm = item.element && item.element.name;
              // Fall back to name for non-array fields.
              const base = baseOf(nm) || nm;

              // Keep the first error per base, drop the rest.
              if (!seen.has(base)) {
                seen.add(base);
                list.push(item);
                if (nm) map[nm] = item.message;
              }
            });

            // Replace the validator's error structures with our reduced versions.
            validator.errorList = list;
            validator.errorMap = map;

            // Allow any original invalidHandler (including WET's) to run with the reduced list.
            return origInvalid.call(this, formEl, validator);
          };
        }

        /**
         * Try to find the jQuery Validate instance created by WET for this form.
         * If found, wire our grouping/dedup logic into it.
         * Returns true if the validator exists and was wired.
         */
        function tryWire() {
          const v = $form.data('validator') || $host.data('validator');
          if (v) wire(v);
          return !!v;
        }

        // If WET's validator is already present, wire immediately.
        if (tryWire()) return;

        // Otherwise, wait for WET to finish attaching the validator, then wire.
        // 'wb-ready.wb-frmvld' fires when the plugin is ready on this wrapper.
        $host.on('wb-ready.wb-frmvld', tryWire);

        // ---- Submission guards --------------------------------------------------
        // Prevent the form from submitting when invalid (covers:
        // - clicking the submit button
        // - pressing Enter in a field
        // - any custom handler that falls back to form.submit())
        //
        // We *evaluate* validity using $form.valid()/v.checkForm() and block the
        // event if invalid. We also focus the first invalid field for accessibility.

        // Guard the native form submit event.
        $form.on('submit.wetGroupOneMessage', function (e) {
          const v = $form.data('validator') || $host.data('validator');
          // If no validator, let normal processing happen.
          if (!v) return;

           // valid() calls checkForm() and sets up error display without submitting.
          const ok = $form.valid ? $form.valid() : v.checkForm();
          if (!ok) {
            v.focusInvalid && v.focusInvalid();
            e.preventDefault();
            e.stopImmediatePropagation();
            e.stopPropagation();
            return false;
          }
        });

        // Guard submit button clicks as well to catch flows
        // where other handlers might try to submit programmatically.
        $form.find('button[type=submit], input[type=submit]').on('click.wetGroupOneMessage', function (e) {
          const v = $form.data('validator') || $host.data('validator');
          if (!v) return;
          const ok = $form.valid ? $form.valid() : v.checkForm();
          if (!ok) {
            v.focusInvalid && v.focusInvalid();
            e.preventDefault();
            e.stopImmediatePropagation();
            e.stopPropagation();
            return false;
          }
        });
      });
    }
  };
})(jQuery, Drupal, once);
