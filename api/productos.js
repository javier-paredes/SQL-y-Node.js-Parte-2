const options = require('../dbconfig/mariaDBdatabase');
const knex = require('knex')(options);

class Productos {
    constructor() {
        this.producto = [];
        this.crearTabla();
    }

    crearTabla() {
        knex.schema.createTable('productos', table => {
            table.string('title');
            table.integer('price');
            table.string('thumbnail');
            table.integer('id');
        }).then(() => {
            console.log('Tabla productos creada!');
        }).catch(error => {
            console.log('Error:', error);
            throw error;
        })
    }

    listar() {
        knex.from('productos').select('*')
            .then(rows => {
                // for (row of rows) {
                //     console.log(`${row['title']} ${row['price']} ${row['thumbnail']} ${row['id']}`);
                // }
                console.log(rows)
            }).catch(error => {
                console.log('Error:', error);
            })
        return this.producto;
    }

    async guardar(productos) {
        try{
            await knex('productos').insert(productos)
        }        
        catch (error) {
            console.log(error);
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
            })
    }

    borrar(idProducto) {
        console.log(idProducto)
        knex.from('productos').where('id', '=', `${idProducto}`).del()
            .then(() => {
                console.log('Producto eliminado')
            }).catch(error => {
                console.log('Error:', error);
            })
        let productoBorrado = this.producto.splice(idProducto, 1);        
        return productoBorrado;
    }
}


module.exports = new Productos();