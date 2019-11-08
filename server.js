const express = require('express'),
	path = require('path'),
	app = express(),
	fs = require('fs'),
	conf = require('./conf.json'),
	compression = require('compression'),
	api = require('./routes/api'),
	login = require('./routes/login');

// const middlewares = require('./middlewares');

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
app.use('/api', api, login);
// app.use(middlewares.logging);

const cors = require('cors');
app.use(cors());

// github
const Octokit = require('@octokit/rest');
const octo = new Octokit();

function reposPush() {
	octo.repos
		.listForUser({
			username: 'thecrether'
		})
		.then((data) => {
			let repos = [];
			for (const repo of data.data) {
				repos.push({
					name: repo.name,
					gitlink: repo.html_url,
					description: repo.description,
					url: repo.homepage
				});
			}
			fs.writeFileSync(path.join(__dirname, 'repos.json'), JSON.stringify(repos), 'utf-8');
		});
}
reposPush();
setInterval(reposPush, 43200000);

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
	console.log(`Listening on Port 443 (HTTPS)`);
});