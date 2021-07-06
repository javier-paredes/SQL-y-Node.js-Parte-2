const express = require('express');
const productos = require('./api/productos');
const handlebars = require('express-handlebars')
const app = express();
const http = require('http');
const server = http.Server(app);
const io = require('socket.io')(server);


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ARCHIVOS ESTÁTICOS
app.use(express.static('public'));

//CONFIGURAR HANDLEBARS
app.engine('hbs', handlebars({
    extname: '.hbs',
    defaultLayout: 'index.hbs',
    layoutsDir: __dirname + '/views/layouts'
}));

// ESTABLECER MOTOR DE PLANTILLAS
app.set("view engine", "hbs");
// DIRECTORIO ARCHIVOS PLANTILLAS
app.set("views", "./views");

// CREAR ROUTER
const routerApi = express.Router()

// USAR ROUTERS
app.use('/api', routerApi)


// LISTAR PRODUCTOS
routerApi.get('/productos/listar', (req, res) => {
    productos.listar();
    if (productos.producto.length > 0) {
        res.render('vista', { hayProductos: true, productos: productos.listar() })
    } else if (productos.producto.length == 0) {
        res.render('vista', { hayProductos: false })
    }
})

// LISTAR PRODUCTOS POR ID
routerApi.get('/productos/listar/:id', (req, res) => {
    let mensajeLista = {};
    if (!productos.producto[req.params.id]) {
        mensajeLista = { error: 'Producto no encontrado' };
    } else {
        mensajeLista = productos.producto[req.params.id];
    }
    res.json(mensajeLista)
})

// GUARDAR PRODUCTO
routerApi.post('/productos/guardar', (req, res) => {
    let nuevoProducto = {};
    nuevoProducto.title = req.body.title;
    nuevoProducto.price = req.body.price;
    nuevoProducto.thumbnail = req.body.thumbnail;
    nuevoProducto.id = productos.producto.length;
    productos.guardar(nuevoProducto)

    if (productos.producto.length > 0) {
        res.render('vista', { hayProductos: true, productos: productos.producto })
    } else if (productos.producto.length == 0) {
        res.render('vista', { hayProductos: false })
    }

})

//ACTUALIZAR PRODUCTO POR ID
routerApi.put('/productos/actualizar/:id', (req, res) => {
    let idProducto = req.params.id;
    let nuevoProducto = req.body;
    productos.actualizar(idProducto, nuevoProducto);
    nuevoProducto.id = productos.producto.indexOf(nuevoProducto);
    res.json(nuevoProducto);
})

// BORRAR PRODUCTO POR ID
routerApi.delete('/productos/borrar/:id', (req, res) => {
    let idProducto = req.params.id;
    res.json(productos.borrar(idProducto));
})

// DATOS CHAT

const messages = [
    { autor: 'Juan', texto: '¡Hola! ¿Que tal?' },
    { autor: 'Pedro', texto: '¡Muy bien! ¿Y vos?' },
    { autor: 'Ana', texto: '¡Genial!' }
];
// SE EJECUTA AL REALIZAR LA PRIMERA CONEXION
io.on('connection', async socket => {
    console.log('Usuario conectado')

    // GUARDAR PRODUCTO
    socket.on('nuevo-producto', nuevoProducto => {
        console.log(nuevoProducto)
        productos.guardar(nuevoProducto)
    })
    // VERIFICAR QUE SE AGREGA UN PRODUCTO
    socket.emit('guardar-productos', () => {
        socket.on('notificacion', data => {
            console.log(data)
        })
    })
    // ACTUALIZAR TABLA
    socket.emit('actualizar-tabla', productos.producto)

    // GUARDAR Y MANDAR MENSAJES QUE LLEGUEN DEL CLIENTE
    socket.on("new-message", function (data) {
		messages.push(data);
        console.log(data)
		io.sockets.emit("messages", messages);
	});

});

// pongo a escuchar el servidor en el puerto indicado
const puerto = 8080;

// USO server PARA EL LISTEN
const svr = server.listen(puerto, () => {
    console.log(`servidor escuchando en http://localhost:${puerto}`);
});


// en caso de error, avisar
server.on('error', error => {
    console.log('error en el servidor:', error);
});
