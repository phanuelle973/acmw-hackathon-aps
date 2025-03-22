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

// Habit checklist
document.querySelectorAll("#habit-list input").forEach((checkbox) => {
  checkbox.addEventListener("change", () => {
    const habitKey = `habit-${today}-${checkbox.dataset.habit}`;
    localStorage.setItem(habitKey, checkbox.checked);
  });

  // Load saved habit state
  const saved = localStorage.getItem(`habit-${today}-${checkbox.dataset.habit}`);
  if (saved === "true") checkbox.checked = true;
});

// Summary section
function updateSummary() {
  document.getElementById("saved-mood").textContent =
    localStorage.getItem(`mood-${today}`) || "-";
  document.getElementById("saved-journal").textContent =
    localStorage.getItem(`journal-${today}`) || "-";
}

updateSummary();


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
