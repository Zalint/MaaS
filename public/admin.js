// ============================================
// AUTHENTIFICATION
// ============================================

/**
 * Vérifie si l'utilisateur est connecté
 */
async function checkAuth() {
    try {
        const response = await fetch('/api/admin/check');
        const result = await response.json();
        
        if (result.authenticated) {
            showDashboard(result.username);
            loadData();
        } else {
            showLogin();
        }
    } catch (error) {
        console.error('Erreur vérification auth:', error);
        showLogin();
    }
}

/**
 * Affiche la page de login
 */
function showLogin() {
    document.getElementById('login-page').style.display = 'block';
    document.getElementById('dashboard').classList.remove('active');
}

/**
 * Affiche le dashboard
 */
function showDashboard(username) {
    document.getElementById('login-page').style.display = 'none';
    document.getElementById('dashboard').classList.add('active');
    document.getElementById('username-display').textContent = username;
}

/**
 * Gère la soumission du formulaire de login
 */
document.getElementById('login-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const loginBtn = document.getElementById('login-btn');
    const errorDiv = document.getElementById('login-error');
    
    // Désactiver le bouton
    loginBtn.disabled = true;
    loginBtn.textContent = 'Connexion...';
    errorDiv.classList.remove('show');
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    try {
        const response = await fetch('/api/admin/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        
        const result = await response.json();
        
        if (response.ok && result.success) {
            // Connexion réussie
            showDashboard(username);
            loadData();
        } else {
            // Erreur de connexion
            errorDiv.textContent = result.error || 'Identifiants incorrects';
            errorDiv.classList.add('show');
            loginBtn.disabled = false;
            loginBtn.textContent = 'Se connecter';
        }
    } catch (error) {
        console.error('Erreur login:', error);
        errorDiv.textContent = 'Erreur de connexion. Veuillez réessayer.';
        errorDiv.classList.add('show');
        loginBtn.disabled = false;
        loginBtn.textContent = 'Se connecter';
    }
});

/**
 * Déconnexion
 */
async function logout() {
    try {
        await fetch('/api/admin/logout', {
            method: 'POST'
        });
        
        showLogin();
        
        // Réinitialiser le formulaire
        document.getElementById('login-form').reset();
        document.getElementById('table-body').innerHTML = '';
        document.getElementById('total-count').textContent = '-';
    } catch (error) {
        console.error('Erreur logout:', error);
    }
}

// ============================================
// DONNÉES
// ============================================

/**
 * Formate une date ISO en format lisible
 */
function formatDate(isoString) {
    if (!isoString) return '-';
    
    try {
        const date = new Date(isoString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        
        return `${day}/${month}/${year} ${hours}:${minutes}`;
    } catch (e) {
        return isoString;
    }
}

/**
 * Tronque un texte long
 */
function truncate(text, maxLength = 50) {
    if (!text) return '-';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

/**
 * Charge les données depuis l'API
 */
async function loadData() {
    const loading = document.getElementById('loading');
    const tableWrapper = document.getElementById('table-wrapper');
    const emptyState = document.getElementById('empty-state');
    
    loading.style.display = 'block';
    tableWrapper.style.display = 'none';
    emptyState.style.display = 'none';
    
    try {
        const response = await fetch('/api/admin/data');
        
        if (!response.ok) {
            if (response.status === 403) {
                // Session expirée
                showLogin();
                return;
            }
            throw new Error('Erreur chargement données');
        }
        
        const result = await response.json();
        
        document.getElementById('total-count').textContent = result.total;
        
        if (result.data && result.data.length > 0) {
            renderTable(result.data);
            tableWrapper.style.display = 'block';
        } else {
            emptyState.style.display = 'block';
        }
        
    } catch (error) {
        console.error('Erreur:', error);
        emptyState.style.display = 'block';
    } finally {
        loading.style.display = 'none';
    }
}

/**
 * Affiche les données dans le tableau
 */
function renderTable(data) {
    const tbody = document.getElementById('table-body');
    tbody.innerHTML = '';
    
    data.forEach((row) => {
        const tr = document.createElement('tr');
        
        // Timestamp
        const tdTimestamp = document.createElement('td');
        tdTimestamp.style.fontSize = '0.9rem';
        tdTimestamp.style.color = '#666';
        tdTimestamp.textContent = formatDate(row.timestamp);
        tr.appendChild(tdTimestamp);
        
        // Prénom
        const tdPrenom = document.createElement('td');
        tdPrenom.textContent = row.prenom || '-';
        tr.appendChild(tdPrenom);
        
        // Nom
        const tdNom = document.createElement('td');
        tdNom.textContent = row.nom || '-';
        tr.appendChild(tdNom);
        
        // Email
        const tdEmail = document.createElement('td');
        tdEmail.style.color = '#c41e3a';
        tdEmail.style.fontWeight = '500';
        tdEmail.textContent = row.email || '-';
        tr.appendChild(tdEmail);
        
        // WhatsApp
        const tdWhatsApp = document.createElement('td');
        tdWhatsApp.textContent = row.whatsapp || '-';
        tr.appendChild(tdWhatsApp);
        
        // Profil
        const tdProfil = document.createElement('td');
        tdProfil.textContent = row.profil || '-';
        tr.appendChild(tdProfil);
        
        // Zone
        const tdZone = document.createElement('td');
        tdZone.textContent = row.zone || '-';
        tr.appendChild(tdZone);
        
        // LinkedIn
        const tdLinkedIn = document.createElement('td');
        if (row.linkedin) {
            const link = document.createElement('a');
            link.href = row.linkedin;
            link.target = '_blank';
            link.style.color = '#0077b5';
            link.style.textDecoration = 'none';
            link.textContent = 'Voir profil';
            link.onmouseover = () => link.style.textDecoration = 'underline';
            link.onmouseout = () => link.style.textDecoration = 'none';
            tdLinkedIn.appendChild(link);
        } else {
            tdLinkedIn.textContent = '-';
        }
        tr.appendChild(tdLinkedIn);
        
        // Commentaire
        const tdCommentaire = document.createElement('td');
        tdCommentaire.textContent = truncate(row.commentaire, 50);
        tr.appendChild(tdCommentaire);
        
        // IP
        const tdIp = document.createElement('td');
        tdIp.textContent = row.ip || '-';
        tr.appendChild(tdIp);
        
        tbody.appendChild(tr);
    });
}

/**
 * Export CSV
 */
async function exportCSV() {
    try {
        const response = await fetch('/api/admin/export');
        
        if (!response.ok) {
            if (response.status === 403) {
                showLogin();
                return;
            }
            throw new Error('Erreur export');
        }
        
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        
        const dateStr = new Date().toISOString().split('T')[0].replace(/-/g, '');
        a.download = `maas-waitlist-${dateStr}.csv`;
        
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
    } catch (error) {
        console.error('Erreur export:', error);
        alert('Erreur lors de l\'export CSV');
    }
}

// ============================================
// INITIALISATION
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    
    // Auto-refresh toutes les 30 secondes si connecté
    setInterval(() => {
        if (document.getElementById('dashboard').classList.contains('active')) {
            loadData();
        }
    }, 30000);
});
