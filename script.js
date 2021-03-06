function destroyModal() {
    var field = document.getElementById("name-field");
    if (field.value === "")
        return;
    if (window.firepadready) {
        window.firepad.setUserId(field.value);
    } else {
        window.firepad.on('ready', function () {
            window.firepad.setUserId(field.value);
        });
    }
    var a = document.getElementById("modal");
    a.parentNode.removeChild(a);
    firebase.database().ref('users/').on('value', function (e) {
        updateUserBar(e.val());
    });
}

function submit() {

    var dict = {
        'text/x-python': 'python',
        'text/x-c++src': 'c++',
        'text/javascript': 'js',
        'text/x-sh': 'bash',
    };
    var req = new XMLHttpRequest();
    var lang = document.getElementById("lang-select").value;
    req.onreadystatechange = function () {
        if (req.readyState === XMLHttpRequest.DONE && req.status === 200) {
            document.getElementById("exec").innerText = (req.responseText);
        }
    };
    req.open('POST', 'https://pad.rishav.io/' + dict[lang]);
    req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    req.send('code=' + encodeURIComponent(window.firepad.getText()));
}

function initUserBar() {
    var ubar = document.createElement("div");
    ubar.id = "user-bar";
    document.body.appendChild(ubar);
    return ubar;
}

function updateUserBar(data) {
    var ubar = document.getElementById("user-bar");
    if (!ubar) ubar = initUserBar();
    var users = [];
    for (var user in data) {
        if (data.hasOwnProperty(user))
            users.push([user, data[user].color]);
    }
    ubar.innerHTML = "";
    users.forEach(function (i) {
        var el = document.createElement("span");
        el.className = "user";
        el.style.color = i[1];
        el.innerText = i[0];
        ubar.appendChild(el);
    });
}

function changeMode() {
    window.cm.setOption('mode', document.getElementById("lang-select").value);
}

window.init = function () {

    var config = {
        apiKey: "AIzaSyCaeoS-mUI6JrRIbnUFytRop7-lPz0v4b0",
        authDomain: "librepad.firebaseapp.com",
        databaseURL: "https://librepad.firebaseio.com",
        projectId: "librepad",
        storageBucket: "librepad.appspot.com",
        messagingSenderId: "742345228534"
    };
    firebase.initializeApp(config);
    var firepadRef = firebase.database().ref();

    var codeMirror = CodeMirror(document.getElementById('firepad'), {
        lineWrapping: true,
        theme: 'monokai',
        mode: 'python',
        lineNumbers: true,
    });

    var firepad = Firepad.fromCodeMirror(firepadRef, codeMirror);

    firepad.on('ready', function () {
        window.firepadready = true;
    });

    document.getElementById("lang-select").onchange = changeMode;

    window.cm = codeMirror;
    window.firepad = firepad;
    window.firebase = firebase;

};
