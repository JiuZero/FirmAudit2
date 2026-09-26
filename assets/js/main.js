// FirmAudit2 宣传站交互：滚动进度、揭示动画、界面模拟页签、截图放大
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

  // ---- 界面模拟：页签切换 ----
  var tabs = Array.prototype.slice.call(document.querySelectorAll(".prod__tab"));
  function selectTab(tab) {
    tabs.forEach(function (other) {
      var panel = document.getElementById(other.getAttribute("aria-controls"));
      var active = other === tab;
      other.classList.toggle("is-active", active);
      other.setAttribute("aria-selected", String(active));
      other.tabIndex = active ? 0 : -1;
      if (!panel) return;
      panel.hidden = !active;
      panel.classList.toggle("is-active", active);
    });
  }
  tabs.forEach(function (tab, index) {
    tab.addEventListener("click", function () { selectTab(tab); });
    tab.addEventListener("keydown", function (e) {
      var next = e.key === "ArrowRight" ? index + 1 : e.key === "ArrowLeft" ? index - 1 : -1;
      if (next < 0 || next >= tabs.length) return;
      e.preventDefault();
      tabs[next].focus();
      selectTab(tabs[next]);
    });
  });

  // ---- 界面模拟：暂停 / 中止只是演示状态机 ----
  var pauseBtn = document.getElementById("prodPause");
  var stopBtn = document.getElementById("prodStop");
  var taskPill = document.querySelector(".ptask span");
  var statusBadge = document.getElementById("prodStatus");
  var demoState = "run";
  function renderDemoState() {
    var label = { run: "执行中", paused: "暂停中", stopped: "沙箱已释放" }[demoState];
    if (taskPill) {
      var led = { run: "pled pled--run", paused: "pled pled--warn", stopped: "pled" }[demoState];
      taskPill.innerHTML = '<i class="' + led + '"></i>' + label + " · 沙箱会话 demo";
    }
    if (statusBadge) {
      var badge = { run: "pbadge pbadge--run", paused: "pbadge pbadge--warn", stopped: "pbadge pbadge--bad" }[demoState];
      statusBadge.className = badge;
      statusBadge.textContent = label;
    }
    if (pauseBtn) pauseBtn.textContent = demoState === "paused" ? "恢复" : "暂停";
    if (stopBtn) stopBtn.classList.toggle("is-off", demoState === "stopped");
  }
  if (pauseBtn) {
    pauseBtn.addEventListener("click", function () {
      demoState = demoState === "paused" ? "run" : "paused";
      renderDemoState();
    });
  }
  if (stopBtn) {
    stopBtn.addEventListener("click", function () {
      demoState = demoState === "stopped" ? "run" : "stopped";
      renderDemoState();
    });
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
