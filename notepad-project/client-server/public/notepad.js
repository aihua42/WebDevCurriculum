class Notepad {
	constructor(titleParentSelector, textParentSelector, loginSelector, interactSelector, interactBtnNameList) {
		this.titleParentSelector = titleParentSelector;
		this.textParentSelector = textParentSelector;
    this.loginSelector = loginSelector;
		this.interactSelector = interactSelector;
		this.interactBtnNameList = interactBtnNameList;
    
    this.textContainer = new TextContainer(this.titleParentSelector, this.textParentSelector);
    this.#createLoginBtn();
		this.#createInteractBtnList();
    this.#loadPrevTabs();
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

  async #loadPrevTabs() {  // page reload 할때마다 실행된다. 
    const url = window.location.href;
    const id = url.split('/user/')[1];
    const btn = this.loginBtn;

    if (!id) { // invalid url
      console.log('Hello Page!');
      return;
    }

    // 일단 웰컴 페이지를 만든다
    this.textContainer.textMap.welcomeText.setText(`\n\n    Welcome!\n\n    Please click 'New Text' button to start your new text!`);

    this.textContainer.userId = id; 
    console.log(`Trying to get the previous tabs ${this.textContainer.userId}(${id}) worked on...`);
    
    const url2 = `https://localhost:8000/user/${id}`;
    const res = await fetch(url2, {
      method: 'GET',
      credentials: 'include'  // for cors, must be set include. unless can't send session values which api server set
    });

    if (res.status === 401) { // refresh accessToken if expired
      const result = refreshAccessToken(this.textContainer);

      if (result) {
        this.#loadPrevTabs();
      }

      return;
    } else if (!res.ok) {
      console.error('Error during loading previous tabs');
      return;
    }

    const prevTabs = await res.json();
    this.textContainer.setPrevTabs(prevTabs);

    // login button changes to logout button
    btn.setSpanInnerText('Logout');
    btn.ele.onclick = () => onclickFuncMap['logout'](this.textContainer);
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
    const value = '\n\n    Hello!\n\n    Please log in!'; 
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
    const textMap = this.textMap;
    const title = Object.keys(textMap).filter((title) => textMap[title].ele.className.includes('active'))[0];
    const result = {};
    result[title] = textMap[title];
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

      const foundText = await fetchGetText(title, this); 
      if (foundText === false) {
        return;
      }

      if (foundText['text'] === text || confirm('Okay to remove the tab without save?')) { 
        this.remove(title);
      } 
    };
  }

  remove(title) {     
    const idxRemove = Object.keys(this.titleMap).indexOf(title); 
    console.log(`remove title of index: ${idxRemove}`, title);
    
    const numTitles = Object.keys(this.titleMap).length;
    if (title === this.activeTitle) {
      const idxNextActive = (idxRemove === 1 && numTitles > 2) ? idxRemove+1 : idxRemove-1;
      const nextActiveTitle = Object.keys(this.titleMap)[idxNextActive];
      console.log('active title next: ', nextActiveTitle);

      this.showTarget(nextActiveTitle);
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

  setPrevTabs(prevTabs) {  
    console.log('prevTabs: ', prevTabs);

    if (prevTabs.tabs.length > 0) {
      const activeTitle = prevTabs.activeTitle;
      const { tabs } = prevTabs;
  
      tabs.forEach((titleNtext) => {
        const title = titleNtext.title;
        const text = titleNtext.text;
  
        if (title !== 'welcomeText') {
          this.add(title, text);
        }
      });
  
      this.showTarget(activeTitle);
    }
  } 

  getTabs() {
    const userId = this.userId;

    // if user logout successfully, then send the tabs to the api server
    const texts = {};
    texts.userId = userId;
    texts.activeTitle = this.activeTitle;
    texts.tabs = [];
  
    const textMap = this.textMap;
    Object.keys(textMap).forEach((title) => {
      const titleNtext = {};
      titleNtext.title = title;
      titleNtext.text = textMap[title].getText();
  
      texts.tabs.push(titleNtext);
    });
  
    return texts;
  }
}

const onclickFuncMap = {
  async newText(textContainer) {    
    let title = prompt('Input the title:', '');
    if (title === null || title === '') {
      return;
    }

    const textJson = await fetchGetText(title, textContainer); 
    console.log('GET in newText: ', textJson);

    if (textJson === false) {
      return;
    }

    if (textJson['title']) { 
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
    
    if (Object.keys(textContainer.titleMap).includes(title)) {  
      textContainer.showTarget(title);
      return;
    } 

    const textJson = await fetchGetText(title, textContainer);   
    console.log('GET in open: ', textJson);

    if (textJson === false) {
      return;
    }

    if (textJson['title']) {  
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

    const foundTextJson = await fetchGetText(newTitle, textContainer);  
    console.log('GET in rename, checking if the new title exists: ', foundTextJson);

    if (foundTextJson === false) {
      return;
    }

    if (foundTextJson['title']) {
      alert('New title already exists in the system!');
      return;
    }
    
    const textMap = textContainer.textMap;
    const titleMap = textContainer.titleMap;
    const textTitle = titleMap[title];
    textTitle.setTitle(newTitle);

    const textJson = await fetchGetText(title, textContainer); 
    console.log('GET in rename, get text info: ', textJson);

    if (textJson === false) {
      return;
    }

    if (textJson['title']) {  // text being renamed exists in the server, need to update the server as well
      const textId = transformStr(newTitle);
      const result = await fetchPatchText(textId, 'title', [title, newTitle], textContainer);  

      if (result === false) {
        return;
      }

      alert('Successfully renamed!');
    } 

    Object.keys(textTitle).forEach((key) => {
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

    const textJson = await fetchGetText(title, textContainer); 
    console.log('GET in save: ', textJson);

    if (textJson === false) {
      return;
    }
    
    if (!textJson['title']) { // brand-new text, add to the server
      const result = fetchPostText(title, text, textContainer); 
      
      if (result === false) {
        return;
      }
    } else if (text === textJson.text) {  // already exists in the server, no need to save
      alert('Saved already!');
    } else {  // already exists in the server, need to update
      const textId = transformStr(title);
      const result = await fetchPatchText(textId, 'text', [textJson.text, text], textContainer);  

      if (result === false) {
        return;
      }

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

    const textJson = await fetchGetText(newTitle, textContainer); 
    console.log('GET in saveAs: ', textJson);

    if (textJson === false) {
      return;
    }

    if (textJson['title']) {
      alert('Title already exists in the system, please rename!', '');
      return;
    }

		const text = Object.values(activeTextObj)[0].getText();
    fetchPostText(newTitle, text, textContainer);
	},

  async delete(textContainer) {
    const activeTextObj = textContainer.getActiveTextObj();
    if (textContainer.isWelcomeText(activeTextObj)) {
      return;
    }

    const title = Object.keys(activeTextObj)[0]; 
    const isDeleted = await fetchDeleteText(title, textContainer);

    if (isDeleted) {
      textContainer.remove(title);
      alert('Successfully deleted!');
    } else {
      alert('Failed to delete!');
      return;
    }
  },

  async login() {
    const url = 'https://localhost:3000/login';
    window.location.href = url;
  },

  async logout(textContainer, pageToGo='welcome') {
    const texts = textContainer.getTabs();
    console.log('user tabs to send: ', texts);

    const urlLogout = 'https://localhost:8000/logout';
    await fetch(urlLogout, {
      method: 'POST',
      credentials: 'include',  // for cors, must be set include, unless can't send session values which api server set
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(texts)
    }) 
    .then((res) => {  
      if (!res.ok) {
        alert('Failed to log out!');
        return;
      }

      localStorage.removeItem('refreshToken');

      alert('See you next time!');

      let urlToGo = '';
      if (pageToGo === 'login') {
        urlToGo = 'https://localhost:3000/login';
      } else {
        urlToGo = 'https://localhost:3000';
      }
      
      window.location.href = urlToGo;
    })
    .catch((err) => {
      console.error('Error during log out; ', err);
    })
  }
}

// create text id
function transformStr(str) {
  return str.replaceAll(' ', '-').toLowerCase();
}

// fetch function for refreshing the accessToken
async function refreshAccessToken(textContainer) {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) {
    return false;
  }

  const userId = textContainer.userId;
  const url = 'https://localhost:8000/token';

  try {
    const res = await fetch(url, {
      method: 'POST',
      credentials: 'include',  // for cors, must be set include, unless can't send session values which api server set
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userId, refreshToken })
    });

    if (res.status === 403) {  // refreshToken is expired, will be logged out and go to login page
      alert('Timeout, please login again!');
      onclickFuncMap.logout(textContainer,'login');

      return false;
    } else if (!res.ok) {
      throw new Error('Error during refresh the access token');
    } else {
      return true;
    }
  } catch (err) {
    throw err;
  }
}

async function fetchAfterTokenRefreshed(...params) {  // refresh the accessToken if get status 401
  let textContainer;
  let rest = [];

  params.forEach((param) => {
    if (param instanceof TextContainer) {
      textContainer = param;
    } else {
      rest.push(param);
    }
  });

  if (textContainer === undefined) {
    throw new Error(`No textContainer found`);
  }

  try {
    let res = await fetch(...rest);

    if (res.status === 401) {
      console.log(`Try to refresh the accessToken`);

      res = await refreshAccessToken(textContainer);
      if (res) {
        res = await fetch(...rest);
      }
    }

    return res;
  } catch (err) {
    throw err;
  }
}

// fetch functions for 'New Text', 'Open', 'Rename', 'Save', 'Save As', 'Delete' buttons
async function fetchGetText(title, textContainer) {
  console.log('textContainer: ', textContainer);
  const userId = textContainer.userId;
  const textId = transformStr(title);
  const url = `https://localhost:8000/user/${userId}/${textId}`;

  let texts = {};
  
  try {
    const res = await fetchAfterTokenRefreshed(url, {
      method: 'GET',
      credentials: 'include',  // for cors, must be set include, unless can't send session values which api server set
    }, textContainer);  

    if (!res.ok) {
      console.error('Error during fetchGet with status code: ', res.status);
    } else if (res.status !== 204) {
      texts = await res.json();
    }
  } catch (err) {
    console.error('Error: ', err);
  }

  return texts;
}

async function fetchPostText(title, text, textContainer) {
  const userId = textContainer.userId;
  const url = 'https://localhost:8000/user/' + userId;
  const textId = transformStr(title);
  const data = { textId, title, text };
  console.log('texts to send via fetch POST: ', data);
 
  await fetchAfterTokenRefreshed(url, {
    method: 'POST',
    credentials: 'include',  // for cors, must be set include, unless can't send session values which api server set
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    },
    body: JSON.stringify(data)
  }, textContainer)
  .then((res) => {
    if (res.ok) {
      alert("Successfully saved!");
    } else {
      alert('Title already exists in the system!', '');
    }
  })
  .catch((err) => {
    console.error('Error: ', err);
  });
}

async function fetchPatchText(textId, key, preNnewVals, textContainer) {
  const userId = textContainer.userId;
  const url = `https://localhost:8000/user/${userId}/${key}`;

  const preVal = preNnewVals[0];
  const newVal = preNnewVals[1];
  const updatedData = {
    textId,   // new, if title is changed
    before: preVal,
    after: newVal
  };

  try {
    const res = await fetchAfterTokenRefreshed(url, {
      method: 'PATCH',
      credentials: 'include',  // for cors, must be set include, unless can't send session values which api server set
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      },
      body: JSON.stringify(updatedData)
    }, textContainer);

    if (!res.ok) {
      console.error('Error during fetchPatch with status code: ', res.status);
      return false;
    } else if (res.status === 209) {
      alert('No changes to save!');
      return false;
    } else {
      return true;
    }
  } catch (err) {
    console.error('Error: ', err);
    return false;
  }
}

async function fetchDeleteText(title, textContainer) {
  const userId = textContainer.userId;
  const textId = transformStr(title);
  const url = `https://localhost:8000/user/${userId}/${textId}`;

  try {
    const res = await fetchAfterTokenRefreshed(url, {
      method: 'DELETE',
      credentials: 'include',  // for cors, must be set include, unless can't send session values which api server set
    }, textContainer);

    if (res.ok) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.error('Error: ', err);
    return false;
  }
}
