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
		const interactBtnList = [];
		this.interactBtnNameList.forEach((btnName) => {
			const interactBtn = new ButtonEle(this.interactSelector, btnName);

			let funcName = btnName.replace(' ', '');  // New Text => NewText
			funcName = funcName[0].toLowerCase() + funcName.slice(1);  // NewText => newText
      const onclickFunc = this.btnOnclickFuncMap[funcName];
      
      interactBtn.ele.onclick = () => onclickFunc(this.textContainer); 
			interactBtnList.push(interactBtn);
		});
		return interactBtnList;
	}
}

class TextTitle {
	constructor(parentSelector) {
		this.parentSelector = parentSelector;

    this.inputEle = this.#createTitleInputEle();
    this.btnEle = this.#createTitleBtnEle();
		this.ele = this.#createTitleInputContainer();
		this.#appendInputEleTo();
	}

	getTitle() {
		return this.inputEle.value;
	}
	setTitle(value) {
		this.inputEle.value = value;
	}

	#createTitleInputEle() {
		const inputEle = document.createElement('input');
		inputEle.type = 'button';
    inputEle.readOnly = true;
		return inputEle;
	}

  #createTitleBtnEle() {
    const btnEle = document.createElement('button');
    const spanEle = document.createElement('span');
    spanEle.innerText = 'x';
    btnEle.appendChild(spanEle);
    return btnEle;
  }

  #createTitleInputContainer() {
    const divEle = document.createElement('div');
    divEle.append(this.inputEle, this.btnEle);
    return divEle;
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
		const textareaEle = document.createElement('textarea');
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
    const welcomePage = new TextArea(this.textParentSelector, true);
    welcomePage.ele.style.fontSize = '20px';
    const value = `\n\n    Welcome!\n\n    Please click 'New Text' button to start your new text!`;
    welcomePage.setText(value);
    welcomePage.ele.classList.add('visible');
    welcomePage.ele.id = 'welcome';

    this.titleMap = { welcomePage: null };
    this.textMap = { welcomePage: welcomePage };
    this.interactNameMap = { welcomePage: null } // newText, openText, Rename, save, saveAs, DeleteText
    this.titleShown = 'welcomePage';
  }

  isWelcomePage(textObj) {
    const textArea = Object.values(textObj)[0];
    if (textArea.ele.id === 'welcome') {
      return true;
    } else {
      return false;
    }
  }

  getVisibleTextObj() {
    const title = Object.keys(this.textMap).filter((title) => this.textMap[title].ele.className.indexOf('visible') > -1)[0];
    const result = {};
    result[title] = this.textMap[title];
    return result;
  }

  addMapKeyVal(mapType, key, value) {
    const map = this[mapType]; 
    map[key] = value;
    this[mapType] = map;
  }

  add(title, text, interactName) { 
    const textTitle = new TextTitle(this.titleParentSelector); 
    const textArea = new TextArea(this.textParentSelector);
    textTitle.setTitle(title);
    textArea.setText(text);

    this.addMapKeyVal('titleMap', title, textTitle);
    this.addMapKeyVal('textMap', title, textArea);
    this.addMapKeyVal('interactNameMap', title, interactName);
    this.titleShown = title;

    this.showTarget(this.titleMap, this.textMap, this.titleShown);

    textTitle.ele.onclick = () => {  
      this.titleShown = textTitle.getTitle();
      this.showTarget(this.titleMap, this.textMap, this.titleShown);
    };

    this.#makeXBtnClickable(textTitle, textArea);
  }

  removeMapKeyVal(mapType, key) {
    const map = this[mapType];  
    if (mapType !== 'interactNameMap') {
      map[key].ele.remove();
    }
    delete map[key];
    this[mapType] = map;
  }

  remove(title) {     
    const idx = Object.keys(this.titleMap).indexOf(title); 
    
    this.removeMapKeyVal('titleMap', title);
    this.removeMapKeyVal('textMap', title);
    this.removeMapKeyVal('interactNameMap', title);
    
    if (title === this.titleShown) {
      this.titleShown = Object.keys(this.titleMap)[idx-1];
    }
   
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

  #makeXBtnClickable(textTitle, textArea) { 
    const title = textTitle.getTitle();
    if (title === 'welcomePage') {
      return;
    }

    const xBtn = textTitle.btnEle; 
    xBtn.onclick = (event) => {
      event.stopPropagation();
      //event.stopImmediatePropagation();
      const text = textArea.getText();
      if (text === localStorage.getItem(title) || confirm('Do you wanna leave without save?')) { 
        this.remove(title);
      }
    };
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
    const span = document.createElement('span');
    span.innerText = this.spanInnerText;

		const buttonEle = document.createElement('button');
		buttonEle.appendChild(span);
		buttonEle.type = 'button';
		return buttonEle;
	}

	#appendBtnEleTo() {
		document.querySelector(this.parentSelector).appendChild(this.ele);
	}
}

class OnclickFuncMap {
	constructor() {}

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
      textContainer.add(title, '', 'newText');
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

    const text = localStorage.getItem(title);
    textContainer.add(title, text, 'openText');
	}

  rename(textContainer) {
    const visibleTextObj = textContainer.getVisibleTextObj();  
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

    const title = Object.keys(visibleTextObj)[0]; 
    const textTitle = textContainer.titleMap[title];
    textTitle.setTitle(newTitle);

    textContainer.removeMapKeyVal('interactNameMap', title);

    const text = localStorage.getItem(title);
    if (text !== null) {   // 이미 저장되어 있는 파일
      localStorage.removeItem(title);
      localStorage.setItem(newTitle, text);
      textContainer.addMapKeyVal('interactNameMap', newTitle, 'openText'); // update localStorage when save
    } else {
      textContainer.addMapKeyVal('interactNameMap', newTitle, 'newText'); // add to localStorage when save
    }
  }

	save(textContainer) {
    const visibleTextObj = textContainer.getVisibleTextObj();  
    if (textContainer.isWelcomePage(visibleTextObj)) {
      return;
    }

		const title = Object.keys(visibleTextObj)[0]; 
		const text = Object.values(visibleTextObj)[0].getText();

    if (textContainer.interactNameMap[title] === 'newText' && localStorage.getItem(title)) {
			alert('Title already exists in the local storage!', '');
		} else {
      localStorage.setItem(title, text);
      alert("Successfully saved!");
    }
	}

	saveAs(textContainer) {
    const visibleTextObj = textContainer.getVisibleTextObj(); 
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

		const text = Object.values(visibleTextObj)[0].getText();
		localStorage.setItem(newTitle, text);
		alert("Successfully saved!");
	}

  deleteText(textContainer) {
    const visibleTextObj = textContainer.getVisibleTextObj();
    if (textContainer.isWelcomePage(visibleTextObj)) {
      return;
    }

    const title = Object.keys(visibleTextObj)[0];
    textContainer.remove(title);
    localStorage.removeItem(title);
    textContainer.remove(title);
    alert("Text is deleted!");
  }
}