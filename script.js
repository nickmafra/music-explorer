let noteGroups = {
	"12notes": listFifthScaleNotes('E♭', 12),
	"17notes": listFifthNotes('G♭', 'A♯'),
	"35notes": listFifthNotes('F𝄫', 'B𝄪'),
};

let fifthCircle = null;
let scaleCircle = null;
let selectedKey = "C";
let noteGroup = null;
let selectedScale = null;

function start() {
	fifthCircle = new CircleMaker(onSelectNote);
	document.querySelector("#fifthCircle").appendChild(fifthCircle.element);
	
	scaleCircle = new CircleMaker(onSelectScale);
	document.querySelector("#scaleCircle").appendChild(scaleCircle.element);
	
	onSelectNoteGroup();
	onSelectScale();
}

function onSelectNoteGroup() {
	noteGroup = document.querySelector("#noteGroup").value;
	refreshFifthCircle();
}

function refreshFifthCircle() {
	let notes = noteGroups[noteGroup];
	fifthCircle.setCells(notes);
	fifthCircle.selectNote(selectedKey);
}

function onSelectNote(note) {
	selectedKey = note.text;
	fifthCircle.clearSelections();
	fifthCircle.selectNote(selectedKey);
	refreshScale();
};

function onSelectScale() {
	selectedScale = document.querySelector("#scale").value;
	refreshScale();
}

function refreshScale() {
	let notes = circleWithHueIndex(listScaleNotes(selectedScale, selectedKey));
	scaleCircle.setCells(notes);
	scaleCircle.clearSelections();
}

start();

