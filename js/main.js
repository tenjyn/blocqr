let timeGrid, reportList, prevDayBtn, nextDayBtn, currentDateSpan;
let dateStrip, categoryForm, newCategoryName, newCategoryColor, categoryList;

let categories = loadCategories();
let schedules = loadSchedules();

function getDateString(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

let currentDate = new Date();

function renderCategories() {
  categoryList.innerHTML = '';
  Object.entries(categories).forEach(([name, color]) => {
    const li = document.createElement('li');
    li.textContent = name;
    li.style.color = color;
    categoryList.appendChild(li);
  });
}

function renderReport(schedule) {
  reportList.innerHTML = '';
  schedule.forEach(t => {
    const li = document.createElement('li');
    li.style.color = categories[t.category] || '#fff';
    li.textContent = `${t.time}: ${t.task} (${t.category})`;
    reportList.appendChild(li);
  });
}

function generateGrid() {
  const dateStr = getDateString(currentDate);
  const schedule = schedules[dateStr] || [];
  currentDateSpan.textContent = currentDate.toDateString();
  timeGrid.innerHTML = '';
  for (let h = 6; h < 22; h++) {
    const time = `${String(h).padStart(2, '0')}:00`;
    const row = document.createElement('div');
    row.className = 'grid-row';
    const timeCell = document.createElement('div');
    timeCell.className = 'time-cell';
    timeCell.textContent = time;
    const block = document.createElement('div');
    block.className = 'grid-block';
    const task = schedule.find(t => t.time === time);
    if (task) {
      block.textContent = task.task;
      block.style.background = categories[task.category] || '#999';
      block.addEventListener('click', () => {
        const name = prompt('Edit task or leave empty to delete', task.task);
        if (name === null) return; // cancel
        const trimmed = name.trim();
        if (trimmed) {
          task.task = trimmed;
        } else {
          const idx = schedule.indexOf(task);
          if (idx !== -1) schedule.splice(idx,1);
        }
        schedules[dateStr] = schedule;
        saveSchedules(schedules);
        generateGrid();
      });
    } else {
      block.textContent = '+';
      block.addEventListener('click', () => {
        const name = prompt('Task name');
        if (name === null) return;
        const trimmed = name.trim();
        if (!trimmed) return;
        const cat = prompt('Category', Object.keys(categories)[0] || '');
        if (cat === null) return;
        schedule.push({time, task:trimmed, category:cat});
        schedules[dateStr] = schedule;
        saveSchedules(schedules);
        generateGrid();
      });
    }
    row.appendChild(timeCell);
    row.appendChild(block);
    timeGrid.appendChild(row);
  }
  renderReport(schedule);
}

function renderDateStrip() {
  dateStrip.innerHTML = '';
  for (let i = -3; i <= 3; i++) {
    const d = new Date(currentDate);
    d.setDate(currentDate.getDate() + i);
    const btn = document.createElement('button');
    btn.textContent = d.toLocaleDateString(undefined, {month:'short', day:'numeric'});
    if (getDateString(d) === getDateString(currentDate)) btn.classList.add('active');
    btn.addEventListener('click', () => {
      currentDate = d;
      generateGrid();
      renderDateStrip();
    });
    dateStrip.appendChild(btn);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  timeGrid = document.getElementById('timeGrid');
  reportList = document.getElementById('reportList');
  prevDayBtn = document.getElementById('prevDay');
  nextDayBtn = document.getElementById('nextDay');
  currentDateSpan = document.getElementById('currentDate');
  dateStrip = document.getElementById('dateStrip');
  categoryForm = document.getElementById('categoryForm');
  newCategoryName = document.getElementById('newCategoryName');
  newCategoryColor = document.getElementById('newCategoryColor');
  categoryList = document.getElementById('categoryList');

  categoryForm.addEventListener('submit', e => {
    e.preventDefault();
    const name = newCategoryName.value.trim();
    if (!name) return;
    categories[name] = newCategoryColor.value;
    saveCategories(categories);
    renderCategories();
    categoryForm.reset();
  });

  prevDayBtn.addEventListener('click', () => {
    currentDate.setDate(currentDate.getDate() - 1);
    generateGrid();
    renderDateStrip();
  });
  nextDayBtn.addEventListener('click', () => {
    currentDate.setDate(currentDate.getDate() + 1);
    generateGrid();
    renderDateStrip();
  });

  renderCategories();
  generateGrid();
  renderDateStrip();
});
