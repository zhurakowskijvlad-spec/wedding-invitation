// Countdown logic for countdown section
document.addEventListener('DOMContentLoaded', function() {
  // Countdown logic for the new countdown section
  const hero = document.getElementById('hero');
  const dateStr = (hero && hero.dataset.date) || '2026-08-31';
  const cdDays = document.getElementById('cd-days');
  const cdHours = document.getElementById('cd-hours');
  const cdMins = document.getElementById('cd-mins');
  const cdSecs = document.getElementById('cd-secs');

  function pad(n){ return String(n).padStart(2, '0'); }
  function updateCountdown(targetDate) {
    const now = new Date();
    const diff = targetDate - now;
    if (diff <= 0) {
      cdDays.textContent = '00';
      cdHours.textContent = '00';
      cdMins.textContent = '00';
      cdSecs.textContent = '00';
      return;
    }
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const mins = Math.floor((diff / (1000 * 60)) % 60);
    const secs = Math.floor((diff / 1000) % 60);
    cdDays.textContent = pad(days);
    cdHours.textContent = pad(hours);
    cdMins.textContent = pad(mins);
    cdSecs.textContent = pad(secs);
  }
  const targetDate = new Date(dateStr + 'T00:00:00');
  updateCountdown(targetDate);
  setInterval(() => updateCountdown(targetDate), 1000);

  // Calendar generator for August 2026
  const calRoot = document.getElementById('calendar-Aug2026');
  if (calRoot) {
    generateCalendar(calRoot, 2026, 7, 15);
  }

  // Scroll reveal: sections fade in when entering viewport
  var animatedSections = document.querySelectorAll('.section-animate');
  if (animatedSections.length > 0) {
    var sectionObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.05 });
    animatedSections.forEach(function(el) { sectionObserver.observe(el); });
    // Safety: make all visible after 3 seconds in case observer fails
    setTimeout(function() {
      animatedSections.forEach(function(el) { el.classList.add('visible'); });
    }, 3000);
  }

  // Autoplay music on first user interaction
  var bgMusic = document.getElementById('bg-music');
  if (bgMusic) {
    var musicStarted = false;
    function startMusic() {
      if (!musicStarted) {
        bgMusic.play().catch(function(){});
        musicStarted = true;
      }
    }
    document.addEventListener('click', startMusic, { once: false });
    document.addEventListener('touchstart', startMusic, { once: false });
    document.addEventListener('scroll', startMusic, { once: false });
  }
});

function generateCalendar(container, year, monthIndex, highlightDay){
  // Month names in Russian
  const monthNames = [
    'Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'
  ];
  // Weekdays starting Monday
  const weekdays = ['Пн','Вт','Ср','Чт','Пт','Сб','Вс'];
  // Build header
  let header = document.createElement('div'); header.className = 'calendar-header'; header.textContent = `${monthNames[monthIndex]} ${year}`;
  const grid = document.createElement('div'); grid.className = 'calendar-grid';
  // Weekday headers
  for (let w of weekdays) {
    const cell = document.createElement('div'); cell.className = 'dow'; cell.textContent = w; grid.appendChild(cell);
  }
  // Days
  const first = new Date(year, monthIndex, 1);
  // calculate offset for Monday-first week; if first.getDay() returns 0 (Sun) -> offset 6 else offset = first.getDay()-1
  let offset = (first.getDay() + 6) % 7; // Monday=0
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  // fill blanks before 1st
  for (let i = 0; i < offset; i++) {
    const empty = document.createElement('div'); empty.className = 'calendar-cell empty'; grid.appendChild(empty);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const cell = document.createElement('div');
    cell.className = 'calendar-cell';
    if (d === highlightDay) {
      cell.classList.add('selected');
      // SVG circle outline with day number inside
      const svgNS = 'http://www.w3.org/2000/svg';
      const svg = document.createElementNS(svgNS, 'svg');
      svg.setAttribute('width','48');
      svg.setAttribute('height','48');
      svg.setAttribute('viewBox','0 0 48 48');
      const circle = document.createElementNS(svgNS, 'circle');
      circle.setAttribute('cx','24');
      circle.setAttribute('cy','24');
      circle.setAttribute('r','18');
      circle.setAttribute('fill','none');
      circle.setAttribute('stroke','var(--gold)');
      circle.setAttribute('stroke-width','3');
      svg.appendChild(circle);
      const t = document.createElementNS(svgNS, 'text');
      t.setAttribute('x','24');
      t.setAttribute('y','28');
      t.setAttribute('text-anchor','middle');
      t.setAttribute('font-family','Arial, sans-serif');
      t.setAttribute('font-size','14');
      t.setAttribute('fill','#333');
      t.textContent = d.toString();
      svg.appendChild(t);
      cell.appendChild(svg);
    } else {
      cell.textContent = d;
    }
    grid.appendChild(cell);
  }
  container.innerHTML = '';
  container.appendChild(header);
  container.appendChild(grid);
}
