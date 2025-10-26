// script.js

document.addEventListener("DOMContentLoaded", () => {
  const body = document.querySelector("body");

  /* ================= Fade-in page au chargement ================= */
  body.classList.add("fade-in");

  /* ================= Smooth scroll pour ancres internes ================= */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if(target){
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  /* ================= Fade-out pour liens vers autre page ================= */
  document.querySelectorAll('a[href$=".html"]').forEach(link => {
    // Ignorer les liens internes à la page (ancres), boutons et cartes
    if (link.getAttribute('href').startsWith('#') || 
        link.classList.contains('btn') ||
        link.closest('.card') ||
        link.closest('.project-gallery') ||
        link.classList.contains('social-link')) return;

    link.addEventListener('click', e => {
      e.preventDefault();
      body.classList.remove('fade-in');
      body.classList.add('fade-out');

      setTimeout(() => {
        window.location.href = link.href;
      }, 600);
    });
  });

  /* ================= Apparition des sections au scroll ================= */
  const sections = document.querySelectorAll('section');
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add('show');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  sections.forEach(section => {
    section.classList.add('hidden');
    observer.observe(section);
  });

  /* ================= Bouton retour en haut ================= 
  const backToTop = document.createElement('div');
  backToTop.innerHTML = '⬆';
  backToTop.classList.add('back-to-top');
  document.body.appendChild(backToTop);

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  window.addEventListener('scroll', () => {
    if(window.scrollY > 300){
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  }); */

  /* ================= Vidéo background ================= */
  const bgVideo = document.getElementById("bg-video");
  if(bgVideo){
    window.addEventListener('scroll', () => {
      const scrollPos = window.scrollY;
      bgVideo.style.filter = scrollPos > 80 ? 'blur(0px) brightness(100%)' : 'blur(6px) brightness(50%)';
    });
  }

  // ====================== Lightbox + décalage vidéo et titre ======================
const lightbox = document.getElementById("lightbox");
if (lightbox) {
  const lightboxImg = lightbox.querySelector("img");
  const galleryImgs = document.querySelectorAll(".project-gallery img");
  const videoWrapper = document.querySelector("#video-projet-wrapper .video-container");

  galleryImgs.forEach(img => {
    img.addEventListener('click', () => {
      lightboxImg.src = img.src;
      lightbox.classList.add('active');
      document.body.classList.add("no-scroll");

      if(videoWrapper){
        videoWrapper.style.transform = "translateY(300px)"; // déplace titre + vidéo ensemble
      }
    });
  });

  lightbox.addEventListener('click', () => {
    lightbox.classList.remove('active');
    document.body.classList.remove("no-scroll");

    if(videoWrapper){
      videoWrapper.style.transform = "translateY(0)"; // remet à la place
    }
  });
}


  /* ================= Hover cartes projets (zoom + overlay) ================= */
  const cards = document.querySelectorAll('.card');
  cards.forEach(card => {
    const img = card.querySelector('img');
    const overlay = card.querySelector('.overlay');

    card.addEventListener('mouseenter', () => {
      if(img) img.style.transform = "scale(1.1)";
      if(overlay) overlay.style.transform = "translateY(0)";
    });

    card.addEventListener('mouseleave', () => {
      if(img) img.style.transform = "scale(1)";
      if(overlay) overlay.style.transform = "translateY(100%)";
    });
  });
});

// Background lines animées responsives avec gradient
const canvas = document.getElementById("background-lines");
if (canvas) {
	
}
const ctx = canvas.getContext("2d");

let lines = [];
const numLines = 50; // nombre total de lignes
const sideWidthRatio = 0.17; // pourcentage de largeur d'écran utilisée sur chaque côté
let mouseX = 0, mouseY = 0;

// Fonction pour ajuster le canvas
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  regenerateLines(); // régénérer les lignes à la bonne position
}
window.addEventListener("resize", resizeCanvas);

// Génération dynamique des lignes
function regenerateLines() {
  lines = [];
  const sideWidth = canvas.width * sideWidthRatio;

  for (let i = 0; i < numLines; i++) {
    const side = Math.random() < 0.5 ? "left" : "right";
    const x =
      side === "left"
        ? Math.random() * sideWidth
        : canvas.width - sideWidth + Math.random() * sideWidth;
    const y = Math.random() * canvas.height;

    lines.push({
      x,
      y,
      side,
      length: 50 + Math.random() * 150,
      speed: 0.2 + Math.random() * 0.5,
      swayRange: 5 + Math.random() * 15,
      offset: Math.random() * Math.PI * 2,
      width: 1 + Math.random() * 3,
      colorStart: `rgba(255,255,255,${0.05 + Math.random() * 0.1})`,
      colorEnd: `rgba(135,206,235,0)`,
    });
  }
}

resizeCanvas();

// Interaction souris
window.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

// Animation
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const sideWidth = canvas.width * sideWidthRatio;

  lines.forEach((line) => {
    const sway = Math.sin(Date.now() * 0.001 + line.offset) * line.swayRange;

    const dx =
      (line.side === "left" && mouseX < sideWidth
        ? (mouseX - line.x) * 0.01
        : 0) +
      (line.side === "right" && mouseX > canvas.width - sideWidth
        ? (mouseX - line.x) * 0.01
        : 0);
    const dy = (mouseY - line.y) * 0.005;

    const grad = ctx.createLinearGradient(
      0,
      line.y + dy,
      0,
      line.y + line.length + dy
    );
    grad.addColorStop(1, line.colorStart);
    grad.addColorStop(0, line.colorEnd);

    ctx.beginPath();
    ctx.moveTo(line.x + sway + dx, line.y + dy);
    ctx.lineTo(line.x + sway + dx, line.y + line.length + dy);
    ctx.strokeStyle = grad;
    ctx.lineWidth = line.width;
    ctx.lineCap = "round";
    ctx.stroke();

    line.y += line.speed;
    if (line.y > canvas.height) line.y = -line.length;
  });

  requestAnimationFrame(animate);
}

animate();


// script.js — Traduction FR/EN robuste (déléguation + debug)
(function () {
  const translations = {
    fr: {
      nav_home: "Accueil",
      nav_projects: "Projets",
      nav_services: "Services",
      nav_contact: "Contact",
      hero_title: "Quentin Delys",
      hero_subtitle: "Artiste 3D · Motion Designer · VFX",
      btn_projects: "Projets",
      section_pro: "Productions",
      section_perso: "Projets personnels",
      contact_title: "Contact",
      about_title: "À propos",
      about_text: `Freelance depuis 3 ans, je me suis spécialisé dans la création de contenus vidéo
(3D – Motion) dans le domaine de l'événementiel et j’ai eu la chance de participer à certains des plus grands shows techniques au monde, classés parmi les méga-événements internationaux.
Je travaille en tant que généraliste 3D, tout en explorant
le motion design, le temps réel, le compositing et les VFX.<br><br>
Polyvalent, je touche à beaucoup de choses que ce soit en matière de contenu ou de logiciels. Mes collaborations m’ont permis de partir à l'internationnal et de découvrir de nouvelles cultures,
une source d’inspiration constante pour ma créativité et ma vision artistique.<br><br>

Tout aussi motivé que passionné, je suis ouvert à de nouvelles collaborations —
n’hésitez pas à me contacter pour échanger autour de vos futur projets !`,
      service1_title: "🎬 Contenu vidéo & Motion Design",
      service1_text: "Création de visuels impactants pour événements, clips et campagnes digitales.",
      service2_title: "🖥️ 3D Generalist - Hardsurface & Animation",
      service2_text: "Modeling, texturing, lighting-rendering, animation procédurale (Geometry Nodes), animation traditionnelle - rigging.",
      service3_title: "🖥️ Environnement 3D & Simulation FX",
      service3_text: "Création d'assets, mise en place d'environnements 3D - Physics Sim. (Clothes / Smoke - Fire / Water / Particle Systems).",
      service4_title: "🖥️ Concept 3D - 2D",
      service4_text: "Réalisation de concepts en 3D à partir d'une référence 2D, alliant technique et créativité.",
      service5_title: "🎤 Contenu pour Événements Live",
      service5_text: "Visuels immersifs / Video Mapping / VFX / Architecture."
    },
    en: {
      nav_home: "Home",
      nav_projects: "Projects",
      nav_services: "Services",
      nav_contact: "Contact",
      hero_title: "Quentin Delys",
      hero_subtitle: "3D Artist · Motion Designer · VFX",
      btn_projects: "Projects",
      section_pro: "Productions",
      section_perso: "Personal Projects",
      contact_title: "Contact",
      about_title: "About",
      about_text: `Freelance for 3 years, I specialized in creating video content (3D – Motion) for the event industry and had the opportunity to take part in some of the largest technical shows in the world, ranked among major international events.
I work as a 3D generalist, while exploring motion design, realtime, compositing and VFX.<br><br>
I am versatile and have experience in many areas, whether in terms of content or software. My collaborations have taken me abroad and allowed me to discover new cultures — a constant source of inspiration for my creativity and artistic vision.<br><br>
Passionate and always motivated, I’m open to new collaborations — feel free to contact me to discuss your projects!`,
      service1_title: "🎬 Video Content & Motion Design",
      service1_text: "Creation of impactful visuals for events, music videos, and digital campaigns.",
      service2_title: "🖥️ 3D Generalist - Hardsurface & Animation",
      service2_text: "Modeling, texturing, lighting-rendering, procedural animation (Geometry Nodes), traditional animation - rigging.",
      service3_title: "🖥️ 3D Environment & FX Simulation",
      service3_text: "Asset creation, environment setup, and 3D physics simulations (Cloth / Smoke / Fire / Water / Particle Systems).",
      service4_title: "🖥️ 3D - 2D Concept",
      service4_text: "Creation of 3D concepts from 2D references, blending technique and creativity.",
      service5_title: "🎤 Live Event Content",
      service5_text: "Immersive visuals / Video Mapping / VFX / Architecture."
    }
  };

  // applique les traductions (innerHTML pour conserver <br> et emojis)
  function applyTranslations(lang) {
    const nodes = document.querySelectorAll("[data-translate]");
    let changed = 0, missing = [];
    nodes.forEach(node => {
      const key = node.getAttribute("data-translate");
      if (!key) return;
      const value = translations[lang] && translations[lang][key];
      if (value !== undefined) {
        node.innerHTML = value;
        changed++;
      } else {
        missing.push(key);
      }
    });
    console.log(`[i18n] applyTranslations("${lang}") → updated ${changed} nodes.${missing.length ? " Missing keys: "+missing.join(", ") : ""}`);
    // toggle active state on buttons
    document.querySelectorAll("[data-lang]").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.lang === lang);
    });
    localStorage.setItem("siteLang", lang);
  }
  

  // délégation : capture tous les clicks et détecte les boutons [data-lang]
  function initDelegatedLanguageClicks() {
    document.body.addEventListener("click", (ev) => {
      const btn = ev.target.closest("[data-lang]");
      if (!btn) return; // click non lié à langage
      ev.preventDefault();
      const lang = btn.dataset.lang;
      if (!lang) {
        console.warn("[i18n] data-lang vide");
        return;
      }
      console.log("[i18n] language button clicked:", lang, btn);
      applyTranslations(lang);
    }, true); // true pour capturer tôt (optionnel)
  }

  // init à DOMContentLoaded
  document.addEventListener("DOMContentLoaded", () => {
    initDelegatedLanguageClicks();
    // appliquer langue sauvegardée ou défaut FR
    const saved = localStorage.getItem("siteLang") || "fr";
    applyTranslations(saved);
    console.log("[i18n] initialized, language:", saved);
  });

  // Export en dev (optionnel)
  window.__i18n = { applyTranslations, translations };
})();
