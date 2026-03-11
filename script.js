// 1. تحديث وقت صلالة والترحيب
function updateSalalahTime() {
    const now = new Date();
    
    // الساعة
    const timeString = now.toLocaleTimeString('ar-OM', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
    document.getElementById('digital-clock').innerText = timeString;

    // التاريخ
    const dateString = now.toLocaleDateString('ar-OM', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    document.getElementById('current-date').innerText = dateString;

    // الترحيب
    const hour = now.getHours();
    let msg = "";
    if (hour < 12) msg = "صباح الخير يا أمير 🌅";
    else if (hour < 18) msg = "طاب مساؤك يا أمير ☀️";
    else msg = "مساء الخير يا أمير 🌙";
    document.getElementById('welcome-message').innerText = msg + " | مركز القيادة الدولي";
}

// 2. عرض البيانات وتحديث الأرقام
function renderTable() {
    let coaches = JSON.parse(localStorage.getItem('coaches')) || [];
    
    // تحديث رقم الإحصائيات
    document.getElementById('totalCoaches').innerText = coaches.length;

    // رسم الجدول
    let tableBody = document.getElementById('coachesTable');
    tableBody.innerHTML = ""; 

    coaches.forEach((coach, index) => {
        tableBody.innerHTML += `
            <tr>
                <td><strong>${coach.name}</strong></td>
                <td>${coach.specialty}</td>
                <td><span style="color: #28a745;"><i class="fas fa-check-circle"></i> نشط</span></td>
                <td>
                    <button class="delete-btn" onclick="deleteCoach(${index})">
                        <i class="fas fa-trash-alt"></i> حذف
                    </button>
                </td>
            </tr>
        `;
    });
}

// 3. إضافة مدرب جديد
function addCoach() {
    let nameInput = document.getElementById('coachName');
    let specInput = document.getElementById('coachSpecialty');

    if (nameInput.value.trim() === "" || specInput.value.trim() === "") {
        alert("يرجى ملء البيانات كاملة يا أمير!");
        return;
    }

    let coaches = JSON.parse(localStorage.getItem('coaches')) || [];
    coaches.push({ name: nameInput.value, specialty: specInput.value });
    localStorage.setItem('coaches', JSON.stringify(coaches));

    nameInput.value = "";
    specInput.value = "";
    renderTable();
}

// 4. حذف مدرب
function deleteCoach(index) {
    if (confirm("هل تريد حذف هذا المدرب نهائياً؟")) {
        let coaches = JSON.parse(localStorage.getItem('coaches')) || [];
        coaches.splice(index, 1);
        localStorage.setItem('coaches', JSON.stringify(coaches));
        renderTable();
    }
}

// تشغيل النظام فوراً
setInterval(updateSalalahTime, 1000);
updateSalalahTime();
renderTable();
// وظيفة محاكاة استقبال بيانات من تطبيق الميدان
function syncWithProCoach() {
    console.log("جاري البحث عن بيانات جديدة من الميدان...");
    // هذه الوظيفة سنطورها لاحقاً لتربط فعلياً بين التطبيق والمركز
    // حالياً سنضع تنبيهاً بسيطاً لتعرف أن النظام جاهز للربط
    alert("مركز القيادة الآن في وضع 'الاستعداد' لاستقبال بيانات تطبيق Pro Coach الميداني ✅");
}