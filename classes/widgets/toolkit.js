/* Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
 You may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
 either express or implied. See the License for the specific language governing permissions and limitations under the License.*/

define.class("$ui/splitcontainer", function(require,
								  $ui$, view, label, icon,
								  $widgets$, palette, propviewer){

// The DreemGL Visual Toolkit allows for visual manipulation of a running compostion

	this.name = "toolkit";
	this.clearcolor = "#565656";
	this.bgcolor = "#565656";
	this.flexdirection = "column";

	this.attributes = {

		// The target for the property inspector
		inspect:Config({type:Object}),

		// Components available to be dragged into compositions.
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
		}}),

		// When in 'design' mode buttons in compositions no longer become clickable, text fields become immutable,
		// and views can be resized and manipulated.
		// In 'live' mode views lock into place the composition regains it's active behaviors
		mode:Config({type:Enum('design','live'), value:'design'}),

		// internal
		selection:[],

		// internal
		above:Config({type:Object})
	};

	this.addToSelection = function(obj){
		var f = this.selection.indexOf(obj)
		if (f == -1) this.selection.push(obj)
		else return

		if (this.selection.length > 1) return false;
		return true;
	};

	this.removeFromSelection = function(obj){
		var f = this.selection.indexOf(obj)
		if(f>-1) this.selection.splice(f,1)
	};

	this.ensureDeps = function() {
		var at = "";
		var arglist = [];
		var plist = {};
		var main = this.screen.composition.seekASTNode({type:"Function", index:0});
		//console.log('AST', main);
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
	};

	this.edgeCursor = function (ev) {
		var resize = false;
		if (this.testView(ev.view)) {
			this.above = ev.view;

			var pos = ev.view.globalToLocal(ev.pointer.position);
			var edge = 5;

			ev.view.cursor = 'arrow';

			if (pos.x < edge && pos.y < edge) {
				resize = "top-left";
				ev.view.cursor = 'nwse-resize'

			} else if (pos.x > ev.view.width - edge && pos.y < edge) {
				resize = "top-right";
				ev.view.cursor = 'nesw-resize'

			} else if (pos.x < edge && pos.y > ev.view.height - edge) {
				resize = "bottom-left";
				ev.view.cursor = 'nesw-resize'

			} else if (pos.x > ev.view.width - edge && pos.y > ev.view.height - edge) {
				resize = "bottom-right";
				ev.view.cursor = 'nwse-resize'

			} else if (pos.x < edge) {
				resize = "left";
				ev.view.cursor = 'ew-resize'

			} else if (pos.y < edge) {
				resize = "top";
				ev.view.cursor = 'ns-resize'

			} else if (pos.x > ev.view.width - edge) {
				resize = "right";
				ev.view.cursor = 'ew-resize'

			} else if (pos.y > ev.view.height - edge) {
				resize = "bottom";
				ev.view.cursor = 'ns-resize'
			}

			if (!resize) {
				ev.view.cursor = 'arrow';
			}

		} else if (ev.view.tooltarget === false) {
			ev.view.cursor = 'not-allowed';
		}

		return resize;
	};

	this.init = function () {
		this.ensureDeps();

		this.screen.globalpointerstart = function(ev) {
			var inspector = this.find('inspector');
			if (inspector.target != ev.view && this.testView(ev.view)) {
				inspector.target = ev.view;
				console.log('AST', ev.view.getASTNode());
			}

			this.__startpos = ev.view.globalToLocal(ev.pointer.position);

			this.__originalsize = {
				w:ev.view.width,
				h:ev.view.height
			};

			this.__resizecorner = this.edgeCursor(ev);
			ev.view.cursor = "move"

		}.bind(this);

		this.screen.globalpointermove = function(ev) {

			if (this.__resizecorner) {
				if (this.__resizecorner === "bottom-right") {
					ev.view.width = this.__originalsize.w + ev.pointer.delta.x;
					ev.view.height = this.__originalsize.h + ev.pointer.delta.y;
				} else if (this.__resizecorner === "bottom") {
					ev.view.height = this.__originalsize.h + ev.pointer.delta.y;
				} else if (this.__resizecorner === "right") {
					ev.view.width = this.__originalsize.w + ev.pointer.delta.x;
				} else if (this.__resizecorner === "top-left") {
					ev.view.y = ev.pointer.position.y - this.__startpos.y;
					ev.view.height = this.__originalsize.h - ev.pointer.delta.y;
					ev.view.x = ev.pointer.position.x - this.__startpos.x;
					ev.view.width = this.__originalsize.w - ev.pointer.delta.x;
				} else if (this.__resizecorner === "top") {
					ev.view.y = ev.pointer.position.y - this.__startpos.y;
					ev.view.height = this.__originalsize.h - ev.pointer.delta.y;
				} else if (this.__resizecorner === "left") {
					ev.view.x = ev.pointer.position.x - this.__startpos.x;
					ev.view.width = this.__originalsize.w - ev.pointer.delta.x;
				}

			} else if (this.testView(ev.view)) {
				if (ev.view.position != "absolute") {
					ev.view.position = "absolute";
				}
				ev.view.x = ev.pointer.position.x - this.__startpos.x;
				ev.view.y = ev.pointer.position.y - this.__startpos.y;
			}

		}.bind(this);

		this.screen.globalpointerend = function(ev) {
			if (this.__resizecorner) {

			} else {
				ev.view.x = ev.pointer.position.x - this.__startpos.x;
				ev.view.y = ev.pointer.position.y - this.__startpos.y;
				ev.view.cursor = 'arrow';
			}

			//TODO write changes to AST, otherwise it won't save them

			this.__startpos = this.__resizecorner = this.__originalsize = undefined;
		}.bind(this);


		this.screen.globalpointerhover = function(ev) {
			this.edgeCursor(ev)
		}.bind(this);

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
			} else if (typeof(value) === 'boolean') {
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
		} else if (value.toString) {
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
								var params = JSON.parse(JSON.stringify(item.params));
								params.position = 'absolute';
								params.x = ev.position.x
								params.y = ev.position.y

								node.args.push(this.buildCallNode(item.classname, params));

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

							// this saves it back, but don't do this until the property editor can handle
							// the reload without resetting itself
							//		this.screen.composition.commitAST();

						}


					}.bind(this)
				})
			)
		];
	}
});
