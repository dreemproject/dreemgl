/* Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
 You may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
 either express or implied. See the License for the specific language governing permissions and limitations under the License.*/

define.class("$ui/view", function(require,
								  $ui$, view, label, icon, treeview, button,
								  $widgets$, palette, propviewer){

// The DreemGL Visual Toolkit allows for visual manipulation of a running compostion

	this.name = "toolkit";
	this.clearcolor = "#565656";
	this.bgcolor = "#565656";
	this.flex = 1;
	this.flexdirection = "column";
	this.alignitems = "stretch";
	this.tooltarget = false;

	this.position = "absolute";
	this.width = 400;
	this.height = 800;
	this.opacity = 0.7;
	this.visible = false;

	this.borderradius = 7;
	this.bordercolor = vec4(1,1,1,0.7);
	this.borderwidth = 1;

	this.attributes = {

		// The target for the property inspector
		inspect:Config({type:Object}),

		// Components available to be dragged into compositions.
		components:Config({type:Object, value:{
			Views:[
				{
					label:"View",
					icon:"sticky-note",
					desc:"A rectangular view",
					classname:"view",
					classdir:"$ui$",
					params:{
						height:70,
						width:80,
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
						fontsize:44,
						opaque:true,
						fgcolor:'lightgreen',
						text:'Howdy!'
					}
				},
				{
					label:"Check Button",
					icon:"check-square",
					desc:"A check button",
					classname:"checkbox",
					classdir:"$ui$",
					params:{
						fontsize:24,
						fgcolor:'pink'
					}
				},
				{
					label:"Button",
					icon:"square",
					desc:"A basic button",
					classname:"button",
					classdir:"$ui$",
					params:{
						fontsize:24,
						fgcolor:'red',
						text:'Press Me!'
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
						opaque:true,
						icon:'flask',
						fontsize:80
					}
				}
			],
			Behaviors:[
				{
					label:"Alert",
					icon:"warning",
					desc:"Adds a click event that pops up an alert dialog",
					behaviors:{
						onclick:function() {
							alert('Beep.')
						}
					}
				}
			]
		}}),

		// When in 'design' mode buttons in compositions no longer become clickable, text fields become immutable,
		// and views can be resized and manipulated.
		// In 'live' mode views lock into place the composition regains it's active behaviors
		mode:Config({type:Enum('design','live'), value:'design'}),
		reticlesize: 6,
		groupdrag:true,
		animateborder: false,
		rulers:true,

		// internal
		selection:Config({value:[], meta:"hidden"}),
		watch:Config({persist:true, value:[], meta:"hidden"})
//		astwatch:Config({persist:true, type:String})
	};

	this.onrulers = function() {
		if (!this.rulers && this.__ruler) {
			this.__ruler.closeOverlay();
			this.__ruler.target = undefined;
			this.__ruler = undefined;
		}
	};

	this.onanimateborder = function (ev,v,o) {
		this.bordercolorfn = v ? this.animatedbordercolorfn : this.staticbordercolorfn;
	};

	this.animatedbordercolorfn = function(pos) {
		var speed = time * 37.0;
		var size = 0.0008;
		var slices = 3.5;
		var v = int(mod(size * (gl_FragCoord.x - gl_FragCoord.y + speed), slices));
		return vec4((v + 0.45) * vec3(0.5, 0.9, 0.9), 0.8);
	};
	this.staticbordercolorfn = function(pos) {
		var size = 0.0008;
		var slices = 3.5;
		var v = int(mod(size * ((x + pos.x) - (y + pos.y)), slices));
		return vec4((v + 0.45) * vec3(0.5, 0.9, 0.9), 0.8);
	};
	this.bordercolorfn = this.staticbordercolorfn;

	this.onwatch = function(ev,v,o) {
		var selection = [];
		if (v && v.length) {
			for (var i=0;i< v.length;i++) {
				var astpath = JSON.parse(v[i]);

				var node = this.screen;
				for (var j=1;node && j<astpath.length;j++) {
					var pathitem = astpath[j];
					if (node.children) {
						var child = node.children[pathitem.childindex];
						if (child && pathitem.type == child.constructor.name) {
							node = child;
						} else {
							node = undefined;
							break;
						}
					} else {
						node = undefined;
					}
				}
				if (node) {
					selection.push(node)
				}
			}
		}
		this.selection = selection;
	};

	//this.onastwatch = function(ev,v,o) {
	//	if (v) {
	//		var jwatch = JSON.parse(v);
	//		var newwatch = [];
	//		for (var i= 0;i<jwatch.length;i++) {
	//			var j = jwatch[i];
	//			newwatch.push(JSON.stringify(j));
	//		}
	//		this.watch = newwatch;
	//	}
	//};

	this.onselection = function(ev,v,o) {
		var inspector = this.find('inspector');

		if (this.__selrects) {
			for (var i = 0; i < this.__selrects.length; i++) {
				var selrect = this.__selrects[i];
				selrect.closeOverlay();
			}
		}

		if (this.selection) {
			this.__selrects = [];

			if (inspector) {
				if (this.selection.length <= 1) {
					var selected = this.selection[0];
					if (selected && inspector.target != selected) {
						inspector.astarget = JSON.stringify(selected.getASTPath());
					}
				} else {
					inspector.target = null;
				}
			}

			var filtered = this.selection.filter(function(a) { return a.toolrect !== false && this.testView(a) }.bind(this));

			for (var i=0;i<filtered.length;i++) {
				var target = filtered[i];
				var selectrect = this.screen.openOverlay(this.selectedrect);
				selectrect.target = target;
				this.__selrects.push(selectrect);
			}

		} else {
			inspector.target = null;
		}

		var tree = this.find("structure");
		if (tree && tree.reload) {
			tree.reload();
		}

	};

	this.init = function () {
		this.ensureDeps();

		//if (this.astwatch) {
		//	this.onastwatch(null, this.astwatch, this)
		//}

		this.screen.globalpointerstart = function(ev) {
			if (!this.visible) {
				return;
			}

			if (this.__ruler) {
				this.__ruler.rulermarkstart = ev.pointer.position;
			}

			if (ev.view == this) {
				var inspector = this.find('inspector');
				if (inspector) {
					inspector.astarget = JSON.stringify(this.getASTPath());
				}
				this.__startpos = ev.view.globalToLocal(ev.pointer.position);

				this.__originalpos = {
					x:ev.view.x,
					y:ev.view.y
				};

				this.__originalsize = {
					w:ev.view.width,
					h:ev.view.height
				};

				this.__resizecorner = this.edgeCursor(ev);

			} else if (this.testView(ev.view)) {

				var astpath = JSON.stringify(ev.view.getASTPath());
				if (!this.watch || this.watch.indexOf(astpath) < 0) {
					this.watch = [astpath];
					//var astw = [];
					//for (var a=0;a<this.watch.length;a++) {
					//	var j = JSON.parse(this.watch[a]);
					//	astw.push(j);
					//}
					//this.setASTObjectProperty(this, "astwatch", JSON.stringify(astw));
					//this.screen.composition.commitAST();
				}

				if (ev.view.toolmove === false){
					ev.view.cursor = "crosshair";
					this.__startrect = ev.pointer.position;
				} else {
					this.__startpos = ev.view.globalToLocal(ev.pointer.position);

					this.__originalpos = {
						x:ev.view.x,
						y:ev.view.y
					};

					this.__originalsize = {
						w:ev.view.width,
						h:ev.view.height
					};

					this.__resizecorner = this.edgeCursor(ev);
					ev.view.cursor = "move";
					ev.view.drawtarget = "color";
					ev.pointer.pickview = true;
				}
			}

		}.bind(this);

		this.screen.globalpointermove = function(ev) {
			if (!this.visible) {
				return;
			}

			if (this.__ruler && this.__ruler.target == ev.view) {
				this.__ruler.target = ev.view.parent;
			}
			if (this.__ruler) {
				this.__ruler.rulermarkstart = ev.view.pos;
				this.__ruler.rulermarkend = vec2(ev.view._layout.left + ev.view._layout.width, ev.view._layout.top + ev.view._layout.height);
			}

			if (this.__resizecorner) {

				if (this.__resizecorner === "bottom-right") {
					ev.view.width = this.__originalsize.w + ev.pointer.delta.x;
					ev.view.height = this.__originalsize.h + ev.pointer.delta.y;
				} else if (this.__resizecorner === "bottom") {
					ev.view.height = this.__originalsize.h + ev.pointer.delta.y;
				} else if (this.__resizecorner === "right") {
					ev.view.width = this.__originalsize.w + ev.pointer.delta.x;
				} else if (this.__resizecorner === "top-left") {
					ev.view.x = ev.pointer.position.x - this.__startpos.x;
					ev.view.y = ev.pointer.position.y - this.__startpos.y;
					ev.view.width = this.__originalsize.w - ev.pointer.delta.x;
					ev.view.height = this.__originalsize.h - ev.pointer.delta.y;
				} else if (this.__resizecorner === "left") {
					ev.view.x = ev.pointer.position.x - this.__startpos.x;
					ev.view.width = this.__originalsize.w - ev.pointer.delta.x;
				} else if (this.__resizecorner === "top") {
					ev.view.y = ev.pointer.position.y - this.__startpos.y;
					ev.view.height = this.__originalsize.h - ev.pointer.delta.y;
				} else if (this.__resizecorner === "bottom-left") {
					ev.view.x = ev.pointer.position.x - this.__startpos.x;
					ev.view.width = this.__originalsize.w - ev.pointer.delta.x;
					ev.view.height = this.__originalsize.h + ev.pointer.delta.y;
				} else if (this.__resizecorner === "top-right") {
					ev.view.y = ev.pointer.position.y - this.__startpos.y;
					ev.view.height = this.__originalsize.h - ev.pointer.delta.y;
					ev.view.width = this.__originalsize.w + ev.pointer.delta.x;
				}

			} else if (this.__startpos && this.testView(ev.view) && ev.view.toolmove !== false) {

				var pos = ev.pointer.position;
				if (ev.view.parent) {
					if (ev.view.position != "absolute") {
						ev.view.position = "absolute";
					}
					pos = ev.view.parent.globalToLocal(ev.pointer.position)
				}

				ev.view.pos = vec2(pos.x - this.__startpos.x, pos.y - this.__startpos.y);

				if (this.groupdrag && this.selection) {
					for (var i=0;i<this.selection.length;i++) {
						var selected = this.selection[i];
						selected.pos = vec2(selected.pos.x + ev.pointer.movement.x, selected.pos.y + ev.pointer.movement.y)
					}
				}

				this.__lastpick = ev.pointer.pick;

			} else if (this.__startrect) {

				var select = this.__selectrect || this.find('selectorrect');
				if (!select) {
					select = this.__selectrect = this.screen.openOverlay(this.selectorrect);
					this.__selectrect.pos = this.__startrect;
				}

				var pos = ev.pointer.position;

				var a = this.__startrect;
				var b = pos;

				if (a.x < b.x && a.y < b.y) { //normal
					select.pos = a;
					select.size = vec2(b.x - a.x, b.y - a.y);
				} else if (b.x < a.x && a.y < b.y) { // b lower left, a upper right
					select.pos = vec2(b.x, a.y);
					select.size = vec2(a.x - b.x, b.y - a.y);
				} else if (a.x < b.x && b.y < a.y) { // a lower left, b upper right
					select.pos = vec2(a.x, b.y);
					select.size = vec2(b.x - a.x, a.y - b.y);
				} else {
					select.pos = vec2(b.x, b.y);
					select.size = vec2(a.x - b.x, a.y - b.y);
				}
			}

			if (ev.view.__selrect) {
				ev.view.__selrect.pos = vec2(ev.view._layout.absx - 1, ev.view._layout.absy - 1);
				ev.view.__selrect.size = vec2(ev.view._layout.width + 2, ev.view._layout.height + 2);
			}

		}.bind(this);

		this.screen.globalpointerend = function(ev) {
			if (ev.view.drawtarget != "both") {
				ev.view.drawtarget = "both";
			}

			if (!this.visible) {
				return;
			}

			if (this.__ruler && this.__ruler.target !== ev.view && this.testView(ev.view)) {
				this.__ruler.target = ev.view;
			}


			ev.view.cursor = 'arrow';
			var commit = false;
			if (this.__resizecorner && (ev.view == this || this.testView(ev.view)) && ev.view.toolresize !== false) {
				if (this.__resizecorner === "top-left") {
					ev.view.x = ev.pointer.position.x - this.__startpos.x;
					ev.view.y = ev.pointer.position.y - this.__startpos.y;
				} else if (this.__resizecorner === "top") {
					ev.view.y = ev.pointer.position.y - this.__startpos.y;
				} else if (this.__resizecorner === "left") {
					ev.view.x = ev.pointer.position.x - this.__startpos.x;
				} else if (this.__resizecorner === "bottom-left") {
					ev.view.x = ev.pointer.position.x - this.__startpos.x;
				}

				this.setASTObjectProperty(ev.view, "position", "absolute");
				this.setASTObjectProperty(ev.view, "x", ev.view._layout.absx);
				this.setASTObjectProperty(ev.view, "y", ev.view._layout.absy);
				this.setASTObjectProperty(ev.view, "width", ev.view._layout.width);
				this.setASTObjectProperty(ev.view, "height", ev.view._layout.height);

				commit = (Math.abs(ev.view.x - this.__originalpos.x) > 0.5)
					|| (Math.abs(ev.view.y - this.__originalpos.y) > 0.5)
					|| (Math.abs(ev.view._layout.width - this.__originalsize.w) > 0.5)
					|| (Math.abs(ev.view._layout.height - this.__originalsize.h) > 0.5);

			} else if (this.__startpos && this.testView(ev.view) && ev.view.toolmove !== false) {

				var pos = ev.pointer.position;
				if (ev.view.parent) {
					if (ev.view.position != "absolute") {
						ev.view.position = "absolute";
					}
					pos = ev.view.parent.globalToLocal(ev.pointer.position)
				}

				var nx = pos.x - this.__startpos.x;
				var dx = Math.abs(ev.view.x - this.__originalpos.x);
				if (dx > 0.5) {
					this.setASTObjectProperty(ev.view, "x", nx);
					commit = true;
				}

				var ny = pos.y - this.__startpos.y;
				var dy = Math.abs(ny - this.__originalpos.y);
				if (dy > 0.5) {
					this.setASTObjectProperty(ev.view, "y", ny);
					commit = true;
				}

				if (this.groupdrag && this.selection) {
					for (var i=0;i<this.selection.length;i++) {
						var selected = this.selection[i];
						if (this.testView(selected) && selected.toolmove !== false) {
							nx = selected.pos.x + ev.pointer.movement.x;
							this.setASTObjectProperty(selected, "x", nx);

							ny = selected.pos.y + ev.pointer.movement.y;
							this.setASTObjectProperty(selected, "y", ny);
						}
					}
				}

				if (this.__lastpick && this.__lastpick !== ev.view.parent && this.testView(this.__lastpick) && this.__lastpick.tooldrop !== false) {
					pos = this.__lastpick.globalToLocal(ev.pointer.position);

					nx = pos.x - this.__startpos.x;
					ny = pos.y - this.__startpos.y;

					this.setASTObjectProperty(ev.view, "x", nx, false);
					this.setASTObjectProperty(ev.view, "y", ny, false);

					var astnode = ev.view.getASTNode();

					var newparent = this.__lastpick.getASTNode();
					if (!newparent.args) {
						newparent.args = []
					}
					newparent.args.push(astnode);

					var oldparent = ev.view.parent.getASTNode();
					var index = oldparent.args.indexOf(astnode);
					if (index >= 0) {
						oldparent.args.splice(index, 1);
					}

					commit = true;
				}


			} else if (this.__startrect) {
				var pos = ev.pointer.position;

				var a = this.__startrect;
				var b = pos;

				var rect = vec4();

				if (a.x < b.x && a.y < b.y) { //normal
					rect.x = a.x;
					rect.y = a.y;
					rect.w = b.x - a.x;
					rect.z = b.y - a.y;
				} else if (b.x < a.x && a.y < b.y) { // b lower left, a upper right
					rect.x = b.x;
					rect.y = a.y;
					rect.w = a.x - b.x;
					rect.z = b.y - a.y;
				} else if (a.x < b.x && b.y < a.y) { // a lower left, b upper right
					rect.x = a.x;
					rect.y = b.y;
					rect.w = b.x - a.x;
					rect.z = a.y - b.y;
				} else {
					rect.x = b.x;
					rect.y = b.y;
					rect.w = a.x - b.x;
					rect.z = a.y - b.y;
				}
				var select = this.__selectrect || this.find('selectorrect');
				if (select) {
					select.closeOverlay();
					this.__selectrect = undefined;
				}

				var selection = this.screen.childrenInRect(rect, [select]);
				var watch = [];
				for (var i=0;i<selection.length;i++) {
					var selected = selection[i];
					if (selected !== this && this.testView(selected) && this.toolselect !== false) {
						var astpath = JSON.stringify(selected.getASTPath());
						watch.push(astpath);
					}
				}
				this.watch = watch;

				//if (this.watch.length) {
				//	var astw = [];
				//	for (var a=0;a<this.watch.length;a++) {
				//		var j = JSON.parse(this.watch[a]);
				//		astw.push(j);
				//	}
				//	this.setASTObjectProperty(this, "astwatch", JSON.stringify(astw));
				//	commit = true;
				//}
			}

			if (commit) {
				this.ensureDeps();
				this.screen.composition.commitAST();
			}

			this.__lastpick = this.__startrect = this.__startpos = this.__originalpos = this.__resizecorner = this.__originalsize = undefined;
		}.bind(this);

		this.screen.globalpointerhover = function(ev) {
			if (!this.visible) {
				return;
			}

			var text = ev.view.constructor.name;
			if (ev.view.name) {
				text = ev.view.name + " (" + text + ")"
			}

			var pointers = ev.pointers;
			if (!pointers && ev.pointer) {
				pointers = [ev.pointer];
			}

			for (var i=0;i<pointers.length;i++) {
				var pointer = pointers[i];

				var pos = ev.view.globalToLocal(pointer.position);

				if (this.__ruler && this.__ruler.target) {
					this.__ruler.rulermarkstart = this.__ruler.target.globalToLocal(pointer.position);
				}


				text = text + " @ " + ev.pointer.position.x.toFixed(0) + ", " + ev.pointer.position.y.toFixed(0);
				text = text + " <" + pos.x.toFixed(0) + ", " + pos.y.toFixed(0) + ">";

				this.find("current").text = text;

				this.edgeCursor(ev)
			}

			if (this.__selectrect) {
				var m = this.__selectrect;
				this.__selectrect = undefined;
				m.closeOverlay();
			}

		}.bind(this);

		this.screen.globalkeydown = function(ev) {
			if (ev.code === 84 && ev.ctrl && ev.shift) {
				this.setASTObjectProperty(this, "visible", !this.visible);
				this.ensureDeps();
				this.screen.composition.commitAST();
				return;
			}
			if (!this.visible) {
				return;
			}

			if (ev.code === 8 && this.selection) {
				var commit = false;
				var multi = this.selection.length > 1;
				for (var i=this.selection.length - 1; i>=0; i--) {
					var v = this.selection[i];
					if ((multi || v.focus) && this.testView(v) && v.toolremove !== false) {
						var node = v.getASTNode();
						var parent = v.parent.getASTNode();
						var index = parent.args.indexOf(node);
						if (index >= 0) {
							parent.args.splice(index, 1);
							commit = true;
						}
					}
				}
				if (commit) {
					this.ensureDeps();
					this.screen.composition.commitAST();
				}
			}
		}.bind(this);
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
					if (name[0] === '$' && name[name.length - 1] === '$') {
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
			if (Array.isArray(this.components)) {
				for (var i=0;i<this.components.length;i++) {
					var compdef = this.components[i];

					var classname = compdef.classname;
					if (classname) {
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
			} else {

				for (var key in this.components) {
					if (this.components.hasOwnProperty(key)) {
						var section = this.components[key];
						for (var s=0;s<section.length;s++) {
							var compdef = section[s];

							var classname = compdef.classname;
							if (classname) {
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
				}
			}

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
		if (ev.view === this || (this.testView(ev.view) && ev.view.toolmove !== false)) {
			var pos = ev.view.globalToLocal(ev.pointer.position);
			var edge = this.reticlesize;

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

		} else if (ev.view.toolallow === false) {
			ev.view.cursor = 'not-allowed';
		} else {
			ev.view.cursor = 'arrow';
		}

		return resize;
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

	this.setASTObjectProperty = function(v, name, value, setval) {
		if (v == this.screen) {
			console.error("how did a screen get selected to be edited?")
			return;
		}
		if (setval !== false) {
			v[name] = value;
		}

		var ast = v.seekASTNode({type:"Object", index:0});

		var found;
		if (ast && ast.keys) {
			for (var i=0;i < ast.keys.length;i++) {
				var prop = ast.keys[i];
				if (prop && prop.key && prop.key.name && prop.key.name === name) {
					found = prop;
					break;
				}
			}
			if (!found) {
				found = this.buildKeyValueNode(name, value, "init");
				ast.keys.push(found);
			} else {
				found.value = this.buildValueNode(value);
			}
		} else {
			ast = v.getASTNode();
			if (ast) {
				var args = {};
				args[name] = value;
				var obj = this.buildObjectNode(args, 'init');
				ast.args.splice(0,0,obj);
			}
		}
	};

	define.class(this,"selectorrect",view,function() {
		this.name = "selectorrect";
		this.bordercolorfn = function(pos) {
			var speed = time * 27.0;
			var size = 0.0008;
			var slices = 3.5;
			var v = int(mod(size * (gl_FragCoord.x - gl_FragCoord.y + speed), slices));
			return vec4((v + 0.45) * vec3(0.5, 0.9, 0.9), 0.8);
		}
		this.borderwidth = 1;
		this.bgcolor = vec4(0.7,0.7,0.7,0.07);
		this.borderradius = 7;
		this.position = "absolute";
		this.tooltarget = false;
	});

	define.class(this, "selectedrect", view, function() {
		this.visible = wire('this.outer.visible');
		this.attributes = {
			borderseed:Math.random() + 17.0,
			target:Config({persist:true, type:Object})
		};
		this.bordercolorfn = function(pos) {
			var size = 0.02;
			var slices = 2.0;
			var v = int(mod(size * (gl_FragCoord.x - gl_FragCoord.y + this.borderseed), slices));
			return vec4((v + 1) * vec3(0.9, 0.5, 0.8), 0.8);
		};

		this.minimumborderradius = 3;
		this.borderradius = this.minimumborderradius;
		this.onborderradius = function(ev,v,o) {
			if (v) {
				for (var i = 0; i < v.length; i++) {
					if (!v[i]) {
						v[i] = this.minimumborderradius;
					}
				}
			}
		};

		this.borderwidth = 4;
		this.bgcolor = NaN;
		this.position = "absolute";
		this.tooltarget = false;
		this.ontarget = function(ev,v,o) {
			this.pos = vec2(v._layout.absx - this.borderwidth[0] / 2.0, v._layout.absy - this.borderwidth[0] / 2.0);
			this.size = vec2(v._layout.width + this.borderwidth[0], v._layout.height + this.borderwidth[0])
			this.rotate = v.rotate;

			if (v.borderradius && v.borderradius[0] + v.borderradius[1] + v.borderradius[2] + v.borderradius[3]) {
				this.borderradius = v.borderradius;
			}

			v.onsize = function(ev,v,o) {
				this.size = vec3(v.x + this.borderwidth[0], v.y + this.borderwidth[0], v.z)
			}.bind(this);

			v.onpos = function(ev,v,o) {
				var x = v.x - (this.borderwidth[0] + this.borderwidth[1]) / 2.0;
				var y = v.y - (this.borderwidth[2] + this.borderwidth[3]) / 2.0;
				var p = o;
				while (p = p.parent) {
					x = x + p.x;
					y = y + p.y;
				}
				this.pos = vec3(x, y, v.z);
			}.bind(this);

			v.onrotate = function(ev,v,o) {
				this.rotate = v;
			}.bind(this);

			v.onborderradius = function(ev,v,o) {
				this.borderradius = v;
			}.bind(this);
		}
 	});

	define.class(this, "ruler", view, function() {
		this.visible = wire('this.outer.visible');
		this.bgcolor = NaN;
		this.position = "absolute";
		this.tooltarget = false;
		this.borderwidth = vec4(10.0,10.0,10.0,10.0);
		this.attributes = {
			target:Config({type:Object}),
			rulertickwidth:1,
			rulertickspacing:10.0,
			rulermajorevery:10,
			rulermajorcolor:vec4("#F9F6F4"),
			rulerminorcolor:vec4("#B0C4DE"),
			rulermarkstartcolor:vec4("#FFCC00"),
			rulermarkstart:vec2(0,0),
			rulermarkendcolor:vec4("#FF0080"),
			rulermarkend:vec2(0,0),
			bordercolorfn:function(p) {
				var atx = p.x * layout.width;
				var aty = p.y * layout.height;
				if ((aty > borderwidth[2] && aty < layout.height - borderwidth[3]) && (atx < borderwidth[0] || atx > layout.width - borderwidth[1])) {
					if (aty > rulermarkstart[1] - rulertickwidth * 0.5 && aty < rulermarkstart[1] + rulertickwidth * 0.5) {
						return rulermarkstartcolor;
					} else if (aty > rulermarkend[1] - rulertickwidth * 0.5 && aty < rulermarkend[1] + rulertickwidth * 0.5) {
						return rulermarkendcolor;
					}

					var c = int(mod(gl_FragCoord.y, rulertickspacing * rulermajorevery));
					if (c < int(rulertickwidth * 2.0)) {
						return rulermajorcolor;
					}

					if (atx < borderwidth[0] * 0.5 || atx > layout.width - borderwidth[1] * 0.5) {
						var m = int(mod(gl_FragCoord.y, rulertickspacing));
						if (m < int(rulertickwidth)) {
							return rulerminorcolor;
						}
					}
				}
				else if ((atx > borderwidth[0] && atx < layout.width - borderwidth[1]) && (aty < borderwidth[2] || aty > layout.height - borderwidth[3])) {

					if (atx > rulermarkstart[0] - rulertickwidth * 0.5 && atx < rulermarkstart[0] + rulertickwidth * 0.5) {
						return rulermarkstartcolor;
					} else if (atx > rulermarkend[0] - rulertickwidth * 0.5 && atx < rulermarkend[0] + rulertickwidth * 0.5) {
						return rulermarkendcolor;
					}

					var b = int(mod(gl_FragCoord.x, rulertickspacing * rulermajorevery));
					if (b < int(rulertickwidth * 2.0)) {
						return rulermajorcolor;
					}

					if (aty < borderwidth[2] * 0.5 || aty > layout.height - borderwidth[3] * 0.5) {
						var n = int(mod(gl_FragCoord.x, rulertickspacing));
						if (n < int(rulertickwidth)) {
							return rulerminorcolor;
						}
					}

				}
				return bordercolor;
			}
		};
		this.ontarget = function(ev,v,o) {
			if (!v) {
				this.visible = false;
				return;
			}
			this.visible = wire('this.outer.visible');
			this.pos = vec2(v._layout.absx, v._layout.absy);
			this.size = vec2(v._layout.width, v._layout.height);
			this.rotate = v.rotate;
            //
			//v.onsize = function(ev,v,o) {
			//	this.size = vec3(v.x + this.borderwidth[0], v.y + this.borderwidth[0], v.z)
			//}.bind(this);
            //
			//v.onpos = function(ev,v,o) {
			//	this.pos = vec3(v._layout.absx, v._layout.absy, v.z);
			//}.bind(this);
            //
			//v.onrotate = function(ev,v,o) {
			//	this.rotate = v;
			//}.bind(this);
            //
			//v.onborderradius = function(ev,v,o) {
			//	this.borderradius = v;
			//}.bind(this);
		}
	});

	define.class(this, 'panel', view, function(){
		this.attributes = {
			title: Config({type:String, value:""}),
			fontsize: Config({type:float, value:12, meta:"fontsize"})
		};

		this.padding = 0;
		this.margin = 4;
		this.borderradius = vec4(10,10,1,1);
		this.bgcolor = NaN;
		this.flex = 1;
		this.flexdirection ="column";
		this.alignitems = "stretch";

		this.render = function(){
			return [
				label({
					y:1,
					alignself:'flex-start',
					fgcolor:"white",
					text:this.title,
					fontsize:this.fontsize,
					margin:0,
					padding:vec4(10,8,0,0),
					bgcolor:"#4e4e4e",
					borderwidth:0,
					borderradius:vec4(10,10,0,0)
				}),
				this.constructor_children
			];
		}
	});

	this.testView = function(v) {
		var ok = v != this.screen;
		var p = v;
		while (p && ok) {
			ok = p.tooltarget !== false;
			p = p.parent;
		}
		return ok;
	};

	this.render = function() {
		var views = [];

		var vertical = this.flexdirection === "column";

		if (vertical) {
			views = [
				view({
					justifycontent:'space-between',
					bgcolor:"white",
					hardrect:{pickonly:true},
					pointerstart:function(p) {
						this.__grabpos = p.view.globalToLocal(p.position);
					},
					pointermove:function(p) {
						if (this.parent.position === "absolute") {
							this.screen.pointer.cursor = "move";
							this.parent.pos = vec2(p.position.x - this.__grabpos.x, p.position.y - this.__grabpos.y)
						}
					},
					pointerend:function(p) {
						var parent = this.parent
						if (parent.testView && parent.toolmove !== false  && parent.position === "absolute") {
							parent.pos = vec2(p.position.x - this.__grabpos.x, p.position.y - this.__grabpos.y)

							parent.setASTObjectProperty(parent, "position", "absolute");
							parent.setASTObjectProperty(parent, "x", parent._layout.absx);
							parent.setASTObjectProperty(parent, "y", parent._layout.absy);
							parent.setASTObjectProperty(parent, "width", parent._layout.width);
							parent.setASTObjectProperty(parent, "height", parent._layout.height);
							parent.ensureDeps();
							this.screen.composition.commitAST();
						}
						this.screen.pointer.cursor = "arrow";
						this.__grabpos = undefined;
					}
				},
				label({
					name:"title",
					text:"DreemGL Visual Toolkit",
					bgcolor:NaN,
					padding:5,
					paddingleft:10,
					drawtarget:'color'
				}),
				button({
					icon:'times',
					bgcolor:NaN,
					borderwidth:0,
					marginright:5,
					onclick:function(ev,v,o) {
						this.setASTObjectProperty(this, "visible", false);
						this.ensureDeps();
						this.screen.composition.commitAST();
					}.bind(this)
				}))
			]
		}

		views.push(this.panel({title:"Components", flex:1.0},
			palette({
				name:"components",
				flex:1,
				bgcolor:"#4e4e4e",
				items:this.components,

				dropTest:function(ev, v, item, orig, dv) {
					//var name = v && v.name ? v.name : "unknown";
					//console.log("test if", item.label, "from", orig.position, "can be dropped onto", name, "@", ev.position, dv);
					return v !== this && this.testView(v);
				}.bind(this),

				drop:function(ev, v, item, orig, dv) {
					var name = v && v.name ? v.name : "unknown";
//					console.log("dropped", item.label, "from", orig.position, "onto", name, "@", ev.position, dv);

					if (v) {
						var node = v.getASTNode();

						if (node) {

							if (item.behaviors) {
								console.log('Dropped behavior ', item, 'onto node:', node);
								for (var o in item.behaviors) {
									console.log('o', o)
									if (item.behaviors.hasOwnProperty(o)) {
										var behave = item.behaviors[o];
										console.log('b', behave)
										v[o] = behave;
									}
								}
								console.log('here')
								//TODO store these into the ast, make sure prop viewer can see them w/code viewer?)
							}

							if (item.classname && item.params) {
								var params = JSON.parse(JSON.stringify(item.params));

								var pos = v.globalToLocal(ev.position);

								params.position = 'absolute';
								params.x = pos.x;
								params.y = pos.y;
								//console.log('Dropped', item.classname, 'onto node:', node, 'with params', params);

								node.args.push(this.buildCallNode(item.classname, params));

							}

							this.ensureDeps();
							this.screen.composition.commitAST();

							//TODO set propviewer to inspect new object on reload?


						}
					}
				}.bind(this)
			})
		));

		views.push(this.panel({title:"Cursor", flex:vertical ? 0 : 2},
			label({name:"current", text:"", padding:5, paddingleft:10, bgcolor:"#4e4e4e"})
		));

		views.push(this.panel({title:"Structure", flex:0.7},
			treeview({
				flex:1,
				name:"structure",
				reload:function() {
					var swalk = function (v) {
						if (v.tooltarget !== false) {
							var children = [];
							for (var i = 0; i < v.children.length; i++) {
								var child = swalk(v.children[i]);
								if (child) {
									children.push(child);
								}
							}

							var name = v.constructor.name;
							if (v.name) {
								name = v.name + " (" + name + ")"
							}
							var selected = (!!(this.selection) && this.selection.indexOf(v) > -1);
							return {
								name:name,
								children: children,
								selected: selected,
								collapsed:(v.constructor.name !== "screen"),
								view:v
							}
						}
					}.bind(this.parent.outer);
					this.data = swalk(this.screen);
				},
				init:function() {
					this.reload();
				},
				onselect:function(ev) {
					if (ev && ev.item && ev.item.view) {
						var astpath = JSON.stringify(ev.item.view.getASTPath());
						if (!this.watch || this.watch.indexOf(astpath) < 0) {
							this.watch = [astpath];
						}
					}
				}.bind(this)
			})
		));

		views.push(this.panel({title:"Properties", flex:2},
			propviewer({
				name:"inspector",
				target:this.inspect,
				flex:1,
				overflow:"scroll",
				bgcolor:"#4e4e4e",
				callback:function(val, editor, commit) {
					if (editor && editor.target && editor.propertyname) {
						var t = editor.target;
						if (typeof(t) === 'string') {
							t = editor.find(t);
						}

						if (t && (t == this || this.testView(t)) && t.tooledit !== false) {
							this.setASTObjectProperty(t, editor.propertyname, val);
							this.__needscommit = true;
						}
					}
					if (commit && this.__needscommit) {
						this.__needscommit = false;
						this.ensureDeps();
						this.screen.composition.commitAST();
					}
				}.bind(this),
				ontarget:function(ev,v,o) {
					if (v) {
						v.focus = true;
						if (this.__ruler) {
							this.__ruler.closeOverlay();
						}
						if (this.rulers && this.testView(v)) {
							this.__ruler = this.screen.openOverlay(this.ruler);
							this.__ruler.target = v;
						}
					}
				}.bind(this),
				astarget:Config({type:String, persist:true}),
				onastarget:function(ev,v,o) {
					var node = this.screen;

					if (v) {
						var astpath = JSON.parse(v);
						// console.log('path', astpath);
						for (var i=1;i<astpath.length;i++) {
							var pathitem = astpath[i];
							var child = node.children[pathitem.childindex];
							if (child && pathitem.type == child.constructor.name) {
								node = child;
							} else {
								node = undefined;
								break;
							}
						}
					}

					this.target = node;
				}
			})
		));

		return views;
	};
});
