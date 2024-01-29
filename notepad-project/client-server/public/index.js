/* eslint-disable no-restricted-globals */ // confirm
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
function createTextTitle(parentSelector) {
  const elements = createTitleInputContainer();
  const xBtn = elements[0];
  const ele = elements[1];
  function createTitleInputContainer() {
    const inputEle = document.createElement('input');
    inputEle.type = 'button';
    inputEle.readOnly = true;
    const btnEle = createBtn('x');
    const divEle = document.createElement('div');
    divEle.append(inputEle, btnEle);
    const parentNode = document.querySelector(parentSelector);
    parentNode === null || parentNode === void 0 ? void 0 : parentNode.appendChild(divEle);
    return [btnEle, divEle];
  }
  function getTitle() {
    const inputEle = ele.querySelector('input');
    return inputEle.value;
  }
  function setTitle(value) {
    const inputEle = ele.querySelector('input');
    inputEle.value = value;
  }
  function setActive(force) {
    ele.classList.toggle('active', force);
  }
  function remove() {
    ele.remove();
  }
  return {
    xBtn,
    ele,
    getTitle,
    setTitle,
    setActive,
    remove,
  };
}
function createTextArea(parentSelector, readOnly = false) {
  const ele = createTextAreaEle();
  function createTextAreaEle() {
    const textareaEle = document.createElement('textarea');
    textareaEle.readOnly = readOnly;
    textareaEle.placeholder = readOnly ? '' : 'Start your text here';
    const parentNode = document.querySelector(parentSelector);
    parentNode === null || parentNode === void 0 ? void 0 : parentNode.appendChild(textareaEle);
    return textareaEle;
  }
  function getText() {
    return ele.value;
  }
  function setText(value, fontSize = '') {
    ele.value = value;
    fontSize && (ele.style.fontSize = fontSize);
  }
  function setActive(force) {
    ele.classList.toggle('active', force);
  }
  function remove() {
    ele.remove();
  }
  return {
    ele,
    getText,
    setText,
    setActive,
    remove,
  };
}
function createTextContainer(titleParentSelector, textParentSelector) {
  const noteList = [createWelcomePate()];
  let userId;
  let activeTitle = 'welcomeText';
  function createWelcomePate() {
    const welcomeText = createTextArea(textParentSelector, true);
    const value = '\n\n    Hello!\n\n    Please log in!';
    welcomeText.setText(value, '20px');
    welcomeText.setActive(true);
    const note = {
      title: 'welcomeText',
      textTitle: undefined,
      textArea: welcomeText,
    };
    return note;
  }
  function includes(title) {
    return noteList.some((note) => note.title === title);
  }
  function getUser() {
    return userId;
  }
  function setUser(_userId) {
    userId = _userId;
  }
  function getActiveNote() {
    const activeNote = noteList.find((note) => note.title === activeTitle);
    !activeNote && console.error('Active tab is missing!');
    return activeNote;
  }
  function showActiveNote(_activeTitle) {
    activeTitle = _activeTitle;
    noteList.forEach((note) => {
      let _a; let
        _b;
      (_a = note.textTitle) === null || _a === void 0 ? void 0 : _a.setActive(note.title === activeTitle);
      (_b = note.textArea) === null || _b === void 0 ? void 0 : _b.setActive(note.title === activeTitle);
    });
  }
  function remove(note) {
    let _a;
    const { title } = note;
    if (title === 'welcomeText') return;
    const idxRemove = noteList.indexOf(note);
    console.log(`remove title of index: ${idxRemove}`);
    const numTitles = noteList.length;
    if (title === activeTitle) {
      const idxNextActive = (idxRemove === 1 && numTitles > 2) ? idxRemove + 1 : idxRemove - 1;
      const nextActiveTitle = noteList[idxNextActive].title;
      console.log('next active title: ', nextActiveTitle);
      showActiveNote(nextActiveTitle);
    }
    (_a = note.textTitle) === null || _a === void 0 ? void 0 : _a.remove();
    note.textArea.remove();
    noteList.splice(idxRemove, 1);
  }
  function addNote(titleVal, textVal = '') {
    const textTitle = createTextTitle(titleParentSelector);
    textTitle.setTitle(titleVal);
    textTitle.xBtn.onclick = (event) => {
      event.stopPropagation();
      makeNoteRemovable(titleVal);
    };
    textTitle.ele.onclick = () => {
      showActiveNote(titleVal);
    };
    const textArea = createTextArea(textParentSelector);
    textArea.setText(textVal);
    const note = {
      title: titleVal,
      textTitle,
      textArea,
    };
    noteList.push(note);
    showActiveNote(titleVal);
  }
  function setPrevTabs(prevTabs) {
    console.log('prevTabs: ', prevTabs);
    if (prevTabs.tabs.length === 0) return; // early return
    const { activeTitle: _activeTitle, tabs } = prevTabs;
    tabs.forEach((titleNtext) => {
      const { title, text } = titleNtext;
      if (title !== 'welcomeText') {
        addNote(title, text);
      }
    });
    showActiveNote(_activeTitle);
  }
  function getTabs() {
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
  const textContainer = {
    includes,
    getUser,
    setUser,
    getActiveNote,
    showActiveNote,
    remove,
    addNote,
    setPrevTabs,
    getTabs,
  };
  function makeNoteRemovable(title) {
    return __awaiter(this, void 0, void 0, function* () {
      if (title === 'welcomeText') return;
      const foundText = yield fetchGetText(title, textContainer);
      if (!foundText) return; // null이거나 undefined
      const foundNote = noteList.find((note) => note.title === title);
      if (foundNote === undefined) {
        console.error('Note to remove not found!');
        return;
      }
      const { textArea } = foundNote;
      const text = textArea.getText();
      const isNoTextContent = !foundText.text;
      const isNoChange = foundText.text === text;
      const isToBeRemoved = isNoTextContent || isNoChange || confirm('Are you sure to close the tab without saving?'); // 빈 textarea거나 수정사항이 없을 때 그냥 닫음
      if (isToBeRemoved) {
        remove(foundNote);
      }
    });
  }
  return textContainer;
}
function transformStr(str) {
  return str.replace(/ /g, '-').toLowerCase();
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
        const urlToGo = (pageToGo === 'welcome') ? 'https://localhost:3000' : 'https://localhost:3000/login';
        window.location.href = urlToGo;
      })
      .catch((err) => {
        console.error('Error during log out; ', err);
      });
  });
}
function refreshAccessToken(textContainer) {
  return __awaiter(this, void 0, void 0, function* () {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) return false;
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
      if (typeof param === 'object' && 'getTabs' in param) {
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
    let text = null;
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
        alert(res.ok ? 'Successfully saved!' : 'Title already exists in the system!');
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
      return res.ok;
    } catch (err) {
      console.error('Error: ', err);
      return false;
    }
  });
}
const onclickFuncMap = {
  newText(textContainer) {
    return __awaiter(this, void 0, void 0, function* () {
      const title = prompt('Input the title:', '');
      if (title === null || title === '') return;
      const textJson = yield fetchGetText(title, textContainer);
      console.log('GET in newText: ', textJson);
      if (!textJson) return;
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
      if (title === null || title === '') return;
      if (textContainer.includes(title)) {
        textContainer.showActiveNote(title);
        return;
      }
      const textJson = yield fetchGetText(title, textContainer);
      console.log('GET in open: ', textJson);
      if (!textJson) return;
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
      if (!activeNote || activeNote.title === 'welcomeText') return;
      const { title } = activeNote;
      const newTitle = prompt('Input the new title:', '');
      if (newTitle === null || newTitle === '' || newTitle === title) return;
      const foundTextJson = yield fetchGetText(newTitle, textContainer);
      console.log('GET in rename, checking if the new title exists: ', foundTextJson);
      if (!foundTextJson) return;
      if ('title' in foundTextJson) {
        alert('New title is already stored!');
        return;
      }
      const textJson = yield fetchGetText(title, textContainer);
      console.log('GET in rename, get text info: ', textJson);
      if (!textJson) return;
      if ('title' in textJson) { // text being renamed exists in the server, need to update the server as well
        const textId = transformStr(newTitle);
        const result = yield fetchPatchText(textId, 'title', [title, newTitle], textContainer);
        if (result === false) return;
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
      if (!activeNote || activeNote.title === 'welcomeText') return;
      const { title, textArea } = activeNote;
      const text = textArea.getText();
      const textJson = yield fetchGetText(title, textContainer);
      console.log('GET in save: ', textJson);
      if (!textJson) return;
      if (!('title' in textJson)) { // brand-new text, add to the server
        fetchPostText(title, text, textContainer);
      } else if (text === textJson.text) { // already exists in the server, no need to save
        alert('Saved already!');
      } else { // already exists in the server, need to update
        const textId = transformStr(title);
        const result = yield fetchPatchText(textId, 'text', [textJson.text, text], textContainer);
        if (result === false) return;
        alert('Successfully saved!');
      }
    });
  },
  saveAs(textContainer) {
    return __awaiter(this, void 0, void 0, function* () {
      const activeNote = textContainer.getActiveNote();
      if (!activeNote || activeNote.title === 'welcomeText') return;
      const newTitle = prompt('Save as:', '');
      if (newTitle === null || newTitle === '') return;
      const textJson = yield fetchGetText(newTitle, textContainer);
      console.log('GET in saveAs: ', textJson);
      if (!textJson) return;
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
      if (!activeNote || activeNote.title === 'welcomeText') return;
      const { title } = activeNote;
      const isDeleted = yield fetchDeleteText(title, textContainer);
      if (isDeleted) {
        textContainer.remove(activeNote);
        alert('Successfully deleted!');
      } else {
        alert('Failed to delete!');
      }
    });
  },
};
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function createNotepad(titleParentSelector, textParentSelector, loginSelector, interactSelector, interactBtnNameList) {
  return __awaiter(this, void 0, void 0, function* () {
    const textContainer = createTextContainer(titleParentSelector, textParentSelector);
    const loginBtn = createLoginBtn();
    function login() {
      const url = 'https://localhost:3000/login';
      window.location.href = url;
    }
    function createLoginBtn() {
      const btn = createBtn('Login');
      const parentNode = document.querySelector(loginSelector);
      parentNode && parentNode.appendChild(btn);
      btn.onclick = () => login();
      return btn;
    }
    function createInteractBtnList() {
      const btnList = interactBtnNameList.map((btnName) => {
        const interactBtn = createBtn(btnName);
        const parentNode = document.querySelector(interactSelector);
        parentNode === null || parentNode === void 0 ? void 0 : parentNode.appendChild(interactBtn);
        let funcName = btnName.replace(' ', ''); // New Text => NewText
        funcName = funcName[0].toLowerCase() + funcName.slice(1); // NewText => newText
        const onclickFunc = onclickFuncMap[funcName];
        interactBtn.onclick = () => onclickFunc(textContainer);
        return interactBtn;
      });
      return btnList;
    }
    function loadPrevTabs() {
      let _a;
      return __awaiter(this, void 0, void 0, function* () {
        const url = window.location.href;
        const userId = url.split('/user/')[1];
        if (!userId) {
          console.log('Hello Page!');
          return;
        }
        // login button changes to logout button
        loginBtn.querySelector('span').innerText = 'Logout';
        loginBtn.onclick = () => logout(textContainer);
        // 일단 웰컴 페이지의 웰컴 구문을 바꿔준다.
        (_a = textContainer.getActiveNote()) === null || _a === void 0 ? void 0 : _a.textArea.setText('\n\n    Welcome!\n\n    Please click \'New Text\' button to start your new text!');
        textContainer.setUser(userId);
        console.log(`Trying to get the previous tabs ${userId} worked on...`);
        const url2 = `https://localhost:8000/user/${userId}`;
        const res = yield fetch(url2, {
          method: 'GET',
          credentials: 'include', // for cors, must be set include. unless can't send session values which api server set
        });
        if (res.status === 401) { // refresh accessToken if expired
          const result = yield refreshAccessToken(textContainer);
          result && (yield loadPrevTabs());
          return;
        }
        if (!res.ok) {
          console.error('Error during loading previous tabs');
          return;
        }
        const prevTabs = yield res.json();
        textContainer.setPrevTabs(prevTabs);
      });
    }
    createInteractBtnList();
    yield loadPrevTabs();
  });
}
// export {};
