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
const addHabitButton = document.getElementById('add-habit-button');
const newHabitInput = document.getElementById('new-habit-input');
const habitList = document.getElementById('habit-list');

let habits = JSON.parse(localStorage.getItem('habits')) || [];

function displayHabits() {
  habitList.innerHTML = '';
  habits.forEach((habit, index) => {
    const li = document.createElement('li');
    const dateKey = today;

    const isChecked = localStorage.getItem(`habit-${dateKey}-${habit}`) === "true";

    li.innerHTML = `
      <label>
        <input type="checkbox" data-habit="${habit}" ${isChecked ? "checked" : ""} />
        <i class="fas fa-check"></i> ${habit}
      </label>
      <button class="delete-habit" data-index="${index}">❌</button>
    `;

    habitList.appendChild(li);
  });

  // Delete habit logic
  document.querySelectorAll('.delete-habit').forEach(button => {
    button.addEventListener('click', (event) => {
      const habitIndex = event.target.dataset.index;
      habits.splice(habitIndex, 1);
      localStorage.setItem('habits', JSON.stringify(habits));
      displayHabits();
    });
  });

  // Save habit checkbox status
  document.querySelectorAll('#habit-list input[type="checkbox"]').forEach(checkbox => {
    checkbox.addEventListener('change', (event) => {
      const habitName = event.target.dataset.habit;
      const isChecked = event.target.checked;
      const dateKey = today;
      localStorage.setItem(`habit-${dateKey}-${habitName}`, isChecked);
    });
  });
}

addHabitButton.addEventListener('click', () => {
  const newHabit = newHabitInput.value.trim();

  if (newHabit && !habits.includes(newHabit)) {
    habits.push(newHabit);
    localStorage.setItem('habits', JSON.stringify(habits));
    newHabitInput.value = '';
    displayHabits();
  } else if (!newHabit) {
    alert('Please enter a habit!');
  } else {
    alert('This habit already exists!');
  }
});

document.addEventListener('DOMContentLoaded', () => {
  displayHabits();
});

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
