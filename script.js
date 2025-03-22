const today = new Date().toISOString().split("T")[0];

// Mood tracker
const moodSelect = document.getElementById("mood-select");
moodSelect.addEventListener("change", () => {
  const selectedMood = moodSelect.value;
  localStorage.setItem(`mood-${today}`, selectedMood);
  updateSummary();
  renderCalendar();
});

// Journal
const journalEntry = document.getElementById("journal-entry");
const saveJournal = document.getElementById("save-journal");

saveJournal.addEventListener("click", () => {
  localStorage.setItem(`journal-${today}`, journalEntry.value);
  updateSummary();
  journalEntry.value = "";
});

// Summary updater
function updateSummary() {
  document.getElementById("saved-mood").textContent =
    localStorage.getItem(`mood-${today}`) || "-";
  document.getElementById("saved-journal").textContent =
    localStorage.getItem(`journal-${today}`) || "-";
}

// Mood Calendar
function renderCalendar() {
  const grid = document.getElementById("calendar-grid");
  grid.innerHTML = "";

  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let day = 1; day <= daysInMonth; day++) {
    const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const mood = localStorage.getItem(`mood-${dateKey}`) || "🕳️";

    const dayDiv = document.createElement("div");
    dayDiv.className = "calendar-day";
    dayDiv.textContent = `${day}\n${mood}`;
    dayDiv.title = `Mood on ${dateKey}`;
    grid.appendChild(dayDiv);
  }
}

// Theme switcher (class-based version)
const themeSelect = document.getElementById("theme-select");

function applyTheme(theme) {
  const body = document.body;
  body.classList.remove("theme-blue", "theme-purple", "theme-pink");
  body.classList.add(`theme-${theme}`);
  localStorage.setItem("meflect-theme", theme);
}

themeSelect.addEventListener("change", () => {
  applyTheme(themeSelect.value);
});

const savedTheme = localStorage.getItem("meflect-theme") || "blue";
themeSelect.value = savedTheme;
applyTheme(savedTheme);

// Load content
updateSummary();
renderCalendar();
