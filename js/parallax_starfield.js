const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let stars = [];
const numStars = 300;
let centerX = canvas.width / 2;
let centerY = canvas.height / 2;

class WarpStar {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = (Math.random() - 0.5) * canvas.width;
        this.y = (Math.random() - 0.5) * canvas.height;
        this.z = Math.random() * canvas.width;
        // الألوان بدون توهج (shadowBlur) لمنع الوميض الأصفر
        this.color = Math.random() > 0.8 ? '#D4AF37' : '#FF0000';
    }

    update() {
        this.z -= 8; // سرعة معتدلة وأكثر سلاسة
        if (this.z <= 0) {
            this.reset();
            this.z = canvas.width;
        }
    }

    draw() {
        let sx = (this.x / this.z) * canvas.width + centerX;
        let sy = (this.y / this.z) * canvas.height + centerY;

        let r = (1 - this.z / canvas.width) * 2;

        // حساب موقع الذيل
        let px = (this.x / (this.z + 15)) * canvas.width + centerX;
        let py = (this.y / (this.z + 15)) * canvas.height + centerY;

        // رسم الخط مباشرة بدون shadowBlur
        ctx.beginPath();
        ctx.strokeStyle = this.color;
        ctx.lineWidth = r;
        ctx.lineCap = 'round';
        ctx.moveTo(sx, sy);
        ctx.lineTo(px, py);
        ctx.stroke();
    }
}

function init() {
    stars = [];
    for (let i = 0; i < numStars; i++) {
        stars.push(new WarpStar());
    }
}

function animate() {
    // زيادة عتمة المسح لضمان عدم تراكم البكسلات
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let star of stars) {
        star.update();
        star.draw();
    }
    requestAnimationFrame(animate);
}

init();
animate();

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    centerX = canvas.width / 2;
    centerY = canvas.height / 2;
    init();
});