let cookie = document.getElementById("cookie");
let cookieCountDisplay = document.getElementById("cookie-counter");
let cookieCount = 0;
let cookiePerClick = 1;
let cookiePerSecond = 0;

// 🔧 Cheaper starting costs
let cookiePerClickCost = 5;
let cookiePerSecondCost = 20;

let cookiePerClickCount = 0;
let cookiePerSecondCount = 0;

let cookiePerClickDisplay = document.getElementById("cookies-per-click");
let cookiePerSecondDisplay = document.getElementById("cookies-per-second");
let cookiePerClickCostDisplay = document.getElementById("cookie-per-click-cost");
let cookiePerSecondCostDisplay = document.getElementById("cookie-per-second-cost");
let cookiePerClickCountDisplay = document.getElementById("cookie-per-click-count");
let cookiePerSecondCountDisplay = document.getElementById("cookie-per-second-count");
let cookiePerClickUpgradeButton = document.getElementById("cookie-per-click-upgrade-button");
let cookiePerSecondUpgradeButton = document.getElementById("cookie-per-second-upgrade-button");

// 🎵 Audio setup
const audio = document.getElementById("bgAudio");
const musicButton = document.getElementById("mute-button");
const resetButton = document.getElementById("reset-music-button");
audio.volume = 0.2;

// Load paused state from localStorage (default: playing)
let isPaused = localStorage.getItem("sukiMusicPaused") === "true";

// Apply initial state
if (!isPaused) {
    audio.play().catch(err => console.log("Autoplay blocked:", err));
}
updateMusicButton();

// Bind music buttons
musicButton.addEventListener("click", toggleMusic);
resetButton.addEventListener("click", () => {
    audio.currentTime = 0;
});

// ------------------ COOKIE CLICKER -------------------

function updateCookieCountDisplay() {
    cookieCountDisplay.innerText = Math.floor(cookieCount);
}

function updateCookiePerClickDisplay() {
    cookiePerClickDisplay.innerText = `Suki Per Click: ${cookiePerClick}`;
    cookiePerClickCostDisplay.innerText = `Cost: ${Math.floor(cookiePerClickCost)}`;
    cookiePerClickCountDisplay.innerText = `Upgrades: ${cookiePerClickCount}`;
}

function updateCookiePerSecondDisplay() {
    cookiePerSecondDisplay.innerText = `Suki Per Second: ${cookiePerSecond}`;
    cookiePerSecondCostDisplay.innerText = `Cost: ${Math.floor(cookiePerSecondCost)}`;
    cookiePerSecondCountDisplay.innerText = `Upgrades: ${cookiePerSecondCount}`;
}

let saveTimeout;

function click() {
    cookieCount += cookiePerClick;
    updateCookieCountDisplay();
    
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(saveGame, 500);
}


// 🔧 Upgrades
function buyCookiePerClick() {
    if (cookieCount >= cookiePerClickCost) {
        cookieCount -= cookiePerClickCost;
        cookiePerClick += 2;
        cookiePerClickCost = Math.floor(cookiePerClickCost * 1.2);
        cookiePerClickCount++;
        updateCookieCountDisplay();
        updateCookiePerClickDisplay();
        saveGame();
    }
}

function buyCookiePerSecond() {
    if (cookieCount >= cookiePerSecondCost) {
        cookieCount -= cookiePerSecondCost;
        cookiePerSecond += 2;
        cookiePerSecondCost = Math.floor(cookiePerSecondCost * 1.25);
        cookiePerSecondCount++;
        updateCookieCountDisplay();
        updateCookiePerSecondDisplay();
        saveGame();
    }
}

function update() {
    cookieCount += cookiePerSecond / 5; // runs every 0.1s
    updateCookieCountDisplay();
    saveGame();
}

function resetGame() {
    if (confirm('Delete all sukis and upgrades? This cannot be undone!')) {
        cookieCount = 0;
        cookiePerClick = 1;
        cookiePerSecond = 0;
        cookiePerClickCost = 5;
        cookiePerSecondCost = 20;
        cookiePerClickCount = 0;
        cookiePerSecondCount = 0;
        
        localStorage.removeItem('sukiClickerGameDycel');
        updateAllDisplays();
    }
}

function updateAllDisplays() {
    updateCookieCountDisplay();
    updateCookiePerClickDisplay();
    updateCookiePerSecondDisplay();
}

function loadGame() {
    const saved = localStorage.getItem('sukiClickerGameDycel');
    if (saved) {
        const data = JSON.parse(saved);
        cookieCount = data.cookieCount || 0;
        cookiePerClick = data.cookiePerClick || 1;
        cookiePerSecond = data.cookiePerSecond || 0;
        cookiePerClickCount = data.cookiePerClickCount || 0;
        cookiePerSecondCount = data.cookiePerSecondCount || 0;
        cookiePerClickCost = data.cookiePerClickCost || 5;
        cookiePerSecondCost = data.cookiePerSecondCost || 20;
    }
}

function startGame() {
    loadGame();
    setInterval(update, 100);
    cookie.addEventListener("click", click);
    cookiePerClickUpgradeButton.addEventListener("click", buyCookiePerClick);
    cookiePerSecondUpgradeButton.addEventListener("click", buyCookiePerSecond);
    document.getElementById('reset-game').addEventListener('click', resetGame);
    updateAllDisplays();
}

function saveGame() {
    const data = {
        cookieCount,
        cookiePerClick,
        cookiePerSecond,
        cookiePerClickCount,
        cookiePerSecondCount,
        cookiePerClickCost,
        cookiePerSecondCost
    };
    localStorage.setItem('sukiClickerGameDycel', JSON.stringify(data));
}

// 🎵 Music toggle
function toggleMusic() {
    if (isPaused) {
        audio.play().catch(err => console.log("Autoplay blocked:", err));
        isPaused = false;
    } else {
        audio.pause();
        isPaused = true;
    }
    localStorage.setItem("sukiMusicPaused", isPaused);
    updateMusicButton();
}

function updateMusicButton() {
    musicButton.innerText = isPaused ? "Play Music" : "Pause Music";
}

// 🎵 Autoplay fix on first click
function fixAudio() {
    if (!isPaused) {
        audio.play().catch(err => console.log("Autoplay blocked:", err));
    }
}

document.body.addEventListener("click", fixAudio, { once: true });

function startPage(){
    setTimeout(fixAudio, 1000);
    startGame();
}

function scaleSite() {
    const wrapper = document.getElementById("site-wrapper");
    const scaleX = window.innerWidth / 1200;
    const scaleY = window.innerHeight / 2100;
    let scale = Math.min(scaleX, scaleY);

    scale *= 0.98; // shrink a little bit

    wrapper.style.setProperty("--site-scale", scale);
}
window.addEventListener('resize', scaleSite);
window.addEventListener('load', scaleSite);

document.addEventListener('touchmove', function(e) {
    e.preventDefault();
}, { passive: false });


window.onload = startPage;