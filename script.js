// === Mood Chart Globals ===
let moodChart;
let moodChartRange = "month"; // Default range

window.setMoodChartRange = function(range) {
  moodChartRange = range;
  renderMoodChart();
};

document.addEventListener("DOMContentLoaded", () => {
  // =========================
  // THEME SETUP
  // =========================
  const savedTheme = localStorage.getItem("meflect-theme") || "blue";

  const moodScores = {
    "😠": 1,
    "😢": 2,
    "😐": 3,
    "😊": 4
  };
  

  function applyTheme(theme) {
    document.body.classList.remove("theme-blue", "theme-purple", "theme-pink");
    document.body.classList.add(`theme-${theme}`);
    localStorage.setItem("meflect-theme", theme);
  }

  applyTheme(savedTheme);

  const themeSelect = document.getElementById("theme-select");
  if (themeSelect) {
    themeSelect.value = savedTheme;
    themeSelect.addEventListener("change", () => {
      applyTheme(themeSelect.value);
    });
  }

  // =========================
  // GLOBALS
  // =========================
  const today = new Date().toISOString().split("T")[0];
  let calendarDate = new Date();
  let currentEditDate = "";
  let habits = JSON.parse(localStorage.getItem("habits")) || [];

  // =========================
  // MOOD TRACKER
  // =========================
  const moodSelect = document.getElementById("mood-select");
  if (moodSelect) {
    moodSelect.addEventListener("change", () => {
      localStorage.setItem(`mood-${today}`, moodSelect.value);
      updateSummary();
      renderCalendar();
    });
  }

  // =========================
  // JOURNAL
  // =========================
  const journalEntry = document.getElementById("journal-entry");
  const saveJournal = document.getElementById("save-journal");

  if (saveJournal && journalEntry) {
    saveJournal.addEventListener("click", () => {
      localStorage.setItem(`journal-${today}`, journalEntry.value);
      updateSummary();
      journalEntry.value = "";
    });
  }

  function updateSummary() {
    const mood = localStorage.getItem(`mood-${today}`) || "-";
    const journal = localStorage.getItem(`journal-${today}`) || "-";

    const moodDisplay = document.getElementById("saved-mood");
    const journalDisplay = document.getElementById("saved-journal");

    if (moodDisplay) moodDisplay.textContent = mood;
    if (journalDisplay) journalDisplay.textContent = journal;
  }

  // =========================
  // HABIT TRACKER
  // =========================
  const habitList = document.getElementById("habit-list");
  const addHabitButton = document.getElementById("add-habit-button");
  const newHabitInput = document.getElementById("new-habit-input");

  function displayHabits() {
    if (!habitList) return;
    habitList.innerHTML = "";
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

  if (addHabitButton && newHabitInput) {
    addHabitButton.addEventListener("click", () => {
      const newHabit = newHabitInput.value.trim();
      if (newHabit && !habits.includes(newHabit)) {
        habits.push(newHabit);
        localStorage.setItem("habits", JSON.stringify(habits));
        newHabitInput.value = "";
        displayHabits();
      } else {
        alert("Enter a unique habit!");
      }
    });

    habitList?.addEventListener("click", (event) => {
      if (event.target.classList.contains("delete-habit")) {
        const index = event.target.getAttribute("data-index");
        habits.splice(index, 1);
        localStorage.setItem("habits", JSON.stringify(habits));
        displayHabits();
      }
    });

    displayHabits();
  }

  document.getElementById("prev-month")?.addEventListener("click", () => {
    calendarDate.setMonth(calendarDate.getMonth() - 1);
    renderCalendar();
  });

  document.getElementById("next-month")?.addEventListener("click", () => {
    calendarDate.setMonth(calendarDate.getMonth() + 1);
    renderCalendar();
  });

  document.getElementById("week-btn")?.addEventListener("click", () => {
    moodChartRange = "week";
    renderMoodChart();
  });
  
  document.getElementById("month-btn")?.addEventListener("click", () => {
    moodChartRange = "month";
    renderMoodChart();
  });
  
  document.getElementById("year-btn")?.addEventListener("click", () => {
    moodChartRange = "year";
    renderMoodChart();
  });
  

  // =========================
  // MODAL & DETAIL VIEW
  // =========================
  const modal = document.getElementById("edit-modal");
  const closeModal = document.getElementById("close-modal");
  const modalDate = document.getElementById("modal-date");
  const modalMood = document.getElementById("modal-mood");
  const modalJournal = document.getElementById("modal-journal");
  const modalHabitList = document.getElementById("modal-habit-list");
  const saveModal = document.getElementById("save-modal");
  const deleteButton = document.getElementById("delete-entry");

  function showDayDetails(dateKey) {
    if (!modal) return;
    currentEditDate = dateKey;
    modalDate.textContent = dateKey;
    modalMood.value = localStorage.getItem(`mood-${dateKey}`) || "";
    modalJournal.value = localStorage.getItem(`journal-${dateKey}`) || "";

    modalHabitList.innerHTML = "";
    habits.forEach((habit) => {
      const isChecked = localStorage.getItem(`habit-${dateKey}-${habit}`) === "true";
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = isChecked;
      checkbox.dataset.habit = habit;

      const label = document.createElement("label");
      label.appendChild(checkbox);
      label.appendChild(document.createTextNode(` ${habit}`));
      modalHabitList.appendChild(label);
      modalHabitList.appendChild(document.createElement("br"));
    });

    modal.classList.remove("hidden");
  }

  saveModal?.addEventListener("click", () => {
    if (!currentEditDate) return;
    localStorage.setItem(`mood-${currentEditDate}`, modalMood.value);
    localStorage.setItem(`journal-${currentEditDate}`, modalJournal.value);
    document.querySelectorAll("#modal-habit-list input[type='checkbox']").forEach(cb => {
      const key = `habit-${currentEditDate}-${cb.dataset.habit}`;
      localStorage.setItem(key, cb.checked);
    });
    modal.classList.add("hidden");
    renderCalendar();
  });

  closeModal?.addEventListener("click", () => {
    modal.classList.add("hidden");
  });

  deleteButton?.addEventListener("click", () => {
    if (!currentEditDate || !confirm(`Delete entry for ${currentEditDate}?`)) return;
    localStorage.removeItem(`mood-${currentEditDate}`);
    localStorage.removeItem(`journal-${currentEditDate}`);
    habits.forEach(habit => localStorage.removeItem(`habit-${currentEditDate}-${habit}`));
    modal.classList.add("hidden");
    renderCalendar();
  });

  function renderMoodChart() {
    const ctx = document.getElementById("moodChart")?.getContext("2d");
    if (!ctx) return;
  
    const now = new Date();
    const labels = [];
    const data = [];
  
    const getDateKey = (date) => date.toISOString().split("T")[0];
  
    let startDate;
    if (moodChartRange === "week") {
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 6);
    } else if (moodChartRange === "month") {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    } else if (moodChartRange === "year") {
      startDate = new Date(now.getFullYear(), 0, 1);
    }
  
    const date = new Date(startDate);
    while (date <= now) {
      const key = getDateKey(date);
      const moodEmoji = localStorage.getItem(`mood-${key}`);
      const score = moodScores[moodEmoji];
    
      if (score) {
        labels.push(key);
        data.push(score);
      }
    
      date.setDate(date.getDate() + 1);
    }
      
    if (moodChart) {
      moodChart.data.labels = labels;
      moodChart.data.datasets[0].data = data;
      moodChart.update();
      return;
    }
  
    moodChart = new Chart(ctx, {
      type: "line",
      data: {
        labels,
        datasets: [{
          label: "Mood Level (1 = 😠, 4 = 😊)",
          data,
          fill: false,
          borderColor: "#3b82f6",
          tension: 0.3,
          pointBackgroundColor: "#3b82f6"
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { onClick: null }
        },
        scales: {
          y: {
            beginAtZero: true,
            min: 0,
            max: 5,
            ticks: {
              stepSize: 1,
              callback: (val) => {
                const map = { 1: "😠", 2: "😢", 3: "😐", 4: "😊" };
                return map[val] || "";
              }
            }
          }
        }
      }
    });
  }
  

  // =========================
  // MOOD CALENDAR
  // =========================
  function renderCalendar() {
    const grid = document.getElementById("calendar-grid");
    const monthLabel = document.getElementById("month-label");
    if (!grid || !monthLabel) return;
  
    grid.innerHTML = "";
  
    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay(); // 0 = Sunday, 1 = Monday...
  
    // Set the label like "March 2025"
    monthLabel.textContent = calendarDate.toLocaleString("default", {
      month: "long",
      year: "numeric"
    });
  
    // Add weekday headers
    const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    weekdays.forEach(day => {
      const header = document.createElement("div");
      header.className = "calendar-header";
      header.textContent = day;
      grid.appendChild(header);
    });
  
    // Add empty placeholders before the first actual day
    for (let i = 0; i < firstDay; i++) {
      const placeholder = document.createElement("div");
      placeholder.className = "calendar-day empty";
      grid.appendChild(placeholder);
    }
  
    // Add the actual days
    const now = new Date();
    now.setHours(0, 0, 0, 0);
  
    for (let day = 1; day <= daysInMonth; day++) {
      const dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      const mood = localStorage.getItem(`mood-${dateKey}`) || "🕳️";
      // Assign mood-based class
      if (mood === "😊") {
        dayDiv.classList.add("mood-happy");
      } else if (mood === "😐") {
        dayDiv.classList.add("mood-neutral");
      } else if (mood === "😢") {
        dayDiv.classList.add("mood-sad");
      } else if (mood === "😠") {
        dayDiv.classList.add("mood-angry");
      }
  
      const dayDiv = document.createElement("div");
      dayDiv.className = "calendar-day";
      dayDiv.innerHTML = `
        <div class="calendar-date">${day}</div>
        <div class="calendar-mood">${mood}</div>
      `;
      dayDiv.title = `Mood on ${dateKey}`;
  
      const dayDate = new Date(year, month, day);
      dayDate.setHours(0, 0, 0, 0);
      
      if (dayDate.getTime() === now.getTime()) {
        dayDiv.classList.add("today");
      }
        
      if (dayDate <= now) {
        dayDiv.addEventListener("click", () => showDayDetails(dateKey));
      } else {
        dayDiv.classList.add("disabled-day");
      }
  
      grid.appendChild(dayDiv);
    }
    renderMoodChart();
  }
  

  
  

  // =========================
  // INITIAL LOAD
  // =========================
  updateSummary();
  renderCalendar();
});
