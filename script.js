const root = document.documentElement;
const siteHeader = document.querySelector(".site-header");
const themeToggle = document.getElementById("theme-toggle");
const themeLabel = document.getElementById("theme-label");
const themeColorMeta = document.getElementById("theme-color-meta");
const typingTarget = document.getElementById("typing-text");
const revealNodes = document.querySelectorAll("[data-reveal]");
const tiltNodes = document.querySelectorAll(".tilt-card");
const navLinks = document.querySelectorAll("[data-nav-link]");
const sections = document.querySelectorAll("[data-section]");
const scrollProgressBar = document.getElementById("scroll-progress-bar");
const backToTopButton = document.getElementById("back-to-top");
const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
const themeQuery = window.matchMedia("(prefers-color-scheme: light)");

const rolePhrases = [
  "Teen Developer",
  "Web Developer",
  "Python | AI Enthusiast"
];

const savedTheme = localStorage.getItem("govind-theme");
const initialTheme = savedTheme || (themeQuery.matches ? "light" : "dark");

function applyTheme(theme) {
  root.dataset.theme = theme;
  themeToggle.checked = theme === "light";
  themeLabel.textContent = theme === "light" ? "Light mode" : "Dark mode";

  if (themeColorMeta) {
    themeColorMeta.setAttribute("content", theme === "light" ? "#f3f8ff" : "#050816");
  }
}

applyTheme(initialTheme);

themeToggle.addEventListener("change", () => {
  const nextTheme = themeToggle.checked ? "light" : "dark";
  localStorage.setItem("govind-theme", nextTheme);
  applyTheme(nextTheme);
});

themeQuery.addEventListener("change", (event) => {
  if (localStorage.getItem("govind-theme")) {
    return;
  }

  applyTheme(event.matches ? "light" : "dark");
});

if (!reducedMotionQuery.matches && typingTarget) {
  let phraseIndex = 0;
  let characterIndex = 0;
  let isDeleting = false;

  const typeLoop = () => {
    const currentPhrase = rolePhrases[phraseIndex];

    if (isDeleting) {
      characterIndex -= 1;
    } else {
      characterIndex += 1;
    }

    typingTarget.textContent = currentPhrase.slice(0, characterIndex);

    let delay = isDeleting ? 45 : 95;

    if (!isDeleting && characterIndex === currentPhrase.length) {
      delay = 1600;
      isDeleting = true;
    } else if (isDeleting && characterIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % rolePhrases.length;
      delay = 260;
    }

    window.setTimeout(typeLoop, delay);
  };

  typingTarget.textContent = "";
  window.setTimeout(typeLoop, 320);
} else if (typingTarget) {
  typingTarget.textContent = rolePhrases.join(" | ");
}

if (!reducedMotionQuery.matches && revealNodes.length) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.18,
      rootMargin: "0px 0px -8% 0px"
    }
  );

  revealNodes.forEach((node) => revealObserver.observe(node));
} else {
  revealNodes.forEach((node) => node.classList.add("is-visible"));
}

if (!reducedMotionQuery.matches && window.matchMedia("(pointer: fine)").matches) {
  tiltNodes.forEach((card) => {
    const resetTilt = () => {
      card.style.transform = "";
    };

    card.addEventListener("mousemove", (event) => {
      const rect = card.getBoundingClientRect();
      const offsetX = event.clientX - rect.left;
      const offsetY = event.clientY - rect.top;
      const rotateY = ((offsetX / rect.width) - 0.5) * 14;
      const rotateX = ((offsetY / rect.height) - 0.5) * -14;

      card.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener("mouseleave", resetTilt);
    card.addEventListener("blur", resetTilt, true);
  });
}

document.addEventListener("pointermove", (event) => {
  root.style.setProperty("--pointer-x", `${event.clientX}px`);
  root.style.setProperty("--pointer-y", `${event.clientY}px`);
});

function updateScrollUI() {
  const scrollTop = window.scrollY;
  const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;

  if (scrollProgressBar) {
    scrollProgressBar.style.width = `${Math.max(0, Math.min(100, progress))}%`;
  }

  if (siteHeader) {
    siteHeader.classList.toggle("is-scrolled", scrollTop > 24);
  }

  if (backToTopButton) {
    backToTopButton.classList.toggle("is-visible", scrollTop > 520);
  }

  if (!navLinks.length || !sections.length) {
    return;
  }

  let activeId = "";

  sections.forEach((section) => {
    const rect = section.getBoundingClientRect();

    if (rect.top <= 180 && rect.bottom >= 180) {
      activeId = section.id;
    }
  });

  navLinks.forEach((link) => {
    const isActive = link.getAttribute("href") === `#${activeId}`;
    link.classList.toggle("is-active", isActive);

    if (isActive) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

window.addEventListener("scroll", updateScrollUI, { passive: true });
window.addEventListener("resize", updateScrollUI);
updateScrollUI();

if (backToTopButton) {
  backToTopButton.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: reducedMotionQuery.matches ? "auto" : "smooth" });
  });
}

document.getElementById("year").textContent = new Date().getFullYear();

const canvas = document.getElementById("particle-canvas");

if (canvas && !reducedMotionQuery.matches) {
  const context = canvas.getContext("2d");
  const particles = [];
  let animationFrame = 0;

  const config = {
    count: 0,
    maxDistance: 110
  };

  function resizeCanvas() {
    const scale = window.devicePixelRatio || 1;
    canvas.width = Math.floor(window.innerWidth * scale);
    canvas.height = Math.floor(window.innerHeight * scale);
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    context.setTransform(scale, 0, 0, scale, 0, 0);

    config.count = Math.min(80, Math.max(34, Math.floor(window.innerWidth / 24)));
    particles.length = 0;

    for (let index = 0; index < config.count; index += 1) {
      particles.push(createParticle());
    }
  }

  function createParticle() {
    const speed = Math.random() * 0.35 + 0.08;

    return {
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * speed,
      vy: (Math.random() - 0.5) * speed,
      size: Math.random() * 2.2 + 0.6,
      alpha: Math.random() * 0.4 + 0.25
    };
  }

  function drawParticles() {
    context.clearRect(0, 0, window.innerWidth, window.innerHeight);

    particles.forEach((particle, index) => {
      particle.x += particle.vx;
      particle.y += particle.vy;

      if (particle.x < -20 || particle.x > window.innerWidth + 20) {
        particle.vx *= -1;
      }

      if (particle.y < -20 || particle.y > window.innerHeight + 20) {
        particle.vy *= -1;
      }

      context.beginPath();
      context.fillStyle = `rgba(118, 228, 255, ${particle.alpha})`;
      context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      context.fill();

      for (let siblingIndex = index + 1; siblingIndex < particles.length; siblingIndex += 1) {
        const sibling = particles[siblingIndex];
        const dx = particle.x - sibling.x;
        const dy = particle.y - sibling.y;
        const distance = Math.hypot(dx, dy);

        if (distance > config.maxDistance) {
          continue;
        }

        const opacity = 1 - distance / config.maxDistance;
        context.beginPath();
        context.strokeStyle = `rgba(116, 163, 255, ${opacity * 0.18})`;
        context.lineWidth = 1;
        context.moveTo(particle.x, particle.y);
        context.lineTo(sibling.x, sibling.y);
        context.stroke();
      }
    });

    animationFrame = window.requestAnimationFrame(drawParticles);
  }

  resizeCanvas();
  drawParticles();

  window.addEventListener("resize", () => {
    window.cancelAnimationFrame(animationFrame);
    resizeCanvas();
    drawParticles();
  });
}
