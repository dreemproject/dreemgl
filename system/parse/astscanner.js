define.class("$system/parse/onejswalk", function(baseclass, require) {

	var jsformatter = require('$system/parse/jsformatter');

	this.toSource = function(ast) {
		if (!ast) {
			ast = this.at;
		}

		var buf = {
			out:'',
			charCodeAt: function(i){return this.out.charCodeAt(i)},
			char_count:0
		};

		jsformatter.walk(ast, buf, function(str){
			if (str) {
				buf.char_count += str.length;
				buf.out += str
			}
		});

		return buf.out;
	};

	this.atConstructor = function(rootnode, astpath) {
		this._root = rootnode;
		if (astpath && !Array.isArray(astpath)) {
			astpath = [astpath];
		}
		this._stages = astpath;
		this.reset();
		if (this._stages) {
			this.scan()
		}
	};

	this.reset = function() {
		this._unstage();
		this.atparent = undefined;
		this.atindex = undefined;
		this.atstate = undefined;
		this.at = this._root;
		return this;
	};

	this.scan = function() {
		while (this._prepare()) {
			this.walk(this.at);
		}
		return this;
	};

	this._unstage = function() {
		if (this._stage) {
			var type = this._stage.type;
			this._stage = undefined;
			if (type) {
				delete this[type];
			}
		}
	};

	this._match = function(stage, node, parent) {
		var match = !!(node);

		if (match) {
			for (var prop in stage) {
				if (stage.hasOwnProperty(prop) && prop[0] != '_') {
					var val = stage[prop];
					var nodeval = node[prop];
					if (typeof(val) === "object") {
						match = match && this._match(val, nodeval)
					} else {
						match = match && nodeval === val
					}
				}
				if (!match) {
					break;
				}
			}
		}

		return match;
	};

	this._prepare = function() {
		this._unstage();
		if (this._stages) {
			this._stage = this._stages.shift();
			if (this._stage) {
				this[this._stage.type] = function(node, parent, state, index) {
					var stageindex = this._stage._index;
					if ((stageindex >= 0 && stageindex !== index) || !this._match(this._stage, node, parent)) {
						baseclass[node.type].call(this, node, parent, state, index)
					} else {
						this.atparent = parent;
						this.atindex = index;
						this.atstate = state;
						this.at = node;
						this.scan();
					}

				}.bind(this);
			}
		}

		return !!(this._stage);
	};

	//for (var prop in this) {
	//	if (/^[A-Z]/.test(prop)) {
	//		console.log('pp', prop)
	//		this[prop] = function(node, parent, state) {
	//          console.log('Found', node.type)
	//			baseclass[node.type].call(this, node, parent, state)
	//		}.bind(this)
	//	}
	//}

});
