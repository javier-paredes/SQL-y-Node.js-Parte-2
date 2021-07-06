const sqlite3 = {
    client: 'sqlite3',
    connection: {
        filename: '../DB/mensajes.sqlite'
    },
    useNullAsDefault: true
}

module.exports = sqlite3;