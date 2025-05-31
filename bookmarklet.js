(async function(){
  function formatDateToISO(dateStr) {
    if (!dateStr || typeof dateStr !== 'string') return '';
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
    let parts;
    if (/^\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}$/.test(dateStr)) {
      parts = dateStr.split(/[\/\-]/);
      let year, month, day;
      if (parts[2].length === 4) {
        year = parts[2];
        month = parts[0];
        day = parts[1];
        if (parseInt(parts[0]) > 12) { day = parts[0]; month = parts[1]; }
      } else {
        year = '20' + parts[2];
        month = parts[0];
        day = parts[1];
        if (parseInt(parts[0]) > 12) { day = parts[0]; month = parts[1]; }
      }
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }
    return dateStr;
  }
  function formatTimeTo24h(timeStr) {
    if (!timeStr || typeof timeStr !== 'string') return '';
    if (/^\d{2}:\d{2}:\d{2}$/.test(timeStr)) return timeStr;
    const match = timeStr.match(/(\d{1,2}):(\d{2})(?::(\d{2}))?\s*([AP]M)/i);
    if (match) {
      let hour = parseInt(match[1], 10);
      const minute = match[2];
      const second = match[3] || '00';
      const ampm = match[4].toUpperCase();
      if (ampm === 'PM' && hour < 12) hour += 12;
      if (ampm === 'AM' && hour === 12) hour = 0;
      return `${hour.toString().padStart(2, '0')}:${minute}:${second}`;
    }
    return timeStr;
  }
  function mapRun(run) {
    return {
      userId: '371914184822095873' || '',
      username: 'tmrxjd' || '',
      tier: String(run.tier || '1'),
      wave: String(run.wave || '1'),
      coins: String(run.totalCoins || run.coins || '0'),
      cells: String(run.totalCells || run.cells || '0'),
      rerollShards: String(run.totalDice || run.dice || '0'),
      duration: String(run.roundDuration || run.duration || '0h0m0s'),
      killedBy: String(run.killedBy || 'Apathy'),
      type: run.type ? run.type.charAt(0).toUpperCase() + run.type.slice(1) : 'Farming',
      runDate: formatDateToISO(run.runDate || run.date || ''),
      runTime: formatTimeTo24h(run.runTime || run.time || ''),
      note: String(run.notes || run.note || '')
    };
  }
  var runs = [];
  try { runs = JSON.parse(localStorage.getItem('trackerEntries') || '[]'); } catch(e) {}
  if (!runs.length) { alert('No runs found in localStorage!'); return; }
  let ok = 0, fail = 0, errors = [];
  for (let i = 0; i < runs.length; ++i) {
    const mapped = mapRun(runs[i]);
    try {
      // eslint-disable-next-line no-await-in-loop
      const res = await fetch('https://api.the-tower-run-tracker.athyen.pl/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'ApiKey y2JTM3tcvNb9CSzU7Rw5Ee6W4DgVpQZB' },
        body: JSON.stringify(mapped)
      });
      if (res.ok) { ok++; }
      else { fail++; errors.push(await res.text()); }
    } catch (e) { fail++; errors.push(e.message); }
  }
  alert(`Import complete! Success: ${ok}, Failed: ${fail}${fail ? '\nErrors: ' + errors.join('\n') : ''}`);
})();