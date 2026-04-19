// ===== DASHBOARD MANAGEMENT SYSTEM =====
// File ini menangani semua logic dashboard dan CRUD landing page

// ===== CONFIGURATION =====
const DASHBOARD_CONFIG = {
    LANDING_DATA_KEY: 'landingPageData',
    MAX_IMAGE_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
};

// ===== INITIALIZATION =====
function initDashboard() {
    console.log('🚀 Initializing dashboard...');
    
    // Load user info
    loadUserInfo();
    
    // Load landing page data
    loadLandingData();
    
    // Setup form handlers
    setupFormHandlers();
    
    console.log('✅ Dashboard initialized');
}

// ===== USER INFO =====
function loadUserInfo() {
    const user = getCurrentUser();
    if (user) {
        const usernameEl = document.getElementById('adminUsername');
        if (usernameEl) {
            usernameEl.textContent = user.username;
        }
    }
}

// ===== LANDING PAGE DATA MANAGEMENT =====

/**
 * Get landing page data dari localStorage
 */
function getLandingData() {
    try {
        const data = localStorage.getItem(DASHBOARD_CONFIG.LANDING_DATA_KEY);
        return data ? JSON.parse(data) : getDefaultLandingData();
    } catch (error) {
        console.error('Error getting landing data:', error);
        return getDefaultLandingData();
    }
}

/**
 * Default landing page data
 */
function getDefaultLandingData() {
    return {
        hero: {
            title: 'Selamat Datang di Website Kami',
            subtitle: 'Solusi Terbaik untuk Bisnis Anda',
            description: 'Kami menyediakan layanan terbaik untuk membantu bisnis Anda berkembang dengan teknologi modern dan inovatif.',
            image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format',
            ctaText: 'Mulai Sekarang',
            ctaLink: '#contact'
        },
        about: {
            title: 'Tentang Kami',
            content: 'Kami adalah tim profesional yang berdedikasi untuk memberikan solusi terbaik bagi klien kami. Dengan pengalaman bertahun-tahun di industri, kami memahami kebutuhan bisnis modern.\n\nVisi kami adalah menjadi mitra terpercaya dalam transformasi digital bisnis Anda. Kami berkomitmen untuk memberikan layanan berkualitas tinggi dengan pendekatan yang inovatif dan customer-centric.',
            image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format'
        },
        contact: {
            email: 'info@example.com',
            phone: '+62 812 3456 7890',
            address: 'Jl. Contoh No. 123, Jakarta, Indonesia'
        },
        updatedAt: new Date().toISOString()
    };
}

/**
 * Save landing page data ke localStorage
 */
function saveLandingData(data) {
    try {
        data.updatedAt = new Date().toISOString();
        localStorage.setItem(DASHBOARD_CONFIG.LANDING_DATA_KEY, JSON.stringify(data));
        logActivity('UPDATE_LANDING_DATA', 'Landing page data updated');
        return true;
    } catch (error) {
        console.error('Error saving landing data:', error);
        return false;
    }
}

/**
 * Load landing data ke form
 */
function loadLandingData() {
    const data = getLandingData();
    
    // Hero section
    document.getElementById('heroTitle').value = data.hero.title || '';
    document.getElementById('heroSubtitle').value = data.hero.subtitle || '';
    document.getElementById('heroDescription').value = data.hero.description || '';
    document.getElementById('heroCTA').value = data.hero.ctaText || '';
    document.getElementById('heroCTALink').value = data.hero.ctaLink || '';
    
    // Show hero image preview if exists
    if (data.hero.image) {
        showImagePreview('heroImagePreview', data.hero.image);
    }
    
    // About section
    document.getElementById('aboutTitle').value = data.about.title || '';
    document.getElementById('aboutContent').value = data.about.content || '';
    
    // Show about image preview if exists
    if (data.about.image) {
        showImagePreview('aboutImagePreview', data.about.image);
    }
    
    // Contact section
    document.getElementById('contactEmail').value = data.contact.email || '';
    document.getElementById('contactPhone').value = data.contact.phone || '';
    document.getElementById('contactAddress').value = data.contact.address || '';
}

// ===== FORM HANDLERS =====

function setupFormHandlers() {
    // Landing form submit
    const landingForm = document.getElementById('landingForm');
    if (landingForm) {
        landingForm.addEventListener('submit', handleLandingFormSubmit);
    }
    
    // Change password form
    const passwordForm = document.getElementById('changePasswordForm');
    if (passwordForm) {
        passwordForm.addEventListener('submit', handlePasswordChange);
    }
}

/**
 * Handle landing form submit
 */
async function handleLandingFormSubmit(event) {
    event.preventDefault();
    
    // Show loading
    const submitBtn = event.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Menyimpan...';
    
    try {
        // Get current data
        const data = getLandingData();
        
        // Update hero section
        data.hero.title = document.getElementById('heroTitle').value.trim();
        data.hero.subtitle = document.getElementById('heroSubtitle').value.trim();
        data.hero.description = document.getElementById('heroDescription').value.trim();
        data.hero.ctaText = document.getElementById('heroCTA').value.trim();
        data.hero.ctaLink = document.getElementById('heroCTALink').value.trim();
        
        // Handle hero image upload
        const heroImageFile = document.getElementById('heroImage').files[0];
        if (heroImageFile) {
            const heroImageBase64 = await handleImageUploadAsync(heroImageFile);
            if (heroImageBase64) {
                data.hero.image = heroImageBase64;
            }
        }
        
        // Update about section
        data.about.title = document.getElementById('aboutTitle').value.trim();
        data.about.content = document.getElementById('aboutContent').value.trim();
        
        // Handle about image upload
        const aboutImageFile = document.getElementById('aboutImage').files[0];
        if (aboutImageFile) {
            const aboutImageBase64 = await handleImageUploadAsync(aboutImageFile);
            if (aboutImageBase64) {
                data.about.image = aboutImageBase64;
            }
        }
        
        // Update contact section
        data.contact.email = document.getElementById('contactEmail').value.trim();
        data.contact.phone = document.getElementById('contactPhone').value.trim();
        data.contact.address = document.getElementById('contactAddress').value.trim();
        
        // Save data
        if (saveLandingData(data)) {
            showDashboardMessage('✅ Perubahan berhasil disimpan!', 'success');
            
            // Clear file inputs
            document.getElementById('heroImage').value = '';
            document.getElementById('aboutImage').value = '';
        } else {
            showDashboardMessage('❌ Gagal menyimpan perubahan!', 'error');
        }
        
    } catch (error) {
        console.error('Error saving landing data:', error);
        showDashboardMessage('❌ Terjadi kesalahan: ' + error.message, 'error');
    } finally {
        // Restore button
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
    }
}

/**
 * Handle password change
 */
function handlePasswordChange(event) {
    event.preventDefault();
    
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // Validate
    if (!currentPassword || !newPassword || !confirmPassword) {
        alert('Semua field harus diisi!');
        return;
    }
    
    if (newPassword !== confirmPassword) {
        alert('Password baru dan konfirmasi tidak cocok!');
        return;
    }
    
    // Change password
    const result = changePassword(currentPassword, newPassword);
    
    if (result.success) {
        alert('✅ ' + result.message);
        event.target.reset();
    } else {
        alert('❌ ' + result.message);
    }
}

// ===== IMAGE UPLOAD HANDLERS =====

/**
 * Handle image upload (sync version for onchange)
 */
function handleImageUpload(event, previewId) {
    const file = event.target.files[0];
    if (!file) return;
    
    // Validate file
    const validation = validateImageFile(file);
    if (!validation.valid) {
        alert(validation.message);
        event.target.value = '';
        return;
    }
    
    // Show preview
    const reader = new FileReader();
    reader.onload = function(e) {
        showImagePreview(previewId, e.target.result);
    };
    reader.readAsDataURL(file);
}

/**
 * Handle image upload (async version for form submit)
 */
function handleImageUploadAsync(file) {
    return new Promise((resolve, reject) => {
        // Validate file
        const validation = validateImageFile(file);
        if (!validation.valid) {
            reject(new Error(validation.message));
            return;
        }
        
        const reader = new FileReader();
        
        reader.onload = function(e) {
            resolve(e.target.result);
        };
        
        reader.onerror = function(error) {
            reject(error);
        };
        
        reader.readAsDataURL(file);
    });
}

/**
 * Validate image file
 */
function validateImageFile(file) {
    // Check size
    if (file.size > DASHBOARD_CONFIG.MAX_IMAGE_SIZE) {
        return {
            valid: false,
            message: `File terlalu besar! Maksimal ${DASHBOARD_CONFIG.MAX_IMAGE_SIZE / 1024 / 1024}MB`
        };
    }
    
    // Check type
    if (!DASHBOARD_CONFIG.ALLOWED_IMAGE_TYPES.includes(file.type)) {
        return {
            valid: false,
            message: 'Tipe file tidak didukung! Gunakan JPG, PNG, GIF, atau WebP'
        };
    }
    
    return { valid: true };
}

/**
 * Show image preview
 */
function showImagePreview(previewId, imageSrc) {
    const previewEl = document.getElementById(previewId);
    if (!previewEl) return;
    
    previewEl.innerHTML = `
        <div class="preview-wrapper">
            <img src="${imageSrc}" alt="Preview">
            <button type="button" class="btn-remove-preview" onclick="removeImagePreview('${previewId}')">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
}

/**
 * Remove image preview
 */
function removeImagePreview(previewId) {
    const previewEl = document.getElementById(previewId);
    if (previewEl) {
        previewEl.innerHTML = '';
    }
    
    // Clear corresponding file input
    if (previewId === 'heroImagePreview') {
        document.getElementById('heroImage').value = '';
    } else if (previewId === 'aboutImagePreview') {
        document.getElementById('aboutImage').value = '';
    }
}

// ===== UI FUNCTIONS =====

/**
 * Toggle sidebar (mobile)
 */
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('active');
}

/**
 * Show section
 */
function showSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show selected section
    const targetSection = document.getElementById(sectionName + 'Section');
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // Update nav items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    event.target.closest('.nav-item').classList.add('active');
    
    // Update page title
    const titles = {
        'landing': 'Landing Page Editor',
        'settings': 'Pengaturan'
    };
    document.getElementById('pageTitle').textContent = titles[sectionName] || 'Dashboard';
    
    // Close sidebar on mobile
    if (window.innerWidth <= 768) {
        toggleSidebar();
    }
}

/**
 * Reset form
 */
function resetForm() {
    if (confirm('Yakin ingin mereset form? Perubahan yang belum disimpan akan hilang.')) {
        loadLandingData();
        showDashboardMessage('Form direset ke data terakhir yang disimpan', 'info');
    }
}

/**
 * Export data
 */
function exportData() {
    const data = {
        landingPage: getLandingData(),
        exportedAt: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `landing-page-backup-${Date.now()}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    
    alert('✅ Data berhasil diexport!');
}

/**
 * Clear all data
 */
function clearAllData() {
    const confirmed = confirm('⚠️ PERINGATAN!\n\nIni akan menghapus SEMUA data landing page dan mengembalikan ke default.\n\nYakin ingin melanjutkan?');
    
    if (confirmed) {
        const doubleConfirm = confirm('Konfirmasi sekali lagi: Hapus semua data?');
        
        if (doubleConfirm) {
            localStorage.removeItem(DASHBOARD_CONFIG.LANDING_DATA_KEY);
            loadLandingData();
            alert('✅ Semua data berhasil dihapus dan dikembalikan ke default!');
        }
    }
}

// ===== CONSOLE INFO =====
console.log(`
╔════════════════════════════════════════╗
║  Dashboard System Ready 📊             ║
╚════════════════════════════════════════╝

📚 Available Functions:
- loadLandingData()       : Load data ke form
- saveLandingData(data)   : Save data ke localStorage
- exportData()            : Export data ke JSON
- clearAllData()          : Reset ke default

💾 Storage Key: ${DASHBOARD_CONFIG.LANDING_DATA_KEY}
`);
