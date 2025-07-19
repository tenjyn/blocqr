
const timeGrid = document.getElementById('timeGrid');
const reportList = document.getElementById('reportList');

const categories = {
  "Deep Work": "#2979FF",
  "Meetings": "#D32F2F",
  "Personal": "#388E3C",
  "Admin": "#FBC02D"
};

const schedule = [
  { time: "6:00 AM", task: "Write blog", category: "Deep Work" },
  { time: "7:00 AM", task: "Client call", category: "Meetings" },
  { time: "1:30 PM", task: "Gym", category: "Personal" },
  { time: "3:00 PM", task: "Email cleanup", category: "Admin" },
];

function generateGrid() {
  const startHour = 5;
  const endHour = 24;

  for (let h = startHour; h < endHour; h++) {
    for (let m = 0; m < 60; m += 30) {
      const hour = h % 12 === 0 ? 12 : h % 12;
      const suffix = h < 12 ? "AM" : "PM";
      const minute = m === 0 ? "00" : m;
      const label = `${hour}:${minute} ${suffix}`;

      const timeDiv = document.createElement('div');
      timeDiv.className = 'grid-time';
      timeDiv.textContent = label;

      const blockDiv = document.createElement('div');
      blockDiv.className = 'grid-block';
      const task = schedule.find(s => s.time === label);
      if (task) {
        blockDiv.textContent = task.task;
        blockDiv.classList.add('task');
        blockDiv.style.backgroundColor = categories[task.category] || '#555';
      }

      timeGrid.appendChild(timeDiv);
      timeGrid.appendChild(blockDiv);
    }
  }

  generateReport();
}

function generateReport() {
  const report = {};
  for (const task of schedule) {
    if (!report[task.category]) report[task.category] = 0;
    report[task.category] += 0.5; // each block = 0.5 hour
  }

  for (const category in report) {
    const li = document.createElement('li');
    li.textContent = `${category}: ${report[category]}h`;
    li.style.color = categories[category] || '#aaa';
    reportList.appendChild(li);
  }
}

generateGrid();
