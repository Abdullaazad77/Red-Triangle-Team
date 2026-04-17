const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray = [];

// إعدادات الجزيئات
const numberOfParticles = 70; // عدد الجزيئات (لا تزيده كثيراً للحفاظ على الأناقة)
const colors = ['rgba(255, 0, 0, 0.6)', 'rgba(212, 175, 55, 0.4)', 'rgba(255, 50, 50, 0.3)']; // أحمر وذهبي

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 4 + 0.5; // أحجام صغيرة جداً
        this.speedX = (Math.random() * 0.4) - 0.2; // حركة بطيئة يميناً ويساراً
        this.speedY = (Math.random() * 0.4) - 0.2; // حركة بطيئة للأعلى والأسفل
        this.color = colors[Math.floor(Math.random() * colors.length)];
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // إذا خرجت الجزيئات من الشاشة، تعود من الجهة الأخرى
        if (this.size > 0.2) this.size -= 0.005; // تصغر بمرور الوقت
        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height || this.size <= 0.2) {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
        }
    }
    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();

        // إضافة توهج خفيف (Glow) للجزيئات
        ctx.shadowBlur = 8;
        ctx.shadowColor = this.color;
    }
}

function init() {
    particlesArray = [];
    for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle());
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
    }
    requestAnimationFrame(animate);
}

init();
animate();

// تحديث حجم الشاشة عند تصغير/تكبير المتصفح
window.addEventListener('resize', function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    init();
});