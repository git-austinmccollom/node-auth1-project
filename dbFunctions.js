const db = require('./database/connection.js');

module.exports = {
    addUser,
    findUsers,
    findById
}

//CRUD
//Create
async function addUser(credentials) {
    try {
        const id = await db('users').insert(credentials, 'id'); 
        return findById(id[0]);
    } catch (error) {
        throw error;
    }
}

//Read
function findUsers() {
    return db('users');
}

function findById(id) {
    return db('users').where({ id }).first();
}

//Update

//Delete