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
  

  let currentColor = localStorage.getItem("meflect-color") || "blue";
  let isDarkMode = JSON.parse(localStorage.getItem("meflect-dark")) || false;
  
  function applyTheme(color, darkMode) {
    currentColor = color;
    isDarkMode = darkMode;
  
    const themeClass = `theme-${color}-${darkMode ? "dark" : "light"}`;
    document.body.className = ""; // Remove old theme classes
    document.body.classList.add(themeClass);
  
    // Save preferences
    localStorage.setItem("meflect-color", currentColor);
    localStorage.setItem("meflect-dark", JSON.stringify(isDarkMode));
  
    // Sync toggle
    const darkToggle = document.getElementById("dark-mode-toggle");
    if (darkToggle) {
      darkToggle.checked = isDarkMode;
    }
  
    const themeSelect = document.getElementById("theme-select");
    if (themeSelect) {
      themeSelect.value = currentColor;
    }
  }
  // On load
  applyTheme(currentColor, isDarkMode);

  // Listen for color change
  const themeSelect = document.getElementById("theme-select");
  if (themeSelect) {
    themeSelect.addEventListener("change", () => {
      applyTheme(themeSelect.value, isDarkMode);
    });
  }

  // Listen for dark toggle
  const darkToggle = document.getElementById("dark-mode-toggle");
  if (darkToggle) {
    darkToggle.checked = isDarkMode;
    darkToggle.addEventListener("change", () => {
      applyTheme(currentColor, darkToggle.checked);
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
  const saveJournal = document.getElementById("save-journal-button");

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
    const completed = habits.filter(habit =>
      localStorage.getItem(`habit-${today}-${habit}`) === "true"
    );
  
    document.getElementById("saved-mood").textContent = mood;
    document.getElementById("saved-journal").textContent = journal;
    document.getElementById("saved-habits").textContent =
      completed.length ? completed.join(", ") : "-";
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
    const today = new Date().toISOString().split("T")[0];
  
    habits.forEach((habit, index) => {
      const li = document.createElement("li");
  
      const isChecked = localStorage.getItem(`habit-${today}-${habit}`) === "true";
  
      li.innerHTML = `
        <label>
          <input type="checkbox" data-habit="${habit}" ${isChecked ? "checked" : ""} />
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

    habitList?.addEventListener("change", (event) => {
      if (event.target.type === "checkbox" && event.target.dataset.habit) {
        const habit = event.target.dataset.habit;
        const today = new Date().toISOString().split("T")[0];
        localStorage.setItem(`habit-${today}-${habit}`, event.target.checked);
        updateSummary();
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
    
    // Load habits
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
      updateSummary();
    });
    
    modal.classList.remove("hidden");
  }

  saveModal.addEventListener("click", () => {
    if (!currentEditDate) return;
  
    // Save mood & journal
    localStorage.setItem(`mood-${currentEditDate}`, modalMood.value);
    localStorage.setItem(`journal-${currentEditDate}`, modalJournal.value);
  
    // Save completed habits
    document.querySelectorAll("#modal-habit-list input[type='checkbox']").forEach(cb => {
      const key = `habit-${currentEditDate}-${cb.dataset.habit}`;
      localStorage.setItem(key, cb.checked);
    });
  
    // ✅ Move this check outside the forEach loop
    const todayKey = new Date().toISOString().split("T")[0];
    if (currentEditDate === todayKey) {
      updateSummary();
    }
      
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
      const mood = localStorage.getItem(`mood-${dateKey}`) || "";
    
      const dayDiv = document.createElement("div");
      dayDiv.className = "calendar-day";
      dayDiv.innerHTML = `
        <div class="calendar-date">${day}</div>
        <div class="calendar-mood">${mood}</div>
      `;
      dayDiv.title = `Mood on ${dateKey}`;
    
      const dayDate = new Date(year, month, day);
      dayDate.setHours(0, 0, 0, 0);
      const now = new Date();
      now.setHours(0, 0, 0, 0);
    
      // ✅ Add mood color class
      if (mood === "😊") {
        dayDiv.classList.add("mood-happy");
      } else if (mood === "😐") {
        dayDiv.classList.add("mood-neutral");
      } else if (mood === "😢") {
        dayDiv.classList.add("mood-sad");
      } else if (mood === "😠") {
        dayDiv.classList.add("mood-angry");
      } else {
        dayDiv.classList.add("mood-none");  // 👈 for "🕳️" or no mood saved
      }
          
      // ✅ Highlight today
      if (dayDate.getTime() === now.getTime()) {
        dayDiv.classList.add("today");
      }
    
      // ✅ Enable past-day editing
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
