'use strict';
document.documentElement.classList.add('js');
document.querySelector('#year').textContent = new Date().getFullYear();
if ('IntersectionObserver' in window) { const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); } }), { threshold: .08 }); document.querySelectorAll('.reveal').forEach(section => observer.observe(section)); } else document.querySelectorAll('.reveal').forEach(section => section.classList.add('visible'));
const services = [
 {title:'Gestión contable', description:'Una propuesta de acompañamiento para mantener tu información organizada y comprender qué dicen los números de tu actividad.', items:['Organización y revisión de registros.', 'Conciliación de movimientos y documentación.', 'Reportes periódicos con explicaciones claras.']},
 {title:'Asesoría tributaria', description:'Un espacio para identificar tus obligaciones y planificar su atención según la normativa aplicable a tu situación.', items:['Revisión del contexto y régimen tributario.', 'Organización de información para declaraciones.', 'Calendario de compromisos sujeto a tu jurisdicción.']},
 {title:'Planeación financiera', description:'Información práctica para evaluar escenarios y tomar decisiones con una visión más completa de tus recursos.', items:['Presupuestos de ingresos y gastos.', 'Análisis de flujo de caja y necesidades.', 'Seguimiento de objetivos y revisión de escenarios.']}
];
const dialog = document.querySelector('#service-dialog');
document.querySelectorAll('[data-service]').forEach(button => button.addEventListener('click', () => { const service = services[Number(button.dataset.service)]; document.querySelector('#dialog-title').textContent = service.title; document.querySelector('#dialog-description').textContent = service.description; document.querySelector('#dialog-items').replaceChildren(...service.items.map(text => { const item = document.createElement('li'); item.textContent = text; return item; })); dialog.showModal(); }));
document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
document.querySelector('#dialog-contact').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { const box = dialog.getBoundingClientRect(); if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close(); });
const form = document.querySelector('#balance-form');
const inputs = ['income','fixed','variable'].map(id => document.getElementById(id));
const format = new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN', minimumFractionDigits: 2, maximumFractionDigits: 2 });
function calculate() {
 const result = document.querySelector('.result');
 if (!inputs.every(input => input.value !== '' && input.validity.valid && Number.isFinite(input.valueAsNumber))) { document.querySelector('#balance').textContent = '—'; document.querySelector('#balance-state').textContent = 'Revisa los importes'; document.querySelector('#balance-detail').textContent = 'Usa importes entre 0 y 1,000,000,000, con un máximo de dos decimales.'; document.querySelector('#expense-bar').style.width = '0%'; result.classList.remove('negative'); return; }
 const [income, fixed, variable] = inputs.map(input => Math.round(input.valueAsNumber * 100));
 const expenses = fixed + variable;
 const balance = income - expenses;
 document.querySelector('#balance').textContent = format.format(balance / 100);
 result.classList.toggle('negative', balance < 0);
 document.querySelector('#balance-state').textContent = balance < 0 ? 'Gastos superiores a ingresos' : balance === 0 ? 'Ingresos y gastos iguales' : 'Saldo positivo ↗';
 const ratio = income > 0 ? expenses / income * 100 : 0;
 document.querySelector('#expense-bar').style.width = `${income === 0 && expenses > 0 ? 100 : Math.min(ratio, 100)}%`;
 document.querySelector('#balance-detail').textContent = income > 0 ? `Tus gastos representan el ${new Intl.NumberFormat('es-PE', { maximumFractionDigits: 1 }).format(ratio)} % de tus ingresos.` : expenses > 0 ? 'Hay gastos y no hay ingresos. No se puede calcular una proporción de gasto.' : 'Añade tus ingresos y gastos para explorar tu balance.';
}
form.addEventListener('input', calculate);
form.addEventListener('reset', () => requestAnimationFrame(calculate));
form.addEventListener('submit', event => event.preventDefault());
calculate();
let timer;
document.querySelector('#copy-email').addEventListener('click', async () => { let message; try { await navigator.clipboard.writeText('hola@example.com'); message = 'Correo de ejemplo copiado: hola@example.com'; } catch { message = 'Correo de ejemplo: hola@example.com'; } const toast = document.querySelector('#toast'); toast.textContent = message; toast.classList.add('visible'); clearTimeout(timer); timer = setTimeout(() => toast.classList.remove('visible'), 3500); });
