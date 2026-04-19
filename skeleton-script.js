// ===== CONFIGURATION =====
const CONFIG = {
    MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'],
    STORAGE_KEY: 'uploadedFiles',
    SKELETON_DELAY: 1000 // 1 detik untuk simulasi
};

// ===== STATE MANAGEMENT =====
let isLoading = false;
let filesData = [];

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Aplikasi dimulai...');
    loadDataFromStorage();
    renderUI();
});

// ===== STORAGE FUNCTIONS =====

/**
 * Simpan data ke localStorage
 */
function saveToLocalStorage(data) {
    try {
        localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(data));
        console.log('✅ Data berhasil disimpan ke localStorage');
        return true;
    } catch (error) {
        console.error('❌ Error menyimpan data:', error);
        showStatus('Gagal menyimpan data: ' + error.message, 'error');
        return false;
    }
}

/**
 * Ambil data dari localStorage
 */
function getFromLocalStorage() {
    try {
        const data = localStorage.getItem(CONFIG.STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('❌ Error membaca data:', error);
        return [];
    }
}

/**
 * Load data dari storage saat halaman dibuka
 */
function loadDataFromStorage() {
    console.log('📂 Memuat data dari localStorage...');
    filesData = getFromLocalStorage();
    console.log(`📊 Ditemukan ${filesData.length} file`);
}

// ===== FILE UPLOAD FUNCTIONS =====

/**
 * Handle upload file
 */
async function handleUpload() {
    const fileInput = document.getElementById('fileInput');
    const files = fileInput.files;

    if (files.length === 0) {
        showStatus('Pilih file terlebih dahulu!', 'error');
        return;
    }

    showStatus('Mengupload file...', 'loading');
    
    try {
        // Process semua file
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            
            // Validasi file
            const validation = validateFile(file);
            if (!validation.valid) {
                showStatus(validation.message, 'error');
                continue;
            }

            // Convert file ke Base64
            const base64 = await fileToBase64(file);
            
            // Buat object data file
            const fileData = {
                id: generateId(),
                name: file.name,
                type: file.type,
                size: file.size,
                base64: base64,
                uploadDate: new Date().toISOString(),
                uploadDateFormatted: formatDate(new Date())
            };

            // Tambahkan ke array
            filesData.push(fileData);
        }

        // Simpan ke localStorage
        saveToLocalStorage(filesData);
        
        // Reset input
        fileInput.value = '';
        
        // Render ulang UI
        renderUI();
        
        showStatus(`Berhasil mengupload ${files.length} file!`, 'success');
        
    } catch (error) {
        console.error('❌ Error upload:', error);
        showStatus('Gagal mengupload file: ' + error.message, 'error');
    }
}

/**
 * Validasi file sebelum upload
 */
function validateFile(file) {
    // Cek ukuran file
    if (file.size > CONFIG.MAX_FILE_SIZE) {
        return {
            valid: false,
            message: `File "${file.name}" terlalu besar! Maksimal ${CONFIG.MAX_FILE_SIZE / 1024 / 1024}MB`
        };
    }

    // Cek tipe file
    if (!CONFIG.ALLOWED_TYPES.includes(file.type)) {
        return {
            valid: false,
            message: `Tipe file "${file.type}" tidak diizinkan!`
        };
    }

    return { valid: true };
}

/**
 * Convert file ke Base64 string
 */
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

// ===== RENDER FUNCTIONS =====

/**
 * Render semua UI (Grid dan Table)
 */
function renderUI() {
    if (isLoading) {
        renderSkeletonGrid();
        renderSkeletonTable();
    } else {
        renderFileGrid();
        renderFileTable();
    }
}

/**
 * Render file grid (cards)
 */
function renderFileGrid() {
    const container = document.getElementById('fileGrid');
    
    if (filesData.length === 0) {
        container.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1;">
                <div class="icon">📁</div>
                <h3>Belum ada file</h3>
                <p>Upload file untuk melihat hasilnya di sini</p>
            </div>
        `;
        return;
    }

    container.innerHTML = filesData.map(file => `
        <div class="file-card">
            <div class="file-preview">
                ${renderFilePreview(file)}
            </div>
            <div class="file-info">
                <h3 title="${file.name}">${file.name}</h3>
                <div class="file-meta">
                    <span>📏 ${formatFileSize(file.size)}</span>
                    <span>📅 ${file.uploadDateFormatted}</span>
                    <span>🏷️ ${getFileTypeLabel(file.type)}</span>
                </div>
            </div>
            <div class="file-actions">
                <button onclick="viewFile('${file.id}')" class="btn-small btn-view">Lihat</button>
                <button onclick="deleteFile('${file.id}')" class="btn-small btn-delete">Hapus</button>
            </div>
        </div>
    `).join('');
}

/**
 * Render file table
 */
function renderFileTable() {
    const container = document.getElementById('fileTable');
    
    if (filesData.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="icon">📊</div>
                <h3>Tidak ada data</h3>
                <p>Tabel akan muncul setelah ada file yang diupload</p>
            </div>
        `;
        return;
    }

    container.innerHTML = `
        <table class="data-table">
            <thead>
                <tr>
                    <th>No</th>
                    <th>Nama File</th>
                    <th>Tipe</th>
                    <th>Ukuran</th>
                    <th>Tanggal Upload</th>
                    <th>Aksi</th>
                </tr>
            </thead>
            <tbody>
                ${filesData.map((file, index) => `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${file.name}</td>
                        <td>${getFileTypeLabel(file.type)}</td>
                        <td>${formatFileSize(file.size)}</td>
                        <td>${file.uploadDateFormatted}</td>
                        <td>
                            <button onclick="viewFile('${file.id}')" class="btn-small btn-view">Lihat</button>
                            <button onclick="deleteFile('${file.id}')" class="btn-small btn-delete">Hapus</button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

/**
 * Render preview file (gambar atau icon)
 */
function renderFilePreview(file) {
    if (file.type.startsWith('image/')) {
        return `<img src="${file.base64}" alt="${file.name}">`;
    } else if (file.type === 'application/pdf') {
        return `<div class="file-icon">📄</div>`;
    } else {
        return `<div class="file-icon">📎</div>`;
    }
}

// ===== SKELETON LOADING FUNCTIONS =====

/**
 * Render skeleton untuk grid (cards)
 */
function renderSkeletonGrid() {
    const container = document.getElementById('fileGrid');
    const skeletonCount = 6; // Tampilkan 6 skeleton cards
    
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

/**
 * Render skeleton untuk table
 */
function renderSkeletonTable() {
    const container = document.getElementById('fileTable');
    const rowCount = 5; // Tampilkan 5 skeleton rows
    
    container.innerHTML = `
        <div class="skeleton-table">
            <div class="skeleton-table-header">
                <div class="skeleton-table-header-cell"></div>
                <div class="skeleton-table-header-cell"></div>
                <div class="skeleton-table-header-cell"></div>
                <div class="skeleton-table-header-cell"></div>
                <div class="skeleton-table-header-cell"></div>
                <div class="skeleton-table-header-cell"></div>
            </div>
            ${Array(rowCount).fill(0).map(() => `
                <div class="skeleton-table-row">
                    <div class="skeleton-table-cell"></div>
                    <div class="skeleton-table-cell"></div>
                    <div class="skeleton-table-cell"></div>
                    <div class="skeleton-table-cell"></div>
                    <div class="skeleton-table-cell"></div>
                    <div class="skeleton-table-cell"></div>
                </div>
            `).join('')}
        </div>
    `;
}

// ===== ACTION FUNCTIONS =====

/**
 * Lihat file (buka di tab baru)
 */
function viewFile(fileId) {
    const file = filesData.find(f => f.id === fileId);
    if (!file) {
        showStatus('File tidak ditemukan!', 'error');
        return;
    }

    // Buka file di tab baru
    const newWindow = window.open();
    if (file.type.startsWith('image/')) {
        newWindow.document.write(`
            <html>
                <head>
                    <title>${file.name}</title>
                    <style>
                        body { margin: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh; background: #000; }
                        img { max-width: 100%; max-height: 100vh; }
                    </style>
                </head>
                <body>
                    <img src="${file.base64}" alt="${file.name}">
                </body>
            </html>
        `);
    } else {
        newWindow.location.href = file.base64;
    }
}

/**
 * Hapus file
 */
function deleteFile(fileId) {
    if (!confirm('Yakin ingin menghapus file ini?')) {
        return;
    }

    // Filter file yang akan dihapus
    filesData = filesData.filter(f => f.id !== fileId);
    
    // Simpan ke localStorage
    saveToLocalStorage(filesData);
    
    // Render ulang UI
    renderUI();
    
    showStatus('File berhasil dihapus!', 'success');
}

/**
 * Hapus semua data
 */
function clearAllData() {
    if (!confirm('Yakin ingin menghapus SEMUA data?')) {
        return;
    }

    filesData = [];
    saveToLocalStorage(filesData);
    renderUI();
    showStatus('Semua data berhasil dihapus!', 'success');
}

/**
 * Simulasi loading (untuk demo skeleton)
 */
function simulateLoading() {
    isLoading = true;
    renderUI();
    
    showStatus('Memuat data...', 'loading');
    
    setTimeout(() => {
        isLoading = false;
        renderUI();
        showStatus('Data berhasil dimuat!', 'success');
    }, CONFIG.SKELETON_DELAY);
}

// ===== UTILITY FUNCTIONS =====

/**
 * Generate unique ID
 */
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * Format ukuran file
 */
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Format tanggal
 */
function formatDate(date) {
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return new Date(date).toLocaleDateString('id-ID', options);
}

/**
 * Get label tipe file
 */
function getFileTypeLabel(type) {
    const typeMap = {
        'image/jpeg': 'JPEG Image',
        'image/png': 'PNG Image',
        'image/gif': 'GIF Image',
        'image/webp': 'WebP Image',
        'application/pdf': 'PDF Document'
    };
    return typeMap[type] || type;
}

/**
 * Tampilkan status message
 */
function showStatus(message, type = 'success') {
    const statusElement = document.getElementById('uploadStatus');
    statusElement.textContent = message;
    statusElement.className = `upload-status ${type}`;
    
    // Auto hide setelah 3 detik (kecuali loading)
    if (type !== 'loading') {
        setTimeout(() => {
            statusElement.className = 'upload-status';
        }, 3000);
    }
}

// ===== CONSOLE INFO =====
console.log(`
╔════════════════════════════════════════╗
║  Skeleton Loading & Upload Demo       ║
║  Ready to use! 🚀                     ║
╚════════════════════════════════════════╝

📚 Available Functions:
- handleUpload()        : Upload file
- viewFile(id)          : Lihat file
- deleteFile(id)        : Hapus file
- clearAllData()        : Hapus semua data
- simulateLoading()     : Demo skeleton loading

💾 Storage Key: ${CONFIG.STORAGE_KEY}
📏 Max File Size: ${CONFIG.MAX_FILE_SIZE / 1024 / 1024}MB
`);
