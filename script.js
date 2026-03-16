/**
 * 🛰️ GFA Pro Engine 2026 - Ultimate United Edition
 * المحرك الموحد: التقييم المفتوح + VAR + التبديلات + منصة التتويج
 */

// 1. محرك الوقت والترحيب (تحديث كل ثانية)
setInterval(() => {
    const clock = document.getElementById('digital-clock');
    if (clock) {
        clock.innerText = new Date().toLocaleTimeString('ar-SA');
    }
}, 1000);

// 2. محرك تسجيل وتوثيق المحترفين في الرادار
function register() {
    const name = document.getElementById('p-name').value.trim();
    const id = document.getElementById('p-id').value.trim();
    const kit = document.getElementById('p-kit').value.trim();
    const pos = document.getElementById('p-pos').value;
    const color1 = document.getElementById('c1').value;
    const color2 = document.getElementById('c2').value;

    // فحص المدخلات
    if (!name || !id || !kit) {
        alert("⚠️ تنبيه القائد: يرجى إكمال بيانات الهوية (الاسم، الرقم المدني، رقم القميص)!");
        return;
    }

    let db = JSON.parse(localStorage.getItem('gfa_db')) || [];

    // بناء ملف اللاعب الجديد (حالة نشطة افتراضياً)
    const newPlayer = {
        uid: id + Math.random(), // معرف فريد لتجاوز قيود التكرار
        realId: id,
        name: name,
        kit: kit,
        pos: pos,
        c1: color1,
        c2: color2,
        points: 50,
        rating: "50%",
        isOut: false, // لم يطرد
        isSub: false  // لم يستبدل
    };

    db.push(newPlayer);
    localStorage.setItem('gfa_db', JSON.stringify(db));

    render(); // تحديث شاشة الرادار فوراً
    alert(`✅ تم تدشين النجم: ${name} بنجاح!`);
    
    // مسح الحقول للاعب التالي
    document.getElementById('p-name').value = '';
    document.getElementById('p-id').value = '';
}

// 3. محرك العرض الميداني الذكي (البطاقات)
function render() {
    const list = document.getElementById('players-match-list');
    if (!list) return;

    let db = JSON.parse(localStorage.getItem('gfa_db')) || [];
    list.innerHTML = '';

    if (db.length === 0) {
        list.innerHTML = '<p style="grid-column: 1/-1; text-align: center; opacity: 0.5;">📡 في انتظار حقن أول بيانات ميدانية...</p>';
        return;
    }

    db.forEach((p, index) => {
        const isLegendary = (p.points >= 100);
        const card = document.createElement('div');
        card.className = 'player-card';
        
        // تطبيق التصميم حسب حالة اللاعب (داخل/خارج الميدان)
        if (p.isOut) {
            card.style = `background: #1a1a1a; border: 2px solid #ef4444; opacity: 0.6; padding: 20px; border-radius: 15px; text-align: center;`;
        } else if (p.isSub) {
            card.style = `background: #0f172a; border: 2px solid #3b82f6; opacity: 0.7; padding: 20px; border-radius: 15px; text-align: center;`;
        } else {
            const glow = isLegendary ? 'box-shadow: 0 0 25px #d4af37; border: 2px solid #fff;' : 'border: 2px solid rgba(255,255,255,0.4);';
            card.style = `background: linear-gradient(135deg, ${p.c1}, ${p.c2}); padding: 20px; border-radius: 15px; color: white; text-align: center; transition: 0.3s; ${glow}`;
        }

        card.innerHTML = `
            <div style="font-size: 2em; font-weight: bold;">${p.isOut ? '⛔' : (p.isSub ? '🔄' : '#' + p.kit)}</div>
            <div style="font-weight: bold; margin: 10px 0;">${p.name}</div>
            <div style="font-size: 0.8em; background: rgba(0,0,0,0.4); padding: 2px 8px; border-radius: 4px; display: inline-block;">${p.pos}</div>
            
            <div style="background: white; color: black; font-weight: bold; padding: 8px; border-radius: 8px; margin: 15px 0; font-size: 1.2em;">
                ${p.isOut ? 'مطرود 🟥' : (p.isSub ? 'مستبدل 🔄' : (isLegendary ? '🔥 ' : '') + p.rating)}
            </div>

            ${(!p.isOut && !p.isSub) ? `
                <select onchange="handleAction(${index}, this)" style="width: 100%; padding: 10px; border-radius: 8px; font-weight: bold; margin-bottom: 8px; cursor: pointer;">
                    <option value="">➕ تسجيل فعل...</option>
                    <optgroup label="🧤 الدفاع والحراسة">
                        <option value="15">صد ضربة جزاء (+15)</option>
                        <option value="7">صد تسديدة (+7)</option>
                        <option value="8">تخليص هدف (+8)</option>
                    </optgroup>
                    <optgroup label="⚽ الهجوم والوسط">
                        <option value="10">تسجيل هدف (+10)</option>
                        <option value="6">صناعة هدف (+6)</option>
                    </optgroup>
                    <optgroup label="⚠️ العقوبات">
                        <option value="-5">كرت أصفر (-5)</option>
                        <option value="RED">طرد مباشر 🟥</option>
                    </optgroup>
                </select>
                
                <button onclick="handleSub(${index})" style="width: 100%; background: #3b82f6; color: white; border: none; padding: 10px; border-radius: 8px; cursor: pointer; font-weight: bold; display: flex; align-items: center; justify-content: center; gap: 8px;">
                    🔄 تبديل هذا اللاعب
                </button>
            ` : `<div style="font-weight:bold; color:#ef4444; padding: 10px;">خارج نطاق الرادار</div>`}
        `;
        list.appendChild(card);
    });

    updateLeaderboard(); // تحديث منصة التتويج
    updateTicker(); // تحديث شريط الأنباء
}

// 4. محرك معالجة الأفعال والـ VAR
function handleAction(idx, select) {
    const val = select.value;
    if (!val) return;

    let db = JSON.parse(localStorage.getItem('gfa_db')) || [];
    let p = db[idx];

    let ptsChange = 0;
    let actionText = "";

    if (val === "RED") {
        p.isOut = true;
        ptsChange = -20;
        actionText = "طرد مباشر 🟥";
    } else {
        ptsChange = parseInt(val);
        actionText = select.options[select.selectedIndex].text;
    }

    // تحديث النقاط (نظام مفتوح)
    p.points += ptsChange;
    p.rating = Math.max(p.points, 0) + "%";

    // توثيق العملية في سجل الـ VAR
    addLog(p.name, actionText, ptsChange);

    localStorage.setItem('gfa_db', JSON.stringify(db));
    render();
}

// 5. محرك التبديلات التكتيكية
function handleSub(idx) {
    let db = JSON.parse(localStorage.getItem('gfa_db')) || [];
    if (confirm(`هل تؤكد خروج اللاعب ${db[idx].name} للتبديل؟`)) {
        db[idx].isSub = true;
        addLog(db[idx].name, "تبديل تكتيكي (خروج) 🔄", 0);
        localStorage.setItem('gfa_db', JSON.stringify(db));
        render();
    }
}

// 6. محرك سجل الـ VAR المباشر
function addLog(name, act, pts) {
    const logContainer = document.getElementById('var-logs');
    if (!logContainer) return;

    const time = new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' });
    const color = pts >= 0 ? '#22c55e' : '#ef4444';
    
    const div = document.createElement('div');
    div.style = "border-bottom: 1px solid rgba(255,255,255,0.1); padding: 8px 0; display: flex; justify-content: space-between;";
    div.innerHTML = `
        <span>[${time}] <b>${name}</b>: ${act}</span>
        <span style="color: ${color}; font-weight: bold;">${pts > 0 ? '+' : ''}${pts}%</span>
    `;
    logContainer.prepend(div); // وضع الأحدث في الأعلى
}

// 7. محرك منصة التتويج (Leaderboard)
function updateLeaderboard() {
    let db = JSON.parse(localStorage.getItem('gfa_db')) || [];
    const board = document.getElementById('top-players');
    if (!board) return;

    // التعديل: نستبعد المطرودين فقط، ونبقي المستبدلين في المنافسة
    let eligiblePlayers = db.filter(p => !p.isOut); 
    
    // ترتيب الجميع حسب النقاط (الأعلى يبقى في الصدارة حتى لو خرج)
    let sorted = eligiblePlayers.sort((a, b) => b.points - a.points).slice(0, 3);

    if (sorted.length > 0) {
        board.innerHTML = sorted.map((p, i) => `
            <div class="top-card" style="${p.isSub ? 'border-bottom: 3px solid #3b82f6; opacity: 0.9;' : ''}">
                <div style="font-size: 1.5em;">${i === 0 ? '🏆' : (i === 1 ? '🥈' : '🥉')}</div>
                <div style="font-weight: bold; font-size: 0.85em;">${p.name} ${p.isSub ? '(🔄)' : ''}</div>
                <div style="color: #d4af37; font-weight: bold;">${p.rating}</div>
            </div>
        `).join('');
    }
}
// تشغيل النظام عند تحميل الصفحة
window.onload = render;