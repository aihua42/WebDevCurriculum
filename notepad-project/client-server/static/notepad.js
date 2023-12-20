class Notepad {
	/* TODO: 그 외에 또 어떤 클래스와 메소드가 정의되어야 할까요? */
	constructor(titleParentSelector, textParentSelector, interactSelector, interactBtnNameList) {
		this.titleParentSelector = titleParentSelector;
		this.textParentSelector = textParentSelector;
		this.interactSelector = interactSelector;
		this.interactBtnNameList = interactBtnNameList;
    
    this.textContainer = new TextContainer(this.titleParentSelector, this.textParentSelector);
		this.interactBtnList = this.#createInteractBtnList();
	}

	#createInteractBtnList() {  
		const interactBtnList = [];
		this.interactBtnNameList.forEach((btnName) => {
			const interactBtn = new ButtonEle(this.interactSelector, btnName);

			let funcName = btnName.replace(' ', '');  // New Text => NewText
			funcName = funcName[0].toLowerCase() + funcName.slice(1);  // NewText => newText
      const onclickFunc = onclickFuncMap[funcName]; 
      
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

    this.#createWelcomeText();
  }

  #createWelcomeText() {
    const welcomeText = new TextArea(this.textParentSelector, true);
    welcomeText.ele.style.fontSize = '20px';
    const value = `\n\n    Welcome!\n\n    Please click 'New Text' button to start your new text!`;
    welcomeText.setText(value);
    welcomeText.ele.classList.add('active');
    welcomeText.ele.id = 'welcome';

    this.titleMap = { welcomeText: null };
    this.textMap = { welcomeText: welcomeText };
    this.activeTitle = 'welcomeText';
  }

  isWelcomeText(textObj) {
    const textArea = Object.values(textObj)[0];
    if (textArea.ele.id === 'welcome') {
      return true;
    } else {
      return false;
    }
  }

  getActiveTextObj() {
    const title = Object.keys(this.textMap).filter((title) => this.textMap[title].ele.className.indexOf('active') > -1)[0];
    const result = {};
    result[title] = this.textMap[title];
    return result;
  }

  add(title, text = '') { 
    const textTitle = new TextTitle(this.titleParentSelector); 
    const textArea = new TextArea(this.textParentSelector);
    textTitle.setTitle(title);
    textArea.setText(text);

    this.mapAddKeyVal('titleMap', title, textTitle);
    this.mapAddKeyVal('textMap', title, textArea);
    
    this.showTarget(title);

    textTitle.ele.onclick = () => {  
      this.showTarget(textTitle.getTitle());
    };

    this.#makeXBtnClickable(textTitle, textArea);
  }

  mapAddKeyVal(mapType, key, value) {
    const map = this[mapType]; 
    map[key] = value;
    this[mapType] = map;
  }

  #makeXBtnClickable(textTitle, textArea) { 
    const title = textTitle.getTitle();
    if (title === 'welcomeText') {
      return;
    }

    const text = textArea.getText();
    const xBtn = textTitle.btnEle; 
    xBtn.onclick = async (event) => {  
      event.stopPropagation();

      const textSaved = await fetchGet(title); 
      if (textSaved === text || confirm('Okay to leave without save?')) { 
        this.remove(title);
      } 
    };
  }

  remove(title) {     
    const idx = Object.keys(this.titleMap).indexOf(title); 
    
    this.mapDeleteKeyVal('titleMap', title);
    this.mapDeleteKeyVal('textMap', title);
    
    if (title === this.activeTitle) {
      this.showTarget(Object.keys(this.titleMap)[idx-1]);
    }
  }

  mapDeleteKeyVal(mapType, key) {
    const map = this[mapType];  
    map[key].ele.remove();
    delete map[key];

    this[mapType] = map;
  }

  showTarget(activeTitle) {
    const titleMap = this.titleMap;
    const textMap = this.textMap;
    this.activeTitle = activeTitle;

    Object.keys(titleMap).forEach((title) => {  
      if (titleMap[title]) {  
        titleMap[title].ele.classList.toggle('active', title === activeTitle);
      }
      if (textMap[title]) {
        textMap[title].ele.classList.toggle('active', title === activeTitle);
      }
    });
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

const onclickFuncMap = {
  async newText(textContainer) { 
    let title = prompt('Input the title:', '');
    if (title === null || title === '') {
      return;
    }

    const text = await fetchGet(title);  
    if (text !== null) {
      alert('Title already exists in the system!');
      return;
    }

    textContainer.add(title, '');
	},

	async open(textContainer) {
		const title = prompt('Input title of the text to open:', '');
		if (title === null || title === '') {
			return;
		} 
    
    if (Object.keys(textContainer.titleMap).indexOf(title) > -1) {
      textContainer.showTarget(title);
      return;
    }

    const text = await fetchGet(title);  
    if (text !== null) {
      textContainer.add(title, text, null);
    } else {
      alert('Text NOT found!');
    }
	},

  async rename(textContainer) {
    const activeTextObj = textContainer.getActiveTextObj(); // { strOfTitle: instance of TextArea }
    if (textContainer.isWelcomeText(activeTextObj)) {
      return;
    }

    const title = Object.keys(activeTextObj)[0]; 
    let newTitle = prompt('Input the new title:', '');
    if (newTitle === null || newTitle === '' || newTitle === title) {
      return;
    }

    const findText = await fetchGet(newTitle);  
    if (findText !== null) {
      alert('Title already exists in system!');
      return;
    }
    
    const textTitle = textContainer.titleMap[title];
    textTitle.setTitle(newTitle);

    const textArea = textContainer.textMap[title];
    const text = textArea.getText();

    const textSaved = await fetchGet(title); 
    if (textSaved !== null) { 
      await fetchPatch('title', title, newTitle);  // update the title immediately
      alert('Successfully renamed!');
    } 

    textContainer.add(newTitle, text);
    textContainer.remove(title);
  },
  
	async save(textContainer) {   
    const activeTextObj = textContainer.getActiveTextObj();  
    if (textContainer.isWelcomeText(activeTextObj)) {
      return;
    }

		const title = Object.keys(activeTextObj)[0]; 
		const text = Object.values(activeTextObj)[0].getText();

    const textSaved = await fetchGet(title); 

    if (textSaved === null) {
      fetchPost(title, text);  // add to directory
    } else if (text === textSaved) {
      alert('Already saved!');
    } else {
      fetchPatch('text', textSaved, text);  // update the text
    } 
	},

	async saveAs(textContainer) {
    const activeTextObj = textContainer.getActiveTextObj(); 
    if (textContainer.isWelcomeText(activeTextObj)) {
      return;
    }

		let newTitle = prompt('Save as:', '');
    if (newTitle === null || newTitle === '') {
      return;
    }

    const findText = await fetchGet(newTitle); 
    if (findText !== null) {
      alert('Title already exists in the system, please rename!', '');
      return;
    }

		const text = Object.values(activeTextObj)[0].getText();
    fetchPost(newTitle, text);
	},

  delete(textContainer) {
    const activeTextObj = textContainer.getActiveTextObj();
    if (textContainer.isWelcomeText(activeTextObj)) {
      return;
    }

    const title = Object.keys(activeTextObj)[0]; 
    fetchDelete(title);
    textContainer.remove(title);
  }
}

// fetch functions
async function fetchGet(title) {
  const url = 'http://localhost:8000/texts/' + title;
  
  try {
    const res = await fetch(url);  
    if (!res.ok) {
      return null;
    } else {
      const data = await res.text();
      return data;
    }
  } catch(err) {  
    return null;
  }
}

function fetchPost(title, text) {
  const url = 'http://localhost:8000/texts';
  const data = { title, text };
 
  fetch(url, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    },
    body: JSON.stringify(data)
  })
  .then((res) => {
    if (res.ok) {
      alert("Successfully saved!");
    } else {
      alert('Title already exists in the system!', '');
    }
  })
  .catch((err) => { 
    alert('Title already exists in the system!', '');
  });
}

async function fetchPatch(key, preVal, newVal) {
  const url = 'http://localhost:8000/texts/' + preVal;
  const updatedData = {};
  updatedData[key] = newVal;

  try {
    const res = await fetch(url, {
      method: 'PATCH',
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      },
      body: JSON.stringify(updatedData)
    });

    if (!res.ok) {
      return false;
    } else {
      return true;
    }
  } catch(err) {
    return false;
  }
}

function fetchDelete(title) {
  const url = 'http://localhost:8000/texts/' + title;
  
  fetch(url, {
    method: 'DELETE'
  })
  .then((res) => {
    if (res.ok) {
      alert("Text is deleted!");
    }  
  })
  .catch((err) => {});
}
