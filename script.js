// --- 1. إعدادات سبورة الرسم اليدوي للمدرب ---
const canvas = document.getElementById('tactical-board');
const ctx = canvas.getContext('2d');
let drawing = false;

// ضبط مقاسات السبورة لتناسب الملعب في صلالة
function resizeCanvas() {
    const container = document.querySelector('.radar-container');
    if (container && canvas) {
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
    }
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// تفعيل ريشة المدرب (الرسم الذهبي)
canvas.addEventListener('mousedown', (e) => { drawing = true; draw(e); });
canvas.addEventListener('mouseup', () => { drawing = false; ctx.beginPath(); });
canvas.addEventListener('mousemove', draw);

function draw(e) {
    if (!drawing) return;
    const rect = canvas.getBoundingClientRect();
    
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#FFD700'; // لون الذهب الملكي
    ctx.shadowBlur = 8;
    ctx.shadowColor = '#FFD700';

    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
}

// دالة تنظيف السبورة
function clearBoard() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// --- 2. محرك توزيع اللاعبين وتحرير حركتهم باليد ---
async function startSystem() {
    try {
        const response = await fetch('system_config.json');
        const data = await response.json();
        updateTacticalView(data.targets);
    } catch (error) {
        console.log("تنبيه تكتيكي: " + error);
    }
}

function updateTacticalView(players) {
    const container = document.querySelector('.radar-container');
    
    // تنظيف الملعب من النسخ القديمة
    const oldDots = container.querySelectorAll('.target-dot');
    oldDots.forEach(dot => dot.remove());

    players.forEach(player => {
        const dot = document.createElement('div');
        dot.className = 'target-dot';
        dot.style.left = `${player.x}%`;
        dot.style.top = `${player.y}%`;
        
        // جعل كل لاعب "حر" وقابل للسحب باليد فوراً
        makeDraggable(dot); 
        
        const label = document.createElement('span');
        label.className = 'target-label';
        label.innerText = player.name;
        
        dot.appendChild(label);
        container.appendChild(dot);
    });
}

// --- 3. محرك السحب والإفلات الاحترافي (Drag & Drop) ---
function makeDraggable(element) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    
    element.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
        // منع التداخل مع الرسم اليدوي
        e.stopPropagation(); 
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        
        // تحريك اللاعب بناءً على حركة الماوس
        element.style.top = (element.offsetTop - pos2) + "px";
        element.style.left = (element.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

// --- 4. تأثير العمق البصري الهادئ (3D) ---
document.addEventListener('mousemove', (e) => {
    const container = document.querySelector('.radar-container');
    if (container) {
        // استخدام الرقم 100 كما فضلت لثبات مريح للعين
        let x = (window.innerWidth / 2 - e.pageX) / 100;
        let y = (window.innerHeight / 2 - e.pageY) / 100;
        container.style.transform = `rotateY(${x}deg) rotateX(${y}deg)`;
    }
});

// إطلاق النظام
startSystem();
// تفعيل الرسم باللمس للهواتف
canvas.addEventListener('touchstart', (e) => { 
    drawing = true; 
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent("mousedown", {
        clientX: touch.clientX,
        clientY: touch.clientY
    });
    canvas.dispatchEvent(mouseEvent);
}, {passive: false});

canvas.addEventListener('touchend', () => { drawing = false; ctx.beginPath(); });

canvas.addEventListener('touchmove', (e) => {
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent("mousemove", {
        clientX: touch.clientX,
        clientY: touch.clientY
    });
    canvas.dispatchEvent(mouseEvent);
}, {passive: false});
// دالة لتحويل أحداث اللمس إلى أحداث ماوس لضمان عمل السحب والرسم
function touchHandler(event) {
    var touches = event.changedTouches,
        first = touches[0],
        type = "";

    switch(event.type) {
        case "touchstart": type = "mousedown"; break;
        case "touchmove":  type = "mousemove"; break;        
        case "touchend":   type = "mouseup";   break;
        default:           return;
    }

    var simulatedEvent = new MouseEvent(type, {
        bubbles: true, cancelable: true, view: window, detail: 1,
        screenX: first.screenX, screenY: first.screenY,
        clientX: first.clientX, clientY: first.clientY
    });

    first.target.dispatchEvent(simulatedEvent);
    event.preventDefault();
}

// تفعيل المترجم على سبورة الرسم وأيقونات اللاعبين
function initMobile() {
    canvas.addEventListener("touchstart", touchHandler, true);
    canvas.addEventListener("touchmove", touchHandler, true);
    canvas.addEventListener("touchend", touchHandler, true);
    
    // تفعيل اللمس لكل لاعب موجود حالياً
    document.querySelectorAll('.target-dot').forEach(dot => {
        dot.addEventListener("touchstart", touchHandler, true);
        dot.addEventListener("touchmove", touchHandler, true);
        dot.addEventListener("touchend", touchHandler, true);
    });
}

// تشغيل تهيئة الهاتف
initMobile();
// كود اكتشاف الرغبة في التثبيت على الهاتف
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    // هنا يمكنك إظهار رسالة للمدرب: "هل تريد إضافة المدرب المحترف لشاشتك؟"
    console.log("التطبيق جاهز للتثبيت على هاتف القائد أمير");
});