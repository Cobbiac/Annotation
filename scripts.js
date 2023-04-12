document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const audioFile = document.getElementById('audioFile');
  const audioUrl = document.getElementById('audioUrl');
  const loadUrl = document.getElementById('loadUrl');
  const audioPlayer = document.getElementById('audioPlayer');
  const pausePlay = document.getElementById('pausePlay');
  const addTimestampBtn = document.getElementById('addTimestamp');
  const saveNotes = document.getElementById('saveNotes');
  const loadNotes = document.getElementById('loadNotes');
  const help = document.getElementById('help');
  const instructions = document.getElementsByClassName('instructions')[0];
  const retroStyle = document.getElementById('retroStyle');

  // Event listeners
  audioFile.addEventListener('change', loadAudioFile);
  loadUrl.addEventListener('click', loadAudioFromUrl);
  pausePlay.addEventListener('click', toggleAudioPlayback);
  addTimestampBtn.addEventListener('click', insertTimestamp);
  saveNotes.addEventListener('click', saveNotesToFile);
  loadNotes.addEventListener('change', loadNotesFromFile);
  help.addEventListener('click', toggleInstructionsVisibility);
  retroStyle.addEventListener('click', toggleRetroStyle);

  document.addEventListener('keydown', handleKeyboardInput);

  function loadAudioFile(event) {
      const file = event.target.files[0];
      const url = URL.createObjectURL(file);
      audioPlayer.src = url;
  }

  function loadAudioFromUrl() {
      const url = audioUrl.value;
      audioPlayer.src = url;
      audioPlayer.load();
  }

  function toggleAudioPlayback() {
      if (audioPlayer.paused) {
          audioPlayer.play();
          pausePlay.textContent = "Pause";
      } else {
          audioPlayer.pause();
          pausePlay.textContent = "Play";
      }
      insertTimestamp();
  }

  function saveNotesToFile() {
      const table = document.getElementById('notesTable');
      const rows = table.querySelectorAll('tbody tr');
      let csvContent = 'Timestamp,Note\n';

      rows.forEach(row => {
          const timestamp = row.cells[0].textContent;
          const note = row.cells[1].textContent;
          csvContent += `"${timestamp}","${note}"\n`;
      });

      const blob = new Blob([csvContent], {type: 'text/csv;charset=utf-8'});
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'notes.csv';
      a.click();
      URL.revokeObjectURL(url);
  }

  function loadNotesFromFile(event) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
          const data = e.target.result;
          const lines = data.split('\n');
          const table = document.getElementById('notesTable');
          const tbody = table.querySelector('tbody');

          lines.slice(1).forEach(line => {
              const [timestamp, note] = line.split(',').map(item => item.replace(/"/g, ''));
              if (timestamp && note) {
                  const newRow = tbody.insertRow(-1);
                  const timestampCell = newRow.insertCell(0);
                  const noteCell = newRow.insertCell(1);

                  timestampCell.textContent = timestamp;
                  noteCell.textContent = note;
                  noteCell.contentEditable = 'true';
              }
          });
      };
      reader.readAsText(file);
  }

  function toggleInstructionsVisibility() {
      instructions.hidden = !instructions.hidden;
  }

  function toggleRetroStyle() {
      document.body.classList.toggle('retro');
  }

  function insertTimestamp() {
      const timestamp = formatTimestamp(audioPlayer.currentTime);

      const table = document.getElementById('notesTable');
      const tbody = table.querySelector('tbody');
      const newRow = tbody.insertRow(-1);
      const timestampCell = newRow.insertCell(0);
      const noteCell = newRow.insertCell(1);
      timestampCell.textContent = timestamp;
      noteCell.textContent = '';
      noteCell.contentEditable = 'true';
      noteCell.focus();
  }

  function formatTimestamp(seconds) {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = Math.floor(seconds % 60);
      return `${padWithZero(minutes)}:${padWithZero(remainingSeconds)}`;
  }

  function padWithZero(number) {
      return number.toString().padStart(2, '0');
  }
  function handleKeyboardInput(event) {
    const key = event.key;
    const shiftKey = event.shiftKey;

    if (key === 'Enter' && !shiftKey) {
      event.preventDefault();
      insertTimestamp();
    } else if (key === 'Enter' && shiftKey) {
      event.preventDefault();
      toggleAudioPlayback();
    } else if (key === 'ArrowLeft') {
      audioPlayer.currentTime -= 10;
    } else if (key === 'ArrowRight') {
      audioPlayer.currentTime += 10;
    }
  }
});






