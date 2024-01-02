class Notepad {
	/* TODO: 그 외에 또 어떤 클래스와 메소드가 정의되어야 할까요? */
	constructor(titleParentSelector, textParentSelector, loginSelector, interactSelector, interactBtnNameList) {
		this.titleParentSelector = titleParentSelector;
		this.textParentSelector = textParentSelector;
    this.loginSelector = loginSelector;
		this.interactSelector = interactSelector;
		this.interactBtnNameList = interactBtnNameList;
    
    this.textContainer = new TextContainer(this.titleParentSelector, this.textParentSelector);
    this.#createLoginBtn();
		this.#createInteractBtnList();
    this.#getPrevTabs();
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

    this.interactBtnList = interactBtnList;
	}

  #createLoginBtn() {
    const btn = new ButtonEle(this.loginSelector, 'Login');
    btn.ele.onclick = () => onclickFuncMap['login']();
    this.loginBtn = btn;
  }

  async #getPrevTabs() {
    const url = window.location.href;
    const id = url.split('/user/')[1];
    const btn = this.loginBtn;

    if (!id) { // not login yet
      return;
    }
    
    const url2 = `http://localhost:3000/tabs/${id}`;
    
    await fetch(url2)
    .then((res) => {
      if (!res.ok) {
        console.log(`Failed to get ${id}'s pre-data: `, res);
        return;
      }
      return res.json(); 
    })
    .then((userData) => {
      console.log('userData: ', userData);

      const activeTitle = userData.activeTitle;
      this.textContainer.userId = id;  // 최초 로그인한 user는 userId가 null, 로그아웃 한적이 없기 때문

      const texts = userData.texts;
      texts.forEach((titleNtext) => {
        const title = titleNtext.title;
        const text = titleNtext.text;

        if (title !== 'welcomeText') {
          this.textContainer.add(title, text);
        }
      });
      this.textContainer.showTarget(activeTitle);
    })
    .catch((err) => {
      // new user는 저장되어 있는 데이터가 없음.
    });

    // login button changes to logout button
    btn.setSpanInnerText('Logout');
    btn.ele.onclick = () => onclickFuncMap['logout'](this.textContainer);
  }
}

class TextTitle {
	constructor(parentSelector) {
		this.parentSelector = parentSelector;

    this.#createTitleInputEle();
    this.#createTitleBtnEle();
		this.#createTitleInputContainer();
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
		this.inputEle = inputEle;
	}

  #createTitleBtnEle() {
    const btnEle = document.createElement('button');
    const spanEle = document.createElement('span');
    spanEle.innerText = 'x';
    btnEle.appendChild(spanEle);
    this.btnEle = btnEle;
  }

  #createTitleInputContainer() {
    const divEle = document.createElement('div');
    divEle.append(this.inputEle, this.btnEle);
    this.ele = divEle;
  }

	#appendInputEleTo() { 
		document.querySelector(this.parentSelector).appendChild(this.ele);
	}
}

class TextArea {
	constructor(parentSelector, readOnly = false) {
		this.parentSelector = parentSelector;
    this.readOnly = readOnly;

		this.#createTextareaEle();
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
		this.ele = textareaEle;
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
    this.userId = null;
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

      const textJsonSaved = await fetchGet(title, this.userId); 
      if (textJsonSaved.text === text || confirm('Okay to leave without save?')) { 
        this.remove(title);
      } 
    };
  }

  remove(title) {     
    const idxRemove = Object.keys(this.titleMap).indexOf(title); 
    console.log('remove title: ', idxRemove, title);
    
    if (title === this.activeTitle) {
      const idxActiveNext = idxRemove === 1 ? idxRemove+1 : idxRemove-1;
      const activeTitleNext = Object.keys(this.titleMap)[idxActiveNext];
      console.log('active title next: ', activeTitleNext);

      this.showTarget(activeTitleNext);
    }
    
    this.mapRemoveKeyVal('titleMap', title);
    this.mapRemoveKeyVal('textMap', title);
  }

  mapRemoveKeyVal(mapType, key) {
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

		this.#createBtnEle();
		this.#appendBtnEleTo();
	}

  setSpanInnerText(text) {
    this.spanInnerText = text;
    this.ele.querySelector('span').innerText = text;
  }

	#createBtnEle() {
    const span = document.createElement('span');
    span.innerText = this.spanInnerText;

		const buttonEle = document.createElement('button');
		buttonEle.appendChild(span);
		buttonEle.type = 'button';
		this.ele = buttonEle;
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

    const textJson = await fetchGet(title, textContainer.userId); 
    console.log('GET newText: ', textJson);

    if (textJson.text !== null) { 
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

    const textJson = await fetchGet(title, textContainer.userId);   
    console.log('GET open: ', textJson);

    if (textJson.text !== null) {  
      textContainer.add(textJson.title, textJson.text);
    } else {
      alert('Text NOT found!');
    }
	},

  async rename(textContainer) {
    const activeTextObj = textContainer.getActiveTextObj(); // { title of text: instance of TextArea }
    if (textContainer.isWelcomeText(activeTextObj)) {
      return;
    }

    const title = Object.keys(activeTextObj)[0]; 
    let newTitle = prompt('Input the new title:', '');
    if (newTitle === null || newTitle === '' || newTitle === title) {
      return;
    }

    const findTextJson = await fetchGet(newTitle, textContainer.userId);  
    console.log('GET rename newTitle: ', findTextJson);

    if (findTextJson.text !== null) {
      alert('Title already exists in system!');
      return;
    }
    
    const textMap = textContainer.textMap;
    const titleMap = textContainer.titleMap;
    const textTitle = titleMap[title];
    textTitle.setTitle(newTitle);


    const textSavedJson = await fetchGet(title, textContainer.userId); 
    console.log('GET rename title: ', textSavedJson);

    if (textSavedJson.text !== null) { 
      const textId = trasformStr(newTitle);
      await fetchPatch(textId, 'title', [title, newTitle], textContainer.userId);  // update the title immediately

      alert('Successfully renamed!');
    } 

    const keys = Object.keys(textTitle);
    keys.forEach((key) => {
      if (key === title) {
        titleMap[newTitle] = titleMap[title];
        textMap[newTitle] = textMap[title];
      
        delete titleMap[title];
        delete textMap[title];
      }
    });

    textContainer.titleMap = titleMap;
    textContainer.textMap = textMap;
  },
  
	async save(textContainer) {   
    const activeTextObj = textContainer.getActiveTextObj();  
    if (textContainer.isWelcomeText(activeTextObj)) {
      return;
    }

		const title = Object.keys(activeTextObj)[0]; 
		const text = Object.values(activeTextObj)[0].getText();

    const textSavedJson = await fetchGet(title, textContainer.userId); 
    console.log('GET save: ', textSavedJson);
    
    if (textSavedJson.title === null) {
      fetchPost(title, text, textContainer.userId);  // add to directory
    } else if (text === textSavedJson.text) {
      alert('Already saved!');
    } else {
      const textId = trasformStr(title);
      await fetchPatch(textId, 'text', [textSavedJson.text, text], textContainer.userId);  // update the text
      alert('Successfully saved!');
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

    const findTextJson = await fetchGet(newTitle, textContainer.userId); 
    console.log('GET saveAs: ', findTextJson);

    if (findTextJson.text !== null) {
      alert('Title already exists in the system, please rename!', '');
      return;
    }

    
		const text = Object.values(activeTextObj)[0].getText();
    fetchPost(newTitle, text, textContainer.userId);
	},

  delete(textContainer) {
    const activeTextObj = textContainer.getActiveTextObj();
    if (textContainer.isWelcomeText(activeTextObj)) {
      return;
    }

    const title = Object.keys(activeTextObj)[0]; 
    textContainer.remove(title);
    fetchDelete(title, textContainer.userId);
  },

  async login() {
    const url = 'http://localhost:3000/login';
    window.location.href = url;
  },

  async logout(textContainer) {
    const id = textContainer.userId;

    const userData = {};
    userData.userId = id;
    userData.activeTitle = textContainer.activeTitle;
    userData.texts = [];

    const textMap = textContainer.textMap;
    Object.keys(textMap).forEach((title) => {
      const titleNtext = {};
      titleNtext.title = title;
      titleNtext.text = textMap[title].getText();

      userData.texts.push(titleNtext);
    });
    console.log('pre data: ', userData);
   
    try {
      const url = 'http://localhost:3000/logout';

      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });
   
      if (!res.ok) {
        console.log('Failed to log out', res);
        return;
      }

      alert('See you next time!', '');
     
      const url2 = 'http://localhost:3000';
      window.location.href = url2;
    } catch (err) {
      console.error('Error during log out,', err);
    }
  }
}

// fetch functions for port 8000
async function fetchGet(title, userId) {
  const id = trasformStr(title);
  const url = `http://localhost:8000/user/${userId}/${id}`;
  
  try {
    const res = await fetch(url);  
    console.log(`fetchGet ${title}: `, res);

    if (res.status === 204) {
      return { id: null, title: null, text: null };
    } else if (res.ok) {
      const dataString = await res.text();
      const data = JSON.parse(dataString);
      console.log(`fetchGet data of ${title}: `, data);

      if (data.title !== title) {
        return { id: data.id, title: title, text: data.text };
      } else {
        return data;
      }
    } else {
      console.error('Unexpected error: ', res.status);
    }
  } catch(err) {  
    console.error('Error:', err.message);
  }
}

async function fetchPost(title, text, userId) {
  const url = 'http://localhost:8000/' + userId;
  const id = trasformStr(title);
  const data = { id, title, text };
 
  await fetch(url, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    },
    body: JSON.stringify(data)
  })
  .then((res) => {
    console.log(`fetchPost ${title}: `, res);

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

async function fetchPatch(id, key, vals, userId) {
  const url = `http://localhost:8000/user/${userId}/${key}`;
  const preVal = vals[0];
  const newVal = vals[1];
  const updatedData = {
    id: id,
    before: preVal,
    after: newVal
  };

  try {
    const res = await fetch(url, {
      method: 'PATCH',
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      },
      body: JSON.stringify(updatedData)
    });
    console.log(`fetchPatch of ${key}: `, res);

    if (!res.ok) {
      return false;
    } else {
      return true;
    }
  } catch(err) {
    return false;
  }
}

async function fetchDelete(title, userId) {
  const id = trasformStr(title);
  const url = `http://localhost:8000/user/${userId}/${id}`;
  
  await fetch(url, {
    method: 'DELETE'
  })
  .then((res) => {
    console.log(`fetchDelete ${title}: `, res);

    if (res.ok) {
      alert("Text is deleted!");
    }  
  });
}

function trasformStr(str) {
  return str.replaceAll(' ', '-').toLowerCase();
}
