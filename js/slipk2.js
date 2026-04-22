function loadFonts() {
    const fonts = [
        new FontFace('SFThonburiLight', 'url(assets/fonts/SFThonburi.woff)'),
        new FontFace('SFThonburiRegular', 'url(assets/fonts/SFThonburi-Regular.woff)'),
        new FontFace('SFThonburiSemiBold', 'url(assets/fonts/SFThonburi-Semibold.woff)'),
        new FontFace('SFThonburiBold', 'url(assets/fonts/SFThonburi-Bold.woff)'),
    ];

    return Promise.all(fonts.map(font => font.load())).then(function(loadedFonts) {
        loadedFonts.forEach(function(font) {
            document.fonts.add(font);
        });
    });
}

window.onload = function() {
    setCurrentDateTime();
    loadFonts().then(function() {
        document.fonts.ready.then(function() {
            updateDisplay(); 
        });
    }).catch(function() {
        updateDisplay();
    });
};

function setCurrentDateTime() {
    const now = new Date();
    const localDateTime = now.toLocaleString('sv-SE', { timeZone: 'Asia/Bangkok', hour12: false });
    
    const formattedDateTime = localDateTime.substring(0, 16); 
    const datetimeInput = document.getElementById('datetime');
    if(datetimeInput) datetimeInput.value = formattedDateTime;
    
    const oneMinuteLater = new Date(now.getTime() + 60000); 
    const hours = oneMinuteLater.getHours().toString().padStart(2, '0');
    const minutes = oneMinuteLater.getMinutes().toString().padStart(2, '0');
    const formattedTimePlusOne = `${hours}:${minutes}`;
    const datetimePlusInput = document.getElementById('datetime_plus_one');
    if(datetimePlusInput) datetimePlusInput.value = formattedTimePlusOne;
}

function padZero(number) {
    return number < 10 ? '0' + number : number;
}

function formatDateWithDay(date) {
    const days = ['วันอาทิตย์', 'วันจันทร์', 'วันอังคาร', 'วันพุธ', 'วันพฤหัสบดี', 'วันศุกร์', 'วันเสาร์'];
    const months = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];
    
    const d = new Date(date);
    if (isNaN(d)) return '-';
    const dayName = days[d.getDay()];
    const day = d.getDate();
    const month = months[d.getMonth()];

    return `${dayName}ที่ ${day} ${month}`;
}

function formatDate(date) {
    const options = { day: 'numeric', month: 'short', year: '2-digit' };
    const d = new Date(date);
    if (isNaN(d)) return '-';
    let formattedDate = d.toLocaleDateString('th-TH', options);
    formattedDate = formattedDate.replace(/ /g, ' ').replace(/\./g, '');
    const months = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
    const day = parseInt(formattedDate.split(' ')[0]); 
    const month = months[d.getMonth()];
    const year = formattedDate.split(' ')[2];
    return `${day} ${month} ${year}`;
}

let powerSavingMode = false;

function updateDisplay() {
    try {
        const activeBgModeInput = document.getElementById('activeBgMode');
        const activeBgMode = activeBgModeInput ? activeBgModeInput.value : 'system';
        
        let bgToUse = '';
        if (activeBgMode === 'custom') {
            const customDataInput = document.getElementById('customImageDataUrl');
            bgToUse = customDataInput ? customDataInput.value : '';
        } else {
            const bgSelectInput = document.getElementById('backgroundSelect');
            bgToUse = bgSelectInput ? bgSelectInput.value : '';
        }

        const datetime = document.getElementById('datetime') ? document.getElementById('datetime').value : '-';
        const datetimePlusOne = document.getElementById('datetime_plus_one') ? document.getElementById('datetime_plus_one').value : '-';
        const batteryLevel = document.getElementById('battery') ? document.getElementById('battery').value : '100';
        const money01 = document.getElementById('money01') ? document.getElementById('money01').value : '-';
        const senderaccount1 = document.getElementById('senderaccount1') ? document.getElementById('senderaccount1').value : '-';
        
        const formattedDate = formatDate(datetime.substring(0, 10)); 
        const formattedDateWithDay = formatDateWithDay(datetime.substring(0, 10)); 
        const formattedTime = datetime.length > 11 ? datetime.substring(11, 16) : '-'; 
        const formattedTimePlusOne = datetimePlusOne; 
        
        let timeDifference = Math.floor((new Date(`1970-01-01T${formattedTimePlusOne}:00`) - new Date(`1970-01-01T${formattedTime}:00`)) / 60000);
        let timeMessage = "ตอนนี้";

        if (!isNaN(timeDifference)) {
            if (timeDifference >= 60) {
                let hours = Math.floor(timeDifference / 60);
                timeMessage = `${hours} ชั่วโมงที่แล้ว`;
            } else if (timeDifference > 1) {
                timeMessage = `${timeDifference} นาทีที่แล้ว`;
            } else if (timeDifference === 1) {
                timeMessage = "1 นาทีที่แล้ว";
            }
        }
        
        const canvas = document.getElementById('canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        const drawUI = function() {
            try {
                drawText(ctx, `   ${formattedDateWithDay}   `, 308, 167.8,33.50, 'SFThonburiSemiBold', '#ffffff','center', 24, 3, 0, 0, 800, 0);
                drawText(ctx, `${formattedTimePlusOne}`, 295, 298.8,138.50, 'SFThonburiSemiBold', '#ffffff','center', 1.5, 3, 0, 0, 800, -7);
                drawText(ctx, `รายการเงินเข้า`, 107.8, 451.8,21.50, 'SFThonburiBold', '#000000', 'left', 1.5, 3, 0, 0, 800, 0);
                drawText(ctx, `${timeMessage}`, 547.5, 451.8,18.50, 'SFThonburiRegular', '#6f8590', 'right', 1.5, 3, 0, 0, 800, 0);
                drawText(ctx, `บัญชี ${senderaccount1} จำนวนเงิน ${money01} บาท วันที่ ${formattedDate} ${formattedTime} น.<br>`, 107.8, 481.8,20.50, 'SFThonburiRegular', '#000000', 'left', 31.5, 3, 0, 0, 420, 0);

                drawBattery(ctx, batteryLevel, powerSavingMode);
            } catch(e) {
                console.error("เกิดข้อผิดพลาดในการวาด UI:", e);
            }
        };

        // ฟังก์ชันใหม่: โหลดภาพ 2 เลเยอร์พร้อมกันให้ชัวร์ 100% แล้วค่อยวาด
        const drawOverlaysAndUI = function() {
            let loadedCount = 0;
            const img1 = new Image();
            const img2 = new Image();
            let img1Success = false;
            let img2Success = false;

            const checkAndDraw = () => {
                loadedCount++;
                // รอจนกว่ารูปทั้ง 2 รูปจะโหลดเสร็จ (หรือโหลดพลาด)
                if (loadedCount === 2) {
                    if (img1Success) {
                        ctx.globalAlpha = 0.90; // ความใสของ 666 (0.70 = ใส 30%)
                        ctx.drawImage(img1, 0, 0, canvas.width, canvas.height);
                        ctx.globalAlpha = 1.0;  // คืนค่าทึบแสง 100%
                    }
                    if (img2Success) {
                        ctx.drawImage(img2, 0, 0, canvas.width, canvas.height); // วาด 667 แบบทึบ 100%
                    }
                    drawUI(); 
                }
            };

            // ดึงไฟล์ 666 (เลเยอร์กระจก)
            img1.onload = () => { img1Success = true; checkAndDraw(); };
            img1.onerror = () => { console.error("โหลด KB2.666 ไม่สำเร็จ"); checkAndDraw(); };
            img1.src = 'assets/image/bs/backgroundEnter-KB2.666.png';

            // ดึงไฟล์ 667 (เลเยอร์ไอคอนทึบ)
            img2.onload = () => { img2Success = true; checkAndDraw(); };
            img2.onerror = () => { console.error("โหลด KB2.667 ไม่สำเร็จ"); checkAndDraw(); };
            img2.src = 'assets/image/bs/backgroundEnter-KB2.667.png';
        };

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (activeBgMode === 'custom' && bgToUse) {
            // โหมด: อัปโหลดรูปเอง
            const userImg = new Image();
            userImg.onload = function() {
                const imgRatio = userImg.width / userImg.height;
                const canvasRatio = canvas.width / canvas.height;
                let renderW, renderH, offsetX = 0, offsetY = 0;

                if (imgRatio < canvasRatio) {
                    renderW = canvas.width;
                    renderH = canvas.width / imgRatio;
                    offsetY = (canvas.height - renderH) / 2;
                } else {
                    renderH = canvas.height;
                    renderW = canvas.height * imgRatio;
                    offsetX = (canvas.width - renderW) / 2;
                }
                ctx.drawImage(userImg, offsetX, offsetY, renderW, renderH);

                drawOverlaysAndUI();
            };
            userImg.onerror = function() {
                ctx.fillStyle = "#1e293b"; 
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                drawOverlaysAndUI();
            };
            userImg.src = bgToUse;
        } else if (activeBgMode === 'system' && bgToUse) {
            // โหมด: พื้นหลังระบบ
            const systemImg = new Image();
            systemImg.onload = function() {
                ctx.drawImage(systemImg, 0, 0, canvas.width, canvas.height);
                drawUI();
            };
            systemImg.onerror = function() {
                ctx.fillStyle = "#1e293b"; 
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                drawUI(); 
            };
            systemImg.src = bgToUse;
        } else {
            ctx.fillStyle = "#1e293b"; 
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            drawOverlaysAndUI();
        }
    } catch (error) {
        console.error("Critical Error in updateDisplay:", error);
    }
}

function drawText(ctx, text, x, y, fontSize, fontFamily, color, align, lineHeight, maxLines, shadowColor, shadowBlur, maxWidth, letterSpacing) {
    ctx.font = `${fontSize}px ${fontFamily}`;
    ctx.fillStyle = color;
    ctx.textAlign = 'left';
    ctx.shadowColor = shadowColor;
    ctx.shadowBlur = shadowBlur;
    const paragraphs = text.split('<br>');
    let currentY = y;

    paragraphs.forEach(paragraph => {
        const segmenter = new Intl.Segmenter(undefined, { granularity: 'word' });
        const words = [...segmenter.segment(paragraph)].map(segment => segment.segment);

        let lines = [];
        let currentLine = '';

        words.forEach((word) => {
            const testLine = currentLine + word;
            const metrics = ctx.measureText(testLine);
            const testWidth = metrics.width + (testLine.length - 1) * letterSpacing;

            if (testWidth > maxWidth && currentLine !== '') {
                lines.push(currentLine);
                currentLine = word;
            } else {
                currentLine = testLine;
            }
        });
        if (currentLine) {
            lines.push(currentLine.trimStart()); 
        }

        lines.forEach((line, index) => {
            let currentX = x;

            if (align === 'center') {
                currentX = x - (ctx.measureText(line).width / 2) - ((line.length - 1) * letterSpacing) / 2;
            } else if (align === 'right') {
                currentX = x - ctx.measureText(line).width - ((line.length - 1) * letterSpacing);
            }

            drawTextLine(ctx, line, currentX, currentY, letterSpacing);
            currentY += lineHeight;
            if (maxLines && index >= maxLines - 1) {
                return;
            }
        });
        currentY += lineHeight;
    });
}

function drawTextLine(ctx, text, x, y, letterSpacing) {
    if (!letterSpacing) {
        ctx.fillText(text, x, y);
        return;
    }

    const segmenter = new Intl.Segmenter('th', { granularity: 'grapheme' });
    const characters = [...segmenter.segment(text)].map(segment => segment.segment);
    let currentPosition = x;

    characters.forEach((char, index) => {
        ctx.fillText(char, currentPosition, y);
        const charWidth = ctx.measureText(char).width;
        currentPosition += charWidth + letterSpacing;
    });
}

function drawBattery(ctx, batteryLevel, powerSavingMode) {
    ctx.lineWidth = 2; 
    ctx.strokeStyle = '#9b9b9b';
    ctx.fillStyle = '#ffffff';

    let batteryColor = '#ffffff'; 
    if (batteryLevel <= 20) {
        batteryColor = '#ff0000';
    } else if (powerSavingMode) {
        batteryColor = '#fccd0e'; 
    }

    const fillWidth = (batteryLevel / 100) * 31;
    const x = 511.5;
    const y = 32.4;
    const height = 13.8;
    const radius = 4; 

    ctx.fillStyle = batteryColor; 

    ctx.beginPath(); 
    ctx.moveTo(x, y + radius); 
    ctx.lineTo(x, y + height - radius); 
    ctx.arcTo(x, y + height, x + radius, y + height, radius); 
    ctx.lineTo(x + fillWidth - radius, y + height); 
    ctx.arcTo(x + fillWidth, y + height, x + fillWidth, y + height - radius, radius); 
    ctx.lineTo(x + fillWidth, y + radius); 
    ctx.arcTo(x + fillWidth, y, x + fillWidth - radius, y, radius); 
    ctx.lineTo(x + radius, y); 
    ctx.arcTo(x, y, x, y + radius, radius); 
    ctx.closePath(); 
    ctx.fill(); 
}

function togglePowerSavingMode() {
    powerSavingMode = !powerSavingMode;
    const powerSavingButton = document.getElementById('powerSavingMode');
    if(powerSavingButton) powerSavingButton.classList.toggle('active', powerSavingMode);
    updateDisplay();
}

function updateBatteryDisplay() {
    const batteryLevel = document.getElementById('battery') ? document.getElementById('battery').value : 100;
    const levelText = document.getElementById('battery-level');
    if(levelText) levelText.innerText = batteryLevel;
}

function downloadImage() {
    const canvas = document.getElementById('canvas');
    if(!canvas) return;
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = 'kbank_slip_custom.png';
    link.click();
}

const generateBtn = document.getElementById('generate');
if(generateBtn) generateBtn.addEventListener('click', updateDisplay);

function drawImage(ctx, imageUrl, x, y, width, height) {
    const image = new Image();
    image.src = imageUrl;
    image.onload = function() {
        ctx.drawImage(image, x, y, width, height);
    };
}
