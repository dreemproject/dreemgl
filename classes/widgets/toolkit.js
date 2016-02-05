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
		inspect:Config({type:Object})
	};

	this.init = function () {
		var at = "";
		var plist = {};
		var main = this.screen.composition.seekASTNode({type:"Function"});
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
				}
			}
		}
		// TODO: check that above plist has all the classes that we intend to use in this composition,
		// if not, write missing values into the AST

		this.screen.globalpointerstart = function(ev) {
			var inspector = this.find('inspector');
			if (inspector.target != ev.view && this.testView(ev.view)) {
				inspector.target = ev.view
			}
		}.bind(this)
	};

	this.buildValueNode = function(name, value) {
		var valnode = { type: "Value", value: value };

		if (typeof(value) === 'string') {
			valnode.kind = 'string';
			valnode.raw = "'" + value + "'";
			valnode.multi = false;
		} else if (typeof(value) === 'number') {
			valnode.kind = 'num';
			valnode.raw = value.toString();

		} else {
			console.log("what is a ", typeof(value))
		}

		return {
			key: { type: "Id", name: name },
			value: valnode
		};
	};

	this.buildObjectNode = function(item) {
		var keys = [];
		for (var key in item.params) {
			if (item.params.hasOwnProperty(key)) {
				var value = item.params[key];
				keys.push(this.buildValueNode(key, value))
			}
		}

		return {
			type: "Object",
			keys: keys
	    }
	};

	this.buildCallNode = function(item) {
		return {
			type: "Call",
			fn: { type:"Id", name:item.classname },
			args: [
				this.buildObjectNode(item)
			]
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
				)
				,this.constructor_children
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
					items:{
						Views:[
							{label:"View",  icon:"clone", desc:"A rectangular view",
								classname:"view",
								params:{
									height:150,
									width:150,
									bgcolor:'purple'
								}
							},
							{label:"Text",  text:"Aa",    desc:"A text label",
								classname:"label",
								params:{
									bgcolor:'transparent',
									fgcolor:'lightgreen',
									text:'Howdy!'
								}
							},
							{label:"Image", icon:"image", desc:"An image or icon",
								classname:"icon",
								params:{
									height:50,
									width:50,
									fgcolor:'cornflower',
									icon:'flask'
								}
							}
						]
					},
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

								node.args.push(this.buildCallNode(item));

								//console.log('Dropped onto node:', node);

								this.screen.composition.commitAST();

							}
						}
					}.bind(this)
				})
			),
			this.panel({title:"Properties", viewport:"2D", flex:2.5, visible:!!(this.inspect)},
				propviewer({name:"inspector", target:this.inspect, flex:1, overflow:"scroll"})
			)
		];
	}
});
