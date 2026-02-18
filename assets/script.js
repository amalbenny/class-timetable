  const days = Object.keys(timetable);
  let currentDayIndex = new Date().getDay() - 1;
  if (currentDayIndex < 0 || currentDayIndex >= days.length) currentDayIndex = 0;

  function timeToMinutes(t) {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  }

  function renderDay() {
    const day = days[currentDayIndex];
    document.getElementById("dayinfo").innerText = day;

    // Update variable now with live tracker
    const now = new Date();
    const nowMin = now.getHours() * 60 + now.getMinutes();

    const container = document.getElementById("timetable");
    container.innerHTML = "";

    timetable[day].forEach(p => {
      const active = now.getDay() - 1 === currentDayIndex &&
        nowMin >= timeToMinutes(p.start) && nowMin <= timeToMinutes(p.end);

      const div = document.createElement("div");
      div.className = `period ${active ? "active" : ""}`;

      div.innerHTML = `
        <div class="info">
          <div class="time">${p.start} – ${p.end}</div>
          <div class="subject">${p.subject}</div>
        </div>
        <div class="type ${p.type}">${p.type.toUpperCase()}</div>
      `;

      container.appendChild(div);
    });
  }

  function prevDay() { currentDayIndex = (currentDayIndex - 1 + days.length) % days.length; renderDay(); }
  function nextDay() { currentDayIndex = (currentDayIndex + 1) % days.length; renderDay(); }

  /* ================= GESTURE NAVIGATION ================= */
  let startX = 0, startY = 0;

  document.addEventListener("touchstart", e => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  });

  document.addEventListener("touchend", e => {
    const diffX = e.changedTouches[0].clientX - startX;
    const diffY = e.changedTouches[0].clientY - startY;
    
    // Only trigger swipe if horizontal movement is dominant
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 80) {
      if (diffX > 0) prevDay();
      else nextDay();
    }
  });

  /* ================= LIVE TRACKING ================= */
  setInterval(renderDay, 60000);

  renderDay();
  // 1. Find the first element with the 'active' class and scroll it into view
  const activeElement = document.querySelector('.period.active');
  if (activeElement) {
    activeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
