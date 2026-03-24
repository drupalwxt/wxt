(function (Drupal, once) {
  Drupal.behaviors.wetWebformPrevBypass = {
    attach(context) {

      // Find Previous button with attribute.
      const elements = once(
        'wetWebformPrevBypass',
        '[data-wet-skip-validation]',
        context
      );

      elements.forEach((el) => {
        el.addEventListener('click', function (e) {
          const form = el.form;
          if (!form) {
            return;
          }

          // Stop WET/jQuery validate from seeing this click.
          e.preventDefault();
          e.stopImmediatePropagation();
          e.stopPropagation();

          // Remove any earlier injected helper input.
          const existing = form.querySelector('input[data-wet-prev-helper="1"]');
          if (existing) {
            existing.remove();
          }

          // Preserve the clicked submit button, because form.submit()
          // does not include submit button name/value automatically.
          if (el.name) {
            const hidden = document.createElement('input');
            hidden.type = 'hidden';
            hidden.name = el.name;
            hidden.value = el.value;
            hidden.setAttribute('data-wet-prev-helper', '1');
            form.appendChild(hidden);
          }

          form.submit();
        }, true);
      });
    }
  };
})(Drupal, once);
