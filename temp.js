const express = require('express'),
	path = require('path'),
	app = express(),
	fs = require('fs'),
	uuid = require('uuid'),
	conf = require('./conf.json'),
	compression = require('compression');

// all use things
app.use(compression());
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(
	bodyParser.urlencoded({
		extended: false
	})
);

// So that everything gets redirected to angular routes
app.use('/', express.static(path.join(__dirname, 'public/')));
app.use('/static', express.static(path.join(__dirname, 'static/')));
/*
const session = require('express-session');
const FileStore = require('session-file-store')(session);
app.use(
	session({
		genid: (req) => {
			console.log('Inside session middleware');
			console.log(req.sessionID);
			return uuid();
		},
		store: new FileStore(),
		secret: 'IlikeAPItrolllol xd', // TODO change when production
		resave: false,
		saveUninitialized: true
	})
);
*/
const cors = require('cors');
app.use(cors());

// mysql
const mysql = require('mysql');
const connection = mysql.createConnection({
	host: conf.sqlHost,
	user: conf.sqlUser,
	password: conf.sqlPW,
	database: conf.sqlDB
});
let connect = connection.connect(function(err) {
	if (err) {
		console.error('error connecting: ' + err.stack);
		return;
	}

	console.log(`connected as id ${connection.threadId} to ${connection.config.database}`);
});
let close = connection.destroy();

// github
const Octokit = require('@octokit/rest');
const octo = new Octokit();

let repos = [];
function reposPush() {
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
			}
		});
}
reposPush();
setInterval(reposPush, 43200000);

// API stuff
app.route('/api/github').get((req, res) => {
	res.status(200).send(repos);
});

app.get('/api/contact', (req, res) => {
	try {
		const contact = JSON.parse(fs.readFileSync(`${__dirname}/contact.json`));
	} catch (error) {
		console.error(error);
		res.status(500).send();
		return;
	}
	res.status(200).send(contact);
});

app.route('/api/contact').post((req, res, next) => {
	const body = req.body;
	if (body.name == undefined || body.email == undefined || body.message == undefined) {
		res.status(400).send();
	}
	let contact = fs.readFileSync(`${__dirname}/contact.json`);
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
	res.sendFile(path.join(__dirname, 'public/index.html'), () => {
		res.sendFile(path.join(__dirname, 'static/error.html'));
	});
});

app.listen(conf.port, () => {
	// tslint:disable-next-line:no-console
	console.log(`Listening on Port ${conf.port}`);
});

app.listen(443, () => {
	console.log(`Listening lul`);
});