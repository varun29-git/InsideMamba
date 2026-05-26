/* AETHER: Minimalist Shared Logic - 2026 */

document.addEventListener('DOMContentLoaded', () => {
  // Set active class on navbar links depending on current path
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href && currentPath.includes(href.replace('../', ''))) {
      link.classList.add('active');
    }
  });
});
