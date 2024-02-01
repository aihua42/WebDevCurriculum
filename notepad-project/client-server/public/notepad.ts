/* eslint-disable no-restricted-globals */ // confirm
/* eslint-disable max-classes-per-file */
/* eslint-disable max-len */

type Note = {
  title: string;
  textTitle: TextTitle | undefined; // welcome page는 tab이 없다
  textArea: TextArea;
};

type NoteList = Note[];

type Tabs = {
  userId: string | undefined;
  activeTitle: string;
  tabs: { title: string; text: string }[] | [];
};

type Text = {
  userId: string;
  textId: string;
  title: string;
  text: string;
} | Record<string, never> | null;

type OnclickFuncMap = {
  [key: string]: (textContainer: TextContainer) => Promise<void>;
}

function createBtn(spanInnerText: string) {
  const span: HTMLSpanElement = document.createElement('span');
  span.innerText = spanInnerText;

  const button: HTMLButtonElement = document.createElement('button');
  button.appendChild(span);
  button.type = 'button';

  return button;
}

class TextTitle {
  private parentSelector: string;

  private textContainer: TextContainer;

  private ele: HTMLDivElement;

  constructor(parentSelector: string, textContainer: TextContainer) {
    this.parentSelector = parentSelector;
    this.textContainer = textContainer;
    this.ele = this.createTitleInputContainer();
  }

  private createTitleInputContainer() {
    const inputEle: HTMLInputElement = document.createElement('input');
    inputEle.type = 'button';
    inputEle.readOnly = true;

    const btnEle = createBtn('x');
    btnEle.onclick = async (event) => {
      event.stopPropagation();
      await this.textContainer.makeNoteRemovable(this.getTitle());
    };

    const divEle: HTMLDivElement = document.createElement('div');
    divEle.append(inputEle, btnEle);

    divEle.onclick = () => {
      this.textContainer.showActiveNote(this.getTitle());
    };

    const parentNode = document.querySelector(this.parentSelector);
    parentNode?.appendChild(divEle);

    return divEle;
  }

  getTitle(): string {
    const inputEle = this.ele.querySelector('input');
    return inputEle ? inputEle.value : '';
  }

  setTitle(value: string) {
    const inputEle = this.ele.querySelector('input');
    inputEle && (inputEle.value = value);
  }

  setActive(force: boolean) {
    this.ele.classList.toggle('active', force);
  }

  remove() {
    this.ele.remove();
  }
}

class TextArea {
  private parentSelector: string;

  private readOnly: boolean;

  private ele: HTMLTextAreaElement;

  constructor(parentSelector: string, readOnly = false) {
    this.parentSelector = parentSelector;
    this.readOnly = readOnly;
    this.ele = this.createTextAreaEle();
  }

  private createTextAreaEle() {
    const textareaEle: HTMLTextAreaElement = document.createElement('textarea');
    textareaEle.readOnly = this.readOnly;
    textareaEle.placeholder = this.readOnly ? '' : 'Start your text here';

    const parentNode = document.querySelector(this.parentSelector);
    parentNode?.appendChild(textareaEle);

    return textareaEle;
  }

  getText(): string {
    return this.ele.value;
  }

  setText(value: string, fontSize = '') {
    this.ele.value = value;
    fontSize && (this.ele.style.fontSize = fontSize);
  }

  setActive(force: boolean) {
    this.ele.classList.toggle('active', force);
  }

  remove() {
    this.ele.remove();
  }
}

class TextContainer {
  private titleParentSelector: string;

  private textParentSelector: string;

  private noteList: NoteList;

  private activeTitle: string;

  private userId: string | undefined;

  constructor(titleParentSelector: string, textParentSelector: string) {
    this.titleParentSelector = titleParentSelector;
    this.textParentSelector = textParentSelector;

    this.noteList = this.createNoteList();
    this.activeTitle = 'welcomeText';
    this.userId = undefined;
  }

  private createNoteList(): NoteList {
    const welcomeText = new TextArea(this.textParentSelector, true);
    const value = '\n\n    Hello!\n\n    Please log in!';
    welcomeText.setText(value, '20px');
    welcomeText.setActive(true);

    const note: Note = {
      title: 'welcomeText',
      textTitle: undefined,
      textArea: welcomeText,
    };

    return [note];
  }

  includes(title: string): boolean {
    return this.noteList.some((note) => note.title === title);
  }

  getUser(): undefined | string {
    return this.userId;
  }

  setUser(userId: string) {
    this.userId = userId;
  }

  getActiveNote(): Note {
    const { noteList } = this;
    const activeNote = noteList.find((note) => note.title === this.activeTitle);
    if (!activeNote) {
      console.error('Active tab is missing!');
    }

    return activeNote as Note;
  }

  showActiveNote(activeTitle: string) {
    this.activeTitle = activeTitle;

    this.noteList.forEach((note) => {
      note.textTitle?.setActive(note.title === activeTitle);
      note.textArea?.setActive(note.title === activeTitle);
    });
  }

  addNote(titleVal: string, textVal = '') {
    const textTitle = new TextTitle(this.titleParentSelector, this);
    textTitle.setTitle(titleVal);

    const textArea = new TextArea(this.textParentSelector);
    textArea.setText(textVal);

    const note: Note = {
      title: titleVal,
      textTitle,
      textArea,
    };
    this.noteList.push(note);
    this.showActiveNote(titleVal);
  }

  async makeNoteRemovable(title: string) {
    if (title === 'welcomeText') return;

    const foundText = await fetchGetText(title, this);
    if (!foundText) return;

    const foundNote = this.noteList.find((note) => note.title === title);
    if (!foundNote) {
      console.error('Note to remove not found!');
      return;
    }

    const { textArea } = foundNote;
    const text = textArea.getText();
    const isNoTextContent = !('text' in foundText);
    const isNoChange = foundText.text === text;
    const isToBeRemoved = isNoTextContent || isNoChange || confirm('Are you sure to close the tab without saving?'); // 빈 textarea거나 수정사항이 없을 때 그냥 닫음

    if (isToBeRemoved) {
      this.remove(foundNote);
    }
  }

  remove(note: Note) {
    const { title } = note;
    if (title === 'welcomeText') return;

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

    note.textTitle?.remove();
    note.textArea.remove();
    noteList.splice(idxRemove, 1);
  }

  setPrevTabs(prevTabs: Tabs) {
    console.log('prevTabs: ', prevTabs);

    if (prevTabs.tabs.length === 0) return;

    const { activeTitle, tabs } = prevTabs;

    tabs.forEach((titleNtext) => {
      const { title, text } = titleNtext;

      if (title !== 'welcomeText') {
        this.addNote(title, text);
      }
    });

    this.showActiveNote(activeTitle);
  }

  getTabs() {
    const { userId, activeTitle, noteList } = this;

    // if user logout successfully, then send the tabs to the api server
    const texts: Tabs = {
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
function transformStr(str: string) {
  return str.replace(/ /g, '-').toLowerCase();
}

// login and logout
function login() {
  const url = 'https://localhost:3000/login';
  window.location.href = url;
}

async function logout(textContainer: TextContainer, pageToGo = 'welcome') {
  const tabs = textContainer.getTabs();
  console.log('user tabs to send: ', tabs);

  const urlLogout = 'https://localhost:8000/logout';
  await fetch(urlLogout, {
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

      // alert('See you next time!');

      const urlToGo = (pageToGo === 'welcome') ? 'https://localhost:3000' : 'https://localhost:3000/login';
      window.location.href = urlToGo;
    })
    .catch((err) => {
      console.error('Error during log out; ', err);
    });
}

// fetch function for refreshing the accessToken
async function refreshAccessToken(textContainer: TextContainer) {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) {
    return false;
  }

  const userId = textContainer.getUser();
  const url = 'https://localhost:8000/token';

  const res = await fetch(url, {
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
  } if (!res.ok) {
    throw new Error('Error during refresh the access token');
  } else {
    return true;
  }
}

async function fetchAfterTokenRefreshed(...params: [string, object, TextContainer]) { // refresh the accessToken if get status 401
  let textContainer: TextContainer | undefined;

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

  let res = await fetch(...(rest as [string, object]));

  if (res.status === 401) {
    console.log('Try to refresh the accessToken');

    const result = await refreshAccessToken(textContainer);
    if (result) {
      res = await fetch(...(rest as [string, object]));
    }
  }

  return res;
}

// fetch functions for 'New Text', 'Open', 'Rename', 'Save', 'Save As', 'Delete' buttons
async function fetchGetText(title: string, textContainer: TextContainer) {
  const userId = textContainer.getUser();
  const textId = transformStr(title);
  const url = `https://localhost:8000/user/${userId}/${textId}`;

  let text: Text = null;

  try {
    const res = await fetchAfterTokenRefreshed(url, {
      method: 'GET',
      credentials: 'include', // for cors, must be set include, unless can't send session values which api server set
    }, textContainer);

    if (!res.ok) {
      console.error('Error during fetchGet with status code: ', res.status);
    } else if (res.status !== 204) {
      text = await res.json();
    } else {
      text = {};
    }
  } catch (err) {
    console.error('Error: ', err);
  }

  return text;
}

async function fetchPostText(title: string, text: string, textContainer: TextContainer) {
  const userId = textContainer.getUser();
  const url = `https://localhost:8000/user/${userId}`;
  const textId = transformStr(title);
  const data = { textId, title, text };
  console.log('texts to send via fetch POST: ', data);

  await fetchAfterTokenRefreshed(url, {
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
}

async function fetchPatchText(textId: string, key: string, preNnewVals: string[], textContainer: TextContainer) {
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
    const res = await fetchAfterTokenRefreshed(url, {
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
}

async function fetchDeleteText(title: string, textContainer: TextContainer) {
  const userId = textContainer.getUser();
  const textId = transformStr(title);
  const url = `https://localhost:8000/user/${userId}/${textId}`;

  try {
    const res = await fetchAfterTokenRefreshed(url, {
      method: 'DELETE',
      credentials: 'include', // for cors, must be set include, unless can't send session values which api server set
    }, textContainer);

    return res.ok;
  } catch (err) {
    console.error('Error: ', err);
    return false;
  }
}

// New Text, Open, Rename, Save, Save As, Delete
const onclickFuncMap: OnclickFuncMap = {
  async newText(textContainer: TextContainer) {
    const title = prompt('Input the title:', '');
    if (title === null || title === '') return;

    const textJson: Text = await fetchGetText(title, textContainer);
    console.log('GET in newText: ', textJson);

    if (!textJson) return;

    if ('title' in textJson) {
      alert('Title already exists in the system!');
      return;
    }

    textContainer.addNote(title, '');
  },

  async open(textContainer: TextContainer) {
    const title = prompt('Input title of the text to open:', '');
    if (title === null || title === '') return;

    if (textContainer.includes(title)) {
      textContainer.showActiveNote(title);
      return;
    }

    const textJson = await fetchGetText(title, textContainer);
    console.log('GET in open: ', textJson);

    if (!textJson) return;

    if ('title' in textJson) {
      textContainer.addNote(textJson.title, textJson.text);
    } else {
      alert('Text NOT found!');
    }
  },

  async rename(textContainer: TextContainer) {
    const activeNote = textContainer.getActiveNote();
    if (activeNote.title === 'welcomeText') return;

    const { title } = activeNote;
    const newTitle = prompt('Input the new title:', '');
    if (newTitle === null || newTitle === '' || newTitle === title) return;

    const foundTextJson = await fetchGetText(newTitle, textContainer);
    console.log('GET in rename, checking if the new title exists: ', foundTextJson);
    if (!foundTextJson) return;

    if ('title' in foundTextJson) {
      alert('New title is already stored!');
      return;
    }

    const textJson = await fetchGetText(title, textContainer);
    console.log('GET in rename, get text info: ', textJson);

    if (!textJson) return;

    if ('title' in textJson) { // text being renamed exists in the server, need to update the server as well
      const textId = transformStr(newTitle);
      const result = await fetchPatchText(textId, 'title', [title, newTitle], textContainer);

      if (result === false) return;

      alert('Successfully renamed!');
    }

    const { textTitle } = activeNote as { textTitle: TextTitle };
    activeNote.title = newTitle;
    textTitle.setTitle(newTitle);
  },

  async save(textContainer: TextContainer) {
    const activeNote = textContainer.getActiveNote();
    if (activeNote.title === 'welcomeText') return;

    const { title, textArea } = activeNote;
    const text = textArea.getText();

    const textJson = await fetchGetText(title, textContainer);
    console.log('GET in save: ', textJson);

    if (!textJson) return;

    if (!textJson.title) { // brand-new text, add to the server
      fetchPostText(title, text, textContainer);
    } else if (text === textJson.text) { // already exists in the server, no need to save
      alert('Saved already!');
    } else { // already exists in the server, need to update
      const textId = transformStr(title);
      const result = await fetchPatchText(textId, 'text', [textJson.text, text], textContainer);

      if (result === false) return;

      alert('Successfully saved!');
    }
  },

  async saveAs(textContainer: TextContainer) {
    const activeNote = textContainer.getActiveNote();
    if (activeNote.title === 'welcomeText') return;

    const newTitle = prompt('Save as:', '');
    if (newTitle === null || newTitle === '') return;

    const textJson = await fetchGetText(newTitle, textContainer);
    console.log('GET in saveAs: ', textJson);

    if (!textJson) return;

    if ('title' in textJson) {
      alert('Title already exists in the system, please rename!');
      return;
    }

    const text = activeNote.textArea.getText();
    fetchPostText(newTitle, text, textContainer);
  },

  async delete(textContainer: TextContainer) {
    const activeNote = textContainer.getActiveNote();
    if (activeNote.title === 'welcomeText') return;

    const { title } = activeNote;
    const isDeleted = await fetchDeleteText(title, textContainer);

    if (isDeleted) {
      textContainer.remove(activeNote);
      alert('Successfully deleted!');
    } else {
      alert('Failed to delete!');
    }
  },
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
class Notepad {
  titleParentSelector: string;

  textParentSelector: string;

  loginSelector: string;

  interactSelector: string;

  interactBtnNameList: string[];

  textContainer: TextContainer;

  loginBtn: HTMLButtonElement;

  interactBtnList: HTMLButtonElement[];

  constructor(titleParentSelector: string, textParentSelector: string, loginSelector: string, interactSelector: string, interactBtnNameList: string[]) {
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

  private createLoginBtn() {
    const loginBtn = createBtn('Login');

    const parentNode = document.querySelector(this.loginSelector);
    parentNode?.appendChild(loginBtn);

    loginBtn.onclick = () => login();
    return loginBtn;
  }

  private createInteractBtnList() {
    const interactBtnList = this.interactBtnNameList.map((btnName) => {
      const interactBtn = createBtn(btnName);
      const parentNode = document.querySelector(this.interactSelector);
      parentNode?.appendChild(interactBtn);

      let funcName = btnName.replace(' ', ''); // New Text => NewText
      funcName = funcName[0].toLowerCase() + funcName.slice(1); // NewText => newText

      const onclickFunc = onclickFuncMap[funcName];
      interactBtn.onclick = () => onclickFunc(this.textContainer);

      return interactBtn;
    });

    return interactBtnList;
  }

  private async loadPrevTabs() { // page reload 할때마다 실행된다.
    const url = window.location.href;
    const userId = url.split('/user/')[1];
    const { loginBtn } = this;

    if (!userId) { // invalid url
      console.log('Hello Page!');
      return;
    }

    // login button changes to logout button
    (loginBtn.querySelector('span') as HTMLSpanElement).innerText = 'Logout';
    loginBtn.onclick = () => logout(this.textContainer);

    // 일단 웰컴 페이지의 웰컴 구문을 바꿔준다.
    this.textContainer.getActiveNote().textArea.setText('\n\n    Welcome!\n\n    Please click \'New Text\' button to start your new text!');
    this.textContainer.setUser(userId);
    console.log(`Trying to get the previous tabs ${userId} worked on...`);

    const url2 = `https://localhost:8000/user/${userId}`;
    const res = await fetch(url2, {
      method: 'GET',
      credentials: 'include', // for cors, must be set include. unless can't send session values which api server set
    });

    if (res.status === 401) { // refresh accessToken if expired
      const result = await refreshAccessToken(this.textContainer);
      if (result) {
        await this.loadPrevTabs();
      }
      return;
    }

    if (!res.ok) {
      console.error('Error during loading previous tabs');
      return;
    }

    const prevTabs = await res.json();
    this.textContainer.setPrevTabs(prevTabs);
  }
}
