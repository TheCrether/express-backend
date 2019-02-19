const express = require("express");
const app = express();
const port = 8000;

//all use things
const bodyParser = require("body-parser");
app.use(bodyParser.json());

const cors = require("cors");
app.use(cors());

//github sachen
const Octokit = require("@octokit/rest");
const octo = new Octokit();
const {
    Repo
} = require("./repo");

const repos = [];
octo.repos.listForUser({
    username: "thecrether"
}).then((data => {
    for (let repo of data.data) {
        const repoItem = new Repo(repo.name, repo.html_url, repo.description, repo.homepage);
        repos.push(repoItem);
    }
}));
/*
//mysql
const mysql = require("mysql");
const con = mysql.createConnection({
    host: "localhost",
    "user": "root",
    "password": "",
});

con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
});
*/
//API stuff
app.get("/api/structograms", function (req, res) {

});

app.route("/api/github").get((req, res) => {
    res.send(repos);
});

app.route("/api/cats").get((req, res) => {
    res.send([{
        name: 'lilly'
    }, {
        name: 'lucy'
    }]);
});

app.route('/api/cats').post((req, res) => {
    res.send(201, req.body);
});

app.route('/api/cats/:name').get((req, res) => {
    const requestedCatName = req.params['name']
});

app.route('/api/cats/:name').put((req, res) => {
    res.send(200, req.body);
});

app.route('/api/cats/:name').delete((req, res) => {
    res.sendStatus(204);
});


app.listen(port, () => console.log(`Listening on Port ${port}`));