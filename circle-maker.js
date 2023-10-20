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
	ghostNotes = true;
	
	temperament = equalTemperament;
	
	element = null;
	callback = null;
	noteMap = {};
	items = [];
	
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
	  element.setAttribute("viewBox", "0 0 320 320");
	  this.element = element;
	  return element;
	}

	setCells(notes) {
		this.items = [];
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
	  		if (!notes.find(note => (note.circleIndex + 120) % 12 == i)) {
	  			this.appendNote({circleIndex: i});
	  		}
	  	}
	  }
	}
	
	appendNote(note) {
		let cell = this.createCell(note)
		this.element.appendChild(cell);
		this.noteMap[note.text] = cell;
		this.items.push({
			"note": note,
			"cell": cell,
		});
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
			cell.style.setProperty("--hue-index", note.hueIndex);
			cell.classList.add("hue");
			cell.classList.add("selectable");
	  } else {
		cell.classList.add("unselectable");
	  }
	  
	  cell.appendChild(path);
	  
  	this.appendText(cell, x, y, note.natText, note.accText);
	  
	  cell.onmouseover = () => this.bringToFront(cell);
	  
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
	  
	  this.appendTspan(text, natText);
	  if (accText) {
		this.appendTspan(text, accText, 'superscript');
	  }
	  
	  cell.appendChild(text);
	  return text;
	}
	
	appendTspan(text, content, clazz) {
	  let tspan = document.createElementNS(ns, 'tspan');
	  tspan.textContent = content;
	  tspan.classList.add(clazz);
	  text.appendChild(tspan);
	  return tspan;
	}
	
	selectNote(noteName) {
		let	cell = this.#findCell({text: noteName});
		if (cell) {
			cell.classList.add('selected');
		}
	}
	
	selectNoteGroup(notes) {
		this.element.classList.add('group-selected');
		notes.forEach(note => {
			let	cell = this.#findCell(note);
			if (cell) {
				cell.classList.add('in-group-selected');
			}
		});
	}

	#findCell(note) {
		let	item = this.items.find(value => value.note.text == note.text);
		if (!item && note.hueIndex != undefined) {
			item = this.items.find(value => value.note.hueIndex == note.hueIndex);
		}
		if (!item) {
			console.error("Not found note: " + note.text);
		}
		return item ? item.cell : null;
	}
	
	clearSelections() {
		this.element.querySelectorAll(".selected").forEach(cell => {
			cell.classList.remove('selected');
		});
		this.element.querySelectorAll(".in-group-selected").forEach(cell => {
			cell.classList.remove('in-group-selected');
		});
	}
	
	bringToFront(cell) {
		cell.remove();
		this.element.appendChild(cell);
	}
}

