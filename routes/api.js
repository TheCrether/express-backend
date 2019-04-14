let router = require("express").Router();
const fs = require("fs"),
	path = require("path"),
	conf = require(path.join(process.cwd(), "conf.json"));

//mysql
const mysql = require('mysql');
const connection = mysql.createConnection({
	host: conf.sqlHost,
	user: conf.sqlUser,
	password: conf.sqlPW,
	database: conf.sqlDB
});
let connect = connection.connect(function (err) {
	if (err) {
		console.error('error connecting: ' + err.stack);
		return;
	}

	console.log(`connected as id ${connection.threadId} to ${connection.config.database}`);
});
let close = connection.destroy();

router.get("/github", (req, res) => {
	let repos = fs.readFileSync(path.join(process.cwd(), "repos.json"))
	res.status(200).send(JSON.parse(repos));
});

router.get("/contact", (req, res) => {
	try {
		const contact = fs.readFileSync(`${process.cwd()}/contact.json`);
		res.status(200).send(JSON.parse(contact));
	} catch (error) {
		console.error(error);
		res.status(500).send();
		return;
	}
});

router.route('/contact').post((req, res, next) => {
	const body = req.body;
	if (body.name == undefined || body.email == undefined || body.message == undefined) {
		res.status(400).send();
	}
	let contact = fs.readFileSync(`${process.cwd()}/contact.json`);
	contact = JSON.parse(contact);
	contact.push(body);
	fs.writeFileSync(`${process.cwd()}/contact.json`, JSON.stringify(contact), 'utf8');
	res.status(204).send();
});

router.route('/structograms').post((req, res) => {
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

router.route('/structograms/:id').get((req, res) => {
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

// TODO when auth ready
/*
app.route('/api/users/:username').get((req, res) => {});

app.route("/api/users/:username").post((req, res) => {});

app.route('/api/users/:username').put((req, res) => {});

app.route('/api/users/:username').delete((req, res) => {});
*/

module.exports = router;