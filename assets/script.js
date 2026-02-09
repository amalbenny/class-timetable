  const days = Object.keys(timetable);
  let currentDayIndex = new Date().getDay() - 1;
  if (currentDayIndex < 0 || currentDayIndex > 5) currentDayIndex = 0;

  function timeToMinutes(t) {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  }

  function renderDay() {
    const day = days[currentDayIndex];
    document.getElementById("dayinfo").innerText = day;

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
  let startX = 0;
  document.addEventListener("touchstart", e => startX = e.touches[0].clientX);
  document.addEventListener("touchend", e => {
    const diff = e.changedTouches[0].clientX - startX;
    if (diff > 80) prevDay();
    if (diff < -80) nextDay();
  });

  /* ================= LIVE TRACKING ================= */
  setInterval(renderDay, 60000);

  /* ================= SERVICE WORKER ================= */
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js");
  }

  renderDay();
