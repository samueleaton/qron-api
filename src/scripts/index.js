'use strict';
const http = require('http');

const reqPath = {
	host: 'localhost',
	port: 6677,
	path: '/'
};

function emit() {
	const reqPathString = reqPath.host + ':' + reqPath.port + reqPath.path;
	http.get(reqPathString, res => {
		console.log('res:', res.statusCode);
	});
}

module.exports = {
	emit
};
