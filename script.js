const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

const detail = document.querySelector('#skillDetail');
document.querySelectorAll('.skill-node').forEach((node) => {
  node.addEventListener('click', () => {
    document.querySelectorAll('.skill-node').forEach((item) => item.classList.remove('active'));
    node.classList.add('active');
    detail.textContent = node.dataset.detail;
  });
});
