console.log('main.js loaded');

// --- Module-level variables and functions ---
let timeGrid, reportList, prevDayBtn, nextDayBtn, currentDateSpan;
let dateStrip, calendarContainer, categoryManager, categoryForm, newCategoryName, newCategoryColor, categoryList;

// Load categories from localStorage or use defaults
function loadCategories() {
  const saved = localStorage.getItem('categories');
  if (saved) return JSON.parse(saved);
  return {
    "Deep Work": "#2979FF",
    "Meetings": "#D32F2F",
    "Personal": "#388E3C",
    "Admin": "#FBC02D"
  };
}
function saveCategories() {
  localStorage.setItem('categories', JSON.stringify(categories));
}
let categories = loadCategories();
// Track if a block is being edited inline
let isEditingBlock = false;

// Store schedules by date string (YYYY-MM-DD)
let schedules = {};
// Load schedules from localStorage
function loadSchedules() {
  const saved = localStorage.getItem('schedules');
  if (saved) return JSON.parse(saved);
  return {};
}
function saveSchedules() {
  localStorage.setItem('schedules', JSON.stringify(schedules));
}
schedules = loadSchedules();

// Helper to get date string
function getDateString(date) {
  return date.toISOString().split('T')[0];
}

// Set initial date to today
let currentDate = new Date();

// Seed today's schedule for demo
const todayStr = getDateString(currentDate);
schedules[todayStr] = [
  { time: "6:00 AM", task: "Write blog", category: "Deep Work" },
  { time: "7:00 AM", task: "Client call", category: "Meetings" },
  { time: "1:30 PM", task: "Gym", category: "Personal" },
  { time: "3:00 PM", task: "Email cleanup", category: "Admin" },
];



// --- Task Bank and Category Dashboard ---
function renderTaskBankAndCategories() {
  // Task Bank: show all tasks for the week
  let taskBank = document.getElementById('taskBank');
  if (!taskBank) {
    taskBank = document.createElement('div');
    taskBank.id = 'taskBank';
    taskBank.className = 'task-bank';
    timeGrid.parentNode.insertBefore(taskBank, timeGrid);
  }
  // Gather all tasks for the week
  const weekStart = new Date(currentDate);
  weekStart.setDate(currentDate.getDate() - currentDate.getDay());
  const days = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    days.push(d);
  }
  let allTasks = [];
  days.forEach(day => {
    const dateStr = getDateString(day);
    let schedule = schedules[dateStr] || [];
    allTasks = allTasks.concat(schedule.map(t => ({...t, date: dateStr})));
  });
  // Render task bank
  taskBank.innerHTML = '<h3>Task Bank (This Week)</h3>';
  if (allTasks.length === 0) {
    taskBank.innerHTML += '<div style="color:#888">No tasks for this week.</div>';
  } else {
    const ul = document.createElement('ul');
    ul.className = 'task-bank-list';
    allTasks.forEach(task => {
      const li = document.createElement('li');
      li.innerHTML = `<span style='font-weight:bold;color:${categories[task.category] || '#fff'}'>${task.time}</span> <span>${task.task}</span> <span style='color:${categories[task.category] || '#fff'}'>(${task.category})</span> <span style='color:#888;font-size:0.9em'>[${task.date}]</span>`;
      ul.appendChild(li);
    });
    taskBank.appendChild(ul);
  }
  // Category List
  let catList = document.getElementById('categoryDashboard');
  if (!catList) {
    catList = document.createElement('div');
    catList.id = 'categoryDashboard';
    catList.className = 'category-dashboard';
    taskBank.appendChild(catList);
  }
  catList.innerHTML = '<h4>Categories</h4>';
  const ul = document.createElement('ul');
  ul.className = 'category-dashboard-list';
  Object.entries(categories).forEach(([cat, color]) => {
    const li = document.createElement('li');
    li.innerHTML = `<span style='display:inline-block;width:16px;height:16px;background:${color};border-radius:3px;margin-right:6px;vertical-align:middle;'></span> <span>${cat}</span>`;
    ul.appendChild(li);
  });
  catList.appendChild(ul);
}

function generateGrid() {
  if (!timeGrid) return;
  timeGrid.innerHTML = '';
  renderTaskBankAndCategories();
  const gridContainer = document.createElement('div');
  gridContainer.className = 'day-grid-container';

  // Calculate start of week (Sunday)
  const weekStart = new Date(currentDate);
  weekStart.setDate(currentDate.getDate() - currentDate.getDay());
  const days = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    days.push(d);
  }

  const startHour = 0, endHour = 24;

  // For each day in the week, create a column
  days.forEach((day, dayIdx) => {
    const dateStr = getDateString(day);
        // ...existing code...
            const availableMinutes = endMinutes - blockStartMinutes;
            // Always allow at least 1 slot
            resizeHandle._maxSlots = Math.max(1, Math.floor(availableMinutes / 15));

            mouseMoveHandler = function(e) {
              if (!isResizing) return;
              // Only allow downward expansion (bottom edge)
              const deltaY = Math.max(0, e.clientY - startY); // Prevent shrinking above start
              let newHeight = Math.max(24, startHeight + deltaY);
              // Snap to 24px increments (15min slots)
              let slots = Math.round(newHeight / 24);
              // Limit to available slots to EOD
              slots = Math.max(1, Math.min(slots, resizeHandle._maxSlots));
              newHeight = slots * 24;
              gridBlockDiv.style.height = newHeight + 'px';
            };
            mouseUpHandler = function(e) {
              if (!isResizing) return;
              isResizing = false;
              gridBlockDiv.classList.remove('resizing');
              document.body.style.userSelect = '';
              let newHeight = parseInt(gridBlockDiv.style.height) || 24;
              let slots = Math.max(1, Math.round(newHeight / 24));
              slots = Math.max(1, Math.min(slots, resizeHandle._maxSlots));
              foundTask.merge = slots;
              schedules[dateStr] = schedule;
              saveSchedules();
              generateGrid();
              document.removeEventListener('mousemove', mouseMoveHandler);
              document.removeEventListener('mouseup', mouseUpHandler);
            };
            document.addEventListener('mousemove', mouseMoveHandler);
            document.addEventListener('mouseup', mouseUpHandler);
          });
          // --- End resize handle ---
          // Edit with dropdown
          gridBlockDiv.addEventListener('click', (e) => {
            e.stopPropagation();
            if (isEditingBlock) return;
            isEditingBlock = true;
            // Save original values
            const origTask = foundTask.task;
            const origCategory = foundTask.category;
            // Create select for category
            const select = document.createElement('select');
            Object.entries(categories).forEach(([cat, color]) => {
              const opt = document.createElement('option');
              opt.value = cat;
              opt.textContent = cat;
              opt.style.background = color;
              if (cat === origCategory) opt.selected = true;
              select.appendChild(opt);
            });
            select.className = 'block-category-dropdown';
            select.style.fontSize = '12px';
            select.style.marginRight = '4px';
            select.style.height = '22px';
            // Create input for task name
            const input = document.createElement('input');
            input.type = 'text';
            input.value = origTask;
            input.style.width = '60%';
            input.style.fontSize = '12px';
            input.style.marginRight = '4px';
            input.style.height = '22px';
            // Save button
            const saveBtn = document.createElement('button');
            saveBtn.textContent = '✔';
            saveBtn.style.fontSize = '13px';
            saveBtn.style.padding = '0 4px';
            saveBtn.style.marginRight = '2px';
            saveBtn.style.height = '22px';
            // Cancel button
            const cancelBtn = document.createElement('button');
            cancelBtn.textContent = '✕';
            cancelBtn.style.fontSize = '13px';
            cancelBtn.style.padding = '0 4px';
            cancelBtn.style.height = '22px';
            // Replace content
            gridBlockDiv.innerHTML = '';
            gridBlockDiv.appendChild(select);
            gridBlockDiv.appendChild(input);
            gridBlockDiv.appendChild(saveBtn);
            gridBlockDiv.appendChild(cancelBtn);
            input.focus();

            function finishEdit() {
              isEditingBlock = false;
              generateGrid();
            }
            function saveEdit() {
              const newTask = input.value.trim();
              const newCat = select.value;
              if (!newTask || !categories[newCat]) {
                finishEdit();
                return;
              }
              foundTask.task = newTask;
              foundTask.category = newCat;
              schedules[dateStr] = schedule;
              saveSchedules();
              finishEdit();
            }
            function cancelEdit() {
              finishEdit();
            }
            saveBtn.addEventListener('click', (ev) => {
              ev.preventDefault();
              saveEdit();
            });
            cancelBtn.addEventListener('click', (ev) => {
              ev.preventDefault();
              cancelEdit();
            });
            input.addEventListener('keydown', (ev) => {
              if (ev.key === 'Enter') saveEdit();
              if (ev.key === 'Escape') cancelEdit();
            });
            select.addEventListener('keydown', (ev) => {
              if (ev.key === 'Enter') saveEdit();
              if (ev.key === 'Escape') cancelEdit();
            });
            // Only finish edit if neither input nor select is focused
            function blurHandler() {
              setTimeout(() => {
                if (document.activeElement !== input && document.activeElement !== select && document.activeElement !== saveBtn && document.activeElement !== cancelBtn) {
                  cancelEdit();
                }
              }, 10);
            }
            input.addEventListener('blur', blurHandler);
            select.addEventListener('blur', blurHandler);
          });
        } else {
          gridBlockDiv.textContent = '+';
          gridBlockDiv.classList.add('add-task');
          // Drag-and-drop target
          gridBlockDiv.addEventListener('dragover', (e) => {
            e.preventDefault();
            gridBlockDiv.classList.add('drag-over');
          });
          gridBlockDiv.addEventListener('dragleave', () => {
            gridBlockDiv.classList.remove('drag-over');
          });
          gridBlockDiv.addEventListener('drop', (e) => {
            e.preventDefault();
            gridBlockDiv.classList.remove('drag-over');
            const data = e.dataTransfer.getData('text/plain');
            if (!data) return;
            let parsed;
            try { parsed = JSON.parse(data); } catch { return; }
            if (!parsed || !parsed.date || !parsed.time) return;
            // Remove from old schedule
            let oldSchedule = schedules[parsed.date] || [];
            const idx = oldSchedule.findIndex(t => t.time === parsed.time && t.task === parsed.task && t.category === parsed.category);
            if (idx !== -1) {
              const [movedTask] = oldSchedule.splice(idx, 1);
              // Update time and date
              movedTask.time = label;
              // Add to new schedule
              let newSchedule = schedules[dateStr] || [];
              newSchedule.push(movedTask);
              schedules[parsed.date] = oldSchedule;
              schedules[dateStr] = newSchedule;
              saveSchedules();
              generateGrid();
            }
          });
          // Add with dropdown
          gridBlockDiv.addEventListener('click', (e) => {
            e.stopPropagation();
            if (isEditingBlock) return;
            isEditingBlock = true;
            // Create select for category
            const select = document.createElement('select');
            Object.entries(categories).forEach(([cat, color]) => {
              const opt = document.createElement('option');
              opt.value = cat;
              opt.textContent = cat;
              opt.style.background = color;
              select.appendChild(opt);
            });
            select.className = 'block-category-dropdown';
            select.style.fontSize = '12px';
            select.style.marginRight = '4px';
            select.style.height = '22px';
            // Create input for task name
            const input = document.createElement('input');
            input.type = 'text';
            input.placeholder = 'Task name';
            input.style.width = '60%';
            input.style.fontSize = '12px';
            input.style.marginRight = '4px';
            input.style.height = '22px';
            // Save button
            const saveBtn = document.createElement('button');
            saveBtn.textContent = '✔';
            saveBtn.style.fontSize = '13px';
            saveBtn.style.padding = '0 4px';
            saveBtn.style.marginRight = '2px';
            saveBtn.style.height = '22px';
            // Cancel button
            const cancelBtn = document.createElement('button');
            cancelBtn.textContent = '✕';
            cancelBtn.style.fontSize = '13px';
            cancelBtn.style.padding = '0 4px';
            cancelBtn.style.height = '22px';
            // Replace content
            gridBlockDiv.innerHTML = '';
            gridBlockDiv.appendChild(select);
            gridBlockDiv.appendChild(input);
            gridBlockDiv.appendChild(saveBtn);
            gridBlockDiv.appendChild(cancelBtn);
            input.focus();

            function finishEdit() {
              isEditingBlock = false;
              generateGrid();
            }
            function saveEdit() {
              const newTask = input.value.trim();
              const newCat = select.value;
              if (!newTask || !categories[newCat]) {
                finishEdit();
                return;
              }
              // Prevent duplicate tasks at same time
              let newSchedule = schedules[dateStr] || [];
              if (newSchedule.some(s => normalizeTimeString(s.time) === normalizeTimeString(label))) {
                alert('A task already exists at this time.');
                finishEdit();
                return;
              }
              newSchedule.push({ time: label, task: newTask, category: newCat });
              schedules[dateStr] = newSchedule;
              saveSchedules();
              finishEdit();
            }
            function cancelEdit() {
              finishEdit();
            }
            saveBtn.addEventListener('click', (ev) => {
              ev.preventDefault();
              saveEdit();
            });
            cancelBtn.addEventListener('click', (ev) => {
              ev.preventDefault();
              cancelEdit();
            });
            input.addEventListener('keydown', (ev) => {
              if (ev.key === 'Enter') saveEdit();
              if (ev.key === 'Escape') cancelEdit();
            });
            select.addEventListener('keydown', (ev) => {
              if (ev.key === 'Enter') saveEdit();
              if (ev.key === 'Escape') cancelEdit();
            });
            // Only finish edit if neither input nor select is focused
            function blurHandler() {
              setTimeout(() => {
                if (document.activeElement !== input && document.activeElement !== select && document.activeElement !== saveBtn && document.activeElement !== cancelBtn) {
                  cancelEdit();
                }
              }, 10);
            }
            input.addEventListener('blur', blurHandler);
            select.addEventListener('blur', blurHandler);
          });
        }
        const row = document.createElement('div');
        row.className = 'grid-row';
        row.style.display = 'flex';
        row.style.flexDirection = 'row';
        row.style.alignItems = 'center';
        row.style.width = '100%';
        row.style.height = '24px';
        row.appendChild(gridTimeDiv);
        row.appendChild(gridBlockDiv);
        dayCol.appendChild(row);
      }
    }
    gridContainer.appendChild(dayCol);
  });
  timeGrid.appendChild(gridContainer);
  // Add report section
  if (reportList) {
    reportList.innerHTML = '<h3 style="margin:0 0 8px 0;font-size:1.1em;">Today\'s Tasks</h3>';
    if (schedule.length === 0) {
      const li = document.createElement('li');
      li.textContent = 'No tasks scheduled.';
      reportList.appendChild(li);
    } else {
      schedule.forEach(task => {
        const li = document.createElement('li');
        li.innerHTML = `<span style='font-weight:bold;color:${categories[task.category] || '#fff'}'>${task.time}</span>: <span>${task.task}</span> <span style='color:${categories[task.category] || '#fff'}'>(${task.category})</span>`;
        reportList.appendChild(li);
      });
    }
    reportList.style.display = 'block';
    reportList.style.margin = '32px 0 0 0';
    reportList.style.maxWidth = '320px';
  }
}

function renderCalendar() {
  if (!calendarContainer) return;
  calendarContainer.innerHTML = '';
  const cal = document.createElement('div');
  cal.className = 'calendar';
  const monthDate = new Date(currentDate);
  monthDate.setDate(1);
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const todayStr = getDateString(new Date());
  // Header (interactive)
  const header = document.createElement('div');
  header.className = 'calendar-header';
  header.textContent = monthDate.toLocaleString(undefined, { month: 'long', year: 'numeric' });
  header.style.cursor = 'pointer';
  header.title = 'Click to jump to a different month';
  header.addEventListener('click', () => {
    const currentYear = monthDate.getFullYear();
    const currentMonth = monthDate.getMonth();
    let year = prompt('Enter year:', currentYear);
    if (year === null) return;
    year = parseInt(year);
    if (isNaN(year) || year < 1900 || year > 2100) {
      alert('Invalid year.');
      return;
    }
    let month = prompt('Enter month (1-12):', (currentMonth + 1));
    if (month === null) return;
    month = parseInt(month) - 1;
    if (isNaN(month) || month < 0 || month > 11) {
      alert('Invalid month.');
      return;
    }
    currentDate = new Date(year, month, 1);
    generateGrid();
    renderCalendar();
    renderDateStrip();
  });
  cal.appendChild(header);
  // Days of week
  const daysRow = document.createElement('div');
  daysRow.className = 'calendar-days-row';
  ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].forEach(d => {
    const day = document.createElement('span');
    day.className = 'calendar-day-label';
    day.textContent = d;
    daysRow.appendChild(day);
  });
  cal.appendChild(daysRow);
  // Dates
  const grid = document.createElement('div');
  grid.className = 'calendar-grid';
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month+1, 0).getDate();
  for (let i = 0; i < firstDay; i++) {
    const empty = document.createElement('span');
    empty.className = 'calendar-cell empty';
    grid.appendChild(empty);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const cell = document.createElement('span');
    cell.className = 'calendar-cell';
    const cellDate = new Date(year, month, d);
    cell.textContent = d;
    if (getDateString(cellDate) === getDateString(currentDate)) {
      cell.classList.add('active');
    }
    if (getDateString(cellDate) === todayStr) {
      cell.classList.add('today');
    }
    cell.addEventListener('click', () => {
      currentDate = new Date(cellDate);
      generateGrid();
      renderCalendar();
      renderDateStrip();
    });
    grid.appendChild(cell);
  }
  cal.appendChild(grid);
  calendarContainer.appendChild(cal);
}

function renderDateStrip() {
  if (!dateStrip) return;
  dateStrip.innerHTML = '';
  const days = [];
  const start = new Date(currentDate);
  start.setDate(currentDate.getDate() - start.getDay());
  for (let i = 0; i < 28; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    days.push(d);
  }
  days.forEach((d, idx) => {
    const btn = document.createElement('button');
    btn.className = 'date-btn';
    btn.textContent = d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
    if (d.getDay() === 0 && idx !== 0) {
      btn.classList.add('sunday-separator');
    }
    if (getDateString(d) === getDateString(currentDate)) {
      btn.classList.add('active');
    }
    if (getDateString(d) === getDateString(new Date())) {
      btn.classList.add('today');
    }
    btn.addEventListener('click', () => {
      currentDate = new Date(d);
      generateGrid();
      renderCalendar();
      renderDateStrip();
    });
    dateStrip.appendChild(btn);
  });
  dateStrip.style.display = 'flex';
  dateStrip.style.overflowX = 'auto';
  dateStrip.style.gap = '8px';
  dateStrip.style.padding = '10px 0 10px 0';
  dateStrip.style.width = '100%';
  dateStrip.style.minWidth = '1200px';
  dateStrip.style.justifyContent = 'flex-start';
}

function normalizeTimeString(str) {
  // Normalize time string to 'h:mm AM/PM' format
  const m = str.match(/(\d+):(\d+) ?([AP]M)/i);
  if (!m) return str;
  let h = parseInt(m[1]);
  let min = parseInt(m[2]);
  let sfx = m[3].toUpperCase();
  if (h === 12) h = 0;
  let total = h * 60 + min + (sfx === 'PM' ? 12 * 60 : 0);
  let hour = Math.floor(total / 60) % 24;
  min = total % 60;
  sfx = hour < 12 ? 'AM' : 'PM';
  let displayHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${displayHour}:${String(min).padStart(2, '0')} ${sfx}`;
}

// --- DOMContentLoaded: only initialization code ---
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOMContentLoaded fired');
  const requiredIds = ['timeGrid','reportList','prevDay','nextDay','currentDate','dateStrip','calendarContainer','categoryManager','categoryForm','newCategoryName','newCategoryColor','categoryList'];
  requiredIds.forEach(id => {
    const el = document.getElementById(id);
    if (!el) {
      console.error('Missing DOM element:', id);
    }
  });

  timeGrid = document.getElementById('timeGrid');
  reportList = document.getElementById('reportList');
  prevDayBtn = document.getElementById('prevDay');
  nextDayBtn = document.getElementById('nextDay');
  currentDateSpan = document.getElementById('currentDate');
  dateStrip = document.getElementById('dateStrip');
  calendarContainer = document.getElementById('calendarContainer');
  categoryManager = document.getElementById('categoryManager');
  categoryForm = document.getElementById('categoryForm');
  newCategoryName = document.getElementById('newCategoryName');
  newCategoryColor = document.getElementById('newCategoryColor');
  categoryList = document.getElementById('categoryList');

  generateGrid();
  renderCalendar();
  renderDateStrip();

  // Navigation for previous/next day
  if (prevDayBtn) {
    prevDayBtn.addEventListener('click', () => {
      currentDate.setDate(currentDate.getDate() - 1);
      generateGrid();
      renderCalendar();
      renderDateStrip();
    });
  }
  if (nextDayBtn) {
    nextDayBtn.addEventListener('click', () => {
      currentDate.setDate(currentDate.getDate() + 1);
      generateGrid();
      renderCalendar();
      renderDateStrip();
    });
  }
});

// All code after the event listener has been removed to restore correct structure.
