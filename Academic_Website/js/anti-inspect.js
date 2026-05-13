// 🔒 منع القائمة بالزر الأيمن
document.addEventListener("contextmenu", function (e) {
    e.preventDefault();
});

// 🔒 منع F12 و Ctrl+U و Ctrl+Shift+I/J/C/S و Cmd+Opt+I (على الماك)
document.addEventListener("keydown", function (e) {
    if (
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && ["i", "j", "c", "s"].includes(e.key.toLowerCase())) ||
        (e.ctrlKey && e.key.toLowerCase() === "u") ||
        (e.metaKey && e.altKey && e.key.toLowerCase() === "i") || // Cmd + Opt + I
        (e.metaKey && e.key.toLowerCase() === "u") // Cmd + U
    ) {
        e.preventDefault();
        return false;
    }
});

// 🔒 تعطيل بعض دوال الكونسول
console.log = () => { };
console.debug = () => { };
console.warn = () => { };
console.info = () => { };

// 🔒 كشف DevTools عن طريق "debugger"
setInterval(() => {
    const before = new Date().getTime();
    debugger;
    const after = new Date().getTime();
    if (after - before > 100) {
        document.body.innerHTML =
            '<h1 style="text-align:center;margin-top:100px;color:red">🔒 Developer Tools detected!</h1>';
    }
}, 1000);

// 🔒 كشف فتح الـ console عبر toString tampering
(function () {
    const element = new Image();
    Object.defineProperty(element, 'id', {
        get: function () {
            document.body.innerHTML =
                '<h1 style="text-align:center;margin-top:100px;color:red">⚠️ Console blocked!</h1>';
            throw new Error("Console is blocked");
        }
    });

    setInterval(() => {
        console.log(element);
        console.clear();
    }, 2000);
})();

// 🔒 منع سحب العناصر
document.addEventListener('dragstart', function (e) {
    e.preventDefault();
});

// 🔒 منع تحديد الكل (Ctrl+A)
document.addEventListener('keydown', function (e) {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'a') {
        e.preventDefault();
    }
});
