import { MeantoneTuningSystem } from './tuning-systems.mjs';
import CircleMaker from './circle-maker.mjs';

let noteGroups = {
	"12notes": circleWithFifthIndex(listFifthInterval('G♭', 'B')),
	"17notes": circleWithFifthIndex(listFifthInterval('G♭', 'A♯')),
	"35notes": circleWithFifthIndex(listFifthInterval('F𝄫', 'B𝄪')),
};

let fifthCircle = null;
let scaleCircle = null;
let noteGroup = null;
let selectedKey = "C";
let selectedScale = null;
let selectedMode = "C";
let scaleNotes = [];

function start() {
	fifthCircle = new CircleMaker(onSelectKey);
	document.querySelector("#fifthCircle").appendChild(fifthCircle.element);
	
	scaleCircle = new CircleMaker(onSelectMode);
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
	fifthCircle.selectNoteGroup(scaleNotes);
}

function onSelectKey(note) {
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
	selectedMode = selectedKey;
	scaleNotes = circleWithHueIndex(listScaleNotes(selectedScale, selectedKey));
	scaleCircle.setCells(scaleNotes);
	scaleCircle.selectNote(selectedMode);
	refreshFifthCircle();
}

function onSelectMode(note) {
	selectedMode = note.text;
	scaleCircle.clearSelections();
	scaleCircle.selectNote(selectedMode);
}

start();

