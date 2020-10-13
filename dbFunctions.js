const db = require('./database/connection.js');

module.exports = {
    addUser,
    findUsers,
    findById
}

//CRUD
//Create
async function addUser(user) {
    try {
        const id = await db('users').insert(user, 'id'); 
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