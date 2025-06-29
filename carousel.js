document.addEventListener('DOMContentLoaded', () => {
  const slides = Array.from(document.querySelectorAll('.carousel__slide'));
  const prevBtn = document.querySelector('.carousel__button--prev');
  const nextBtn = document.querySelector('.carousel__button--next');
  let current = 0;

  function updateSlides(newIndex) {
    slides[current].classList.remove('active');
    current = (newIndex + slides.length) % slides.length;
    slides[current].classList.add('active');
  }

  prevBtn.addEventListener('click', () => updateSlides(current - 1));
  nextBtn.addEventListener('click', () => updateSlides(current + 1));
});
