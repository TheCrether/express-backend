const express = require("express");
const app = express();
const dotenv = require("dotenv");

dotenv.config();

const port = process.env.PORT;

// all use things
const bodyParser = require("body-parser");
app.use(bodyParser.json());

const cors = require("cors");
app.use(cors());

// github sachen
const Octokit = require("@octokit/rest");
const octo = new Octokit();
const {
	Project
} = require('./project');

// mysql
const mysql = require("mysql");
const connection = mysql.createConnection({
	host: process.env.sqlHOST,
	user: process.env.sqlUSER,
	password: process.env.sqlPW,
	database: process.env.sqlDB
});

connection.connect(function (err) {
	if (err) {
		console.error('error connecting: ' + err.stack);
		return;
	}

	console.log(`connected as id ${connection.threadId} to ${connection.config.database}`);
});

// repos push
octo.repos.listForUser({
		username: 'thecrether'
	})
	.then((data) => {
		connection.query("DELETE FROM github", (err, res) => {
			if (err) throw err;
			console.log("Deleting everything in Github table");
		});
		for (const repo of data.data) {
			const repoItem = new Project(
				repo.name,
				repo.html_url,
				repo.description,
				repo.homepage);
			let check = null;
			sql = `INSERT INTO github (name, gitlink, description, url) VALUES (` +
				`'${repoItem.name}', '${repoItem.gitlink}', ` +
				`'${repoItem.description==null ? "" : repoItem.description}', '${repoItem.url==null ? "" : repoItem.url}');`;
			connection.query(sql, function (err, result) {
				if (err) throw err;

				console.log(`pushed ${repo.name} to db`);
			});
		}
	});

// API stuff
app.route('/api/github').get((req, res) => {
	connection.query("SELECT * FROM github", function (err, results, fields) {
		res.status(200).send(results);
	});
});

// TODO implement everything here
app.route("/api/contact").post((req, res) => {

});

app.route("/api/users/:username").get((req, res) => {

});

app.route("/api/users/:username").put((req, res) => {

});

app.route("/api/users/:username").delete((req, res) => {

});

app.route('/api/users/:username/structograms').get((req, res) => {

});

app.route("/api/users/:username/structograms").post((req, res) => {

});

app.route("/api/users/:username/structograms").delete((req, res) => {

});

/* app.route('/api/cats').get((req, res) => {
	res.send([
		{
			name: 'lilly'
		},
		{
			name: 'lucy'
		}
	]);
});

app.route('/api/cats').post((req, res) => {
	res.send(req.body);
});

app.route('/api/cats/:name').get((req, res) => {
	const requestedCatName = req.params.name;
});

app.route('/api/cats/:name').put((req, res) => {
	res.send(req.body);
});

app.route('/api/cats/:name').delete((req, res) => {
	res.sendStatus(204);
}); */

app.listen(port, () => {
	// tslint:disable-next-line:no-console
	console.log(`Listening on Port ${port}`);
});