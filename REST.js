// token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHBlZGllbnRlIjoiNzEzNzc3IiwiaWF0IjoxNTczNDkzNTYzfQ.Hj03dxpluYCvNCAAtb-OJ1EyOouqXCn2RuaSPyazsB0
localStorage.token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHBlZGllbnRlIjoiNzEzNzc3IiwiaWF0IjoxNTczNTgzMTY5fQ.Cb1OYsucuTgGvoQ65UqS-CDLOPBdyDKNup9E46BwiPU";
let baseURL = "https://users-dasw.herokuapp.com/";
function makeHTTPRequest(endpoint, method, headers, data, cbOk, cbErr) {
    let xhr = new XMLHttpRequest();
    xhr.open(method, baseURL + endpoint);
    // xhr.setRequestHeader('Content-Type', 'application/json');
    for (let k in headers) {
        xhr.setRequestHeader(k, headers[k]);
    }
    xhr.send(JSON.stringify(data));
    xhr.onload = () => {
        if (xhr.status != 200 && xhr.status != 201) {
            cbErr(xhr.status + ": " + xhr.statusText);
        } else {
            cbOk(xhr.responseText);
        }
    }
}

function getToken(expediente) {
    makeHTTPRequest("api/tokenDASW", 'GET', {
            "x-expediente": expediente
        },
        null,
        function (response) {
            localStorage.token = response.token;
        },
        function (reason) {
            alert('the game ' + reason);
        });
}


let registro = document.getElementById('registro');
let b = registro.querySelector('.btn-success');
let f = registro.querySelector('form');
b.classList.add('disabled');
registro.addEventListener('change', function (e){
    let reg = registro.querySelectorAll(':invalid');
    e.target.style = "";
    let pwd = f.querySelectorAll('input[type="password"]');
    reg.forEach(function(a){
        a.style = "border-color: red;"
    })
    if(pwd[0].value != pwd[1].value){
        pwd[1].style = "border-color: red;"
    }
    if(reg.length>=1 || pwd[0].value != pwd[1].value){
        b.classList.add('disabled');
    }else{
        b.classList.remove('disabled');
    }
    

});

f.addEventListener('submit',function(e){
    event.preventDefault();
    let a = registro.querySelector('.alert');
    if(a!=null) a.remove();
    let ded = {
        "nombre" : f.querySelectorAll('input[type="text"]')[0].value,
        "apellido" : f.querySelectorAll('input[type="text"]')[1].value,
        "correo" : f.querySelector('input[type="email"]').value,
        "password": f.querySelector('input[type="password"]').value,
        "url": f.querySelector('input[type="url"]').value,
        "fecha": f.querySelector('input[type="date"]').value,
        "sexo": f.querySelector(':checked').value
    }
    
    makeHTTPRequest("api/users", 'POST',{
        "x-auth": localStorage.token,
        'Content-Type': 'application/json'
    },
    ded,
    (kk)=>{
        let a = document.createElement('div');
        a.classList.add('alert-success');
        a.classList.add('alert');
        a.innerText = 'Usuario registrado con exito';
        registro.querySelector('.modal-body').appendChild(a);
    },
    (noK)=>{
        let a = document.createElement('div');
        a.classList.add('alert-danger');
        a.classList.add('alert');
        a.innerText= 'Usuario no pudo ser registrado';
        registro.querySelector('.modal-body').appendChild(a);
    })
});

let login = document.getElementById('modelId');
login.querySelector('.btn-success').addEventListener('click',function(a){
    let xd = login.querySelectorAll('input');
    let ded = {
        "correo": xd[0].value,
        "password" :xd[1].value 
    }
    makeHTTPRequest("api/login","post",
    {
        "x-auth": localStorage.token,
        'Content-Type': 'application/json'
    },
    ded,
    (kk)=>{
        localStorage.userToken = JSON.parse(kk).token;
        window.location.href = "/consulta.html"
    },
    (noK)=>{
        alert(noK);
    })
});


