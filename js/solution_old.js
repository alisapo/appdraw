'use strict';

const app = document.querySelector('.app');
const burger = document.querySelector('.burger');
const filesInfo = document.querySelector('.new');
const inp = document.querySelector('.file');
const pic = document.querySelector('img');

const comments = document.querySelector('.comments');
const draw = document.querySelector('.draw');
const share = document.querySelector('.share');

const comtools = document.querySelector('.comments-tools');
const drtools = document.querySelector('.draw-tools');
const shtools = document.querySelector('.share-tools');

const form = document.querySelector('.comments__form');
const showLoader = document.querySelector(".image-loader");
const err = document.querySelector('.error');

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
	e.preventDefault();
}, false);

inp.addEventListener('change', handleFiles);

function handleFiles(event) {
  var files = Array.from(event.target.files);

	loadImg(files);
}

//загрузка изображения
function loadImg(files) {
	pic.setAttribute('src', '');

	files.forEach(file => {
		console.log(file);
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
				var data1 = JSON.parse(xhr.responseText);
				pic.src = data1.url;
				// Вывод сообщения с сервера

				showLoader.style.display = 'none';
				filesInfo.style.display = 'none';
				burger.style.display = '';
				share.style.display = '';
				shtools.style.display ='inline-block';

			let url = 'https://neto-api.herokuapp.com/pic/' + data1.id;
			fetch(url)//, {
				//method: 'GET' https://developer.mozilla.org/ru/docs/Web/API/Fetch_API/Using_Fetch
			//})
			.then((res) => {
				console.log(res.statusText);
				if (200 <= res.status && res.status < 300) {
					console.log(res.statusText);
					return res;
				}
				throw new Error(response.statusText);
			})
			.then((res) => {res.json(); console.log(res)})
		}

			else {
				console.log(`Файл ${file.name} не сохранен. ${xhr.status} ${xhr.statusText}`);
				err.style.display = '';
				showLoader.style.display = 'none';
		}

		});//заканчивается загрузка
	}); //заканчивается forEach
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

burger.addEventListener('click', () => {
	burger.style.display = 'none';

	filesInfo.style.display = '';
	comments.style.display = '';
	draw.style.display = '';
	share.style.display = '';

	comtools.style.display = 'none';
	drtools.style.display = 'none';
	shtools.style.display ='none';
});

comments.addEventListener('click', handleComments);
function handleComments() {
	burger.style.display = '';
	comments.style.display = '';

	filesInfo.style.display = 'none';
	comtools.style.display = 'inline-block';
	shtools.style.display = '';

	draw.style.display = 'none';
	share.style.display = 'none';
}

draw.addEventListener('click', () => {
	burger.style.display = '';

	filesInfo.style.display = 'none';
	drtools.style.display = 'inline-block';

	comments.style.display = 'none';
	share.style.display = 'none';
});

share.addEventListener('click', handleShare);

function handleShare() {
	burger.style.display = '';

	filesInfo.style.display = 'none';
	shtools.style.display = 'inline-block';

	draw.style.display = 'none';
	comments.style.display = 'none';
}

const pushCopy = document.querySelector('.menu_copy');
pushCopy.addEventListener('click', handleComments);





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
