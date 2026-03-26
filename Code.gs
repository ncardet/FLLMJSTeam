/**
 * FLL Presentation Builder — Google Sheets Sync
 * ─────────────────────────────────────────────
 * HOW TO DEPLOY (one-time setup, ~5 minutes):
 *
 *  1. Go to script.google.com and click "New project"
 *  2. Delete any existing code and paste this entire file
 *  3. Click Deploy → New deployment
 *     - Type: Web app
 *     - Execute as: Me
 *     - Who has access: Anyone
 *  4. Click Deploy and copy the Web app URL
 *  5. Open presentation.html, find the line:
 *       const APPS_SCRIPT_URL = '';
 *     and paste your URL between the quotes
 *  6. Commit and push the updated presentation.html
 *
 * Each team gets its own tab in the Google Sheet.
 * Data is stored as rows — answers and iteration log entries.
 */

const SHEET_ID = '1IDG3MuK2KO2VKy-Zfqe_-DtQ9_6-SCYOIJjcL1mC6e0';
const TEAMS    = ['RoboChickens', 'Code Mavericks', 'Blue Bolts'];

// ── GET: load a team's data ─────────────────────────
function doGet(e) {
  const team = (e.parameter || {}).team;
  if (!TEAMS.includes(team)) return jsonResp({ error: 'Invalid team: ' + team });

  const ss    = SpreadsheetApp.openById(SHEET_ID);
  const sheet = ss.getSheetByName(team);
  if (!sheet) return jsonResp({ answers: {}, log: [] });

  const rows    = sheet.getDataRange().getValues();
  const answers = {};
  const log     = [];

  for (const row of rows) {
    if (row[0] === 'answer') {
      // row: ['answer', sectionId, questionId, value]
      const sId = row[1], qId = row[2], val = row[3];
      answers[sId] = answers[sId] || {};
      answers[sId][qId] = val;
    } else if (row[0] === 'log') {
      // row: ['log', id, num, date, label, tried, happened, changed]
      log.push({ id: row[1], num: row[2], date: row[3], label: row[4],
                 tried: row[5], happened: row[6], changed: row[7] });
    }
  }

  return jsonResp({ answers, log });
}

// ── POST: save a team's data ────────────────────────
function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    const { team, answers, log } = body;
    if (!TEAMS.includes(team)) return jsonResp({ error: 'Invalid team: ' + team });

    const ss = SpreadsheetApp.openById(SHEET_ID);
    let sheet = ss.getSheetByName(team);
    if (!sheet) sheet = ss.insertSheet(team);
    sheet.clearContents();

    const rows = [];

    // Flatten nested answers object
    for (const [sId, qs] of Object.entries(answers || {})) {
      for (const [qId, val] of Object.entries(qs || {})) {
        rows.push(['answer', sId, qId, String(val), '', '', '', '']);
      }
    }

    // Iteration log entries
    for (const entry of (log || [])) {
      rows.push(['log', entry.id, entry.num, entry.date,
                 entry.label || '', entry.tried || '',
                 entry.happened || '', entry.changed || '']);
    }

    if (rows.length > 0) {
      sheet.getRange(1, 1, rows.length, 8).setValues(rows);
    }

    return jsonResp({ ok: true, saved: rows.length });
  } catch (err) {
    return jsonResp({ error: err.toString() });
  }
}

// ── Helper ──────────────────────────────────────────
function jsonResp(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
