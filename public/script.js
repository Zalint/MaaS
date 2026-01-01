// ============================================
// COUNTDOWN TIMER
// ============================================

/**
 * Initialise et gère le compte à rebours
 */
function initCountdown() {
    // Date de fin : 30 jours à partir de maintenant
    // Modifiez cette date selon vos besoins
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 30); // 30 jours
    endDate.setHours(23, 59, 59, 999); // Fin de journée
    
    // Stockage de la date de fin en localStorage pour persistance
    if (!localStorage.getItem('maas-countdown-end')) {
        localStorage.setItem('maas-countdown-end', endDate.toISOString());
    }
    
    const storedEndDate = new Date(localStorage.getItem('maas-countdown-end'));
    
    function updateCountdown() {
        const now = new Date().getTime();
        const distance = storedEndDate.getTime() - now;
        
        if (distance < 0) {
            // Le compte à rebours est terminé
            document.getElementById('countdown-timer').innerHTML = 
                '<div class="countdown-expired">⏰ La période d\'inscription prioritaire est terminée !</div>';
            return;
        }
        
        // Calculs
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        // Mise à jour de l'affichage
        document.getElementById('days').textContent = String(days).padStart(2, '0');
        document.getElementById('hours').textContent = String(hours).padStart(2, '0');
        document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
        document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
    }
    
    // Mise à jour initiale
    updateCountdown();
    
    // Mise à jour toutes les secondes
    setInterval(updateCountdown, 1000);
}

// ============================================
// VALIDATION & HELPERS
// ============================================

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
        return true; // Optionnel
    }
    return url.startsWith('https://linkedin.com/in/') || 
           url.startsWith('https://www.linkedin.com/in/');
}

/**
 * Affiche une erreur sur un champ
 */
function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorElement = document.getElementById(`error-${fieldId}`);
    
    if (field) {
        field.classList.add('invalid');
        field.classList.remove('valid');
    }
    
    if (errorElement) {
        errorElement.textContent = message;
    }
}

/**
 * Efface l'erreur d'un champ
 */
function clearError(fieldId) {
    const field = document.getElementById(fieldId);
    const errorElement = document.getElementById(`error-${fieldId}`);
    
    if (field) {
        field.classList.remove('invalid');
        if (field.value.trim()) {
            field.classList.add('valid');
        }
    }
    
    if (errorElement) {
        errorElement.textContent = '';
    }
}

/**
 * Affiche une erreur globale du formulaire
 */
function showFormError(message) {
    const formError = document.getElementById('form-error');
    if (formError) {
        formError.textContent = message;
        formError.classList.add('show');
    }
}

/**
 * Cache l'erreur globale du formulaire
 */
function hideFormError() {
    const formError = document.getElementById('form-error');
    if (formError) {
        formError.classList.remove('show');
    }
}

/**
 * Valide tous les champs du formulaire
 */
function validateForm() {
    let isValid = true;
    hideFormError();
    
    // Prénom
    const prenom = document.getElementById('prenom').value.trim();
    if (!prenom) {
        showError('prenom', 'Le prénom est obligatoire');
        isValid = false;
    } else if (prenom.length > 100) {
        showError('prenom', 'Maximum 100 caractères');
        isValid = false;
    } else {
        clearError('prenom');
    }
    
    // Nom
    const nom = document.getElementById('nom').value.trim();
    if (!nom) {
        showError('nom', 'Le nom est obligatoire');
        isValid = false;
    } else if (nom.length > 100) {
        showError('nom', 'Maximum 100 caractères');
        isValid = false;
    } else {
        clearError('nom');
    }
    
    // Email
    const email = document.getElementById('email').value.trim();
    if (!email) {
        showError('email', 'L\'email est obligatoire');
        isValid = false;
    } else if (!validateEmail(email)) {
        showError('email', 'Veuillez entrer une adresse email valide');
        isValid = false;
    } else {
        clearError('email');
    }
    
    // LinkedIn (optionnel)
    const linkedin = document.getElementById('linkedin').value.trim();
    if (linkedin && !validateLinkedInUrl(linkedin)) {
        showError('linkedin', 'Veuillez entrer une URL LinkedIn valide (https://linkedin.com/in/...) ou laisser vide');
        isValid = false;
    } else {
        clearError('linkedin');
    }
    
    // Commentaire (optionnel)
    const commentaire = document.getElementById('commentaire').value.trim();
    if (commentaire.length > 500) {
        showError('commentaire', 'Maximum 500 caractères');
        isValid = false;
    } else {
        clearError('commentaire');
    }
    
    return isValid;
}

/**
 * Affiche la confirmation de succès
 */
function showConfirmation() {
    const form = document.getElementById('waitlist-form');
    const confirmation = document.getElementById('confirmation');
    
    if (form && confirmation) {
        form.style.display = 'none';
        confirmation.style.display = 'block';
        
        // Scroll vers la confirmation
        confirmation.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

// ============================================
// EVENT LISTENERS
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    
    // Initialiser le compte à rebours
    initCountdown();
    
    // Compteur de caractères pour le commentaire
    const commentaireField = document.getElementById('commentaire');
    const charCountElement = document.getElementById('char-count');
    
    if (commentaireField && charCountElement) {
        commentaireField.addEventListener('input', function() {
            charCountElement.textContent = this.value.length;
        });
    }
    
    // Validation en temps réel sur blur
    const fields = ['prenom', 'nom', 'email', 'linkedin', 'commentaire'];
    fields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.addEventListener('blur', function() {
                if (this.value.trim()) {
                    validateForm();
                }
            });
            
            // Efface l'erreur lors de la saisie
            field.addEventListener('input', function() {
                clearError(fieldId);
                hideFormError();
            });
        }
    });
    
    // Soumission du formulaire
    const form = document.getElementById('waitlist-form');
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Validation
            if (!validateForm()) {
                return;
            }
            
            // Désactivation du bouton
            const submitBtn = document.getElementById('submit-btn');
            const originalText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Envoi en cours...';
            
            // Préparation des données
            const formData = {
                prenom: document.getElementById('prenom').value.trim(),
                nom: document.getElementById('nom').value.trim(),
                email: document.getElementById('email').value.trim(),
                linkedin: document.getElementById('linkedin').value.trim(),
                commentaire: document.getElementById('commentaire').value.trim()
            };
            
            try {
                const response = await fetch('/api/submit', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });
                
                const result = await response.json();
                
                if (response.ok && result.success) {
                    // Succès !
                    showConfirmation();
                } else {
                    // Erreur serveur
                    showFormError(result.error || 'Une erreur est survenue');
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalText;
                }
                
            } catch (error) {
                console.error('Erreur:', error);
                showFormError('Erreur technique, veuillez réessayer dans quelques instants');
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }
        });
    }
    
    // Smooth scroll pour le CTA
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
        ctaButton.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    }
});

