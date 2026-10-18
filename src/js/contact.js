import { initCommon } from './common.js';
import { CONTACT } from './config.js';
import { checkRequired, openEmail, openWhatsApp } from './send.js';

initCommon();

const form = document.querySelector('.contact-form');
const note = form.querySelector('.form__note');

function message() {
  const d = new FormData(form);
  return [
    '*Nouveau message — L’instant Gourmand*',
    '',
    `Bonjour ${CONTACT.chef.split(' ')[0]}, je vous contacte via le site :`,
    '',
    `👤 *Nom* : ${d.get('prenom')} ${d.get('nom')}`,
    `✉️ *E-mail* : ${d.get('email')}`,
    d.get('telephone') && `📞 *Téléphone* : ${d.get('telephone')}`,
    `📌 *Sujet* : ${d.get('sujet')}`,
    '',
    `*Message* :\n${d.get('message')}`,
    '',
    'Merci d’avance pour votre retour. 🌹',
  ]
    .filter((l) => typeof l === 'string')
    .join('\n')
    .replace(/\n{3,}/g, '\n\n');
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!checkRequired(form, note)) return;
  openWhatsApp(message());
  note.textContent = 'WhatsApp s’ouvre avec votre message pré-rempli. Merci !';
});
form.querySelector('[data-email]').addEventListener('click', () => {
  if (!checkRequired(form, note)) return;
  openEmail(`${form.sujet.value} — ${form.prenom.value} ${form.nom.value}`, message());
  note.textContent = 'Votre messagerie s’ouvre avec le message pré-rempli. Merci !';
});

// Carte Google chargée seulement à la demande
document.querySelector('[data-map]')?.addEventListener('click', (e) => {
  const btn = e.currentTarget;
  const iframe = document.createElement('iframe');
  iframe.src = btn.dataset.map;
  iframe.title = 'L’atelier L’instant Gourmand à La Garenne-Colombes';
  iframe.referrerPolicy = 'no-referrer-when-downgrade';
  btn.replaceWith(iframe);
});
