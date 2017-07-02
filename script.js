function destroyModal() {
    var field = document.getElementById("name-field");
    if (field.value === "")
        return;
    if (window.firepadready) {
        window.firepad.setUserId(field.value);
    } else {
        window.firepad.on('ready', function() {
            window.firepad.setUserId(field.value);
        });
    }
    var a = document.getElementById("modal");
    a.parentNode.removeChild(a);
    firebase.database().ref('users/').on('value', function(e) {
        updateUserBar(e.val());
    });
}

function submit() {

    var dict = {
        'text/x-python': 'python',
        //'text/x-c++src': 'c++',
        //'text/javascript': 'js',
        'text/x-sh': 'bash',
    };
    var req = new XMLHttpRequest();
    var lang = document.getElementById("lang-select").value;
    req.onreadystatechange = function() {
        if (req.readyState === XMLHttpRequest.DONE && req.status === 200) {
            document.getElementById("exec").innerText = (req.responseText);
        }
    };
    req.open('POST', 'https://runner.rishav.tech/' + dict[lang]);
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
    users.forEach(function(i) {
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

window.init = function() {

    var config = {
    apiKey: "AIzaSyAZZP8GGVYbDj0Aup3Sr82U1N7g1QJWbfY",
    authDomain: "freepad-e8a2b.firebaseapp.com",
    databaseURL: "https://freepad-e8a2b.firebaseio.com",
    projectId: "freepad-e8a2b",
    storageBucket: "freepad-e8a2b.appspot.com",
    messagingSenderId: "108853684733"
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

    firepad.on('ready', function() {
        window.firepadready = true;
    });

    document.getElementById("lang-select").onchange = changeMode;

    window.cm = codeMirror;
    window.firepad = firepad;
    window.firebase = firebase;

};
