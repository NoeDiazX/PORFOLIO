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
  { title: 'Nexus Dashboard', description: 'Concepto de panel de administración que reúne métricas, tareas y actividad en una interfaz clara. Diseñado para convertir una gran cantidad de información en una vista útil.', approach: 'Componentes reutilizables, jerarquía visual y vistas adaptables. El siguiente paso sería conectar una API real y construir los estados de carga, error y permisos.', tags: ['JavaScript', 'UI / UX', 'Dashboard'] },
  { title: 'Atlas Network', description: 'Concepto de monitorización de redes para visualizar conexiones, identificar nodos y comprender el estado de una infraestructura.', approach: 'Modelar la red como un grafo, recoger métricas con Python y presentarlas mediante una visualización interactiva. Una propuesta para unir sistemas y experiencia de usuario.', tags: ['Python', 'Redes', 'Visualización'] },
  { title: 'Raíz Digital', description: 'Concepto de plataforma para acercar iniciativas ambientales a las personas mediante una experiencia sencilla y accesible.', approach: 'Diseño adaptable, contenido directo y una navegación con pocas barreras. Las futuras funciones incluirían un mapa de iniciativas y seguimiento de actividades.', tags: ['HTML', 'CSS', 'JavaScript'] },
  { title: 'Flow Data Pipeline', description: 'Concepto de flujo automatizado que transforma datos dispersos en información organizada y lista para analizar.', approach: 'Separar extracción, limpieza y análisis; validar entradas, registrar incidencias y ofrecer resultados trazables. El código de la tarjeta es una ilustración del concepto.', tags: ['Python', 'SQL', 'Automatización'] }
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
  try { await navigator.clipboard.writeText('hola@example.com'); toast('Correo de ejemplo copiado: hola@example.com'); }
  catch { toast('Correo de ejemplo: hola@example.com'); }
});
const terminal = document.querySelector('#terminal-output');
const responses = { help: 'Comandos: about · skills · projects · contact · clear', about: 'Ingeniería de sistemas + curiosidad + diseño. Una plantilla para contar tu propia historia.', skills: 'HTML · CSS · JavaScript · Python · SQL · Git · Linux. Stack de ejemplo; adáptalo a tus habilidades.', projects: 'Explora Nexus, Atlas, Raíz y Flow en la sección de proyectos.', contact: 'Correo de demostración: hola@example.com. Sustitúyelo por tu dirección.' };
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
