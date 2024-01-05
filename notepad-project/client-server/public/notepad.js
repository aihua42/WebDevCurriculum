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
    this.#showPrevTabs();
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

  async #showPrevTabs() {  // page reload 할때마다 실행된다. 중간에 쿠키 만료되면 에러 생김
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
    
    const url2 = `http://localhost:8000/user/${id}`;
    await fetch(url2, {
      method: 'GET',
      credentials: 'include'  // for cors, must be set include. unless can't send session values which api server set
    })
    .then(async (res) => {
      console.log('res status code when open the user page: ', res.status);
      if (res.status === 401) {
        console.log('Try to refresh the cookie when receiving tabs...');

        const result = await refreshCookie(id);
        if (result) {  
          const res = await fetch(url2, {
            method: 'GET',
            credentials: 'include'  // for cors, must be set include. unless can't send session values which api server set
          });

          return res.json();
        } else {
          throw new Error('Fail to refresh the cookie when refresh the page');
        }
      }

      return res.json(); 
    })
    .then((tabs) => {
      console.log(`${id}'s tabs received:`, tabs);

      const activeTitle = tabs.activeTitle;

      const texts = tabs.texts;
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
      console.log(`${id}'s first log in`);
      // new user는 저장되어 있는 previous tabs 없음. texts.forEach 문에서 걸리지만 무시
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
    console.log(`remove title of index: ${idxRemove}`, title);
    
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
    console.log('GET in newText: ', textJson);

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
    console.log('GET in open: ', textJson);

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
    console.log('GET in rename working on newTitle: ', findTextJson);

    if (findTextJson.text !== null) {
      alert('Title already exists in system!');
      return;
    }
    
    const textMap = textContainer.textMap;
    const titleMap = textContainer.titleMap;
    const textTitle = titleMap[title];
    textTitle.setTitle(newTitle);


    const textSavedJson = await fetchGet(title, textContainer.userId); 
    console.log('GET in rename working on title: ', textSavedJson);

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
    console.log('GET in save: ', textSavedJson);
    
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
    console.log('GET in saveAs: ', findTextJson);

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

    // if user logout successfully, then send the tabs to the appi server
    const tabs = {};
    tabs.userId = id;
    tabs.activeTitle = textContainer.activeTitle;
    tabs.texts = [];

    const textMap = textContainer.textMap;
    Object.keys(textMap).forEach((title) => {
      const titleNtext = {};
      titleNtext.title = title;
      titleNtext.text = textMap[title].getText();

      tabs.texts.push(titleNtext);
    });
    console.log('user tabs: ', tabs);

    const urlLogout = 'http://localhost:8000/logout';
    await fetch(urlLogout, {
      method: 'POST',
      credentials: 'include',  // for cors, must be set include, unless can't send session values which api server set
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id, tabs })
    })
    .then(async (res) => {
      if (res.status === 401) {
        console.log('Try to refresh the cookie when logging out...');

        const result = await refreshCookie(id);
        if (result) {
          const res = await fetch(urlLogout, {
            method: 'POST',
            credentials: 'include',  // for cors, must be set include, unless can't send session values which api server set
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id, tabs })
          });

          return res;
        } else {
          throw new Error('Fail to refresh the cookie when log out');
        }
      }

      return res;
    })
    .then((res) => {
      if (!res.ok) {
        alert('Failed to log out!');
        return;
      }

      if (res.status === 500) {
        alert(`Logouted user, can't logout again`);
        return;
      }
      alert('See you next time!', '');

      const url2 = 'http://localhost:3000';
      window.location.href = url2;
    })
    .catch((err) => {
      console.error('Error message from API server during log out; ', err);
    })
  }
}

// fetch function for refreshing the session ID or token
async function refreshCookie(userId) {
  const url = 'http://localhost:8000/auth';
  try {
    const res = await fetch(url, {
      method: 'POST',
      credentials: 'include',  // for cors, must be set include, unless can't send session values which api server set
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userId })
    });

    if (!res.ok) {
      return false;
    } else {
      return true;
    }
  } catch (err) {
    return false;
  }
}



// create text id
function trasformStr(str) {
  return str.replaceAll(' ', '-').toLowerCase();
}

// fetch functions for 'New Text', 'Open', 'Rename', 'Save', 'Save As', 'Delete' buttons
async function fetchGet(title, userId) {
  const id = trasformStr(title);
  const url = `http://localhost:8000/user/${userId}/${id}`;
  
  try {
    const res = await fetch(url, {
      method: 'GET',
      credentials: 'include',  // for cors, must be set include, unless can't send session values which api server set
    });  

    if (res.status === 401) {  // need to refresh the session ID or token
      console.log(`Try to refresh the cookie in fetchGet title: ${title}`);

      const result = refreshCookie(userId);
      if (result) {
        return await fetchGet(title, userId);
      } else {
        console.error(`Fail to refresh the cookie in fetchGet title: ${title}`);
      }
    } else if (res.status === 204) {
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
  const url = 'http://localhost:8000/user/' + userId;
  const id = trasformStr(title);
  const data = { id, title, text };
 
  await fetch(url, {
    method: 'POST',
    credentials: 'include',  // for cors, must be set include, unless can't send session values which api server set
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    },
    body: JSON.stringify(data)
  })
  .then(async (res) => {
    if (res.status === 401) {  // need to refresh the session ID or token
      console.log(`Try to refresh the cookie in fetchPost title: ${title}`);

      const result = await refreshCookie(userId);
      if (result) {
        await fetchPost(title, text, userId);
      } else {
        console.error(`Fail to refresh the cookie in fetchPOST title: ${title}`);
      }
      return;
    }

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
      credentials: 'include',  // for cors, must be set include, unless can't send session values which api server set
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      },
      body: JSON.stringify(updatedData)
    });

    if (res.status === 401) {
      console.log(`Try to refresh the cookie in fetchPatch title: ${title}`);
      const result = await refreshCookie(userId);
      if (result) {
        return await fetchPatch(id, key, vals, userId);
      } else {
        console.error(`Fail to refresh the cookie in fetchPatch target: ${id}`);
        return false;
      }
    } else if (!res.ok) {
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
    method: 'DELETE',
    credentials: 'include',  // for cors, must be set include, unless can't send session values which api server set
  })
  .then(async (res) => {
    if (res.status === 401) {
      console.log(`Try to refresh the cookie in fetchDelete title: ${title}`);

      const result = await refreshCookie(userId);
      if (result) {
        await fetchDelete(title, userId);
      } else {
        console.error(`Fail to refresh the cookie in fetchDelete title: ${title}`);
      }
    } else if (res.ok) {
      alert("Text is deleted!");
    }  
  });
}
