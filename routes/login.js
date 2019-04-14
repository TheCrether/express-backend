let router = require("express").Router();
const jwt = require("../libs/jwt-module");
let options = {
	issuer: "Backend",
	algorithm: "RS256",
	expiresIn: "6h"
};

router.post("/login", (req, res) => {

});

router.post("/register", (req, res) => {
	let body = req.body;

});

module.exports = router;