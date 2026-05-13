const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray = [];
const mouse = {
    x: null,
    y: null,
    radius: 180 // قطر دائرة التأثير
};

window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
});

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.baseSize = this.size;
        this.speedX = (Math.random() * 0.5) - 0.25;
        this.speedY = (Math.random() * 0.5) - 0.25;
        this.color = Math.random() > 0.8 ? '#D4AF37' : '#FF0000';
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // الارتداد الناعم من الحواف
        if (this.x > canvas.width || this.x < 0) this.speedX = -this.speedX;
        if (this.y > canvas.height || this.y < 0) this.speedY = -this.speedY;

        // تفاعل الماوس (تكبير النقطة عند القرب منها)
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouse.radius) {
            // تأثير "النبض" عند اقتراب الماوس
            if (this.size < this.baseSize * 3) this.size += 0.2;
        } else {
            if (this.size > this.baseSize) this.size -= 0.1;
        }
    }
}

function connect() {
    for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
            let dx = particlesArray[a].x - particlesArray[b].x;
            let dy = particlesArray[a].y - particlesArray[b].y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 150) {
                // حساب الشفافية بناءً على المسافة بين النقاط وأيضاً قربها من الماوس
                let opacity = 1 - (distance / 150);

                // حساب قرب الخط من الماوس لزيادة توهجه
                let midX = (particlesArray[a].x + particlesArray[b].x) / 2;
                let midY = (particlesArray[a].y + particlesArray[b].y) / 2;
                let mDx = mouse.x - midX;
                let mDy = mouse.y - midY;
                let mDist = Math.sqrt(mDx * mDx + mDy * mDy);

                let highlight = (mDist < mouse.radius) ? 0.6 : 0.15;

                ctx.strokeStyle = `rgba(212, 175, 55, ${opacity * highlight})`;
                ctx.lineWidth = 0.5;
                ctx.beginPath();
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                ctx.stroke();
            }
        }
    }
}

function init() {
    particlesArray = [];
    let num = (canvas.width * canvas.height) / 8000;
    for (let i = 0; i < num; i++) {
        particlesArray.push(new Particle());
    }
}

function animate() {
    // خلفية سوداء نقية تماماً
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
    }
    connect();
    requestAnimationFrame(animate);
}

init();
animate();

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    init();
});

window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
});