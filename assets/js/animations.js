/* ==========================================================================
   animations.js — decorative motion layer
   Text splitting, count-up stats, skill bars, spotlight cards, cursor glow,
   seamless marquee, subtle 3D tilt.
   ========================================================================== */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ------------------------------------------------------------------------
     1. Split hero headline into animatable characters
     ------------------------------------------------------------------------ */
  document.querySelectorAll("[data-split-text]").forEach(function (el) {
    if (reduceMotion) return;

    var index = 0;
    var text = el.textContent;
    el.textContent = "";

    Array.prototype.forEach.call(text, function (char) {
      if (char === " ") {
        el.appendChild(document.createTextNode(" "));
        return;
      }
      var span = document.createElement("span");
      span.className = "char";
      span.style.setProperty("--i", String(index));
      span.textContent = char;
      el.appendChild(span);
      index += 1;
    });

    // Screen readers get the original string back.
    el.setAttribute("aria-label", text);
  });

  /* ------------------------------------------------------------------------
     2. Count-up numbers ([data-count="120" data-suffix="+"])
     ------------------------------------------------------------------------ */
  var counters = document.querySelectorAll("[data-count]");

  function runCounter(el) {
    var target = parseFloat(el.getAttribute("data-count")) || 0;
    var decimals = (el.getAttribute("data-decimals") || "0") | 0;
    var suffix = el.getAttribute("data-suffix") || "";
    var prefix = el.getAttribute("data-prefix") || "";

    if (reduceMotion) {
      el.textContent = prefix + target.toFixed(decimals) + suffix;
      return;
    }

    var duration = 1400;
    var start = null;

    function step(timestamp) {
      if (start === null) start = timestamp;
      var progress = Math.min((timestamp - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var value = target * eased;
      el.textContent =
        prefix +
        (decimals > 0 ? value.toFixed(decimals) : Math.round(value).toString()) +
        suffix;
      if (progress < 1) window.requestAnimationFrame(step);
    }

    window.requestAnimationFrame(step);
  }

  if (counters.length) {
    if (!("IntersectionObserver" in window)) {
      counters.forEach(runCounter);
    } else {
      var counterObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            runCounter(entry.target);
            counterObserver.unobserve(entry.target);
          });
        },
        { threshold: 0.4 }
      );
      counters.forEach(function (el) {
        counterObserver.observe(el);
      });
    }
  }

  /* ------------------------------------------------------------------------
     3. Skill bars fill when scrolled into view
     ------------------------------------------------------------------------ */
  var skills = document.querySelectorAll(".skill");

  if (skills.length) {
    if (!("IntersectionObserver" in window)) {
      skills.forEach(function (el) {
        el.classList.add("is-in");
      });
    } else {
      var skillObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-in");
            skillObserver.unobserve(entry.target);
          });
        },
        { threshold: 0.5 }
      );
      skills.forEach(function (el) {
        skillObserver.observe(el);
      });
    }
  }

  /* ------------------------------------------------------------------------
     4. Spotlight cards — glow follows the cursor
     ------------------------------------------------------------------------ */
  document.querySelectorAll(".card--spotlight").forEach(function (card) {
    card.addEventListener("pointermove", function (event) {
      var rect = card.getBoundingClientRect();
      card.style.setProperty("--mx", event.clientX - rect.left + "px");
      card.style.setProperty("--my", event.clientY - rect.top + "px");
    });
  });

  /* ------------------------------------------------------------------------
     5. Cursor glow (decorative; skipped on touch / reduced motion)
     ------------------------------------------------------------------------ */
  var glow = document.querySelector("[data-cursor-glow]");
  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  if (glow && finePointer && !reduceMotion) {
    var gx = window.innerWidth / 2;
    var gy = window.innerHeight / 2;
    var cx = gx;
    var cy = gy;

    document.addEventListener("pointermove", function (event) {
      gx = event.clientX;
      gy = event.clientY;
      glow.classList.add("is-active");
    });

    document.addEventListener("pointerleave", function () {
      glow.classList.remove("is-active");
    });

    (function loop() {
      cx += (gx - cx) * 0.09;
      cy += (gy - cy) * 0.09;
      glow.style.transform =
        "translate(" + cx.toFixed(1) + "px," + cy.toFixed(1) + "px) translate(-50%,-50%)";
      window.requestAnimationFrame(loop);
    })();
  }

  /* ------------------------------------------------------------------------
     6. Seamless marquee — duplicate the track content once
     ------------------------------------------------------------------------ */
  document.querySelectorAll("[data-marquee]").forEach(function (track) {
    var clone = track.cloneNode(true);
    clone.setAttribute("aria-hidden", "true");
    Array.prototype.forEach.call(clone.children, function (child) {
      child.removeAttribute("id");
    });
    while (clone.firstChild) {
      track.appendChild(clone.firstChild);
    }
  });

  /* ------------------------------------------------------------------------
     7. Gentle 3D tilt on portrait card
     ------------------------------------------------------------------------ */
  document.querySelectorAll("[data-tilt]").forEach(function (el) {
    if (reduceMotion || !finePointer) return;
    var strength = parseFloat(el.getAttribute("data-tilt")) || 6;

    el.style.transformStyle = "preserve-3d";
    el.style.transition = "transform 240ms cubic-bezier(0.22,0.61,0.36,1)";

    el.addEventListener("pointermove", function (event) {
      var rect = el.getBoundingClientRect();
      var px = (event.clientX - rect.left) / rect.width - 0.5;
      var py = (event.clientY - rect.top) / rect.height - 0.5;
      el.style.transform =
        "perspective(900px) rotateY(" +
        (px * strength).toFixed(2) +
        "deg) rotateX(" +
        (-py * strength).toFixed(2) +
        "deg)";
    });

    el.addEventListener("pointerleave", function () {
      el.style.transform = "perspective(900px) rotateY(0deg) rotateX(0deg)";
    });
  });

  /* ------------------------------------------------------------------------
     8. Current year for anything missed by main.js (safe no-op otherwise)
     ------------------------------------------------------------------------ */
  document.querySelectorAll("[data-year-local]").forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });
})();
