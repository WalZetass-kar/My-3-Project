// ===== AUTHENTICATION SYSTEM =====
// File ini menangani semua logic autentikasi

// ===== CONFIGURATION =====
const AUTH_CONFIG = {
    STORAGE_KEY: 'authData',
    SESSION_KEY: 'isAuthenticated',
    USER_KEY: 'currentUser',
    REMEMBER_KEY: 'rememberedUsername',
    DEFAULT_USERNAME: 'admin',
    DEFAULT_PASSWORD: 'admin123'
};

// ===== INITIALIZATION =====
// Inisialisasi data admin default jika belum ada
function initializeAuth() {
    const authData = getAuthData();
    
    if (!authData || !authData.username) {
        // Set default admin credentials
        const defaultAuth = {
            username: AUTH_CONFIG.DEFAULT_USERNAME,
            password: AUTH_CONFIG.DEFAULT_PASSWORD,
            createdAt: new Date().toISOString()
        };
        
        localStorage.setItem(AUTH_CONFIG.STORAGE_KEY, JSON.stringify(defaultAuth));
        console.log('✅ Default admin credentials initialized');
    }
}

// Jalankan inisialisasi
initializeAuth();

// ===== AUTHENTICATION FUNCTIONS =====

/**
 * Cek apakah user sudah login
 */
function isAuthenticated() {
    const isAuth = localStorage.getItem(AUTH_CONFIG.SESSION_KEY);
    return isAuth === 'true';
}

/**
 * Get auth data dari localStorage
 */
function getAuthData() {
    try {
        const data = localStorage.getItem(AUTH_CONFIG.STORAGE_KEY);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Error getting auth data:', error);
        return null;
    }
}

/**
 * Get current logged in user
 */
function getCurrentUser() {
    try {
        const user = localStorage.getItem(AUTH_CONFIG.USER_KEY);
        return user ? JSON.parse(user) : null;
    } catch (error) {
        console.error('Error getting current user:', error);
        return null;
    }
}

/**
 * Handle login process
 */
function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('rememberMe').checked;
    const messageEl = document.getElementById('loginMessage');
    const btnLogin = document.getElementById('btnLogin');
    
    // Validasi input
    if (!username || !password) {
        showLoginMessage('Username dan password harus diisi!', 'error');
        return;
    }
    
    // Show loading
    btnLogin.disabled = true;
    btnLogin.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Memproses...';
    
    // Simulasi delay (untuk UX yang lebih baik)
    setTimeout(() => {
        // Get stored credentials
        const authData = getAuthData();
        
        // Verify credentials
        if (username === authData.username && password === authData.password) {
            // Login berhasil
            const userData = {
                username: username,
                loginTime: new Date().toISOString()
            };
            
            // Set session
            localStorage.setItem(AUTH_CONFIG.SESSION_KEY, 'true');
            localStorage.setItem(AUTH_CONFIG.USER_KEY, JSON.stringify(userData));
            
            // Remember username jika dicentang
            if (rememberMe) {
                localStorage.setItem(AUTH_CONFIG.REMEMBER_KEY, username);
            } else {
                localStorage.removeItem(AUTH_CONFIG.REMEMBER_KEY);
            }
            
            showLoginMessage('Login berhasil! Mengalihkan...', 'success');
            
            // Redirect ke dashboard
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);
            
        } else {
            // Login gagal
            showLoginMessage('Username atau password salah!', 'error');
            btnLogin.disabled = false;
            btnLogin.innerHTML = '<i class="fas fa-sign-in-alt"></i> Masuk';
            
            // Shake animation
            const form = document.getElementById('loginForm');
            form.classList.add('shake');
            setTimeout(() => form.classList.remove('shake'), 500);
        }
    }, 800);
}

/**
 * Handle logout process
 */
function handleLogout() {
    const confirmed = confirm('Yakin ingin logout?');
    
    if (confirmed) {
        // Clear session
        localStorage.removeItem(AUTH_CONFIG.SESSION_KEY);
        localStorage.removeItem(AUTH_CONFIG.USER_KEY);
        
        // Redirect ke login
        window.location.href = 'login.html';
    }
}

/**
 * Change password
 */
function changePassword(currentPassword, newPassword) {
    const authData = getAuthData();
    
    // Verify current password
    if (currentPassword !== authData.password) {
        return {
            success: false,
            message: 'Password saat ini salah!'
        };
    }
    
    // Validate new password
    if (newPassword.length < 6) {
        return {
            success: false,
            message: 'Password baru minimal 6 karakter!'
        };
    }
    
    // Update password
    authData.password = newPassword;
    authData.updatedAt = new Date().toISOString();
    
    try {
        localStorage.setItem(AUTH_CONFIG.STORAGE_KEY, JSON.stringify(authData));
        return {
            success: true,
            message: 'Password berhasil diubah!'
        };
    } catch (error) {
        return {
            success: false,
            message: 'Gagal mengubah password: ' + error.message
        };
    }
}

/**
 * Show login message
 */
function showLoginMessage(message, type = 'info') {
    const messageEl = document.getElementById('loginMessage');
    if (!messageEl) return;
    
    messageEl.textContent = message;
    messageEl.className = `login-message ${type}`;
    messageEl.style.display = 'block';
    
    // Auto hide after 5 seconds
    setTimeout(() => {
        messageEl.style.display = 'none';
    }, 5000);
}

/**
 * Show dashboard message
 */
function showDashboardMessage(message, type = 'success') {
    const messageEl = document.getElementById('saveMessage');
    if (!messageEl) return;
    
    messageEl.textContent = message;
    messageEl.className = `save-message ${type}`;
    messageEl.style.display = 'block';
    
    // Auto hide after 3 seconds
    setTimeout(() => {
        messageEl.style.opacity = '0';
        setTimeout(() => {
            messageEl.style.display = 'none';
            messageEl.style.opacity = '1';
        }, 300);
    }, 3000);
}

// ===== UTILITY FUNCTIONS =====

/**
 * Format date untuk display
 */
function formatDate(dateString) {
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('id-ID', options);
}

/**
 * Log activity (untuk debugging)
 */
function logActivity(action, details = '') {
    const user = getCurrentUser();
    const log = {
        action: action,
        user: user ? user.username : 'anonymous',
        details: details,
        timestamp: new Date().toISOString()
    };
    console.log('📝 Activity:', log);
}

// ===== CONSOLE INFO =====
console.log(`
╔════════════════════════════════════════╗
║  Authentication System Ready 🔐        ║
╚════════════════════════════════════════╝

📚 Available Functions:
- isAuthenticated()           : Cek status login
- handleLogin(event)          : Proses login
- handleLogout()              : Proses logout
- changePassword(old, new)    : Ubah password
- getCurrentUser()            : Get user info

🔑 Default Credentials:
Username: ${AUTH_CONFIG.DEFAULT_USERNAME}
Password: ${AUTH_CONFIG.DEFAULT_PASSWORD}
`);
