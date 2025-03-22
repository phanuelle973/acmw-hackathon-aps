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

const addHabitButton = document.getElementById('add-habit-button');
const newHabitInput = document.getElementById('new-habit-input');
const habitList = document.getElementById('habit-list');

// Get saved habits from localStorage
let habits = JSON.parse(localStorage.getItem('habits')) || [];

// Function to display habits in the list
function displayHabits() {
  habitList.innerHTML = '';  // Clear current list
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
  dayDiv.addEventListener("click", () => {
    showDayDetails(dateKey); // function that opens a modal or details view
  });
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

function showDayDetails(dateKey) {
  const mood = localStorage.getItem(`mood-${dateKey}`) || "No mood recorded";
  const journal = localStorage.getItem(`journal-${dateKey}`) || "No journal entry";
  const habits = ["Drink Water", "Read", "Exercise"]; // or your dynamic list

  const completed = habits.filter(habit => {
    return localStorage.getItem(`habit-${dateKey}-${habit}`) === "true";
  });

  // Show in alert for now (we can upgrade this to a modal)
  alert(
    `📅 Date: ${dateKey}\n\n` +
    `😊 Mood: ${mood}\n\n` +
    `📝 Journal:\n${journal}\n\n` +
    `✅ Habits Completed:\n${completed.join("\n") || "None"}`
  );
}

const habitKey = `habit-${today}-${habitName}`;
localStorage.setItem(habitKey, isChecked);



// Load content
updateSummary();
renderCalendar();
