const menuButton = document.querySelector(".menu-button");
const navLinks = document.querySelectorAll(".primary-nav a");

menuButton?.addEventListener("click", () => {
  const isOpen = document.body.classList.toggle("nav-open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
  menuButton.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    document.body.classList.remove("nav-open");
    menuButton?.setAttribute("aria-expanded", "false");
    menuButton?.setAttribute("aria-label", "Open navigation menu");
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  document.body.classList.remove("nav-open");
  menuButton?.setAttribute("aria-expanded", "false");
  menuButton?.setAttribute("aria-label", "Open navigation menu");
});

document.querySelectorAll(".faq-item").forEach((item) => {
  const question = item.querySelector(".faq-question");
  const answer = item.querySelector(".faq-answer");
  const icon = item.querySelector(".faq-question img");

  question?.addEventListener("click", () => {
    const isOpen = item.classList.toggle("faq-item--open");
    question.setAttribute("aria-expanded", String(isOpen));
    if (answer) answer.hidden = !isOpen;
    if (icon) {
      icon.src = isOpen ? "./assets/new-design/faq-chevron-up.svg" : "./assets/new-design/faq-chevron-down.svg";
    }
  });
});

const setupCardCarousel = (carousel, trackSelector, slideSelector) => {
  const track = carousel.querySelector(trackSelector);
  const slides = Array.from(carousel.querySelectorAll(slideSelector));
  const dots = Array.from(carousel.querySelectorAll(".service-carousel__dots span"));
  const previousButton = carousel.querySelector("[data-service-prev], [data-carousel-prev]");
  const nextButton = carousel.querySelector("[data-service-next], [data-carousel-next]");
  let activeIndex = 0;

  const updateDots = () => {
    dots.forEach((dot, index) => {
      dot.classList.toggle("is-active", index === activeIndex);
    });
  };

  const goToSlide = (index) => {
    if (!track || slides.length === 0) return;
    activeIndex = (index + slides.length) % slides.length;
    slides[activeIndex].scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    updateDots();
  };

  previousButton?.addEventListener("click", () => goToSlide(activeIndex - 1));
  nextButton?.addEventListener("click", () => goToSlide(activeIndex + 1));

  track?.addEventListener("scroll", () => {
    if (slides.length === 0) return;
    const trackCenter = track.scrollLeft + track.clientWidth / 2;
    const nearestIndex = slides.reduce((nearest, slide, index) => {
      const slideCenter = slide.offsetLeft + slide.clientWidth / 2;
      const nearestSlide = slides[nearest];
      const nearestCenter = nearestSlide.offsetLeft + nearestSlide.clientWidth / 2;
      return Math.abs(slideCenter - trackCenter) < Math.abs(nearestCenter - trackCenter) ? index : nearest;
    }, activeIndex);

    if (nearestIndex !== activeIndex) {
      activeIndex = nearestIndex;
      updateDots();
    }
  }, { passive: true });
};

document.querySelectorAll(".service-carousel").forEach((carousel) => {
  setupCardCarousel(carousel, ".service-showcase", ".service-slide");
});

document.querySelectorAll(".care-carousel").forEach((carousel) => {
  setupCardCarousel(carousel, ".care-showcase", ".care-card");
});
