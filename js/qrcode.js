/**
 * 浪愛串聯 - 愛心碼抽選系統
 */

// ===== 設定區 =====
const TOTAL_QR_CODES = 1;  // 請根據實際圖片數量修改
const QR_FOLDER = 'assets/qrcodes/';
const IMAGE_EXTENSION = 'png';

let drawHistory = [];
let currentDraw = null;
let currentImagePath = null;  // 記錄當前圖片路徑

// ===== DOM 元素 =====
const qrcodeImage = document.getElementById('qrcodeImage');
const qrcodePlaceholder = document.getElementById('qrcodePlaceholder');
const drawBtn = document.getElementById('drawBtn');
const downloadBtn = document.getElementById('downloadBtn');
const qrcodeStatus = document.getElementById('qrcodeStatus');

// ===== 核心功能：隨機抽選 =====
function drawQRCode() {
    const randomIndex = Math.floor(Math.random() * TOTAL_QR_CODES) + 1;
    const imagePath = `${QR_FOLDER}qr-${randomIndex}.${IMAGE_EXTENSION}`;
    
    currentDraw = {
        index: randomIndex,
        path: imagePath,
        timestamp: new Date().toLocaleString()
    };
    currentImagePath = imagePath;
    drawHistory.push(currentDraw);
    
    displayQRCode(imagePath, randomIndex);
}

// ===== 顯示愛心碼 =====
function displayQRCode(imagePath, index) {
    qrcodeImage.src = imagePath;
    qrcodeImage.alt = `愛心碼 ${index}`;
    
    qrcodeImage.style.display = 'block';
    qrcodePlaceholder.style.display = 'none';
    
    // 顯示下載按鈕
    downloadBtn.style.display = 'inline-flex';
    
    qrcodeStatus.textContent = `🎉 目前顯示：愛心碼 #${index}（共 ${TOTAL_QR_CODES} 張）`;
    qrcodeStatus.style.color = '#2d2d2d';
    
    qrcodeImage.onerror = function() {
        qrcodeStatus.textContent = `⚠️ 圖片 qr-${index}.${IMAGE_EXTENSION} 不存在，請檢查圖片檔案名稱是否連續`;
        qrcodeStatus.style.color = '#e74c3c';
        qrcodeImage.style.display = 'none';
        qrcodePlaceholder.style.display = 'flex';
        qrcodePlaceholder.innerHTML = `
            <span class="placeholder-icon">❌</span>
            <p>圖片載入失敗<br><small>請確認圖片檔案名稱是否為 qr-1.${IMAGE_EXTENSION} ~ qr-${TOTAL_QR_CODES}.${IMAGE_EXTENSION}</small></p>
        `;
        downloadBtn.style.display = 'none';
    };
    
    qrcodeImage.onload = function() {
        qrcodeStatus.textContent = `🎉 愛心碼 #${index}（共 ${TOTAL_QR_CODES} 張）`;
        qrcodeStatus.style.color = '#2d2d2d';
    };
}

// ===== 下載愛心碼 =====
function downloadQRCode() {
    if (!currentImagePath) {
        alert('請先抽一張愛心碼！');
        return;
    }
    
    // 從圖片路徑取出檔名
    const fileName = currentImagePath.split('/').pop();
    
    // 方法一：使用 fetch 下載（支援跨域）
    fetch(currentImagePath)
        .then(response => response.blob())
        .then(blob => {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `愛心碼_${currentDraw.index}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            
            // 更新狀態
            qrcodeStatus.textContent = `✅ 已下載：愛心碼 #${currentDraw.index}`;
            qrcodeStatus.style.color = '#27ae60';
            
            // 3秒後恢復狀態
            setTimeout(() => {
                qrcodeStatus.textContent = `🎉 愛心碼 #${currentDraw.index}（共 ${TOTAL_QR_CODES} 張）`;
                qrcodeStatus.style.color = '#2d2d2d';
            }, 3000);
        })
        .catch(error => {
            console.error('下載失敗:', error);
            
            // 方法二：如果 fetch 失敗，直接用 a 標籤（備用方案）
            try {
                const link = document.createElement('a');
                link.href = currentImagePath;
                link.download = `愛心碼_${currentDraw.index}.png`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } catch (e) {
                alert('下載失敗，請嘗試在圖片上右鍵另存圖片');
            }
        });
}

// ===== 重置顯示 =====
function resetDisplay() {
    qrcodeImage.style.display = 'none';
    qrcodePlaceholder.style.display = 'flex';
    qrcodePlaceholder.innerHTML = `
        <span class="placeholder-icon">🎲</span>
        <h3>準備好了嗎？</h3>
        <p>點擊下方按鈕，抽一張愛心碼</p>
    `;
    qrcodeStatus.textContent = '💡 點擊「抽一張」開始';
    qrcodeStatus.style.color = '#999';
    downloadBtn.style.display = 'none';
    currentDraw = null;
    currentImagePath = null;
}

// ===== 事件綁定 =====
drawBtn.addEventListener('click', drawQRCode);
downloadBtn.addEventListener('click', downloadQRCode);

// 鍵盤快捷鍵：空白鍵抽選，D 鍵下載
document.addEventListener('keydown', function(e) {
    if (e.code === 'Space' && !e.repeat) {
        e.preventDefault();
        drawQRCode();
    }
    if ((e.code === 'KeyD') && !e.repeat) {
        e.preventDefault();
        downloadQRCode();
    }
});

// ===== Console 工具 =====
console.log(`🐾 浪愛串聯 - 愛心碼系統已載入`);
console.log(`📁 共 ${TOTAL_QR_CODES} 張愛心碼圖片，存放於 ${QR_FOLDER}`);
console.log(`💡 快捷鍵：空白鍵=抽選，D鍵=下載`);

window.showHistory = function() {
    console.log('📋 抽選歷史記錄：');
    if (drawHistory.length === 0) {
        console.log('  尚無抽選記錄');
        return;
    }
    drawHistory.forEach((item, i) => {
        console.log(`  ${i+1}. #${item.index} - ${item.timestamp}`);
    });
};

window.resetAll = function() {
    resetDisplay();
    drawHistory = [];
    console.log('🔄 已重置所有狀態');
};
