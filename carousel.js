document.addEventListener("DOMContentLoaded", () => {
  const slides = Array.from(document.querySelectorAll(".carousel__slide"));
  const prevBtn = document.querySelector(".carousel__button--prev");
  const nextBtn = document.querySelector(".carousel__button--next");
  const carousel = document.querySelector(".carousel");
  let current = 0;

  function updateSlides(newIndex) {
    slides[current].classList.remove("active");
    current = (newIndex + slides.length) % slides.length;
    const nextSlide = slides[current];
    nextSlide.style.animation = "none"; // reset animation
    nextSlide.offsetHeight; // force reflow
    nextSlide.style.animation = ""; // re-trigger it
    nextSlide.classList.add("active");
  }

  // Prev/Next buttons still work on all devices:
  prevBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    updateSlides(current - 1);
  });
  nextBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    updateSlides(current + 1);
  });

  carousel.addEventListener("click", async (e) => {
    // don’t fullscreen on phones (≤600px) or on portrait tablets (≤1200px + portrait)
    const w = window.innerWidth;
    const h = window.innerHeight;
    const isPortrait = h > w;
    if (w <= 600 || (w <= 1200 && isPortrait)) {
      return;
    }

    if (e.target.closest(".carousel__button")) return;

    if (!document.fullscreenElement) {
      try {
        await carousel.requestFullscreen();
        if (screen.orientation && screen.orientation.lock) {
          await screen.orientation.lock("landscape");
        }
      } catch (err) {
        console.warn("Fullscreen/orientation lock failed:", err);
      }
    } else {
      try {
        await document.exitFullscreen();
      } catch (err) {
        console.warn("Exit fullscreen failed:", err);
      }
    }
  });

  // Keep your is-fullscreen class toggling
  document.addEventListener("fullscreenchange", () => {
    if (document.fullscreenElement === carousel) {
      carousel.classList.add("is-fullscreen");
    } else {
      carousel.classList.remove("is-fullscreen");
      if (screen.orientation && screen.orientation.unlock) {
        screen.orientation.unlock();
      }
    }
  });

  // Keyboard nav (fullscreen only)
  document.addEventListener("keydown", (e) => {
    if (document.fullscreenElement !== carousel) return;
    if (e.key === "ArrowLeft") updateSlides(current - 1);
    if (e.key === "ArrowRight") updateSlides(current + 1);
  });

  // Swipe nav (all devices)
  let touchStartX = 0;
  carousel.addEventListener(
    "touchstart",
    (e) => {
      touchStartX = e.changedTouches[0].screenX;
    },
    { passive: true }
  );
  carousel.addEventListener(
    "touchend",
    (e) => {
      const diffX = e.changedTouches[0].screenX - touchStartX;
      if (Math.abs(diffX) > 50) {
        diffX > 0 ? updateSlides(current - 1) : updateSlides(current + 1);
      }
    },
    { passive: true }
  );

  // Close‐button in fullscreen
  const closeBtn = document.querySelector(".carousel__close");
  closeBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(console.error);
    }
  });
});
