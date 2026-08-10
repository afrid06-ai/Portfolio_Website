const revealElements = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  revealElements.forEach((element) => {
    element.classList.add('reveal-pending');
    observer.observe(element);
  });

  // Never leave portfolio content hidden if an embedded browser or preview
  // does not reliably dispatch intersection events.
  window.setTimeout(() => {
    revealElements.forEach((element) => element.classList.add('visible'));
  }, 1200);
}

const detail = document.querySelector('#skillDetail');
document.querySelectorAll('.skill-node').forEach((node) => {
  node.addEventListener('click', () => {
    document.querySelectorAll('.skill-node').forEach((item) => item.classList.remove('active'));
    node.classList.add('active');
    detail.textContent = node.dataset.detail;
  });
});

const assistant = document.querySelector('.portfolio-assistant');
const assistantLauncher = document.querySelector('#assistantLauncher');
const assistantPanel = document.querySelector('#assistantPanel');
const assistantClose = document.querySelector('#assistantClose');
const assistantMessages = document.querySelector('#assistantMessages');
const assistantForm = document.querySelector('#assistantForm');
const assistantInput = document.querySelector('#assistantInput');
const assistantSuggestions = document.querySelector('#assistantSuggestions');

const portfolioReplies = [
  {
    keywords: ['work', 'built', 'project', 'portfolio', 'impact'],
    answer: 'Afrid builds production AI—not demos. His featured work includes multi-agent enterprise workflows, hybrid RAG and reranking systems, and an adaptive AI study assistant. Highlights include 35% higher task accuracy and 40% faster retrieval latency.'
  },
  {
    keywords: ['stack', 'skill', 'technology', 'tools', 'expertise'],
    answer: 'His core stack spans LangGraph, LangChain, AutoGen, LlamaIndex, GPT-4, Claude, Llama, FAISS, Pinecone, RAGAS, LangSmith, FastAPI, Redis, PostgreSQL, Docker, Kubernetes, AWS, Azure, PyTorch, and TensorFlow.'
  },
  {
    keywords: ['experience', 'career', 'job', 'company', 'deloitte', 'scale'],
    answer: 'Afrid is an AI/ML Engineer at Scale AI in the USA and previously worked as a Machine Learning Engineer at Deloitte India. He has 4+ years of experience taking AI and ML systems from idea to production.'
  },
  {
    keywords: ['education', 'university', 'degree', 'study'],
    answer: 'Afrid is completing an MS in Computer Science at the University of New Haven and holds a BTech in Computer Science from SRM Institute. His credentials also include AWS Solutions Architect and Red Hat OpenShift.'
  },
  {
    keywords: ['hire', 'why', 'strength', 'different'],
    answer: 'Afrid combines applied AI depth with production engineering. He can design an agent or RAG architecture, evaluate its quality, optimize inference cost and latency, and ship it on cloud infrastructure—without losing sight of measurable business impact.'
  },
  {
    keywords: ['contact', 'email', 'talk', 'connect', 'reach', 'available'],
    answer: 'Afrid is available to discuss AI engineering roles, ambitious products, and collaborations. Email him at afrid@coreit.co.in, connect on LinkedIn at linkedin.com/in/afridshaik, or explore his code at github.com/afrid06-ai.'
  },
  {
    keywords: ['github', 'linkedin', 'profile', 'social', 'repository', 'repositories', 'repo', 'code'],
    answer: 'Connect with Afrid at linkedin.com/in/afridshaik, read his latest posts from the LinkedIn Notebook section, and explore all 11 of his public repositories at github.com/afrid06-ai. Featured builds include Multi-Agent Dev Crew, Mini AI Workflow Builder, Study Assistant, and a full-stack News Aggregator.'
  },
  {
    keywords: ['location', 'where', 'based'],
    answer: 'Afrid is based in New Haven, Connecticut, USA, and is available to connect about AI/ML engineering opportunities.'
  }
];

function addAssistantMessage(text, sender = 'bot') {
  const message = document.createElement('div');
  message.className = `assistant-message ${sender}`;
  message.textContent = text;
  assistantMessages.appendChild(message);
  assistantMessages.scrollTop = assistantMessages.scrollHeight;
}

function getPortfolioReply(question) {
  const normalizedQuestion = question.toLowerCase();
  const match = portfolioReplies
    .map((reply) => ({
      ...reply,
      score: reply.keywords.filter((keyword) => normalizedQuestion.includes(keyword)).length
    }))
    .sort((first, second) => second.score - first.score)[0];

  if (match && match.score > 0) return match.answer;
  return 'I can tell you about Afrid’s selected work, AI stack, experience, education, or how to contact him. Try asking “What has Afrid built?”';
}

function answerAssistantQuestion(question) {
  const cleanQuestion = question.trim();
  if (!cleanQuestion) return;

  addAssistantMessage(cleanQuestion, 'user');
  assistantInput.value = '';

  const typing = document.createElement('div');
  typing.className = 'assistant-message bot assistant-typing';
  typing.setAttribute('aria-label', 'Afrid.AI is typing');
  typing.innerHTML = '<i></i><i></i><i></i>';
  assistantMessages.appendChild(typing);
  assistantMessages.scrollTop = assistantMessages.scrollHeight;

  window.setTimeout(() => {
    typing.remove();
    addAssistantMessage(getPortfolioReply(cleanQuestion));
  }, 550);
}

function openAssistant() {
  assistant.classList.add('open');
  assistantLauncher.setAttribute('aria-expanded', 'true');
  assistantPanel.setAttribute('aria-hidden', 'false');
  window.setTimeout(() => assistantInput.focus(), 250);
}

function closeAssistant() {
  assistant.classList.remove('open');
  assistantLauncher.setAttribute('aria-expanded', 'false');
  assistantPanel.setAttribute('aria-hidden', 'true');
  assistantLauncher.focus();
}

assistantLauncher.addEventListener('click', openAssistant);
assistantClose.addEventListener('click', closeAssistant);
assistantForm.addEventListener('submit', (event) => {
  event.preventDefault();
  answerAssistantQuestion(assistantInput.value);
});
assistantSuggestions.addEventListener('click', (event) => {
  const suggestion = event.target.closest('[data-question]');
  if (suggestion) answerAssistantQuestion(suggestion.dataset.question);
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && assistant.classList.contains('open')) closeAssistant();
});

addAssistantMessage('Hi—I’m Afrid.AI, an interactive guide to this portfolio. Ask me about Afrid’s work, technical stack, experience, or availability.');

// Progressive motion: enhance capable devices without making animation a
// requirement for reading or navigating the portfolio.
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const scrollProgress = document.querySelector('.scroll-progress i');
const cursorGlow = document.querySelector('.cursor-glow');

function updateScrollProgress() {
  const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0;
  scrollProgress.style.transform = `scaleX(${Math.min(Math.max(progress, 0), 1)})`;
}

updateScrollProgress();
window.addEventListener('scroll', updateScrollProgress, { passive: true });

if (!reducedMotion.matches && window.matchMedia('(pointer: fine)').matches) {
  let pointerX = window.innerWidth / 2;
  let pointerY = window.innerHeight / 2;
  let glowX = pointerX;
  let glowY = pointerY;

  document.addEventListener('pointermove', (event) => {
    pointerX = event.clientX;
    pointerY = event.clientY;
    cursorGlow.classList.add('active');
  });

  function animateGlow() {
    glowX += (pointerX - glowX) * 0.14;
    glowY += (pointerY - glowY) * 0.14;
    cursorGlow.style.transform = `translate3d(${glowX}px, ${glowY}px, 0)`;
    window.requestAnimationFrame(animateGlow);
  }

  animateGlow();

  document.querySelectorAll('.repo-card, .circle-link, .social-links a').forEach((element) => {
    element.addEventListener('pointermove', (event) => {
      const bounds = element.getBoundingClientRect();
      element.style.setProperty('--pointer-x', `${event.clientX - bounds.left}px`);
      element.style.setProperty('--pointer-y', `${event.clientY - bounds.top}px`);
    });
  });
}
