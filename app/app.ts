import express = require('express');
import path = require('path');
import fs = require('fs');
import uuid = require('uuid');
import compression = require('compression');
import bodyParser = require('body-parser');
import cors = require('cors');
import mysql = require('mysql');
import Octokit = require('@octokit/rest');
// import conf = require('./conf.json');
// import express = require('express');
const conf = JSON.parse(fs.readFileSync(`./conf.json`, 'utf-8'));

const app: express.Application = express();

app.use(bodyParser.json());
app.use(
	bodyParser.urlencoded({
		extended: false
	})
);
app.use(compression());

app.use('/', express.static(path.join('public/')));
app.use('/static', express.static(path.join('static/')));

app.use(cors());

const connection = mysql.createConnection({
	host: conf.sqlHost,
	user: conf.sqlUser,
	password: conf.sqlPW,
	database: conf.sqlDB
});

function connect(): void {
	connection.connect((err) => {
		if (err) {
			console.error(err);
			return;
		}
		console.log(`connected with ${connection.threadId}`);
	});
}
function destroy(): void {
	connection.destroy();
}

const octo = new Octokit();
let repos: object[] = [];
function reposPush(): void {
	octo.repos
		.listForUser({
			username: 'thecrether'
		})
		.then((data) => {
			repos = [];
			for (const repo of data.data) {
				repos.push({
					name: repo.name,
					gitlink: repo.html_url,
					description: repo.description,
					url: repo.homepage
				});
				fs.writeFileSync(`${__dirname}/repos.json`, JSON.stringify(repos), 'utf-8');
			}
		});
}
reposPush();
setInterval(reposPush, 43200000);
// API stuff
app.route('/api/github').get((req, res) => {
	res.status(200).send(JSON.stringify(repos));
});

app.route('/api/contact').post((req, res, next) => {
	const body = req.body;
	if (body.name == undefined || body.email == undefined || body.message == undefined) {
		res.status(400).send();
	}
	let contact: any = fs.readFileSync(`${__dirname}/contact.json`, 'utf-8');
	contact = JSON.parse(contact);
	contact.push(body);
	fs.writeFileSync(`${__dirname}/contact.json`, JSON.stringify(contact), 'utf8');
	res.status(204).send();
});
//delete lol.xd2;

// TODO when auth ready
/* 
app.route('/api/users/:username').get((req, res) => {});
app.route("/api/users/:username").post((req, res) => {});
app.route('/api/users/:username').put((req, res) => {});
app.route('/api/users/:username').delete((req, res) => {});
*/

// TODO implement everything here
app.route('/api/structograms').post((req, res) => {
	const body = req.body;
	if (body.name == undefined || body.content == undefined) {
		res.status(400).send();
		return;
	}
	connect();
	connection.query(
		`INSERT INTO structograms (name, content) VALUES('${body.name}', '${body.content}')`,
		(err, result) => {
			if (err) {
				console.error(err);
				res.status(500).send();
				close();
				return;
			}
			console.log(`pushed structogram at id ${result.insertId}`);
			res.status(200).send({
				id: result.insertId
			});
		}
	);
	close();
});

app.route('/api/structograms/:id').get((req, res) => {
	const params = req.params;
	connection.query(`SELECT * FROM structograms WHERE ID = ${params.id}`, (err, result) => {
		if (err) {
			console.error(err);
			res.status(500).send();
			close();
			return;
		}
		if (result.length == 0) {
			res.status(404).send();
			close();
			return;
		}
		res.status(200).send(result[0]);
	});
	close();
});

app.get('*', (req, res) => {
	res.sendFile('public/index.html');
});

app.listen(conf.port, () => {
	console.log('Custom Port listening: ' + conf.port);
});

app.listen(443, () => {
	console.log('HTTPS listening');
});
