/* =========================================
   تأثير فك التشفير السيبراني (Cyber Text Decryption)
   يعمل كملف مستقل تماماً ولا يؤثر على باقي الأكواد
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {
    // الرموز التي ستظهر أثناء التشفير (يمكنك تعديلها)
    const letters = "!<>-_\\/[]{}—=+*^?#_0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    // استهداف جميع العناصر التي تحمل كلاس cyber-text
    const elements = document.querySelectorAll('.cyber-text');

    // إعداد المراقب (Observer) لتشغيل التأثير عند ظهور العنصر في الشاشة
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                decryptEffect(entry.target);
                observer.unobserve(entry.target); // تشغيل مرة واحدة عند النزول
            }
        });
    }, { threshold: 0.5 }); // يعمل عندما يظهر 50% من العنصر

    elements.forEach(el => {
        // حفظ النص الأصلي كبيانات مخفية لكي لا نفقده
        if (!el.dataset.targetText) {
            el.dataset.targetText = el.innerText;
        }

        // مراقبة العنصر عند النزول (Scroll)
        observer.observe(el);

        // إضافة تأثير تفاعلي عند تمرير الماوس (Hover)
        el.addEventListener('mouseover', () => {
            decryptEffect(el);
        });
    });

    // دالة فك التشفير الأساسية
    function decryptEffect(element) {
        let iteration = 0;
        const targetText = element.dataset.targetText;

        // إيقاف أي أنيميشن سابق على نفس العنصر لمنع التداخل
        clearInterval(element.decryptInterval);

        element.decryptInterval = setInterval(() => {
            element.innerText = targetText
                .split("")
                .map((letter, index) => {
                    // إذا وصل المؤشر للحرف، أظهر الحرف الحقيقي
                    if (index < iteration) {
                        return targetText[index];
                    }
                    // الحفاظ على المسافات كما هي
                    if (targetText[index] === " ") return " ";

                    // إظهار رمز عشوائي للأحرف التي لم تُفك شفرتها بعد
                    return letters[Math.floor(Math.random() * letters.length)];
                })
                .join("");

            // إيقاف المؤقت عند اكتمال الكلمة
            if (iteration >= targetText.length) {
                clearInterval(element.decryptInterval);
            }

            // سرعة فك التشفير (كلما قل الرقم كان أبطأ)
            iteration += 1 / 3;
        }, 30); // سرعة تحديث الرموز (بالملي ثانية)
    }
});