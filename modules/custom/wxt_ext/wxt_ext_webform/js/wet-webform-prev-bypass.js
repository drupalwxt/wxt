(function (Drupal, once) {
  Drupal.behaviors.wetWebformPrevBypass = {
    attach: function (context) {
      // Find Previous button with attribute.
      var elements = once('wetWebformPrevBypass', '[data-wet-skip-validation]', context);

      elements.forEach(function (el) {
        // Runs BEFORE jQuery/WET handlers.
        el.addEventListener('click', function (e) {
          var form = el.form;
          if (!form) {
            return;
          }

          // Stop WET/jQuery validate from seeing this click.
          e.preventDefault();
          e.stopImmediatePropagation();
          e.stopPropagation();

          // Native submit: does NOT trigger jQuery submit handlers,
          // so no WET validation, but Drupal still processes "op".
          form.submit();
        }, true);
      });
    }
  };
})(Drupal, once);
