/* =========================================
   نظام فلترة المشاريع (النسخة المحسنة)
   ========================================= */
document.addEventListener('DOMContentLoaded', () => {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // 1. تغيير شكل الزر النشط
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // 2. جلب نوع الفلتر
            const filterValue = button.getAttribute('data-filter');

            // 3. فلترة البطاقات مع إعادة تشغيل حركة الظهور (Animation)
            projectCards.forEach(card => {
                // إخفاء فوري للجميع
                card.classList.add('hide');
                card.style.animation = 'none'; // تصفير الحركة

                // إظهار البطاقات المطابقة
                if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    setTimeout(() => {
                        card.classList.remove('hide');
                        card.style.animation = 'fadeInCard 0.5s ease-out forwards';
                    }, 50); // تأخير بسيط جداً لضمان عمل الحركة
                }
            });
        });
    });
});