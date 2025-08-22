function loadCategories() {
  try {
    const saved = localStorage.getItem('categories');
    return saved ? JSON.parse(saved) : {
      "Deep Work": "#2979FF",
      "Meetings": "#D32F2F",
      "Personal": "#388E3C",
      "Admin": "#FBC02D"
    };
  } catch {
    return {
      "Deep Work": "#2979FF",
      "Meetings": "#D32F2F",
      "Personal": "#388E3C",
      "Admin": "#FBC02D"
    };
  }
}

function saveCategories(categories) {
  localStorage.setItem('categories', JSON.stringify(categories));
}

function loadSchedules() {
  try {
    const saved = localStorage.getItem('schedules');
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
}

function saveSchedules(schedules) {
  localStorage.setItem('schedules', JSON.stringify(schedules));
}
