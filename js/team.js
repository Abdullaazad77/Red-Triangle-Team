/* =========================================
   نظام الملف التعريفي الشامل لأعضاء الفريق
   ========================================= */
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('cvModal');
    const closeBtn = document.querySelector('.close-cv');
    const teamCards = document.querySelectorAll('.team-card');

    const cvImage = document.getElementById('cvImage');
    const cvName = document.getElementById('cvName');
    const cvRole = document.getElementById('cvRole');
    const cvExperience = document.getElementById('cvExperience');
    const cvProjects = document.getElementById('cvProjects');
    const cvCertificates = document.getElementById('cvCertificates');
    const cvTags = document.getElementById('cvTags');

    teamCards.forEach(card => {
        card.addEventListener('click', function () {
            // جلب البيانات من البطاقة
            const imgSrc = this.querySelector('img').src;
            const name = this.getAttribute('data-name');
            const role = this.getAttribute('data-role');
            const experience = this.getAttribute('data-experience');
            const projects = JSON.parse(this.getAttribute('data-projects') || "[]");
            const certs = JSON.parse(this.getAttribute('data-certs') || "[]");
            const tags = this.getAttribute('data-tags').split(',');

            // تعبئة البيانات
            cvImage.src = imgSrc;
            cvName.innerText = name;
            cvRole.innerText = role;
            cvExperience.innerText = experience;

            // تفريغ وتعبئة القوائم
            cvProjects.innerHTML = "";
            cvCertificates.innerHTML = "";
            cvTags.innerHTML = "";

            projects.forEach(proj => { cvProjects.innerHTML += `<li>${proj}</li>`; });
            certs.forEach(cert => { cvCertificates.innerHTML += `<li>${cert}</li>`; });
            tags.forEach(tag => { cvTags.innerHTML += `<span class="tech-tag">${tag.trim()}</span>`; });

            // إظهار النافذة (الـ CSS سيتكفل بالانبثاق السلس)
            modal.classList.add('show');
        });
    });

    // إغلاق النافذة
    closeBtn.addEventListener('click', () => {
        modal.classList.remove('show');
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('show');
        }
    });
});