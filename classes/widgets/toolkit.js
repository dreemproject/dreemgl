/* Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
 You may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
 either express or implied. See the License for the specific language governing permissions and limitations under the License.*/

define.class("$ui/splitcontainer", function(require,
								  $ui$, view, label, icon,
								  $widgets$, palette, propviewer){

	this.name = "toolkit";
	this.clearcolor = "#565656";
	this.bgcolor = "#565656";
	this.flexdirection = "column";

	this.attributes = {
		inspect:Config({type:Object}),

		components:Config({type:Object, value:{
			Views:[
				{
					label:"View",
					icon:"clone",
					desc:"A rectangular view",
					classname:"view",
					classdir:"$ui$",
					params:{
						height:60,
						width:60,
						bgcolor:'purple'
					}
				},
				{
					label:"Text",
					text:"Aa",
					desc:"A text label",
					classname:"label",
					classdir:"$ui$",
					params:{
						bgcolor:'transparent',
						fgcolor:'lightgreen',
						text:'Howdy!'
					}
				},
				{
					label:"Image",
					icon:"image",
					desc:"An image or icon",
					classname:"icon",
					classdir:"$ui$",
					params:{
						fgcolor:'cornflower',
						icon:'flask'
					}
				}
			]
		}})
	};

	this.ensureDeps = function() {
		var at = "";
		var arglist = [];
		var plist = {};
		var main = this.screen.composition.seekASTNode({type:"Function", index:0});
		console.log('AST', main);
		if (main && main.params) {
			for (var i=0;i<main.params.length;i++) {
				var param = main.params[i];
				if (param && param.id && param.id.name) {
					var name = param.id.name;
					if (name.startsWith('$') && name.endsWith('$')) {
						at = name;
					} else {
						if (!plist[at]) {
							plist[at] = [];
						}
						plist[at].push(name)
					}
					arglist.push(name);
				}
			}
		}

		if (this.components) {
			var missing = {};
			for (var key in this.components) {
				if (this.components.hasOwnProperty(key)) {
					var section = this.components[key];
					for (var s=0;s<section.length;s++) {
						var compdef = section[s];

						var classname = compdef.classname;
						var cdir = compdef.classdir || "$$";

						var included = plist[cdir];
						if (!included) {
							included = [];
						}

						if (included.indexOf(classname) < 0) {
							if (!missing[cdir]) {
								missing[cdir] = []
							}
							missing[cdir].push(classname)
						}
					}
				}
			}

			// TODO write missing values into the AST
			for (var dir in missing) {
				if (missing.hasOwnProperty(dir)) {
					var position = arglist.indexOf(dir);
					if (position < 0) {
						position = arglist.length;
						arglist.push(dir);
						main.params.push(this.buildDefNode(dir));
					}
					var missed = missing[dir];
					for (var m = 0; m < missed.length; m++) {
						var item = missed[m];
						arglist.splice(position + 1, 0, item);
						main.params.splice(position + 1, 0, this.buildDefNode(item))
					}
				}
			}
		}

		this.screen.globalpointerstart = function(ev) {
			var inspector = this.find('inspector');
			if (inspector.target != ev.view && this.testView(ev.view)) {
				inspector.target = ev.view
				console.log('AST', ev.view.getASTNode());
			}
		}.bind(this)
	};

	this.init = function () {
		this.ensureDeps();
	};

	this.buildIdNode = function(id) {
		return {
			type:"Id",
			name:id
		}
	};

	this.buildDefNode = function(name) {
		return {
			type: "Def",
			id:this.buildIdNode(name)
		}
	};

	this.buildValueNode = function(value, kind) {
		var valnode = {
			type: "Value",
			value: value,
			kind: kind
		};

		if (!valnode.kind) {
			if (typeof(value) === 'string') {
				valnode.kind = 'string';
			} else if (typeof(value) === 'number') {
				valnode.kind = 'num';
			} else if (value && value.length) {
				return this.buildCallNode("vec" + value.length, value)
			} else {
//				valnode.kind = typeof(value);
				console.log("??? what 'kind' is a ", typeof(value), value)
			}
		}

		if (typeof(value) === 'string') {
			valnode.raw = "'" + value + "'";
			valnode.multi = false;
		} else if (typeof(value) === 'number') {
			valnode.raw = value.toString();
		}

		return valnode;

	};

	this.buildKeyValueNode = function(name, value, kind) {
		var kv = {
			key: this.buildIdNode(name),
			value: this.buildValueNode(value)
		};

		if (kind) {
			kv.kind = kind;
		}

		return kv;
	};

	this.buildObjectNode = function(items, kind) {
		var keys = [];

		if (items) {
			for (var key in items) {
				if (items.hasOwnProperty(key)) {
					var value = items[key];
					keys.push(this.buildKeyValueNode(key, value, kind))
				}
			}
		}

		return {
			type: "Object",
			keys: keys
	    }
	};

	this.buildCallNode = function(name, items) {
		var args = [];

		if (items.length) {
			for(var a = 0; a < items.length;a++) {
				var value = items[a];
				args.push(this.buildValueNode(value))
			}
		} else {
			args.push(this.buildObjectNode(items))
		}

		return {
			type: "Call",
			fn: this.buildIdNode(name),
			args: args
		}
	};

	define.class(this, 'panel', view, function(){
		this.attributes = {
			title: Config({type:String, value:"Untitled"}),
			fontsize: Config({type:float, value:12, meta:"fontsize"})
		}

		this.padding = 0;
		this.margin = 4;
		this.borderradius =  vec4(10,10,1,1);
		this.bgcolor = vec4("red");
		this.flex = 1;
		this.flexdirection ="column";

		this.render = function(){
			return [
				view({bgcolor:"#585858",borderradius:0, bordercolor:"transparent" , borderwidth:0, margin:0, padding:vec4(0)},
					view({margin:vec4(1,1,2,0),bgcolor:"#4e4e4e", borderwidth:0,borderradius:vec4(10,10,1,.1),padding:vec4(10,2,10,2)},
						label({font: require('$resources/fonts/opensans_bold_ascii.glf'),margin:3, text:this.title, bgcolor:NaN, fontsize:this.fontsize, fgcolor: "white" })
					)
				),
				this.constructor_children
			];
		}
	});

	this.testView = function(v) {
		var ok = true;
		var p = v;
		while (p && ok) {
			ok = p !== this && p.tooltarget !== false;
			p = p.parent;
		}
		return ok;
	};

	this.render = function() {
		return [
			this.panel({alignitems:"stretch", aligncontent:"stretch", title:"Components", viewport:"2D", flex:1},
				palette({
					name:"components",
					flex:1,
					bgcolor:"#4e4e4e",
					items:this.components,
					dropTest:function(ev, v, item, orig, dv) {
						//var name = v && v.name ? v.name : "unknown";
						//console.log("test if", item.label, "from", orig.position, "can be dropped onto", name, "@", ev.position, dv);
						return this.testView(v);
					}.bind(this),
					drop:function(ev, v, item, orig, dv) {
						// var name = v && v.name ? v.name : "unknown";
						// console.log("dropped", item.label, "from", orig.position, "onto", name, "@", ev.position, dv);

						if (v) {
							var node = v.getASTNode();

							if (node) {

								node.args.push(this.buildCallNode(item.classname, item.params));

								//console.log('Dropped onto node:', node);

								this.screen.composition.commitAST();

							}
						}
					}.bind(this)
				})
			),
			this.panel({title:"Properties", viewport:"2D", flex:2.5, visible:!!(this.inspect)},
				propviewer({
					name:"inspector",
					target:this.inspect,
					flex:1,
					overflow:"scroll",
					callback:function(val, editor) {
						var t = editor.target;
						if (typeof(t) === 'string') {
							t = editor.find(t);
						}

						if (t && editor.propertyname) {
							//console.log('Set "', editor.propertyname, '" to "', val, '" (', typeof(val), ') on: ', t);
							t[editor.propertyname] = val;

							var ast = t.seekASTNode({type:"Object", index:0});

							var found;
							if (ast && ast.keys) {
								for (var i=0;i < ast.keys.length;i++) {
									var prop = ast.keys[i];
									if (prop && prop.key && prop.key.name && prop.key.name === editor.propertyname) {
										found = prop;
										break;
									}
								}
								if (!found) {
									found = this.buildKeyValueNode(editor.propertyname, val, "init");
									ast.keys.push(found);
								} else {
									found.value = this.buildValueNode(val);
								}
							} else {
								ast = t.getASTNode();
								if (ast) {
									var args = {};
									args[editor.propertyname] = value;
									var obj = this.buildObjectNode(args, 'init');
									ast.args.splice(0,0,obj);
								}
							}

							if (!this.__commit) {
								this.__commit = function() {
									console.log('save');
									this.screen.composition.commitAST();
									this.__commit = undefined;
								}.bind(this);
								setTimeout(this.__commit, 500);
							}

						}


					}.bind(this)
				})
			)
		];
	}
});
