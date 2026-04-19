# 🔧 Panduan Integrasi ke Project Existing

## 📋 Overview

Panduan ini menjelaskan cara mengintegrasikan skeleton loading dan sistem upload ke project kamu yang sudah ada (portofolio.html dan sertifikat.html).

---

## 🎯 Integrasi untuk PORTFOLIO (portofolio.html)

### Step 1: Tambahkan CSS Skeleton ke style.css

Tambahkan di bagian bawah file `style.css`:

```css
/* ===== SKELETON LOADING STYLES ===== */

.skeleton-card {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 20px;
    box-shadow: var(--shadow);
}

.skeleton-preview {
    width: 100%;
    height: 200px;
    background: linear-gradient(90deg, 
        var(--soft-red-100) 25%, 
        var(--soft-red-200) 50%, 
        var(--soft-red-100) 75%
    );
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
    border-radius: 12px;
    margin-bottom: 15px;
}

.skeleton-title {
    width: 70%;
    height: 20px;
    background: linear-gradient(90deg, 
        var(--soft-red-100) 25%, 
        var(--soft-red-200) 50%, 
        var(--soft-red-100) 75%
    );
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
    border-radius: 4px;
    margin-bottom: 10px;
}

.skeleton-text {
    width: 50%;
    height: 14px;
    background: linear-gradient(90deg, 
        var(--soft-red-100) 25%, 
        var(--soft-red-200) 50%, 
        var(--soft-red-100) 75%
    );
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
    border-radius: 4px;
    margin-bottom: 8px;
}

.skeleton-text.full {
    width: 100%;
}

.skeleton-text.medium {
    width: 60%;
}

.skeleton-buttons {
    display: flex;
    gap: 10px;
    margin-top: 15px;
}

.skeleton-button {
    flex: 1;
    height: 35px;
    background: linear-gradient(90deg, 
        var(--soft-red-100) 25%, 
        var(--soft-red-200) 50%, 
        var(--soft-red-100) 75%
    );
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
    border-radius: 6px;
}

@keyframes shimmer {
    0% {
        background-position: -200% 0;
    }
    100% {
        background-position: 200% 0;
    }
}
```

### Step 2: Modifikasi script.js

Cari bagian portfolio di `script.js` dan modifikasi:

```javascript
// ===== TAMBAHKAN DI BAGIAN ATAS (setelah deklarasi variabel portfolio) =====

let isLoadingPortfolio = false;

// ===== MODIFIKASI FUNCTION initPortfolio() =====

function initPortfolio() {
    // Tampilkan skeleton dulu
    isLoadingPortfolio = true;
    renderPortfolioItems();
    
    // Simulasi loading (bisa disesuaikan dengan kebutuhan)
    setTimeout(() => {
        isLoadingPortfolio = false;
        loadPortfolioItems();
        checkPortfolioLoginStatus();
        initPortfolioFilters();
        initSearchAndSort();
    }, 800); // 800ms delay untuk smooth transition
}

// ===== MODIFIKASI FUNCTION renderPortfolioItems() =====

function renderPortfolioItems() {
    const grid = document.getElementById('portfolioGrid');
    const stats = document.getElementById('portfolioStats');
    const pagination = document.getElementById('portfolioPagination');
    if (!grid) return;
    
    // TAMBAHKAN: Cek jika sedang loading
    if (isLoadingPortfolio) {
        renderPortfolioSkeleton(grid);
        if (stats) stats.innerHTML = 'Memuat data...';
        if (pagination) pagination.innerHTML = '';
        return;
    }
    
    // Kode existing kamu untuk render data asli
    const filtered = filterAndSortItems();
    // ... dst (kode existing)
}

// ===== TAMBAHKAN FUNCTION BARU =====

function renderPortfolioSkeleton(container) {
    const skeletonCount = 6; // Sesuaikan dengan itemsPerPage
    
    container.innerHTML = Array(skeletonCount).fill(0).map(() => `
        <div class="skeleton-card">
            <div class="skeleton-preview"></div>
            <div class="skeleton-title"></div>
            <div class="skeleton-text"></div>
            <div class="skeleton-text medium"></div>
            <div class="skeleton-buttons">
                <div class="skeleton-button"></div>
                <div class="skeleton-button"></div>
            </div>
        </div>
    `).join('');
}

// ===== MODIFIKASI FUNCTION savePortfolioItem() =====

window.savePortfolioItem = async function() {
    if (!isPortfolioLoggedIn) {
        showToast('Anda harus login terlebih dahulu!', 'error');
        openPortfolioLoginModal();
        return;
    }
    
    const title = document.getElementById('portfolioTitle').value.trim();
    const description = document.getElementById('portfolioDescription').value.trim();
    const category = document.getElementById('portfolioCategory').value;
    const link = document.getElementById('portfolioLink').value.trim();
    const imageFile = document.getElementById('portfolioImage').files[0];
    
    if (!title || !description) {
        showToast('Judul dan deskripsi harus diisi!', 'error');
        return;
    }
    
    try {
        let imageUrl = '';
        
        // MODIFIKASI: Gunakan FileReader untuk convert ke Base64
        if (imageFile) {
            // Validasi file
            if (imageFile.size > 5 * 1024 * 1024) {
                showToast('Gambar terlalu besar! Maksimal 5MB.', 'error');
                return;
            }
            
            if (!imageFile.type.startsWith('image/')) {
                showToast('File harus berupa gambar!', 'error');
                return;
            }
            
            // Convert ke Base64
            imageUrl = await fileToBase64(imageFile);
        }
        
        const newItem = {
            id: generatePortfolioId(),
            category: category,
            title: title,
            description: description,
            image: imageUrl,
            link: link,
            createdAt: Date.now()
        };
        
        portfolioItems.push(newItem);
        savePortfolioItems();
        
        // Reset form
        document.getElementById('portfolioTitle').value = '';
        document.getElementById('portfolioDescription').value = '';
        document.getElementById('portfolioLink').value = '';
        document.getElementById('portfolioImage').value = '';
        document.getElementById('portfolioImagePreview').innerHTML = '';
        
        // Render ulang dengan loading effect
        isLoadingPortfolio = true;
        renderPortfolioItems();
        
        setTimeout(() => {
            isLoadingPortfolio = false;
            renderPortfolioItems();
            showToast('Portfolio berhasil ditambahkan!', 'success');
        }, 500);
        
    } catch (error) {
        console.error('Error:', error);
        showToast('Gagal menambahkan portfolio!', 'error');
    }
}

// ===== TAMBAHKAN HELPER FUNCTION =====

function fileToBase64(file) {
    return new Promise((resolve, reject) => {
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

function generatePortfolioId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}
```

---

## 🎓 Integrasi untuk CERTIFICATE (sertifikat.html)

### Step 1: CSS Skeleton (sama seperti portfolio)

Tambahkan CSS skeleton yang sama di `style.css` (jika belum).

### Step 2: Modifikasi script.js untuk Certificate

```javascript
// ===== TAMBAHKAN DI BAGIAN CERTIFICATE =====

let isLoadingCertificates = false;

// ===== MODIFIKASI FUNCTION initCertificates() =====

function initCertificates() {
    // Tampilkan skeleton dulu
    isLoadingCertificates = true;
    renderCertificates();
    
    setTimeout(() => {
        isLoadingCertificates = false;
        loadCertLinks();
        checkLoginStatus();
        initCertificateCategories();
        initCertCategorySelect();
        initCertificateFileInputs();
    }, 800);
}

// ===== MODIFIKASI FUNCTION renderCertificates() =====

function renderCertificates() {
    const grid = document.getElementById('certificatesGrid');
    const totalSpan = document.getElementById('totalCertificates');
    const hoursSpan = document.getElementById('totalHours');
    if (!grid) return;
    
    // TAMBAHKAN: Cek jika sedang loading
    if (isLoadingCertificates) {
        renderCertificateSkeleton(grid);
        if (totalSpan) totalSpan.innerText = '...';
        if (hoursSpan) hoursSpan.innerText = '...';
        return;
    }
    
    // Kode existing untuk render data asli
    const certs = certLinks[currentCertCategory];
    // ... dst (kode existing)
}

// ===== TAMBAHKAN FUNCTION BARU =====

function renderCertificateSkeleton(container) {
    const skeletonCount = 5;
    
    container.innerHTML = Array(skeletonCount).fill(0).map(() => `
        <div class="skeleton-card">
            <div style="display: flex; gap: 20px; align-items: center;">
                <div style="width: 60px; height: 60px; border-radius: 50%; background: linear-gradient(90deg, var(--soft-red-100) 25%, var(--soft-red-200) 50%, var(--soft-red-100) 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite;"></div>
                <div style="flex: 1;">
                    <div class="skeleton-title"></div>
                    <div class="skeleton-text"></div>
                    <div class="skeleton-text medium"></div>
                    <div class="skeleton-buttons">
                        <div class="skeleton-button"></div>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// ===== MODIFIKASI FUNCTION saveCertificateLink() =====

window.saveCertificateLink = async function() {
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
    
    try {
        // Handle file uploads dengan FileReader
        if (certFile && certFile.files.length > 0) {
            const file = certFile.files[0];
            
            // Validasi
            if (file.size > 5 * 1024 * 1024) {
                showToast('File terlalu besar! Maksimal 5MB.', 'error');
                return;
            }
            
            // Convert ke Base64
            linkValue = await fileToBase64(file);
        }
        
        if (badgeFile && badgeFile.files.length > 0) {
            const file = badgeFile.files[0];
            
            // Validasi
            if (file.size > 2 * 1024 * 1024) {
                showToast('Badge terlalu besar! Maksimal 2MB.', 'error');
                return;
            }
            
            // Convert ke Base64
            imageValue = await fileToBase64(file);
        }
        
        if (selectedCert && certLinks[category] && certLinks[category][selectedCert]) {
            if (linkValue) {
                certLinks[category][selectedCert].link = linkValue;
            }
            if (imageValue) {
                certLinks[category][selectedCert].badge = imageValue;
            }
            
            saveCertLinks();
            
            // Render ulang dengan loading effect
            if (currentCertCategory === category) {
                isLoadingCertificates = true;
                renderCertificates();
                
                setTimeout(() => {
                    isLoadingCertificates = false;
                    renderCertificates();
                    showToast('Sertifikat berhasil disimpan!', 'success');
                }, 500);
            }
            
            // Reset form
            certLink.value = '';
            certFile.value = '';
            certImage.value = '';
            badgeFile.value = '';
            document.getElementById('certBadgePreview').innerHTML = '';
        }
        
    } catch (error) {
        console.error('Error:', error);
        showToast('Gagal menyimpan sertifikat!', 'error');
    }
}

// ===== PASTIKAN FUNCTION fileToBase64 ADA =====
// (Sama seperti di portfolio)
```

---

## 🎨 Customization untuk Theme Kamu

Karena project kamu menggunakan color scheme merah (soft-red), skeleton sudah disesuaikan menggunakan:

```css
background: linear-gradient(90deg, 
    var(--soft-red-100) 25%,   /* #FED7D7 */
    var(--soft-red-200) 50%,   /* #FEB2B2 */
    var(--soft-red-100) 75%
);
```

Ini akan otomatis menyesuaikan dengan light/dark mode yang sudah ada.

---

## 🔄 Alur Kerja Lengkap

### Saat Halaman Dibuka:
```
1. initPortfolio() / initCertificates() dipanggil
   ↓
2. isLoading = true
   ↓
3. Render skeleton (800ms)
   ↓
4. Load data dari localStorage
   ↓
5. isLoading = false
   ↓
6. Render data asli
```

### Saat Upload File:
```
1. User pilih file
   ↓
2. Validasi (ukuran & tipe)
   ↓
3. Convert ke Base64 (FileReader)
   ↓
4. Simpan ke array + localStorage
   ↓
5. isLoading = true
   ↓
6. Render skeleton (500ms)
   ↓
7. isLoading = false
   ↓
8. Render data baru
```

### Saat Refresh Browser:
```
1. Page reload
   ↓
2. DOMContentLoaded event
   ↓
3. Load data dari localStorage
   ↓
4. Data tetap ada! ✅
```

---

## ✅ Checklist Integrasi

### Portfolio:
- [ ] Tambah CSS skeleton ke style.css
- [ ] Tambah `isLoadingPortfolio` variable
- [ ] Modifikasi `initPortfolio()`
- [ ] Modifikasi `renderPortfolioItems()`
- [ ] Tambah `renderPortfolioSkeleton()`
- [ ] Modifikasi `savePortfolioItem()`
- [ ] Tambah `fileToBase64()` function
- [ ] Test upload gambar
- [ ] Test refresh browser
- [ ] Test skeleton loading

### Certificate:
- [ ] Tambah CSS skeleton ke style.css (jika belum)
- [ ] Tambah `isLoadingCertificates` variable
- [ ] Modifikasi `initCertificates()`
- [ ] Modifikasi `renderCertificates()`
- [ ] Tambah `renderCertificateSkeleton()`
- [ ] Modifikasi `saveCertificateLink()`
- [ ] Test upload sertifikat
- [ ] Test upload badge
- [ ] Test refresh browser
- [ ] Test skeleton loading

---

## 🐛 Troubleshooting

### Skeleton Tidak Muncul

**Cek**:
1. Apakah CSS skeleton sudah ditambahkan?
2. Apakah `isLoading = true` sebelum render?
3. Cek console untuk error

**Fix**:
```javascript
// Pastikan urutan benar
isLoadingPortfolio = true;  // Set true dulu
renderPortfolioItems();     // Baru render
```

### Data Hilang Setelah Refresh

**Cek**:
1. Apakah `savePortfolioItems()` / `saveCertLinks()` dipanggil?
2. Cek localStorage di DevTools (F12 → Application → Local Storage)
3. Cek console untuk error

**Fix**:
```javascript
// Pastikan save dipanggil setelah perubahan data
portfolioItems.push(newItem);
savePortfolioItems();  // Jangan lupa ini!
```

### Gambar Tidak Muncul

**Cek**:
1. Apakah file berhasil di-convert ke Base64?
2. Cek ukuran file (max 5MB)
3. Cek console untuk error FileReader

**Fix**:
```javascript
// Tambahkan error handling
try {
    const base64 = await fileToBase64(file);
    console.log('Base64 length:', base64.length);
} catch (error) {
    console.error('Error convert file:', error);
}
```

---

## 📊 Testing

### Test Scenario:

1. **Upload File**
   - Upload gambar → Cek muncul di UI
   - Upload PDF → Cek muncul di UI
   - Upload file besar (>5MB) → Harus error

2. **Skeleton Loading**
   - Refresh page → Skeleton muncul 800ms
   - Upload file → Skeleton muncul 500ms

3. **Persistence**
   - Upload file → Refresh browser → Data tetap ada ✅
   - Hapus file → Refresh browser → Data tetap terhapus ✅

4. **Responsive**
   - Test di mobile → Skeleton tetap rapi
   - Test di tablet → Layout tidak shift

---

## 🎉 Selesai!

Sekarang project kamu sudah punya:
- ✅ Skeleton loading yang smooth
- ✅ Upload file dengan localStorage (Base64)
- ✅ Data persistent setelah refresh
- ✅ Validasi file (ukuran & tipe)
- ✅ Error handling yang baik
- ✅ UI/UX yang lebih baik

**Semangat coding! 🚀**
