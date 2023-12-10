class Notepad {
	/* TODO: 그 외에 또 어떤 클래스와 메소드가 정의되어야 할까요? */
	constructor(titleParentSelector, textParentSelector, interactSelector, interactBtnNameList) {
		this.titleParentSelector = titleParentSelector;
		this.textParentSelector = textParentSelector;
		this.interactSelector = interactSelector;
		this.interactBtnNameList = interactBtnNameList;

		this.btnOnclickFuncMap = new OnclickFuncMap(); 
    this.textContainer = new TextContainer(this.titleParentSelector, this.textParentSelector);
		this.interactBtnList = this.#createInteractBtnList();
	}

	#createInteractBtnList() {
		let interactBtnList = [];
		this.interactBtnNameList.forEach((btnName) => {
			let interactBtn = new ButtonEle(this.interactSelector, btnName);

			let funcName = btnName.replace(' ', '');  // New Text => NewText
			funcName = funcName[0].toLowerCase() + funcName.slice(1);  // NewText => newText
      let onclickFunc = this.btnOnclickFuncMap[funcName];
      
      interactBtn.ele.onclick = () => onclickFunc(this.textContainer); 
			interactBtnList.push(interactBtn);
		});
		return interactBtnList;
	}
}

class TextTitle {
	constructor(parentSelector) {
		this.parentSelector = parentSelector;

		this.ele = this.#createTitleInputEle();
		this.#appendInputEleTo();
	}

	getTitle() {
		return this.ele.value;
	}
	setTitle(value) {
		this.ele.value = value;
	}

	#createTitleInputEle() {
		let inputEle = document.createElement('input');
		inputEle.type = 'button';
    inputEle.readOnly = true;
		return inputEle;
	}

	#appendInputEleTo() { 
		document.querySelector(this.parentSelector).appendChild(this.ele);
	}
}

class TextArea {
	constructor(parentSelector, readOnly = false) {
		this.parentSelector = parentSelector;
    this.readOnly = readOnly;

		this.ele = this.#createTextareaEle();
		this.#appendTextareaTo();
	}

	getText() {
		return this.ele.value;
	}
	setText(value) {
		this.ele.value = value;
	}

	#createTextareaEle() {
		let textareaEle = document.createElement('textarea');
    textareaEle.readOnly = this.readOnly;
		textareaEle.placeholder = this.readOnly ? '' : "Start your text here";
		return textareaEle;
	}

	#appendTextareaTo() {  
		document.querySelector(this.parentSelector).appendChild(this.ele);
	}
}

class TextContainer {
  constructor(titleParentSelector, textParentSelector) {
    this.titleParentSelector = titleParentSelector;
    this.textParentSelector = textParentSelector;

    this.#createWelcomeArea();
  }

  #createWelcomeArea() {
    let welcomePage = new TextArea(this.textParentSelector, true);
    welcomePage.ele.style.fontSize = '20px';
    let value = `\n\n    Welcome!\n\n    Please click 'New Text' button to start your new text!`;
    welcomePage.setText(value);
    welcomePage.ele.classList.add('visible');
    welcomePage.ele.id = 'welcome';

    this.titleMap = { welcomePage: null };
    this.textMap = { welcomePage: welcomePage };
    this.titleShown = 'welcomePage';
  }

  isWelcomePage(textObj) {
    let textArea = Object.values(textObj)[0];
    if (textArea.ele.id === 'welcome') {
      return true;
    } else {
      return false;
    }
  }

  getVisibleTextObj() {
    let title = Object.keys(this.textMap).filter((title) => this.textMap[title].ele.className.indexOf('visible') > -1)[0];
    let result = {};
    result[title] = this.textMap[title];
    return result;
  }

  add(title, text='') {
    let textTitle = new TextTitle(this.titleParentSelector); 
    let textArea = new TextArea(this.textParentSelector);
    textTitle.setTitle(title);
    textArea.setText(text);
    
    let titleMap = this.titleMap;
    let textMap = this.textMap;
    titleMap[title] = textTitle;
    textMap[title] = textArea;

    this.titleMap = titleMap;
    this.textMap = textMap;
    this.titleShown = title;

    this.showTarget(this.titleMap, this.textMap, this.titleShown);

    textTitle.ele.onclick = () => {
      this.titleShown = textTitle.getTitle();
      this.showTarget(this.titleMap, this.textMap, this.titleShown);
    };
  }

  remove(title) {
    let titleMap = this.titleMap; 
    let textMap = this.textMap;

    let idx = Object.keys(titleMap).indexOf(title);

    titleMap[title].ele.remove();
    textMap[title].ele.remove();
    delete titleMap[title];
    delete textMap[title];  

    this.titleMap = titleMap;
    this.textMap = textMap;
    this.titleShown = Object.keys(this.titleMap)[idx-1];

    this.showTarget(this.titleMap, this.textMap, this.titleShown);
  }

  showTarget(titleMap, textMap, titleShown) {
    Object.keys(titleMap).forEach((title) => { 
      if (titleMap[title]) { 
        titleMap[title].ele.classList.toggle('visible', title === titleShown);
      }
      if (textMap[title]) {
        textMap[title].ele.classList.toggle('visible', title === titleShown);
      }
    });
  }
}

class SpanEle {
  constructor(innerText) {
    this.innerText = innerText;
    this.ele = this.#createSpanEle();
  }

  #createSpanEle() {
    let span = document.createElement('span');
    span.innerText = this.innerText;
    return span;
  }
}

class ButtonEle {
	constructor (parentSelector, spanInnerText) {
		this.parentSelector = parentSelector;
		this.spanInnerText = spanInnerText;

		this.ele = this.#createBtnEle();
		this.#appendBtnEleTo();
	}

	#createBtnEle() {
		let buttonEle = document.createElement('button');
		let span = new SpanEle(this.spanInnerText);
		buttonEle.appendChild(span.ele);
		buttonEle.type = 'button';
		return buttonEle;
	}

	#appendBtnEleTo() {
		document.querySelector(this.parentSelector).appendChild(this.ele);
	}
}

class OnclickFuncMap {
	constructor() {  

	}

  newText(textContainer) { 
    let title = prompt('Please input the title:', '');
    if (title === null) {
      return;
    }
    while (localStorage.getItem(title)) {
      title = prompt('Title already exists in the local storage!', '');
      if (title === null) {
        return;
      }
    }
    if (title) {
      textContainer.add(title);
    }
	}

	openText(textContainer) {
		let title = prompt('Please input the title:', '');
		if (title === null) {
			return;
		} 

    while (localStorage.getItem(title) === null) {
      title = prompt('Text does NOT exists in the local storage!', '');
      if (title === null) {
        return;
      }
    }

    let text = localStorage.getItem(title);
    textContainer.add(title, text);
	}

  rename(textContainer) {
    let visibleTextObj = textContainer.getVisibleTextObj();  
    if (textContainer.isWelcomePage(visibleTextObj)) {
      return;
    }

    let newTitle = prompt('Rename the text:', '');
    while (newTitle === '') {
      newTitle = prompt('Title should NOT be empty!', '');
      if (newTitle === null) {
        return;
      }
    }

    while (localStorage.getItem(newTitle)) {
			newTitle = prompt('Title already exists in the local storage!', '');
      if (newTitle === null) {
        return;
      }
		}

    let title = Object.keys(visibleTextObj)[0]; 
    let textTitle = textContainer.titleMap[title];
    textTitle.setTitle(newTitle);

    let text = localStorage.getItem(title);
    if (text) { 
      localStorage.removeItem(title);
      localStorage.setItem(newTitle, text);
    }
  }

	save(textContainer) {
    let visibleTextObj = textContainer.getVisibleTextObj();  
    if (textContainer.isWelcomePage(visibleTextObj)) {
      return;
    }

		let title = Object.keys(visibleTextObj)[0]; 
		let text = Object.values(visibleTextObj)[0].getText();

    if (localStorage.getItem(title)) {
			alert('Title already exists in the local storage!', '');
		} else {
      localStorage.setItem(title, text);
      alert("Successfully saved!");
    }
	}

	saveAs(textContainer) {
    let visibleTextObj = textContainer.getVisibleTextObj(); 
    if (textContainer.isWelcomePage(visibleTextObj)) {
      return;
    }

		let newTitle = prompt('Save as:', '');
    while (newTitle === '') {
      newTitle = prompt(`Title shouldn't be empty!`, '');
      if (newTitle === null) {
        return;
      }
    }

		while (localStorage.getItem(newTitle)) {
			newTitle = prompt('Title already exists in the local storage!', '');
      if (newTitle === null) {
        return;
      }
		}

		let text = Object.values(visibleTextObj)[0].getText();
		localStorage.setItem(newTitle, text);
		alert("Successfully saved!");
	}

	closeText(textContainer) {
    let visibleTextObj = textContainer.getVisibleTextObj();
    if (textContainer.isWelcomePage(visibleTextObj)) {
      return;
    }

    let title = Object.keys(visibleTextObj)[0];
    let text = Object.values(visibleTextObj)[0].getText();
		if (text === localStorage.getItem(title) || confirm('Do you wanna leave without save?')) {
			textContainer.remove(title);
		}
	}
}