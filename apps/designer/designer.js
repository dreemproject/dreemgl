/* Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
 You may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
 either express or implied. See the License for the specific language governing permissions and limitations under the License.*/

define.class("$ui/splitcontainer", function(require,
								  $ui$, view, label,
								  $widgets$, palette, propviewer,
								  $server$, sourceset, dataset,
								  $$, dockpanel){

	this.name = "designer";
	this.flex = 1;
	this.clearcolor = "#565656";
	this.bgcolor = "#565656";
	this.flexdirection = "column";

	this.attributes = {
		inspect:Config({type:Object}),

		source:Config({type:String}),

		onsource:function(ev,v,o) {
			var jsparser = require('$system/parse/onejsparser');
			this.ast = jsparser.parse(v);
		},

		ast:Config({type:Object})

	};

	this.init = function() {
		require.async("$root/apps/designer/index.js").then(function(result){
			this.source = result.module.factory.body.toString()
		}.bind(this))

	};

	this.writeAST = function() {

		var jsformatter = require('$system/parse/jsformatter');

		var buf = {
			out:'',
			charCodeAt: function(i){return this.out.charCodeAt(i)},
			char_count:0
		};

		jsformatter.walk(this.ast, buf, function(str){
			buf.char_count += str.length;
			buf.out += str
		});

		console.log('print', buf.out)

	};

	this.seek = function(sought, at) {
		if (!at) {
			at = this.ast;
		}

		var match = true;
		if (sought.type) {
			match = match && (sought.type === at.type)
		}
		if (sought.name) {
			if (at.key && at.key.name) {
				match = match && (at.key.name === sought.name)
			} else if (at.fn && at.fn.name) {
				match = match && (at.fn.name === sought.name)
			} else {
				match = false;
			}
		}

		var useindex = typeof(sought.index) !== "undefined";

		if (useindex) {
			match = false;
		}

		var found;

		if (match) {
			found = at;
		} else if (at.steps || at.elems || at.items || at.cases || at.chain || at.defs || at.enums || at.args) {
			var list = at.steps || at.elems || at.items || at.cases || at.chain || at.defs || at.enums || at.args;

			var vindex = 0;
			for (var i=0;!found && i < list.length;i++) {
				var item = list[i];
				var nodex = {
					type: sought.type,
					name:sought.name
				};

				found = this.seek(nodex, item);

				if (found && useindex && sought.index != vindex) {
					found = false;
				}

				if (item.type !== "Object") {
					vindex++;
				}
			}
		} else if (at.body || at.arg || at.right) {
			var obj = at.body || at.arg || at.right;
			found = this.seek(sought, obj);
			if (!found && at.left) {
				found = this.seek(sought, at.left);

				if (found) { //if you find the thing named what you want then you really want the thing on the right
					found = at.right;
				}
			}
		} else if (!found) {
			// TODO, more robust searching?
			// console.log('Do I want to search this object further?', at)
		}


		return found;

	};

	this.buildNode = function() {

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
							{classname:"view",  label:"View",  icon:"clone", desc:"A rectangular view"},
							{classname:"label", label:"Text",  text:"Aa",    desc:"A text label" },
							{classname:"icon",  label:"Image", icon:"image", desc:"An image or icon"}
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
						var name = v && v.name ? v.name : "unknown";
						// console.log("dropped", item.label, "from", orig.position, "onto", name, "@", ev.position, dv);

						if (v) {
							var path = v.buildASTPath();
							path = path.filter(function(a){ return a.constructor_index != -1});
							var node = this.ast;
							for (var i=0;i<path.length;i++) {
								var item = path[i];
								var search = {
									type:"Call",
									name:item.type,
									index:item.childindex
								};
								node = this.seek(search, node);
							}

							if (node) {

								node.args.push({
									type: "Call",
									fn: { type:"Id", name:"view" },
									args: [
										{
											type:"Object",
											keys: [
												{
													key:   { type:"Id", name:"width" },
													value: { type:"Value", kind:"num", raw:"50", value:50 }
												},
												{
													key:   { type:"Id", name:"height" },
													value: { type:"Value", kind:"num", raw:"50", value:50 }
												},
												{
													key:   { type:"Id", name:"bgcolor" },
													value: { type:"Value", kind:"string", multi:false, raw:"'purple'", value:"purple" }
												}
											]
										}
									]
								});

								console.log('Dropped onto node:', node);

								this.writeAST();

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
