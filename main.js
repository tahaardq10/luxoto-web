let allAds = JSON.parse(localStorage.getItem('luxAds')) || [];
let users = JSON.parse(localStorage.getItem('luxUsers')) || [];
let activeUser = JSON.parse(localStorage.getItem('luxActiveUser')) || null;

// Page Load
window.onload = () => { if(activeUser) updateUI(true); renderAds(allAds); };

function openModal(id){ document.getElementById(id).style.display='flex'; }
function closeModal(id){ document.getElementById(id).style.display='none'; }

function showStatus(success,text){
    const box=document.getElementById('status-box');
    const icon=document.getElementById('status-icon');
    const txt=document.getElementById('status-text');
    box.style.display='flex'; txt.innerText=text;
    icon.className=success?"fas fa-check-circle":"fas fa-times-circle";
    icon.style.color=success?"#2ecc71":"#e74c3c";
    setTimeout(()=>box.style.display='none',2000);
}

// UI Update
function updateUI(isLogin){
    document.getElementById('auth-buttons').style.display=isLogin?'none':'flex';
    document.getElementById('user-menu').style.display=isLogin?'flex':'none';
    if(isLogin) document.getElementById('prof-user-info').innerText="Hoşgeldin, "+activeUser.name;
}

// Auth
function handleSignup(){
    const email=document.getElementById('signup-email').value;
    const name=document.getElementById('signup-name').value;
    const phone=document.getElementById('signup-phone').value;
    const pass=document.getElementById('signup-pass').value;
    if(!email.includes('@')){ showStatus(false,"Geçersiz E-posta"); return; }
    const newUser={name,email,phone,pass}; users.push(newUser);
    localStorage.setItem('luxUsers',JSON.stringify(users));
    showStatus(true,"Hesap Açıldı"); closeModal('signup-modal');
}

function handleLogin(){
    const email=document.getElementById('login-email').value;
    const pass=document.getElementById('login-pass').value;
    const user=users.find(u=>u.email===email && u.pass===pass);
    if(user){ activeUser=user; localStorage.setItem('luxActiveUser',JSON.stringify(user)); updateUI(true); closeModal('login-modal'); showStatus(true,"Giriş Başarılı"); }
    else showStatus(false,"Hatalı Bilgi");
}

function logout(){ activeUser=null; localStorage.removeItem('luxActiveUser'); updateUI(false); showStatus(true,"Çıkış Yapıldı"); }

// Ads
function submitNewAd(){
    const file=document.getElementById('ad-file').files[0];
    if(!file){ showStatus(false,"Fotoğraf Seçmelisiniz"); return; }
    const reader=new FileReader();
    reader.onload=e=>{
        const ad={
            id:Date.now(),
            marka:document.getElementById('ad-brand').value,
            model:document.getElementById('ad-model').value,
            yil:document.getElementById('ad-year').value,
            km:document.getElementById('ad-km').value,
            hasar:document.getElementById('ad-damage').value,
            guc:document.getElementById('ad-power').value,
            desc:document.getElementById('ad-desc').value,
            resim:e.target.result
        };
        allAds.unshift(ad);
        localStorage.setItem('luxAds',JSON.stringify(allAds));
        renderAds(allAds); closeModal('add-ad-modal'); showStatus(true,"İlan Yayınlandı");
    };
    reader.readAsDataURL(file);
}

function renderAds(list){
    const main=document.getElementById('main-listings');
    const right=document.getElementById('right-listings');
    main.innerHTML=''; right.innerHTML='';
    list.forEach(ad=>{
        const html=`<div class="ilan-card">
            <img src="${ad.resim}">
            <div style="padding:10px;">
                <h4>${ad.marka} ${ad.model}</h4>
                <p>${ad.yil} | ${ad.km} KM</p>
            </div>
        </div>`;
        main.innerHTML+=html; right.innerHTML+=html;
    });
}

function searchAds(){
    const val=document.getElementById('searchInput').value.toLowerCase();
    renderAds(allAds.filter(a=>a.marka.toLowerCase().includes(val) || a.model.toLowerCase().includes(val)));
}
