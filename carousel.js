document.addEventListener("DOMContentLoaded", () => {
  const slides = Array.from(document.querySelectorAll(".carousel__slide"));
  const prevBtn = document.querySelector(".carousel__button--prev");
  const nextBtn = document.querySelector(".carousel__button--next");
  const closeBtn = document.querySelector(".carousel__close");
  const carousel = document.querySelector(".carousel");
  let current = 0;

  function updateSlides(newIndex) {
    slides[current].classList.remove("active");
    current = (newIndex + slides.length) % slides.length;
    const nextSlide = slides[current];
    nextSlide.style.animation = "none";
    nextSlide.offsetHeight;
    nextSlide.style.animation = "";
    nextSlide.classList.add("active");
  }

  // Prev/Next
  prevBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    updateSlides(current - 1);
  });
  nextBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    updateSlides(current + 1);
  });

  // Fullscreen toggle
  carousel.addEventListener("click", async (e) => {
    if (
      e.target.closest(".carousel__button") ||
      e.target.closest(".carousel__close")
    )
      return;
    if (!document.fullscreenElement) {
      try {
        await carousel.requestFullscreen();
        if (screen.orientation && screen.orientation.lock) {
          await screen.orientation.lock("landscape");
        }
      } catch (err) {
        console.warn("Fullscreen/orientation lock failed:", err);
      }
      carousel.classList.add("is-fullscreen", "rotate-landscape");
    } else {
      exitCarouselFullscreen();
    }
  });

  // Close button
  closeBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    exitCarouselFullscreen();
  });

  // Clean up on fullscreen exit (Esc or API)
  document.addEventListener("fullscreenchange", () => {
    if (document.fullscreenElement !== carousel) {
      carousel.classList.remove("is-fullscreen", "rotate-landscape");
      unlockOrientation();
    }
  });

  // Keyboard nav (only in fullscreen)
  document.addEventListener("keydown", (e) => {
    if (document.fullscreenElement !== carousel) return;
    if (e.key === "ArrowLeft") updateSlides(current - 1);
    if (e.key === "ArrowRight") updateSlides(current + 1);
    if (e.key === "Escape") exitCarouselFullscreen();
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

  // Helper: exit fullscreen + cleanup classes + unlock orientation
  async function exitCarouselFullscreen() {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
    } catch (err) {
      console.warn("Exit fullscreen failed:", err);
    }
    carousel.classList.remove("is-fullscreen", "rotate-landscape");
    unlockOrientation();
  }

  // Helper: unlock screen orientation if supported
  function unlockOrientation() {
    if (screen.orientation && screen.orientation.unlock) {
      try {
        screen.orientation.unlock();
      } catch (err) {
        console.warn("Orientation unlock failed:", err);
      }
    }
  }
});
