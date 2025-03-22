// Get current date key
const today = new Date().toISOString().split("T")[0];

// Mood tracker
const moodSelect = document.getElementById("mood-select");
moodSelect.addEventListener("change", () => {
  localStorage.setItem(`mood-${today}`, moodSelect.value);
  updateSummary();
});

// Journal
const journalEntry = document.getElementById("journal-entry");
const saveJournal = document.getElementById("save-journal");

saveJournal.addEventListener("click", () => {
  localStorage.setItem(`journal-${today}`, journalEntry.value);
  updateSummary();
  journalEntry.value = "";
});

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

moodSelect.addEventListener("change", () => {
  const selectedMood = moodSelect.value;
  localStorage.setItem(`mood-${today}`, selectedMood);
  updateSummary();
  renderCalendar(); // ← refresh the calendar!
});

updateSummary();
renderCalendar(); // at the end of your script


const themeSelect = document.getElementById("theme-select");

function applyTheme(theme) {
  switch (theme) {
    case "blue":
      document.documentElement.style.setProperty("--bg-color", "#e6f0ff");
      document.documentElement.style.setProperty("--accent-color", "#3b82f6");
      break;
    case "purple":
      document.documentElement.style.setProperty("--bg-color", "#f0eaff");
      document.documentElement.style.setProperty("--accent-color", "#8b5cf6");
      break;
    case "pink":
      document.documentElement.style.setProperty("--bg-color", "#fff0f5");
      document.documentElement.style.setProperty("--accent-color", "#ec4899");
      break;
  }

  localStorage.setItem("meflect-theme", theme);
}

themeSelect.addEventListener("change", () => {
  const selected = themeSelect.value;
  applyTheme(selected);
});

// Load saved theme on page load
const savedTheme = localStorage.getItem("meflect-theme") || "blue";
themeSelect.value = savedTheme;
applyTheme(savedTheme);


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
