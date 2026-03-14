// =======================================================
// --- 1. نظام التوقيت والترحيب ---
// =======================================================
function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    const clockElement = document.getElementById('digital-clock');
    if (clockElement) clockElement.textContent = `${hours}:${minutes}:${seconds}`;

    const welcomeElement = document.getElementById('welcome-message');
    if (welcomeElement) {
        const hour = now.getHours();
        if (hour < 12) welcomeElement.textContent = "صباح الخير يا قائد، يوم جبار لمستعمرة GFA";
        else if (hour < 18) welcomeElement.textContent = "طاب مساؤك يا أمير، العمل مستمر في مركز القيادة";
        else welcomeElement.textContent = "مرحباً بك في وردية المساء بمركز القيادة الدولي";
    }
}

// =======================================================
// --- 2. صمامات الأمان وقرار المسار ---
// =======================================================
function lockPath(type) {
    const warningBox = document.getElementById('warning-box');
    const warningText = document.getElementById('warning-text');
    
    if (!warningBox || !warningText) return;
    warningBox.style.display = 'block';
    
    if (type === 'pro') {
        // تم مسح الكلمة الزائدة يدوياً - النص المعتمد أدناه:
        warningText.innerHTML = `
            <div style="text-align: right; direction: rtl; font-family: 'Arial', sans-serif; line-height: 1.6;">
                <h3 style="color: #d4af37; border-bottom: 2px solid #d4af37; padding-bottom: 10px; margin-bottom: 15px;">🏆 ميثاق الاحتراف {أ}</h3>
                
                <p style="font-weight: bold; color: #ff0000; background: #fff5f5; padding: 10px; border-radius: 5px;">
                    تحذير: لن تتمكن من إبطال نوع التعاقد والنزول لمستوى هاوي بمجرد الانطلاق.
                </p>

                <p style="margin-top: 15px;">
                    اختيارك مسار الاحتراف يعني حفظ مجهودكم كفريق وكفرد؛ حيث يتم تزويد منظومة <b>GFA</b> ببيانات مخصصة عبر عوامل بشرية لتحقن السجلات وتفرز التقييمات بدقة.
                </p>

                <div style="border-right: 4px solid #1a2a6c; background: #f0f4f8; padding: 15px; border-radius: 0 10px 10px 0; margin: 15px 0;">
                    <p style="margin: 0; color: #1a2a6c; font-weight: bold;">
                        هنا يسطع نجمك وتفتح سجلاتك التي بُنيت بكل مصداقية لتكشف عن هويتك الحقيقية في درجات متسلسلة.
                    </p>
                </div>

                <p style="font-weight: bold; border-top: 1px solid #eee; padding-top: 10px;">
                    إقرار إداري: هذا السجل هو الوثيقة الرسمية والنهائية المعتمدة داخل المنظومة.
                </p>

                <strong style="color: red; display: block; text-align: center; border: 2px solid red; padding: 10px; margin-top: 15px; border-radius: 8px;">
                    ⚠️ لا يمكن التراجع من هذا المسار بعد البدء.
                </strong>
            </div>
        `;
        warningBox.style.borderRight = "10px solid #d4af37";
        warningBox.style.boxShadow = "0 8px 25px rgba(212, 175, 55, 0.2)";
    } else {
        warningText.innerHTML = `<div style="text-align: right;"><strong>نظام الاستعارة {ب}:</strong> سيتم حذف البيانات فور انتهاء الدوري.</div>`;
        warningBox.style.borderRight = "5px solid #ff4d4d";
    }
    localStorage.setItem('gfa_path', type);
}

// =======================================================
// --- 3. محرك تشغيل المستعمرة ---
// =======================================================
window.onload = function() {
    setInterval(updateClock, 1000);
    updateClock();

    if (localStorage.getItem('gfa_gate_locked') === 'true') {
        const gate = document.getElementById('setup-gate');
        if (gate) gate.style.display = 'none';
    }
};