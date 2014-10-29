var request = require('./request');
var _ = require('lodash');

var next = new Function;

function updateIndex () {
	request({
		url: 'https://meduza.io/api/v1/index',
		gzip: true
	}, function (e, res, body) {
		if (e) return console.log(e);

		var index = _.sortBy(_.map(JSON.parse(body).documents, function (document) {
			return document;
		}), function (document) {
			return document.published_at * -1;
		});

		next(index);
	});
};

module.exports = function (_next) {
	next = _next;
};

updateIndex();

setInterval(updateIndex, 30000);