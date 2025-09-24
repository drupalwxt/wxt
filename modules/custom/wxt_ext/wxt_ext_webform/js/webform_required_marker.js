/**
 * @file
 * Webform/WET-BOEW required marker enhancer for conditional fields.
 *
 * Purpose:
 * - Mirror runtime toggles of "required" on Webform elements without
 *   duplicating server-rendered markers.
 * - When a field becomes required client-side, append
 *   <strong class="required" aria-hidden="true">(required)</strong> as the
 *   last child of its <label> or <legend>. Remove it when no longer required.
 */
(function (Drupal, once) {
  'use strict';

  const OUR_ATTR = 'data-webform-required-marker';
  const OUR_SEL  = `strong.required[${OUR_ATTR}="1"]`;

  // Track prior required state per element (label/legend).
  const baseline = new WeakMap();

  // Helpers
  function isLabelRequired(label) {
    return label.classList.contains('js-form-required');
  }
  function isLegendRequired(legend) {
    return !!legend.querySelector('span.js-form-required');
  }
  // Place marker before any inline error badge (e.g., .label.label-danger).
  function ensureBeforeError(el, node) {
    const err = el.querySelector('strong.error');
    const errIsChild = err && err.parentNode === el;
    if (errIsChild) {
      if (node.parentNode !== el || node.nextElementSibling !== err) {
        el.insertBefore(node, err);
      }
    } else {
      if (node.parentNode !== el || el.lastElementChild !== node) {
        el.appendChild(node);
      }
    }
  }
  function addMarker(el) {
    el.classList.add('required');
    let strong = el.querySelector(OUR_SEL);
    if (!strong) {
      strong = document.createElement('strong');
      strong.className = 'required';
      strong.setAttribute(OUR_ATTR, '1');
      strong.setAttribute('aria-hidden', 'true');
      strong.textContent = `(${Drupal.t('required')})`;
    }
    ensureBeforeError(el, strong);
  }
  function removeMarker(el) {
    el.classList.remove('required');
    const ours = el.querySelector(OUR_SEL);
    if (ours) ours.remove();
  }

  // React to a possible state change on a label/legend,
  // but only if baseline exists.
  function syncWithTransition(el, nowRequired) {
    if (!baseline.has(el)) {
      // First time we see this element post-attach:
      // set baseline, do nothing.
      baseline.set(el, nowRequired);
      return;
    }
    const wasRequired = baseline.get(el);
    if (wasRequired === nowRequired) {
      // No change.
      return;
    }
    // Update baseline then act.
    baseline.set(el, nowRequired);
    if (nowRequired) addMarker(el);
    else removeMarker(el);
  }

  Drupal.behaviors.webformRequiredMarkerObserver = {
    attach(context) {
      // Scope to .wb-frmvld (your library is only attached
      // when inline validation is enabled).
      once('webform-required-marker-observer', '.wb-frmvld', context).forEach((root) => {
        // Defer baseline capture to the next frame so we
        // don't react to initial build churn.
        requestAnimationFrame(() => {
          // Capture baseline for all labels and legends without touching DOM.
          root.querySelectorAll('label').forEach((label) => {
            baseline.set(label, isLabelRequired(label));
          });
          root.querySelectorAll('legend').forEach((legend) => {
            baseline.set(legend, isLegendRequired(legend));
          });
        });

        // Observe only class/child mutations;
        // act *after* baseline exists.
        const observer = new MutationObserver((mutations) => {
          for (const m of mutations) {
            // Class toggles on <label>.
            if (m.type === 'attributes' && m.attributeName === 'class' && m.target.tagName === 'LABEL') {
              const label = /** @type {HTMLElement} */ (m.target);
              syncWithTransition(label, isLabelRequired(label));
              continue;
            }

            // Class toggles on <span> inside <legend>.
            if (m.type === 'attributes' && m.attributeName === 'class' && m.target.tagName === 'SPAN') {
              const legend = m.target.closest('legend');
              if (legend) {
                syncWithTransition(legend, isLegendRequired(legend));
              }
              continue;
            }

            // Child list changes within/under a <legend> (some UIs replace nodes).
            if (m.type === 'childList') {
              const legend = (m.target.closest && m.target.closest('legend')) || (m.target.tagName === 'LEGEND' ? m.target : null);
              if (legend) {
                syncWithTransition(legend, isLegendRequired(legend));
              }
            }
          }
        });

        observer.observe(root, {
          subtree: true,
          attributes: true,
          attributeFilter: ['class'],
          attributeOldValue: true,
          childList: true,
        });
      });
    }
  };
})(Drupal, once);
