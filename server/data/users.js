export class User {
    constructor(id, pwd){
        this.id = id;
        this.pwd = pwd;
    }
}

class Users {
    constructor(){
        this.users = [
            new User("hugo.lecler@etu.umontpellier.fr", "pwd"),
            new User("test@moodle.com", "plage"),
            new User("test1@moodle.com", "plage"),
            new User("plage@moodle.com", "plage"),
        ]
        this.findByLogin = this.findByLogin.bind(this);
    }

    findByLogin(id, pwd){
        return this.users.find(u => u.id == id && u.pwd == pwd);
    }

    findById(id){
        return this.users.find(u => u.id == id);
    }

    add(user){
        this.users.push(user);
    }

    remove(id){
        this.users = this.users.filter(u => u.id != id);
    }

    update(id, newUser){
        this.removeUser(id);
        this.addUser(newUser);
    }
}

export const users = new Users();