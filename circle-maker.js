const ns = "http://www.w3.org/2000/svg";
const twoPI = 2 * Math.PI;
const equalTemperament = 7/12;
const wellTemperament = Math.log2(1.5);

class CircleMaker {

	r0 = 100; // radius of F
	cx = 150; // x of center
	cy = 160; // y of center
	cellWidth = 30;
	distanceFactor = 0; // zero or one
	spacing = 2;
	angleOffset = 6 * twoPI / 12;
	hueOffset = 0;
	saturation = 90;
	lightning = 65;
	fontSize = 16;
	superFontSize = 12;
	ghostNotes = true;
	
	temperament = equalTemperament;
	
	element = null;
	callback = null;
	noteMap = {};
	
	constructor(callback, notes) {
		this.createElement();
		if (callback) {
			this.callback = callback;
		}
		if (notes) {
			this.setCells(notes);
		}
	}
	
	createElement() {
	  let element = document.createElementNS(ns, "svg");
	  element.setAttribute("width", 320);
	  element.setAttribute("height", 320);
	  element.setAttribute("stroke", "black");
	  element.setAttribute("stroke-width", 0.2);
	  this.element = element;
	  return element;
	}

	setCells(notes) {
		this.element.innerHTML = '';
		if (notes.length > 12) {
			this.distanceFactor = 1;
			this.ghostNotes = false;
		} else {
			this.distanceFactor = 0;
			this.ghostNotes = true;
		}
		if (notes.length >= 24) {
			this.temperament = wellTemperament;
		}
	  notes.forEach(note => this.appendNote(note));
	  if (this.ghostNotes) {
	  	for (var i = 0; i < 12; i++) {
	  		if (!notes.find(note => note.circleIndex % 12 == i)) {
	  			this.appendNote({circleIndex: i});
	  		}
	  	}
	  }
	}
	
	appendNote(note) {
		let cell = this.createCell(note)
		this.element.appendChild(cell);
		this.noteMap[note.text] = cell;
	}

	createCell(note) {
	  const ratio = this.temperament/7;
	  const distance = this.distanceFactor*(this.cellWidth + this.spacing);
	  const dr = distance * ratio;
	  const da = twoPI * (ratio - this.spacing/500);
	  
	  let r = this.r0 + distance*note.circleIndex * ratio;
	  let a = this.angleOffset + twoPI * note.circleIndex * ratio;
	  let x = this.cx + r*Math.cos(a);
	  let y = this.cy + r*Math.sin(a);
	  
	  let rc = r - this.cellWidth/2;
	  let RC = r + this.cellWidth/2;
	  let cos1 = Math.cos(a - da/2);
	  let sin1 = Math.sin(a - da/2);
	  let cos2 = Math.cos(a + da/2);
	  let sin2 = Math.sin(a + da/2);
	  let X1 = this.cx + (RC - dr/2)*cos1;
	  let Y1 = this.cy + (RC - dr/2)*sin1;
	  let X2 = this.cx + (RC + dr/2)*cos2;
	  let Y2 = this.cy + (RC + dr/2)*sin2;
	  let x2 = this.cx + (rc + dr/2)*cos2;
	  let y2 = this.cy + (rc + dr/2)*sin2;
	  let x1 = this.cx + (rc - dr/2)*cos1;
	  let y1 = this.cy + (rc - dr/2)*sin1;
	  
	  let pathd = `M ${X1} ${Y1}
		       A ${RC} ${RC}, 0, 0, 1, ${X2} ${Y2}
		       L ${x2} ${y2}
		       A ${rc} ${rc}, 0, 0, 0, ${x1} ${y1}
		       Z`;
	  
	  let cell = document.createElementNS(ns, 'g');
	  cell.classList.add('cell');
	  let path = document.createElementNS(ns, 'path');
	  path.setAttribute("d", pathd);
	  
	  if (Number.isInteger(note.hueIndex)) {
			let hue = this.hueOffset + 360 * note.hueIndex * ratio;
			path.setAttribute("fill", `hsl(${hue}, ${this.saturation}%, ${this.lightning}%)`);
			cell.classList.add("selectable");
	  } else {
			path.setAttribute("fill", 'gray');
	  }
	  
	  cell.appendChild(path);
	  
  	this.appendText(cell, x, y, note.natText, note.accText);
	  
	  if (this.callback) {
	  	cell.onclick = () => this.callback(note, cell);
	  }
	  
	  return cell;
	}

	appendText(cell, x, y, natText, accText) {
		if (!natText) return;
		
	  let text = document.createElementNS(ns, 'text');
	  text.setAttribute("x", x);
	  text.setAttribute("y", y);
		text.setAttribute("font-size", this.fontSize);
		text.setAttribute("text-anchor","middle");
		text.setAttribute("dominant-baseline", "middle");
	  
	  this.appendTspan(text, natText);
	  if (accText) {
			let acc = this.appendTspan(text, accText);
			acc.setAttribute("baseline-shift","super");
			acc.setAttribute("font-size", this.superFontSize);
	  }
	  
	  cell.appendChild(text);
	  return text;
	}
	
	appendTspan(text, content) {
	  let tspan = document.createElementNS(ns, 'tspan');
	  tspan.textContent = content;
	  text.appendChild(tspan);
	  return tspan;
	}
	
	selectNote(noteName) {
		let	cell = this.noteMap[noteName];
		if (cell) {
			cell.classList.add('selected');
		}
	}
	
	clearSelections() {
		this.element.querySelectorAll(".selected").forEach(cell => {
			cell.classList.remove('selected');
		});
	}
}

