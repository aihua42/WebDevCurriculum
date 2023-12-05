// textarea
// contenteditable

// 생성자안에서 모든 걸 하면 안된다!!!!
/* keys */
const keysStyleButton = [
  'bold', 'italic', 'underline', 'strike', 'color'
];
const keysInteractButton = [
  'newText', 'open', 'save', 'saveAs', 'close'
];

/* Notepad */
class Notepad {
	/* TODO: 그 외에 또 어떤 클래스와 메소드가 정의되어야 할까요? */
	fontSizer = null;
	constructor() {
    this.setSize();
    this.setStyleButton();
    this.setInteractButton();
	}
  // adjust font-size
	// 객체가 만들어지고 변수형태로 저장되어야 되고 그걸 사용해야 한다.
	// set 이라는 이름은 setting할때 쓴다
	// setup is better
  setSize() { 
		// 참조하는게 있어야 한다. 안그러면 지워진다.
		// 차라리 함수...
    this.fontSizer = new fontSize(); //  FontSizer, 뭐하는 애인지 알수 있어야 한다.
  }
  // bold, italic, underline, strike, color buttons
  setStyleButton() {
    new StyleButton();
  }
  // newText, open, save, saveAs, close buttons
  setInteractButton() {
    new InteractButton();
  }
};

/* font-sizing class */
class fontSize {
  constructor() {
    this.textarea = document.querySelector('textarea');
    this.inputSize = document.querySelector('.font');
    this.setSize();
  }

  setSize() { 
    const textArea = this.textarea; 
    const inputSize = this.inputSize;
    inputSize.onclick = function() {
      let value = inputSize.value;
      textArea.style.fontSize = value + 'px';
    }
  }
}

/* class for making buttons' object */
class ButtonObj {
  constructor(type) {
    this.type = type;
    this.obj = this.getObj();
  }

  getObj() { // 행위를 설명해줘야 한다. create/makeButtonGroup, get은 가져온다.
    let keys = this.type === 'style' ? keysStyleButton : keysInteractButton; // styleButtonKeyList, interactButtonList / interactButtonKeys
    let obj = {};  // buttonGroup
    keys.forEach((key) => obj[key] = document.querySelector('.' + key));
    return obj;
  }
}

/* class for style buttons - bold, itaric, underline, strike, color */
class StyleButton {
  constructor() {
    this.textarea = document.querySelector('textarea');
    this.styleObj = new ButtonObj('style').obj; // 나중에 필요하면 obj를 넣는 형식으로~, style이라는 정보는 사라지게 된다.
		//   .type .obj = 
    this.setStyleButton();
  }

  setStyleButton() {
    function activeClassName(className) {
      return 'active' + className[0].toUpperCase() + className.slice(1);
    }

    keysStyleButton.forEach((key) => {
      const button = this.styleObj[key]; 
      const className = activeClassName(key); 
      button.onclick = () => this.textarea.classList.toggle(className);
    });
  }
}

class Open {
  constructor(title) {
    title = prompt('Please input the title:', '');
    this.title = title;
    this.text = localStorage.getItem(title);
    this.open();
  }

  open() {
		if (this.title === null) {
			return;
		} else if (this.text === null) {
      alert(`File Doesn't exist!`);
    } else {
      new Window(this.title, this.text);
    }
  }
}

class Save {
  constructor() {
    this.title = document.querySelector('.title').value;
    this.text = document.querySelector('textarea').value;
    this.save();
  }

  save() {
    if (this.title === '' || this.title === null) {
      alert('Title must be filled!');
    } else if (!localStorage.getItem(this.title) 
           || confirm('File already exists. Do you want to overwrite?')) {
      localStorage.setItem(this.title, this.text);
      alert("Successfully saved!");
    }
  }
}

class SaveAs {
  constructor(newTitle) {
    newTitle = prompt('Save as:', '');
    while (newTitle === '' || localStorage.getItem(newTitle)) {
      newTitle = newTitle === '' ? prompt(`Title shouldn't be empty!`, '') : prompt(`"${newTitle}" already exists!`, '');
    } console.log(newTitle);
    this.newTitle = newTitle; 
    this.text = document.querySelector('textarea').value;
    this.saveAs();
  }

  saveAs() {
    if (this.newTitle !== null) {
      localStorage.setItem(this.newTitle, this.text);
      alert("Successfully saved!");
    }
  }
}

// onbeforeunload 으로 시도해보다가 실패
class Close {
  constructor() {
    this.title = document.querySelector('.title').value;
    this.text = document.querySelector('textarea').value;
    this.close();
  }

  close() {
    if ((this.title === '' && this.text === '')
        || confirm('Do you wanna leave without save?')) {
      window.close();
    }
  }
}

/* class for interaction buttons - Open, Save, Save As, Close */
class InteractButton {
  constructor() {
    this.interactObj = new ButtonObj('interact').obj;
    this.setInteractButton();
  }

  setInteractButton() {
    keysInteractButton.forEach((key) => {
      const button = this.interactObj[key]; 
      button.onclick = interactFuncObj[key];
    });
  }
}

/* interaction functions' object */
const interactFuncObj = {};
interactFuncObj['newText'] = () => new Window();
interactFuncObj['open'] = () => new Open();
interactFuncObj['save'] = () => new Save();
interactFuncObj['saveAs'] = () => new SaveAs();
interactFuncObj['close'] = () => new Close();

/* 새창 */
class Window {
  constructor(title='', text='') {
    this.title = title;
    this.text = text;

    const win = window.open('http://127.0.0.1:5500/Quest05/skeleton/index.html', '_blank', 'resizable=no');
		this.parentWin = win.opener;

		win.document.body.parentElement.innerHTML = this.makeHTML();
		//win.document.querySelector('.title').outerHTML = `<input class="title" type="text" placeholder="Untitled Text" value="${this.title}">`;
		win.document.querySelector('.title').value = this.title;
		win.document.querySelector('textarea').value = this.text;
    this.win = win;     
  }

	makeHTML() {
		let html = this.parentWin.document.body.parentElement.innerHTML.split('<!-- Code injected by live-server -->')[0];
		html += '</body>';
		html = '<html>\n' + html + '\n</html>';
		html = '<!DOCTYPE html>\n' + html;
		return html;
	}
}







