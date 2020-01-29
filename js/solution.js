'use strict';

const app = document.querySelector('.app');
const burger = document.querySelector('.burger');
const filesInfo = document.querySelector('.new');
const inp = document.querySelector('.file');

const pic = document.querySelector('img');
const showLoader = document.querySelector('.image-loader');
const err = document.querySelector('.error');

const comments = document.querySelector('.comments'), draw = document.querySelector('.draw'),
share = document.querySelector('.share');

const comtools = document.querySelector('.comments-tools'),
drtools = document.querySelector('.draw-tools'), shtools = document.querySelector('.share-tools');

const form = document.querySelector('.comments__form');
const pushCopy = document.querySelector('.menu_copy');
const commentLoader = document.querySelector('.comments__body .comment .loader');
const bClose = document.querySelector('.comments__close'), commBody = document.querySelector('.comments__body'),
cMarker = document.querySelector('.comments__marker'), cChkbx = document.querySelector('.comments__marker-checkbox'),
bSubmit = document.querySelector('.comments__submit');
let imgId;

document.addEventListener('DOMContentLoaded', () => {
	pic.setAttribute('src', '');

  burger.style.display = 'none';
  comments.style.display = 'none';
	err.style.display = 'none';

  draw.style.display = 'none';
  share.style.display = 'none';
  form.style.display = 'none';
});


//выбор картинки
filesInfo.addEventListener('click', function(e) {
	err.style.display = 'none';
	if (inp) {
		inp.click();
	}
	e.stopPropagation();
}, false);

inp.addEventListener('change', handleFiles);
function handleFiles(event) {
  var files = Array.from(event.target.files);
	loadImg(files);
}

//загрузка изображения
function loadImg(files) {
	//if (pic.src !== '')
	pic.setAttribute('src', '');

	files.forEach(file => {
		const formData = new FormData();
		formData.append('image', file);
		formData.append('title', file.name);

		var xhr = new XMLHttpRequest();

		xhr.upload.addEventListener('progress', () => {
			showLoader.style.display = '';
		}, false);


		xhr.open('POST', 'https://neto-api.herokuapp.com/pic/', true);
		xhr.send(formData);

		xhr.addEventListener('load', () => {
			if (xhr.status === 200) {
				var dataImg = JSON.parse(xhr.responseText);
				pic.src = dataImg.url;
				imgId = dataImg.id;
				// Вывод сообщения с сервера

				showLoader.style.display = 'none';
				filesInfo.style.display = 'none';
				comments.style.display = 'none';
				draw.style.display = 'none';

				burger.style.display = '';
				share.style.display = '';
				shtools.style.display ='inline-block';
				form.style.display = '';

				imgData(imgId);
		 }
		});//заканчивается загрузка
	}); //заканчивается forEach

}

//данные о загруженной картинке
function imgData(imgId) {
	fetch(`https://neto-api.herokuapp.com/pic/${imgId}`, {
		method: 'GET',
		mode: 'cors',
		headers: {'Content-Type':'application/json'}
	})
	.then(res => res.json())
	.then(res => console.log(res))
	.catch(err => {
		console.log(`Файл ${file.name} не сохранен. ${xhr.status} ${xhr.statusText}`);
				err.style.display = '';
				showLoader.style.display = 'none';
	});
}

//кинуть изображение на холст
app.addEventListener('drop', onImgDrop);
app.addEventListener('dragover', event => event.preventDefault());
function onImgDrop(event) {
	event.stopPropagation();
	event.preventDefault();
	const files = Array.from(event.dataTransfer.files);

	if (pic.src === '') {
		loadImg(files);
	} else {
		console.log = ('Чтобы загрузить новое изображение, пожалуйста, воспользуйтесь пунктом "Загрузить новое" в меню.');
	};
}

burger.addEventListener('click', (e) => {
	burger.style.display = 'none';

	filesInfo.style.display = '';
	comments.style.display = '';
	draw.style.display = '';
	share.style.display = '';

	comtools.style.display = 'none';
	drtools.style.display = 'none';
	shtools.style.display ='none';
	e.stopPropagation();
});

comments.addEventListener('click', handleComments);
pushCopy.addEventListener('click', handleComments);
function handleComments(e) {
	burger.style.display = '';
	comments.style.display = '';
	// commentLoader.style.display = 'none';
	// form.style.display = ''
	cTools();

	filesInfo.style.display = 'none';
	comtools.style.display = 'inline-block';
	shtools.style.display = '';

	draw.style.display = 'none';
	share.style.display = 'none';
	e.stopPropagation();
}

comtools.addEventListener('change', cTools);
function cTools() {
	if (document.querySelector('.menu__toggle').checked) {
		form.style.display = '';
	} else {
		form.style.display = 'none';
	}
}

draw.addEventListener('click', (e) => {
	burger.style.display = '';

	filesInfo.style.display = 'none';
	drtools.style.display = 'inline-block';

	comments.style.display = 'none';
	share.style.display = 'none';
	e.stopPropagation();
});

share.addEventListener('click', handleShare);
function handleShare(e) {
	burger.style.display = '';

	filesInfo.style.display = 'none';
	shtools.style.display = 'inline-block';

	draw.style.display = 'none';
	comments.style.display = 'none';
	e.stopPropagation();
}

bClose.addEventListener('click', b_close);
function b_close(e) {
		document.querySelector('.comments__marker-checkbox').checked = false;
		e.stopPropagation();
}

commentLoader.style.display = 'none';
const menuCB = document.querySelector('.menu__toggle-bg'); //переключатель скрытия/открытия маркеров блоков и формы
menuCB.addEventListener('click', (e) => {
	comtools.addEventListener('change', vm);
	function vm() {
		if (document.querySelector('.menu__toggle').checked) {
			form.style.display = '';
		} else {
			form.style.display = 'none';
			var portableForm = document.getElementById('newForm');
			if (portableForm) {
				portableForm.remove();
			};
		}
	}
	e.stopPropagation();
});

//переключатель у самой формы с комментариями
cChkbx.addEventListener('click', (e) => {
	if (document.querySelector('.comments__marker-checkbox').checked) {
		commBody.style.display = '';
	} else {
		commBody.style.display = 'none';
	}
	e.stopPropagation();
});

app.addEventListener('click', b_c);	//вывод формы добавления комментария
function b_c(e) {
		var portableForm = document.getElementById('newForm');
		if (portableForm) {
			portableForm.remove();
			openForm(e);
		} else {
			openForm(e);
		}
}

function openForm(e) {
	var newForm = document.createElement('form');
	newForm.className = 'comments__form';
	newForm.id = 'newForm';
	newForm.innerHTML = '<span class="comments__marker"></span><input type="checkbox" checked class="comments__marker-checkbox">	<div class="comments__body">	<div class="comment">	<div class="loader"><span></span>	<span></span>	<span></span>	<span></span>	<span></span>	</div></div><textarea class="comments__input" type="text" placeholder="Напишите ответ..."></textarea>	<input class="comments__close" type="button" value="Закрыть">	<input class="comments__submit" type="submit" value="Отправить">		</div>';
	app.appendChild(newForm);

	var box = e.target;
	var b = box.getBoundingClientRect();

	newForm.style.left = e.pageX - b.left +'px';
	newForm.style.top = e.pageY - b.top + 'px';

	var addCLoader = document.querySelector('#newForm .loader');
	addCLoader.style.display = 'none';
}

bSubmit.addEventListener('click', fSubmit);
function fSubmit(e) {
	e.preventDefault();

	let message = document.querySelector('.comments__input').value;

	let posY, posX;
	let imgCoords = pic.getBoundingClientRect();
	posX = imgCoords.left;
	posY = imgCoords.top;

	const xhr = new XMLHttpRequest();
	xhr.open('POST', `https://neto-api.herokuapp.com/pic/${imgId}/comments`, true);
	xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

	var commentData = 'message=' + encodeURIComponent(message) + '&left=' + encodeURIComponent(posX) + '&top=' + encodeURIComponent(posY);
	if (message !== '') {
		xhr.send(commentData);
	} else {
		console.log('Пустая форма!');
	}

	xhr.upload.addEventListener('progress', () => {
		commentLoader.style.display = '';
	}, false);

	xhr.addEventListener('load', () => {
		if (xhr.status === 200) {
			let dataMsg = JSON.parse(xhr.responseText);
			commentLoader.style.display = 'none';
			pushComment(dataMsg);
			imgData(imgId);
	 } else {
		 console.log('Ошибка отправки комментария: ' + `${xhr.responseText}`);
	 }
	});//заканчивается загрузка
}

function pushComment(data) {
	var newComment = document.createElement('div');
	newComment.className = "comment";
	newComment.innerHTML = `<div class="comment"><p class="comment__time">${data.timestamp}</p><p class="comment__message">${data.message}</p></div>`;
	let prevElem = document.querySelector('.comments__input');
	commBody.insertBefore(newComment, prevElem);
}



//перетаскивание меню
var dragMenu = document.querySelector('.menu');
var dragElement = document.querySelector('.drag');
dragElement.onmousedown = function(e) {

  var coords = getCoords(dragMenu);
  var shiftX = e.pageX - coords.left;
  var shiftY = e.pageY - coords.top;

  dragMenu.style.position = 'absolute';
  document.body.appendChild(dragMenu);
  moveAt(e);

  dragMenu.style.zIndex = 1000;

  function moveAt(e) {
    dragMenu.style.left = Math.max(Math.min(e.pageX - shiftX, dragMenu.parentNode.clientWidth - dragMenu.clientWidth), 0) + 'px';//e.pageX - shiftX + 'px';
    dragMenu.style.top = Math.max(Math.min(e.pageY - shiftX, dragMenu.parentNode.clientHeight - dragMenu.clientHeight), 0) + 'px';//e.pageY - shiftY + 'px';
  }

  document.onmousemove = function(e) {
    moveAt(e);
  };

  dragElement.onmouseup = function() {
    document.onmousemove = null;
    dragMenu.onmouseup = null;
  };

}
dragMenu.ondragstart = function() {
  return false;
};
function getCoords(elem) {
  var box = elem.getBoundingClientRect();
  return {
    top: box.top + pageYOffset,
    left: box.left + pageXOffset
  };
}
