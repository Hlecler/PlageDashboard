export class User {

    constructor(id, pwd, plageId = 0){
        this.id = id;
        this.pwd = pwd;
        this.plageId = plageId;
    }
}

class Users {
    constructor(){
        this.users = [
            new User("test@plage.com", "plage", "2"),
            new User("test1@plage.com", "plage")
        ]
        this.findByLogin = this.findByLogin.bind(this);
    }

    findByLogin(id, pwd){
        return this.users.find(u => u.id.toLowerCase() == id.toLowerCase() && u.pwd == pwd);
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