// FirmAudit2 宣传站交互：滚动进度、揭示动画、截图放大
(function () {
  "use strict";

  // ---- 移动端导航 ----
  var toggle = document.getElementById("navToggle");
  var links = document.getElementById("navLinks");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("is-open");
      toggle.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
    });
    links.addEventListener("click", function (e) {
      if (e.target.closest("a")) {
        links.classList.remove("is-open");
        toggle.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  // ---- 滚动进度条 ----
  var progress = document.getElementById("navProgress");
  if (progress) {
    var update = function () {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + "%";
    };
    window.addEventListener("scroll", update, { passive: true });
    update();
  }

  // ---- 滚动揭示 ----
  var revealables = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    revealables.forEach(function (el) { el.classList.add("is-in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    revealables.forEach(function (el) { io.observe(el); });
  }

  // ---- 截图放大 ----
  var box = document.getElementById("lightbox");
  var boxImg = document.getElementById("lightboxImg");
  var boxClose = document.getElementById("lightboxClose");
  var lastFocus = null;
  function openLightbox(src, alt) {
    if (!box || !boxImg) return;
    lastFocus = document.activeElement;
    boxImg.src = src;
    boxImg.alt = alt || "";
    box.hidden = false;
    document.body.style.overflow = "hidden";
    if (boxClose) boxClose.focus();
  }
  function closeLightbox() {
    if (!box || box.hidden) return;
    box.hidden = true;
    document.body.style.overflow = "";
    if (boxImg) boxImg.removeAttribute("src");
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  document.querySelectorAll("[data-full]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      openLightbox(btn.getAttribute("data-full"), btn.getAttribute("data-alt"));
    });
  });
  if (box) {
    box.addEventListener("click", function (e) { if (e.target === box) closeLightbox(); });
  }
  if (boxClose) boxClose.addEventListener("click", closeLightbox);
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeLightbox();
  });
})();
