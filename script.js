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

const addHabitButton = document.getElementById('add-habit-button');
const newHabitInput = document.getElementById('new-habit-input');
const habitList = document.getElementById('habit-list');

// Get saved habits from localStorage
let habits = JSON.parse(localStorage.getItem('habits')) || [];

// Function to display the habits in the list
function displayHabits() {
  habitList.innerHTML = ''; // Clear current list
  habits.forEach(habit => {
    const li = document.createElement('li');
    li.innerHTML = `<label>
      <input type="checkbox" data-habit="${habit}" />
      <i class="fas fa-check"></i> ${habit}
    </label>`;
    habitList.appendChild(li);
  });
}

// Function to add a new habit
addHabitButton.addEventListener('click', () => {
  const newHabit = newHabitInput.value.trim();

  if (newHabit && !habits.includes(newHabit)) {
    habits.push(newHabit);  // Add new habit to the habits array
    localStorage.setItem('habits', JSON.stringify(habits));  // Save to localStorage
    newHabitInput.value = '';  // Clear the input field
    displayHabits();  // Refresh the displayed list
  } else if (!newHabit) {
    alert('Please enter a habit!');
  } else {
    alert('This habit already exists!');
  }
});

// Initialize habit list display on page load
document.addEventListener('DOMContentLoaded', () => {
  displayHabits();  // Display saved habits when the page loads
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
