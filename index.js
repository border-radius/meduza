var express = require('express');
var mustache = require('mustache');
var request = require('./request');
var fs = require('fs');

var index = {};
require('./list')(function (_index) {
	index = _index;
});

var views = {
	index: fs.readFileSync('views/index.html', {
		encoding: 'utf8'
	}),
	article: fs.readFileSync('views/article.html', {
		encoding: 'utf8'
	})
};

var app = express();

app.get('/', function (req, res) {
	res.send(mustache.render(views.index, {
		index: index
	}));
});


(function (ctrl) {
	app.get('/:type/:year/:month/:day/:title', ctrl);
	app.get('/:type/:title', ctrl);
})(function (req, res) {

	if (req.params.type == 'news') {
		var url = [
			'https://meduza.io/api/v1',
			req.params.type,
			req.params.year,
			req.params.month,
			req.params.day,
			req.params.title
		];
	} else {
		var url = [
			'https://meduza.io/api/v1',
			req.params.type,
			req.params.title
		];
	}

	request({
		url: url.join('/'),
		gzip: true
	}, function (e, _res, body) {
		if (e) {
			console.log(e);
			return res.status(500).send('Что-то пошло не так');
		}

		body = JSON.parse(body);

		res.send(mustache.render(views.article, body.root));
	});
})

app.get('/image/attachments/images/:num1/:num2/:num3/:size/:name', function (req, res) {
	res.redirect([
		'https://meduza.io/image/attachments/images',
		req.params.num1,
		req.params.num2,
		req.params.num3,
		req.params.size,
		req.params.name
	].join('/'));
});

app.listen(8006);