function loadCategories() {
  const saved = localStorage.getItem('categories');
  return saved ? JSON.parse(saved) : {
    "Deep Work": "#2979FF",
    "Meetings": "#D32F2F",
    "Personal": "#388E3C",
    "Admin": "#FBC02D"
  };
}

function saveCategories(categories) {
  localStorage.setItem('categories', JSON.stringify(categories));
}

function loadSchedules() {
  const saved = localStorage.getItem('schedules');
  return saved ? JSON.parse(saved) : {};
}

function saveSchedules(schedules) {
  localStorage.setItem('schedules', JSON.stringify(schedules));
}
