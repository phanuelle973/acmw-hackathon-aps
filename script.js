const today = new Date().toISOString().split("T")[0];

// =========================
// Mood Tracker
// =========================
const moodSelect = document.getElementById("mood-select");
moodSelect.addEventListener("change", () => {
  const selectedMood = moodSelect.value;
  localStorage.setItem(`mood-${today}`, selectedMood);
  updateSummary();
  renderCalendar();
});

// =========================
// Journal
// =========================
const journalEntry = document.getElementById("journal-entry");
const saveJournal = document.getElementById("save-journal");

saveJournal.addEventListener("click", () => {
  localStorage.setItem(`journal-${today}`, journalEntry.value);
  updateSummary();
  journalEntry.value = "";
});

// =========================
// Summary Updater
// =========================
function updateSummary() {
  document.getElementById("saved-mood").textContent =
    localStorage.getItem(`mood-${today}`) || "-";
  document.getElementById("saved-journal").textContent =
    localStorage.getItem(`journal-${today}`) || "-";
}

// =========================
// Habit Tracker
// =========================
const habitList = document.getElementById("habit-list");
const addHabitButton = document.getElementById("add-habit-button");
const newHabitInput = document.getElementById("new-habit-input");

// Get saved habits from localStorage
let habits = JSON.parse(localStorage.getItem("habits")) || [];

// Function to display habits
function displayHabits() {
  habitList.innerHTML = ""; // Clear list before reloading
  habits.forEach((habit, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <label>
        <input type="checkbox" data-habit="${habit}" />
        ${habit}
      </label>
      <button class="delete-habit" data-index="${index}">X</button>
    `;

    habitList.appendChild(li);
  });
}

// Add new habit
addHabitButton.addEventListener("click", () => {
  const newHabit = newHabitInput.value.trim();

  if (newHabit && !habits.includes(newHabit)) {
    habits.push(newHabit);
    localStorage.setItem("habits", JSON.stringify(habits)); // Save to localStorage
    newHabitInput.value = ""; // Clear input field
    displayHabits(); // Refresh habit list
  } else {
    alert("Enter a unique habit!");
  }
});

// Delete habit using event delegation
habitList.addEventListener("click", (event) => {
  if (event.target.classList.contains("delete-habit")) {
    const index = event.target.getAttribute("data-index");
    habits.splice(index, 1); // Remove the correct habit
    localStorage.setItem("habits", JSON.stringify(habits)); // Update localStorage
    displayHabits(); // Refresh list
  }
});

// Load habits when the page loads
document.addEventListener("DOMContentLoaded", displayHabits);

// =========================
// Mood Calendar
// =========================
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
    dayDiv.innerHTML = `
      <div class="calendar-date">${day}</div>
      <div class="calendar-mood">${mood}</div>
    `;
    dayDiv.title = `Mood on ${dateKey}`;

    dayDiv.addEventListener("click", () => {
      showDayDetails(dateKey);
    });

    grid.appendChild(dayDiv);
  }
}
document.getElementById("prev-month").addEventListener("click", () => {
  calendarDate.setMonth(calendarDate.getMonth() - 1);
  renderCalendar();
});

document.getElementById("next-month").addEventListener("click", () => {
  calendarDate.setMonth(calendarDate.getMonth() + 1);
  renderCalendar();
});


// =========================
// View Day Details
// =========================
function showDayDetails(dateKey) {
  const mood = localStorage.getItem(`mood-${dateKey}`) || "No mood recorded";
  const journal = localStorage.getItem(`journal-${dateKey}`) || "No journal entry";
  const completed = habits.filter(habit => {
    return localStorage.getItem(`habit-${dateKey}-${habit}`) === "true";
  });

  alert(
    `📅 Date: ${dateKey}\n\n` +
    `😊 Mood: ${mood}\n\n` +
    `📝 Journal:\n${journal}\n\n` +
    `✅ Habits Completed:\n${completed.join("\n") || "None"}`
  );
}

// =========================
// Theme Switching
// =========================
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

// Track which month is being viewed
let calendarDate = new Date(); // starts as current date

function renderCalendar() {
  const grid = document.getElementById("calendar-grid");
  const monthLabel = document.getElementById("month-label");
  grid.innerHTML = "";

  const year = calendarDate.getFullYear();
  const month = calendarDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Update label (e.g., March 2025)
  const monthName = calendarDate.toLocaleString("default", { month: "long" });
  monthLabel.textContent = `${monthName} ${year}`;

  for (let day = 1; day <= daysInMonth; day++) {
    const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const mood = localStorage.getItem(`mood-${dateKey}`) || "🕳️";

    const dayDiv = document.createElement("div");
    dayDiv.className = "calendar-day";
    dayDiv.innerHTML = `
      <div class="calendar-date">${day}</div>
      <div class="calendar-mood">${mood}</div>
    `;
    dayDiv.title = `Mood on ${dateKey}`;

    // Click to view/edit that day’s data
    dayDiv.addEventListener("click", () => {
      showDayDetails(dateKey);
    });

    grid.appendChild(dayDiv);
  }
}


// =========================
// Load on Startup
// =========================
updateSummary();
renderCalendar();
