/**
 * Valide un email
 */
function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

/**
 * Valide une URL LinkedIn
 */
function validateLinkedInUrl(url) {
  if (!url || url.trim() === '') {
    return true; // Optionnel, donc vide = valide
  }
  
  return url.startsWith('https://linkedin.com/in/') || 
         url.startsWith('https://www.linkedin.com/in/');
}

/**
 * Valide les données du formulaire
 */
function validateFormData(data) {
  const errors = [];

  // Prénom obligatoire
  if (!data.prenom || data.prenom.trim().length === 0) {
    errors.push('Le prénom est obligatoire');
  } else if (data.prenom.length > 100) {
    errors.push('Le prénom ne peut pas dépasser 100 caractères');
  }

  // Nom obligatoire
  if (!data.nom || data.nom.trim().length === 0) {
    errors.push('Le nom est obligatoire');
  } else if (data.nom.length > 100) {
    errors.push('Le nom ne peut pas dépasser 100 caractères');
  }

  // Email obligatoire et valide
  if (!data.email || data.email.trim().length === 0) {
    errors.push('L\'email est obligatoire');
  } else if (!validateEmail(data.email)) {
    errors.push('L\'email n\'est pas valide');
  }

  // WhatsApp obligatoire
  if (!data.whatsapp || data.whatsapp.trim().length === 0) {
    errors.push('Le numéro WhatsApp est obligatoire');
  }

  // Profil obligatoire
  if (!data.profil || data.profil.trim().length === 0) {
    errors.push('Le profil est obligatoire');
  } else if (data.profil.length > 100) {
    errors.push('Le profil ne peut pas dépasser 100 caractères');
  }

  // Zone optionnelle mais limitée à 100 caractères si fournie
  if (data.zone && data.zone.length > 100) {
    errors.push('La zone ne peut pas dépasser 100 caractères');
  }

  // LinkedIn optionnel mais doit être valide si fourni
  if (data.linkedin && !validateLinkedInUrl(data.linkedin)) {
    errors.push('L\'URL LinkedIn doit commencer par https://linkedin.com/in/ ou https://www.linkedin.com/in/');
  }

  // Commentaire max 500 caractères
  if (data.commentaire && data.commentaire.length > 500) {
    errors.push('Le commentaire ne peut pas dépasser 500 caractères');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

module.exports = {
  validateEmail,
  validateLinkedInUrl,
  validateFormData
};

