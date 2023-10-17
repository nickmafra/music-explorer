const naturals = [
   {index: 0, text: 'F'},
   {index: 1, text: 'C'},
   {index: 2, text: 'G'},
   {index: 3, text: 'D'},
   {index: 4, text: 'A'},
   {index: 5, text: 'E'},
   {index: 6, text: 'B'},
];
const accidentals = [
   {index: -2, text: '𝄫'},
   {index: -1, text: '♭'},
   {index: 0, text: ''},
   {index: 1, text: '♯'},
   {index: 2, text: '𝄪'},
];

function mountNote(nat, acc) {
	if (!acc) {
		acc = accidentals[2];
	}
	return {
		natIndex: nat.index,
	  accIndex: acc.index,
	  natText: nat.text,
	  accText: acc.text,
	  text: nat.text + acc.text,
	  hueIndex: (nat.index * 7 + acc.index) % 12,
	  fifthIndex: nat.index + 7 * acc.index,
	};
}

const allNotes = accidentals.flatMap(acc => naturals.map(nat => mountNote(nat, acc)));

function findNoteByName(name) {
	return allNotes.find(note => note.text == name);
}

function listFifthNotes(firstNoteName, lastNoteName) {
  
  let firstFifthIndex = findNoteByName(firstNoteName).fifthIndex;
  let lastFifthIndex = findNoteByName(lastNoteName).fifthIndex;
  
  return allNotes.filter(note => note.fifthIndex >= firstFifthIndex && note.fifthIndex <= lastFifthIndex)
      .map(note => ({ ...note, circleIndex: note.fifthIndex}));
}

function listFifthScaleNotes(firstNoteName, count) {
  let firstFifthIndex = findNoteByName(firstNoteName).fifthIndex;
  let lastFifthIndex = firstFifthIndex + count - 1;
  
  return allNotes.filter(note => note.fifthIndex >= firstFifthIndex && note.fifthIndex <= lastFifthIndex)
      .map(note => ({ ...note, circleIndex: note.hueIndex}));
}

