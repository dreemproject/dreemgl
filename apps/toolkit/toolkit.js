/* Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
 You may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
 either express or implied. See the License for the specific language governing permissions and limitations under the License.*/

define.class("$ui/splitcontainer", function(require,
								  $ui$, view, label,
								  $widgets$, palette, propviewer,
								  $server$, sourceset, dataset,
								  $$, dockpanel){

	this.name = "toolkit";
	this.flex = 1;
	this.clearcolor = "#565656";
	this.bgcolor = "#565656";
	this.flexdirection = "column";

	this.attributes = {
		inspect:Config({type:Object})
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

	this.render = function() {
		return [
			dockpanel({alignitems:"stretch", aligncontent:"stretch", title:"Components", viewport:"2D", flex:1},
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
						var name = v && v.name ? v.name : "unknown";
						//console.log("test if", item.label, "from", orig.position, "can be dropped onto", name, "@", ev.position, dv);

                        var target = this;

						var dropok = true;
						var p = v;
						while (p && dropok) {
							dropok = p !== target && p.designtarget !== false;
							p = p.parent;
						}

						return dropok;
					}.bind(this),
					drop:function(ev, v, item, orig, dv) {
						// var name = v && v.name ? v.name : "unknown";
						// console.log("dropped", item.label, "from", orig.position, "onto", name, "@", ev.position, dv);

						if (v) {
							var node = v.getASTNode();

							if (node) {

								node.args.push(this.buildCallNode(item));

								console.log('Dropped onto node:', node);

								this.screen.composition.commitAST();

							}
						}
					}.bind(this)
				})
			),
			dockpanel({title:"Properties", viewport:"2D", flex:2.5, visible:!!(this.inspect)},
				propviewer({name:"inspector", target:this.inspect, flex:1, overflow:"scroll"})
			)
		];
	}
});
