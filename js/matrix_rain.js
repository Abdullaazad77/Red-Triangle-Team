const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const alphabet = "01010101010101010101{}/<>[]!#$";
const fontSize = 16;
const columns = canvas.width / fontSize;
const rainDrops = [];

for (let x = 0; x < columns; x++) {
    rainDrops[x] = Math.random() * -100;
}

function draw() {
    // 1. مسح ناعم جداً لضمان السواد التام ومنع تراكم الألوان
    ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. إيقاف الظلال تماماً لمنع الوميض (Shadow Flicker)
    ctx.shadowBlur = 0;

    for (let i = 0; i < rainDrops.length; i++) {
        const text = alphabet.charAt(Math.floor(Math.random() * alphabet.length));

        // 3. استخدام ألوان ثابتة ومريحة للعين
        // اللون الذهبي سيكون هادئاً، والأحمر سيكون أساسياً
        if (Math.random() > 0.9) {
            ctx.fillStyle = '#D4AF37'; // ذهبي هادئ
        } else {
            ctx.fillStyle = '#8B0000'; // أحمر داكن (أقل إزعاجاً من الأحمر الفاقع)
        }

        ctx.font = fontSize + 'px monospace';

        // 4. رسم الرمز
        ctx.fillText(text, i * fontSize, rainDrops[i] * fontSize);

        // 5. جعل الرمز الأول في كل خيط "أبيض" أو "فاتح" ليعطي شكل رأس المطر (اختياري لجمالية أكثر)
        if (Math.random() > 0.98) {
            ctx.fillStyle = "white";
            ctx.fillText(text, i * fontSize, rainDrops[i] * fontSize);
        }

        if (rainDrops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            rainDrops[i] = 0;
        }
        rainDrops[i]++;
    }
}

// زيادة التوقيت قليلاً ليكون المطر أكثر انسيابية (40ms)
setInterval(draw, 40);

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
});