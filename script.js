document.addEventListener('DOMContentLoaded', function() {
    initThemeToggle();
    initNavigation();
    initBackToTop();
    initMobileMenu();
    
    if (window.location.pathname.includes('quickmath.html')) {
        initGame();
    }
    if (window.location.pathname.includes('sertifikat.html')) {
        initCertificates();
    }
    if (window.location.pathname.includes('portofolio.html')) {
        initPortfolio();
    }
    
    setActiveNavLink();
});

function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        link.classList.remove('active');
        if (href === currentPage) {
            link.classList.add('active');
        }
    });
}

function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;
    
    const savedTheme = localStorage.getItem('theme') || 'light-mode';
    body.className = savedTheme;
    
    themeToggle.addEventListener('click', function() {
        if (body.classList.contains('light-mode')) {
            body.classList.remove('light-mode');
            body.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark-mode');
        } else {
            body.classList.remove('dark-mode');
            body.classList.add('light-mode');
            localStorage.setItem('theme', 'light-mode');
        }
    });
}

function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const navMenu = document.getElementById('navMenu');
            if (navMenu) {
                navMenu.classList.remove('active');
            }
            
            const toggleIcon = document.querySelector('.nav-toggle i');
            if (toggleIcon) {
                toggleIcon.classList.remove('fa-times');
                toggleIcon.classList.add('fa-bars');
            }
        });
    });
}

function initBackToTop() {
    const backToTop = document.getElementById('backToTop');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });
    
    backToTop.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

function initMobileMenu() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            
            const icon = this.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }
    
    document.addEventListener('click', function(e) {
        if (navToggle && !navToggle.contains(e.target) && !navMenu.contains(e.target)) {
            navMenu.classList.remove('active');
            const icon = navToggle.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        }
    });
}

function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

const ADMIN_USERNAME = "WalDevelop";
const ADMIN_PASSWORD = "kartika";
let isLoggedIn = false;
let currentCert = null;
let currentCertCategory = 'cisco';
let certLinks = {
    cisco: {
        intro: { name: 'Introduction to Cybersecurity', link: '', badge: '', hours: 15 },
        network: { name: 'Network Defense', link: '', badge: '', hours: 20 },
        endpoint: { name: 'Endpoint Security', link: '', badge: '', hours: 15 },
        threat: { name: 'Cyber Threat Management', link: '', badge: '', hours: 15 },
        ethical: { name: 'Ethical Hacker', link: '', badge: '', hours: 25 }
    },
    komdigi: {
        digital: { name: 'Digital Talent Scholarship', link: '', badge: '', hours: 40 },
        ai: { name: 'Artificial Intelligence Fundamentals', link: '', badge: '', hours: 30 },
        cybersecurity: { name: 'Cybersecurity Awareness', link: '', badge: '', hours: 20 },
        networking: { name: 'Network Administrator', link: '', badge: '', hours: 35 },
        cloud: { name: 'Cloud Computing Basics', link: '', badge: '', hours: 25 }
    },
    bisaai: {
        intro: { name: 'AI Introduction', link: '', badge: '', hours: 10 },
        machine: { name: 'Machine Learning Dasar', link: '', badge: '', hours: 25 },
        python: { name: 'Python untuk AI', link: '', badge: '', hours: 20 },
        nlp: { name: 'Natural Language Processing', link: '', badge: '', hours: 30 },
        vision: { name: 'Computer Vision', link: '', badge: '', hours: 30 }
    }
};

function initCertificates() {
    loadCertLinks();
    checkLoginStatus();
    initCertificateCategories();
    initCertCategorySelect();
    initCertificateFileInputs();
}

function initCertificateFileInputs() {
    const certFile = document.getElementById('certFile');
    const badgeFile = document.getElementById('badgeFile');
    const preview = document.getElementById('certBadgePreview');
    
    if (certFile) {
        certFile.addEventListener('change', function() {
            if (this.files.length > 0) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    if (preview) {
                        preview.innerHTML = `<div class="file-preview" style="font-size: 12px; color: var(--text-secondary);"><i class="fas fa-check-circle" style="color: #48BB78;"></i> File dipilih: ${this.files[0].name}</div>`;
                    }
                };
                reader.readAsDataURL(this.files[0]);
            }
        });
    }
    
    if (badgeFile) {
        badgeFile.addEventListener('change', function() {
            if (this.files.length > 0 && preview) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    preview.innerHTML = `<img src="${e.target.result}" alt="Preview" class="image-preview" style="max-width: 200px; border-radius: 5px;">`;
                };
                reader.readAsDataURL(this.files[0]);
            }
        });
    }
}

function loadCertLinks() {
    const saved = localStorage.getItem('certLinks');
    if (saved) {
        certLinks = JSON.parse(saved);
    }
    updateCertCategorySelect();
    filterCertificates('cisco');
}

function saveCertLinks() {
    localStorage.setItem('certLinks', JSON.stringify(certLinks));
}

function checkLoginStatus() {
    const savedStatus = localStorage.getItem('adminLoggedIn');
    if (savedStatus === 'true') {
        isLoggedIn = true;
        showAdminPanel();
        updateAdminButton();
    }
}

window.openLoginModal = function() {
    if (isLoggedIn) {
        showAdminPanel();
    } else {
        const modal = document.getElementById('loginModal');
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        document.getElementById('username').value = '';
        document.getElementById('password').value = '';
        document.getElementById('loginError').style.display = 'none';
    }
}

window.closeLoginModal = function() {
    const modal = document.getElementById('loginModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

window.handleLogin = function() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorElement = document.getElementById('loginError');
    
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        isLoggedIn = true;
        localStorage.setItem('adminLoggedIn', 'true');
        closeLoginModal();
        showAdminPanel();
        updateAdminButton();
        showToast('Login berhasil! Selamat datang Admin.', 'success');
    } else {
        errorElement.style.display = 'block';
        document.getElementById('username').style.borderColor = '#F56565';
        document.getElementById('password').style.borderColor = '#F56565';
    }
}

function showAdminPanel() {
    const adminPanel = document.getElementById('adminPanel');
    adminPanel.style.display = 'block';
    adminPanel.classList.add('visible');
}

window.closeAdminPanel = function() {
    const adminPanel = document.getElementById('adminPanel');
    adminPanel.style.display = 'none';
    adminPanel.classList.remove('visible');
}

window.logoutAdmin = function() {
    isLoggedIn = false;
    localStorage.removeItem('adminLoggedIn');
    closeAdminPanel();
    updateAdminButton();
    showToast('Logout berhasil!', 'info');
}

function updateAdminButton() {
    const adminBtn = document.getElementById('adminLoginBtn');
    const adminStatus = document.getElementById('adminStatus');
    
    if (adminBtn && adminStatus) {
        if (isLoggedIn) {
            adminBtn.innerHTML = '<i class="fas fa-user-shield"></i> Admin Panel (Active)';
            adminStatus.innerHTML = 'Anda sudah login sebagai admin';
            adminStatus.style.color = '#48BB78';
        } else {
            adminBtn.innerHTML = '<i class="fas fa-lock"></i> Admin Login';
            adminStatus.innerHTML = 'Klik untuk login sebagai admin';
            adminStatus.style.color = 'var(--text-secondary)';
        }
    }
}

function initCertCategorySelect() {
    const categorySelect = document.getElementById('certCategory');
    if (categorySelect) {
        categorySelect.addEventListener('change', function() {
            updateCertCategorySelect();
        });
    }
}

function updateCertCategorySelect() {
    const categorySelect = document.getElementById('certCategory');
    if (!categorySelect) return;
    
    const category = categorySelect.value;
    const certSelect = document.getElementById('certSelect');
    if (!certSelect) return;
    
    let options = '';
    const certs = certLinks[category];
    for (let key in certs) {
        options += `<option value="${key}">${certs[key].name}</option>`;
    }
    certSelect.innerHTML = options;
}

function initCertificateCategories() {
    const categoryBtns = document.querySelectorAll('.category-btn');
    
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            filterCertificates(category);
        });
    });
}

function filterCertificates(category) {
    currentCertCategory = category;
    
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    const activeBtn = document.querySelector(`.category-btn[data-category="${category}"]`);
    if (activeBtn) activeBtn.classList.add('active');
    
    renderCertificates();
}

function renderCertificates() {
    const grid = document.getElementById('certificatesGrid');
    const totalSpan = document.getElementById('totalCertificates');
    const hoursSpan = document.getElementById('totalHours');
    if (!grid) return;
    
    const certs = certLinks[currentCertCategory];
    let totalHours = 0;
    let html = '';
    
    for (let key in certs) {
        const cert = certs[key];
        totalHours += cert.hours || 0;
        
        const linkHtml = cert.link ? 
            `<a href="${cert.link}" target="_blank" class="cert-link" id="link-${currentCertCategory}-${key}"><i class="fas fa-external-link-alt"></i> Buka Sertifikat</a>` : 
            '';
        
        const badgeHtml = cert.badge ? 
            `<img src="${cert.badge}" alt="Badge" class="cert-badge-img">` : 
            '';
        
        const adminActions = isLoggedIn ? `
            <div class="cert-item-actions">
                <button onclick="editCertificate('${currentCertCategory}', '${key}')" class="btn-edit-portfolio" title="Edit">
                    <i class="fas fa-edit"></i>
                </button>
            </div>
        ` : '';
        
        let iconClass = 'fa-shield-halved';
        if (currentCertCategory === 'komdigi') iconClass = 'fa-building';
        if (currentCertCategory === 'bisaai') iconClass = 'fa-robot';
        
        html += `
            <div class="certificate-card" id="cert-${currentCertCategory}-${key}">
                ${adminActions}
                <div class="certificate-icon">
                    <i class="fas ${iconClass}"></i>
                </div>
                <div class="certificate-content">
                    <h3>${cert.name}</h3>
                    <p class="cert-issuer">${currentCertCategory === 'cisco' ? 'Cisco Networking Academy' : currentCertCategory === 'komdigi' ? 'Kementerian Komdigi' : 'Bisa AI Academy'}</p>
                    <span class="cert-year">2026</span>
                    <div class="cert-actions">
                        <button class="btn-view-cert" onclick="viewCertificate('${currentCertCategory}', '${key}')">
                            <i class="fas fa-eye"></i> Lihat Sertifikat
                        </button>
                        ${linkHtml}
                    </div>
                    <div class="cert-badge-container" id="badge-${currentCertCategory}-${key}">
                        ${badgeHtml}
                    </div>
                </div>
            </div>
        `;
    }
    
    grid.innerHTML = html;
    if (totalSpan) totalSpan.innerText = Object.keys(certs).length.toString();
    if (hoursSpan) hoursSpan.innerText = totalHours + '+';
}

window.viewCertificate = function(category, key) {
    const modal = document.getElementById('certModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    
    const cert = certLinks[category][key];
    if (!cert) return;
    
    let issuer = '';
    if (category === 'cisco') issuer = 'Cisco Networking Academy';
    else if (category === 'komdigi') issuer = 'Kementerian Komdigi';
    else issuer = 'Bisa AI Academy';
    
    modalTitle.textContent = cert.name;
    currentCert = { category, key };
    
    let content = '';
    if (cert.link) {
        if (cert.link.toLowerCase().includes('.pdf') || cert.link.includes('drive.google') || cert.link.includes('docs.google')) {
            let src = cert.link;
            if (cert.link.includes('drive.google.com')) {
                const fileId = cert.link.match(/[-\w]{25,}/);
                if (fileId) {
                    src = `https://drive.google.com/file/d/${fileId[0]}/preview`;
                }
            }
            content = `
                <div class="certificate-viewer">
                    <iframe src="${src}" width="100%" height="500px" style="border: none; border-radius: 10px;"></iframe>
                    <p style="margin-top: 20px;">
                        <a href="${cert.link}" target="_blank" class="btn-view-cert" style="display: inline-block;">
                            <i class="fas fa-external-link-alt"></i> Buka di Tab Baru
                        </a>
                    </p>
                </div>
            `;
        } else {
            content = `
                <div class="certificate-viewer">
                    <img src="${cert.link}" alt="${cert.name}" style="max-width: 100%; border-radius: 10px; box-shadow: var(--shadow);">
                    <p style="margin-top: 20px;">
                        <a href="${cert.link}" target="_blank" class="btn-view-cert" style="display: inline-block;">
                            <i class="fas fa-external-link-alt"></i> Buka Gambar Fullscreen
                        </a>
                    </p>
                </div>
            `;
        }
    } else {
        content = `
            <div class="certificate-placeholder">
                <i class="fas fa-clock"></i>
                <h4>COMING SOON</h4>
                <div style="margin: 30px 0;">
                    <span style="font-size: 4rem;">⏳</span>
                </div>
                <p style="font-size: 1.3rem; margin: 20px 0;">${cert.name}</p>
                <p style="font-size: 1rem; color: var(--text-secondary);">${issuer}</p>
                <p style="margin-top: 20px; font-style: italic;">Sertifikat akan segera tersedia</p>
            </div>
        `;
    }
    
    modalBody.innerHTML = content;
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

window.closeModal = function() {
    const modal = document.getElementById('certModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

window.editCertificate = function(category, key) {
    if (!isLoggedIn) {
        showToast('Anda harus login terlebih dahulu!', 'error');
        openLoginModal();
        return;
    }
    
    document.getElementById('certCategory').value = category;
    updateCertCategorySelect();
    
    setTimeout(() => {
        document.getElementById('certSelect').value = key;
    }, 100);
    
    const cert = certLinks[category][key];
    const preview = document.getElementById('certBadgePreview');
    
    // Clear file inputs
    const certFile = document.getElementById('certFile');
    const badgeFile = document.getElementById('badgeFile');
    if (certFile) certFile.value = '';
    if (badgeFile) badgeFile.value = '';
    
    // Set URL fields (if link/badge are URLs, not Base64)
    if (cert.link && !cert.link.startsWith('data:')) {
        document.getElementById('certLink').value = cert.link;
    } else {
        document.getElementById('certLink').value = '';
    }
    
    if (cert.badge) {
        if (cert.badge.startsWith('data:')) {
            // It's a Base64 image
            if (preview) {
                preview.innerHTML = `<img src="${cert.badge}" alt="Preview" class="image-preview" style="max-width: 200px; border-radius: 5px;">`;
            }
        } else {
            // It's a URL
            document.getElementById('certImage').value = cert.badge;
            if (preview) {
                preview.innerHTML = `<img src="${cert.badge}" alt="Preview" class="image-preview" style="max-width: 200px; border-radius: 5px;">`;
            }
        }
    } else {
        document.getElementById('certImage').value = '';
        if (preview) preview.innerHTML = '';
    }
    
    showAdminPanel();
}

window.handleCertFileUpload = function(file) {
    return new Promise((resolve, reject) => {
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            showToast('File terlalu besar! Maksimal 5MB.', 'error');
            reject('File terlalu besar');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = (e) => {
            resolve(e.target.result); // Base64 string
        };
        reader.onerror = () => {
            showToast('Gagal membaca file!', 'error');
            reject('Gagal membaca file');
        };
        reader.readAsDataURL(file);
    });
}

window.handleBadgeFileUpload = function(file) {
    return new Promise((resolve, reject) => {
        const maxSize = 2 * 1024 * 1024; // 2MB
        if (file.size > maxSize) {
            showToast('Badge terlalu besar! Maksimal 2MB.', 'error');
            reject('File terlalu besar');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = (e) => {
            resolve(e.target.result); // Base64 string
        };
        reader.onerror = () => {
            showToast('Gagal membaca file!', 'error');
            reject('Gagal membaca file');
        };
        reader.readAsDataURL(file);
    });
}

window.saveCertificateLink = function() {
    if (!isLoggedIn) {
        showToast('Anda harus login terlebih dahulu!', 'error');
        openLoginModal();
        return;
    }
    
    const category = document.getElementById('certCategory').value;
    const certSelect = document.getElementById('certSelect');
    const certLink = document.getElementById('certLink');
    const certFile = document.getElementById('certFile');
    const certImage = document.getElementById('certImage');
    const badgeFile = document.getElementById('badgeFile');
    
    const selectedCert = certSelect.value;
    let linkValue = certLink.value.trim();
    let imageValue = certImage.value.trim();
    
    // Handle file uploads
    const promises = [];
    
    if (certFile && certFile.files.length > 0) {
        promises.push(
            window.handleCertFileUpload(certFile.files[0]).then(base64 => {
                linkValue = base64;
            })
        );
    }
    
    if (badgeFile && badgeFile.files.length > 0) {
        promises.push(
            window.handleBadgeFileUpload(badgeFile.files[0]).then(base64 => {
                imageValue = base64;
            })
        );
    }
    
    // Wait for all file uploads to complete
    Promise.all(promises).then(() => {
        if (selectedCert && certLinks[category] && certLinks[category][selectedCert]) {
            if (linkValue) {
                certLinks[category][selectedCert].link = linkValue;
            }
            if (imageValue) {
                certLinks[category][selectedCert].badge = imageValue;
            }
            saveCertLinks();
            
            if (currentCertCategory === category) {
                renderCertificates();
            }
            
            certLink.value = '';
            certFile.value = '';
            certImage.value = '';
            badgeFile.value = '';
            document.getElementById('certBadgePreview').innerHTML = '';
            showToast('Sertifikat berhasil disimpan!', 'success');
        }
    }).catch(() => {
        showToast('Gagal menyimpan sertifikat!', 'error');
    });
}

window.downloadCertificate = function() {
    if (currentCert && currentCert.category && currentCert.key) {
        const cert = certLinks[currentCert.category][currentCert.key];
        if (cert && cert.link) {
            window.open(cert.link, '_blank');
        } else {
            showToast('File sertifikat belum tersedia!', 'warning');
        }
    } else {
        showToast('File sertifikat belum tersedia!', 'warning');
    }
}

window.previewBadgeImage = function(url) {
    const preview = document.getElementById('certBadgePreview');
    if (!preview) return;
    if (url) {
        preview.innerHTML = `<img src="${url}" alt="Preview" class="image-preview" onerror="this.style.display='none'">`;
    } else {
        preview.innerHTML = '';
    }
}

window.onclick = function(event) {
    const certModal = document.getElementById('certModal');
    if (certModal && event.target === certModal) {
        closeModal();
    }
    
    const confirmModal = document.getElementById('confirmModal');
    if (confirmModal && event.target === confirmModal) {
        closeConfirmModal();
    }
    
    const loginModal = document.getElementById('loginModal');
    if (loginModal && event.target === loginModal) {
        closeLoginModal();
    }
    
    const portfolioLoginModal = document.getElementById('portfolioLoginModal');
    if (portfolioLoginModal && event.target === portfolioLoginModal) {
        closePortfolioLoginModal();
    }
}

document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeModal();
        closeConfirmModal();
        closeLoginModal();
        closePortfolioLoginModal();
    }
});

const PORTFOLIO_ADMIN_USERNAME = "WalDevelop";
const PORTFOLIO_ADMIN_PASSWORD = "kartika";
let isPortfolioLoggedIn = false;
let portfolioItems = [];
let currentPage = 1;
let itemsPerPage = 6;
let deleteId = null;
let currentFilter = 'all';
let currentSearch = '';
let currentSort = 'newest';

function initPortfolio() {
    loadPortfolioItems();
    checkPortfolioLoginStatus();
    initPortfolioFilters();
    initSearchAndSort();
}

function loadPortfolioItems() {
    const saved = localStorage.getItem('portfolioItems');
    if (saved) {
        portfolioItems = JSON.parse(saved);
    } else {
        portfolioItems = [
            {
                id: '1',
                category: 'individu',
                title: 'Project Web CV',
                description: 'Membangun website CV interaktif',
                image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=500&auto=format',
                link: 'https://github.com/waldevelop-afk/web-cv',
                createdAt: Date.now() - 3000000
            },
            {
                id: '2',
                category: 'individu',
                title: 'Game QuickMath',
                description: 'Game hitung cepat JavaScript',
                image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=500&auto=format',
                link: 'https://github.com/waldevelop-afk/quickmath-game',
                createdAt: Date.now() - 2000000
            },
            {
                id: '3',
                category: 'individu',
                title: 'UI Design Challenge',
                description: 'Mendesain tampilan aplikasi mobile',
                image: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=500&auto=format',
                link: 'https://github.com/waldevelop-afk/ui-design-challenge',
                createdAt: Date.now() - 1000000
            },
            {
                id: '4',
                category: 'organisasi',
                title: 'Panitia Seminar Teknologi',
                description: 'Menjadi koordinator acara seminar AI 2025',
                image: 'https://images.unsplash.com/photo-1540575467069-4f5f2d6f4b9a?w=500&auto=format',
                link: '',
                createdAt: Date.now() - 4000000
            },
            {
                id: '5',
                category: 'organisasi',
                title: 'Himpunan Mahasiswa',
                description: 'Anggota divisi pengembangan teknologi',
                image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=500&auto=format',
                link: '',
                createdAt: Date.now() - 3500000
            }
        ];
        savePortfolioItems();
    }
    renderPortfolioItems();
}

function savePortfolioItems() {
    localStorage.setItem('portfolioItems', JSON.stringify(portfolioItems));
}

function filterAndSortItems() {
    let filtered = [...portfolioItems];
    
    if (currentFilter !== 'all') {
        filtered = filtered.filter(item => item.category === currentFilter);
    }
    
    if (currentSearch) {
        filtered = filtered.filter(item => 
            item.title.toLowerCase().includes(currentSearch.toLowerCase()) || 
            item.description.toLowerCase().includes(currentSearch.toLowerCase())
        );
    }
    
    switch(currentSort) {
        case 'newest':
            filtered.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
            break;
        case 'oldest':
            filtered.sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
            break;
        case 'az':
            filtered.sort((a, b) => a.title.localeCompare(b.title));
            break;
        case 'za':
            filtered.sort((a, b) => b.title.localeCompare(a.title));
            break;
    }
    
    return filtered;
}

function renderPortfolioItems() {
    const grid = document.getElementById('portfolioGrid');
    const stats = document.getElementById('portfolioStats');
    const pagination = document.getElementById('portfolioPagination');
    if (!grid) return;
    
    const filtered = filterAndSortItems();
    const totalItems = filtered.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    
    if (currentPage > totalPages && totalPages > 0) {
        currentPage = totalPages;
    }
    
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedItems = filtered.slice(start, end);
    
    if (stats) {
        const filterText = currentFilter === 'all' ? 'semua' : currentFilter;
        stats.innerHTML = `Menampilkan <span>${paginatedItems.length}</span> dari <span>${totalItems}</span> portfolio (${filterText})`;
    }
    
    if (totalItems === 0) {
        grid.innerHTML = `
            <div class="empty-portfolio">
                <i class="fas fa-images"></i>
                <h3>Tidak ada portfolio</h3>
                <p>${isPortfolioLoggedIn ? 'Klik "Tambah Portfolio" untuk menambahkan kegiatan' : 'Tidak ada portfolio yang ditemukan'}</p>
            </div>
        `;
        if (pagination) pagination.innerHTML = '';
        return;
    }
    
    let html = '';
    paginatedItems.forEach(item => {
        const linkHtml = item.link ? 
            `<a href="${item.link}" target="_blank" class="github-link"><i class="fab fa-github"></i> Lihat Repository</a>` : 
            '';
        
        const adminActions = isPortfolioLoggedIn ? `
            <div class="portfolio-item-actions">
                <button onclick="editPortfolioItem('${item.id}')" class="btn-edit-portfolio" title="Edit">
                    <i class="fas fa-edit"></i>
                </button>
                <button onclick="showDeleteConfirm('${item.id}')" class="btn-delete-portfolio" title="Hapus">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        ` : '';
        
        html += `
            <div class="portfolio-item" data-category="${item.category}" data-id="${item.id}">
                ${adminActions}
                <div class="portfolio-image">
                    <img src="${item.image}" alt="${item.title}" onerror="this.src='https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=500&auto=format'">
                    <div class="portfolio-overlay">
                        <h3>${item.title}</h3>
                        <p>${item.description}</p>
                        ${linkHtml}
                    </div>
                </div>
            </div>
        `;
    });
    
    grid.innerHTML = html;
    
    if (pagination) {
        renderPagination(totalPages);
    }
}

function renderPagination(totalPages) {
    const pagination = document.getElementById('portfolioPagination');
    if (!pagination) return;
    
    if (totalPages <= 1) {
        pagination.innerHTML = '';
        return;
    }
    
    let html = '';
    
    html += `<button class="pagination-btn" onclick="changePage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>«</button>`;
    
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
            html += `<button class="pagination-btn ${i === currentPage ? 'active' : ''}" onclick="changePage(${i})">${i}</button>`;
        } else if (i === currentPage - 3 || i === currentPage + 3) {
            html += `<button class="pagination-btn" disabled>...</button>`;
        }
    }
    
    html += `<button class="pagination-btn" onclick="changePage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>»</button>`;
    
    pagination.innerHTML = html;
}

window.changePage = function(page) {
    const filtered = filterAndSortItems();
    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    
    if (page < 1 || page > totalPages) return;
    
    currentPage = page;
    renderPortfolioItems();
    window.scrollTo({ top: document.getElementById('portfolioGrid').offsetTop - 100, behavior: 'smooth' });
}

function initPortfolioFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            currentFilter = this.getAttribute('data-filter');
            currentPage = 1;
            renderPortfolioItems();
        });
    });
}

function initSearchAndSort() {
    const searchInput = document.getElementById('searchPortfolio');
    const sortSelect = document.getElementById('sortPortfolio');
    
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            currentSearch = e.target.value;
            currentPage = 1;
            renderPortfolioItems();
        });
    }
    
    if (sortSelect) {
        sortSelect.addEventListener('change', function(e) {
            currentSort = e.target.value;
            currentPage = 1;
            renderPortfolioItems();
        });
    }
}

window.openPortfolioLoginModal = function() {
    if (isPortfolioLoggedIn) {
        showPortfolioAdminPanel();
    } else {
        const modal = document.getElementById('portfolioLoginModal');
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        document.getElementById('portfolioUsername').value = '';
        document.getElementById('portfolioPassword').value = '';
        document.getElementById('portfolioLoginError').style.display = 'none';
    }
}

window.closePortfolioLoginModal = function() {
    const modal = document.getElementById('portfolioLoginModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

window.handlePortfolioLogin = function() {
    const username = document.getElementById('portfolioUsername').value;
    const password = document.getElementById('portfolioPassword').value;
    const errorElement = document.getElementById('portfolioLoginError');
    
    if (username === PORTFOLIO_ADMIN_USERNAME && password === PORTFOLIO_ADMIN_PASSWORD) {
        isPortfolioLoggedIn = true;
        localStorage.setItem('portfolioAdminLoggedIn', 'true');
        closePortfolioLoginModal();
        showPortfolioAdminPanel();
        updatePortfolioAdminButton();
        renderPortfolioItems();
        showToast('Login portfolio berhasil! Selamat datang Admin.', 'success');
    } else {
        errorElement.style.display = 'block';
        document.getElementById('portfolioUsername').style.borderColor = '#F56565';
        document.getElementById('portfolioPassword').style.borderColor = '#F56565';
    }
}

function showPortfolioAdminPanel() {
    const panel = document.getElementById('portfolioAdminPanel');
    panel.style.display = 'block';
    panel.classList.add('visible');
    
    document.getElementById('portfolioTitle').value = '';
    document.getElementById('portfolioDescription').value = '';
    document.getElementById('portfolioImage').value = '';
    document.getElementById('portfolioLink').value = '';
    document.getElementById('portfolioImagePreview').innerHTML = '';
    
    const saveBtn = document.getElementById('portfolioSaveBtn');
    saveBtn.innerHTML = '<i class="fas fa-plus-circle"></i> Tambah Portfolio';
    saveBtn.onclick = addPortfolioItem;
}

window.closePortfolioAdminPanel = function() {
    const panel = document.getElementById('portfolioAdminPanel');
    panel.style.display = 'none';
    panel.classList.remove('visible');
}

window.logoutPortfolioAdmin = function() {
    isPortfolioLoggedIn = false;
    localStorage.removeItem('portfolioAdminLoggedIn');
    closePortfolioAdminPanel();
    updatePortfolioAdminButton();
    renderPortfolioItems();
    showToast('Logout portfolio berhasil!', 'info');
}

function updatePortfolioAdminButton() {
    const adminBtn = document.getElementById('portfolioAdminLoginBtn');
    const adminStatus = document.getElementById('portfolioAdminStatus');
    
    if (adminBtn && adminStatus) {
        if (isPortfolioLoggedIn) {
            adminBtn.innerHTML = '<i class="fas fa-user-shield"></i> Portfolio Admin (Active)';
            adminStatus.innerHTML = 'Anda sudah login sebagai admin portfolio';
            adminStatus.style.color = '#48BB78';
        } else {
            adminBtn.innerHTML = '<i class="fas fa-lock"></i> Portfolio Admin Login';
            adminStatus.innerHTML = 'Klik untuk login sebagai admin portfolio';
            adminStatus.style.color = 'var(--text-secondary)';
        }
    }
}

function checkPortfolioLoginStatus() {
    const savedStatus = localStorage.getItem('portfolioAdminLoggedIn');
    if (savedStatus === 'true') {
        isPortfolioLoggedIn = true;
        showPortfolioAdminPanel();
        updatePortfolioAdminButton();
    }
}

window.previewPortfolioImage = function(url) {
    const preview = document.getElementById('portfolioImagePreview');
    if (url) {
        preview.innerHTML = `<img src="${url}" alt="Preview" class="image-preview" onerror="this.style.display='none'">`;
    } else {
        preview.innerHTML = '';
    }
}

function isValidImageUrl(url) {
    if (!url) return false;
    return url.match(/\.(jpeg|jpg|gif|png|webp|svg)$/i) || 
           url.includes('images.unsplash.com') || 
           url.includes('ibb.co') ||
           url.includes('cloudinary.com') ||
           url.includes('googleusercontent.com');
}

window.addPortfolioItem = function() {
    if (!isPortfolioLoggedIn) {
        showToast('Anda harus login terlebih dahulu!', 'error');
        openPortfolioLoginModal();
        return;
    }
    
    const category = document.getElementById('portfolioCategory').value;
    const title = document.getElementById('portfolioTitle').value.trim();
    const description = document.getElementById('portfolioDescription').value.trim();
    const image = document.getElementById('portfolioImage').value.trim();
    const link = document.getElementById('portfolioLink').value.trim();
    
    if (!title || !description || !image) {
        showToast('Judul, deskripsi, dan gambar harus diisi!', 'error');
        return;
    }
    
    if (!isValidImageUrl(image)) {
        showToast('Link gambar tidak valid! Gunakan link gambar yang benar.', 'error');
        return;
    }
    
    const newItem = {
        id: Date.now().toString(),
        category,
        title,
        description,
        image,
        link: link || '',
        createdAt: Date.now()
    };
    
    portfolioItems.push(newItem);
    savePortfolioItems();
    currentPage = 1;
    renderPortfolioItems();
    
    document.getElementById('portfolioTitle').value = '';
    document.getElementById('portfolioDescription').value = '';
    document.getElementById('portfolioImage').value = '';
    document.getElementById('portfolioLink').value = '';
    document.getElementById('portfolioImagePreview').innerHTML = '';
    
    showToast('Portfolio berhasil ditambahkan!', 'success');
}

window.showDeleteConfirm = function(id) {
    deleteId = id;
    const modal = document.getElementById('confirmModal');
    document.getElementById('confirmMessage').innerText = 'Apakah Anda yakin ingin menghapus item ini?';
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

window.closeConfirmModal = function() {
    const modal = document.getElementById('confirmModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
    deleteId = null;
}

window.confirmAction = function() {
    if (deleteId) {
        if (!isPortfolioLoggedIn) {
            showToast('Anda harus login terlebih dahulu!', 'error');
            openPortfolioLoginModal();
            closeConfirmModal();
            return;
        }
        
        portfolioItems = portfolioItems.filter(item => item.id !== deleteId);
        savePortfolioItems();
        renderPortfolioItems();
        showToast('Portfolio berhasil dihapus!', 'success');
        closeConfirmModal();
    }
}

window.editPortfolioItem = function(id) {
    if (!isPortfolioLoggedIn) {
        showToast('Anda harus login terlebih dahulu!', 'error');
        openPortfolioLoginModal();
        return;
    }
    
    const item = portfolioItems.find(item => item.id === id);
    if (!item) return;
    
    document.getElementById('portfolioCategory').value = item.category;
    document.getElementById('portfolioTitle').value = item.title;
    document.getElementById('portfolioDescription').value = item.description;
    document.getElementById('portfolioImage').value = item.image;
    document.getElementById('portfolioLink').value = item.link || '';
    
    if (item.image) {
        document.getElementById('portfolioImagePreview').innerHTML = `<img src="${item.image}" alt="Preview" class="image-preview">`;
    }
    
    const saveBtn = document.getElementById('portfolioSaveBtn');
    saveBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Update Portfolio';
    saveBtn.onclick = function() { updatePortfolioItem(id); };
    
    showPortfolioAdminPanel();
}

window.updatePortfolioItem = function(id) {
    if (!isPortfolioLoggedIn) return;
    
    const category = document.getElementById('portfolioCategory').value;
    const title = document.getElementById('portfolioTitle').value.trim();
    const description = document.getElementById('portfolioDescription').value.trim();
    const image = document.getElementById('portfolioImage').value.trim();
    const link = document.getElementById('portfolioLink').value.trim();
    
    if (!title || !description || !image) {
        showToast('Judul, deskripsi, dan gambar harus diisi!', 'error');
        return;
    }
    
    if (!isValidImageUrl(image)) {
        showToast('Link gambar tidak valid! Gunakan link gambar yang benar.', 'error');
        return;
    }
    
    const index = portfolioItems.findIndex(item => item.id === id);
    if (index !== -1) {
        portfolioItems[index] = {
            ...portfolioItems[index],
            category,
            title,
            description,
            image,
            link: link || ''
        };
        
        savePortfolioItems();
        renderPortfolioItems();
        
        document.getElementById('portfolioTitle').value = '';
        document.getElementById('portfolioDescription').value = '';
        document.getElementById('portfolioImage').value = '';
        document.getElementById('portfolioLink').value = '';
        document.getElementById('portfolioImagePreview').innerHTML = '';
        
        const saveBtn = document.getElementById('portfolioSaveBtn');
        saveBtn.innerHTML = '<i class="fas fa-plus-circle"></i> Tambah Portfolio';
        saveBtn.onclick = addPortfolioItem;
        
        showToast('Portfolio berhasil diupdate!', 'success');
    }
}

let currentQuestion = 0;
let score = 0;
let timeLeft = 10;
let timerInterval;
let gameData = [];
let currentAnswer = 0;
let playerName = "";

function initGame() {
    const startScreen = document.getElementById("start-screen");
    const loadingScreen = document.getElementById("loading-screen");
    const playScreen = document.getElementById("play-screen");
    const resultScreen = document.getElementById("result-screen");
    const inputField = document.getElementById("answer-input");
    const progress = document.getElementById("progress");
    const questNumber = document.getElementById("quest-number");
    const displayQuestion = document.getElementById("display-question");
    const loadingPercentage = document.getElementById("loadingPercentage");
    const playerNameInput = document.getElementById("player-name-input");
    const nameError = document.getElementById("name-error");
    const loadingPlayerName = document.getElementById("loading-player-name");
    const playPlayerName = document.getElementById("play-player-name");
    const resultPlayerName = document.getElementById("result-player-name");
    const finalScore = document.getElementById("final-score");
    const resultMessage = document.getElementById("result-message");
    const resultTitle = document.getElementById("result-title");

    if (!startScreen || !loadingScreen || !playScreen || !resultScreen) return;

    if (inputField) {
        inputField.addEventListener("keypress", function(e) {
            if (e.key === "Enter") {
                processAnswer();
            }
        });
    }

    window.validateAndShowLoading = function() {
        const name = playerNameInput.value.trim();
        if (name === "") {
            nameError.style.display = "block";
            playerNameInput.style.border = "2px solid #F56565";
            return;
        }
        nameError.style.display = "none";
        playerNameInput.style.border = "none";
        playerName = name;
        showLoading();
    };

    window.showStartScreen = function() {
        startScreen.classList.remove("hidden");
        loadingScreen.classList.add("hidden");
        playScreen.classList.add("hidden");
        resultScreen.classList.add("hidden");
        if (playerNameInput) playerNameInput.value = "";
        playerName = "";
    };

    function showLoading() {
        startScreen.classList.add("hidden");
        playScreen.classList.add("hidden");
        resultScreen.classList.add("hidden");
        loadingScreen.classList.remove("hidden");
        
        if (loadingPlayerName) {
            loadingPlayerName.innerText = "👤 " + playerName;
        }
        
        const startButton = document.getElementById("startButton");
        if (startButton) startButton.disabled = true;
        
        let percentage = 0;
        const interval = setInterval(() => {
            percentage += Math.random() * 15;
            if (percentage >= 100) {
                percentage = 100;
                clearInterval(interval);
                
                setTimeout(() => {
                    loadingScreen.classList.add("hidden");
                    startGame();
                    if (startButton) startButton.disabled = false;
                }, 500);
            }
            
            if (loadingPercentage) {
                loadingPercentage.innerText = Math.floor(percentage) + "%";
            }
        }, 200);
    }

    function startGame() {
        currentQuestion = 0;
        score = 0;
        gameData = [];
        playScreen.classList.remove("hidden");
        if (playPlayerName) {
            playPlayerName.innerText = "👤 " + playerName;
        }
        nextQuestion();
    }

    function generateQuestion() {
        const ops = ["+", "-", "*", "/"];
        let a = Math.floor(Math.random() * 10) + 1;
        let b = Math.floor(Math.random() * 10) + 1;
        let op = ops[Math.floor(Math.random() * 4)];

        if (op === "/") {
            a = a * b;
        }

        let opDisplay = op;
        if (op === "*") opDisplay = "×";
        if (op === "/") opDisplay = "÷";

        let qText = a + " " + opDisplay + " " + b;
        let ans = 0;
        if (op === "+") ans = a + b;
        else if (op === "-") ans = a - b;
        else if (op === "*") ans = a * b;
        else if (op === "/") ans = a / b;

        return { qText, ans };
    }

    function nextQuestion() {
        if (currentQuestion >= 10) {
            endGame();
            return;
        }

        currentQuestion++;
        if (questNumber) {
            questNumber.innerText = 'Soal ' + currentQuestion + ' / 10';
        }
        const q = generateQuestion();
        if (displayQuestion) {
            displayQuestion.innerText = q.qText;
        }
        currentAnswer = q.ans;

        if (inputField) {
            inputField.value = "";
            inputField.focus();
        }

        startTimer();
    }

    function startTimer() {
        clearInterval(timerInterval);
        timeLeft = 10;
        if (progress) {
            progress.style.width = "100%";
            progress.style.transition = "none";
            progress.offsetHeight;
            progress.style.transition = "width 10s linear";
            progress.style.width = "0%";
        }

        timerInterval = setInterval(() => {
            timeLeft--;
            if (timeLeft < 0) {
                processAnswer(null);
            }
        }, 1000);
    }

    function processAnswer(userValue = undefined) {
        clearInterval(timerInterval);

        let jawaban;
        if (userValue === null) {
            jawaban = null;
        } else {
            jawaban = parseFloat(inputField ? inputField.value : 0);
            if (isNaN(jawaban)) jawaban = null;
        }

        const benar = (jawaban === currentAnswer);
        if (benar) score++;

        gameData.push({
            soal: displayQuestion ? displayQuestion.innerText : "",
            jawabanUser: jawaban !== null ? jawaban : "-",
            jawabanBenar: currentAnswer,
            status: benar ? "benar" : "salah"
        });

        if (currentQuestion < 10) {
            nextQuestion();
        } else {
            endGame();
        }
    }

    function createConfetti() {
        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.background = `hsl(${Math.random() * 360}, 100%, 50%)`;
            confetti.style.animationDelay = Math.random() * 3 + 's';
            confetti.style.animationDuration = Math.random() * 2 + 2 + 's';
            confetti.style.position = 'fixed';
            confetti.style.width = '10px';
            confetti.style.height = '10px';
            confetti.style.borderRadius = '50%';
            confetti.style.zIndex = '9999';
            confetti.style.animation = 'confettiFall 3s ease-in-out infinite';
            document.body.appendChild(confetti);
            
            setTimeout(() => {
                confetti.remove();
            }, 5000);
        }
    }

    function endGame() {
        playScreen.classList.add("hidden");
        resultScreen.classList.remove("hidden");
        
        if (resultPlayerName) {
            resultPlayerName.innerText = "👤 " + playerName;
        }
        
        const totalScore = score;
        if (finalScore) {
            finalScore.innerText = "Skor: " + totalScore + " / 10";
        }
        
        if (resultTitle) {
            if (totalScore >= 8) {
                resultTitle.innerText = "🎉 SELAMAT! 🎉";
            } else {
                resultTitle.innerText = "😢 YAHH...";
            }
        }
        
        if (resultMessage) {
            if (totalScore >= 8) {
                resultMessage.innerText = "✨ " + playerName + ", kamu MENANG! Luar biasa! ✨";
                resultMessage.style.color = "#48BB78";
                if (finalScore) {
                    finalScore.classList.add("win-badge");
                    finalScore.classList.remove("lose-badge");
                }
                createConfetti();
            } else {
                resultMessage.innerText = playerName + ", kamu KALAH. Coba lagi ya! 💪";
                resultMessage.style.color = "#F56565";
                if (finalScore) {
                    finalScore.classList.add("lose-badge");
                    finalScore.classList.remove("win-badge");
                }
            }
        }

        const tbody = document.getElementById("result-body");
        if (tbody) {
            tbody.innerHTML = "";
            gameData.forEach((data, index) => {
                let row = document.createElement("tr");
                let statusClass = data.status === "benar" ? "row-correct" : "row-wrong";
                row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${data.jawabanUser}</td>
                    <td class="${statusClass}">${data.jawabanBenar}</td>
                `;
                tbody.appendChild(row);
            });
        }
    }
}
