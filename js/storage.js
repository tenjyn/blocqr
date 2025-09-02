function loadCategories() {
  try {
    return JSON.parse(localStorage.getItem('categories')) || {};
  } catch {
    return {};
  }
}

function saveCategories(categories) {
  localStorage.setItem('categories', JSON.stringify(categories));
}

function loadSchedules() {
  try {
    return JSON.parse(localStorage.getItem('schedules')) || {};
  } catch {
    return {};
  }
}

function saveSchedules(schedules) {
  localStorage.setItem('schedules', JSON.stringify(schedules));
}
