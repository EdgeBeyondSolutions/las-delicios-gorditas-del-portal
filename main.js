(function () {
  "use strict";

  document.documentElement.classList.add("js");

  var data = window.__BRAND__ || {};
  var reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fineHover = matchMedia("(hover: hover) and (pointer: fine)").matches;

  var $ = function (sel, scope) { return (scope || document).querySelector(sel); };
  var $$ = function (sel, scope) { return Array.prototype.slice.call((scope || document).querySelectorAll(sel)); };
  var escHTML = function (s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  };
  function safe(fn, name) {
    try { fn(); } catch (e) { console.warn("[" + name + "]", e); }
  }

  /* ---------- Mounts (idempotent) ---------- */

  var DISH_ICON = '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="9"/><path d="M7 12c0-2.8 2.2-5 5-5s5 2.2 5 5"/><path d="M12 7V4M9 4.5V3M15 4.5V3"/></svg>';
  var DISH_TONES = ["accent", "accent-2", "gold"];

  function mountDishes() {
    var target = $("[data-dishes]");
    if (!target || target.children.length > 0 || !data.dishes) return;
    target.innerHTML = data.dishes.map(function (d, i) {
      var tone = DISH_TONES[i % DISH_TONES.length];
      return (
        '<article class="dish-card dish-card-icon reveal" data-tilt>' +
          '<div class="dish-icon tone-' + tone + '">' + DISH_ICON + "</div>" +
          '<span class="dish-tag-flat">' + escHTML(d.tag) + "</span>" +
          '<div class="dish-body">' +
            "<h3>" + escHTML(d.name) + "</h3>" +
            "<p>" + escHTML(d.desc) + "</p>" +
          "</div>" +
        "</article>"
      );
    }).join("");
  }

  function mountMarquee() {
    var track = $("[data-marquee-track]");
    if (!track || track.dataset.filled) return;
    var words = ["Gorditas de migas", "Sopes", "Tacos al pastor", "Centro Histórico de Querétaro", "Desde el comal", "Sin prisa, sin lujos"];
    var html = words.map(function (w) { return "<span>" + escHTML(w) + "</span>"; }).join("");
    track.innerHTML = html + html;
    track.dataset.filled = "1";
  }

  function fillBrandFields() {
    $$("[data-brand-phone]").forEach(function (el) { el.textContent = data.phone || ""; });
    $$("[data-brand-phone-href]").forEach(function (el) { el.setAttribute("href", data.phoneHref || "#"); });
    $$("[data-brand-email]").forEach(function (el) { el.textContent = data.email || ""; });
    $$("[data-brand-email-href]").forEach(function (el) { el.setAttribute("href", "mailto:" + (data.email || "")); });
    $$("[data-brand-address]").forEach(function (el) { el.textContent = data.address || ""; });
    $$("[data-brand-maps]").forEach(function (el) { el.setAttribute("href", data.mapsHref || "#"); });
    $$("[data-brand-facebook]").forEach(function (el) { el.setAttribute("href", data.facebook || "#"); });
    $$("[data-brand-instagram]").forEach(function (el) { el.setAttribute("href", data.instagram || "#"); });
    $$("[data-brand-recommend-pct]").forEach(function (el) { el.textContent = data.recommendPct || ""; });
    $$("[data-brand-recommend-count]").forEach(function (el) { el.textContent = data.recommendCount || ""; });
  }

  /* ---------- Sello (medallón) — marca gráfica original ---------- */

  function selloSVG(uid, stampMode) {
    var topId = "selloTop" + uid;
    var botId = "selloBot" + uid;
    var stampAttr = stampMode === "load" ? ' data-stamp-on-load="1"' : stampMode === "view" ? ' data-stamp-on-view="1"' : "";
    return (
      '<svg viewBox="0 0 120 120" role="img" aria-label="Sello de Las Deliciosas Gorditas del Portal">' +
        '<g class="sello-stamp"' + stampAttr + '>' +
          '<path id="' + topId + '" d="M 14,60 A 46,46 0 0 1 106,60" fill="none" />' +
          '<path id="' + botId + '" d="M 106,62 A 46,46 0 0 1 14,62" fill="none" />' +
          '<circle cx="60" cy="60" r="56" fill="#241209" stroke="#c9932e" stroke-width="1.5" />' +
          '<circle cx="60" cy="60" r="48" fill="none" stroke="#c9932e" stroke-width="0.75" stroke-dasharray="1.5 3.2" opacity="0.7" />' +
          '<text font-family="Space Mono, monospace" font-size="7.2" letter-spacing="1.5" fill="#fbf1e2">' +
            '<textPath href="#' + topId + '" startOffset="50%" text-anchor="middle">LAS DELICIOSAS · GORDITAS</textPath>' +
          "</text>" +
          '<text font-family="Space Mono, monospace" font-size="7.2" letter-spacing="1.8" fill="#fbf1e2">' +
            '<textPath href="#' + botId + '" startOffset="50%" text-anchor="middle">DEL PORTAL · QRO</textPath>' +
          "</text>" +
          '<g transform="translate(60,60)" stroke="#e2531b" stroke-width="2.4" fill="none" stroke-linecap="round">' +
            '<circle r="15" fill="#e2531b" fill-opacity="0.16" />' +
            '<path d="M -9,3 Q 0,-13 9,3 Q 0,10 -9,3 Z" />' +
            '<path d="M -4,-2 L 4,-2 M -3,2 L 3,2" stroke-width="1.6" opacity="0.8" />' +
          "</g>" +
        "</g>" +
      "</svg>"
    );
  }

  function mountSellos() {
    var nodes = $$("[data-sello]");
    nodes.forEach(function (el, i) {
      if (el.dataset.filled) return;
      el.dataset.filled = "1";
      var mode = el.getAttribute("data-sello");
      el.innerHTML = selloSVG("u" + i, mode);
    });
  }

  /* ---------- Nav ---------- */

  function initNav() {
    var nav = $(".nav");
    if (!nav) return;
    var onScroll = function () {
      nav.classList.toggle("is-scrolled", window.scrollY > 12);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    var burger = $(".nav-burger");
    var menu = $(".mobile-menu");
    if (burger && menu) {
      burger.addEventListener("click", function () {
        var open = menu.classList.toggle("is-open");
        burger.setAttribute("aria-expanded", open ? "true" : "false");
        document.body.style.overflow = open ? "hidden" : "";
      });
      $$("a", menu).forEach(function (a) {
        a.addEventListener("click", function () {
          menu.classList.remove("is-open");
          document.body.style.overflow = "";
        });
      });
    }

    var here = location.pathname.split("/").pop() || "index.html";
    $$(".nav-links a, .mobile-menu a").forEach(function (a) {
      var href = a.getAttribute("href") || "";
      if (href === here || (here === "" && href === "index.html")) a.classList.add("is-active");
    });
  }

  /* ---------- Smooth anchor scroll (native) ---------- */

  function setupSmoothScroll() {
    document.addEventListener("click", function (e) {
      var a = e.target.closest('a[href^="#"]');
      if (!a) return;
      var id = a.getAttribute("href");
      if (!id || id === "#") return;
      var el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      var navOffset = 84;
      window.scrollTo({
        top: el.getBoundingClientRect().top + window.scrollY - navOffset,
        behavior: reduced ? "auto" : "smooth"
      });
    });
  }

  /* ---------- Reveal on scroll ---------- */

  function initReveals() {
    var els = $$(".reveal");
    if (!els.length) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.02, rootMargin: "0px 0px -2% 0px" });
    els.forEach(function (el) { io.observe(el); });

    setTimeout(function () {
      $$(".reveal:not(.is-visible)").forEach(function (el) {
        if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add("is-visible");
      });
    }, 6000);
  }

  /* ---------- Sello stamp-in animation ---------- */

  function initSelloStamp() {
    var stamps = $$(".sello-stamp[data-stamp-on-load], .sello-stamp[data-stamp-on-view]");
    stamps.forEach(function (el) {
      if (el.hasAttribute("data-stamp-on-load")) {
        requestAnimationFrame(function () { el.classList.add("is-stamping"); });
        return;
      }
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-stamping");
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.05 });
      io.observe(el);
    });

    setTimeout(function () {
      $$('.sello-stamp[data-stamp-on-view]:not(.is-stamping)').forEach(function (el) {
        if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add("is-stamping");
      });
    }, 6000);
  }

  /* ---------- Tilt on dish cards ---------- */

  function initTilt() {
    if (!fineHover) return;
    var cards = $$("[data-tilt]");
    cards.forEach(function (card) {
      if (card.dataset.tiltBound) return;
      card.dataset.tiltBound = "1";
      card.addEventListener("mousemove", function (e) {
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = "translateY(-6px) rotateX(" + (py * -6).toFixed(2) + "deg) rotateY(" + (px * 7).toFixed(2) + "deg)";
      });
      card.addEventListener("mouseout", function (e) {
        if (card.contains(e.relatedTarget)) return;
        card.style.transform = "";
      });
    });
  }

  /* ---------- Multi-step event form ---------- */

  function initEventForm() {
    var form = $("[data-event-form]");
    if (!form) return;

    var steps = $$(".form-step", form);
    var progressEls = $$(".form-progress-step", form);
    var current = 0;
    var state = { tipo: "", personas: "", fecha: "", nombre: "", telefono: "", mensaje: "" };

    function renderProgress() {
      progressEls.forEach(function (el, i) {
        el.classList.toggle("is-done", i < current);
        el.classList.toggle("is-active", i === current);
      });
    }

    function showStep(i) {
      steps.forEach(function (s, idx) { s.classList.toggle("is-active", idx === i); });
      current = i;
      renderProgress();
    }

    $$("[data-option]", form).forEach(function (btn) {
      btn.addEventListener("click", function () {
        var group = btn.closest("[data-option-group]");
        $$("[data-option]", group).forEach(function (b) { b.classList.remove("is-selected"); });
        btn.classList.add("is-selected");
        state[group.getAttribute("data-option-group")] = btn.getAttribute("data-option");
        var stepIdx = steps.indexOf(btn.closest(".form-step"));
        if (stepIdx > -1 && stepIdx < steps.length - 1) {
          setTimeout(function () { showStep(stepIdx + 1); }, 220);
        }
      });
    });

    $$("[data-next]", form).forEach(function (btn) {
      btn.addEventListener("click", function () {
        var stepEl = btn.closest(".form-step");
        var requiredInputs = $$("input[required], select[required]", stepEl);
        for (var i = 0; i < requiredInputs.length; i++) {
          if (!requiredInputs[i].reportValidity()) return;
        }
        $$("input, select, textarea", stepEl).forEach(function (input) {
          if (input.name) state[input.name] = input.value;
        });
        if (current < steps.length - 1) showStep(current + 1);
        if (current === steps.length - 1) fillSummary();
      });
    });

    $$("[data-prev]", form).forEach(function (btn) {
      btn.addEventListener("click", function () {
        if (current > 0) showStep(current - 1);
      });
    });

    function fillSummary() {
      var summary = $("[data-form-summary]", form);
      if (!summary) return;
      var rows = [
        ["Tipo de evento", state.tipo],
        ["Personas aproximadas", state.personas],
        ["Fecha tentativa", state.fecha],
        ["Nombre", state.nombre],
        ["Teléfono", state.telefono]
      ];
      summary.innerHTML = rows.filter(function (r) { return r[1]; }).map(function (r) {
        return '<div class="form-summary-row"><span>' + escHTML(r[0]) + '</span><strong>' + escHTML(r[1]) + "</strong></div>";
      }).join("");
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var contactStep = $(".form-step.is-active", form);
      var requiredInputs = $$("input[required], select[required], textarea[required]", contactStep);
      for (var i = 0; i < requiredInputs.length; i++) {
        if (!requiredInputs[i].reportValidity()) return;
      }
      $$("input, select, textarea", contactStep).forEach(function (input) {
        if (input.name) state[input.name] = input.value;
      });

      var lines = [
        "Hola, quiero cotizar un evento en Las Deliciosas Gorditas del Portal:",
        "• Tipo de evento: " + (state.tipo || "-"),
        "• Personas aproximadas: " + (state.personas || "-"),
        "• Fecha tentativa: " + (state.fecha || "-"),
        "• Nombre: " + (state.nombre || "-"),
        "• Teléfono: " + (state.telefono || "-")
      ];
      if (state.mensaje) lines.push("• Mensaje: " + state.mensaje);

      var msg = encodeURIComponent(lines.join("\n"));
      var wa = "https://wa.me/" + (data.whatsappNumber || "") + "?text=" + msg;

      var successStep = $("[data-form-success]", form);
      $$(".form-step", form).forEach(function (s) { s.classList.remove("is-active"); });
      if (successStep) successStep.classList.add("is-active");
      $(".form-progress", form) && $(".form-progress", form).classList.add("is-hidden");

      var waLink = $("[data-whatsapp-link]", form);
      if (waLink) waLink.setAttribute("href", wa);

      setTimeout(function () { window.open(wa, "_blank", "noopener"); }, 500);
    });

    showStep(0);
  }

  function boot() {
    safe(fillBrandFields, "fillBrandFields");
    safe(mountDishes, "mountDishes");
    safe(mountMarquee, "mountMarquee");
    safe(mountSellos, "mountSellos");
    safe(initNav, "initNav");
    safe(setupSmoothScroll, "setupSmoothScroll");
    safe(initReveals, "initReveals");
    safe(initSelloStamp, "initSelloStamp");
    safe(initTilt, "initTilt");
    safe(initEventForm, "initEventForm");
    document.documentElement.classList.add("is-ready");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
