define.class(function(require, $server$, service){

	this.load = function(url) {
		var fs = require('fs')
		return JSON.parse(fs.readFileSync(define.expandVariables(define.classPath(this) + url), 'utf8'))
	}

})
