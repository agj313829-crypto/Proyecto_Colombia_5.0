// =========================
// CURSOR PERSONALIZADO
// =========================

const cursor     = document.createElement('div');
const cursorRing = document.createElement('div');
cursor.className     = 'cursor';
cursorRing.className = 'cursor-ring';
document.body.appendChild(cursor);
document.body.appendChild(cursorRing);

let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';
});

// El anillo sigue con suavidad
function animateRing(){
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    cursorRing.style.left = rx + 'px';
    cursorRing.style.top  = ry + 'px';
    requestAnimationFrame(animateRing);
}
animateRing();

// Cursor crece al pasar sobre links/botones
document.querySelectorAll('a, button, .img-row img, .keyword-tags span').forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursorRing.style.transform = 'translate(-50%,-50%) scale(2)';
        cursorRing.style.borderColor = 'var(--neon)';
        cursorRing.style.background = 'rgba(57,255,20,0.06)';
    });
    el.addEventListener('mouseleave', () => {
        cursorRing.style.transform = 'translate(-50%,-50%) scale(1)';
        cursorRing.style.borderColor = 'rgba(57,255,20,0.5)';
        cursorRing.style.background = 'transparent';
    });
});


// =========================
// PARTÍCULAS DE FONDO
// =========================

const canvas = document.createElement('div');
canvas.id = 'particles';
document.body.prepend(canvas);

function createParticle(){
    const p = document.createElement('div');
    p.className = 'particle';
    const size  = Math.random() * 4 + 2;
    const isNeon = Math.random() > 0.5;
    p.style.cssText = `
        width:${size}px;
        height:${size}px;
        left:${Math.random()*100}vw;
        background:${isNeon ? '#39ff14' : '#8a2be2'};
        animation-duration:${Math.random()*12+8}s;
        animation-delay:${Math.random()*8}s;
        box-shadow:0 0 ${size*2}px ${isNeon ? '#39ff14' : '#8a2be2'};
    `;
    canvas.appendChild(p);
    setTimeout(() => p.remove(), 22000);
}

setInterval(createParticle, 600);
for(let i=0; i<12; i++) createParticle();


// =========================
// NAVBAR: sombra al hacer scroll
// =========================

window.addEventListener('scroll', () => {
    document.querySelector('header').classList.toggle('scrolled', window.scrollY > 50);
});


// =========================
// SCROLL REVEAL
// =========================

const revealEls = document.querySelectorAll(
    '.card, .section-title, .ethics-inner, table, .hero-text'
);
revealEls.forEach(el => el.classList.add('reveal'));

const observer = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
        if(entry.isIntersecting){
            setTimeout(() => {
                entry.target.classList.add('visible');
            }, i * 80);
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.12 });

revealEls.forEach(el => observer.observe(el));


// =========================
// TILT 3D EN CARDS
// =========================

document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('mousemove', e => {
        const rect   = card.getBoundingClientRect();
        const centerX = rect.left + rect.width  / 2;
        const centerY = rect.top  + rect.height / 2;
        const rotX =  (e.clientY - centerY) / rect.height * -8;
        const rotY =  (e.clientX - centerX) / rect.width  *  8;
        card.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-6px)`;
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.transition = 'transform 0.5s ease';
    });
    card.addEventListener('mouseenter', () => {
        card.style.transition = 'transform 0.1s ease, box-shadow 0.4s ease';
    });
});


// =========================
// TILT EN IMAGEN HERO
// =========================

const heroImg = document.querySelector('.hero img');
if(heroImg){
    document.querySelector('.hero').addEventListener('mousemove', e => {
        const rect = heroImg.getBoundingClientRect();
        const cx = rect.left + rect.width  / 2;
        const cy = rect.top  + rect.height / 2;
        const rx2 = (e.clientY - cy) / 20;
        const ry2 = (e.clientX - cx) / 20;
        heroImg.style.transform = `perspective(600px) rotateX(${-rx2}deg) rotateY(${ry2}deg) scale(1.03)`;
    });
    document.querySelector('.hero').addEventListener('mouseleave', () => {
        heroImg.style.transform = '';
        heroImg.style.transition = 'transform 0.6s ease';
    });
}


// =========================
// LIGHTBOX DE IMÁGENES
// =========================

const lightbox = document.createElement('div');
lightbox.className = 'lightbox';
lightbox.innerHTML = `<span class="lightbox-close">✕</span><img src="" alt="">`;
document.body.appendChild(lightbox);

const lbImg   = lightbox.querySelector('img');
const lbClose = lightbox.querySelector('.lightbox-close');

document.querySelectorAll('.img-row img').forEach(img => {
    img.addEventListener('click', () => {
        lbImg.src = img.src;
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
    });
});

function closeLightbox(){
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
}

lbClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', e => { if(e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', e => { if(e.key === 'Escape') closeLightbox(); });


// =========================
// EFECTO TYPING EN HERO
// =========================

const heroTitle = document.querySelector('#title');
if(heroTitle){
    const originalText = heroTitle.textContent.trim();
    heroTitle.textContent = '';

    // wrap de las palabras clave en span para efecto glitch
    const words = originalText.split(' ');
    let html = '';
    words.forEach((w, i) => {
        if(i === 3 || i === 4){ // "más importante"
            html += `<span>${w}</span> `;
        } else {
            html += w + ' ';
        }
    });

    let i = 0;
    const plain = originalText;
    function typeChar(){
        if(i <= plain.length){
            // construye el texto con el span al final cuando llegue
            heroTitle.innerHTML = plain.substring(0, i).replace(
                /(más importante)/,
                '<span>$1</span>'
            );
            i++;
            setTimeout(typeChar, 45);
        }
    }
    setTimeout(typeChar, 600);
}


// =========================
// COUNTER ANIMADO AL HACER SCROLL
// =========================

// (preparado para si en el futuro se añaden estadísticas)


// =========================
// ROWS DE TABLA: animación al hover
// =========================

document.querySelectorAll('tbody tr').forEach(tr => {
    tr.addEventListener('mouseenter', () => {
        tr.style.paddingLeft = '10px';
    });
    tr.addEventListener('mouseleave', () => {
        tr.style.paddingLeft = '';
    });
});


// =========================
// MENU RESPONSIVE
// =========================

const menuToggle = document.getElementById("menuToggle");
const navLinks   = document.getElementById("navLinks");

menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("active");
});

// Cierra el menú al hacer clic en un link (móvil)
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('active'));
});


// =========================
// CAMBIO DE IDIOMA
// =========================

const langButton = document.getElementById("langToggle");
let english = false;

const translations = {
    es: {
        "nav-home": "Inicio",
        "nav-conf": "Conferencias",
        "nav-glossary": "Glosario",
        "nav-ethics": "Ética",
        "title": "El evento tecnológico más importante de Colombia",
        "intro": "Colombia 5.0 es un evento nacional enfocado en innovación, inteligencia artificial, transformación digital y desarrollo tecnológico. Este sitio tiene como objetivo informar y compartir los aprendizajes obtenidos durante el evento.",
        "exploreBtn": "Explorar",
        "conference-title": "Conferencias",
        "conf1-title": "Realidad virtual en entrenamiento médico de alta fidelidad & Teral App para diagnóstico eficaz",
        "speaker-label-1": "Conferencista:",
        "conf1-text": "Las conferencias abordaron cómo la inteligencia artificial está transformando el área de la salud mediante herramientas como la realidad virtual para simulaciones médicas y aplicaciones móviles para diagnóstico eficiente.",
        "vr-item": "🥽 Realidad virtual con ultrasonido",
        "conf2-title": "Monetización, profesionalización y crecimiento en redes sociales",
        "speaker-label-2": "Conferencista:",
        "conf2-text": "Las redes sociales ya no son solo plataformas para compartir contenido; son espacios donde las empresas construyen relaciones, generan confianza y crean oportunidades de negocio. Un error común es pensar que publicar mucho significa hacer buen marketing. La realidad es que el contenido efectivo no se mide por la cantidad, sino por el valor que aporta a la audiencia.",
        "keywords-label": "🔑 Palabras clave",
        "kw1": "Marketing",
        "kw2": "Redes Sociales",
        "glossary-title": "Glosario",
        "th-english": "English",
        "th-spanish": "Español",
        "th-definition": "Definición",
        "def1":"Servicios digitales ofrecidos por internet.",
        "def2":"Sistemas capaces de aprender automáticamente.",
        "def3":"Protección de sistemas y datos digitales.",
        "def4":"Procesamiento masivo de información.",
        "def5":"Tecnología que simula inteligencia humana.",
        "def6":"Programas y aplicaciones digitales.",
        "def7":"Componentes físicos del computador.",
        "def8":"Sistema organizado de información.",
        "def9":"Permite comunicación entre sistemas.",
        "def10":"Parte visual de una aplicación web.",
        "def11":"Lógica interna de un sistema.",
        "def12":"Tecnología segura de registros digitales.",
        "def13":"Análisis avanzado de información.",
        "def14":"Percepción del usuario al usar un sistema.",
        "def15":"Diseño visual de interacción.",
        "def16":"Adaptación a diferentes pantallas.",
        "def17":"Estructura reutilizable de desarrollo.",
        "def18":"Protección de información mediante códigos.",
        "def19":"Conjunto de pasos lógicos.",
        "def20":"Conexión entre dispositivos.",
        "def21":"Creación de soluciones tecnológicas.",
        "def22":"Procesos realizados automáticamente.",
        "def23":"Persona que crea software.",
        "def24":"Programa informático.",
        "def25":"Integración de tecnología en empresas.",
        "def26":"Entornos digitales inmersivos.",
        "def27":"Elementos digitales sobre el entorno real.",
        "def28":"Creación de software mediante código.",
        "def29":"Profesional que desarrolla sistemas.",
        "ethics-title": "Conclusión y Reflexión Ética",
        "ethics-text": "La ética en la tecnología empresarial es fundamental para garantizar el uso responsable de herramientas digitales y de inteligencia artificial. Actualmente las empresas manejan grandes cantidades de datos, por lo que deben proteger la privacidad y seguridad de los usuarios. La automatización y la inteligencia artificial permiten optimizar procesos, pero también generan desafíos relacionados con el empleo y el impacto social. Como futuros desarrolladores de software, tenemos la responsabilidad de crear soluciones tecnológicas seguras, inclusivas y transparentes.",
        "footer-text": "© 2026 Colombia 5.0 | Sitio desarrollado por estudiante Maria Camila Ortiz Gaitan ADSO",
        "langBtn": "ENG"
    },
    en: {
        "nav-home": "Home",
        "nav-conf": "Conferences",
        "nav-glossary": "Glossary",
        "nav-ethics": "Ethics",
        "title": "The most important technology event in Colombia",
        "intro": "Colombia 5.0 is a national event focused on innovation, artificial intelligence, digital transformation and technological development. This site aims to inform and share the knowledge gained during the event.",
        "exploreBtn": "Explore",
        "conference-title": "Conferences",
        "conf1-title": "Virtual reality in high-fidelity medical training & Teral App for effective diagnosis",
        "speaker-label-1": "Speaker:",
        "conf1-text": "The conferences addressed how artificial intelligence is transforming healthcare through tools such as virtual reality for medical simulations and mobile applications for efficient diagnosis.",
        "vr-item": "🥽 Virtual reality with ultrasound",
        "conf2-title": "Monetization, professionalization and growth on social media",
        "speaker-label-2": "Speaker:",
        "conf2-text": "Social media platforms are no longer just spaces to share content; they are environments where companies build relationships, generate trust and create business opportunities. A common mistake is thinking that posting frequently equals good marketing. The reality is that effective content is not measured by quantity, but by the value it brings to the audience.",
        "keywords-label": "🔑 Keywords",
        "kw1": "Marketing",
        "kw2": "Social Media",
        "glossary-title": "Glossary",
        "th-english": "English",
        "th-spanish": "Spanish",
        "th-definition": "Definition",
        "def1":"Digital services delivered over the internet.",
        "def2":"Systems capable of learning automatically.",
        "def3":"Protection of digital systems and data.",
        "def4":"Massive processing of information.",
        "def5":"Technology that simulates human intelligence.",
        "def6":"Digital programs and applications.",
        "def7":"Physical components of a computer.",
        "def8":"Organized system of information.",
        "def9":"Enables communication between systems.",
        "def10":"Visual part of a web application.",
        "def11":"Internal logic of a system.",
        "def12":"Secure technology for digital records.",
        "def13":"Advanced analysis of information.",
        "def14":"User's perception when using a system.",
        "def15":"Visual design of interaction.",
        "def16":"Adaptation to different screen sizes.",
        "def17":"Reusable development structure.",
        "def18":"Protection of information through codes.",
        "def19":"Set of logical steps.",
        "def20":"Connection between devices.",
        "def21":"Creation of technological solutions.",
        "def22":"Processes carried out automatically.",
        "def23":"Person who creates software.",
        "def24":"Computer program.",
        "def25":"Integration of technology in companies.",
        "def26":"Immersive digital environments.",
        "def27":"Digital elements overlaid on the real world.",
        "def28":"Creation of software through code.",
        "def29":"Professional who develops systems.",
        "ethics-title": "Conclusion and Ethical Reflection",
        "ethics-text": "Ethics in business technology is essential to ensure the responsible use of digital tools and artificial intelligence. Companies currently handle large amounts of data, and therefore must protect the privacy and security of users. Automation and artificial intelligence allow processes to be optimized, but also generate challenges related to employment and social impact. As future software developers, we have the responsibility to create safe, inclusive and transparent technological solutions.",
        "footer-text": "© 2026 Colombia 5.0 | Website developed by student Maria Camila Ortiz Gaitan ADSO",
        "langBtn": "ESP"
    }
};

function applyLanguage(lang){
    const t = translations[lang];
    document.documentElement.lang = lang;
    for(const [id, text] of Object.entries(t)){
        if(id === "langBtn") continue;
        const el = document.getElementById(id);
        if(el) el.textContent = text;
    }
    langButton.textContent = t["langBtn"];
}

langButton.addEventListener("click", () => {
    english = !english;
    applyLanguage(english ? "en" : "es");
});
document.addEventListener("DOMContentLoaded", () => {
    const videos = document.querySelectorAll("video");

    videos.forEach(video => {
        video.load();

        video.addEventListener("error", () => {
            console.error("Error al cargar el video:", video.currentSrc);
        });
    });
});
