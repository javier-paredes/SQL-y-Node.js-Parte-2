const socket = io.connect();
const options = require('../dbconfig/sqlite3database');
const knex = require('knex')(options);

knex.schema.createTable('mensajes', table => {
    id.increments('id')
    table.string('autor');
    table.string('fyh');
    table.string('texto');
}).then(() => {
    console.log('Tabla mensajes creada!');
}).catch(error => {
    console.log('Error:', error);
    throw error;
}).finally(() => {
    console.log('Cerrando conexión...');
    knex.destroy();
});

socket.on('messages', function (data) {
    console.log(data);
    render(data)
})

function render(data) {
    let html = data.map(function (elem, index) {
        return (`
        <div>
            <b style="color:blue;">${elem.autor}</b> 
            [<span style="color:brown;">${elem.fyh}</span>] : 
            <i style="color:green;">${elem.texto}</i>
        </div>
    `)
    }).join(' ');
    document.getElementById('messages').innerHTML = html;
}

socket.on('messages', function (data) { render(data); });

function addMessage(e) {
    let mensaje = {
        autor: document.getElementById('username').value,
        fyh: new Date().toLocaleString(),
        texto: document.getElementById('texto').value
    }

    knex('mensajes').insert(mensaje)
        .then(() => {
            console.log('Mensaje agregado a la tabla');
        }).catch(error => {
            console.log('Error:', error);
        }).finally(() => {
            console.log('Cerrando conexión...');
            knex.destroy();
        });


    socket.emit('new-message', mensaje);
    return false;
}

