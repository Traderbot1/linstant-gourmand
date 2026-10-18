import { initCommon } from './common.js';
import { CATEGORIES, CONTACT } from './config.js';

initCommon();

const form = document.querySelector('.form');
const note = form.querySelector('.form__note');
const wa = form.querySelector('[data-whatsapp]');
const params = new URLSearchParams(location.search);

// Pré-remplissage depuis la galerie (?categorie=…&modele=…)
const preCat = params.get('categorie');
if (preCat) {
  const radio = form.querySelector(`input[name="categorie"][value="${CSS.escape(preCat)}"]`);
  if (radio) radio.checked = true;
}
if (params.get('modele')) form.modele.value = params.get('modele');

// Pas de date passée
const today = new Date();
today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
form.date.min = today.toISOString().slice(0, 10);

function message() {
  const d = new FormData(form);
  const cat = CATEGORIES.find((c) => c.id === d.get('categorie'));
  const date = d.get('date') ? new Date(`${d.get('date')}T12:00`).toLocaleDateString('fr-FR', { dateStyle: 'full' }) : '';
  return [
    'Bonjour L’instant Gourmand,',
    '',
    'Je souhaite commander :',
    `• Création : ${cat ? cat.title : ''}`,
    `• Occasion : ${d.get('occasion')}`,
    `• Date souhaitée : ${date}`,
    d.get('parts') && `• Nombre de parts : ${d.get('parts')}`,
    d.get('modele') && `• Modèle / inspiration : ${d.get('modele')}`,
    '',
    d.get('message'),
    '',
    `${d.get('nom')}`,
    d.get('email'),
    d.get('telephone'),
  ]
    .filter((l) => l !== null && l !== undefined && l !== false)
    .join('\n')
    .replace(/\n{3,}/g, '\n\n');
}

function valid() {
  for (const el of form.querySelectorAll('[required]')) {
    if (!el.checkValidity()) {
      el.focus();
      note.textContent = `Merci de compléter le champ « ${form.querySelector(`label[for="${el.id}"]`).textContent} ».`;
      return false;
    }
  }
  return true;
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!valid()) return;
  const subject = `Demande de création — ${form.nom.value}`;
  location.href = `mailto:${CONTACT.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message())}`;
  note.textContent = 'Votre messagerie s’ouvre avec la demande pré-remplie : il ne reste qu’à l’envoyer. Merci !';
});

if (CONTACT.whatsapp) {
  wa.hidden = false;
  wa.addEventListener('click', () => {
    if (!valid()) return;
    window.open(`https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(message())}`, '_blank', 'noopener');
  });
}
