import { initCommon } from './common.js';
import { CONTACT } from './config.js';
import { CREATIONS } from './data.js';
import { checkRequired, openEmail, openWhatsApp } from './send.js';

initCommon();

const form = document.querySelector('.order-form');
const note = form.querySelector('.form__note');
const params = new URLSearchParams(location.search);

// Pré-sélection depuis la galerie (?creation=id)
const pre = params.get('creation');
if (pre) {
  const box = form.querySelector(`input[name="creations"][data-id="${CSS.escape(pre)}"]`);
  if (box) box.checked = true;
  else {
    const c = CREATIONS.find((k) => k.id === pre);
    if (c) form.details.value = `Modèle : ${c.title}\n`;
  }
}

// Date minimum : maintenant + délai de préparation
const min = new Date(Date.now() + CONTACT.minDelayHours * 3600 * 1000);
const iso = (d) => new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
form.date.min = iso(min);

const longDate = (v) => new Date(`${v}T12:00`).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

function valid() {
  if (!checkRequired(form, note)) return false;
  if (form.date.value < form.date.min) {
    form.date.focus();
    note.textContent = `Le délai minimum de préparation est de ${CONTACT.minDelayHours} heures : merci de choisir une date à partir du ${longDate(form.date.min)}.`;
    return false;
  }
  return true;
}

function message() {
  const d = new FormData(form);
  const picks = d.getAll('creations');
  const lines = [
    '*Nouvelle demande de commande — L’instant Gourmand*',
    '',
    `Bonjour ${CONTACT.chef.split(' ')[0]}, voici les détails de ma commande :`,
    '',
    `👤 *Client* : ${d.get('prenom')} ${d.get('nom')}`,
    `📞 *Téléphone* : ${d.get('telephone')}`,
    d.get('email') && `✉️ *E-mail* : ${d.get('email')}`,
    '',
    `🎉 *Occasion* : ${d.get('occasion')}`,
    picks.length ? `🍰 *Créations souhaitées* :\n${picks.map((p) => `   • ${p}`).join('\n')}` : '🍰 *Créations* : à définir ensemble',
    d.get('details') && `📝 *Précisions* : ${d.get('details')}`,
    '',
    `📅 *Date* : ${longDate(d.get('date'))}`,
    `⏰ *Créneau* : ${d.get('creneau')}`,
    d.get('personnes') && `👥 *Personnes* : ${d.get('personnes')}`,
    `📍 *Retrait* : atelier de ${CONTACT.city}`,
    '',
    'Merci d’avance, j’attends votre retour. 🌹',
  ];
  return lines.filter((l) => typeof l === 'string').join('\n').replace(/\n{3,}/g, '\n\n');
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!valid()) return;
  openWhatsApp(message());
  note.textContent = 'WhatsApp s’ouvre avec votre demande pré-remplie : il ne reste qu’à appuyer sur envoyer. Merci !';
});

form.querySelector('[data-email]').addEventListener('click', () => {
  if (!valid()) return;
  openEmail(`Demande de commande — ${form.prenom.value} ${form.nom.value}`, message());
  note.textContent = 'Votre messagerie s’ouvre avec la demande pré-remplie. Merci !';
});
