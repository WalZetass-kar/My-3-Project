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

// ==================== SERTIFIKAT MANAGEMENT ====================
let certificatesData = [];
let currentCertCategory = 'all';
let editingCertId = null;
let isLoggedIn = false;

function initCertificates() {
    console.log('initCertificates dipanggil');
    loadCertificates();
    initCertificateCategories();
    initCertificateFileInputs();
    checkAdminLoginStatus();
    renderCertificates();
}

function loadCertificates() {
    const saved = localStorage.getItem('certificatesData');
    if (saved) {
        certificatesData = JSON.parse(saved);
        console.log('Data sertifikat dimuat dari localStorage:', certificatesData.length, 'sertifikat');
    } else {
        certificatesData = [
            {
                id: '1',
                category: 'cisco',
                title: 'Introduction to Cybersecurity',
                issuer: 'Cisco Networking Academy',
                date: '2026-01-15',
                description: 'Pengenalan dasar keamanan siber dan praktik terbaik untuk melindungi data dan sistem.',
                fileData: null,
                fileType: null,
                badgeData: null,
                link: '',
                hours: 15
            },
            {
                id: '2',
                category: 'cisco',
                title: 'Network Defense',
                issuer: 'Cisco Networking Academy',
                date: '2026-02-20',
                description: 'Strategi dan teknik untuk mempertahankan jaringan dari ancaman keamanan.',
                fileData: null,
                fileType: null,
                badgeData: null,
                link: '',
                hours: 20
            },
            {
                id: '3',
                category: 'komdigi',
                title: 'Digital Talent Scholarship',
                issuer: 'Kementerian Komdigi',
                date: '2025-12-10',
                description: 'Pelatihan talenta digital untuk meningkatkan kompetensi di bidang teknologi.',
                fileData: null,
                fileType: null,
                badgeData: null,
                link: '',
                hours: 40
            },
            {
                id: '4',
                category: 'bisaai',
                title: 'AI Introduction',
                issuer: 'Bisa AI Academy',
                date: '2026-01-05',
                description: 'Pengenalan dasar kecerdasan buatan dan aplikasinya dalam kehidupan sehari-hari.',
                fileData: null,
                fileType: null,
                badgeData: null,
                link: '',
                hours: 10
            },
            {
                id: '5',
                category: 'komdigi',
                title: 'Cybersecurity Awareness',
                issuer: 'Kementerian Komdigi',
                date: '2026-02-28',
                description: 'Kesadaran keamanan siber untuk melindungi diri dari ancaman digital.',
                fileData: null,
                fileType: null,
                badgeData: null,
                link: '',
                hours: 30
            }
        ];
        saveCertificates();
        console.log('Data default sertifikat dibuat:', certificatesData.length, 'sertifikat');
    }
}

function saveCertificates() {
    localStorage.setItem('certificatesData', JSON.stringify(certificatesData));
    console.log('Sertifikat disimpan ke localStorage');
}

function renderCertificates() {
    console.log('renderCertificates dipanggil');
    
    const grid = document.getElementById('certificatesGrid');
    const totalSpan = document.getElementById('totalCertificates');
    const hoursSpan = document.getElementById('totalHours');
    
    if (!grid) {
        console.error('ERROR: Element certificatesGrid tidak ditemukan!');
        return;
    }
    
    console.log('Element certificatesGrid ditemukan');
    
    let filteredCerts = certificatesData;
    if (currentCertCategory !== 'all') {
        filteredCerts = certificatesData.filter(cert => cert.category === currentCertCategory);
        console.log('Filter kategori:', currentCertCategory, 'menemukan', filteredCerts.length, 'sertifikat');
    } else {
        console.log('Menampilkan semua sertifikat:', filteredCerts.length, 'sertifikat');
    }
    
    const totalCertificates = filteredCerts.length;
    const totalHours = filteredCerts.reduce((sum, cert) => sum + (cert.hours || 0), 0);
    
    if (totalSpan) totalSpan.innerText = totalCertificates;
    if (hoursSpan) hoursSpan.innerText = totalHours + '+';
    
    if (filteredCerts.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 60px; background: var(--bg-card); border-radius: 20px;">
                <i class="fas fa-certificate" style="font-size: 4rem; color: var(--primary);"></i>
                <h3>Belum ada sertifikat</h3>
                <p>${isLoggedIn ? 'Klik "Admin Panel" untuk menambahkan sertifikat' : 'Login sebagai admin untuk menambahkan sertifikat'}</p>
            </div>
        `;
        return;
    }
    
    let html = '';
    for (let i = 0; i < filteredCerts.length; i++) {
        const cert = filteredCerts[i];
        
        let iconClass = 'fa-shield-halved';
        if (cert.category === 'komdigi') iconClass = 'fa-building';
        if (cert.category === 'bisaai') iconClass = 'fa-robot';
        
        let formattedDate = 'Tanggal tidak tersedia';
        if (cert.date) {
            try {
                const dateObj = new Date(cert.date);
                formattedDate = dateObj.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
            } catch(e) {
                formattedDate = cert.date;
            }
        }
        
        const badgeHtml = cert.badgeData ? 
            `<img src="${cert.badgeData}" alt="Badge" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover; margin-top: 10px;">` : '';
        
        const adminActions = isLoggedIn ? `
            <div style="position: absolute; top: 10px; right: 10px; display: flex; gap: 5px; z-index: 10;">
                <button onclick="editCertificate('${cert.id}')" style="background: var(--primary); color: white; border: none; width: 30px; height: 30px; border-radius: 50%; cursor: pointer;">
                    <i class="fas fa-edit"></i>
                </button>
                <button onclick="deleteCertificate('${cert.id}')" style="background: #F56565; color: white; border: none; width: 30px; height: 30px; border-radius: 50%; cursor: pointer;">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        ` : '';
        
        const hasLink = cert.link && cert.link !== '';
        
        html += `
            <div class="certificate-card" style="background: var(--bg-card); border-radius: 20px; padding: 20px; display: flex; gap: 20px; align-items: center; box-shadow: var(--shadow); border: 1px solid var(--border); position: relative;">
                ${adminActions}
                <div style="width: 60px; height: 60px; background: linear-gradient(135deg, var(--primary), var(--secondary)); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.8rem; color: white; flex-shrink: 0;">
                    <i class="fas ${iconClass}"></i>
                </div>
                <div style="flex: 1;">
                    <h3 style="font-size: 1.1rem; margin-bottom: 5px; color: var(--text-primary);">${escapeHtml(cert.title)}</h3>
                    <p style="color: var(--text-secondary); font-size: 0.85rem; margin-bottom: 5px;">${escapeHtml(cert.issuer)}</p>
                    <span style="display: inline-block; padding: 3px 10px; background: var(--soft-red-100); border-radius: 15px; font-size: 0.8rem; color: var(--primary); margin-bottom: 8px;">${formattedDate}</span>
                    <p style="font-size: 0.85rem; color: var(--text-secondary); margin: 8px 0;">${escapeHtml(cert.description || '')}</p>
                    <div style="margin-top: 10px; display: flex; gap: 10px; flex-wrap: wrap;">
                        <button class="btn-view-cert" onclick="previewCertificate('${cert.id}')" style="background: linear-gradient(135deg, var(--primary), var(--secondary)); color: white; border: none; padding: 8px 15px; border-radius: 25px; cursor: pointer;">
                            <i class="fas fa-eye"></i> Preview
                        </button>
                        ${hasLink ? `<a href="${cert.link}" target="_blank" style="display: inline-flex; align-items: center; gap: 5px; color: var(--primary); text-decoration: none; padding: 5px 10px; background: var(--bg-primary); border-radius: 20px;"><i class="fas fa-external-link-alt"></i> Buka Link</a>` : ''}
                    </div>
                    <div style="margin-top: 10px;">
                        ${badgeHtml}
                    </div>
                </div>
            </div>
        `;
    }
    
    grid.innerHTML = html;
    console.log('Sertifikat berhasil dirender, jumlah:', filteredCerts.length);
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

window.previewCertificate = function(certId) {
    const cert = certificatesData.find(c => c.id === certId);
    if (!cert) return;
    
    const modal = document.getElementById('certModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    
    if (!modal) {
        console.error('Modal tidak ditemukan');
        return;
    }
    
    modalTitle.textContent = cert.title;
    
    let content = '';
    
    if (cert.fileData && cert.fileData !== 'null' && cert.fileData !== '') {
        if (cert.fileType === 'application/pdf') {
            content = `
                <div>
                    <iframe src="${cert.fileData}" width="100%" height="500px" style="border: none; border-radius: 10px;"></iframe>
                    <p style="margin-top: 20px;">
                        <a href="${cert.fileData}" download="sertifikat_${cert.id}.pdf" class="btn-view-cert" style="display: inline-block;">
                            <i class="fas fa-download"></i> Download PDF
                        </a>
                    </p>
                </div>
            `;
        } else if (cert.fileType && cert.fileType.startsWith('image/')) {
            content = `
                <div>
                    <img src="${cert.fileData}" alt="${cert.title}" style="max-width: 100%; border-radius: 10px;">
                    <p style="margin-top: 20px;">
                        <a href="${cert.fileData}" download="sertifikat_${cert.id}.jpg" class="btn-view-cert" style="display: inline-block;">
                            <i class="fas fa-download"></i> Download Gambar
                        </a>
                    </p>
                </div>
            `;
        }
    } else if (cert.link && cert.link !== '') {
        content = `
            <div>
                <img src="${cert.link}" alt="${cert.title}" style="max-width: 100%; border-radius: 10px;">
                <p style="margin-top: 20px;">
                    <a href="${cert.link}" target="_blank" class="btn-view-cert" style="display: inline-block;">
                        <i class="fas fa-external-link-alt"></i> Buka di Tab Baru
                    </a>
                </p>
            </div>
        `;
    } else {
        content = `
            <div style="text-align: center; padding: 40px;">
                <i class="fas fa-clock" style="font-size: 4rem; color: var(--primary);"></i>
                <h4>BELUM ADA FILE</h4>
                <p>File sertifikat belum diupload</p>
                ${isLoggedIn ? `<button onclick="editCertificate('${cert.id}')" class="btn-view-cert" style="margin-top: 15px;">Upload Sekarang</button>` : ''}
            </div>
        `;
    }
    
    modalBody.innerHTML = content;
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

window.addCertificate = function() {
    if (!isLoggedIn) {
        showToast('Anda harus login terlebih dahulu!', 'error');
        openLoginModal();
        return;
    }
    
    const category = document.getElementById('certCategory').value;
    const title = document.getElementById('certTitle').value.trim();
    const issuer = document.getElementById('certIssuer').value.trim();
    const date = document.getElementById('certDate').value;
    const description = document.getElementById('certDescription').value.trim();
    const link = document.getElementById('certLink').value.trim();
    const hours = parseInt(document.getElementById('certHours').value) || 0;
    const fileInput = document.getElementById('certFile');
    const badgeInput = document.getElementById('badgeFile');
    
    if (!title || !issuer || !date) {
        showToast('Judul, penerbit, dan tanggal harus diisi!', 'error');
        return;
    }
    
    const newId = Date.now().toString();
    
    const newCert = {
        id: newId,
        category: category,
        title: title,
        issuer: issuer,
        date: date,
        description: description || '',
        fileData: null,
        fileType: null,
        badgeData: null,
        link: link || '',
        hours: hours
    };
    
    const promises = [];
    
    if (fileInput && fileInput.files.length > 0) {
        promises.push(handleFileUpload(fileInput.files[0]).then(base64 => {
            newCert.fileData = base64;
            newCert.fileType = fileInput.files[0].type;
        }));
    }
    
    if (badgeInput && badgeInput.files.length > 0) {
        promises.push(handleFileUpload(badgeInput.files[0]).then(base64 => {
            newCert.badgeData = base64;
        }));
    }
    
    Promise.all(promises).then(() => {
        certificatesData.push(newCert);
        saveCertificates();
        renderCertificates();
        
        document.getElementById('certTitle').value = '';
        document.getElementById('certIssuer').value = '';
        document.getElementById('certDate').value = '';
        document.getElementById('certDescription').value = '';
        document.getElementById('certLink').value = '';
        document.getElementById('certHours').value = '';
        if (fileInput) fileInput.value = '';
        if (badgeInput) badgeInput.value = '';
        const badgePreview = document.getElementById('certBadgePreview');
        const filePreview = document.getElementById('certFilePreview');
        if (badgePreview) badgePreview.innerHTML = '';
        if (filePreview) filePreview.innerHTML = '';
        
        showToast('Sertifikat berhasil ditambahkan!', 'success');
        closeAdminPanel();
    }).catch(error => {
        console.error('Error:', error);
        showToast('Gagal mengupload file!', 'error');
    });
}

window.editCertificate = function(certId) {
    if (!isLoggedIn) {
        showToast('Anda harus login terlebih dahulu!', 'error');
        openLoginModal();
        return;
    }
    
    const cert = certificatesData.find(c => c.id === certId);
    if (!cert) return;
    
    const categorySelect = document.getElementById('certCategory');
    const titleInput = document.getElementById('certTitle');
    const issuerInput = document.getElementById('certIssuer');
    const dateInput = document.getElementById('certDate');
    const descInput = document.getElementById('certDescription');
    const linkInput = document.getElementById('certLink');
    const hoursInput = document.getElementById('certHours');
    const badgePreview = document.getElementById('certBadgePreview');
    
    if (categorySelect) categorySelect.value = cert.category;
    if (titleInput) titleInput.value = cert.title;
    if (issuerInput) issuerInput.value = cert.issuer;
    if (dateInput) dateInput.value = cert.date;
    if (descInput) descInput.value = cert.description || '';
    if (linkInput) linkInput.value = cert.link || '';
    if (hoursInput) hoursInput.value = cert.hours || '';
    
    if (badgePreview && cert.badgeData) {
        badgePreview.innerHTML = `<img src="${cert.badgeData}" alt="Badge Preview" style="max-width: 100px; border-radius: 5px;">`;
    }
    
    editingCertId = certId;
    
    const saveBtn = document.querySelector('#adminPanel .btn-save');
    if (saveBtn) {
        saveBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Update Sertifikat';
        saveBtn.onclick = function() { updateCertificate(certId); };
    }
    
    showAdminPanel();
}

window.updateCertificate = function(certId) {
    if (!isLoggedIn) return;
    
    const index = certificatesData.findIndex(c => c.id === certId);
    if (index === -1) return;
    
    const category = document.getElementById('certCategory').value;
    const title = document.getElementById('certTitle').value.trim();
    const issuer = document.getElementById('certIssuer').value.trim();
    const date = document.getElementById('certDate').value;
    const description = document.getElementById('certDescription').value.trim();
    const link = document.getElementById('certLink').value.trim();
    const hours = parseInt(document.getElementById('certHours').value) || 0;
    const fileInput = document.getElementById('certFile');
    const badgeInput = document.getElementById('badgeFile');
    
    if (!title || !issuer || !date) {
        showToast('Judul, penerbit, dan tanggal harus diisi!', 'error');
        return;
    }
    
    const updatedCert = {
        ...certificatesData[index],
        category: category,
        title: title,
        issuer: issuer,
        date: date,
        description: description || '',
        link: link || '',
        hours: hours
    };
    
    const promises = [];
    
    if (fileInput && fileInput.files.length > 0) {
        promises.push(handleFileUpload(fileInput.files[0]).then(base64 => {
            updatedCert.fileData = base64;
            updatedCert.fileType = fileInput.files[0].type;
        }));
    }
    
    if (badgeInput && badgeInput.files.length > 0) {
        promises.push(handleFileUpload(badgeInput.files[0]).then(base64 => {
            updatedCert.badgeData = base64;
        }));
    }
    
    Promise.all(promises).then(() => {
        certificatesData[index] = updatedCert;
        saveCertificates();
        renderCertificates();
        
        document.getElementById('certTitle').value = '';
        document.getElementById('certIssuer').value = '';
        document.getElementById('certDate').value = '';
        document.getElementById('certDescription').value = '';
        document.getElementById('certLink').value = '';
        document.getElementById('certHours').value = '';
        if (fileInput) fileInput.value = '';
        if (badgeInput) badgeInput.value = '';
        const badgePreview = document.getElementById('certBadgePreview');
        const filePreview = document.getElementById('certFilePreview');
        if (badgePreview) badgePreview.innerHTML = '';
        if (filePreview) filePreview.innerHTML = '';
        
        const saveBtn = document.querySelector('#adminPanel .btn-save');
        if (saveBtn) {
            saveBtn.innerHTML = '<i class="fas fa-save"></i> Simpan Sertifikat';
            saveBtn.onclick = function() { addCertificate(); };
        }
        
        editingCertId = null;
        showToast('Sertifikat berhasil diupdate!', 'success');
        closeAdminPanel();
    }).catch(error => {
        console.error('Error:', error);
        showToast('Gagal mengupload file!', 'error');
    });
}

window.deleteCertificate = function(certId) {
    if (!isLoggedIn) {
        showToast('Anda harus login terlebih dahulu!', 'error');
        openLoginModal();
        return;
    }
    
    if (confirm('Apakah Anda yakin ingin menghapus sertifikat ini?')) {
        certificatesData = certificatesData.filter(cert => cert.id !== certId);
        saveCertificates();
        renderCertificates();
        showToast('Sertifikat berhasil dihapus!', 'success');
    }
}

function handleFileUpload(file) {
    return new Promise((resolve, reject) => {
        const maxSize = 10 * 1024 * 1024;
        if (file.size > maxSize) {
            showToast('File terlalu besar! Maksimal 10MB.', 'error');
            reject('File terlalu besar');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = () => {
            showToast('Gagal membaca file!', 'error');
            reject('Gagal membaca file');
        };
        reader.readAsDataURL(file);
    });
}

window.previewCertFile = function(input) {
    const preview = document.getElementById('certFilePreview');
    if (!preview) return;
    
    if (input.files && input.files[0]) {
        const file = input.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
            if (file.type === 'application/pdf') {
                preview.innerHTML = `<div><i class="fas fa-file-pdf" style="color: #F56565;"></i> PDF: ${file.name}</div>`;
            } else if (file.type.startsWith('image/')) {
                preview.innerHTML = `<img src="${e.target.result}" alt="Preview" style="max-width: 100px; border-radius: 5px;">`;
            }
        };
        reader.readAsDataURL(file);
    } else {
        preview.innerHTML = '';
    }
}

window.previewBadgeImage = function(input) {
    const preview = document.getElementById('certBadgePreview');
    if (!preview) return;
    
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => {
            preview.innerHTML = `<img src="${e.target.result}" alt="Preview" style="max-width: 100px; border-radius: 5px;">`;
        };
        reader.readAsDataURL(input.files[0]);
    } else {
        preview.innerHTML = '';
    }
}

function initCertificateFileInputs() {
    const certFile = document.getElementById('certFile');
    const badgeFile = document.getElementById('badgeFile');
    
    if (certFile) certFile.addEventListener('change', function() { previewCertFile(this); });
    if (badgeFile) badgeFile.addEventListener('change', function() { previewBadgeImage(this); });
}

function initCertificateCategories() {
    const categoryBtns = document.querySelectorAll('.category-btn');
    console.log('Jumlah category button:', categoryBtns.length);
    
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            console.log('Kategori dipilih:', category);
            currentCertCategory = category;
            categoryBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            renderCertificates();
        });
    });
}

window.saveCertificateLink = function() {
    if (editingCertId) {
        updateCertificate(editingCertId);
    } else {
        addCertificate();
    }
}

// ==================== ADMIN LOGIN ====================
const ADMIN_USERNAME = "WalDevelop";
const ADMIN_PASSWORD = "kartika";

function checkAdminLoginStatus() {
    const savedStatus = localStorage.getItem('adminLoggedIn');
    if (savedStatus === 'true') {
        isLoggedIn = true;
        showAdminPanel();
        updateAdminButton();
    }
}

function showAdminPanel() {
    const adminPanel = document.getElementById('adminPanel');
    if (adminPanel) {
        adminPanel.style.display = 'block';
        adminPanel.classList.add('visible');
    }
}

window.closeAdminPanel = function() {
    const adminPanel = document.getElementById('adminPanel');
    if (adminPanel) {
        adminPanel.style.display = 'none';
        adminPanel.classList.remove('visible');
    }
}

window.openLoginModal = function() {
    if (isLoggedIn) {
        showAdminPanel();
    } else {
        const modal = document.getElementById('loginModal');
        if (modal) {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
            const usernameInput = document.getElementById('username');
            const passwordInput = document.getElementById('password');
            if (usernameInput) usernameInput.value = '';
            if (passwordInput) passwordInput.value = '';
            const errorElement = document.getElementById('loginError');
            if (errorElement) errorElement.style.display = 'none';
        }
    }
}

window.closeLoginModal = function() {
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
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
        renderCertificates();
        showToast('Login berhasil! Selamat datang Admin.', 'success');
    } else {
        if (errorElement) errorElement.style.display = 'block';
        const usernameInput = document.getElementById('username');
        const passwordInput = document.getElementById('password');
        if (usernameInput) usernameInput.style.borderColor = '#F56565';
        if (passwordInput) passwordInput.style.borderColor = '#F56565';
    }
}

window.logoutAdmin = function() {
    isLoggedIn = false;
    localStorage.removeItem('adminLoggedIn');
    closeAdminPanel();
    updateAdminButton();
    renderCertificates();
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

window.downloadCertificate = function() {
    const modalBody = document.getElementById('modalBody');
    const link = modalBody ? modalBody.querySelector('a') : null;
    if (link && link.href) {
        window.open(link.href, '_blank');
    } else {
        showToast('File tidak tersedia untuk diunduh', 'warning');
    }
}

window.closeModal = function() {
    const modal = document.getElementById('certModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// ==================== PORTFOLIO MANAGEMENT ====================
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
    if (panel) {
        panel.style.display = 'block';
        panel.classList.add('visible');
    }
    
    document.getElementById('portfolioTitle').value = '';
    document.getElementById('portfolioDescription').value = '';
    document.getElementById('portfolioImage').value = '';
    document.getElementById('portfolioLink').value = '';
    document.getElementById('portfolioImagePreview').innerHTML = '';
    
    const saveBtn = document.getElementById('portfolioSaveBtn');
    if (saveBtn) {
        saveBtn.innerHTML = '<i class="fas fa-plus-circle"></i> Tambah Portfolio';
        saveBtn.onclick = addPortfolioItem;
    }
}

window.closePortfolioAdminPanel = function() {
    const panel = document.getElementById('portfolioAdminPanel');
    if (panel) {
        panel.style.display = 'none';
        panel.classList.remove('visible');
    }
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

// ==================== QUICKMATH GAME ====================
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

window.onclick = function(event) {
    const certModal = document.getElementById('certModal');
    if (certModal && event.target === certModal) {
        closeModal();
    }
    const loginModal = document.getElementById('loginModal');
    if (loginModal && event.target === loginModal) {
        closeLoginModal();
    }
    const portfolioLoginModal = document.getElementById('portfolioLoginModal');
    if (portfolioLoginModal && event.target === portfolioLoginModal) {
        closePortfolioLoginModal();
    }
    const confirmModal = document.getElementById('confirmModal');
    if (confirmModal && event.target === confirmModal) {
        closeConfirmModal();
    }
}

document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeModal();
        closeLoginModal();
        closeConfirmModal();
        closePortfolioLoginModal();
    }
});
