'use strict';

const pic = document.querySelector('img'), menu = document.querySelector('.menu'),
addNew = document.querySelector('.new'), comments = document.querySelector('.comments'),
form = document.querySelector('.comments__form'), showLoader = document.querySelector(".image-loader"),
draw = document.querySelector('.draw'), burger = document.querySelector('.burger'),
rShare = document.querySelector('.share'), tShare = document.querySelector('.comments-tools'),
commentLoader = document.querySelector('.comments__body .comment .loader'),
close = document.querySelector('.comments__close'), commBody = document.querySelector('.comments__body'),
app = document.querySelector('.app'), cMarker = document.querySelector('.comments__marker'),
cChkbx = document.querySelector('.comments__marker-checkbox'), bSubmit = document.querySelector('.comments__submit');

document.addEventListener('DOMContentLoaded', () => {
	pic.setAttribute('src', '');   burger.style.display = 'none';
  comments.style.display = 'none';   draw.style.display = 'none';
  rShare.style.display = 'none';   form.style.display = 'none';
})

addNew.addEventListener('click', function(e) {
	addNew.style.display = 'none';	burger.style.display = '';
	comments.style.display = '';	form.style.display = '';	tShare.style.display = 'inline-block';
	e.stopPropagation();
}, false);

commentLoader.style.display = 'none';
const menuCB = document.querySelector('.menu__toggle-bg'); //переключатель скрытия/открытия маркеров блоков и формы
menuCB.addEventListener('click', (e) => {
	tShare.addEventListener('change', vm);
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
})

//переключатель у самой формы с комментариями
cChkbx.addEventListener('click', (e) => {
	if (document.querySelector('.comments__marker-checkbox').checked) {
		commBody.style.display = '';
	} else {
		commBody.style.display = 'none';
	}
	e.stopPropagation();
})

close.addEventListener('click', b_close);	//кнопка "закрыть"
function b_close(e) {
	document.querySelector('.comments__marker-checkbox').checked = false;
	e.stopPropagation();
}

app.addEventListener('click', b_c);	//вывод формы добавления комментария
function b_c(e) {
	//if (comments.style.display = '') {
		var portableForm = document.getElementById('newForm');
		if (portableForm) {
			portableForm.remove();
			openForm(e);
		} else {
			openForm(e);
		}
	//}
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
function bSubmit(id) {
	const message = document.querySelector('.comments__input');
	const formData1 = new FormData();
	formData1.append('message', message.value);
	formData1.append('left', );
	formData1.append('top', );

	var xhr = new XMLHttpRequest();

	xhr.upload.addEventListener('progress', () => {
		commentLoader.style.display = '';
	}, false);


	xhr.open('POST', `https://neto-api.herokuapp.com//pic/${id}/comments`, true);
	xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	xhr.send(formData1);

	xhr.addEventListener('load', () => {
		if (xhr.status === 200) {
			var data2 = JSON.parse(xhr.responseText);
			// Вывод сообщения с сервера

			commentLoader.style.display = 'none';


		// 	var id = data1.id;
		// fetch(`https://neto-api.herokuapp.com/pic/${id}`, {
		// 	method: 'GET',
		// 	mode: 'cors',
		// 	headers: {'Content-Type':'application/json'}
		// })
		// .then(res => res.json())
		// .then(res => console.log(res))
		// .catch(err => {
		// 	console.log(`Файл ${file.name} не сохранен. ${xhr.status} ${xhr.statusText}`);
		// 			err.style.display = '';
		// 			showLoader.style.display = 'none';
		// });
	 }
	});//заканчивается загрузка
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
