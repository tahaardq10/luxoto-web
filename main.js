// Firebase Konfigürasyonu
const firebaseConfig = {
    apiKey: "AIzaSyCacVmtIT1Y0NGHy43VJQf8CZ8x47Ju5M4",
    authDomain: "luxoto-19d55.firebaseapp.com",
    projectId: "luxoto-19d55",
    storageBucket: "luxoto-19d55.appspot.com",
    messagingSenderId: "671208774332",
    appId: "1:671208774332:web:37f9938c52cd0db5f9ceb9",
    measurementId: "G-604ZXYTWBC"
};
const app = firebase.initializeApp(firebaseConfig);
const analytics = firebase.getAnalytics(app);

// Veri yönetimi
let allAds = JSON.parse(localStorage.getItem('luxAds')) || [];
let users = JSON.parse(localStorage.getItem('luxUsers')) || [];
let activeUser = JSON.parse(localStorage.getItem('luxActiveUser')) || null;

window.onload = () => {
    if(activeUser) updateUI(true);
    renderAds(allAds);
};

// Modal fonksiyonları
function openModal(id) { document.getElementById(id).style.display='flex'; }
function closeModal(id) { document.getElementById(id).style.display='none'; }

// Status Box
function showStatus(success, text){
    const box = document.getElementById('status-box');
    box.style.display='block';
    box.innerText = text;
    setTimeout(()=>{box.style.display='none';},2000);
}

// UI güncelle
function updateUI(isLogin){
    document.getElementById('auth-buttons').style.display = isLogin?'none':'flex';
    document.getElementById('user-menu').style.display = isLogin?'flex':'none';
}

// Signup/Login
function handleSignup(){
    const email = document.getElementById('signup-email').value;
    const name = document.getElementById('signup-name').value;
    const phone = document.getElementById('signup-phone').value;
    const pass = document.getElementById('signup-pass').value;
    const newUser = {name,email,phone,pass};
    users.push(newUser);
    localStorage.setItem('luxUsers',JSON.stringify(users));
    showStatus(true,"Hesap Açıldı!");
    closeModal('signup-modal');
}

function handleLogin(){
    const email = document.getElementById('login-email').value;
    const pass = document.getElementById('login-pass').value;
    const user = users.find(u=>u.email===email && u.pass===pass);
    if(user){activeUser=user; localStorage.setItem('luxActiveUser',JSON.stringify(user)); updateUI(true); closeModal('login-modal'); showStatus(true,"Giriş Başarılı");}
    else showStatus(false,"Hatalı Bilgi");
}

// İlan yönetimi
function submitNewAd(){
    const file = document.getElementById('ad-file').files[0];
    if(!file){showStatus(false,"Fotoğraf Seç!"); return;}
    const reader = new FileReader();
    reader.onload = function(e){
        const newAd = {
            id:Date.now(),
            marka: document.getElementById('ad-brand').value,
            model: document.getElementById('ad-model').value,
            yil: document.getElementById('ad-year').value,
            km: document.getElementById('ad-km').value,
            hasar: document.getElementById('ad-damage').value,
            guc: document.getElementById('ad-power').value,
            desc: document.getElementById('ad-desc').value,
            resim: e.target.result
        };
        allAds.unshift(newAd);
        localStorage.setItem('luxAds',JSON.stringify(allAds));
        renderAds(allAds);
        closeModal('add-ad-modal');
        showStatus(true,"İlan Yayınlandı!");
    };
    reader.readAsDataURL(file);
}

function renderAds(ads){
    const main = document.getElementById('main-listings');
    main.innerHTML='';
    ads.forEach(ad=>{
        main.innerHTML+=`
        <div class="ilan-card">
            <img src="${ad.resim}">
            <div>
                <h4>${ad.marka} ${ad.model}</h4>
                <p>${ad.yil} | ${ad.km} KM</p>
            </div>
        </div>
        `;
    });
}

function searchAds(){
    const val = document.getElementById('searchInput').value.toLowerCase();
    renderAds(allAds.filter(a=>a.marka.toLowerCase().includes(val) || a.model.toLowerCase().includes(val)));
}