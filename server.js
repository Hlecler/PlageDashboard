require("dotenv").load();
const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const axios = require('axios')

import {User, users} from "./data/users";
import {sessions} from "./data/sessions";

const app = express();
const port = process.env.PORT || 5000;



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
  });

app.get("/user/:id", (req, res) => {
	const id = req.params.id;
	axios.get('https://plage.igpolytech.fr/API/user/' + id)
	.then(response => {
		if (response.status = 200) {
			res.writeHead(200, {"Content-Type": "application/json"});
			res.data = response.data;
			res.end(JSON.stringify(response.data));
		}
		else {
			res.writeHead(500);
			res.end();
		}

	})
	.catch(e => {
		if (e.status = 404) {
			res.writeHead(404, {"Content-Type": "text/plain"});
			res.data = "no user found.";
			res.end("Error : No user found.");
		}
		else {
			res.writeHead(500, {"Content-Type": "text/plain"});
			res.data = "An error occured.";
			res.end("Error : An error occured.");
		}
	});
});

app.get("/user/rendus/:id", (req, res) => {
	const id = req.params.id;
	axios.get('https://plage.igpolytech.fr/API/ExerciseProduction/student/' + id)
	.then(response => {
		res.writeHead(200, {"Content-Type": "application/json"});
		res.data = response.data;
		res.end(JSON.stringify(response.data));
	})
	.catch(e => {
		if (e.status = 404) {
			res.writeHead(404, {"Content-Type": "text/plain"});
			res.data = "no exercise found.";
			res.end("Error : No exercise found.");
		}
		else {
			res.writeHead(500, {"Content-Type": "text/plain"});
			res.data = "An error occured.";
			res.end("Error : An error occured.");
		}
	});
});

app.get("/exercises/rendus/:id", (req, res) => {
	const id = req.params.id;
	axios.get('https://plage.igpolytech.fr/API/ExerciseProduction/exercise/' + id)
	.then(response => {
		res.writeHead(200, {"Content-Type": "application/json"});
		res.data = response.data;
		res.end(JSON.stringify(response.data));
	})
	.catch(e => {
		if (e.status = 404) {
			res.writeHead(404, {"Content-Type": "text/plain"});
			res.data = "no users found.";
			res.end("Error : No users found.");
		}
		else {
			res.writeHead(500, {"Content-Type": "text/plain"});
			res.data = "An error occured.";
			res.end("Error : An error occured.");
		}
	});
});

app.post("/login", (req, res) => {
    const id = req.body.id;
	const pwd = req.body.pwd;
	
	const loggedUser = users.findByLogin(id, pwd)
    if(loggedUser){
        const token = sessions.connect(id);
        console.log(id + " just logged in with token " + token);
        const data = {"token": token, "userId": id, "plageId": loggedUser.plageId};

        res.writeHead(200, {"Content-Type": "application/json"});
        res.data = data;
        res.end(JSON.stringify(data));
    } else {
    	console.log("Error connection")
        res.writeHead(401, {"Content-Type": "application/json"});
        res.end();
    }
});

app.post("/logout", (req, res) => {
    const id = req.body.id;
    const token = req.body.token;
    sessions.disconnect(id, token);
    console.log(id + " logged out");
    res.writeHead(200);
    res.end();
});

app.listen(port);
console.log("Listening on port " + port);
