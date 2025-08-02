console.log('main.js loaded');

// --- Module-level variables and functions ---
let timeGrid, reportList, prevDayBtn, nextDayBtn, currentDateSpan;
let dateStrip, calendarContainer, categoryManager, categoryForm, newCategoryName, newCategoryColor, categoryList;

// Load categories from localStorage or use defaults
function loadCategories() {
  try {
    const saved = localStorage.getItem('categories');
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.warn('localStorage unavailable, using default categories');
  }
  return {
    "Deep Work": "#2979FF",
    "Meetings": "#D32F2F",
    "Personal": "#388E3C",
    "Admin": "#FBC02D"
  };
}
function saveCategories() {
  try {
    localStorage.setItem('categories', JSON.stringify(categories));
  } catch (e) {
    console.warn('localStorage unavailable, categories not saved');
  }
}
let categories = loadCategories();
// Track if a block is being edited inline

// Store schedules by date string (YYYY-MM-DD)
let schedules = {};
// Load schedules from localStorage
function loadSchedules() {
  try {
    const saved = localStorage.getItem('schedules');
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.warn('localStorage unavailable, using empty schedules');
  }
  return {};
}
function saveSchedules() {
  try {
    localStorage.setItem('schedules', JSON.stringify(schedules));
  } catch (e) {
    console.warn('localStorage unavailable, schedules not saved');
  }
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
  taskBank.innerHTML = '';
  const heading = document.createElement('h3');
  heading.textContent = 'Task Bank (This Week)';
  taskBank.appendChild(heading);
  if (allTasks.length === 0) {
    const empty = document.createElement('div');
    empty.style.color = '#888';
    empty.textContent = 'No tasks for this week.';
    taskBank.appendChild(empty);
  } else {
    const ul = document.createElement('ul');
    ul.className = 'task-bank-list';
    allTasks.forEach(task => {
      const li = document.createElement('li');
      const timeSpan = document.createElement('span');
      timeSpan.style.fontWeight = 'bold';
      timeSpan.style.color = categories[task.category] || '#fff';
      timeSpan.textContent = task.time;
      const taskSpan = document.createElement('span');
      taskSpan.textContent = ` ${task.task} `;
      const catSpan = document.createElement('span');
      catSpan.style.color = categories[task.category] || '#fff';
      catSpan.textContent = `(${task.category})`;
      const dateSpan = document.createElement('span');
      dateSpan.style.color = '#888';
      dateSpan.style.fontSize = '0.9em';
      dateSpan.textContent = `[${task.date}]`;
      li.appendChild(timeSpan);
      li.appendChild(taskSpan);
      li.appendChild(catSpan);
      li.appendChild(document.createTextNode(' '));
      li.appendChild(dateSpan);
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
  catList.innerHTML = '';
  const catHeader = document.createElement('h4');
  catHeader.textContent = 'Categories';
  catList.appendChild(catHeader);
  const catUl = document.createElement('ul');
  catUl.className = 'category-dashboard-list';
  Object.entries(categories).forEach(([cat, color]) => {
    const li = document.createElement('li');
    const box = document.createElement('span');
    box.style.display = 'inline-block';
    box.style.width = '16px';
    box.style.height = '16px';
    box.style.background = color;
    box.style.borderRadius = '3px';
    box.style.marginRight = '6px';
    box.style.verticalAlign = 'middle';
    const nameSpan = document.createElement('span');
    nameSpan.textContent = cat;
    li.appendChild(box);
    li.appendChild(nameSpan);
    catUl.appendChild(li);
  });
  catList.appendChild(catUl);
}

function renderCategoryList() {
  if (!categoryList) return;
  categoryList.innerHTML = '';
  Object.entries(categories).forEach(([name, color]) => {
    const li = document.createElement('li');
    const box = document.createElement('span');
    box.style.display = 'inline-block';
    box.style.width = '16px';
    box.style.height = '16px';
    box.style.background = color;
    box.style.borderRadius = '3px';
    box.style.marginRight = '6px';
    const nameSpan = document.createElement('span');
    nameSpan.textContent = name;
    li.appendChild(box);
    li.appendChild(nameSpan);
    categoryList.appendChild(li);
  });
}

function generateGrid() {
  if (!timeGrid) return;
  timeGrid.innerHTML = '';
  renderTaskBankAndCategories();
  const gridContainer = document.createElement('div');
  gridContainer.className = 'day-grid-container';

  const weekStart = new Date(currentDate);
  weekStart.setDate(currentDate.getDate() - currentDate.getDay());

  const startHour = 0,
    endHour = 24;

  for (let i = 0; i < 7; i++) {
    const day = new Date(weekStart);
    day.setDate(weekStart.getDate() + i);
    const dateStr = getDateString(day);
    const schedule = schedules[dateStr] || [];

    const dayCol = document.createElement('div');
    dayCol.className = 'day-grid-column';
    if (getDateString(day) === getDateString(currentDate)) dayCol.classList.add('active-day');
    if (getDateString(day) === getDateString(new Date())) dayCol.classList.add('today-day');

    const labelDiv = document.createElement('div');
    labelDiv.className = 'day-label';
    labelDiv.textContent = day.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
    dayCol.appendChild(labelDiv);

    for (let h = startHour; h < endHour; h++) {
      for (let m = 0; m < 60; m += 15) {
        const labelDate = new Date(0, 0, 0, h, m);
        const label = labelDate.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

        const row = document.createElement('div');
        row.className = 'grid-row';
        const gridTimeDiv = document.createElement('div');
        gridTimeDiv.className = 'grid-time';
        gridTimeDiv.textContent = label;
        const gridBlockDiv = document.createElement('div');
        gridBlockDiv.className = 'grid-block';

        const found = schedule.find(t => normalizeTimeString(t.time) === normalizeTimeString(label));
        if (found) {
          gridBlockDiv.classList.add('task');
          gridBlockDiv.style.borderColor = categories[found.category] || '#2979FF';
          gridBlockDiv.style.color = categories[found.category] || '#fff';
          gridBlockDiv.textContent = found.task;
        } else {
          gridBlockDiv.classList.add('add-task');
          gridBlockDiv.textContent = '+';
        }

        row.appendChild(gridTimeDiv);
        row.appendChild(gridBlockDiv);
        dayCol.appendChild(row);
      }
    }

    gridContainer.appendChild(dayCol);
  }

  timeGrid.appendChild(gridContainer);

  if (reportList) {
    reportList.innerHTML = '';
    const schedule = schedules[getDateString(currentDate)] || [];
    if (schedule.length === 0) {
      const li = document.createElement('li');
      li.textContent = 'No tasks scheduled.';
      reportList.appendChild(li);
    } else {
      schedule.forEach(task => {
        const li = document.createElement('li');
        const timeSpan = document.createElement('span');
        timeSpan.style.fontWeight = 'bold';
        timeSpan.style.color = categories[task.category] || '#fff';
        timeSpan.textContent = task.time;
        const taskSpan = document.createElement('span');
        taskSpan.textContent = `: ${task.task} `;
        const catSpan = document.createElement('span');
        catSpan.style.color = categories[task.category] || '#fff';
        catSpan.textContent = `(${task.category})`;
        li.appendChild(timeSpan);
        li.appendChild(taskSpan);
        li.appendChild(catSpan);
        reportList.appendChild(li);
      });
    }
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

  renderCategoryList();
  if (categoryForm) {
    categoryForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = newCategoryName.value.trim();
      const color = newCategoryColor.value || '#2979FF';
      if (!name) return;
      categories[name] = color;
      saveCategories();
      newCategoryName.value = '';
      renderCategoryList();
      renderTaskBankAndCategories();
      generateGrid();
    });
  }

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
