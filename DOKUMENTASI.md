# 📚 Dokumentasi Lengkap: Skeleton Loading & File Upload

## 🎯 Overview

Solusi lengkap untuk menambahkan **skeleton loading** dan **sistem upload file** dengan **localStorage** pada aplikasi vanilla JavaScript (tanpa framework, tanpa backend).

---

## 🚀 Quick Start

### 1. Buka File HTML
```bash
# Buka skeleton-example.html di browser
```

### 2. Test Fitur
- **Upload File**: Pilih gambar/PDF → klik "Upload File"
- **Lihat Skeleton**: Klik "Simulasi Loading"
- **Hapus Data**: Klik "Hapus Semua Data"
- **Refresh Browser**: Data tetap ada! ✅

---

## 📁 Struktur File

```
project/
├── skeleton-example.html    # Contoh implementasi lengkap
├── skeleton-styles.css      # Semua styling (termasuk skeleton)
├── skeleton-script.js       # Logic aplikasi
└── DOKUMENTASI.md          # File ini
```

---

## 🎨 Skeleton Loading

### Cara Kerja

Skeleton loading adalah placeholder yang muncul saat data sedang dimuat. Memberikan feedback visual yang lebih baik daripada loading spinner.

### Implementasi

#### 1. HTML Structure (Skeleton Card)
```html
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
```

#### 2. CSS Animation (Shimmer Effect)
```css
.skeleton-preview {
    width: 100%;
    height: 180px;
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
    border-radius: 8px;
}

@keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
}
```

#### 3. JavaScript Function
```javascript
function renderSkeletonGrid() {
    const container = document.getElementById('fileGrid');
    const skeletonCount = 6;
    
    container.innerHTML = Array(skeletonCount).fill(0).map(() => `
        <div class="skeleton-card">
            <div class="skeleton-preview"></div>
            <div class="skeleton-title"></div>
            <div class="skeleton-text"></div>
            <div class="skeleton-buttons">
                <div class="skeleton-button"></div>
                <div class="skeleton-button"></div>
            </div>
        </div>
    `).join('');
}
```

### Kapan Skeleton Muncul?

```javascript
function renderUI() {
    if (isLoading) {
        renderSkeletonGrid();    // Tampilkan skeleton
        renderSkeletonTable();
    } else {
        renderFileGrid();        // Tampilkan data asli
        renderFileTable();
    }
}
```

---

## 📤 File Upload System

### Alur Kerja

```
1. User pilih file
   ↓
2. Validasi file (ukuran & tipe)
   ↓
3. Convert file ke Base64 (FileReader)
   ↓
4. Simpan ke array + metadata
   ↓
5. Simpan array ke localStorage
   ↓
6. Render ulang UI
   ↓
7. Data tetap ada setelah refresh! ✅
```

### Implementasi Detail

#### 1. Upload Handler
```javascript
async function handleUpload() {
    const fileInput = document.getElementById('fileInput');
    const files = fileInput.files;

    if (files.length === 0) {
        showStatus('Pilih file terlebih dahulu!', 'error');
        return;
    }

    showStatus('Mengupload file...', 'loading');
    
    try {
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            
            // Validasi
            const validation = validateFile(file);
            if (!validation.valid) {
                showStatus(validation.message, 'error');
                continue;
            }

            // Convert ke Base64
            const base64 = await fileToBase64(file);
            
            // Buat object data
            const fileData = {
                id: generateId(),
                name: file.name,
                type: file.type,
                size: file.size,
                base64: base64,
                uploadDate: new Date().toISOString(),
                uploadDateFormatted: formatDate(new Date())
            };

            filesData.push(fileData);
        }

        // Simpan ke localStorage
        saveToLocalStorage(filesData);
        
        // Render ulang
        renderUI();
        
        showStatus('Berhasil mengupload!', 'success');
        
    } catch (error) {
        showStatus('Gagal mengupload: ' + error.message, 'error');
    }
}
```

#### 2. Validasi File
```javascript
function validateFile(file) {
    // Cek ukuran (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
        return {
            valid: false,
            message: `File terlalu besar! Maksimal 5MB`
        };
    }

    // Cek tipe file
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
        return {
            valid: false,
            message: `Tipe file tidak diizinkan!`
        };
    }

    return { valid: true };
}
```

#### 3. Convert File ke Base64
```javascript
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            resolve(e.target.result);  // Base64 string
        };
        
        reader.onerror = function(error) {
            reject(error);
        };
        
        reader.readAsDataURL(file);
    });
}
```

---

## 💾 LocalStorage System

### Struktur Data

```javascript
// Data disimpan sebagai array of objects
[
    {
        "id": "lk3j4h5g6h7j8k9",
        "name": "foto-profil.jpg",
        "type": "image/jpeg",
        "size": 245678,
        "base64": "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
        "uploadDate": "2026-04-19T10:30:00.000Z",
        "uploadDateFormatted": "19 April 2026, 10:30"
    },
    {
        "id": "m9n8b7v6c5x4z3",
        "name": "dokumen.pdf",
        "type": "application/pdf",
        "size": 1234567,
        "base64": "data:application/pdf;base64,JVBERi0xLjQK...",
        "uploadDate": "2026-04-19T11:15:00.000Z",
        "uploadDateFormatted": "19 April 2026, 11:15"
    }
]
```

### Save Function
```javascript
function saveToLocalStorage(data) {
    try {
        localStorage.setItem('uploadedFiles', JSON.stringify(data));
        console.log('✅ Data berhasil disimpan');
        return true;
    } catch (error) {
        console.error('❌ Error:', error);
        // Error bisa terjadi jika storage penuh (quota exceeded)
        return false;
    }
}
```

### Load Function
```javascript
function getFromLocalStorage() {
    try {
        const data = localStorage.getItem('uploadedFiles');
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('❌ Error:', error);
        return [];
    }
}
```

### Load saat Page Load
```javascript
document.addEventListener('DOMContentLoaded', function() {
    loadDataFromStorage();  // Load dari localStorage
    renderUI();             // Render ke UI
});

function loadDataFromStorage() {
    filesData = getFromLocalStorage();
    console.log(`📊 Ditemukan ${filesData.length} file`);
}
```

---

## 🔄 Sinkronisasi Data & UI

### Prinsip Utama

**Setiap perubahan data → Update localStorage → Render ulang UI**

```javascript
// Contoh: Hapus file
function deleteFile(fileId) {
    // 1. Update data
    filesData = filesData.filter(f => f.id !== fileId);
    
    // 2. Simpan ke localStorage
    saveToLocalStorage(filesData);
    
    // 3. Render ulang UI
    renderUI();
}
```

### Render Function
```javascript
function renderUI() {
    if (isLoading) {
        // Tampilkan skeleton
        renderSkeletonGrid();
        renderSkeletonTable();
    } else {
        // Tampilkan data asli
        renderFileGrid();
        renderFileTable();
    }
}
```

---

## 🎯 Cara Integrasi ke Project Kamu

### Opsi 1: Copy-Paste Langsung

1. **Copy CSS Skeleton** dari `skeleton-styles.css` (bagian skeleton saja)
2. **Copy Functions** yang dibutuhkan dari `skeleton-script.js`:
   - `renderSkeletonCard()`
   - `renderSkeletonTable()`
   - `fileToBase64()`
   - `saveToLocalStorage()`
   - `getFromLocalStorage()`

### Opsi 2: Adaptasi ke Project Existing

#### Untuk Portfolio (portofolio.html)

```javascript
// Tambahkan di script.js

// 1. Tambahkan state loading
let isLoadingPortfolio = false;

// 2. Modifikasi renderPortfolioItems()
function renderPortfolioItems() {
    const grid = document.getElementById('portfolioGrid');
    
    if (isLoadingPortfolio) {
        // Tampilkan skeleton
        grid.innerHTML = Array(6).fill(0).map(() => `
            <div class="skeleton-card">
                <div class="skeleton-preview"></div>
                <div class="skeleton-title"></div>
                <div class="skeleton-text"></div>
                <div class="skeleton-buttons">
                    <div class="skeleton-button"></div>
                    <div class="skeleton-button"></div>
                </div>
            </div>
        `).join('');
        return;
    }
    
    // Render data asli (kode existing kamu)
    // ...
}

// 3. Simulasi loading saat page load
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('portofolio.html')) {
        isLoadingPortfolio = true;
        renderPortfolioItems();
        
        setTimeout(() => {
            isLoadingPortfolio = false;
            loadPortfolioItems();  // Load dari localStorage
            renderPortfolioItems();
        }, 800);
    }
});
```

#### Untuk Certificate (sertifikat.html)

```javascript
// Tambahkan di script.js

// 1. Modifikasi handleCertFileUpload
window.handleCertFileUpload = async function(file) {
    try {
        // Validasi
        if (file.size > 5 * 1024 * 1024) {
            showToast('File terlalu besar! Maksimal 5MB.', 'error');
            return null;
        }
        
        // Convert ke Base64
        const base64 = await fileToBase64(file);
        return base64;
        
    } catch (error) {
        showToast('Gagal membaca file!', 'error');
        return null;
    }
}

// 2. Tambahkan function fileToBase64
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
    });
}
```

---

## 🛠️ Customization

### Ubah Warna Skeleton

```css
/* Di style.css, tambahkan: */
.skeleton-preview {
    background: linear-gradient(90deg, 
        var(--soft-red-100) 25%, 
        var(--soft-red-200) 50%, 
        var(--soft-red-100) 75%
    );
}
```

### Ubah Durasi Animasi

```css
.skeleton-preview {
    animation: shimmer 2s infinite;  /* Ubah dari 1.5s ke 2s */
}
```

### Ubah Jumlah Skeleton

```javascript
function renderSkeletonGrid() {
    const skeletonCount = 9;  // Ubah dari 6 ke 9
    // ...
}
```

---

## ⚠️ Limitasi & Solusi

### 1. LocalStorage Quota (5-10MB)

**Problem**: LocalStorage terbatas ~5-10MB per domain

**Solusi**:
```javascript
// Kompress gambar sebelum simpan
// Atau batasi jumlah file
const MAX_FILES = 20;

if (filesData.length >= MAX_FILES) {
    showStatus('Maksimal 20 file!', 'error');
    return;
}
```

### 2. Base64 Membuat File Lebih Besar (~33%)

**Problem**: File 1MB → Base64 ~1.33MB

**Solusi**:
- Batasi ukuran file (max 2-3MB)
- Atau gunakan IndexedDB untuk file besar

### 3. Performance dengan Banyak File

**Problem**: Render 100+ cards bisa lambat

**Solusi**:
```javascript
// Implementasi pagination
const itemsPerPage = 12;
const currentPage = 1;

function renderFileGrid() {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedData = filesData.slice(start, end);
    
    // Render hanya paginatedData
}
```

---

## 🎓 Best Practices

### 1. Selalu Gunakan try-catch
```javascript
try {
    localStorage.setItem(key, value);
} catch (error) {
    // Handle quota exceeded
    console.error('Storage penuh!', error);
}
```

### 2. Validasi Input
```javascript
// Cek ukuran, tipe, nama file
function validateFile(file) {
    // Implementasi validasi
}
```

### 3. Feedback ke User
```javascript
// Selalu beri feedback
showStatus('Berhasil!', 'success');
showStatus('Gagal!', 'error');
showStatus('Loading...', 'loading');
```

### 4. Cleanup Data Lama
```javascript
// Hapus file lebih dari 30 hari
function cleanupOldFiles() {
    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
    filesData = filesData.filter(f => 
        new Date(f.uploadDate).getTime() > thirtyDaysAgo
    );
    saveToLocalStorage(filesData);
}
```

---

## 📊 Testing Checklist

- [ ] Upload file berhasil
- [ ] File muncul di UI
- [ ] Refresh browser → data tetap ada
- [ ] Hapus file berhasil
- [ ] Skeleton muncul saat loading
- [ ] Validasi file berfungsi
- [ ] Error handling berfungsi
- [ ] Responsive di mobile

---

## 🐛 Troubleshooting

### Data Hilang Setelah Refresh

**Cek**:
1. Apakah `saveToLocalStorage()` dipanggil?
2. Apakah ada error di console?
3. Cek localStorage di DevTools → Application → Local Storage

### Skeleton Tidak Muncul

**Cek**:
1. Apakah CSS skeleton sudah di-include?
2. Apakah `isLoading = true` sebelum render?
3. Cek class name di HTML vs CSS

### File Tidak Bisa Diupload

**Cek**:
1. Apakah tipe file diizinkan?
2. Apakah ukuran file < max size?
3. Cek console untuk error FileReader

---

## 📞 Support

Jika ada pertanyaan atau issue:
1. Cek console browser (F12)
2. Cek localStorage di DevTools
3. Cek network tab untuk error

---

## 🎉 Selesai!

Kamu sekarang punya:
- ✅ Skeleton loading yang smooth
- ✅ Upload file dengan localStorage
- ✅ Data persistent setelah refresh
- ✅ Validasi & error handling
- ✅ UI/UX yang modern

**Happy Coding! 🚀**
