/* =========================================
   نظام التعليقات والتصويت المرتبط بـ Google Sheets
   ========================================= */
const REVIEWS_API = "https://script.google.com/macros/s/AKfycbz8tn9H1gFcPLwCkcCJQvI-wjRUw_tfYq-yyDwOA41t3J8Yl26041_p0nBi8pio3Bi8lQ/exec";

document.addEventListener("DOMContentLoaded", () => {
    loadReviews();
    setupSlider();
    setupModal();
});

// 1. جلب التعليقات وفرزها
async function loadReviews() {
    const wrapper = document.getElementById("reviewsWrapper");
    try {
        const response = await fetch(REVIEWS_API);
        let reviews = await response.json();

        // خوارزمية الفرز: الأعلى تقييماً (Likes - Dislikes) يظهر أولاً
        reviews.sort((a, b) => {
            let scoreA = a.likes - a.dislikes;
            let scoreB = b.likes - b.dislikes;
            return scoreB - scoreA; // ترتيب تنازلي
        });

        wrapper.innerHTML = ""; // مسح رسالة التحميل

        if (reviews.length === 0) {
            wrapper.innerHTML = "<p style='text-align:center; color:#888; width:100%;'>لا توجد تقييمات حالياً. كن أول من يقيّمنا!</p>";
            return;
        }

        reviews.forEach(rev => {
            // توليد النجوم
            let starsHtml = "";
            for (let i = 0; i < 5; i++) {
                if (i < rev.stars) starsHtml += "<i class='bx bxs-star'></i>";
                else starsHtml += "<i class='bx bx-star'></i>";
            }

            // أخذ أول حرفين من الاسم للأيقونة
            let shortName = rev.name.substring(0, 2).toUpperCase();

            // إنشاء بطاقة التعليق
            const card = document.createElement("div");
            card.className = "review-card";
            card.innerHTML = `
                <i class='bx bxs-quote-right' style="font-size: 35px; color: rgba(212, 175, 55, 0.15); margin-bottom: 10px;"></i>
                <div class="stars" style="color: #d4af37; margin-bottom: 10px; font-size: 18px;">${starsHtml}</div>
                <p style="color: #ccc; line-height: 1.6; margin-bottom: 20px; font-size: 14px; flex-grow: 1;">"${rev.text}"</p>
                
                <div class="client-info" style="display: flex; align-items: center; gap: 15px; margin-bottom: 15px;">
                    <div style="width: 45px; height: 45px; border-radius: 50%; background: #111; display: flex; justify-content: center; align-items: center; font-weight: bold; color: #d4af37; border: 1px solid #d4af37;">${shortName}</div>
                    <div>
                        <h4 style="color: #fff; font-size: 15px; margin-bottom: 3px;">${rev.name}</h4>
                        <span style="color: #888; font-size: 11px;">${rev.role}</span>
                    </div>
                </div>

                <div class="voting-section">
                    <button class="vote-btn like" onclick="handleVote('${rev.id}', 'like', this)">
                        <i class='bx bx-upvote'></i> <span class="count">${rev.likes}</span>
                    </button>
                    <button class="vote-btn dislike" onclick="handleVote('${rev.id}', 'dislike', this)">
                        <i class='bx bx-downvote'></i> <span class="count">${rev.dislikes}</span>
                    </button>
                </div>
            `;
            wrapper.appendChild(card);
        });

    } catch (error) {
        wrapper.innerHTML = "<p style='text-align:center; color:#ff0000; width:100%;'>حدث خطأ في تحميل التقييمات. يرجى المحاولة لاحقاً.</p>";
    }
}

// 2. نظام التصويت الذكي (Optimistic UI)
function handleVote(id, type, btnElement) {
    // التأكد أن المستخدم لم يصوت مسبقاً (تخزين في المتصفح)
    if (localStorage.getItem(`voted_${id}`)) {
        showNotification("لقد قمت بالتصويت على هذا التعليق مسبقاً!");
        return;
    }

    // أ- التحديث الفوري للواجهة لكي لا يشعر المستخدم بالبطء
    const countSpan = btnElement.querySelector('.count');
    countSpan.innerText = parseInt(countSpan.innerText) + 1;
    btnElement.style.color = type === 'like' ? '#00fa65' : '#ff0000';
    localStorage.setItem(`voted_${id}`, true); // تسجيل التصويت

    // ب- إرسال البيانات للخلفية (صامتاً)
    fetch(REVIEWS_API, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "vote", id: id, voteType: type })
    }).catch(err => console.error("Vote Error: ", err));
}

// 3. إضافة تقييم جديد
document.getElementById("addReviewForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const submitBtn = document.getElementById("submitRevBtn");
    submitBtn.innerText = "جاري الإرسال...";
    submitBtn.disabled = true;

    const data = {
        action: "add_review",
        name: document.getElementById("revName").value,
        role: document.getElementById("revRole").value,
        stars: document.getElementById("revStars").value,
        text: document.getElementById("revText").value
    };

    fetch(REVIEWS_API, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    }).then(() => {
        showNotification("تم إرسال تقييمك بنجاح! سيتم عرضه بعد مراجعته.");
        document.getElementById("reviewModal").classList.remove("show");
        this.reset();
        submitBtn.innerText = "إرسال التقييم للمراجعة";
        submitBtn.disabled = false;
    }).catch(err => {
        showNotification("حدث خطأ، يرجى المحاولة لاحقاً.");
        submitBtn.innerText = "إرسال التقييم للمراجعة";
        submitBtn.disabled = false;
    });
});

// 4. تشغيل أزرار السلايدر والنافذة المنبثقة
function setupSlider() {
    const wrapper = document.getElementById("reviewsWrapper");
    document.getElementById("slideRight").onclick = () => { wrapper.scrollBy({ left: 340, behavior: 'smooth' }); };
    document.getElementById("slideLeft").onclick = () => { wrapper.scrollBy({ left: -340, behavior: 'smooth' }); };
}

function setupModal() {
    const modal = document.getElementById("reviewModal");
    document.getElementById("openReviewModal").onclick = () => modal.classList.add("show");
    document.getElementById("closeReviewModal").onclick = () => modal.classList.remove("show");
    window.onclick = (e) => { if (e.target == modal) modal.classList.remove("show"); };
}