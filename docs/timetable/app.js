/**
 * V-Semester Personalized Timetable
 * ECE/EEC Department — Academic Year 2026-27 (Odd Semester)
 * Source: ECE_SLOTS_2026_27_ODD.xlsx
 */

/* ================================================================
   TIMETABLE DATA
   Types:
     'common'  — all students attend (no ECE/EEC marking)
     'ECE'     — ECE-only course
     'EEC'     — EEC-only course
     'spec'    — specialization elective (VLSI | DataAnalysis | Embedded)
     'lunch'   — lunch break
     'empty'   — free slot
   Batches in cell: B1 or B2 (or 'all' for full-class)
   ================================================================ */

const TIME_SLOTS = [
  '0820 – 0920',
  '0925 – 1025',
  '1030 – 1130',
  '1135 – 1235',
  '1240 – 1340',
  '1345 – 1445',
  '1450 – 1550',
  '1555 – 1655',
];

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

/**
 * Raw timetable entries.
 * Each entry:
 *   slot:    index into TIME_SLOTS (0–7)
 *   day:     index into DAYS (0=Mon, 4=Fri)
 *   code:    course code
 *   name:    course name (short)
 *   teacher: faculty name
 *   room:    room number
 *   type:    'common' | 'ECE' | 'EEC' | 'spec' | 'lunch' | 'lab-common' | 'lab-ECE' | 'lab-EEC'
 *   spec:    (only for type='spec') 'VLSI' | 'DataAnalysis' | 'Embedded'
 *   batch:   'B1' | 'B2' | 'all'  (which batch this row applies to)
 *   tag:     optional display tag override
 */
const RAW_ENTRIES = [
  // ─────────────────────── MONDAY ───────────────────────
  // 0820-0920: empty for Mon
  // 0925-1025: EECE460L Embedded — Batch B1 (EEC+ECE)
  { slot: 1, day: 0, code: 'EECE460L', name: 'Embedded Systems HW-SW Co-Design', teacher: 'Dr. Ajay', room: '009-N-CA', type: 'spec', spec: 'Embedded', batch: 'all' },
  // 1030-1130: Probability Theory — All (common)
  { slot: 2, day: 0, code: 'EECE210L', name: 'Probability Theory & Stochastic Processes', teacher: 'Dr. Rohan', room: '009-N-CA', type: 'common', batch: 'all' },
  // 1135-1235 & 1240-1340: EECE311L — 303-N-LA — LAB (B1, two consecutive slots)
  { slot: 3, day: 0, code: 'EECE311L', name: 'Analog & Digital Communications', teacher: 'Prof. Usman', room: '303-N-LA', type: 'common', tag: 'Lab', batch: 'B1' },
  { slot: 4, day: 0, code: 'EECE311L', name: 'Analog & Digital Communications', teacher: 'Prof. Usman', room: '303-N-LA', type: 'common', tag: 'Lab', batch: 'B1' },
  // 1345-1445: LUNCH (Mon)
  { slot: 5, day: 0, code: '', name: 'LUNCH', teacher: '', room: '', type: 'lunch', batch: 'all' },

  // ─────────────────────── TUESDAY ───────────────────────
  // 0820-0920: EECE210L Probability — CA|T batch (Common/Tutorial)
  { slot: 0, day: 1, code: 'EECE210L', name: 'Probability Theory & Stochastic Processes', teacher: 'Dr. Rohan', room: '009-N-CA', type: 'common', tag: 'Tutorial', batch: 'all' },
  // 0925-1025 & 1030-1130: EECE311L Analog — 303-N-LA — LAB (B2, two consecutive slots)
  { slot: 1, day: 1, code: 'EECE311L', name: 'Analog & Digital Communications', teacher: 'Prof. Usman', room: '303-N-LA', type: 'common', tag: 'Lab', batch: 'B2' },
  { slot: 2, day: 1, code: 'EECE311L', name: 'Analog & Digital Communications', teacher: 'Prof. Usman', room: '303-N-LA', type: 'common', tag: 'Lab', batch: 'B2' },
  // 1135-1235: EHSS301L Project Management — PLH-103 (all)
  { slot: 3, day: 1, code: 'EHSS301L', name: 'Project Management', teacher: 'Dr. Laxmi', room: 'PLH-103', type: 'common', batch: 'all' },
  // 1240-1340: LUNCH
  { slot: 4, day: 1, code: '', name: 'LUNCH', teacher: '', room: '', type: 'lunch', batch: 'all' },
  // 1345-1445: EECE210L Probability — CA
  { slot: 5, day: 1, code: 'EECE210L', name: 'Probability Theory & Stochastic Processes', teacher: 'Dr. Rohan', room: '009-N-CA', type: 'common', batch: 'all' },
  // 1450-1550: EECE311L Analog — Lecture (CA room, single slot)
  { slot: 6, day: 1, code: 'EECE311L', name: 'Analog & Digital Communications', teacher: 'Prof. Usman', room: '009-N-CA', type: 'common', batch: 'all' },
  // 1555-1655: EECE201L Solid State — ECE / EECE220L Cyber Security — EEC
  { slot: 7, day: 1, code: 'EECE201L', name: 'Solid State Devices', teacher: 'Dr. Ashish', room: '009-N-CA', type: 'ECE', batch: 'all' },
  { slot: 7, day: 1, code: 'EECE220L', name: 'Cyber Security', teacher: 'Dr. Priyanka', room: '109-N-TR', type: 'EEC', batch: 'all' },

  // ─────────────────────── WEDNESDAY ───────────────────────
  // 0820-0920 & 0925-1025: EECE220L (EEC) in 303-B-LA + EECE201L (ECE B1) in 304-B-LA — LAB (two consecutive slots)
  { slot: 0, day: 2, code: 'EECE220L', name: 'Cyber Security', teacher: 'Dr. Priyanka', room: '303-B-LA', type: 'EEC', tag: 'Lab', batch: 'all' },
  { slot: 0, day: 2, code: 'EECE201L', name: 'Solid State Devices', teacher: 'Dr. Ashish', room: '304-B-LA', type: 'ECE', tag: 'Lab', batch: 'B1' },
  { slot: 1, day: 2, code: 'EECE220L', name: 'Cyber Security', teacher: 'Dr. Priyanka', room: '303-B-LA', type: 'EEC', tag: 'Lab', batch: 'all' },
  { slot: 1, day: 2, code: 'EECE201L', name: 'Solid State Devices', teacher: 'Dr. Ashish', room: '304-B-LA', type: 'ECE', tag: 'Lab', batch: 'B1' },
  // 1030-1130: Specializations
  { slot: 2, day: 2, code: 'EECE366L', name: 'Intro to Data Analytics', teacher: 'Dr. Umesh', room: '109-N-TR', type: 'spec', spec: 'DataAnalysis', batch: 'all' },
  { slot: 2, day: 2, code: 'EEC3041L', name: 'VLSI Technology', teacher: 'Dr. Mahesh', room: '304-B-LA', type: 'spec', spec: 'VLSI', batch: 'all' },
  { slot: 2, day: 2, code: 'EECE460L', name: 'Embedded Systems HW-SW Co-Design', teacher: 'Dr. Ajay', room: '110-N-TR', type: 'spec', spec: 'Embedded', batch: 'all' },
  // 1135-1235: EECE311L — Lecture (CA room, single slot)
  { slot: 3, day: 2, code: 'EECE311L', name: 'Analog & Digital Communications', teacher: 'Prof. Usman', room: '009-N-CA', type: 'common', batch: 'all' },
  // 1240-1340: LUNCH
  { slot: 4, day: 2, code: '', name: 'LUNCH', teacher: '', room: '', type: 'lunch', batch: 'all' },
  // 1345-1445: EECE325J Seminar
  { slot: 5, day: 2, code: 'EECE325J', name: 'Seminar', teacher: 'Dr. Rohan', room: '009-N-CA', type: 'common', batch: 'all' },
  // 1450-1550: EHSS301L Project Management NCB-106
  { slot: 6, day: 2, code: 'EHSS301L', name: 'Project Management', teacher: 'Dr. Laxmi', room: 'NCB-106', type: 'common', batch: 'all' },
  // 1555-1655: EECE219L Professional Ethics
  { slot: 7, day: 2, code: 'EECE219L', name: 'Professional Ethics', teacher: 'Prof. Usman', room: '009-N-CA', type: 'common', batch: 'all' },

  // ─────────────────────── THURSDAY ───────────────────────
  // 0820-0920 & 0925-1025: EECE201L (ECE B2) in 304-B-LA — LAB (two consecutive slots)
  { slot: 0, day: 3, code: 'EECE201L', name: 'Solid State Devices', teacher: 'Dr. Ashish', room: '304-B-LA', type: 'ECE', tag: 'Lab', batch: 'B2' },
  { slot: 1, day: 3, code: 'EECE201L', name: 'Solid State Devices', teacher: 'Dr. Ashish', room: '304-B-LA', type: 'ECE', tag: 'Lab', batch: 'B2' },
  // 0925-1025: EECE220L Cyber Sec EEC B2 — 109-N-TR (single slot, lecture)
  { slot: 1, day: 3, code: 'EECE220L', name: 'Cyber Security', teacher: 'Dr. Priyanka', room: '109-N-TR', type: 'EEC', batch: 'B2' },
  // 1030-1130: Specializations
  { slot: 2, day: 3, code: 'EECE366L', name: 'Intro to Data Analytics', teacher: 'Dr. Umesh', room: '109-N-TR', type: 'spec', spec: 'DataAnalysis', batch: 'all' },
  { slot: 2, day: 3, code: 'EEC3041L', name: 'VLSI Technology', teacher: 'Dr. Mahesh', room: '304-B-LA', type: 'spec', spec: 'VLSI', batch: 'all' },
  // 1135-1235: EECE201L Solid State Devices — ECE only (no class for EEC at this slot)
  { slot: 3, day: 3, code: 'EECE201L', name: 'Solid State Devices', teacher: 'Dr. Ashish', room: '009-N-CA', type: 'ECE', batch: 'all' },
  // 1240-1340: LUNCH
  { slot: 4, day: 3, code: '', name: 'LUNCH', teacher: '', room: '', type: 'lunch', batch: 'all' },
  // 1345-1445: EHSS301L Project Management NCB-106
  { slot: 5, day: 3, code: 'EHSS301L', name: 'Project Management', teacher: 'Dr. Laxmi', room: 'NCB-106', type: 'common', batch: 'all' },
  // 1450-1550: EECE311L Analog — Lecture (CA room, single slot)
  { slot: 6, day: 3, code: 'EECE311L', name: 'Analog & Digital Communications', teacher: 'Prof. Usman', room: '311-N-CA', type: 'common', batch: 'all' },

  // ─────────────────────── FRIDAY ───────────────────────
  // 0820-0920 & 0925-1025: EECE460L Embedded — 303-N-LA — LAB (two consecutive slots)
  { slot: 0, day: 4, code: 'EECE460L', name: 'Embedded Systems HW-SW Co-Design', teacher: 'Dr. Ajay', room: '303-N-LA', type: 'spec', spec: 'Embedded', tag: 'Lab', batch: 'all' },
  { slot: 1, day: 4, code: 'EECE460L', name: 'Embedded Systems HW-SW Co-Design', teacher: 'Dr. Ajay', room: '303-N-LA', type: 'spec', spec: 'Embedded', tag: 'Lab', batch: 'all' },
  { slot: 1, day: 4, code: 'EECE366L', name: 'Intro to Data Analytics', teacher: 'Dr. Umesh', room: '109-N-TR', type: 'spec', spec: 'DataAnalysis', batch: 'all' },
  { slot: 1, day: 4, code: 'EEC3041L', name: 'VLSI Technology', teacher: 'Dr. Mahesh', room: '304-B-LA', type: 'spec', spec: 'VLSI', batch: 'all' },
  // 1030-1130: EECE311L Analog — CA|T
  { slot: 2, day: 4, code: 'EECE311L', name: 'Analog & Digital Communications', teacher: 'Prof. Usman', room: '009-N-CA', type: 'common', tag: 'Tutorial', batch: 'all' },
  // 1135-1235: EECE201L Solid State ECE + EECE220L Cyber Sec EEC
  { slot: 3, day: 4, code: 'EECE201L', name: 'Solid State Devices', teacher: 'Dr. Ashish', room: '009-N-CA', type: 'ECE', batch: 'all' },
  { slot: 3, day: 4, code: 'EECE220L', name: 'Cyber Security', teacher: 'Dr. Priyanka', room: '109-N-TR', type: 'EEC', batch: 'all' },
  // 1240-1340: LUNCH
  { slot: 4, day: 4, code: '', name: 'LUNCH', teacher: '', room: '', type: 'lunch', batch: 'all' },
  // 1345-1445: EECE210L Probability
  { slot: 5, day: 4, code: 'EECE210L', name: 'Probability Theory & Stochastic Processes', teacher: 'Dr. Rohan', room: '009-N-CA', type: 'common', batch: 'all' },
  // 1450-1550: EECE311L Analog — CA|L
  { slot: 6, day: 4, code: 'EECE311L', name: 'Analog & Digital Communications', teacher: 'Prof. Usman', room: '009-N-CA', type: 'common', tag: 'Lab', batch: 'all' },
];

/* ================================================================
   BATCH DETECTION
   ================================================================ */
/**
 * Given a roll number string, determine stream, lab batch, and ECE batch.
 *
 * Roll number format: E24ECEU0012 (ECE) or E24EECU0005 (EEC)
 *
 * Lab Batch (for shared lab scheduling):
 *   B1 : E24ECEU0001–0035
 *   B2 : E24ECEU0036–0043  AND  all E24EECU*
 *
 * ECE Internal Batch (for ECE-only lab splits):
 *   ECE B1 : E24ECEU0001–0023
 *   ECE B2 : E24ECEU0024–0043
 *
 * EEC students have no sub-batch — they are always in Lab B2.
 */
function detectStudentInfo(rollNo) {
  const normalized = rollNo.toUpperCase().trim();

  let stream = 'unknown';
  let rollNum = 0;
  let batch = 'B1';    // lab batch
  let eceBatch = 'B1'; // ECE internal batch

  const eceMatch = normalized.match(/E24ECEU(\d+)/);
  const eecMatch = normalized.match(/E24EECU(\d+)/);

  if (eceMatch) {
    stream = 'ECE';
    rollNum = parseInt(eceMatch[1], 10);
    // Lab batch: 0001-0035 → B1, 0036-0043 → B2
    batch   = (rollNum >= 1 && rollNum <= 35) ? 'B1' : 'B2';
    // ECE internal batch: 0001-0023 → B1, 0024-0043 → B2
    eceBatch = (rollNum >= 1 && rollNum <= 23) ? 'B1' : 'B2';
  } else if (eecMatch) {
    stream = 'EEC';
    rollNum = parseInt(eecMatch[1], 10);
    batch    = 'B2'; // All EEC students are in lab B2
    eceBatch = 'B2'; // Not applicable, but set for consistency
  }

  return { stream, batch, eceBatch, rollNum };
}

/* ================================================================
   FILTER: which entries apply to this student?
   ================================================================ */
function filterEntries(entries, student) {
  const { stream, batch, eceBatch, spec } = student;

  return entries.filter(entry => {
    // Lunch always shows
    if (entry.type === 'lunch') return true;

    // Specialization check — if 'None' hide all spec courses
    if (entry.type === 'spec') {
      if (spec === 'None') return false;
      if (entry.spec !== spec) return false;
    }

    // Branch check
    if (entry.type === 'ECE' && stream !== 'ECE') return false;
    if (entry.type === 'EEC' && stream !== 'EEC') return false;

    // Batch check
    // ECE-type entries use ECE internal batch (B1=0001-0023, B2=0024-0043)
    // All other entries use Lab batch (B1=0001-0035, B2=0036-0043+EEC)
    if (entry.batch !== 'all') {
      const studentBatch = (entry.type === 'ECE') ? eceBatch : batch;
      if (entry.batch !== studentBatch) return false;
    }

    return true;
  });
}

/* ================================================================
   BUILD TIMETABLE GRID
   ================================================================ */
function buildGrid(filteredEntries) {
  // grid[slot][day] = array of entries
  const grid = Array.from({ length: TIME_SLOTS.length }, () =>
    Array.from({ length: DAYS.length }, () => [])
  );

  filteredEntries.forEach(entry => {
    grid[entry.slot][entry.day].push(entry);
  });

  return grid;
}

/* ================================================================
   RENDER CELL CONTENT
   ================================================================ */
function cellTypeClass(type) {
  if (type === 'lunch') return 'type-lunch';
  if (type === 'common') return 'type-common';
  if (type === 'ECE' || type === 'EEC') return 'type-branch';
  if (type === 'spec') return 'type-spec';
  return 'type-empty';
}

function tagClass(type) {
  if (type === 'common') return 'tag-common';
  if (type === 'ECE' || type === 'EEC') return 'tag-branch';
  if (type === 'spec') return 'tag-spec';
  return '';
}

function renderCell(entries) {
  if (!entries || entries.length === 0) {
    return `<div class="cell-content type-empty"></div>`;
  }

  // If all are lunch
  if (entries.every(e => e.type === 'lunch')) {
    return `<div class="cell-content type-lunch"><span class="lunch-label">🍽 Lunch Break</span></div>`;
  }

  // Multiple entries (e.g., both ECE + EEC in same slot but we filtered, so usually 1)
  // But some slots have multiple courses at same time (e.g. spec offerings)
  // Since we filter, it should normally be 1 entry per slot-day combo
  return entries.map(e => {
    const typeClass = cellTypeClass(e.type);
    const tClass = tagClass(e.type);
    const tagLabel = e.tag || (e.type === 'ECE' ? 'ECE' : e.type === 'EEC' ? 'EEC' : e.type === 'spec' ? e.spec : e.type === 'common' ? 'Common' : '');
    return `
      <div class="cell-content ${typeClass}">
        <span class="cell-code">${e.code}</span>
        <span class="cell-name">${e.name}</span>
        ${e.teacher ? `<span class="cell-teacher">${e.teacher}</span>` : ''}
        ${e.room ? `<span class="cell-room">📍 ${e.room}</span>` : ''}
        ${tagLabel ? `<span class="cell-tag ${tClass}">${tagLabel}</span>` : ''}
      </div>
    `;
  }).join('');
}

/* ================================================================
   RENDER FULL TABLE
   ================================================================ */
function renderTable(grid) {
  const tbody = document.getElementById('tt-body');
  tbody.innerHTML = '';

  TIME_SLOTS.forEach((slot, si) => {
    const tr = document.createElement('tr');

    // Timing cell
    const tdTime = document.createElement('td');
    tdTime.className = 'tt-td';
    tdTime.innerHTML = `<div class="tt-timing">${slot.replace('–', '–')}</div>`;
    tr.appendChild(tdTime);

    DAYS.forEach((_, di) => {
      const entries = grid[si][di];
      const td = document.createElement('td');
      td.className = 'tt-td';
      td.innerHTML = renderCell(entries);
      tr.appendChild(td);
    });

    tbody.appendChild(tr);
  });
}

/* ================================================================
   COURSE SUMMARY LIST
   ================================================================ */
const COURSE_INFO = {
  'EECE210L': { name: 'Probability Theory & Stochastic Processes', teacher: 'Dr. Rohan', credits: '3', type: 'common' },
  'EECE311L': { name: 'Analog & Digital Communications', teacher: 'Prof. Usman', credits: '4', type: 'common' },
  'EHSS301L': { name: 'Project Management', teacher: 'Dr. Laxmi Gupta', credits: '2', type: 'common' },
  'EECE325J': { name: 'Seminar', teacher: 'Dr. Rohan', credits: '1', type: 'common' },
  'EECE219L': { name: 'Professional Ethics', teacher: 'Prof. Usman', credits: '2', type: 'common' },
  'EECE201L': { name: 'Solid State Devices', teacher: 'Dr. Ashish', credits: '4', type: 'ECE' },
  'EECE220L': { name: 'Cyber Security', teacher: 'Dr. Priyanka', credits: '3', type: 'EEC' },
  'EECE366L': { name: 'Introduction to Data Analytics', teacher: 'Dr. Umesh', credits: '3', type: 'spec', spec: 'DataAnalysis' },
  'EEC3041L': { name: 'VLSI Technology', teacher: 'Dr. Mahesh', credits: '3', type: 'spec', spec: 'VLSI' },
  'EECE460L': { name: 'Embedded Systems HW-SW Co-Design', teacher: 'Dr. Ajay', credits: '3', type: 'spec', spec: 'Embedded' },
};

function getPillClass(type) {
  if (type === 'common') return 'pill-common';
  if (type === 'ECE' || type === 'EEC') return 'pill-branch';
  if (type === 'spec') return 'pill-spec';
  return 'pill-common';
}

function getCardClass(type) {
  if (type === 'common') return 'common';
  if (type === 'ECE' || type === 'EEC') return 'branch';
  if (type === 'spec') return 'spec';
  return 'common';
}

function renderCourseSummary(student) {
  const { stream, spec } = student;
  const grid = document.getElementById('courses-grid');
  grid.innerHTML = '';

  Object.entries(COURSE_INFO).forEach(([code, info]) => {
    // Skip branch-specific that don't apply
    if (info.type === 'ECE' && stream !== 'ECE') return;
    if (info.type === 'EEC' && stream !== 'EEC') return;
    // Skip all spec courses if No Specialization selected
    if (info.type === 'spec' && spec === 'None') return;
    // Skip wrong specialization
    if (info.type === 'spec' && info.spec !== spec) return;

    const typeLabel =
      info.type === 'common' ? 'Common' :
      info.type === 'ECE' ? 'ECE Only' :
      info.type === 'EEC' ? 'EEC Only' :
      info.spec === 'VLSI' ? '💎 VLSI Elective' :
      info.spec === 'DataAnalysis' ? '📊 Data Analysis Elective' :
      '🔧 Embedded Elective';

    const icon =
      info.type === 'common' ? '📚' :
      info.type === 'ECE' ? '⚡' :
      info.type === 'EEC' ? '🔌' :
      info.type === 'spec' ? '🎯' : '📘';

    const card = document.createElement('div');
    card.className = `course-card ${getCardClass(info.type)}`;
    card.innerHTML = `
      <span class="course-code">${code}</span>
      <span class="course-name">${icon} ${info.name}</span>
      <span class="course-meta">👨‍🏫 ${info.teacher}</span>
      <span class="course-type-pill ${getPillClass(info.type)}">${typeLabel}</span>
    `;
    grid.appendChild(card);
  });
}

/* ================================================================
   BATCH LABEL DISPLAY
   ================================================================ */
function getBatchLabel(student) {
  const { stream, batch, eceBatch } = student;
  if (stream === 'ECE') return `ECE ${eceBatch} · Lab ${batch}`;
  if (stream === 'EEC') return `Lab B2`;
  return `Batch ${batch}`;
}

function getSpecLabel(spec) {
  if (spec === 'VLSI') return '💎 VLSI Technology';
  if (spec === 'DataAnalysis') return '📊 Introduction to Data Analytics';
  if (spec === 'Embedded') return '🔧 Embedded Systems HW-SW Co-Design';
  if (spec === 'None') return '📋 No Specialization';
  return spec;
}

/* ================================================================
   FORM VALIDATION & SUBMISSION
   ================================================================ */
function setError(id, msg) {
  const el = document.getElementById(id);
  if (el) el.textContent = msg;
}

function clearErrors() {
  ['name-error', 'roll-error', 'spec-error'].forEach(id => setError(id, ''));
  document.querySelectorAll('.form-input').forEach(i => i.classList.remove('error'));
}

function validateForm(name, roll, spec) {
  let valid = true;

  if (!name.trim()) {
    setError('name-error', 'Please enter your full name.');
    document.getElementById('student-name').classList.add('error');
    valid = false;
  }

  if (!roll.trim()) {
    setError('roll-error', 'Please enter your roll number.');
    document.getElementById('roll-no').classList.add('error');
    valid = false;
  } else {
    const normalized = roll.toUpperCase().trim();
    if (!normalized.match(/E24ECEU\d+/) && !normalized.match(/E24EECU\d+/)) {
      setError('roll-error', 'Unrecognized roll number. Use format E24ECEU0012 or E24EECU0005.');
      document.getElementById('roll-no').classList.add('error');
      valid = false;
    }
  }

  if (!spec) {
    setError('spec-error', 'Please select your specialization.');
    valid = false;
  }

  return valid;
}

/* ================================================================
   SCREEN TRANSITIONS
   ================================================================ */
function showTimetableScreen(student) {
  // Update header info
  document.getElementById('tt-name-display').textContent = student.name;
  document.getElementById('tt-roll-display').textContent = student.roll.toUpperCase();
  document.getElementById('tt-branch-display').textContent = student.stream;
  document.getElementById('tt-batch-display').textContent = getBatchLabel(student);
  document.getElementById('tt-spec-display').textContent = `Specialization: ${getSpecLabel(student.spec)}`;

  // Build timetable
  const filtered = filterEntries(RAW_ENTRIES, student);
  const grid = buildGrid(filtered);
  renderTable(grid);
  renderCourseSummary(student);

  // Transition
  const landing = document.getElementById('landing-screen');
  const timetable = document.getElementById('timetable-screen');

  landing.classList.add('slide-out');
  setTimeout(() => {
    landing.classList.remove('active', 'slide-out');
    landing.style.display = 'none';
    timetable.style.display = 'block';
    // Trigger reflow
    timetable.offsetHeight;
    timetable.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, 350);
}

function showLandingScreen() {
  const landing = document.getElementById('landing-screen');
  const timetable = document.getElementById('timetable-screen');

  timetable.classList.remove('active');
  setTimeout(() => {
    timetable.style.display = 'none';
    landing.style.display = 'flex';
    landing.offsetHeight;
    landing.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, 350);
}

/* ================================================================
   INIT
   ================================================================ */
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('student-form');
  const backBtn = document.getElementById('back-btn');

  // Form submit
  form.addEventListener('submit', e => {
    e.preventDefault();
    clearErrors();

    const name = document.getElementById('student-name').value;
    const roll = document.getElementById('roll-no').value;
    const specRadio = document.querySelector('input[name="specialization"]:checked');
    const spec = specRadio ? specRadio.value : '';

    if (!validateForm(name, roll, spec)) return;

    const info = detectStudentInfo(roll);
    const student = {
      name: name.trim(),
      roll: roll.trim(),
      stream: info.stream,
      batch: info.batch,
      eceBatch: info.eceBatch,
      spec,
    };

    showTimetableScreen(student);
  });

  // Back button
  backBtn.addEventListener('click', showLandingScreen);

  // Live validation feel
  document.getElementById('student-name').addEventListener('input', () => {
    setError('name-error', '');
    document.getElementById('student-name').classList.remove('error');
  });

  document.getElementById('roll-no').addEventListener('input', () => {
    setError('roll-error', '');
    document.getElementById('roll-no').classList.remove('error');
  });
});
