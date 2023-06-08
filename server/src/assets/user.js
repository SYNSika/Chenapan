const users = [];

const addUser = (username, id) => {
    const existingUser = users.find(user => {user.username === username && user.id === id});
    if(existingUser){
        return {error : "pseudo déjà utilisé"};
    }
    const user = {username, id};

    users.push(user);
    return user;
}
const removeUser = (id) => {
    const index = users.findIndex(user => user.id === id);
    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
}

const getUser = (id) => users.find(user => user.id === id);

const getAllUsers = () => users;

module.exports = {addUser, removeUser,getUser,getAllUsers};
