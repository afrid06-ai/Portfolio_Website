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
