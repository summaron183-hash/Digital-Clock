// --- 1. MAIN CLOCK & WORLD CLOCK ---
function updateClocks() {
    const now = new Date();
    
    // Main Local Clock
    document.getElementById('clock').textContent = now.toLocaleTimeString();
    
    // Format Date
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('date').textContent = now.toLocaleDateString(undefined, options);

    // World Clocks
    document.getElementById('london-clock').textContent = new Date().toLocaleTimeString("en-GB", {timeZone: "Europe/London", hour: '2-digit', minute:'2-digit'});
    document.getElementById('ny-clock').textContent = new Date().toLocaleTimeString("en-US", {timeZone: "America/New_York", hour: '2-digit', minute:'2-digit'});
    document.getElementById('tokyo-clock').textContent = new Date().toLocaleTimeString("ja-JP", {timeZone: "Asia/Tokyo", hour: '2-digit', minute:'2-digit'});

    // Check Alarm
    checkAlarm(now);
}
setInterval(updateClocks, 1000);

// --- 2. ALARM SYSTEM ---
let alarmTime = null;

function setAlarm() {
    const input = document.getElementById('alarm-time').value;
    if (input) {
        alarmTime = input;
        document.getElementById('alarm-status').textContent = `🔔 Set for ${alarmTime}`;
    }
}

function checkAlarm(now) {
    if (!alarmTime) return;
    const currentHourMin = now.toTimeString().slice(0, 5);
    if (currentHourMin === alarmTime) {
        alert("⏰ ALARM! Wake up!");
        alarmTime = null; // Reset after trigger
        document.getElementById('alarm-status').textContent = "No alarm set";
    }
}

// --- 3. STOPWATCH SYSTEM ---
let stopwatchInterval;
let elapsedSeconds = 0;

function startStopwatch() {
    clearInterval(stopwatchInterval);
    stopwatchInterval = setInterval(() => {
        elapsedSeconds++;
        const hrs = String(Math.floor(elapsedSeconds / 3600)).padStart(2, '0');
        const mins = String(Math.floor((elapsedSeconds % 3600) / 60)).padStart(2, '0');
        const secs = String(elapsedSeconds % 60).padStart(2, '0');
        document.getElementById('stopwatch-display').textContent = `${hrs}:${mins}:${secs}`;
    }, 1000);
}

function pauseStopwatch() {
    clearInterval(stopwatchInterval);
}

function resetStopwatch() {
    clearInterval(stopwatchInterval);
    elapsedSeconds = 0;
    document.getElementById('stopwatch-display').textContent = "00:00:00";
}

// --- 4. WEATHER MOCK ---
// Automatically simulates weather based on standard conditions
function loadWeather() {
    const conditions = ["☀️ Sunny, 28°C", "⛅ Partly Cloudy, 26°C", "🌧️ Light Rain, 22°C"];
    const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
    document.getElementById('weather').textContent = randomCondition;
}
loadWeather();

// --- 5. FLOATING STICKY NOTE & LOCAL STORAGE ---
const noteInput = document.getElementById('note-input');
const floatingNote = document.getElementById('floating-note');
const floatingText = document.getElementById('floating-text');

// Load saved data when the app opens
window.onload = () => {
    const savedNote = localStorage.getItem('stickyNoteContent');
    if (savedNote) {
        noteInput.value = savedNote;
        floatingText.value = savedNote;
    }
    
    const wasFloating = localStorage.getItem('isFloating');
    if (wasFloating === 'true') {
        floatingNote.classList.remove('hidden');
    }
    updateClocks();
};

// Mirror changes between dashboard note and floating note, then auto-save
noteInput.addEventListener('input', (e) => {
    floatingText.value = e.target.value;
    localStorage.setItem('stickyNoteContent', e.target.value);
});

floatingText.addEventListener('input', (e) => {
    noteInput.value = e.target.value;
    localStorage.setItem('stickyNoteContent', e.target.value);
});

function enableFloatingNote() {
    floatingNote.classList.remove('hidden');
    localStorage.setItem('isFloating', 'true');
}

function closeFloatingNote() {
    floatingNote.classList.add('hidden');
    localStorage.setItem('isFloating', 'false');
}

// Make the floating note draggable on desktop displays
let isDragging = false;
const handle = document.getElementById('floating-handle');

handle.addEventListener('mousedown', (e) => {
    isDragging = true;
    let offsetX = e.clientX - floatingNote.getBoundingClientRect().left;
    let offsetY = e.clientY - floatingNote.getBoundingClientRect().top;
    
    function mouseMoveHandler(e) {
        if (!isDragging) return;
        floatingNote.style.left = (e.clientX - offsetX) + 'px';
        floatingNote.style.top = (e.clientY - offsetY) + 'px';
        floatingNote.style.bottom = 'auto';
        floatingNote.style.right = 'auto';
    }
    
    function mouseUpHandler() {
        isDragging = false;
        document.removeEventListener('mousemove', mouseMoveHandler);
        document.removeEventListener('mouseup', mouseUpHandler);
    }
    
    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
});
