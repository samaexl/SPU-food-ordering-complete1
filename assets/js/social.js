/* ==========================================================
   social.js — สมัคร/เข้าสู่ระบบด้วย Facebook, X, LINE (โหมดสาธิต)
   ยังไม่ได้เชื่อมต่อกับผู้ให้บริการจริง: ผู้ใช้กรอกชื่อและรหัสนักศึกษาเอง
   ใช้ได้ทั้งหน้า index.html และ register.html (ต้องโหลดหลัง main.js)
========================================================== */

const SOCIAL = {
    facebook: { label: 'Facebook' },
    x:        { label: 'X' },
    line:     { label: 'LINE' }
};

const SOCIAL_ICON = {
    facebook: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.6-1.5h1.6V4.4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.2H8v3h2.5V21h3z"/></svg>',
    x:        '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M17.8 3h3.1l-6.8 7.8L22 21h-6.2l-4.9-6.4L5.3 21H2.2l7.3-8.3L2 3h6.4l4.4 5.8L17.8 3zm-1.1 16.2h1.7L7.4 4.7H5.6l11.1 14.5z"/></svg>',
    line:     '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 3C6.5 3 2 6.6 2 11c0 3.9 3.5 7.2 8.3 7.9.3.1.8.2.9.5.1.3.1.7 0 1l-.1.9c0 .3-.2 1 .9.5s6-3.5 8.1-6C21.4 14.3 22 12.7 22 11c0-4.4-4.5-8-10-8zM8.3 13.4H6.4c-.3 0-.5-.2-.5-.5V9.1c0-.3.2-.5.5-.5s.5.2.5.5v3.3h1.4c.3 0 .5.2.5.5s-.2.5-.5.5zm2-.5c0 .3-.2.5-.5.5s-.5-.2-.5-.5V9.1c0-.3.2-.5.5-.5s.5.2.5.5v3.8zm4.6 0c0 .2-.1.4-.3.5h-.2c-.2 0-.3-.1-.4-.2l-2-2.7v2.4c0 .3-.2.5-.5.5s-.5-.2-.5-.5V9.1c0-.2.1-.4.3-.5h.2c.2 0 .3.1.4.2l2 2.7V9.1c0-.3.2-.5.5-.5s.5.2.5.5v3.8zm3.1-2.4c.3 0 .5.2.5.5s-.2.5-.5.5h-1.4v.9H18c.3 0 .5.2.5.5s-.2.5-.5.5h-1.9c-.3 0-.5-.2-.5-.5V9.1c0-.3.2-.5.5-.5H18c.3 0 .5.2.5.5s-.2.5-.5.5h-1.4v.9H18z"/></svg>'
};

// ชื่อผู้ให้บริการที่บัญชีนี้เชื่อมไว้ เช่น "Facebook, LINE"
function socialNames(account) {
    return Object.keys(account.social || {}).map(function (p) { return SOCIAL[p] ? SOCIAL[p].label : p; }).join(', ');
}

function socialSignIn(name, student, isNew) {
    let current = null;
    try { current = JSON.parse(localStorage.getItem('food_user')); } catch (e) { current = null; }
    if (!current || current.student !== student) localStorage.removeItem('food_cart');
    localStorage.setItem('food_user', JSON.stringify({ name: name, student: student }));
    location.href = isNew ? 'floors.html?welcome=1' : 'floors.html';
}

function openSocial(provider) {
    let info = SOCIAL[provider];
    if (!info) return;
    let box = document.getElementById('social-dialog');
    if (!box) {
        document.body.insertAdjacentHTML('beforeend',
            '<div id="social-dialog" class="dialog" hidden><form class="dialog-box social-box" role="dialog" aria-modal="true" aria-labelledby="social-title" novalidate>' +
            '<div class="social-head"><span id="social-icon" class="social-icon"></span><h3 id="social-title"></h3></div>' +
            '<p class="demo-note">โหมดสาธิต: ยังไม่ได้เชื่อมต่อกับ <span id="social-name1"></span> จริง กรอกข้อมูลด้านล่างแทนการเข้าสู่ระบบของผู้ให้บริการ</p>' +
            '<div class="field"><label for="social-display">ชื่อในบัญชี <span id="social-name2"></span></label>' +
            '<input id="social-display" type="text" maxlength="60" autocomplete="name" placeholder="เช่น สมชาย ใจดี"><small class="field-error"></small></div>' +
            '<div class="field"><label for="social-student">รหัสนักศึกษาที่จะผูกกับบัญชีนี้</label>' +
            '<input id="social-student" type="text" inputmode="numeric" maxlength="8" placeholder="8 หลัก"><small class="field-error"></small></div>' +
            '<div class="field" id="social-pass-field" hidden><label for="social-pass">รหัสผ่านของบัญชีเดิม</label>' +
            '<input id="social-pass" type="password" autocomplete="current-password" placeholder="ยืนยันว่าเป็นเจ้าของบัญชี"><small class="field-error"></small></div>' +
            '<div class="dialog-actions"><button type="button" class="btn-plain" id="social-cancel">ยกเลิก</button>' +
            '<button type="submit" class="btn-submit" id="social-go">ดำเนินการต่อ</button></div></form></div>');
        box = document.getElementById('social-dialog');
        let form = box.querySelector('form');
        document.getElementById('social-cancel').onclick = closeSocial;
        box.addEventListener('click', function (e) { if (e.target === box) closeSocial(); });
        document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeSocial(); });
        document.getElementById('social-student').addEventListener('input', function () {
            this.value = this.value.replace(/[^0-9]/g, '');
            document.getElementById('social-pass-field').hidden = true;   // เปลี่ยนรหัส -> ตรวจใหม่
        });
        form.querySelectorAll('input').forEach(function (input) {
            input.addEventListener('input', function () { socialError(input.id, ''); });
        });
        form.addEventListener('submit', function (e) { e.preventDefault(); submitSocial(); });
    }
    box.dataset.provider = provider;
    box.querySelector('form').className = 'dialog-box social-box form-stack social-' + provider;
    document.getElementById('social-icon').innerHTML = SOCIAL_ICON[provider];
    document.getElementById('social-title').textContent = 'ดำเนินการต่อด้วย ' + info.label;
    document.getElementById('social-name1').textContent = info.label;
    document.getElementById('social-name2').textContent = info.label;
    box.querySelector('form').reset();
    ['social-display', 'social-student', 'social-pass'].forEach(function (id) { socialError(id, ''); });
    document.getElementById('social-pass-field').hidden = true;
    // เติมรหัสนักศึกษาจากฟอร์มหลักถ้ากรอกไว้แล้ว
    let typed = document.getElementById('student') || document.getElementById('reg-student');
    if (typed && /^[0-9]{8}$/.test(typed.value)) document.getElementById('social-student').value = typed.value;
    box.hidden = false;
    document.getElementById('social-display').focus();
}

function closeSocial() {
    let box = document.getElementById('social-dialog');
    if (box) box.hidden = true;
}

function socialError(id, text) {
    let field = document.getElementById(id).closest('.field');
    field.classList.toggle('invalid', !!text);
    field.querySelector('.field-error').innerHTML = text || '';
    return !text;
}

function submitSocial() {
    let provider = document.getElementById('social-dialog').dataset.provider;
    let label = SOCIAL[provider].label;
    let name = document.getElementById('social-display').value.trim().replace(/\s+/g, ' ');
    let student = document.getElementById('social-student').value.trim();
    let passField = document.getElementById('social-pass-field');
    let students = loadStudents();
    let account = students[student];

    let ok = socialError('social-student', /^[0-9]{8}$/.test(student) ? '' : 'รหัสนักศึกษาต้องเป็นตัวเลข 8 หลัก');
    // บัญชีใหม่ต้องมีชื่อ ส่วนบัญชีที่มีอยู่แล้วใช้ชื่อเดิม
    if (!account) ok = socialError('social-display', name.length < 2 ? 'กรุณากรอกชื่อ' : '') && ok;
    if (!ok) return;

    // 1) ยังไม่มีบัญชี -> สมัครใหม่ด้วยโซเชียล
    if (!account) {
        let social = {};
        social[provider] = { name: name, at: Date.now() };
        students[student] = { name: name, phone: '', pass: '', social: social, createdAt: Date.now() };
        saveStudents(students);
        socialSignIn(name, student, true);
        return;
    }
    // 2) เคยเชื่อมผู้ให้บริการนี้ไว้แล้ว -> เข้าสู่ระบบ
    if (account.social && account.social[provider]) {
        socialSignIn(account.name, student, false);
        return;
    }
    // 3) มีบัญชีแต่ยังไม่ได้เชื่อม -> ต้องยืนยันด้วยรหัสผ่านก่อน
    if (!account.pass) {
        socialError('social-student', 'รหัสนี้สมัครไว้ด้วย ' + esc(socialNames(account)) + ' กรุณาใช้ปุ่มนั้นเข้าสู่ระบบ');
        return;
    }
    if (passField.hidden) {
        passField.hidden = false;
        socialError('social-pass', '');
        passField.querySelector('label').textContent = 'รหัสนี้มีบัญชีอยู่แล้ว ใส่รหัสผ่านเพื่อเชื่อม ' + label;
        document.getElementById('social-pass').focus();
        return;
    }
    let pass = document.getElementById('social-pass').value;
    if (account.pass !== passwordHash(student, pass)) {
        socialError('social-pass', 'รหัสผ่านไม่ถูกต้อง');
        return;
    }
    account.social = account.social || {};
    account.social[provider] = { name: name || account.name, at: Date.now() };
    saveStudents(students);
    socialSignIn(account.name, student, false);
}

document.querySelectorAll('[data-social]').forEach(function (btn) {
    btn.addEventListener('click', function () { openSocial(btn.dataset.social); });
});
