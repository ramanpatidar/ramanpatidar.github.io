const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector(".nav-menu");
const navLinks = document.querySelectorAll(".nav-link");

if (navToggle && navMenu) {
  navToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("open");
    document.body.classList.toggle("nav-open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("open");
      document.body.classList.remove("nav-open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

const sections = document.querySelectorAll(".nav-section[id]");

if ("IntersectionObserver" in window && sections.length) {
  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const activeLink = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
        if (!activeLink) return;

        navLinks.forEach((link) => link.classList.remove("active"));
        activeLink.classList.add("active");
      });
    },
    {
      root: null,
      threshold: 0.35,
      rootMargin: "-20% 0px -45% 0px",
    }
  );

  sections.forEach((section) => navObserver.observe(section));
}

const faqItems = document.querySelectorAll(".faq-item");

faqItems.forEach((item) => {
  const button = item.querySelector(".faq-question");
  const icon = button ? button.querySelector("b") : null;

  if (!button || !icon) return;

  button.addEventListener("click", () => {
    const willOpen = !item.classList.contains("open");

    faqItems.forEach((otherItem) => {
      const otherButton = otherItem.querySelector(".faq-question");
      const otherIcon = otherItem.querySelector("b");

      otherItem.classList.remove("open");
      if (otherButton) otherButton.setAttribute("aria-expanded", "false");
      if (otherIcon) otherIcon.textContent = "+";
    });

    item.classList.toggle("open", willOpen);
    button.setAttribute("aria-expanded", String(willOpen));
    icon.textContent = willOpen ? "-" : "+";
  });
});

const testimonialTrack = document.querySelector("#testimonials .testimonial-track");
const testimonialCards = document.querySelectorAll("#testimonials .testimonial-card");
const prevTestimonial = document.querySelector(".prev-testimonial");
const nextTestimonial = document.querySelector(".next-testimonial");
let testimonialIndex = 0;

function updateTestimonials() {
  if (!testimonialTrack || !testimonialCards.length) return;
  testimonialTrack.style.transform = `translateX(-${testimonialIndex * 100}%)`;
}

if (prevTestimonial && nextTestimonial && testimonialCards.length) {
  prevTestimonial.addEventListener("click", () => {
    testimonialIndex =
      testimonialIndex === 0 ? testimonialCards.length - 1 : testimonialIndex - 1;
    updateTestimonials();
  });

  nextTestimonial.addEventListener("click", () => {
    testimonialIndex = (testimonialIndex + 1) % testimonialCards.length;
    updateTestimonials();
  });
}

const counters = document.querySelectorAll(".counter");
const aboutSection = document.querySelector("#about");
let countersStarted = false;

function animateCounter(counter) {
  const target = Number(counter.dataset.target || 0);
  const prefix = counter.dataset.prefix || "";
  const suffix = counter.dataset.suffix || "";
  const decimals = Number(counter.dataset.decimals || 0);
  const duration = 1300;
  const startTime = performance.now();
  const formatter = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  function tick(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const easedProgress = 1 - Math.pow(1 - progress, 3);
    const value = easedProgress * target;
    counter.textContent = `${prefix}${formatter.format(value)}${suffix}`;

    if (progress < 1) {
      requestAnimationFrame(tick);
    } else {
      counter.textContent = `${prefix}${formatter.format(target)}${suffix}`;
    }
  }

  requestAnimationFrame(tick);
}

if ("IntersectionObserver" in window && aboutSection && counters.length) {
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting || countersStarted) return;
        countersStarted = true;
        counters.forEach(animateCounter);
        counterObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.35 }
  );

  counterObserver.observe(aboutSection);
}

const priceCards = document.querySelectorAll(".price-card");

function selectPriceCard(selectedCard) {
  priceCards.forEach((card) => {
    const isSelected = card === selectedCard;
    card.classList.toggle("selected", isSelected);
    card.setAttribute("aria-pressed", String(isSelected));
  });
}

priceCards.forEach((card) => {
  card.addEventListener("click", () => {
    selectPriceCard(card);
  });

  card.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    selectPriceCard(card);
  });
});

const contactForm = document.querySelector(".contact-form");

if (contactForm) {
  const message = contactForm.querySelector(".form-message");

  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (message) {
      message.textContent = "Thanks! Your message has been submitted.";
    }

    contactForm.reset();
  });
}

const footerNewsletter = document.querySelector(".footer-newsletter form");

if (footerNewsletter) {
  footerNewsletter.addEventListener("submit", (event) => {
    event.preventDefault();
    footerNewsletter.reset();
  });
}
