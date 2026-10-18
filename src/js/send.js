// Envoi des formulaires : WhatsApp (canal principal) ou e-mail, sans serveur.
import { CONTACT } from './config.js';

export function openWhatsApp(text) {
  window.open(`https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
}

export function openEmail(subject, text) {
  location.href = `mailto:${CONTACT.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text.replace(/\*/g, ''))}`;
}

// Vérifie les champs obligatoires ; renvoie false et explique dans `note` si un champ manque.
export function checkRequired(form, note) {
  for (const el of form.querySelectorAll('[required]')) {
    if (el.type === 'radio') {
      if (!form.querySelector(`input[name="${el.name}"]:checked`)) {
        el.closest('fieldset')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        note.textContent = 'Merci de choisir une occasion.';
        return false;
      }
      continue;
    }
    if (!el.checkValidity()) {
      el.focus();
      const label = form.querySelector(`label[for="${el.id}"]`)?.textContent.replace(' *', '') ?? 'requis';
      note.textContent = el.validity.typeMismatch ? `Le champ « ${label} » n’est pas valide.` : `Merci de compléter le champ « ${label} ».`;
      return false;
    }
  }
  return true;
}
