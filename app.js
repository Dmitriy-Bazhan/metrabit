document.addEventListener("DOMContentLoaded", async function () {
    window.storage = new Object();
    window.storage['removeTasks'] = [];

    try {
        let response = await fetch('http://metrabit/api');
        let json = await response.json();
        if (json !== '') {
            if (json.length == 0) {
                showAlertMessage();
            }

            for (let i in json) {
                putNewLine(json[i], i);
                document.getElementById('scope').innerHTML = i;
            }
        } else {
            console.log('Damn, JSON is empty. Need make fix in Api.((');
        }
    } catch (error) {
        console.log('Damn, some troubles to connect from Api.');
    }
});

window.unload = function () {
    leavePage();
}

window.onbeforeunload = function () {
    leavePage();
};

// (function (){
//     document.getElementById('send-data').addEventListener('click', function (){
//         leavePage();
//     });
// })();

function leavePage() {
    const request = new XMLHttpRequest();
    const url = "http://metrabit/save_data";
    const params = JSON.stringify(window.storage);

    request.open("POST", url);
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    request.addEventListener("readystatechange", () => {
        if (request.readyState === 4 && request.status === 200) {
            console.log(request.responseText);
        }
    });
    request.send(params);
}

(function () {
    newCoords(getWindowSize());
    window.onresize = function () {
        newCoords(getWindowSize());
    }
    let newTask = document.getElementById('createNewTask');
    newTask.addEventListener('click', function () {
        createNewTask();
    });
})();


function putNewLine(item, i) {
    window.storage[i] = item;

    let checked = '';
    let text = '';
    let time = '<span class="time">&nbsp;' + item.time + '</span>'

    if (item.success == 1) {
        checked = isChecked();
        text = '<s class="description-style-opacity">' + item.description + '</s>';
        let successful = document.getElementById('successful').getAttribute('data-score');
        successful++;
        document.getElementById('successful').innerHTML = successful;
        document.getElementById('successful').setAttribute('data-score', successful);
    } else {
        checked = notChecked();
        text = '<span class="description-style">' + item.description + '</span>';
        let active = document.getElementById('active').getAttribute('data-score');
        active++;
        document.getElementById('active').innerHTML = active;
        document.getElementById('active').setAttribute('data-score', active);
    }

    let placeholder = '';
    if (item.description == '') {
        placeholder = '<span class="description-style-opacity">Please enter task description</span>';
    }

    let block = '<div class="line-in-list-of-tasks"><div class="checkbox-block" onclick="clickCheckbox(this)">' + checked + '</div>' + time +
        '<div class="edit-block"><div class="button-edit" onclick="editTask(this)">' + edit() + '</div></div>' +
        '<div class="remove-block"><div class="button-remove" onclick="removeTask(this)">' + basket() + '</div></div>' +
        '</div>' +
        '<div class="description-block" >' + text + placeholder + '</div>' +
        '<hr>';
    let inner = document.createElement('div');
    inner.setAttribute('data-id', i);
    inner.innerHTML = block;

    let form = document.getElementById('form');
    form.append(inner);
}

function editTask(element) {
    let id = element.parentNode.parentNode.parentNode.getAttribute('data-id');
    let description = element.parentNode.parentNode.parentNode.children[1];
    let attr = description.getAttribute('contenteditable');
    if (attr == null) {
        description.setAttribute('contenteditable', 'true');
        description.setAttribute('style', 'border:solid 1px black;');
        element.innerHTML = confirmEdit();
        window.storage[id].description = description.textContent;
    } else {
        let parse = new RegExp(/^[A-Za-zА-Яа-я0-9 / ,.!?;:() ]+$/u);
        let str = description.textContent.replace(/\s+/g, ' ').trim();
        let normal = parse.test(str.trim());
        if (!normal) {
            description.setAttribute('style', 'border:solid 1px red;');
            return;
        }
        description.removeAttribute('contenteditable');
        description.removeAttribute('style');
        element.innerHTML = edit();
        window.storage[id].description = str;
    }
}

function createNewTask() {
    let lastId = document.getElementById('form').lastChild.getAttribute('data-id');

    if (lastId == null) {
        lastId = 1;
    } else {
        lastId++;
    }
    let alertMessage = document.getElementById('alert-task-message');
    if (alertMessage != null) {
        alertMessage.remove();
    }

    let now = new Date();
    let day = now.getDate();
    let month = now.toLocaleString('en', {month: 'short'});
    let year = now.getFullYear();

    let time = '<span class="time">&nbsp;' + day + '&nbsp;' + month + '&nbsp;' + year + '</span>'

    let block = '<div class="line-in-list-of-tasks"><div class="checkbox-block" onclick="clickCheckbox(this)">' + notChecked() + '</div>' + time +
        '<div class="edit-block"><div class="button-edit" onclick="editTask(this)">' + edit() + '</div></div>' +
        '<div class="remove-block"><div class="button-remove" onclick="removeTask(this)">' + basket() + '</div></div>' +
        '</div>' +
        '<div class="description-block" >Please enter task description</div>' +
        '<hr>';
    let inner = document.createElement('div');

    inner.setAttribute('data-id', lastId);
    inner.innerHTML = block;

    let form = document.getElementById('form');
    form.append(inner);
    window.storage[lastId] = {};

    window.storage[lastId].description = '';
    window.storage[lastId].time = day + ' ' + month + ' ' + year;
    window.storage[lastId].success = 0;
   
}

function clickCheckbox(element) {
    let id = element.parentNode.parentNode.getAttribute('data-id');
    if (window.storage[id].success == 1) {
        window.storage[id].success = 0;
        element.innerHTML = notChecked();
        let description = element.parentNode.parentNode.children[1];
        let text = description.textContent;
        let block = '<span class="description-style">' + text + '</span>';
        description.innerHTML = block;
    } else {
        window.storage[id].success = 1;
        element.innerHTML = isChecked();
        let description = element.parentNode.parentNode.children[1];
        let text = description.textContent;
        let block = '<s class="description-style-opacity">' + text + '</s>';
        description.innerHTML = block;
    }
}

function removeTask(element) {
    let id = element.parentNode.parentNode.parentNode.getAttribute('data-id');
    let agree = confirm('You are sure?');
    if (agree) {
        window.storage['removeTasks'].push(id);
        delete window.storage[id];
        element.parentNode.parentNode.parentNode.remove();
        if (document.getElementById('form').children.length == 0) {
            showAlertMessage();
        }
    } else {
        return;
    }
}

function getWindowSize() {
    let size = [];
    let left = document.getElementById('block-under-body').offsetLeft;
    let right = document.getElementById('block-under-body').offsetWidth;
    size[0] = left + (right / 2) - 20;
    size[1] = document.getElementById('block-under-body').offsetTop;
    return size;
}

function newCoords(size) {
    let rectangle = document.getElementById('rectangle');
    rectangle.style.left = size[0] + 'px';
    rectangle.style.top = (size[1] - 20) + 'px';
}

function basket() {
    let basket = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">' +
        '<path d="M4 7.00006H20" stroke="#AFAFAF" stroke-linecap="round" stroke-linejoin="round"/>' +
        '<path d="M10 10.9999V16.9999" stroke="#AFAFAF" stroke-linecap="round" stroke-linejoin="round"/>' +
        '<path d="M14 10.9999V16.9999" stroke="#AFAFAF" stroke-linecap="round" stroke-linejoin="round"/>' +
        '<path d="M5 7.00006L6 19.0001C6 19.5305 6.21071 20.0392 6.58579 20.4143C6.96086 20.7893 7.46957 21.0001 8 21.0001H16C16.5304 21.0001 17.0391 20.7893 17.4142 20.4143C17.7893 20.0392 18 19.5305 18 19.0001L19 7.00006" stroke="#AFAFAF" stroke-linecap="round" stroke-linejoin="round"/>' +
        '<path d="M9 7V4C9 3.73478 9.10536 3.48043 9.29289 3.29289C9.48043 3.10536 9.73478 3 10 3H14C14.2652 3 14.5196 3.10536 14.7071 3.29289C14.8946 3.48043 15 3.73478 15 4V7" stroke="#AFAFAF" stroke-linecap="round" stroke-linejoin="round"/>' +
        '</svg>';
    return basket;
}

function edit() {
    let edit = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">' +
        '<path d="M9 7H6C5.46957 7 4.96086 7.21071 4.58579 7.58579C4.21071 7.96086 4 8.46957 4 9V18C4 18.5304 4.21071 19.0391 4.58579 19.4142C4.96086 19.7893 5.46957 20 6 20H15C15.5304 20 16.0391 19.7893 16.4142 19.4142C16.7893 19.0391 17 18.5304 17 18V15" stroke="#AFAFAF" stroke-linecap="round" stroke-linejoin="round"/>' +
        '<path d="M9 15H12L20.5 6.49995C20.8978 6.10213 21.1213 5.56256 21.1213 4.99995C21.1213 4.43734 20.8978 3.89778 20.5 3.49995C20.1022 3.10213 19.5626 2.87863 19 2.87863C18.4374 2.87863 17.8978 3.10213 17.5 3.49995L9 12V15Z" stroke="#AFAFAF" stroke-linecap="round" stroke-linejoin="round"/>' +
        '<path d="M16 5L19 8" stroke="#AFAFAF" stroke-linecap="round" stroke-linejoin="round"/>' +
        '</svg>';
    return edit;
}

function notChecked() {
    let button = '<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">' +
        '<rect x="0.5" y="0.5" width="17" height="17" rx="1.5" stroke="#889DEA"/>' +
        '</svg>';
    return button;
}

function isChecked() {
    let button = '<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">' +
        '<rect width="18" height="18" rx="2" fill="#889DEA"/>' +
        '<path d="M5 8.5L7.66667 11L13 6" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>' +
        '</svg>';
    return button;
}

function confirmEdit() {
    let agree = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">' +
        '<path d="M4.99998 12L9.99998 17L20 7.00001" stroke="#889DEA" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' +
        '</svg>';
    return agree;
}

function showAlertMessage() {
    let element = document.getElementById('form');
    let block = '<span id="alert-task-message" class="alert-task-message">You have no task. Quickly tell about this to your manager.</span>';
    element.innerHTML = block;
}






