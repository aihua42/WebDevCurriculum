/* eslint-disable no-restricted-globals */ // confirm
/* eslint-disable max-classes-per-file */
/* eslint-disable max-len */
const __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
  function adopt(value) { return value instanceof P ? value : new P((resolve) => { resolve(value); }); }
  return new (P || (P = Promise))((resolve, reject) => {
    function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
    function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
    function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
function createBtn(spanInnerText) {
  const span = document.createElement('span');
  span.innerText = spanInnerText;
  const button = document.createElement('button');
  button.appendChild(span);
  button.type = 'button';
  return button;
}
class TextTitle {
  constructor(parentSelector) {
    this.parentSelector = parentSelector;
    this.ele = this.createTitleInputContainer();
  }

  createTitleInputContainer() {
    const inputEle = document.createElement('input');
    inputEle.type = 'button';
    inputEle.readOnly = true;
    const btnEle = createBtn('x');
    const divEle = document.createElement('div');
    divEle.append(inputEle, btnEle);
    const parentNode = document.querySelector(this.parentSelector);
    if (parentNode) {
      parentNode.appendChild(divEle);
    }
    return divEle;
  }

  makeTitleClickable(textContainer) {
    this.ele.onclick = () => {
      textContainer.showActiveNote(this.getTitle());
    };
  }

  getTitle() {
    const inputEle = this.ele.querySelector('input');
    return inputEle ? inputEle.value : '';
  }

  setTitle(value) {
    const inputEle = this.ele.querySelector('input');
    if (inputEle) {
      inputEle.value = value;
    }
  }

  setActive(force) {
    this.ele.classList.toggle('active', force);
  }

  remove(toBeRemoved) {
    let isRemoved = false;
    const xBtn = this.ele.querySelector('button');
    if (!xBtn) {
      return isRemoved;
    }
    xBtn.onclick = (event) => {
      event.stopPropagation();
      if (toBeRemoved || confirm('Are you sure to close the tab without saving?')) {
        this.ele.remove();
        isRemoved = true;
      }
    };
    return isRemoved;
  }
}
class TextArea {
  constructor(parentSelector, readOnly = false) {
    this.parentSelector = parentSelector;
    this.readOnly = readOnly;
    this.ele = this.createTextAreaEle();
  }

  createTextAreaEle() {
    const textareaEle = document.createElement('textarea');
    textareaEle.readOnly = this.readOnly;
    textareaEle.placeholder = this.readOnly ? '' : 'Start your text here';
    const parentNode = document.querySelector(this.parentSelector);
    if (parentNode) {
      parentNode.appendChild(textareaEle);
    }
    return textareaEle;
  }

  getText() {
    return this.ele.value;
  }

  setText(value, fontSize = '') {
    this.ele.value = value;
    if (fontSize) {
      this.ele.style.fontSize = fontSize;
    }
  }

  setActive(force) {
    this.ele.classList.toggle('active', force);
  }

  remove() {
    this.ele.remove();
  }
}
class TextContainer {
  constructor(titleParentSelector, textParentSelector) {
    this.titleParentSelector = titleParentSelector;
    this.textParentSelector = textParentSelector;
    this.noteList = this.createNoteList();
    this.activeTitle = 'welcomeText';
    this.userId = undefined;
  }

  createNoteList() {
    const welcomeText = new TextArea(this.textParentSelector, true);
    const value = '\n\n    Hello!\n\n    Please log in!';
    welcomeText.setText(value, '20px');
    welcomeText.setActive(true);
    const note = {
      title: 'welcomeText',
      textTitle: undefined,
      textArea: welcomeText,
    };
    return [note];
  }

  includes(title) {
    return this.noteList.some((note) => note.title === title);
  }

  getUser() {
    return this.userId;
  }

  setUser(userId) {
    this.userId = userId;
  }

  getActiveNote() {
    const { noteList } = this;
    const activeNote = noteList.find((note) => note.title === this.activeTitle);
    if (!activeNote) {
      console.error('Active tab is missing!');
    }
    return activeNote; // 무조건 Note를 return 해줘야 한다.
  }

  showActiveNote(activeTitle) {
    this.activeTitle = activeTitle;
    this.noteList.forEach((note) => {
      if (note.textTitle) {
        note.textTitle.setActive(note.title === activeTitle);
      }
      if (note.textArea) {
        note.textArea.setActive(note.title === activeTitle);
      }
    });
  }

  addNote(titleVal, textVal = '') {
    const textTitle = new TextTitle(this.titleParentSelector);
    textTitle.setTitle(titleVal);
    const textArea = new TextArea(this.textParentSelector);
    textArea.setText(textVal);
    const note = {
      title: titleVal,
      textTitle,
      textArea,
    };
    this.noteList.push(note);
    this.showActiveNote(titleVal);
    textTitle.makeTitleClickable(this);
    this.makeNoteRemovable(note);
  }

  makeNoteRemovable(note) {
    return __awaiter(this, void 0, void 0, function* () {
      const { title, textTitle, textArea } = note;
      if (title === 'welcomeText' || !textTitle) { // title = 'welcomeText'일때 textTitle = undefined
        return;
      }
      const foundText = yield fetchGetText(title, this);
      if (foundText === false) {
        return;
      }
      const text = textArea.getText();
      const removeCondition = !('text' in foundText) || foundText.text === text; // 빈 textarea거나 수정사항이 없을 때 그냥 닫음
      const isRemoved = textTitle.remove(removeCondition);
      if (isRemoved) {
        textArea.remove();
        this.removeNote(note);
      }
    });
  }

  removeNote(note) {
    const { title } = note;
    if (title === 'welcomeText') {
      return;
    }
    const { noteList } = this;
    const idxRemove = noteList.indexOf(note);
    console.log(`remove title of index: ${idxRemove}`);
    const numTitles = noteList.length;
    if (title === this.activeTitle) {
      const idxNextActive = (idxRemove === 1 && numTitles > 2) ? idxRemove + 1 : idxRemove - 1;
      const nextActiveTitle = noteList[idxNextActive].title;
      console.log('next active title: ', nextActiveTitle);
      this.showActiveNote(nextActiveTitle);
    }
    noteList.splice(idxRemove, 1);
  }

  setPrevTabs(prevTabs) {
    console.log('prevTabs: ', prevTabs);
    if (prevTabs.tabs.length > 0) {
      const { activeTitle, tabs } = prevTabs;
      tabs.forEach((titleNtext) => {
        const { title, text } = titleNtext;
        if (title !== 'welcomeText') {
          this.addNote(title, text);
        }
      });
      this.showActiveNote(activeTitle);
    }
  }

  getTabs() {
    const { userId, activeTitle, noteList } = this;
    // if user logout successfully, then send the tabs to the api server
    const texts = {
      userId,
      activeTitle,
      tabs: noteList.map((note) => ({
        title: note.title,
        text: note.textArea.getText(),
      })),
    };
    return texts;
  }
}
// create text id
function transformStr(str) {
  return str.replace(/ /g, '-').toLowerCase();
}
// login and logout
function login() {
  const url = 'https://localhost:3000/login';
  window.location.href = url;
}
function logout(textContainer, pageToGo = 'welcome') {
  return __awaiter(this, void 0, void 0, function* () {
    const tabs = textContainer.getTabs();
    console.log('user tabs to send: ', tabs);
    const urlLogout = 'https://localhost:8000/logout';
    yield fetch(urlLogout, {
      method: 'POST',
      credentials: 'include', // for cors, must be set include, unless can't send session values which api server set
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tabs),
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
      });
  });
}
// fetch function for refreshing the accessToken
function refreshAccessToken(textContainer) {
  return __awaiter(this, void 0, void 0, function* () {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      return false;
    }
    const userId = textContainer.getUser();
    const url = 'https://localhost:8000/token';
    const res = yield fetch(url, {
      method: 'POST',
      credentials: 'include', // for cors, must be set include, unless can't send session values which api server set
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, refreshToken }),
    });
    if (res.status === 403) { // refreshToken is expired, will be logged out and go to login page
      alert('Timeout, please login again!');
      logout(textContainer, 'login');
      return false;
    }
    if (!res.ok) {
      throw new Error('Error during refresh the access token');
    } else {
      return true;
    }
  });
}
function fetchAfterTokenRefreshed(...params) {
  return __awaiter(this, void 0, void 0, function* () {
    let textContainer;
    const rest = params.filter((param) => {
      if (param instanceof TextContainer) {
        textContainer = param;
        return false;
      }
      return true;
    });
    if (textContainer === undefined) {
      throw new Error('No textContainer found');
    }
    let res = yield fetch(...rest);
    if (res.status === 401) {
      console.log('Try to refresh the accessToken');
      const result = yield refreshAccessToken(textContainer);
      if (result) {
        res = yield fetch(...rest);
      }
    }
    return res;
  });
}
// fetch functions for 'New Text', 'Open', 'Rename', 'Save', 'Save As', 'Delete' buttons
function fetchGetText(title, textContainer) {
  return __awaiter(this, void 0, void 0, function* () {
    const userId = textContainer.getUser();
    const textId = transformStr(title);
    const url = `https://localhost:8000/user/${userId}/${textId}`;
    let text = false;
    try {
      const res = yield fetchAfterTokenRefreshed(url, {
        method: 'GET',
        credentials: 'include', // for cors, must be set include, unless can't send session values which api server set
      }, textContainer);
      if (!res.ok) {
        console.error('Error during fetchGet with status code: ', res.status);
      } else if (res.status !== 204) {
        text = yield res.json();
      } else {
        text = {};
      }
    } catch (err) {
      console.error('Error: ', err);
    }
    return text;
  });
}
function fetchPostText(title, text, textContainer) {
  return __awaiter(this, void 0, void 0, function* () {
    const userId = textContainer.getUser();
    const url = `https://localhost:8000/user/${userId}`;
    const textId = transformStr(title);
    const data = { textId, title, text };
    console.log('texts to send via fetch POST: ', data);
    yield fetchAfterTokenRefreshed(url, {
      method: 'POST',
      credentials: 'include', // for cors, must be set include, unless can't send session values which api server set
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify(data),
    }, textContainer)
      .then((res) => {
        if (res.ok) {
          alert('Successfully saved!');
        } else {
          alert('Title already exists in the system!');
        }
      })
      .catch((err) => {
        console.error('Error: ', err);
      });
  });
}
function fetchPatchText(textId, key, preNnewVals, textContainer) {
  return __awaiter(this, void 0, void 0, function* () {
    const userId = textContainer.getUser();
    const url = `https://localhost:8000/user/${userId}/${key}`;
    const preVal = preNnewVals[0];
    const newVal = preNnewVals[1];
    const updatedData = {
      textId, // new, when title is changed
      before: preVal,
      after: newVal,
    };
    try {
      const res = yield fetchAfterTokenRefreshed(url, {
        method: 'PATCH',
        credentials: 'include', // for cors, must be set include, unless can't send session values which api server set
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify(updatedData),
      }, textContainer);
      if (!res.ok) {
        console.error('Error during fetchPatch with status code: ', res.status);
        return false;
      }
      if (res.status === 209) {
        alert('No changes to save!');
        return false;
      }
      return true;
    } catch (err) {
      console.error('Error: ', err);
      return false;
    }
  });
}
function fetchDeleteText(title, textContainer) {
  return __awaiter(this, void 0, void 0, function* () {
    const userId = textContainer.getUser();
    const textId = transformStr(title);
    const url = `https://localhost:8000/user/${userId}/${textId}`;
    try {
      const res = yield fetchAfterTokenRefreshed(url, {
        method: 'DELETE',
        credentials: 'include', // for cors, must be set include, unless can't send session values which api server set
      }, textContainer);
      if (res.ok) {
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error: ', err);
      return false;
    }
  });
}
// New Text, Open, Rename, Save, Save As, Delete
const onclickFuncMap = {
  newText(textContainer) {
    return __awaiter(this, void 0, void 0, function* () {
      const title = prompt('Input the title:', '');
      if (title === null || title === '') {
        return;
      }
      const textJson = yield fetchGetText(title, textContainer);
      console.log('GET in newText: ', textJson);
      if (textJson === false) {
        return;
      }
      if ('title' in textJson) {
        alert('Title already exists in the system!');
        return;
      }
      textContainer.addNote(title, '');
    });
  },
  open(textContainer) {
    return __awaiter(this, void 0, void 0, function* () {
      const title = prompt('Input title of the text to open:', '');
      if (title === null || title === '') {
        return;
      }
      if (textContainer.includes(title)) {
        textContainer.showActiveNote(title);
        return;
      }
      const textJson = yield fetchGetText(title, textContainer);
      console.log('GET in open: ', textJson);
      if (textJson === false) {
        return;
      }
      if ('title' in textJson) {
        textContainer.addNote(textJson.title, textJson.text);
      } else {
        alert('Text NOT found!');
      }
    });
  },
  rename(textContainer) {
    return __awaiter(this, void 0, void 0, function* () {
      const activeNote = textContainer.getActiveNote();
      if (activeNote.title === 'welcomeText') {
        return;
      }
      const { title } = activeNote;
      const newTitle = prompt('Input the new title:', '');
      if (newTitle === null || newTitle === '' || newTitle === title) {
        return;
      }
      const foundTextJson = yield fetchGetText(newTitle, textContainer);
      console.log('GET in rename, checking if the new title exists: ', foundTextJson);
      if (foundTextJson === false) {
        return;
      }
      if ('title' in foundTextJson) {
        alert('New title is already stored!');
        return;
      }
      const textJson = yield fetchGetText(title, textContainer);
      console.log('GET in rename, get text info: ', textJson);
      if (textJson === false) {
        return;
      }
      if ('title' in textJson) { // text being renamed exists in the server, need to update the server as well
        const textId = transformStr(newTitle);
        const result = yield fetchPatchText(textId, 'title', [title, newTitle], textContainer);
        if (result === false) {
          return;
        }
        alert('Successfully renamed!');
      }
      const { textTitle } = activeNote;
      activeNote.title = newTitle;
      textTitle.setTitle(newTitle);
    });
  },
  save(textContainer) {
    return __awaiter(this, void 0, void 0, function* () {
      const activeNote = textContainer.getActiveNote();
      if (activeNote.title === 'welcomeText') {
        return;
      }
      const { title, textArea } = activeNote;
      const text = textArea.getText();
      const textJson = yield fetchGetText(title, textContainer);
      console.log('GET in save: ', textJson);
      if (textJson === false) {
        return;
      }
      if (!('title' in textJson)) { // brand-new text, add to the server
        fetchPostText(title, text, textContainer);
      } else if (text === textJson.text) { // already exists in the server, no need to save
        alert('Saved already!');
      } else { // already exists in the server, need to update
        const textId = transformStr(title);
        const result = yield fetchPatchText(textId, 'text', [textJson.text, text], textContainer);
        if (result === false) {
          return;
        }
        alert('Successfully saved!');
      }
    });
  },
  saveAs(textContainer) {
    return __awaiter(this, void 0, void 0, function* () {
      const activeNote = textContainer.getActiveNote();
      if (activeNote.title === 'welcomeText') {
        return;
      }
      const newTitle = prompt('Save as:', '');
      if (newTitle === null || newTitle === '') {
        return;
      }
      const textJson = yield fetchGetText(newTitle, textContainer);
      console.log('GET in saveAs: ', textJson);
      if (textJson === false) {
        return;
      }
      if ('title' in textJson) {
        alert('Title already exists in the system, please rename!');
        return;
      }
      const text = activeNote.textArea.getText();
      fetchPostText(newTitle, text, textContainer);
    });
  },
  delete(textContainer) {
    return __awaiter(this, void 0, void 0, function* () {
      const activeNote = textContainer.getActiveNote();
      if (activeNote.title === 'welcomeText') {
        return;
      }
      const { title } = activeNote;
      const isDeleted = yield fetchDeleteText(title, textContainer);
      if (isDeleted) {
        textContainer.removeNote(activeNote);
        alert('Successfully deleted!');
      } else {
        alert('Failed to delete!');
      }
    });
  },
};
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class Notepad {
  constructor(titleParentSelector, textParentSelector, loginSelector, interactSelector, interactBtnNameList) {
    this.titleParentSelector = titleParentSelector;
    this.textParentSelector = textParentSelector;
    this.loginSelector = loginSelector;
    this.interactSelector = interactSelector;
    this.interactBtnNameList = interactBtnNameList;
    this.textContainer = new TextContainer(this.titleParentSelector, this.textParentSelector);
    this.loginBtn = this.createLoginBtn();
    this.interactBtnList = this.createInteractBtnList();
    this.loadPrevTabs();
  }

  createLoginBtn() {
    const loginBtn = createBtn('Login');
    const parentNode = document.querySelector(this.loginSelector);
    if (parentNode) {
      parentNode.appendChild(loginBtn);
    }
    loginBtn.onclick = () => login();
    return loginBtn;
  }

  createInteractBtnList() {
    const interactBtnList = this.interactBtnNameList.map((btnName) => {
      const interactBtn = createBtn(btnName);
      const parentNode = document.querySelector(this.interactSelector);
      if (parentNode) {
        parentNode.appendChild(interactBtn);
      }
      let funcName = btnName.replace(' ', ''); // New Text => NewText
      funcName = funcName[0].toLowerCase() + funcName.slice(1); // NewText => newText
      const onclickFunc = onclickFuncMap[funcName];
      interactBtn.onclick = () => onclickFunc(this.textContainer);
      return interactBtn;
    });
    return interactBtnList;
  }

  loadPrevTabs() {
    return __awaiter(this, void 0, void 0, function* () {
      const url = window.location.href;
      const userId = url.split('/user/')[1];
      const { loginBtn } = this;
      if (!userId) { // invalid url
        console.log('Hello Page!');
        return;
      }
      // 일단 웰컴 페이지의 웰컴 구문을 바꿔준다.
      this.textContainer.getActiveNote().textArea.setText('\n\n    Welcome!\n\n    Please click \'New Text\' button to start your new text!');
      this.textContainer.setUser(userId);
      console.log(`Trying to get the previous tabs ${userId} worked on...`);
      const url2 = `https://localhost:8000/user/${userId}`;
      const res = yield fetch(url2, {
        method: 'GET',
        credentials: 'include', // for cors, must be set include. unless can't send session values which api server set
      });
      if (res.status === 401) { // refresh accessToken if expired
        const result = yield refreshAccessToken(this.textContainer);
        if (result) {
          yield this.loadPrevTabs();
        }
        return;
      }
      if (!res.ok) {
        console.error('Error during loading previous tabs');
        return;
      }
      const prevTabs = yield res.json();
      this.textContainer.setPrevTabs(prevTabs);
      // login button changes to logout button
      loginBtn.querySelector('span').innerText = 'Logout';
      loginBtn.onclick = () => logout(this.textContainer);
    });
  }
}
// export {};
