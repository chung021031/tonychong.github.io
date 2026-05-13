/* =========================================================
   script.js — main portfolio interactions
   ========================================================= */

// ── Typing effect ──────────────────────────────────────
const roles = [
    'Software Engineering Student',
    'Cybersecurity Enthusiast',
    'Aspiring Penetration Tester',
    'Ethical Hacker in Training',
    'Problem Solver'
];

let rIdx = 0, cIdx = 0, deleting = false;
const roleEl = document.getElementById('roleText');

function typeRole() {
    if (!roleEl) return;
    const word = roles[rIdx];

    if (deleting) {
        roleEl.textContent = word.substring(0, cIdx - 1);
        cIdx--;
    } else {
        roleEl.textContent = word.substring(0, cIdx + 1);
        cIdx++;
    }

    let delay = deleting ? 38 : 75;
    if (!deleting && cIdx === word.length) { delay = 2200; deleting = true; }
    else if (deleting && cIdx === 0) { deleting = false; rIdx = (rIdx + 1) % roles.length; delay = 380; }

    setTimeout(typeRole, delay);
}
if (roleEl) setTimeout(typeRole, 600);

// ── Navbar scroll ───────────────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (!navbar) return;
    navbar.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

// ── Mobile nav toggle ───────────────────────────────────
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
navToggle?.addEventListener('click', () => navLinks?.classList.toggle('open'));
document.querySelectorAll('.nav-link').forEach(l =>
    l.addEventListener('click', () => navLinks?.classList.remove('open'))
);

// ── Active nav on scroll ────────────────────────────────
const sections = document.querySelectorAll('section[id]');
const navEls = document.querySelectorAll('a.nav-link[href^="#"]');

window.addEventListener('scroll', () => {
    const pos = window.scrollY + 100;
    sections.forEach(sec => {
        const top = sec.offsetTop, btm = top + sec.offsetHeight;
        const id = sec.getAttribute('id');
        if (pos >= top && pos < btm) {
            navEls.forEach(a => {
                a.classList.remove('active');
                if (a.getAttribute('href') === `#${id}`) a.classList.add('active');
            });
        }
    });
}, { passive: true });

// ── Scroll reveal with stagger for siblings ─────────────
const fadeEls = document.querySelectorAll('.fade-in');

// Add stagger delay for direct children of grids
document.querySelectorAll(
    '.skills-grid, .wu-cards, .contact-grid, .edu-grid'
).forEach(grid => {
    grid.querySelectorAll(':scope > *').forEach((child, i) => {
        child.style.transitionDelay = `${i * 75}ms`;
    });
});

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

fadeEls.forEach(el => observer.observe(el));
