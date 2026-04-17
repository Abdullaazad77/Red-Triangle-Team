// =========================================
// ثوابت الأسعار والإعدادات
// =========================================
const BASE_PRICE = 20000; // تم جعلها صفر لأن أسعار القائمة المنسدلة كاملة (40 ألف، 35 ألف..الخ)
const PRACTICAL_PRICE = 40000; // سعر الجانب العملي
const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbxzlx7KOpKFoA7thKQpDMluQ4b7vrRb_SJFHJoCAT6R5dANKVtt2lS4o9mUMthDqpzm/exec";

let isDiscountApplied = false;

// =========================================
// التنقل والتحقق من الحقول
// =========================================
function goToStep(stepNumber) {
    document.querySelectorAll('.form-step').forEach(step => step.classList.remove('active-step'));
    document.getElementById('step' + stepNumber).classList.add('active-step');
    updateProgressBar(stepNumber);
}

function validateAndNext(currentStep, nextStep) {
    const currentStepDiv = document.getElementById('step' + currentStep);
    const requiredFields = currentStepDiv.querySelectorAll('[required]');
    let isValid = true;

    requiredFields.forEach(field => {
        // التحقق من أن الحقل غير فارغ (يشمل القائمة المنسدلة)
        if (!field.value.trim() || field.value === "") {
            isValid = false;
            field.style.borderColor = "#ff0000"; // تنبيه باللون الأحمر
        } else {
            field.style.borderColor = "#444"; // إعادة اللون الطبيعي
        }
    });

    if (isValid) {
        goToStep(nextStep);
    } else {
        alert("يرجى ملء جميع الحقول المطلوبة واختيار نوع الخدمة قبل الانتقال.");
    }
}

function updateProgressBar(stepNumber) {
    const steps = document.querySelectorAll('.progress-step');
    steps.forEach((step, index) => {
        if (index < stepNumber) step.classList.add('active');
        else step.classList.remove('active');
    });
    const progressBar = document.getElementById('progressBar');
    progressBar.style.width = ((stepNumber - 1) / (steps.length - 1)) * 100 + "%";
}

// =========================================
// نظام الخصم وحساب السعر
// =========================================
function applyDiscount() {
    const input = document.getElementById('couponInput').value.trim();
    const message = document.getElementById('couponMessage');
    const priceSpan = document.getElementById('priceValue');

    if (typeof SECRET_CONFIG === 'undefined') {
        alert("إعدادات الخصم غير موجودة، تأكد من استدعاء ملف main.js");
        return;
    }

    if (input.toUpperCase() === SECRET_CONFIG.code.toUpperCase()) {
        isDiscountApplied = true;
        message.innerText = "تم تفعيل خصم " + SECRET_CONFIG.discount + " بنجاح!";
        message.style.color = "#00ff00";
        message.style.display = "block";

        // نبض السعر
        priceSpan.classList.add('price-changed');
        setTimeout(() => priceSpan.classList.remove('price-changed'), 600);

        calculate(); // إعادة الحساب فوراً
    } else {
        isDiscountApplied = false;
        message.innerText = "كود الخصم غير صحيح!";
        message.style.color = "#ff0000";
        message.style.display = "block";
        calculate();
    }
}

function calculate() {
    // 1. جلب السعر الأساسي وسعر الخدمة (إذا كانت القائمة فارغة سيقرأ 0)
    let serviceValue = parseInt(document.getElementById('serviceType').value);
    if (isNaN(serviceValue)) serviceValue = 0;

    let total = BASE_PRICE + serviceValue;

    // 2. إضافة الجانب العملي
    if (document.getElementById('isPractical') && document.getElementById('isPractical').checked) {
        total += PRACTICAL_PRICE;
    }

    // 3. حساب موعد التسليم (الاستعجال)
    const deadline = document.getElementById('deadline') ? document.getElementById('deadline').value : null;
    if (deadline && total > 0) {
        const days = Math.ceil((new Date(deadline) - new Date()) / (86400000));
        if (days > 0 && days <= 2) total *= 1.5;
        else if (days > 2 && days <= 5) total *= 1.2;
    }

    // 4. تطبيق الخصم
    if (isDiscountApplied && typeof SECRET_CONFIG !== 'undefined' && total > 0) {
        const discountPercent = parseFloat(SECRET_CONFIG.discount) / 100;
        total = total - (total * discountPercent);
    }

    // 5. عرض السعر
    document.getElementById('priceValue').innerText = Math.floor(total).toLocaleString() + " د.ع";
}

// =========================================
// مشغلات الأحداث وإرسال البيانات
// =========================================

// تحديث السعر عند أي تغيير (اختيار خدمة، ضغط على جانب عملي، الخ)
document.getElementById('orderForm').addEventListener('change', calculate);

document.getElementById('orderForm').addEventListener('submit', function (e) {
    e.preventDefault();

    document.getElementById('loading').style.display = 'block';
    const submitBtn = document.querySelector('.submit-btn');
    if (submitBtn) submitBtn.style.display = 'none';

    const serviceSelect = document.getElementById('serviceType');
    const serviceText = serviceSelect.options[serviceSelect.selectedIndex].text;

    const data = {
        clientName: document.getElementById('clientName').value,
        phone: document.getElementById('phone').value,
        university: document.getElementById('university').value,
        department: document.getElementById('university').value,
        researchTitle: document.getElementById('researchTitle').value,
        serviceType: serviceText,
        chapters: 4,
        isPractical: document.getElementById('isPractical').checked ? "نعم" : "لا",
        deadline: document.getElementById('deadline').value,
        expectedPrice: document.getElementById('priceValue').innerText,
        notes: document.getElementById('notes') ? document.getElementById('notes').value : "",
        fileUrl: isDiscountApplied ? "استخدم كود خصم: " + SECRET_CONFIG.code : ""
    };

    fetch(WEB_APP_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(data)
    }).then(response => response.json())
        .then(res => {
            alert("تم استلام طلبك بنجاح! سنتواصل معك قريباً لتأكيد التفاصيل.");
            window.location.reload();
        }).catch(err => {
            alert("حدث خطأ أثناء الاتصال بالخادم، يرجى المحاولة لاحقاً.");
            document.getElementById('loading').style.display = 'none';
            if (submitBtn) submitBtn.style.display = 'block';
        });
});

// تشغيل دالة الحساب لأول مرة عند فتح الصفحة ليكون السعر 0 د.ع
calculate();