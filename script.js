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

    // ✅ Compare actual date objects
    const dayDate = new Date(year, month, day);
    const now = new Date();
    dayDate.setHours(0, 0, 0, 0);
    now.setHours(0, 0, 0, 0);

    if (dayDate <= now) {
      // Past or today → clickable
      dayDiv.addEventListener("click", () => {
        showDayDetails(dateKey);
      });
    } else {
      // Future → visually dim and not clickable
      dayDiv.classList.add("disabled-day");
    }

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



// =========================
// Load on Startup
// =========================
updateSummary();
renderCalendar();


// Modal elements
const modal = document.getElementById("edit-modal");
const closeModal = document.getElementById("close-modal");
const modalDate = document.getElementById("modal-date");
const modalMood = document.getElementById("modal-mood");
const modalJournal = document.getElementById("modal-journal");
const modalHabitList = document.getElementById("modal-habit-list");
const saveModal = document.getElementById("save-modal");

let currentEditDate = "";

// Open modal with data
function showDayDetails(dateKey) {
  currentEditDate = dateKey;
  modalDate.textContent = dateKey;

  modalMood.value = localStorage.getItem(`mood-${dateKey}`) || "";
  modalJournal.value = localStorage.getItem(`journal-${dateKey}`) || "";

  // Load habit checkboxes
  modalHabitList.innerHTML = "";
  habits.forEach(habit => {
    const isChecked = localStorage.getItem(`habit-${dateKey}-${habit}`) === "true";
    const label = document.createElement("label");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = isChecked;
    checkbox.dataset.habit = habit;
    label.appendChild(checkbox);
    label.appendChild(document.createTextNode(` ${habit}`));
    modalHabitList.appendChild(label);
    modalHabitList.appendChild(document.createElement("br"));
  });

  modal.classList.remove("hidden");
}

// Save changes when modal is submitted
saveModal.addEventListener("click", () => {
  const mood = modalMood.value;
  const journal = modalJournal.value;

  localStorage.setItem(`mood-${currentEditDate}`, mood);
  localStorage.setItem(`journal-${currentEditDate}`, journal);

  document.querySelectorAll("#modal-habit-list input[type='checkbox']").forEach(cb => {
    const habit = cb.dataset.habit;
    const key = `habit-${currentEditDate}-${habit}`;
    localStorage.setItem(key, cb.checked);
  });

  modal.classList.add("hidden");
  renderCalendar();
});

// Close modal when "x" is clicked
closeModal.addEventListener("click", () => {
  modal.classList.add("hidden");
});
