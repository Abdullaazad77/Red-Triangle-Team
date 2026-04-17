// دالة إظهار رسالة "قريباً"
function comingSoon(e) {
    e.preventDefault();
    alert("هذه الخدمة سوف تتاح قريباً، جاري العمل عليها حالياً.\nيمكنك التواصل مع الفريق للطلب المباشر عبر الواتساب أو التليجرام.");
}
// مصفوفة لتخزين ضغطات المفاتيح
let keySequence = [];
const secretCode = 'red';

/* =========================================
   إعدادات كود الخصم السري (Easter Egg)
   ========================================= */
const SECRET_CONFIG = {
    word: "red",              // الكلمة السرية
    discount: "50%",          // نسبة الخصم
    code: "RTT10",            // كود الخصم
    startDate: "2024-05-01",  // تاريخ البداية
    endDate: "2024-12-31"     // تاريخ الانتهاء
};

let inputBuffer = "";

// دالة إظهار رسالة "قريباً" للأزرار العادية
function comingSoon(e) {
    e.preventDefault();
    alert("هذه الخدمة سوف تتاح قريباً، جاري العمل عليها حالياً.\nيمكنك التواصل مع الفريق للطلب المباشر عبر الواتساب أو التليجرام.");
}

// مراقبة ضغطات المفاتيح في الصفحة
document.addEventListener('keydown', (e) => {
    inputBuffer += e.key.toLowerCase();

    if (inputBuffer.length > SECRET_CONFIG.word.length) {
        inputBuffer = inputBuffer.slice(-SECRET_CONFIG.word.length);
    }

    if (inputBuffer === SECRET_CONFIG.word) {
        showSecretTerminal();
        inputBuffer = ""; // تصفير الذاكرة بعد النجاح
    }
});

// دالة لتوليد صوت "نجاح/تنبيه" تقني باستخدام Web Audio API (بدون ملفات خارجية)
function playHackerSound() {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const ctx = new AudioContext();

        // النغمة الأولى
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(880, ctx.currentTime); // نغمة عالية
        gain1.gain.setValueAtTime(0, ctx.currentTime);
        gain1.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.05);
        gain1.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
        osc1.connect(gain1);
        gain1.connect(ctx.destination);
        osc1.start();
        osc1.stop(ctx.currentTime + 0.2);

        // النغمة الثانية (تأتي بعدها مباشرة لتشكيل صوت تنبيه مبهج)
        setTimeout(() => {
            const osc2 = ctx.createOscillator();
            const gain2 = ctx.createGain();
            osc2.type = 'sine';
            osc2.frequency.setValueAtTime(1760, ctx.currentTime); // نغمة أعلى
            gain2.gain.setValueAtTime(0, ctx.currentTime);
            gain2.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.05);
            gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
            osc2.connect(gain2);
            gain2.connect(ctx.destination);
            osc2.start();
            osc2.stop(ctx.currentTime + 0.4);
        }, 150);
    } catch (e) {
        console.log("الصوت غير مدعوم في هذا المتصفح");
    }
}

function showSecretTerminal() {
    // 1. تشغيل صوت النجاح
    playHackerSound();

    // 2. إضافة ستايل الحركات (Animations) برمجياً
    if (!document.getElementById('secret-animations')) {
        const style = document.createElement('style');
        style.id = 'secret-animations';
        style.innerHTML = `
            @keyframes fadeInBg { from { opacity: 0; backdrop-filter: blur(0px); } to { opacity: 1; backdrop-filter: blur(8px); } }
            @keyframes popInModal { 0% { opacity: 0; transform: translate(-50%, -40%) scale(0.8); } 70% { transform: translate(-50%, -50%) scale(1.05); } 100% { opacity: 1; transform: translate(-50%, -50%) scale(1); } }
            .glow-text { text-shadow: 0 0 10px rgba(255,0,0,0.8), 0 0 20px rgba(255,0,0,0.6); }
        `;
        document.head.appendChild(style);
    }

    // 3. إنشاء الخلفية الضبابية (Overlay)
    const overlay = document.createElement('div');
    overlay.id = "secret-overlay";
    overlay.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0, 0, 0, 0.7); z-index: 9998;
        animation: fadeInBg 0.4s ease forwards;
    `;

    // 4. إنشاء واجهة التنبيه الفخمة
    const terminal = document.createElement('div');
    terminal.id = "secret-modal";
    terminal.style.cssText = `
        position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
        width: 90%; max-width: 500px; background: linear-gradient(145deg, #0a0a0a, #111);
        color: #d4af37; padding: 40px 30px; border: 2px solid #ff0000; border-radius: 20px;
        z-index: 9999; box-shadow: 0 0 40px rgba(255, 0, 0, 0.4), inset 0 0 20px rgba(255, 0, 0, 0.1);
        text-align: center; direction: rtl; line-height: 1.8;
        animation: popInModal 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
    `;

    terminal.innerHTML = `
        <i class='bx bxl-play-store' style='color: #ff0000; font-size: 80px; margin-bottom: 15px; display: block;'></i>
        <h2 class="glow-text" style='color: #ff0000; margin-bottom: 20px; font-size: 32px; letter-spacing: 1px;'>تهانينا! لقد اكتشفت السر</h2>
        
        <p style='font-size: 19px; color: #f5f5f5;'>بسبب كتابتك لتسلسل النص <span style="color:#ff0000; font-weight:800; font-size: 22px; text-transform: uppercase;">${SECRET_CONFIG.word}</span> حصلت على خصم <span style="color:#ff0000; font-weight:800; font-size: 22px;">${SECRET_CONFIG.discount}</span> على طلبك!</p>
        
        <div style="margin: 25px 0;">
            <p style='font-size: 16px; color: #d4af37; margin-bottom: 8px;'>عند الطلب، أدخل هذا الكود في حقل الملاحظات:</p>
            <div style="background: rgba(0,0,0,0.8); border: 2px dashed #ff0000; border-radius: 10px; padding: 15px; font-size: 28px; font-weight: 900; color: #ff0000; letter-spacing: 4px; box-shadow: inset 0 0 15px rgba(255,0,0,0.2);">
                ${SECRET_CONFIG.code}
            </div>
        </div>
        
        <p style="font-size: 14px; color: #888; border-top: 1px solid #333; padding-top: 15px;">
            * هذا الكود صالح للاستخدام من <br> <span style="color:#d4af37">${SECRET_CONFIG.startDate}</span> إلى <span style="color:#d4af37">${SECRET_CONFIG.endDate}</span>.
        </p>
        
        <button onclick="document.getElementById('secret-overlay').remove(); document.getElementById('secret-modal').remove();" style="margin-top: 25px; padding: 12px 40px; background: #ff0000; color: #fff; border: none; border-radius: 30px; font-weight: 800; cursor: pointer; font-size: 18px; transition: all 0.3s ease; box-shadow: 0 5px 15px rgba(255,0,0,0.4);">
            استلام الجائزة وإغلاق
        </button>
    `;

    // إضافة تأثير hover لزر الإغلاق
    const btn = terminal.querySelector('button');
    btn.onmouseover = () => { btn.style.transform = 'scale(1.05)'; btn.style.boxShadow = '0 8px 25px rgba(255,0,0,0.6)'; };
    btn.onmouseout = () => { btn.style.transform = 'scale(1)'; btn.style.boxShadow = '0 5px 15px rgba(255,0,0,0.4)'; };

    document.body.appendChild(overlay);
    document.body.appendChild(terminal);
}

/* =========================================
   نظام الأسرار المتعدد (Multi-Secret Arcade & Error System)
   ========================================= */

// ذاكرة لتسجيل آخر 15 زر تم ضغطه
let keyBuffer = [];

// تسلسلات الأكواد
const secret1 = "arrowup,arrowup,arrowdown,arrowdown,arrowleft,arrowright,arrowleft,arrowright,b,a";
const secret2 = "arrowup,arrowup,arrowdown,arrowdown,arrowleft,arrowright,arrowleft,arrowright,a,a";
const secret3 = "arrowup,arrowup,arrowdown,arrowdown,arrowleft,arrowright,arrowleft,arrowright,b,b";
const secret4 = "e,r,r,o,r"; // كود الانهيار الجديد

// مراقبة لوحة المفاتيح
document.addEventListener('keydown', function (e) {
    const key = e.key.toLowerCase();
    keyBuffer.push(key);

    if (keyBuffer.length > 20) {
        keyBuffer.shift();
    }

    const currentSequence = keyBuffer.join(',');

    // فحص التطابق وتشغيل الحدث المناسب
    if (currentSequence.includes(secret1)) {
        triggerEasterEgg(1);
        keyBuffer = [];
    } else if (currentSequence.includes(secret2)) {
        triggerEasterEgg(2);
        keyBuffer = [];
    } else if (currentSequence.includes(secret3)) {
        triggerEasterEgg(3);
        keyBuffer = [];
    } else if (currentSequence.includes(secret4)) {
        triggerEasterEgg(4); // تفعيل شاشة الخطأ
        keyBuffer = [];
    }
});

// دالة توليد الأصوات
function playRetroSound(level) {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const ctx = new AudioContext();

        function playTone(freq, type, startTime, duration) {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = type;
            osc.frequency.setValueAtTime(freq, ctx.currentTime + startTime);
            gain.gain.setValueAtTime(0.1, ctx.currentTime + startTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + startTime + duration);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(ctx.currentTime + startTime);
            osc.stop(ctx.currentTime + startTime + duration);
        }

        if (level === 1) {
            playTone(440, 'square', 0, 0.1);
            playTone(880, 'square', 0.1, 0.3);
        } else if (level === 2) {
            playTone(300, 'sawtooth', 0, 0.1);
            playTone(500, 'sawtooth', 0.1, 0.1);
            playTone(700, 'sawtooth', 0.2, 0.1);
            playTone(900, 'sawtooth', 0.3, 0.4);
        } else if (level === 3) {
            playTone(150, 'square', 0, 0.2);
            playTone(200, 'square', 0.2, 0.2);
            playTone(100, 'sawtooth', 0.4, 0.3);
            playTone(1200, 'square', 0.7, 0.6);
        } else if (level === 4) {
            // صوت الـ Error: مزعج، عشوائي، ويوحي بانهيار النظام
            playTone(100, 'sawtooth', 0, 0.15);
            playTone(50, 'square', 0.1, 0.3);
            playTone(900, 'sawtooth', 0.15, 0.05);
            playTone(30, 'square', 0.2, 0.5); // اهتزاز عميق
            playTone(400, 'sawtooth', 0.4, 0.1);
        }
    } catch (err) {
        console.log("الصوت غير مدعوم");
    }
}

// دالة عرض الشاشات البصرية
function triggerEasterEgg(level) {
    playRetroSound(level);

    // إعدادات المستويات (المستوى 4 مخصص للخطأ)
    const configs = {
        1: { text: "1-UP!", char: "👾", msg: "ARCADE MODE", color1: "#00ffcc", color2: "#ff00ff", isError: false },
        2: { text: "2-UP!", char: "🚀", msg: "GOD MODE", color1: "#39ff14", color2: "#ff6600", isError: false },
        3: { text: "3-UP!", char: "🤖", msg: "BOSS MODE UNLOCKED", color1: "#ff0000", color2: "#d4af37", isError: false },
        4: { text: "ERROR 404", char: "⚠️", msg: "FATAL SYSTEM FAILURE", color1: "#ffffff", color2: "#ff0000", isError: true }
    };

    const config = configs[level];

    if (!document.getElementById('arcade-style')) {
        const style = document.createElement('style');
        style.id = 'arcade-style';
        style.innerHTML = `
            @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
            
            .arcade-overlay {
                position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
                background: rgba(10, 0, 20, 0.95); z-index: 100000;
                display: flex; flex-direction: column; justify-content: center; align-items: center;
                animation: scanlines 0.2s linear infinite; overflow: hidden;
            }

            /* ستايل الشاشة في حالة الـ Error */
            .error-overlay {
                animation: scanlines 0.1s linear infinite, flash-error 0.3s infinite !important;
            }
            
            .arcade-text {
                font-family: 'Press Start 2P', monospace !important;
                font-size: 28px; text-align: center; line-height: 1.8;
                animation: glitch-skew 1s infinite linear alternate-reverse;
                direction: ltr; z-index: 2;
            }

            /* اهتزاز عنيف للنص في حالة الـ Error */
            .error-text {
                animation: severe-shake 0.1s infinite !important;
                text-shadow: 5px 0 #ff0000, -5px 0 #0000ff !important;
            }

            .retro-character {
                position: absolute; font-size: 90px; top: 35%; left: -100px;
                animation: flyAcross 3.5s cubic-bezier(0.25, 0.1, 0.25, 1) forwards, bounce 0.3s infinite alternate;
                z-index: 1;
            }

            /* حركة الشخصية في حالة الـ Error (تتوسط الشاشة وتهتز) */
            .error-character {
                position: relative; top: 0; left: 0; font-size: 120px;
                animation: severe-shake 0.2s infinite !important;
                margin-bottom: 20px;
            }
            
            @keyframes flyAcross {
                0% { left: -100px; transform: scaleX(1); }
                100% { left: 110vw; transform: scaleX(1) rotate(15deg); }
            }

            @keyframes bounce {
                0% { transform: translateY(0); }
                100% { transform: translateY(-20px); }
            }
            
            @keyframes scanlines {
                0% { background: repeating-linear-gradient(0deg, rgba(0,0,0,0.2), rgba(0,0,0,0.2) 2px, transparent 2px, transparent 4px); }
                100% { background: repeating-linear-gradient(0deg, rgba(0,0,0,0.2), rgba(0,0,0,0.2) 2px, transparent 2px, transparent 4px); background-position: 0 4px; }
            }
            
            @keyframes glitch-skew {
                0% { transform: skew(0deg); }
                20% { transform: skew(-10deg); }
                21% { transform: skew(10deg); }
                25% { transform: skew(0deg); }
                50% { transform: skew(0deg); }
                51% { transform: skew(-5deg); }
                55% { transform: skew(0deg); }
                100% { transform: skew(0deg); }
            }

            /* أنيميشن الـ Error العنيف */
            @keyframes flash-error {
                0%, 100% { background-color: rgba(15, 0, 0, 0.95); }
                50% { background-color: rgba(255, 0, 0, 0.6); }
            }

            @keyframes severe-shake {
                0% { transform: translate(2px, 1px) rotate(0deg); }
                10% { transform: translate(-1px, -2px) rotate(-2deg); }
                20% { transform: translate(-3px, 0px) rotate(2deg); }
                30% { transform: translate(0px, 2px) rotate(0deg); }
                40% { transform: translate(1px, -1px) rotate(2deg); }
                50% { transform: translate(-1px, 2px) rotate(-1deg); }
                60% { transform: translate(-3px, 1px) rotate(0deg); }
                70% { transform: translate(2px, 1px) rotate(-2deg); }
                80% { transform: translate(-1px, -1px) rotate(2deg); }
                90% { transform: translate(2px, 2px) rotate(0deg); }
                100% { transform: translate(1px, -2px) rotate(-1deg); }
            }
        `;
        document.head.appendChild(style);
    }

    const overlay = document.createElement('div');
    overlay.className = config.isError ? 'arcade-overlay error-overlay' : 'arcade-overlay';

    overlay.innerHTML = `
        <div class="${config.isError ? 'error-character' : 'retro-character'}" style="filter: drop-shadow(0 0 20px ${config.color1}) drop-shadow(0 0 40px ${config.color2});">
            ${config.char}
        </div>
        <div class="arcade-text ${config.isError ? 'error-text' : ''}" style="color: ${config.color1}; text-shadow: 4px 4px ${config.color2};">
            <span style="font-size: 55px; display:block; margin-bottom: 20px;">${config.text}</span>
            <span style="color: #fff; font-size: 20px;">${config.msg}</span>
            <br><br>
            <span style="font-size: 14px; color: ${config.isError ? '#ff0000' : '#a0a0a0'};">
                ${config.isError ? 'SYSTEM BREACH DETECTED...' : 'RED TRIANGLE SYSTEM OVERRIDE'}
            </span>
        </div>
    `;

    document.body.appendChild(overlay);

    // إزالة التأثير بعد وقت معين (الـ Error يبقى أطول قليلاً لإخافة المستخدم!)
    const duration = config.isError ? 5000 : 4500;
    setTimeout(() => {
        overlay.style.opacity = '0';
        overlay.style.transition = 'opacity 0.8s ease';
        setTimeout(() => overlay.remove(), 800);
    }, duration);
}