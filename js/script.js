/* =========================================================
   ADRIMAR CAÇA VAZAMENTOS — Scripts (Vanilla JS)
   ========================================================= */
(function () {
  "use strict";

  /* ---------- Ano atual no rodapé ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Header com sombra ao rolar ---------- */
  var header = document.getElementById("site-header");
  function onScroll() {
    if (window.scrollY > 20) header.classList.add("scrolled");
    else header.classList.remove("scrolled");
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Menu mobile ---------- */
  var toggle = document.getElementById("nav-toggle");
  var nav = document.getElementById("main-nav");

  function closeMenu() {
    nav.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Abrir menu");
  }

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMenu();
    });
  }

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el, i) {
      // pequeno atraso escalonado por linha para um efeito mais fluido
      el.style.transitionDelay = (i % 4) * 60 + "ms";
      io.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("visible");
    });
  }

  /* ---------- Contadores numéricos ---------- */
  var counters = document.querySelectorAll(".stat-num");
  function animateCount(el) {
    var target = parseInt(el.getAttribute("data-count"), 10) || 0;
    var suffix = el.getAttribute("data-suffix") || "";
    var duration = 1400;
    var start = null;

    function step(ts) {
      if (!start) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      el.textContent = Math.round(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target + suffix;
    }
    requestAnimationFrame(step);
  }

  if ("IntersectionObserver" in window && counters.length) {
    var countObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            countObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach(function (c) {
      countObserver.observe(c);
    });
  } else {
    counters.forEach(function (c) {
      c.textContent = c.getAttribute("data-count") + (c.getAttribute("data-suffix") || "");
    });
  }

  /* ---------- Parallax sutil do card do hero ---------- */
  var heroCard = document.querySelector(".hero-card");
  if (heroCard && window.matchMedia("(min-width: 861px)").matches) {
    window.addEventListener(
      "scroll",
      function () {
        var y = window.scrollY;
        if (y < 700) heroCard.style.transform = "translateY(" + y * 0.04 + "px)";
      },
      { passive: true }
    );
  }

  /* ---------- Galeria + Lightbox ---------- */
  var items = Array.prototype.slice.call(document.querySelectorAll(".gallery-item"));
  var lightbox = document.getElementById("lightbox");
  var lbImg = document.getElementById("lightbox-img");
  var lbClose = document.getElementById("lightbox-close");
  var lbPrev = document.getElementById("lightbox-prev");
  var lbNext = document.getElementById("lightbox-next");
  var currentIndex = 0;
  var lastFocused = null;

  function showImage(index) {
    if (index < 0) index = items.length - 1;
    if (index >= items.length) index = 0;
    currentIndex = index;
    var btn = items[index];
    var src = btn.getAttribute("data-src");
    var img = btn.querySelector("img");
    lbImg.setAttribute("src", src);
    lbImg.setAttribute("alt", img ? img.getAttribute("alt") : "");
  }

  function openLightbox(index) {
    lastFocused = document.activeElement;
    showImage(index);
    lightbox.hidden = false;
    // força reflow para a transição
    void lightbox.offsetWidth;
    lightbox.classList.add("open");
    document.body.style.overflow = "hidden";
    lbClose.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove("open");
    document.body.style.overflow = "";
    setTimeout(function () {
      lightbox.hidden = true;
      lbImg.setAttribute("src", "");
    }, 300);
    if (lastFocused) lastFocused.focus();
  }

  items.forEach(function (btn, i) {
    btn.addEventListener("click", function () {
      openLightbox(i);
    });
  });

  if (lbClose) lbClose.addEventListener("click", closeLightbox);
  if (lbPrev) lbPrev.addEventListener("click", function () { showImage(currentIndex - 1); });
  if (lbNext) lbNext.addEventListener("click", function () { showImage(currentIndex + 1); });

  if (lightbox) {
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener("keydown", function (e) {
      if (lightbox.hidden) return;
      if (e.key === "Escape") closeLightbox();
      else if (e.key === "ArrowLeft") showImage(currentIndex - 1);
      else if (e.key === "ArrowRight") showImage(currentIndex + 1);
    });
  }

  /* ---------- Formulário -> WhatsApp ---------- */
  var form = document.getElementById("contact-form");
  var WHATSAPP_NUMBER = "5513974109415";

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var valid = true;
      ["nome", "whatsapp", "servico"].forEach(function (id) {
        var field = document.getElementById(id);
        var wrap = field.closest(".field");
        if (!field.value.trim()) {
          wrap.classList.add("invalid");
          valid = false;
        } else {
          wrap.classList.remove("invalid");
        }
      });
      if (!valid) return;

      var nome = document.getElementById("nome").value.trim();
      var whats = document.getElementById("whatsapp").value.trim();
      var servico = document.getElementById("servico").value;
      var cidade = document.getElementById("cidade").value.trim();
      var msg = document.getElementById("mensagem").value.trim();

      var texto =
        "Olá, meu nome é " + nome + "." +
        "\nServiço: " + servico +
        (cidade ? "\nBairro/Cidade: " + cidade : "") +
        "\nWhatsApp: " + whats +
        (msg ? "\nMensagem: " + msg : "") +
        "\n\nGostaria de solicitar um orçamento.";

      var url = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(texto);
      window.open(url, "_blank", "noopener");
    });

    // remove estado inválido ao digitar
    form.querySelectorAll("input, select, textarea").forEach(function (el) {
      el.addEventListener("input", function () {
        var wrap = el.closest(".field");
        if (wrap) wrap.classList.remove("invalid");
      });
    });
  }
})();
