const options = require('../dbconfig/mariaDBdatabase');
const knex = require('knex')(options);

class Productos {
    constructor() {
        this.producto = [];
        this.crearTabla();
    }

    crearTabla() {
        knex.schema.createTable('productos', table => {
            table.string('nombre');
            table.integer('precio');
            table.string('thumbnail');
            table.integer('id');
        }).then(() => {
            console.log('Tabla productos creada!');
        }).catch(error => {
            console.log('Error:', error);
            throw error;
        }).finally(() => {
            console.log('Cerrando conexión...');
            knex.destroy();
        });
    }

    listar() {
        knex.from('productos').select('*')
            .then(rows => {
                for (row of rows) {
                    console.log(`${row['nombre']} ${row['precio']} ${row['thumbnail']}`);
                }
            }).catch(error => {
                console.log('Error:', error);
            }).finally(() => {
                console.log('Cerrando conexión...');
                knex.destroy();
            });
        return this.producto;
    }

    async guardar(productos) {
        try{
            await knex('productos').insert(productos)
            console.log('Producto agregado a la tabla')
        }        
        catch (error) {
            console.log(error);
        } finally {
            knex.destroy();
        }
        
        this.producto.push(productos);
    }

    actualizar(idProducto, nuevoProducto) {
        this.producto[idProducto] = nuevoProducto;
        knex.from('productos').where('id', `${idProducto}`).update(nuevoProducto)
            .then(() => {
                console.log('Producto actualizado')
            }).catch(error => {
                console.log('Error:', error);
            }).finally(() => {
                console.log('Cerrando conexión...');
                knex.destroy();
            });
    }

    borrar(idProducto) {
        let productoBorrado = this.producto.splice(idProducto, 1);
        knex.from('productos').where('id', '==', `${idProducto}`).del()
            .then(() => {
                console.log('Producto eliminado')
            }).catch(error => {
                console.log('Error:', error);
            }).finally(() => {
                console.log('Cerrando conexión...');
                knex.destroy();
            });
        return productoBorrado;
    }
}


module.exports = new Productos();