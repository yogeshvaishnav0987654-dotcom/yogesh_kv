/* ============================================
   ANSHIKA HELPING HANDS FOUNDATION - MAIN SCRIPT
============================================ */

/* ============================================
   CONFIGURATION
============================================ */
const UPI_ID = 'YOUR_UPI_ID@upi';
const NGO_NAME = 'Anshika Helping Hands Foundation';
const NGO_PHONE = '09920446089';
const OWNER_EMAIL = 'miraculousfav0@gmail.com';

/* ============================================
   PAGE NAVIGATION
============================================ */
function showPage(pageName, scrollTo){
  // 1. Hide all pages
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  
  // 2. Show target page
  const target = document.getElementById('page-' + pageName);
  if(target) target.classList.add('active');

  // 3. Update active state on nav
  document.querySelectorAll('.ngo-nav-link').forEach(a => a.classList.remove('active'));
  const activeLink = document.querySelector('.ngo-nav-link[onclick*="' + pageName + '"]');
  if(activeLink) activeLink.classList.add('active');

  // 4. Close mobile nav
  const navLinks = document.getElementById('ngoNavLinks');
  if(navLinks) navLinks.classList.remove('open');

  // 5. Scroll
  if(scrollTo){
    setTimeout(() => {
      const el = document.getElementById(scrollTo);
      if(el) el.scrollIntoView({behavior:'smooth', block:'start'});
    }, 150);
  } else {
    window.scrollTo({top:0, behavior:'smooth'});
  }

  // 6. Trigger reveal animations
  setTimeout(() => {
    const page = document.getElementById('page-' + pageName);
    if(!page) return;
    page.querySelectorAll('.reveal, .stat-box, .fun-bubble, .eco-bubble').forEach(el => {
      const rect = el.getBoundingClientRect();
      if(rect.top < window.innerHeight + 100){
        el.classList.add('visible');
        const numEl = el.querySelector('.num');
        if(numEl && numEl.dataset.count && !numEl.dataset.done){
          animateCount(numEl);
          numEl.dataset.done = '1';
        }
      }
    });
  }, 250);
}

/* ============================================
   SIDE PANEL (Slide-in from right)
============================================ */
function openSidePanel(){
  const panel = document.getElementById('sidePanel');
  const overlay = document.getElementById('sidePanelOverlay');
  if(panel && overlay){
    panel.classList.add('open');
    overlay.classList.add('open');
    document.body.classList.add('panel-open');
  }
}

function closeSidePanel(){
  const panel = document.getElementById('sidePanel');
  const overlay = document.getElementById('sidePanelOverlay');
  if(panel && overlay){
    panel.classList.remove('open');
    overlay.classList.remove('open');
    document.body.classList.remove('panel-open');
  }
}

// ESC key closes panel
document.addEventListener('keydown', (e) => {
  if(e.key === 'Escape') closeSidePanel();
});

/* ============================================
   NAVIGATION EXTRAS
============================================ */

// Toggle Search Bar
function toggleSearch(){
  const bar = document.getElementById('ngoSearchBar');
  if(!bar) return;
  bar.classList.toggle('open');
  if(bar.classList.contains('open')){
    const input = bar.querySelector('input');
    if(input) input.focus();
  }
}

// Mobile: toggle dropdown inside nav
document.querySelectorAll('.ngo-nav-item').forEach(item => {
  const link = item.querySelector('.ngo-nav-link');
  if(link && item.querySelector('.ngo-dropdown')){
    link.addEventListener('click', (e) => {
      if(window.innerWidth <= 820){
        e.preventDefault();
        document.querySelectorAll('.ngo-nav-item').forEach(other => {
          if(other !== item) other.classList.remove('open');
        });
        item.classList.toggle('open');
      }
    });
  }
});

// Close mobile menu after click on dropdown link
document.querySelectorAll('.ngo-dropdown li a').forEach(link => {
  link.addEventListener('click', () => {
    if(window.innerWidth <= 820){
      const nav = document.getElementById('ngoNavLinks');
      if(nav) nav.classList.remove('open');
    }
  });
});

// Close mobile nav when clicking outside
document.addEventListener('click', (e) => {
  const nav = document.getElementById('ngoNavLinks');
  const toggle = document.querySelector('.ngo-menu-toggle');
  if(window.innerWidth <= 820 && nav && nav.classList.contains('open')){
    if(!nav.contains(e.target) && toggle && !toggle.contains(e.target)){
      nav.classList.remove('open');
    }
  }
});

/* ============================================
   COUNTER ANIMATION
============================================ */
function animateCount(el){
  if(!el.dataset.count) return;
  const target = parseInt(el.dataset.count);
  const duration = 1800;
  const start = performance.now();
  function step(now){
    const progress = Math.min((now - start) / duration, 1);
    const easeOut = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(easeOut * target).toLocaleString('en-IN') + (progress === 1 ? '+' : '');
    if(progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

/* ============================================
   SCROLL REVEAL
============================================ */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.classList.add('visible');
      const numEl = entry.target.querySelector('.num');
      if(numEl && numEl.dataset.count && !numEl.dataset.done){
        animateCount(numEl);
        numEl.dataset.done = '1';
      }
    }
  });
}, {threshold: 0.15});

document.querySelectorAll('.reveal, .stat-box, .fun-bubble, .eco-bubble').forEach(el => revealObserver.observe(el));

/* ============================================
   LIGHTBOX
============================================ */
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');

document.addEventListener('click', function(e){
  const photo = e.target.closest('.photo');
  if(photo && !e.target.closest('.lightbox') && lightbox && lightboxImg){
    const img = photo.querySelector('img');
    if(img){
      lightboxImg.src = img.src;
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }
});

function closeLightbox(e){
  if(e) e.stopPropagation();
  if(lightbox){
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }
}

document.addEventListener('keydown', e => {
  if(e.key === 'Escape') closeLightbox();
});

/* ============================================
   PAYMENT
============================================ */
let selectedAmount = 1000;
const payAmountBtns = document.querySelectorAll('.pay-amount-btn');
const payCustomInput = document.getElementById('payCustomAmount');

if(payAmountBtns.length){
  payAmountBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      payAmountBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedAmount = parseInt(btn.dataset.amount);
      if(payCustomInput) payCustomInput.value = '';
      updatePayImpact();
      updateQRCode();
    });
  });
}

if(payCustomInput){
  payCustomInput.addEventListener('input', () => {
    if(payCustomInput.value){
      payAmountBtns.forEach(b => b.classList.remove('active'));
      selectedAmount = parseInt(payCustomInput.value) || 0;
      updatePayImpact();
      updateQRCode();
    }
  });
}

function updatePayImpact(){
  const emoji = document.getElementById('payImpactEmoji');
  const text = document.getElementById('payImpactText');
  if(!emoji || !text) return;
  const amount = selectedAmount;
  let impact = '', icon = '❤️';
  if(amount < 500){ icon='🍛'; impact=`Your <b>₹${amount}</b> can provide a meal to a hungry person!`; }
  else if(amount < 1000){ icon='📖'; impact=`Your <b>₹${amount}</b> can provide books for 1 child!`; }
  else if(amount < 2500){ icon='📚'; impact=`Your <b>₹${amount}</b> can provide school books for <b>2 children</b>!`; }
  else if(amount < 5000){ icon='🎒'; impact=`Your <b>₹${amount}</b> can provide a school kit for <b>1 child</b>!`; }
  else if(amount < 11000){ icon='💊'; impact=`Your <b>₹${amount}</b> can provide medicines for <b>25 people</b>!`; }
  else if(amount < 21000){ icon='🎓'; impact=`Your <b>₹${amount}</b> can sponsor <b>1 child's full year</b> education!`; }
  else { icon='🌳'; impact=`Your <b>₹${amount}</b> can plant <b>${Math.floor(amount/300)} trees</b>!`; }
  emoji.textContent = icon;
  text.innerHTML = impact;
}

function updateQRCode(){
  if(!selectedAmount) return;
  const qrImage = document.getElementById('qrImage');
  const upiDisplay = document.getElementById('upiIdDisplay');
  if(!qrImage) return;
  const upiUrl = `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(NGO_NAME)}&am=${selectedAmount}&cu=INR`;
  const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiUrl)}`;
  qrImage.src = qrApiUrl;
  if(upiDisplay) upiDisplay.textContent = UPI_ID;
}

function scrollToQR(){
  if(!selectedAmount || selectedAmount < 1){
    showToast('⚠️ Please select or enter a valid amount.', 'error');
    return;
  }
  updateQRCode();
  const qrSection = document.getElementById('qrSection');
  if(qrSection) qrSection.scrollIntoView({behavior:'smooth', block:'center'});
  showToast('📱 Scan the QR code with any UPI app', 'success');
}

function copyUPI(){
  navigator.clipboard.writeText(UPI_ID).then(() => {
    showToast('✅ UPI ID copied: ' + UPI_ID, 'success');
  }).catch(() => showToast('❌ Copy failed.', 'error'));
}

function copyText(text, label){
  navigator.clipboard.writeText(text).then(() => {
    showToast('✅ ' + label + ' copied!', 'success');
  }).catch(() => showToast('❌ Copy failed.', 'error'));
}

function closeSuccess(){
  const modal = document.getElementById('successModal');
  if(modal){
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }
}

const successModal = document.getElementById('successModal');
if(successModal){
  successModal.addEventListener('click', function(e){
    if(e.target === this) closeSuccess();
  });
}

function sponsorNow(amount){
  selectedAmount = amount;
  payAmountBtns.forEach(b => {
    b.classList.toggle('active', parseInt(b.dataset.amount) === amount);
  });
  if(![...payAmountBtns].some(b => parseInt(b.dataset.amount) === amount)){
    payAmountBtns.forEach(b => b.classList.remove('active'));
    if(payCustomInput) payCustomInput.value = amount;
  }
  updatePayImpact();
  updateQRCode();
  showPage('payment');
}

/* ============================================
   TOAST
============================================ */
let toastTimer;
function showToast(message, type = 'success'){
  const toast = document.getElementById('toast');
  if(!toast) return;
  toast.textContent = message;
  toast.className = 'toast ' + type + ' show';
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3500);
}

/* ============================================
   VOLUNTEER FORM
============================================ */
function toggleInterest(el){
  setTimeout(() => {
    const checkbox = el.querySelector('input[type="checkbox"]');
    if(checkbox && checkbox.checked){
      el.classList.add('selected');
    } else {
      el.classList.remove('selected');
    }
  }, 10);
}

function submitVolunteer(e){
  e.preventDefault();
  const name = document.getElementById('volName').value.trim();
  const age = document.getElementById('volAge').value.trim();
  const phone = document.getElementById('volPhone').value.trim();
  const email = document.getElementById('volEmail').value.trim();
  const city = document.getElementById('volCity').value.trim();
  const availability = document.getElementById('volAvailability').value;
  const message = document.getElementById('volMessage').value.trim();

  const interests = [];
  document.querySelectorAll('.interest-option input:checked').forEach(cb => {
    interests.push(cb.value);
  });

  if(!name || !age || !phone || !email || !city || !availability){
    showToast('⚠️ Please fill all required fields.', 'error');
    return;
  }
  if(interests.length === 0){
    showToast('⚠️ Please select at least one area of interest.', 'error');
    return;
  }
  if(phone.length !== 10 || !/^\d{10}$/.test(phone)){
    showToast('⚠️ Please enter a valid 10-digit mobile number.', 'error');
    return;
  }

  const volId = 'VOL-' + Date.now().toString().slice(-6);
  const volunteer = {
    id: volId, name, age, phone, email, city, availability, message,
    interests, registeredAt: new Date().toISOString()
  };
  const allVolunteers = JSON.parse(localStorage.getItem('anshika_volunteers') || '[]');
  allVolunteers.push(volunteer);
  localStorage.setItem('anshika_volunteers', JSON.stringify(allVolunteers));

  const form = document.getElementById('volunteerForm');
  const hiddenFields = `
    <input type="hidden" name="Volunteer_ID" value="${volId}">
    <input type="hidden" name="Name" value="${name}">
    <input type="hidden" name="Age" value="${age}">
    <input type="hidden" name="Phone" value="${phone}">
    <input type="hidden" name="Email" value="${email}">
    <input type="hidden" name="City" value="${city}">
    <input type="hidden" name="Interests" value="${interests.join(', ')}">
    <input type="hidden" name="Availability" value="${availability}">
    <input type="hidden" name="Message" value="${message}">
    <input type="hidden" name="_subject" value="🎉 New Volunteer Registration - ${name}">
    <input type="hidden" name="_captcha" value="false">
    <input type="hidden" name="_template" value="table">
  `;
  form.querySelectorAll('input[type="hidden"]').forEach(el => el.remove());
  form.insertAdjacentHTML('beforeend', hiddenFields);
  form.submit();

  document.getElementById('volFormWrap').style.display = 'none';
  document.getElementById('volSuccess').classList.add('show');
  document.getElementById('volIdDisplay').textContent = volId;
  showToast('🎉 Registration successful! Owner ko email bhej diya.', 'success');
  setTimeout(() => {
    document.getElementById('volSuccess').scrollIntoView({behavior:'smooth', block:'center'});
  }, 300);
}

function resetVolunteerForm(){
  document.getElementById('volunteerForm').reset();
  document.querySelectorAll('.interest-option').forEach(el => el.classList.remove('selected'));
  document.getElementById('volFormWrap').style.display = 'block';
  document.getElementById('volSuccess').classList.remove('show');
  window.scrollTo({top:0, behavior:'smooth'});
}

function printVolunteerID(){
  const volId = document.getElementById('volIdDisplay').textContent;
  const name = document.getElementById('volName').value;
  const city = document.getElementById('volCity').value;
  const interests = [...document.querySelectorAll('.interest-option input:checked')].map(cb => cb.value).join(', ');

  const printWindow = window.open('', '_blank');
  printWindow.document.write(`
    <html>
    <head>
      <title>Volunteer ID - ${volId}</title>
      <style>
        body{font-family:'Segoe UI',sans-serif;padding:40px;background:#f0fdf4;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;}
        .card{background:#fff;padding:40px;border-radius:20px;box-shadow:0 10px 40px rgba(0,0,0,.15);max-width:500px;text-align:center;border-top:6px solid #2a9d8f;}
        .logo{font-size:2rem;margin-bottom:10px;}
        h1{color:#1d3557;margin-bottom:5px;font-size:1.3rem;}
        .sub{color:#2a9d8f;font-size:.85rem;letter-spacing:2px;text-transform:uppercase;margin-bottom:25px;font-weight:600;}
        .id-box{background:linear-gradient(135deg,#dcfce7,#bbf7d0);padding:25px;border-radius:15px;margin:20px 0;border:2px dashed #16a34a;}
        .id-box .lbl{font-size:.75rem;color:#666;text-transform:uppercase;letter-spacing:1px;font-weight:600;}
        .id-box .id{font-size:2rem;font-weight:800;color:#065f46;letter-spacing:2px;margin-top:5px;}
        .info{text-align:left;background:#f8f9fa;padding:20px;border-radius:12px;margin-top:20px;}
        .info-row{display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #e0e0e0;}
        .info-row:last-child{border-bottom:none;}
        .info-row .lbl{color:#666;font-size:.85rem;}
        .info-row .val{color:#1d3557;font-weight:600;font-size:.85rem;}
        .footer{margin-top:25px;color:#666;font-size:.8rem;}
        .footer b{color:#e63946;}
      </style>
    </head>
    <body>
      <div class="card">
        <div class="logo">🤝</div>
        <h1>Anshika Helping Hands Foundation</h1>
        <div class="sub">Volunteer ID Card</div>
        <div class="id-box"><div class="lbl">Volunteer ID</div><div class="id">${volId}</div></div>
        <div class="info">
          <div class="info-row"><span class="lbl">Name:</span><span class="val">${name}</span></div>
          <div class="info-row"><span class="lbl">City:</span><span class="val">${city}</span></div>
          <div class="info-row"><span class="lbl">Interests:</span><span class="val">${interests}</span></div>
          <div class="info-row"><span class="lbl">Date:</span><span class="val">${new Date().toLocaleDateString('en-IN')}</span></div>
        </div>
        <div class="footer">Thank you for joining our mission!<br><b>📞 099204 46089</b></div>
      </div>
      <script>window.onload = () => window.print();<\/script>
    </body>
    </html>
  `);
  printWindow.document.close();
}

/* ============================================
   FOOTER SUBSCRIBE
============================================ */
function subscribeEmail(e){
  e.preventDefault();
  const email = document.getElementById('subscribeEmail').value.trim();
  if(!email || !email.includes('@')){
    showToast('⚠️ Please enter a valid email.', 'error');
    return;
  }
  fetch('https://formsubmit.co/ajax/' + OWNER_EMAIL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      _subject: '📧 New Newsletter Subscription',
      Email: email,
      Source: 'Footer Subscribe Form',
      Time: new Date().toLocaleString('en-IN'),
      _template: 'table',
      _captcha: 'false'
    })
  })
  .then(() => console.log('✅ Subscription sent'))
  .catch(() => console.log('ℹ️ Email failed'));

  document.getElementById('subscribeEmail').value = '';
  showToast('✅ Subscribed successfully! Thank you.', 'success');
}

/* ============================================
   INITIALIZE
============================================ */
document.getElementById('year').textContent = new Date().getFullYear();
updatePayImpact();
updateQRCode();