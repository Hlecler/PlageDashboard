require("dotenv").load();
const express = require("express");
const bodyParser = require("body-parser");
const axios = require('axios')

import {User, users} from "./data/users";
import {sessions} from "./data/sessions";

const app = express();
const port = process.env.PORT || 5000;

const plage = process.env.PLAGE_URL || "https://plage.igpolytech.fr"

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
  });

app.get("/", (req, res) => {
	res.writeHead(200, {"Content-Type": "text/plain"});
	res.data = "Bienvenue sur le back de PlageDashboard."
	res.end(res.data)
})
app.get("/user/:id", (req, res) => {
	const id = req.params.id;
	axios.get(plage + '/API/user/' + id)
	.then(response => {
		if (response.status = 200) {
			res.writeHead(200, {"Content-Type": "application/json"});
			res.data = response.data;
			res.end(JSON.stringify(response.data));
		}
		else {
			res.writeHead(500);
			res.end("An error occured in Plage.");
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
	axios.get(plage + '/API/ExerciseProduction/student/' + id)
	.then(response => {
		if (Array.isArray(response.data)){
			res.writeHead(200, {"Content-Type": "application/json"});
			res.data = response.data;
			res.end(JSON.stringify(response.data));
		}
		else {
			res.writeHead(500, {"Content-Type": "text/plain"});
			res.end("An error occured in Plage.");
		}
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
	axios.get(plage + '/API/ExerciseProduction/exercise/' + id)
	.then(response => {
		if (Array.isArray(response.data)){
			res.writeHead(200, {"Content-Type": "application/json"});
			res.data = response.data;
			res.end(JSON.stringify(response.data));
		}
		else {
			res.writeHead(500, {"Content-Type": "text/plain"});
			res.end("An error occured in Plage.");
		}
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

function getBarColor(mark) {
	var red = 0;
	var green = 0;
	if (mark <10){
	  red = 255;
	  green = mark * 25.5;
	}
	else{
	  green = 255;
	  red = 255 - (mark-10)*25.5;
	}
	return 'rgba(' + red + ',' + green + ',0,1)'
  }

app.get("/export/user/:id", (req, res) => {

	
	const data = {"layout": "", 
	"data": ""};
	
	data.layout = {yaxis : {'title': 'Score (%)'},
    xaxis : {'title': 'Exercices'},
    title:"Vos résultats d'exercices",
	datarevision: 0};

	const id = req.params.id;
	
	axios.get(plage + '/API/ExerciseProduction/student/' + id)
	.then(response => {
		if (Array.isArray(response.data)){
			 
			data.data = [
				{type: 'bar', x: [], y: [],
			   name : "Exercices",
			   marker : {'color' : []}
			   },
			  ];


			response.data.forEach(e => {
				var index = data.data[0].x.indexOf("Exercice " + e.ex_id);
				if (index === -1){
					data.data[0].x.push("Exercice " + e.ex_id);
					data.data[0].y.push(e.mark*5);
					data.data[0].marker['color'].push(getBarColor(e.mark))
				}
				else{
					data.data[0].y[index] = e.mark*5;
					data.data[0].marker['color'][index] = (getBarColor(e.mark))
				}
			  })

			res.writeHead(200, {"Content-Type": "application/json"});
			res.data = data;
			res.end(JSON.stringify(data));
		}
		else {
			res.writeHead(500, {"Content-Type": "text/plain"});
			res.end("An error occured in Plage.");
		}
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
})

app.get("/export/teacher/:id", (req, res) => {
	const data = {"layout": "", "data": ""};
	const id = req.params.id;

	data.layout = {
        title : "Scores des étudiants à l'exercice",
        datarevision: 0,
	  }
	  

	data.data = [{values: [0, 0, 0, 0],
	  labels: ['0-25%', '>25-50%', '>50-75%', '>75-100%'],
	  type: 'pie',
	  marker: {
		colors: ['rgb(230, 0, 0)', 'rgb(255, 120, 0)', 'rgb(230, 255, 0)', 'rgb(0, 220, 0)']}
	}]
	

	axios.get(plage + '/API/ExerciseProduction/exercise/' + id)
	.then(response => {
		if (Array.isArray(response.data)){
			var users = [];
			var usersScores = [];
			
			response.data.forEach(e => {
				var index = users.indexOf(e.user_id);
				if (index === -1){
					users.push(e.user_id);
					usersScores.push(e.mark);
				}
				else{
				  usersScores[index] = e.mark;
				}
			})
			users.forEach(user => {
				var userScore = usersScores.shift();
				switch (true) {
					case (userScore*5 <= 25):
						data.data[0].values[0] += 1;
						break;
					case (userScore*5 <= 50):
						data.data[0].values[1] +=1;
						break;
					case (userScore*5 <= 75):
						data.data[0].values[2] +=1;
						break;
					default :
						data.data[0].values[3] +=1;
						break;
				}
			})
			res.writeHead(200, {"Content-Type": "application/json"});
			res.data = data;
			res.end(JSON.stringify(data));
		}
		else {
			res.writeHead(500, {"Content-Type": "text/plain"});
			res.end("An error occured in Plage.");
		}
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
})

app.get("/logs", (req, res) => {
	axios.get(plage + '/api/LMSLogging/')
	.then(response => {
		res.writeHead(200, {"Content-Type": "application/json"});
		res.data = response.data;
		res.end(JSON.stringify(response.data));
	})
	.catch(e => {
		if (e.status = 404) {
			res.writeHead(404, {"Content-Type": "text/plain"});
			res.data = "no logs found.";
			res.end("Error : No logs found.");
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
