//originalmente en x-user-token tenia localstorage.userToken pero luego dejo de funcionar por eso esta token para ambos

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

let lista = document.getElementById('lista');

function printAllUsers(a) {
    let users;
    let suffix;
    if (a == undefined || a == "") suffix = "";
    else suffix = "?nombre=" + a
    
    lista.innerHTML = "";
    makeHTTPRequest('api/users/'+suffix, 'GET', {
            'x-auth': localStorage.token,
            'x-user-token': localStorage.token
        },
        undefined,
        kk => {
            users = JSON.parse(kk);
            printUsers(users);
        },
        noK => {
            console.log("users couldn't be loaded\n" + noK);
        });
    

}

function printUsers(users) {
    for (let index = 0; index < users.length; index++) {
        let element = users[index];
        let a;
        makeHTTPRequest('api/users/' + element.correo, 'GET', {
                'x-auth': localStorage.token,
                'x-user-token': localStorage.token
            }, undefined,
            kk => {
                a = JSON.parse(kk);
                let ded = `<div class="media col-8 mt-2">
                    <div class="media-left align-self-center mr-3">    
                        <img class="rounded-circle" src="${a.url}" width="128px" height="128px">
                    </div>
                    <div class="media-body">
                        <h4>${a.nombre} ${a.apellido}</h4>
                        <p >Correo: ${a.correo}</p>
                        <p >Fecha de nacimiento: ${a.fecha} </p>
                        <p >Sexo: ${a.sexo=='M'?'Mujer':'Hombre'} </p>
                    </div>
                    <div class="media-right align-self-center">
                        <div class="row">
                            <a href="#" class="btn btn-primary edit" onclick=verDetalle("${a.correo}")><i class="fas fa-search edit  "></i></a>
                        </div>
                        <div class="row">
                            <a href="#" class="btn btn-primary mt-2" onclick=editar("${a.correo}") data-toggle="modal" data-target="#editar"><i class="fas fa-pencil-alt edit  "></i></a>
                        </div>
                        <div class="row">
                            <a href="#" class="btn btn-primary mt-2" onclick=eliminar("${a.correo}") data-toggle="modal" data-target="#eliminar"><i class="fas fa-trash-alt  remove "></i></i></a>
                        </div>
                    </div>
                </div>`
                lista.insertAdjacentHTML('beforeend', ded);
            },
            noK => {
                console.log("couldn't get user " + index + "\n" + noK);
            });

    }
}

function verDetalle(email) {
    console.log(email);
}

function editar(email) {
    makeHTTPRequest('api/users/' + email, 'GET', {
            'x-auth': localStorage.token,
            'x-user-token': localStorage.token
        }, undefined,
        kk => {
            let a = JSON.parse(kk);
            document.getElementById('cName').value = a.nombre;
            document.getElementById('cLName').value = a.apellido;
            document.getElementById('cEmail').value = a.correo;
            document.getElementById('cPwd1').value = a.password;
            document.getElementById('cPwd2').value = a.password;
            document.getElementById('cDate').value = a.fecha;
            document.getElementById('cURL').value = a.url;
            document.getElementsByClassName(`sexo${a.sexo == "M"?"F":"M"}`)[0].setAttribute('checked', true);
        },
        noK => {
            console.log("couldn't get user " + index + "\n" + noK);
        });
}

function eliminar(email) {
    makeHTTPRequest('api/users/' + email, 'GET', {
            'x-auth': localStorage.token,
            'x-user-token': localStorage.token
        }, undefined,
        kk => {
            let a = JSON.parse(kk);
            document.getElementById('dName').value = a.nombre;
            document.getElementById('dLName').value = a.apellido;
            document.getElementById('dEmail').value = a.correo;
        },
        noK => {
            console.log("couldn't get user " + index + "\n" + noK);
        });
}

printAllUsers();

document.getElementById('editar').querySelector('form').addEventListener('submit', e => {
    let form = document.getElementById('editar').querySelector('form');
    let ded = {
        "nombre": document.getElementById('cName').value,
        "apellido": document.getElementById('cLName').value,
        "correo": document.getElementById('cEmail').value,
        "password": document.getElementById('cPwd1').value,
        "url": document.getElementById('cURL').value,
        "fecha": document.getElementById('cDate').value,
        "sexo": form.querySelector(':checked').value
    };
    makeHTTPRequest('api/users/' + ded.correo, 'PUT', {
            'x-auth': localStorage.token,
            'x-user-token': localStorage.token,
            'Content-Type': 'application/json'
        }, ded,
        kk => {
            alert('Usuario actualizado con exito');
            printAllUsers();
        },
        noK => {
            alert(noK);
        })
    e.preventDefault();
});

document.getElementById('eliminar').querySelector('form').addEventListener('submit', event => {
    makeHTTPRequest('api/users/' + document.getElementById('dEmail').value, 'DELETE', {
            'x-auth': localStorage.token,
            'x-user-token': localStorage.token,
            'Content-Type': 'application/json'
        }, undefined,
        kk => {
            alert('Usuario eliminado con exito');
            printAllUsers();
        },
        noK => {
            alert('Usuario no pudo ser eliminado');
        });

    event.preventDefault();

});
document.getElementById('btnBuscar').addEventListener('click',buscar);
function buscar() {
    let name = document.getElementById('busqueda').value;
    
    printAllUsers(name);
};