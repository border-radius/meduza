module.exports = (function (request) {
	return function (opts, next) {
		request(opts, function (e, res, body) {
			if (!e && res.statusCode !== 200) {
				e = new Error ('Error ' + res.statusCode);
				e.res = res;
			}

			next(e, res, body);
		})
	};
})(require('request'));