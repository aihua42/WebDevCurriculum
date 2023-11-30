class Desktop {
	/* TODO: Desktop 클래스는 어떤 멤버함수와 멤버변수를 가져야 할까요? */
	// two types of icons: file, folder
	constructor (fileNum, folderNum) {
		fileNum = Number(prompt('파일을 몇개 생성할가요?', ''));
		folderNum = Number(prompt('폴더를 몇개 생성할가요?', ''));
		this.fileNum = fileNum ?? 0;
		this.folderNum = folderNum ?? 0;
		this.#addIconsToPage();
	}

	#addIconsToPage() {
		// 매번 새로운 객체를 만들어서 부모 노드에 넣어줘야 한다.
		function createIcons(iconType, iconNum) {
			let iconImgArr = Array(iconNum)
				.fill(iconType)
				.map((type) => (type === 'file' ? new File() : new Folder()).img);
			document.querySelector('.desktop').append(...iconImgArr);
		}
		createIcons('file', this.fileNum);
		createIcons('folder', this.folderNum);

		// 같은 객체를 반복해서 넣으면 하나만 찍힌다.
		/*
		function createIcons(icon, iconNum) {
			let iconImgArr = Array(iconNum).fill(icon.img);
			document.querySelector('.desktop').append(...iconImgArr);
		}
		const file = new File();
		const folder = new Folder();
		createIcons(file, this.fileNum);
		createIcons(folder, this.folderNum);
		*/
	}
};

class File {
	/* TODO: Icon 클래스는 어떤 멤버함수와 멤버변수를 가져야 할까요? */
	constructor () {
		const img = document.createElement('img');
		img.src = "/Quest04/images/file.png";
		this.img = img;
		this.#draggable();
	}

	#draggable() {
	  const icon = this.img;

		// drag and drop API를 꺼줘야 잘 작동한다...
		icon.ondragstart = function() {
			return false;
		}

		icon.onmousedown = function(event) {
			// position이 꼭 'absolute'여야 잘 작동한다...
			icon.style.position = 'absolute';

			// icon 시작 위치, 좌, 위에서 얼마나 떨어져있었나
			const iconInitPosition = {
				x: icon.getBoundingClientRect().left,
				y: icon.getBoundingClientRect().top
			};

			// 커서의 시작 위치, 좌, 위에서 얼마나 떨어져있었나
			// pageX, pageY를 사용하면 스크롤바가 생겼을 때 아이콘이 이탈한다...
			const mouseInitPosition = {
				x: event.clientX,
				y: event.clientY
			};

			// 커서가 아이콘의 좌, 위에서 얼마나 떨어져있나
			let gapX = mouseInitPosition.x - iconInitPosition.x;
			let gapY = mouseInitPosition.y - iconInitPosition.y;

			// icon 위치 넣어주기, 항상 커서를 따라다녀야 한다.
			// clientX, clientY를 사용하면 스크롤바가 생겼을 때 아이콘이 이탈한다...
			icon.onmousemove = function(event) {
				icon.style.left = event.pageX - gapX + 'px';
				icon.style.top = event.pageY - gapY + 'px';
			}

			// mousemove event 지워주기
			icon.onmouseup = function(event) {
				icon.onmousemove = null;
			};
		};
	}
};

class Folder extends File {
	/* TODO: Folder 클래스는 어떤 멤버함수와 멤버변수를 가져야 할까요? */
	// open when double clicked
	constructor () {
		super();
		this.img.src = "/Quest04/images/folder.png";
		this.#doubleClicked();
	}

	#doubleClicked() {
		this.img.ondblclick = function() {
			const win = new Window();
		}
	}
};

class Window {
	/* TODO: Window 클래스는 어떤 멤버함수와 멤버변수를 가져야 할까요? */
	constructor () {
		const win = window.open('', '_blank', 'width=500, height=400, resizable=yes');
		win.document.write(`
		<html>
			<head>
				<title>New Window!</title>
				<meta charset="UTF-8">
				<link rel="stylesheet" href="./desktop.css">
				<script src="./desktop.js"></script>
			</head>
			<body>
				<section class="desktop"></section>
				<script>
					let desktop = new Desktop();
				</script>
			</body>
		</html>`);
		this.win = win;
	}
};