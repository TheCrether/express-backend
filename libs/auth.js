const jwt = require("jsonwebtoken")
const fs = require("fs");
const path = require("path");

const privateKey = fs.readFileSync(path.join(process.cwd(), "private.key"));
const publicKey = fs.readFileSync(path.join(process.cwd(), "public.key"));

function verifyJWTToken(token) {
	return new Promise((resolve, reject) => {
		jwt.verify(token, privateKey, (err, decodedToken) => {
			if (err || !decodedToken) {
				return reject(err);
			}

			resolve(decodedToken);
		});
	});
}

function createJWToken(details) {
	if (typeof details !== 'object') {
		details = {};
	}

	details.sessionData = _.reduce(details.sessionData || {}, (memo, val, key) => {
		if (typeof val !== "function" && key !== "password") {
			memo[key] = val;
		}
		return memo;
	}, {});

	let token = jwt.sign({
		data: details.sessionData
	}, privateKey, {
		expiresIn: "2h",
		algorithm: 'HS256'
	});

	return token;
}

module.exports = {
	verifyJWTToken,
	createJWToken
};