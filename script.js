// База комментариев
let listComments = [
    {
        id: 1,
        user: 'Samolov Aleks',
        date: '2023-03-14T13:51:50.417',
        text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab aliquam, at doloribus eveniet laborum libero minus non officia perspiciatis porro quidem, recusandae repudiandae, soluta. Dignissimos!'
    },
    {
        id: 2,
        user: 'Smirnov Makar',
        date: '2023-03-13T13:51:50.417',
        text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab aliquam, at doloribus eveniet laborum libero minus non officia perspiciatis porro quidem, recusandae repudiandae, soluta. Dignissimos!'
    },
];
// текущий ИД комментария в базе
let currentId = listComments.length;
// Отображение комментариев при загрузке
function renderComments() {
    if (listComments.length) {
        listComments.forEach(item => commentsList.append(createComment(item)));
    } else {
        commentEmpty()
    }
}
// Отображаем шаблон при отсутствии комментариев
function commentEmpty() {
    const emptyList = document.createElement('h4');
    emptyList.textContent = 'Комментариев пока нет';
    commentsList.append(emptyList);
}
// Создаем новый элемент комментария
function createComment(comment) {
    const { id, user, date, text } = comment;

    const commentItem = document.createElement('div');
    commentItem.className = 'comment-item';
    commentItem.id = `item-${id}`;
    commentItem.addEventListener('click', (event) => commentClick(event));

    const commentParams = document.createElement('div');
    commentParams.className = 'comment-params';

    const commentParamsUser = document.createElement('h5');
    commentParamsUser.className = 'comment-params__user';
    commentParamsUser.textContent = user;
    commentParams.append(commentParamsUser);

    const commentParamsDate = document.createElement('p');
    commentParamsDate.className = 'comment-params__date';
    commentParamsDate.textContent = viewDate(date);
    commentParams.append(commentParamsDate);

    const commentMsg = document.createElement('div');
    commentMsg.className = 'comment-msg';

    const commentMsgText = document.createElement('p');
    commentMsgText.className = 'comment-msg__text';
    commentMsgText.textContent = text;
    commentMsg.append(commentMsgText);

    const commentAction = document.createElement('div');
    commentAction.className = 'comment-action';
    commentAction.innerHTML = '<i class="bi bi-heart"></i><i class="bi bi-trash"></i>';

    commentItem.append(commentParams);
    commentItem.append(commentMsg);
    commentItem.append(commentAction);

    return commentItem;
}
// Формат отображения даты
function viewDate(strDate) {
    let result;
    const date = new Date(strDate);

    const diffDay = dateDiff(date);

    if (diffDay === 0) {
        result = 'сегодня'
    } else if (diffDay === 1) {
        result = 'вчера'
    } else {
        const day = leadingZero(date.getDate());
        const month = leadingZero(date.getMonth() + 1);
        const year = date.getFullYear();
        result = `${day}.${month}.${year}`;
    }
    result += ` ${getTime(date, false)}`;

    return result;
}
// Функция возвращает время в формате
function getTime(date, withMillisecond) {
    const hour = leadingZero(date.getHours());
    const minute = leadingZero(date.getMinutes());
    const second = leadingZero(date.getSeconds());
    let result = `${hour}:${minute}:${second}`;
    if (withMillisecond) {
        const millisecond = leadingZero(date.getMilliseconds(), 3);
        result += `.${millisecond}`;
    }
    return result;
}
// Функция для вычисления количества дней между датами
function dateDiff(date) {
    const now = new Date();
    return Math.round((now - date) / (1000 * 60 * 60 * 24));
}
// Функция клика по иконкам
function commentClick(element) {
    if (element.target.tagName === 'I') {
        const item = element.target.closest('.comment-item');
        const listClass = Array.from(element.target.classList);
        if (listClass.includes(classIcon.heart) || listClass.includes(classIcon.heartFill)) {
            commentLike(item);
        }
        else if (listClass.includes(classIcon.trash)) {
            commentRemove(item);
        }
    }
}
// Установка/снятие лайка
function commentLike(element) {
    const iconHeart = element.querySelector('.comment-action').firstElementChild;
    const listClass = Array.from(iconHeart.classList);
    if (listClass.includes(classIcon.heart)) {
        iconHeart.classList.remove(classIcon.heart);
        iconHeart.classList.add(classIcon.heartFill);
    } else if (listClass.includes(classIcon.heartFill)) {
        iconHeart.classList.remove(classIcon.heartFill);
        iconHeart.classList.add(classIcon.heart);
    }
}
// Удаление комментария
function commentRemove(element) {
    const res = confirm('Вы уверены, что хотите удалить комментарий?');
    if (res) {
        const id = +element.id.split('-')[1];
        listComments = listComments.filter(item => item.id !== id);
        element.remove();
        if (!listComments.length) {
            commentEmpty();
        }
    }
}
// Изменяем внешний вид полей ввода
function changeInput(element, minLength) {
    const value = element.value.trim();
    if (!value) {
        valid(element, 'Не может быть пустым');
    }
    else if (value.length < minLength) {
        valid(element, `Минимальная длина - ${minLength} символа`);
    } else {
        valid(element, '');
    }
}
// Отслеживаем изменение даты
function changeDate(element) {
    const value = element.value;

    if (value && !isValidDate(value)) {
        valid(element, 'Неверный формат даты');
    } else {
        const toDate = +new Date(value);
        if (toDate > Date.now()) {
            valid(element, 'Дата не может быть больше сегодняшней');
        } else {
            valid(element, '');
        }
    }
}
// Валидируем дату
function isValidDate(str, separator = '-') {
    const getValue = str.split(separator);
    const day = parseInt(getValue[2]);
    const month = parseInt(getValue[1]);
    const year = parseInt(getValue[0]);
    if (year < 1901 || year > 2100) return false;
    if (month < 1 || month > 12) return false;
    if (day < 1 || day > 31) return false;
    if ([4, 6, 9, 11].includes(month) && day === 31) return false;
    if (month === 2) {
        const isleap = (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0));
        if (day > 29 || (day === 29 && !isleap)) return false;
    } else {
        return true;
    }
    return true;
}
// Валидируем введенные данные
function valid(element, text) {
    const id = element.id;
    const labelFor = document.querySelector(`label[for=${id}]`);
    const isError = text.length > 0;

    setValid(element, isError);
    setBtnDisabled(id, isError);

    labelFor.textContent = text;
    labelFor.hidden = !isError;
}
// Устанавливаем класс результата валидации
function setValid(element, isError) {
    const classList = Array.from(element.classList);
    if (isError) {
        if (classList.includes(classValid.valid)) element.classList.remove(classValid.valid);
        if (!classList.includes(classValid.invalid)) element.classList.add(classValid.invalid);
    } else {
        if (classList.includes(classValid.invalid)) element.classList.remove(classValid.invalid);
        if (!classList.includes(classValid.valid)) element.classList.add(classValid.valid);
    }
}
// Доступность кнопки отправки данных
function setBtnDisabled(id, isError) {
    stateForm[id] = !isError;
    btnSend.disabled = Object.values(stateForm).some(e => !e);
}
// Функция очистки формы
function clearForm(event) {
    event.preventDefault();

    resetElement(commentUser);
    resetElement(commentDate, true);
    resetElement(commentMsg);

    btnSend.disabled = true;
}
// Функция очистки элемента
function resetElement(element, state = false) {
    element.value = '';
    element.classList.remove(classValid.valid, classValid.invalid);
    document.querySelector(`label[for=${element.id}]`).hidden = true;
    stateForm[element.id] = state;
}
// Функция отправки данных
function sendForm(event) {
    event.preventDefault();
    // Отменяем отправку данных, если состояние формы не валидно и отображаем ошибки
    if (cancelSending()) return;
    // Считываем данные
    const user = commentUser.value.trim();
    const text = commentMsg.value.trim();
    let date = commentDate.value;
    // Получить блок времени
    const now = new Date();
    const time = getTime(now, true);
    // Сформируем дату
    date ? date += `T${time}` : date = now;
    // Увеличим счетчик ИД для базы комментиариев
    currentId++;
    // Формируем новый объект комментария
    const newComment = {
        id: currentId,
        user: user,
        date: date,
        text: text
    };
    // Уберем шаблон "без комментариев"
    if (!listComments.length) {
        commentsList.innerHTML = '';
    }
    // Добавляем новый комментарий в html и в базу
    insertNewComment(newComment);
    // Очищаем форму
    btnCancel.click();
    commentUser.focus();
}
// Отменяем отправку и отображаем ошибки
function cancelSending() {
    if (Object.values(stateForm).some(e => !e)) {
        Object.keys(stateForm).forEach(state => {
            if (!stateForm[state]) {
                const element = commentForm.elements[state];
                element.type === 'date' ? changeDate(element) : changeInput(element);
            }
        })
        return true;
    }
    return false;
}
// Вставляем новый комментарий в html
function insertNewComment(newComment) {
    const temp = new Date(newComment.date);
    let isAdd = false;
    for (let i = 0; i < listComments.length; i++) {
        if (temp > new Date(listComments[i].date)) {
            commentsList
                .querySelector(`#item-${listComments[i].id}`)
                .before(createComment(newComment));
            listComments.splice(i, 0, newComment);
            isAdd = true;
            break;
        }
    }
    if (!isAdd) {
        listComments.push(newComment);
        commentsList.append(createComment(newComment))
    }
}
// Добавляем лидирующие нули
function leadingZero(value, size=2) {
    let result = value.toString();
    while (result.length < size) result = '0' + result;
    return result;
}

// Получаем форму отправки
const commentForm = document.forms.commentForm;
// Получаем поля формы
const commentUser = commentForm.elements.commentUser;
const commentDate = commentForm.elements.commentDate;
const commentMsg = commentForm.elements.commentMsg;
// Получаем кнопки формы
const btnCancel = document.getElementById('btnCancel');
const btnSend = document.getElementById('btnSend');
// Получаем блок комментариев
const commentsList = document.querySelector('.comments-list');
// Состояние валидности формы
const stateForm = {
    commentUser: false,
    commentDate: true,
    commentMsg: false
}
// Классы для валидации формы
const classValid = {valid: 'is-valid', invalid: 'is-invalid'};
const classIcon = {heart: 'bi-heart', heartFill: 'bi-heart-fill', trash: 'bi-trash'};
// Добавляем прослушку событий для формы
commentForm.addEventListener('submit', (event) => sendForm(event));
commentForm.addEventListener('keydown', (event) => {
    if (event.code === 'Enter') sendForm(event);
});
// Добавляем прослушку событий для поля пользователя
commentUser.addEventListener('change', (event) => changeInput(event.target, 3));
commentUser.addEventListener('input', (event) => changeInput(event.target, 3));
commentUser.focus();
// Добавляем прослушку событий для поля даты
commentDate.addEventListener('change', (event) => changeDate(event.target));
commentDate.addEventListener('input', (event) => changeDate(event.target));
// Добавляем прослушку событий для поля сообщения
commentMsg.addEventListener('change', (event) => changeInput(event.target, 2));
commentMsg.addEventListener('input', (event) => changeInput(event.target, 2));
// Добавляем прослушку событий для кнопки очистки
btnCancel.addEventListener('click', (event) => clearForm(event));
// Отображаем список комментариев
renderComments();