const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray = [];

// إعدادات الجزيئات
const numberOfParticles = 90;
const colors = ['rgba(255, 0, 0, 0.6)', 'rgba(212, 175, 55, 0.4)', 'rgba(255, 50, 50, 0.3)'];

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.baseSize = Math.random() * 3 + 1; // الحجم الأساسي للجزيء
        this.size = this.baseSize;
        this.speedX = (Math.random() * 0.4) - 0.2;
        this.speedY = (Math.random() * 0.4) - 0.2;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.angle = Math.random() * 6.28; // زاوية عشوائية للبدء منها (0 إلى 2Pi)
        this.velocity = Math.random() * 0.02 + 0.01; // سرعة "النبض" أو التغيير في الحجم
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // جعل الحجم يتأرجح باستخدام Math.sin
        // سينتج قيمة تتراوح بين (baseSize - 1) و (baseSize + 1) مثلاً
        this.angle += this.velocity;
        this.size = this.baseSize + Math.sin(this.angle) * 1.5;

        // التأكد من بقاء الحجم فوق الصفر دائماً
        if (this.size < 0.5) this.size = 0.5;

        // إعادة الجزيئات إذا خرجت عن حدود الشاشة
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();

        // إضافة توهج خفيف (Glow)
        ctx.shadowBlur = 10;
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
    // استخدام مسح خفيف لترك أثر بسيط خلف الجزيئات (اختياري)
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
    }
    requestAnimationFrame(animate);
}

init();
animate();

window.addEventListener('resize', function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    init();
});