'use strict';
const http = require('http');
const EventEmitter = require('events').EventEmitter;

const reqPath = {
	host: 'localhost',
	port: 6677,
	path: '/'
};

function isMessageObjectValid(obj) {
	if (!obj.event || typeof obj.event !== 'string') {
		return false;
	}
	if (!obj.message || typeof obj.message !== 'string') {
		return false;
	}
	return true;
}

function createTransaction() {
	const Transaction = new EventEmitter();
	Transaction.success = function(cb) {
		this.on('success', cb);
		return this;
	}
	Transaction.error = function(cb) {
		this.on('error', cb);
		return this;
	}
	Transaction.send = function() {
		const messageObject = {
			event: this.event,
			message: this.message
		};
		if (!isMessageObjectValid(messageObject)) {
			return this.emit('error', 'Message Object Not Valid.');
		}
		const sender = 'qron';
		const transPath = '/' + sender + '/' + this.event + '/' + this.message;
		const reqPathString = 'http://' + reqPath.host + ':' + reqPath.port + transPath;
		http.get(reqPathString, res => {
			if (res.statusCode >= 200 && res.statusCode < 400)
				this.emit('success');
			if (res.statusCode >= 400 && res.statusCode < 600)
				this.emit('error');
		});
		return this;
	}
	return Transaction;
}

function createMessage(obj) {

	const Transaction = createTransaction();

	if (isMessageObjectValid(obj)) {
		Transaction.event = obj.event;
		Transaction.message = obj.message;
	}
	
	return Object.create(Transaction);
}

module.exports = {
	createMessage
};
