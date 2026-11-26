function buildRequestMessage(service, entries) {
    return [service, ...entries.filter(([, value]) => value.trim()).map(([label, value]) => `${label}: ${value.trim()}`)].join('\n');
}

if (typeof module !== 'undefined') module.exports = { buildRequestMessage };

if (typeof document !== 'undefined') document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('serviceOrderForm');
    if (!form) return;
    const steps = [...form.querySelectorAll('.form-step')];
    const indicators = [...document.querySelectorAll('.progress-step')];
    const fields = [...form.querySelectorAll('[data-label]')];
    const message = document.getElementById('requestStatus');
    const contact = document.getElementById('whatsappRequest');
    let currentStep = 0;
    form.noValidate = true;
    const deadline = form.elements.deadline;
    const today = new Date();
    deadline.min = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    function validate(step) {
        for (const field of step.querySelectorAll('input, select, textarea')) {
            field.setCustomValidity('');
            if (field.required && !field.value.trim()) field.setCustomValidity('يرجى تعبئة هذا الحقل.');
            if (!field.checkValidity()) {
                field.reportValidity();
                field.focus();
                return false;
            }
        }
        return true;
    }

    function showStep(index) {
        currentStep = index;
        steps.forEach((step, i) => {
            step.classList.toggle('active-step', i === index);
            step.hidden = i !== index;
        });
        indicators.forEach((indicator, i) => {
            indicator.classList.toggle('active', i <= index);
            if (i === index) indicator.setAttribute('aria-current', 'step');
            else indicator.removeAttribute('aria-current');
        });
        document.getElementById('progressBar').style.width = `${index / (steps.length - 1) * 100}%`;
        if (index === steps.length - 1) {
            const summary = document.getElementById('requestSummary');
            summary.replaceChildren();
            fields.filter(field => field.value.trim()).forEach(field => {
                const term = document.createElement('dt');
                const value = document.createElement('dd');
                term.textContent = field.dataset.label;
                value.textContent = field.value;
                summary.append(term, value);
            });
        }
        steps[index].querySelector('h2').focus();
    }

    form.addEventListener('input', event => {
        if (typeof event.target.setCustomValidity === 'function') event.target.setCustomValidity('');
        contact.hidden = true;
        contact.removeAttribute('href');
        message.textContent = '';
    });
    form.querySelectorAll('[data-next]').forEach(button => button.addEventListener('click', () => {
        if (validate(steps[currentStep])) showStep(currentStep + 1);
    }));
    form.querySelectorAll('[data-back]').forEach(button => button.addEventListener('click', () => showStep(currentStep - 1)));
    form.addEventListener('submit', event => {
        event.preventDefault();
        if (currentStep < steps.length - 1) {
            if (validate(steps[currentStep])) showStep(currentStep + 1);
            return;
        }
        for (let i = 0; i < steps.length; i++) {
            // Reveal invalid fields before invoking browser validation.
            if ([...steps[i].querySelectorAll('input, select, textarea')].some(field => !field.checkValidity())) {
                showStep(i);
                validate(steps[i]);
                return;
            }
        }
        const text = buildRequestMessage(form.dataset.service, fields.map(field => [field.dataset.label, field.value]));
        contact.href = `https://wa.me/9647750828279?text=${encodeURIComponent(text)}`;
        contact.hidden = false;
        message.textContent = 'تم تجهيز رسالتك. افتح واتساب ثم اضغط إرسال هناك لإيصال الطلب إلى الفريق. لم يُرسل الطلب بعد.';
        contact.focus();
    });
});
