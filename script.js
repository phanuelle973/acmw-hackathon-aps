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
