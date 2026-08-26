/**
 * 浪愛串聯 - 愛心碼抽選系統
 */

// ===== 設定區 =====
const TOTAL_QR_CODES = 1;  // 請根據實際圖片數量修改
const QR_FOLDER = 'assets/qrcodes/';
const IMAGE_EXTENSION = 'png';

let drawHistory = [];
let currentDraw = null;

// ===== DOM 元素 =====
const qrcodeImage = document.getElementById('qrcodeImage');
const qrcodePlaceholder = document.getElementById('qrcodePlaceholder');
const drawBtn = document.getElementById('drawBtn');
const qrcodeStatus = document.getElementById('qrcodeStatus');

// ===== 核心功能 =====
function drawQRCode() {
    const randomIndex = Math.floor(Math.random() * TOTAL_QR_CODES) + 1;
    const imagePath = `${QR_FOLDER}qr-${randomIndex}.${IMAGE_EXTENSION}`;
    
    currentDraw = {
        index: randomIndex,
        path: imagePath,
        timestamp: new Date().toLocaleString()
    };
    drawHistory.push(currentDraw);
    
    displayQRCode(imagePath, randomIndex);
}

function displayQRCode(imagePath, index) {
    qrcodeImage.src = imagePath;
    qrcodeImage.alt = `愛心碼 ${index}`;
    
    qrcodeImage.style.display = 'block';
    qrcodePlaceholder.style.display = 'none';
    
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
    };
    
    qrcodeImage.onload = function() {
        qrcodeStatus.textContent = `🎉 愛心碼 #${index}（共 ${TOTAL_QR_CODES} 張）`;
        qrcodeStatus.style.color = '#2d2d2d';
    };
}

function resetDisplay() {
    qrcodeImage.style.display = 'none';
    qrcodePlaceholder.style.display = 'flex';
    qrcodePlaceholder.innerHTML = `
        <span class="placeholder-icon">🎲</span>
        <p>點擊「抽」按鈕開始</p>
    `;
    qrcodeStatus.textContent = '點擊按鈕抽選愛心碼';
    qrcodeStatus.style.color = '#999';
    currentDraw = null;
}

// ===== 事件綁定 =====
drawBtn.addEventListener('click', drawQRCode);

document.addEventListener('keydown', function(e) {
    if (e.code === 'Space' && !e.repeat) {
        e.preventDefault();
        drawQRCode();
    }
});

// ===== Console 工具 =====
console.log(`🐾 浪愛串聯 - 愛心碼系統已載入`);
console.log(`📁 共 ${TOTAL_QR_CODES} 張愛心碼圖片，存放於 ${QR_FOLDER}`);

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
