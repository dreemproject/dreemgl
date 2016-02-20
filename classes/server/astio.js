/* Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
 You may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
 either express or implied. See the License for the specific language governing permissions and limitations under the License.*/

define.class("$system/base/node", function(require, baseclass, $system$parse$, onejsparser, jsformatter, astscanner, onejsgen){
	// internal, api for manipulating Dreem AST

	this.attributes = {
		change: Config({type:Event}),
		undostack:Config({value:[], persist:true}),
	    redostack:Config({value:[], persist:true})
    };

	this.atConstructor = function(source) {
		this.build = new onejsgen();
		if (source) {
			this.parse(source)
		}
		this.last_source = this.stringify()
	};

	this.fork = function(callback) {
		this.undostack.push(JSON.stringify(this.ast));
		this.redostack.length = 0;
		this.reset();
		callback(this);
		var last = this.last_source = this.stringify();
		this.emit('change', {value:last})
	};

	this.undo = function() {
		if(!this.undostack.length) return;
		this.redostack.push(JSON.stringify(this.ast));
		this.ast = JSON.parse(this.undostack.pop());
		var last = this.last_source = this.stringify();
		this.emit('change', {value:last})
	};

	this.redo = function() {
		if(!this.redostack.length) return;
		this.undostack.push(JSON.stringify(this.ast));
		this.ast = JSON.parse(this.redostack.pop());
		var last = this.last_source = this.stringify();
		this.emit('change', {value:last});
	};

	this.nodeFor = function(o) {

		if (!o.__ast) {
			var past;
			if (o.parent && o.parent !== o) {
				past = this.nodeFor(o.parent);
			} else {
				past = this.ast;
			}

			if (o.constructor.module.factory.baseclass === "/server/composition") {
				var key = this.build.Function();
				o.__ast = new astscanner(past, key).at;
			} else if (typeof(o.__constructorIndex) !== "undefined") {
				o.__ast = past.args[o.__constructorIndex];
			} else {
				var key = this.build.Call(this.build.Id(o.constructor.name));
				o.__ast = new astscanner(past, key).at;
			}
		}

		return o.__ast;
	};

	this.nodePathFor = function(v) {
		var ast = this.nodeFor(v);

		var parentpath;
		var index = -1;
		if (v.parent) {
			parentpath = this.nodePathFor(v.parent);
			var parent = this.nodeFor(v.parent);
			index = parent.args.indexOf(ast);
		} else {
			parentpath = [];
		}

		var path = this.build[ast.type](this.build.Id(ast.fn.name));
		path._index = index;

		parentpath.push(path);

		return parentpath;
	};

	// ===== AST Object Manipulation Helpters

	// TODO(mason) refactor this stuff, unduplicate

	this.createASTNode = function(v, raw) {
		if (!this.__parser) {
			this.__parser = new onejsparser();
		}
		var string = raw ? v : JSON.stringify(v);

		// Need to remove the "key" quotes or else will create wrong type of key objects
		string = string.replace(/"([a-zA-Z0-9_$]+)":/g, "$1:");

		// Replace the vecs with better values
		string = string.replace(/\{____struct:"(vec\d)",data:\[([\d.,]+)\]\}/g, "$1($2)");

		var ast = this.__parser.parse(string);
		return ast.steps[0];
	};

	this.getCallNodeValue = function(callnode, key) {
		var scanner = new astscanner(callnode, [this.build.Object(), this.build.Id(key)]);

		var item = scanner.atparent.keys[scanner.atindex];

		if (item.value) {
			return item.value.value
		}
	};

	this.deleteCallNodeKey = function(callnode, key) {
		var scanner = new astscanner(callnode, [this.build.Object(), this.build.Id(key)]);
		if (scanner.atindex >= 0) {
			scanner.atparent.keys.splice(scanner.atindex, 1);
		}
	};

	this.setCallNodeValue = function(callnode, key, value) {

		var scanner = new astscanner(callnode, [this.build.Object(), this.build.Id(key)]);

		var at = scanner.at;

		var item, newval, args, newparams;

		if (at.type === "Id") {
			// Found an Id

			item = scanner.atparent.keys[scanner.atindex];

			if (typeof(value) === "function") {
				newval = this.createASTNode(value.toString(), true)
			//} else if (typeof(value) === 'string' || typeof(value) === 'number' || typeof(value) === 'boolean') {
			//	newval = this.build.Value(value);
			} else {
				newval = this.createASTNode(value)
			}

			item.value = newval;

		} else if (at.type === "Object") {
			// No Id, but found an Object

			args = {};
			if (typeof(value) === "function") {
				args[name] = "REPLACE";
				newparams = this.createASTNode(args);
				item = newparams.keys[0];

				newval = this.createASTNode(value.toString(), true);
				item.value = newval
			//} else if (typeof(value) === 'string' || typeof(value) === 'number' || typeof(value) === 'boolean') {
			//	item = { key:this.build.Id(key), value:this.build.Value(value) }
			} else {
				item = { key:this.build.Id(key), value:this.createASTNode(value) }
			}

			if (item) {
				at.keys.push(item);
			}

		} else {
			// No Object either, create new one from scrach

			args = {};
			if (typeof(value) === "function") {
				args[name] = "REPLACE";
				newparams = this.createASTNode(args);
				item = newparams.keys[0];
				newval = this.createASTNode(value.toString(), true);
				item.value = newval
			} else {
				args[name] = value;
				newparams = this.createASTNode(args);
			}

			if (newparams) {
				at.args.push(newparams);
			}
		}
	};

	// ===== scanner calls =====

	this.reset = function () {
		if (!this.__scanner) {
			this.__scanner = new astscanner(this.ast)
		}
		this.__scanner.reset()
	};

	this.nodeForPath = function(path) {
		this.__scanner.scan(path);
		return this.__scanner.at;
	};

	this.seekNodeFor = function(v) {
		var path = this.nodePathFor(v);
		this.__scanner.scan(path)
	};

	this.removeArgNode = function(node) {
		var index = this.__scanner.at.args.indexOf(node);
		if (index >= 0) {
			this.__scanner.at.args.splice(index, 1);
			return true;
		}
	};

	this.pushArg = function(arg) {
		var at = this.__scanner.at;

		if (!at.args) {
			at.args = []
		}
		at.args.push(arg);
	};

	this.setArgValue = function(key, value) {

		//check that its a thing with args

		this.__scanner.scan([this.build.Object(), this.build.Id(key)])

		var at = this.__scanner.at;

		//console.log("SET AST VALUE ON", at, key, "=", value, ":", this.__scanner);

		var item, newval, args, newparams;

		if (at.type === "Id") {
			// Found an Id

			item = this.__scanner.atparent.keys[this.__scanner.atindex];

			if (typeof(value) === "function") {
				newval = this.createASTNode(value.toString(), true)
			} else if (typeof(value) === 'string' || typeof(value) === 'number' || typeof(value) === 'boolean') {
				newval = this.build.Value(value);
			} else {
				newval = this.createASTNode(value)
			}

			item.value = newval;

		} else if (at.type === "Object") {
			// No Id, but found an Object

			args = {};
			if (typeof(value) === "function") {
				args[name] = "REPLACE";
				newparams = this.createASTNode(args);
				item = newparams.keys[0];

				newval = this.createASTNode(value.toString(), true);
				item.value = newval
			} else if (typeof(value) === 'string' || typeof(value) === 'number' || typeof(value) === 'boolean') {
				item = { key:this.build.Id(key), value:this.build.Value(value) }
			} else {
				item = { key:this.build.Id(key), value:this.createASTNode(value) }
			}

			if (item) {
				at.keys.push(item);
			}

		} else {
			// No Object either, create new one from scrach

			args = {};
			if (typeof(value) === "function") {
				args[name] = "REPLACE";
				newparams = this.createASTNode(args);
				item = newparams.keys[0];
				newval = this.createASTNode(value.toString(), true);
				item.value = newval
			} else {
				args[name] = value;
				newparams = this.createASTNode(args);
			}

			if (newparams) {
				at.args.push(newparams);
			}
		}

	};

	// convert a string in to a meaningful javascript object for this dataset. The default is JSON, but you could use this function to accept any format of choice.
	this.parse = function(classconstr) {
		var source;
		if (typeof(classconstr) === "string") {
			source = classconstr
		} else {
			source = classconstr.module.factory.body.toString()
		}

		this.ast = onejsparser.parse(source);
		this.__scanner = new astscanner(this.ast);
	};

	// convert an object in to a string. Defaults to standard JSON, but you could overload this function to provide a more efficient fileformat. Do not forget to convert the JSONParse function as well.
	this.stringify = function() {
		var buf = {
			out:'',
			charCodeAt: function(i){return this.out.charCodeAt(i)},
			char_count:0
		};
		jsformatter.walk(this.ast, buf, function(str){
			buf.char_count += str.length;
			buf.out += str
		});
		return buf.out
	}
});
