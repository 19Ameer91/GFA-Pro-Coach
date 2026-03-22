// 1. رابط الرادار الخاص بك (تأكد من وجود .json في النهاية)
const firebaseURL = "https://procoach-40d9f-default-rtdb.firebaseio.com/registrations.json";

// 2. المحرك الرئيسي للتنشيط
async function requestActivation() {
    console.log("محاولة التنشيط بدأت..."); // سطر للفحص

    // جلب العناصر من الواجهة
    const nameEl = document.getElementById('full-name');
    const phoneEl = document.getElementById('user-phone');
    const roleEl = document.getElementById('user-position');

    // التأكد من وجود العناصر في الصفحة
    if (!nameEl || !phoneEl || !roleEl) {
        console.error("عناصر الإدخال غير موجودة في الـ HTML!");
        return;
    }

    const fullName = nameEl.value;
    const phone = phoneEl.value;
    const role = roleEl.value;

    // فحص الحقول الفارغة
    if (!fullName || !phone || !role) {
        alert("⚠️ يا قائد، املأ البيانات لاختيار (المشرف أو اللاعب)!");
        return;
    }

    const userData = {
        name: fullName,
        mobile: phone,
        position: role,
        timestamp: new Date().toLocaleString()
    };

    try {
        const response = await fetch(firebaseURL, {
            method: 'POST',
            body: JSON.stringify(userData)
        });

        if (response.ok) {
            alert("✅ تم إرسال البيانات للسحابة بنجاح! راقب شاشة Firebase الآن.");
            document.getElementById('gate-screen').style.display = 'none';
        } else {
            alert("❌ فشل السيرفر، تأكد من إعدادات Rules في Firebase");
        }
    } catch (error) {
        console.error("خطأ في الاتصال:", error);
        alert("⚠️ عطل في الاتصال، تأكد من الإنترنت!");
    }
}
// --- 2. كود رسم الملعب (أبقهِ كما هو تحت كود التسجيل) ---
function drawPitch() {
    // هنا كود الرسم القديم الخاص بك (canvas, context... إلخ)
    // لا تحذفه لكي يظل الملعب يظهر في الخلفية
}

window.onresize = drawPitch;
setTimeout(drawPitch, 200);
function register() {
    const name = document.getElementById('p-name').value;
    const kit = document.getElementById('p-kit').value;
    const pos = document.getElementById('p-pos').value;
    
    if(!name || !kit) return alert("يا قائد، أكمل بيانات المحترف أولاً!");

    let db = JSON.parse(localStorage.getItem('gfa_db')) || [];
    db.push({ 
        name, 
        kit, 
        pos, 
        points: 50, 
        rating: "50%",
        id: Date.now() 
    });
    localStorage.setItem('gfa_db', JSON.stringify(db));
    
    render();
    // مسح الخانات
    document.getElementById('p-name').value = '';
    document.getElementById('p-kit').value = '';
}

function render() {
    const list = document.getElementById('players-match-list');
    const pitch = document.getElementById('live-pitch');
    let db = JSON.parse(localStorage.getItem('gfa_db')) || [];
    
    list.innerHTML = '';
    // تنظيف الملعب من النقاط القديمة فقط
    pitch.querySelectorAll('.player-dot').forEach(el => el.remove());

    db.forEach((p, index) => {
        // 1. إضافة البطاقة في الرادار السفلي
        const card = document.createElement('div');
        card.style = `background: linear-gradient(135deg, #1a2a6c, #b21f1f); padding: 20px; border-radius: 15px; border: 2px solid var(--gold); text-align: center; color: white;`;
        card.innerHTML = `
            <div style="font-size: 1.2em; font-weight: bold;">#${p.kit} ${p.name}</div>
            <div style="background: white; color: black; margin: 10px 0; border-radius: 5px; font-weight: bold; padding: 5px;">${p.rating}</div>
            <button onclick="deletePlayer(${index})" style="background: #ef4444; color: white; border: none; padding: 5px 10px; border-radius: 5px; font-size: 0.8em;">حذف 🗑️</button>
        `;
        list.appendChild(card);

        // 2. توزيع النقاط في الملعب حسب المراكز تكتيكياً
        const dot = document.createElement('div');
        dot.className = 'player-dot';
        dot.innerText = p.kit;
        dot.title = p.name;
        
        let top, left;
        // خوارزمية توزيع المراكز
        switch(p.pos) {
            case "GK": left = "5%"; top = "45%"; break;
            case "DEF": left = "25%"; top = (15 + (index * 15) % 70) + "%"; break;
            case "MID": left = "50%"; top = (20 + (index * 12) % 65) + "%"; break;
            case "FWD": left = "85%"; top = (30 + (index * 20) % 40) + "%"; break;
        }

        dot.style.left = left;
        dot.style.top = top;
        pitch.appendChild(dot);
    });
}

function deletePlayer(idx) {
    let db = JSON.parse(localStorage.getItem('gfa_db')) || [];
    db.splice(idx, 1);
    localStorage.setItem('gfa_db', JSON.stringify(db));
    render();
}
// 📡 وظيفة جلب البيانات وعرضها للمشرف
async function loadRegistrations() {
    const tableBody = document.getElementById('admin-table-body');
    if (!tableBody) return; // إذا لم تكن في لوحة التحكم، لا تفعل شيئاً

    try {
        const response = await fetch(firebaseURL);
        const data = await response.json();

        tableBody.innerHTML = ''; // تنظيف الجدول قبل العرض

        for (let id in data) {
            const player = data[id];
            tableBody.innerHTML += `
                <tr>
                    <td>${player.fullName}</td>
                    <td>${player.role}</td>
                    <td>${player.mobile}</td>
                    <td>
                        <button class="btn-accept" onclick="confirmPlayer('${id}')">قبول ✅</button>
                        <button class="btn-delete" onclick="rejectPlayer('${id}")">حذف 🗑️</button>
                    </td>
                </tr>
            `;
        }
    } catch (error) {
        console.error("خطأ في جلب البيانات:", error);
    }
}

// 🗑️ وظيفة حذف سجل (تمير مثلاً!)
async function rejectPlayer(id) {
    if (confirm("هل تريد حذف هذا السجل نهائياً؟")) {
        const deleteURL = `https://procoach-40d9f-default-rtdb.firebaseio.com/registrations/${id}.json`;
        await fetch(deleteURL, { method: 'DELETE' });
        loadRegistrations(); // إعادة تحديث الجدول
    }
}

window.onload = render;
