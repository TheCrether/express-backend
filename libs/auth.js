import jwt from 'jsonwebtoken';
import {
	readFileSync
} from "fs";
import {
	join
} from "path";

const privateKey = readFileSync(join(process.cwd(), "private.key"));
const publicKey = readFileSync(join(process.cwd(), "public.key"));

export function verifyJWTToken(token) {
	return new Promise((resolve, reject) => {
		jwt.verify(token, privateKey, (err, decodedToken) => {
			if (err || !decodedToken) {
				return reject(err);
			}

			resolve(decodedToken);
		});
	});
}

export function createJWToken(details) {
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