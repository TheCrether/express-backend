const express = require('express'),
	path = require('path'),
	app = express(),
	fs = require('fs'),
	conf = require('./conf.json'),
	compression = require('compression'),
	api = require('./routes/api'),
	login = require('./routes/login');
const http = require('http');
const https = require('https');

const privateKey = fs.readFileSync('/etc/letsencrypt/live/thecrether.at/privkey.pem', 'utf8');
const certificate = fs.readFileSync('/etc/letsencrypt/live/thecrether.at/cert.pem', 'utf8');
const ca = fs.readFileSync('/etc/letsencrypt/live/thecrether.at/chain.pem', 'utf8');

const credentials = {
		key: privateKey,
		cert: certificate,
		ca: ca
};

// const middlewares = require('./middlewares');

app.use('/', function(req, res, next){
	if (!req.secure) {
		console.log("not secure")
		res.redirect('https://' + req.headers.host + req.url);
	}
	else next()

	    // Or, if you don't want to automatically detect the domain name from the request header, you can hard code it:
	//     // res.redirect('https://example.com' + req.url);
})

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
const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);

httpServer.listen(80, () => {
		console.log('HTTP Server running on port 80');
})
httpsServer.listen(443, () => {
		console.log('HTTPS Server running on port 443');
});

//app.listen(conf.port, () => {
//	// tslint:disable-next-line:no-console
//	console.log(`Listening on Port ${conf.port}`);
//});

//app.listen(443, () => {
//	console.log(`Listening on Port 443 (HTTPS)`);
//});
