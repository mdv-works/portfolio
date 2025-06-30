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

  prevBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    updateSlides(current - 1);
  });
  nextBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    updateSlides(current + 1);
  });

  // Fullscreen toggle + always add our rotate fallback
  carousel.addEventListener("click", async (e) => {
    if (e.target.closest(".carousel__button")) return;

    if (!document.fullscreenElement) {
      try {
        await carousel.requestFullscreen();
        // try native lock, but we’ll always add the class as a fallback
        if (screen.orientation && screen.orientation.lock) {
          await screen.orientation.lock("landscape");
        }
      } catch (err) {
        console.warn("Fullscreen/orientation lock failed:", err);
      }
      carousel.classList.add("is-fullscreen", "rotate-landscape");
    } else {
      try {
        await document.exitFullscreen();
      } catch (err) {
        console.warn("Exit fullscreen failed:", err);
      }
    }
  });

  // Clean up when exiting fullscreen
  document.addEventListener("fullscreenchange", () => {
    if (document.fullscreenElement !== carousel) {
      carousel.classList.remove("is-fullscreen", "rotate-landscape");
      // unlock orientation if supported
      if (screen.orientation && screen.orientation.unlock) {
        screen.orientation.unlock();
      }
    }
  });

  // Keyboard navigation (only in fullscreen)
  document.addEventListener("keydown", (e) => {
    if (document.fullscreenElement !== carousel) return;
    if (e.key === "ArrowLeft") updateSlides(current - 1);
    if (e.key === "ArrowRight") updateSlides(current + 1);
  });

  // Touch swipe
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
});
