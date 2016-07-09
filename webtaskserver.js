var request = require('request')

module.exports = function (context, req, res) {

	var boot = "$examples/buttons.js";
	var title = boot.replace(/^\$|\.js$/g, '').replace(/\//, " - ");
	var pathset = '{"system":1,"resources":1,"3d":1,"behaviors":1,"server":1,"ui":1,"flow":1,"testing":1,"widgets":1,"sensors":1,"iot":1,"examples":1,"apps":1,"docs":1,"test":1}';
	var paths = '$disableserver:true, $root:"https://webtask.it.auth0.com/api/run/wt-freemason-gmail_com-0/webtaskserver", $code:"https://rawgit.com/dreemproject/dreemgl/webtask", $system:"$code/system", $resources:"$code/resources", $3d:"$code/classes/3d", $behaviors:"$code/classes/behaviors", $server:"$code/classes/server", $ui:"$code/classes/ui", $flow:"$code/classes/flow", $testing:"$code/classes/testing", $widgets:"$code/classes/widgets", $sensors:"$code/classes/sensors", $iot:"$code/classes/iot", $examples:"$code/examples", $apps:"$code/apps", $docs:"$code/docs", $test:"$code/test"';
	var preloadattrs = {};
	var additionalHeader = "";

	var page = '<html lang="en">\n'+
	' <head>\n'+
	'  <meta http-equiv="Content-Type" content="text/html; charset=utf-8">\n'+
	'  <meta name="viewport" content="width=device-width,user-scalable=no,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0">\n'+
	'  <meta name="apple-mobile-web-app-capable" content="yes">\n'+
	'  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">\n'+
	'  <meta name="format-detection" content="telephone=no">\n'+
	'  <title>' + title + '</title>\n'+
	'  <style>\n'+
	'    .unselectable{\n'+
	' 		-webkit-user-select: none;\n'+
	'		-moz-user-select: none;\n'+
	'		-user-select: none;\n'+
	'    }\n'+
	'    body {background-color:white;margin:0;padding:0;height:100%;overflow:hidden;}\n'+
	'  </style>'+
	'  <script type="text/javascript">\n'+
	'    window.define = {\n'+
	'	   $platform:"webgl",\n'+
	'      paths:'+pathset+',\n'+
	'     '+paths+',\n'+
	'      main:["$system/base/math", "' + boot + '"],\n'+
	'      atMain:function(require, modules){\n'+
	'        define.endLoader()\n'+
	'		 require(modules[0])\n'+
	'		 var Composition = require(modules[1])\n'+
	'		 var serverattrs = ' + JSON.stringify(preloadattrs) + '\n'+
	'		 var renderTarget;' + '\n'+
	'        define.rootComposition = new Composition(define.rootComposition, undefined, serverattrs, renderTarget)\n'+
	'      },\n'+
	'	   atEnd:function(){\n'+
	'         define.startLoader()\n'+
	'      }\n'+
	'    }\n'+
	'  </script>\n'+
	'  <script type="text/javascript" src="https://rawgit.com/dreemproject/dreemgl/webtask/system/base/define.js"></script>\n'+
	additionalHeader +
	' </head>\n'+
	' <body class="unselectable">\n'+
	' </body>\n'+
	'</html>\n'

	res.writeHead(200, { 'Content-Type': 'text/html '});
	res.end(page);

}
