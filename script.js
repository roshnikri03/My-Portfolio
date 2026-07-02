/* ====================================================
   ROSHNI KUMARI — PORTFOLIO  |  script.js
   ==================================================== */

'use strict';

/* ── 1. Theme Toggle ── */
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = themeToggle.querySelector('.theme-icon');
const root = document.documentElement;

function applyTheme(theme) {
  root.setAttribute('data-theme', theme);
  themeIcon.textContent = theme === 'dark' ? '🌙' : '☀️';
  localStorage.setItem('portfolio-theme', theme);
}

// Load saved theme
const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
applyTheme(savedTheme);

themeToggle.addEventListener('click', () => {
  const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  applyTheme(next);
});

/* ── 2. Navbar scroll effect & active link ── */
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

function onScroll() {
  // Scrolled class
  navbar.classList.toggle('scrolled', window.scrollY > 40);

  // Active nav link
  let current = '';
  sections.forEach(sec => {
    const top = sec.offsetTop - 100;
    if (window.scrollY >= top) current = sec.id;
  });
  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
  });
}

window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ── 3. Mobile menu ── */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
const mobileLinks = document.querySelectorAll('.mobile-link');

function toggleMenu(open) {
  hamburger.classList.toggle('open', open);
  mobileMenu.classList.toggle('open', open);
  hamburger.setAttribute('aria-expanded', String(open));
}

hamburger.addEventListener('click', () => {
  const isOpen = hamburger.classList.contains('open');
  toggleMenu(!isOpen);
});

mobileLinks.forEach(link => {
  link.addEventListener('click', () => toggleMenu(false));
});

document.addEventListener('click', e => {
  if (!navbar.contains(e.target)) toggleMenu(false);
});

/* ── 4. Intersection Observer — reveal & skill bars ── */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger children
        entry.target.style.transitionDelay = `${i * 0.05}s`;
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// Skill bar observer — also adds .visible to .skill-category
const skillObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        skillObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.2 }
);

document.querySelectorAll('.skill-category').forEach(el => skillObserver.observe(el));

/* ── 5. Typed text animation ── */
const phrases = [
  'scalable web apps',
  'iOS experiences',
  'fast REST APIs',
  'beautiful UIs',
  'full-stack products',
];

const typedEl = document.getElementById('typed-text');
let phraseIdx = 0;
let charIdx = 0;
let deleting = false;
const TYPE_SPEED = 70;
const DEL_SPEED = 40;
const PAUSE = 1800;

function typeLoop() {
  const phrase = phrases[phraseIdx];

  if (!deleting) {
    typedEl.textContent = phrase.slice(0, charIdx + 1);
    charIdx++;
    if (charIdx === phrase.length) {
      deleting = true;
      setTimeout(typeLoop, PAUSE);
      return;
    }
    setTimeout(typeLoop, TYPE_SPEED);
  } else {
    typedEl.textContent = phrase.slice(0, charIdx - 1);
    charIdx--;
    if (charIdx === 0) {
      deleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
    }
    setTimeout(typeLoop, DEL_SPEED);
  }
}

typeLoop();

/* ── 6. Smooth scrolling for anchor links ── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ── 7. Contact form ── */
const form = document.getElementById('contact-form');
const submitBtn = document.getElementById('submit-btn');
const btnText = submitBtn.querySelector('.btn-text');
const btnLoader = submitBtn.querySelector('.btn-loader');
const successEl = document.getElementById('form-success');

function showError(fieldId, msg) {
  const el = document.getElementById(`${fieldId}-error`);
  const input = document.getElementById(fieldId);
  if (el) el.textContent = msg;
  if (input) input.classList.add('error');
}

function clearErrors() {
  document.querySelectorAll('.form-error').forEach(el => el.textContent = '');
  document.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
}

function validateForm(data) {
  let valid = true;
  if (!data.name.trim()) {
    showError('name', 'Please enter your name.');
    valid = false;
  }
  if (!data.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    showError('email', 'Please enter a valid email address.');
    valid = false;
  }
  if (!data.message.trim()) {
    showError('message', 'Please write a message.');
    valid = false;
  }
  return valid;
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  clearErrors();
  successEl.hidden = true;

  const data = {
    name: form.name.value,
    email: form.email.value,
    subject: form.subject.value,
    message: form.message.value,
  };

  if (!validateForm(data)) return;

  // Simulate send
  btnText.hidden = true;
  btnLoader.hidden = false;
  submitBtn.disabled = true;

  await new Promise(r => setTimeout(r, 1500));

  btnText.hidden = false;
  btnLoader.hidden = true;
  submitBtn.disabled = false;

  form.reset();
  successEl.hidden = false;
  successEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
});

// Clear error on input
form.querySelectorAll('input, textarea').forEach(el => {
  el.addEventListener('input', () => {
    el.classList.remove('error');
    const errEl = document.getElementById(`${el.id}-error`);
    if (errEl) errEl.textContent = '';
  });
});

/* ── 8. Stagger reveal for grid children ── */
const staggerObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const children = entry.target.querySelectorAll('.reveal');
        children.forEach((child, i) => {
          setTimeout(() => {
            child.classList.add('visible');
          }, i * 120);
        });
        staggerObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.08 }
);

document.querySelectorAll('.projects-grid, .skills-categories, .contact-grid').forEach(el => {
  staggerObserver.observe(el);
});

/* ── 9. Cursor glow effect (desktop only) ── */
if (window.matchMedia('(pointer: fine)').matches) {
  const glow = document.createElement('div');
  glow.id = 'cursor-glow';
  Object.assign(glow.style, {
    position: 'fixed',
    pointerEvents: 'none',
    width: '400px',
    height: '400px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(108,99,255,0.06) 0%, transparent 70%)',
    transform: 'translate(-50%, -50%)',
    zIndex: '0',
    transition: 'left 0.12s ease, top 0.12s ease',
    willChange: 'left, top',
  });
  document.body.appendChild(glow);

  document.addEventListener('mousemove', e => {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
  });
}

/* ── 10. Back-to-top on logo click ── */
document.querySelectorAll('a[href="#hero"]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});

/* ── 11. Chatbot ── */
const chatbotToggle = document.getElementById('chatbot-toggle');
const chatbotWindow = document.getElementById('chatbot-window');
const chatbotClose = document.getElementById('chatbot-close');
const chatbotMessages = document.getElementById('chatbot-messages');
const chatbotForm = document.getElementById('chatbot-form');
const chatbotInput = document.getElementById('chatbot-input');

const GEMINI_API_KEY = "AQ.Ab8RN6J3_P96IMX0YX-_esXTIsSUHbGPPnRfVBQU-ahz1cHavaw";

const systemPrompt = `You are an AI assistant for Roshni Kumari, a Software Developer from NIT Patna specializing in React, FastAPI, and iOS development (Swift/SwiftUI). 
Answer recruiter questions professionally, concisely, and accurately based on her portfolio. 
She has built projects like ShopSwift (E-commerce with React/FastAPI/Redis), FocusTrack (iOS Productivity App), and DevBlog API. 
She is open to remote and onsite opportunities. Keep responses brief and friendly.`;

let conversationHistory = [];

chatbotToggle.addEventListener('click', () => {
  chatbotWindow.hidden = !chatbotWindow.hidden;
  if (!chatbotWindow.hidden) {
    chatbotInput.focus();
  }
});

chatbotClose.addEventListener('click', () => {
  chatbotWindow.hidden = true;
});

function addMessage(text, sender) {
  const msg = document.createElement('div');
  msg.className = `chat-msg ${sender}`;
  msg.textContent = text;
  chatbotMessages.appendChild(msg);
  chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

function showTyping() {
  const typing = document.createElement('div');
  typing.className = 'chat-typing';
  typing.id = 'chat-typing';
  typing.innerHTML = '<span></span><span></span><span></span>';
  chatbotMessages.appendChild(typing);
  chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

function removeTyping() {
  const typing = document.getElementById('chat-typing');
  if (typing) typing.remove();
}

chatbotForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const userText = chatbotInput.value.trim();
  if (!userText) return;

  addMessage(userText, 'user');
  chatbotInput.value = '';
  showTyping();

  // Format history for Gemini API
  const contents = [
    { role: 'user', parts: [{ text: systemPrompt }] },
    { role: 'model', parts: [{ text: "Understood. I will act as Roshni's assistant." }] }
  ];

  conversationHistory.forEach(msg => {
    contents.push({ role: msg.sender === 'user' ? 'user' : 'model', parts: [{ text: msg.text }] });
  });
  contents.push({ role: 'user', parts: [{ text: userText }] });

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents })
    });

    const data = await response.json();
    removeTyping();

    if (data.candidates && data.candidates.length > 0) {
      const botReply = data.candidates[0].content.parts[0].text;
      addMessage(botReply, 'bot');
      conversationHistory.push({ text: userText, sender: 'user' });
      conversationHistory.push({ text: botReply, sender: 'bot' });
    } else {
      addMessage("Sorry, I'm having trouble connecting right now.", 'bot');
    }
  } catch (error) {
    console.error("Chatbot API Error:", error);
    removeTyping();
    addMessage("Sorry, an error occurred while connecting to my brain.", 'bot');
  }
});
