'use strict';
document.documentElement.classList.add('js');
window.addEventListener('load', () => setTimeout(() => document.querySelector('.loader').classList.add('done'), 750));
document.querySelector('#year').textContent = new Date().getFullYear();
const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); } }), { threshold: 0.08 });
document.querySelectorAll('.reveal').forEach(section => observer.observe(section));
const filters = document.querySelectorAll('[data-filter]');
filters.forEach(button => button.addEventListener('click', () => {
  filters.forEach(item => { const active = item === button; item.classList.toggle('active', active); item.setAttribute('aria-pressed', String(active)); });
  document.querySelectorAll('.project-card').forEach(card => { card.hidden = button.dataset.filter !== 'all' && card.dataset.category !== button.dataset.filter; });
}));
const projects = [
  { title: 'Frontend de consulta de DNI', description: 'Proyecto académico en desarrollo con Angular. El repositorio del frontend es privado y no se presenta como producto terminado.', approach: 'Práctica de desarrollo de interfaces y organización de un proyecto Angular. No se exponen datos privados ni funcionalidades no verificadas.', tags: ['Angular', 'Frontend', 'Académico'] },
  { title: 'Mi portafolio personal', description: 'Sitio web estático y adaptable para mostrar mi formación, habilidades en aprendizaje y proyectos.', approach: 'Construido con HTML, CSS y JavaScript. Incluye filtros, detalles de proyectos, diseño adaptable y navegación interactiva.', tags: ['HTML', 'CSS', 'JavaScript'] }
];
const dialog = document.querySelector('#project-dialog');
document.querySelectorAll('[data-project]').forEach(card => card.addEventListener('click', () => {
  const project = projects[Number(card.dataset.project)];
  document.querySelector('#dialog-title').textContent = project.title;
  document.querySelector('#dialog-description').textContent = project.description;
  document.querySelector('#dialog-approach').textContent = project.approach;
  document.querySelector('#dialog-tags').replaceChildren(...project.tags.map(tag => { const element = document.createElement('span'); element.textContent = tag; return element; }));
  dialog.showModal();
}));
document.querySelectorAll('.close-dialog, .close-action').forEach(button => button.addEventListener('click', () => dialog.close()));
dialog.addEventListener('click', event => { const box = dialog.getBoundingClientRect(); if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close(); });
let toastTimer;
function toast(message) { const element = document.querySelector('#toast'); element.textContent = message; element.classList.add('visible'); clearTimeout(toastTimer); toastTimer = setTimeout(() => element.classList.remove('visible'), 3500); }
document.querySelector('#copy-email').addEventListener('click', async () => {
  try { await navigator.clipboard.writeText('noediazad@gmail.com'); toast('Correo copiado: noediazad@gmail.com'); }
  catch { toast('Correo: noediazad@gmail.com'); }
});
const terminal = document.querySelector('#terminal-output');
const responses = { help: 'Comandos: about · skills · projects · contact · clear', about: 'Ingeniería de sistemas + curiosidad + diseño. Estudiante de Ingeniería de Sistemas Computacionales en la UPN, VIII ciclo.', skills: 'Python · Java · C · HTML · CSS · JavaScript · Angular · Cisco Packet Tracer (en aprendizaje).', projects: 'Explora el frontend académico de DNI y este portafolio web.', contact: 'Correo: noediazad@gmail.com. Sustitúyelo por tu dirección.' };
document.querySelector('#terminal-form').addEventListener('submit', event => {
  event.preventDefault(); const input = document.querySelector('#command'); const command = input.value.trim().toLowerCase(); if (!command) return;
  if (command === 'clear') terminal.replaceChildren();
  else { const line = document.createElement('p'); const prompt = document.createElement('span'); prompt.textContent = `visitor:~$ ${input.value.slice(0, 120)} `; line.append(prompt, document.createTextNode(responses[command] || 'Comando no reconocido. Prueba help.')); terminal.append(line); while (terminal.children.length > 30) terminal.firstElementChild.remove(); terminal.scrollTop = terminal.scrollHeight; }
  input.value = '';
});
const canvas = document.querySelector('#particles');
const ctx = canvas.getContext('2d');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let width, height, dots = [], frame;
const pointer = { x: -1000, y: -1000 };
function resize() { width = window.innerWidth; height = 850; const ratio = Math.min(window.devicePixelRatio || 1, 2); canvas.width = width * ratio; canvas.height = height * ratio; ctx.setTransform(ratio, 0, 0, ratio, 0, 0); dots = Array.from({ length: Math.min(65, Math.floor(width / 22)) }, () => ({ x: Math.random() * width, y: Math.random() * height, vx: (Math.random() - .5) * .22, vy: (Math.random() - .5) * .22 })); }
function draw() { ctx.clearRect(0, 0, width, height); dots.forEach(dot => { dot.x = (dot.x + dot.vx + width) % width; dot.y = (dot.y + dot.vy + height) % height; ctx.fillStyle = '#9bb67b'; ctx.beginPath(); ctx.arc(dot.x, dot.y, 1, 0, Math.PI * 2); ctx.fill(); const distance = Math.hypot(dot.x - pointer.x, dot.y - pointer.y); if (distance < 150) { ctx.strokeStyle = `rgba(194,249,112,${(1 - distance / 150) * .4})`; ctx.beginPath(); ctx.moveTo(dot.x, dot.y); ctx.lineTo(pointer.x, pointer.y); ctx.stroke(); } }); if (!reducedMotion.matches && !document.hidden) frame = requestAnimationFrame(draw); }
if (ctx) { resize(); draw(); window.addEventListener('resize', resize); window.addEventListener('pointermove', event => { pointer.x = event.pageX; pointer.y = event.pageY; }); document.addEventListener('visibilitychange', () => { cancelAnimationFrame(frame); if (!document.hidden) draw(); }); reducedMotion.addEventListener('change', () => { cancelAnimationFrame(frame); draw(); }); }
const art = document.querySelector('.hero-art');
art.addEventListener('pointermove', event => { if (reducedMotion.matches) return; const box = art.getBoundingClientRect(); const x = (event.clientX - box.left) / box.width - .5; const y = (event.clientY - box.top) / box.height - .5; art.querySelector('.core').style.transform = `translate(${x * 16}px, ${y * 16}px)`; });
art.addEventListener('pointerleave', () => { art.querySelector('.core').style.transform = ''; });
