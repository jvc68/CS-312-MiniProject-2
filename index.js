//Necessary Set Up
import express from "express";
import bodyParser from "body-parser";
import axios from 'axios';

const app = express();

const port = 3000;

let joke = {
	setUp: "",
	delivery: "",

};

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

//Starts the app.
app.listen(port, () => {
	console.log(`Listening on port ${port}`);
});

//Homepage
app.get("/", (req, res) => {
	res.render("index.ejs", { joke });
});

// Sends the gathered form info to the API
app.post('/getUV', async (req, res) => {

	//Receives from bodyparser
	const { nsfw, religious, political, racist, sexist, explicit } = req.body;
	//Builds my flags for the endpoint
	let flags = [nsfw, religious, political, racist, sexist, explicit].filter(flag => flag != null).join(",");

	if (flags != "") {
		flags = "?blacklistFlags=" + flags
	}

	// Using Axios to request from the API.
	try {
		const response = await axios.get(`https://v2.jokeapi.dev/joke/Any${flags}`);
		joke.setUp = response.data.setup;
		joke.delivery = response.data.delivery;
		res.redirect("/");
	} catch (err) {
		joke.setUp = "ERROR:";
		joke.delivery = "Got an error somewhere";
		res.redirect("/");
	}
});


