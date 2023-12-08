// contentEditable 속성이다. 꾸미고 싶을때...

class Notepad {
	/* TODO: 그 외에 또 어떤 클래스와 메소드가 정의되어야 할까요? */
	// class name을 받는게 
	constructor(titleParentSelector, textSiblingSelector, interactSelector, interactBtnNameList) {
		this.titleParentSelector = titleParentSelector;
		this.textBeforeSelector = textSiblingSelector;
		this.interactSelector = interactSelector;
		this.interactBtnNameList = interactBtnNameList;

		this.textTitle = new TextTitle(titleParentSelector);
		this.textArea = new TextArea(textSiblingSelector);
		this.btnOnclickFuncMap = new OnclickFuncMap(this.textTitle, this.textArea);
		this.interactBtnList = this.#createInteractBtnList();
	}

	#createInteractBtnList() {
		let interactBtnList = [];
		this.interactBtnNameList.forEach((btnName) => {
			let funcName = btnName.replace(' ', '');
			funcName = funcName[0].toLowerCase() + funcName.slice(1);
			let interactBtn = new ButtonEle(this.interactSelector, btnName, this.btnOnclickFuncMap[funcName]);
			interactBtn.btnOnclickInteractor(this.textTitle, this.textArea);
			interactBtnList.push(interactBtn);
		});
		return interactBtnList;
	}
}

class TextTitle {
	constructor(parentSelector) {
		this.parentSelector = parentSelector;

		this.inputEle = this.#createTitleInputEle();
		this.#appendInputEleTo();
	}

	getTitle() {
		return this.inputEle.value;
	}
	setTitle(value) {
		this.inputEle.value = value;
	}

	#createTitleInputEle() {
		let inputEle = document.createElement('input');
		inputEle.className = 'title';
		inputEle.type = 'text';
		inputEle.placeholder = "Untitled Text";
		return inputEle;
	}

	#appendInputEleTo() { 
		document.querySelector(this.parentSelector).appendChild(this.inputEle);
	}
 }

class TextArea {
	constructor(siblingSelector) {
		this.siblingSelector = siblingSelector;

		this.textareaEle = this.#createTextareaEle();
		this.#appendTextareaTo();
	}

	getText() {
		return this.textareaEle.value;
	}
	setText(value) {
		this.textareaEle.value = value;
	}

	#createTextareaEle() {
		let textareaEle = document.createElement('textarea');
		textareaEle.name = 'textArea';
		textareaEle.placeholder = "Start your text here";
		return textareaEle;
	}

	#appendTextareaTo() {  
		document.querySelector(this.siblingSelector).after(this.textareaEle);
	}
}

class ButtonEle {
	constructor (parentSelector, spanInnerText, onclickFunc) {
		this.parentSelector = parentSelector;
		this.spanInnerText = spanInnerText;
		this.onclickFunc = onclickFunc;

		this.btnEle = this.#createBtnEle();
		this.#appendBtnEleTo();
	}

	#createBtnEle() {
		let span = document.createElement('span');
		span.innerText = this.spanInnerText;
		let buttonEle = document.createElement('button');
		buttonEle.appendChild(span);
		buttonEle.type = 'button';
		return buttonEle;
	}

	// parentSelector must be class type without dot
	#appendBtnEleTo() {
		document.querySelector(this.parentSelector).appendChild(this.btnEle);
	}

	btnOnclickInteractor(textTitle, textArea) { 
		this.btnEle.onclick = () => this.onclickFunc(textTitle, textArea);
	}
}

class OnclickFuncMap {
	constructor() {  
		this.newText = this.newText;
		this.open = this.open;
		this.save = this.save;
		this.saveAs = this.saveAs;
		this.close = this.close;
	}

  newText() {  
		window.open('http://127.0.0.1:5500/Quest05/skeleton/tryout.html', '_blank', 'resizable=no');
	}

	open(textTitle, textArea) {
		let title = prompt('Please input the title:', '');
		let text = localStorage.getItem(title);
		if (title === null) {
			return;
		} else if (text === null) {
			alert(`Text Doesn't exist!`);
		} else { 
			textTitle.setTitle(title);
			textArea.setText(text);
		}
	}

	save(textTitle, textArea) {
		let title = textTitle.getTitle();
		let text = textArea.getText(); 
		if (title === '' || title === null) {
			alert('Title must be filled!');
		} else if (localStorage.getItem(title) === null 
						|| localStorage.getItem(title) === text 
						|| confirm('Do you want to overwrite?')) {
			localStorage.setItem(title, text);
			alert("Successfully saved!");
		}
	}

	saveAs(textTitle, textArea) {
		let newTitle = prompt('Save as:', '');
		while (newTitle === '' || localStorage.getItem(newTitle)) {
			newTitle = newTitle === '' ? 
			prompt(`Title shouldn't be empty!`, '') : 
			prompt(`"${newTitle}" already exists!`, '');
		}

		if (newTitle !== null) {
			let text = textArea.getText(); 
			localStorage.setItem(newTitle, text);
			alert("Successfully saved!");
		}
	}

	close(textTitle, textArea) {
		let title = textTitle.getTitle();
		let text = textArea.getText();
		if ((title === '' && text === '')
				|| text === localStorage.getItem(title) 
				|| confirm('Do you wanna leave without save?')) {
			window.close();
		}
	}
}