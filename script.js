let fn = (note) => alert('Nota clicada: ' + note.text);

let container = document.querySelector("#container");

container.appendChild(new CircleMaker(listFifthScaleNotes('E♭', 12), fn).element);
container.appendChild(new CircleMaker(listFifthScaleNotes('F', 7), fn).element);
container.appendChild(new CircleMaker(listFifthNotes('G♭', 'A♯'), fn).element);
container.appendChild(new CircleMaker(listFifthNotes('F𝄫', 'B𝄪'), fn).element);

