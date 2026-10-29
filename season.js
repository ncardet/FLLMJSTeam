/* =====================================================
   BIOGLOW 2026–27 — shared season data & helpers
   Edit event details here; every page reads from this file.
   ===================================================== */

const SEASON = {
  name: 'BIOGLOW™',
  years: '2026–27',
  edition: 'Founders Edition · Challenge (Grades 4–8)',
};

// Dates are local (Pacific). Add venue / time / mapUrl when you have them.
const EVENTS = [
  {
    id: 'qualifier',
    kind: 'Qualifying Event',
    name: 'Qualifying Event',
    date: '2026-11-15',
    time: 'Arrive early — time TBA',
    venue: '',
    mapUrl: '',
    note: 'Our first official event of the season! Three robot game matches (best score counts) plus a judging session.',
  },
  {
    id: 'practice',
    kind: 'Practice Competition',
    name: 'MJS Practice Competition',
    date: '2026-12-03',
    time: 'After school',
    venue: '',
    mapUrl: '',
    note: 'A dress rehearsal for the Regional: three timed matches, scoresheet scoring, and a practice judging session. Treat it exactly like the real thing.',
  },
  {
    id: 'regional',
    kind: 'Regional Event',
    name: 'Regional Event',
    date: '2026-12-13',
    time: 'Arrive early — time TBA',
    venue: '',
    mapUrl: '',
    note: 'Bring everything we learned at the Qualifier. Three matches, a judging session, and our best robot yet.',
  },
];

function eventDate(ev) {
  // Treat the event as starting at 8:00 AM local time on its date
  const [y, m, d] = ev.date.split('-').map(Number);
  return new Date(y, m - 1, d, 8, 0, 0);
}

function daysUntil(ev, now = new Date()) {
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const [y, m, d] = ev.date.split('-').map(Number);
  const target = new Date(y, m - 1, d);
  return Math.round((target - start) / 86400000);
}

function nextEvent(now = new Date()) {
  return EVENTS.find(ev => daysUntil(ev, now) >= 0) || null;
}

function formatEventDate(ev, opts = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }) {
  return eventDate(ev).toLocaleDateString('en-US', opts);
}

function daysLabel(n) {
  if (n === 0) return 'Today!';
  if (n === 1) return 'Tomorrow';
  if (n < 0) return 'Done';
  return n + ' days to go';
}

// Mobile nav toggle (shared)
document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
  if (hamburger && navLinks) hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));
});
