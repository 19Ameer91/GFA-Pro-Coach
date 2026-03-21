// 📡 1. الرادار السحابي (الرابط العالمي)
const firebaseURL = "https://procoach-40d9f-default-rtdb.firebaseio.com/registrations.json";

// 🚀 2. محرك التنشيط والفرز (حكم، لاعب، مدرب، مشرف)
async function requestActivation() {
    const fullName = document.getElementById('full-name').value;
    const phone = document.getElementById('user-phone').value;
    const position = document.getElementById('user-position').value;

    if (!fullName || !phone || !position) {
        alert("⚠️ يا قائد، الحكام واللاعبين بانتظار إتمام البيانات!");
        return;
    }

    const userData = {
        name: fullName,
        mobile: phone,
        role: position, // هنا سيتم تخزين (حكم، لاعب، مدرب)
        timestamp: new Date().toLocaleString()
    };

    try {
        const response = await fetch(firebaseURL, {
            method: 'POST',
            body: JSON.stringify(userData)
        });

        if (response.ok) {
            let message = "✅ تم تسجيلك بنجاح!";
            if(position === 'REF') message = "⚖️ أهلاً بك يا قاضي الملاعب، تم استلام بياناتك!";
            if(position === 'ADMIN') message = "🛡️ تم اعتماد دخول لجنة التحكيم بنجاح!";
            
            alert(message);
            document.getElementById('gate-screen').style.display = 'none';
        }
    } catch (e) {
        alert("❌ تعطلت عربة الحكام في السيرفر! تأكد من قواعد Firebase");
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

window.onload = render;
