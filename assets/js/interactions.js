/* ==========================================================================
   interactions.js — accordion, publication filters, contact form validation,
   copy-to-clipboard. Everything degrades gracefully without JS.
   ========================================================================== */
(function () {
  "use strict";

  /* ------------------------------------------------------------------------
     1. Accordion (single-open behaviour per group)
     ------------------------------------------------------------------------ */
  document.querySelectorAll("[data-accordion-group]").forEach(function (group) {
    var triggers = group.querySelectorAll(".accordion__trigger");

    triggers.forEach(function (trigger) {
      var panel = document.getElementById(trigger.getAttribute("aria-controls"));
      if (!panel) return;

      // Respect server-rendered state.
      var open = trigger.getAttribute("aria-expanded") === "true";
      panel.setAttribute("data-open", String(open));

      trigger.addEventListener("click", function () {
        var isOpen = trigger.getAttribute("aria-expanded") === "true";

        triggers.forEach(function (other) {
          var otherPanel = document.getElementById(
            other.getAttribute("aria-controls")
          );
          other.setAttribute("aria-expanded", "false");
          if (otherPanel) otherPanel.setAttribute("data-open", "false");
        });

        if (!isOpen) {
          trigger.setAttribute("aria-expanded", "true");
          panel.setAttribute("data-open", "true");
        }
      });
    });
  });

  /* ------------------------------------------------------------------------
     2. Publication filters
     ------------------------------------------------------------------------ */
  var filterBar = document.querySelector("[data-filter-bar]");

  if (filterBar) {
    var chips = filterBar.querySelectorAll(".chip");
    var items = document.querySelectorAll("[data-pub-type]");
    var emptyState = document.querySelector("[data-filter-empty]");

    filterBar.addEventListener("click", function (event) {
      var chip = event.target.closest(".chip");
      if (!chip) return;

      var filter = chip.getAttribute("data-filter");

      chips.forEach(function (other) {
        other.setAttribute("aria-pressed", String(other === chip));
      });

      var visible = 0;
      items.forEach(function (item) {
        var match = filter === "all" || item.getAttribute("data-pub-type") === filter;
        item.classList.toggle("is-hidden", !match);
        if (match) visible += 1;
      });

      if (emptyState) {
        emptyState.classList.toggle("is-visible", visible === 0);
      }
    });
  }

  /* ------------------------------------------------------------------------
     3. Copy-to-clipboard for emails
     ------------------------------------------------------------------------ */
  document.querySelectorAll("[data-copy]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var value = btn.getAttribute("data-copy");
      var status = document.querySelector("[data-copy-status]");

      function announce(message) {
        if (status) status.textContent = message;
      }

      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(value).then(
          function () {
            announce("Email address copied.");
          },
          function () {
            announce("Could not copy. Select the email address above to copy it.");
          }
        );
      } else {
        announce("Copy unavailable. Select the email address above to copy it.");
      }
    });
  });

  /* ------------------------------------------------------------------------
     4. Contact form — client-side validation + placeholder submit
     ------------------------------------------------------------------------ */
  var form = document.querySelector("[data-contact-form]");

  if (form) {
    var status = form.querySelector("[data-form-status]");

    function fieldOf(input) {
      return input.closest(".field");
    }

    function setError(input, message) {
      var field = fieldOf(input);
      var slot = field ? field.querySelector(".field__error") : null;
      if (field) field.classList.toggle("has-error", Boolean(message));
      if (slot) slot.textContent = message || "";
      input.setAttribute("aria-invalid", message ? "true" : "false");
    }

    function validate(input) {
      var value = input.value.trim();

      if (input.hasAttribute("required") && !value) {
        setError(input, "This field is required.");
        return false;
      }

      if (input.type === "email" && value) {
        var valid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
        setError(input, valid ? "" : "Enter a valid email address.");
        return valid;
      }

      if (input.type === "email" && !value && !input.hasAttribute("required")) {
        setError(input, "");
        return true;
      }

      setError(input, "");
      return true;
    }

    var inputs = form.querySelectorAll("input, textarea, select");

    inputs.forEach(function (input) {
      input.addEventListener("blur", function () {
        validate(input);
      });
      input.addEventListener("input", function () {
        if (fieldOf(input) && fieldOf(input).classList.contains("has-error")) {
          validate(input);
        }
      });
    });

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      var valid = true;
      inputs.forEach(function (input) {
        if (!validate(input)) valid = false;
      });

      if (!valid) {
        var firstInvalid = form.querySelector(".has-error input, .has-error textarea");
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      // Placeholder behaviour: no backend is wired up yet.
      if (status) {
        status.classList.add("is-visible");
        status.setAttribute("role", "status");
        status.scrollIntoView({
          block: "nearest",
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
            ? "auto"
            : "smooth"
        });
      }

      form.reset();
    });
  }

  /* ------------------------------------------------------------------------
     5. Demo links that have no destination yet
     ------------------------------------------------------------------------ */
  document.querySelectorAll("[data-placeholder-link]").forEach(function (link) {
    link.addEventListener("click", function (event) {
      event.preventDefault();
      var note = link.getAttribute("data-placeholder-link");
      if (note) {
        link.setAttribute("title", note);
      }
    });
  });
})();
