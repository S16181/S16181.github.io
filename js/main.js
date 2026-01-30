// Footer year
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

/**
 * Simple Carousel
 * - supports multiple carousels on a page
 * - next/prev buttons
 * - dots
 * - optional auto-rotate
 */
function initCarousel(root) {
  const track = root.querySelector(".carousel-track");
  const slides = Array.from(root.querySelectorAll(".slide"));
  const btnPrev = root.querySelector("[data-prev]");
  const btnNext = root.querySelector("[data-next]");
  const dotsWrap = root.querySelector(".dots");

  if (!track || slides.length === 0) return;

  let index = 0;

  // Build dots
  if (dotsWrap) {
    dotsWrap.innerHTML = "";
    slides.forEach((_, i) => {
      const dot = document.createElement("button");
      dot.className = "dot" + (i === 0 ? " active" : "");
      dot.type = "button";
      dot.setAttribute("aria-label", `Go to slide ${i + 1}`);
      dot.addEventListener("click", () => goTo(i));
      dotsWrap.appendChild(dot);
    });
  }

  function update() {
    track.style.transform = `translateX(-${index * 100}%)`;

    const dots = dotsWrap ? Array.from(dotsWrap.querySelectorAll(".dot")) : [];
    dots.forEach((d, i) => d.classList.toggle("active", i === index));
  }

  function goTo(i) {
    index = (i + slides.length) % slides.length;
    update();
  }

  btnPrev?.addEventListener("click", () => goTo(index - 1));
  btnNext?.addEventListener("click", () => goTo(index + 1));

  // Optional auto-rotate
  const auto = root.getAttribute("data-auto");
  const intervalMs = Number(root.getAttribute("data-interval") || "6000");

  let timer = null;
  function startAuto() {
    if (auto !== "true") return;
    stopAuto();
    timer = setInterval(() => goTo(index + 1), intervalMs);
  }
  function stopAuto() {
    if (timer) clearInterval(timer);
    timer = null;
  }

  root.addEventListener("mouseenter", stopAuto);
  root.addEventListener("mouseleave", startAuto);

  // Keyboard accessibility
  root.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") goTo(index - 1);
    if (e.key === "ArrowRight") goTo(index + 1);
  });

  update();
  startAuto();
}

document.querySelectorAll("[data-carousel]").forEach(initCarousel);

/**
 * Parallax banner backgrounds
 * - Elements should have: data-parallax
 * - Optional: data-strength (default 0.25)
 *
 * We adjust background-position-y as you scroll.
 */
(function initParallaxBanners() {
  const els = Array.from(document.querySelectorAll("[data-parallax]"));
  if (els.length === 0) return;

  function updateParallax() {
    const vh = window.innerHeight || 800;

    for (const el of els) {
      const rect = el.getBoundingClientRect();
      const strength = Number(el.getAttribute("data-strength") || "0.25");

      // progress: element midpoint relative to viewport midpoint
      const elMid = rect.top + rect.height / 2;
      const viewMid = vh / 2;
      const delta = (elMid - viewMid) * strength;

      // base of 50% plus delta
      el.style.backgroundPosition = `center calc(50% + ${delta}px)`;
    }
  }

  let ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(() => {
      updateParallax();
      ticking = false;
    });
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);

  // initial
  updateParallax();
})();
