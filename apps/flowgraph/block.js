/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
   Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and limitations under the License.*/

define.class('$ui/view', function(require,
								  $system$parse$, astscanner,
								  $ui$, view, icon, treeview, cadgrid, label, button, textbox,
								  $$, ballbutton, renameblockdialog){

	this.cursor = "move"
	this.position = "absolute"
	this.bgcolor = vec4("#3b3b3b" )
	this.padding = 0
	this.borderradius = 10
	this.borderwidth = 2
	this.bordercolor = vec4("#727272")

	function uppercaseFirst (inp) {
		if (!inp || inp.length == 0) return inp
		return inp.charAt(0).toUpperCase() + inp.slice(1)
	}

	// the style classes

	this.hovertext = ""

	this.mainwidth = 250

	this.style = {
		label_head: {bgcolor: NaN,margin: vec4(6,3,4,0), bold: true},
		view_main: {bgcolor: "#292929", width: this.mainwidth, flex: 1, margin: 1,justifycontent: "center"},
		view_header: {width: this.mainwidth, bgcolor: NaN, flex: 1, justifycontent: "space-between"},

		button_header: {buttoncolor2: "transparent", buttoncolor1: "transparent", bordercolor: "transparent", marginright: 4},
		view_between1: {bgcolor: NaN, width: this.mainwidth, flex: 1, justifycontent: "space-between"},
		view_between2: {bgcolor: NaN, position: "relative", x: 8,alignself: "flex-start", flexdirection: "column"},
		view_head: {bgcolor: NaN, position: "relative", x: -8,alignself: "flex-start", flexdirection: "column"},
		view_addbuttons: {flexdirection: "row", position: "absolute",alignitems: "stretch",width: 140, bgcolor: NaN, justifycontent: "space-between"}
	}

	this.attributes = {
		flowdata: {},
		//pos: Config({persist: true}),
		inputattributes: Config({type: Object, value: ["color"]}),
		outputattributes: Config({type: Object, value: ["clicked","something"]}),
		title: Config({type: String, value: "Untitled"}),
		snap: Config({type: int, value: 1}),
		bordercolor: Config({motion: "linear", duration: 0.1}),
		borderselected: Config({type: float, value: 0, motion: "linear", duration: 0.1}),
		focusbordercolor: Config({motion: "linear", duration: 0.1, type: vec4, value: "#d0d0d0", meta: "color"}),
		hoverbordercolor: Config({motion: "linear", duration: 0.1, type: vec4, value: "#e0e0e0", meta: "color"}),
		inselection : Config({type: boolean, value: false}),
		editables: [],
		nodeprops:{},
		showscreenbutton:false,
		inputs: [{name: "a0", title: "test input!", color: vec4("blue")}],
		outputs: [{name: "b1", title: "output? ", color: vec4("yellow")}]
	}

	this.colormap = {
		Number: vec4("#FFA500"),
		bool: vec4("#EE8280"),
		bool32: vec4("#EE8280"),
		Boolean: vec4("#EE8280"),
		BooleanLike: vec4("#EE8280"),
		int: vec4("#FF0080"),
		int32: vec4("#FF0080"),
		IntLike: vec4("#FF0080"),
		float32: vec4("#D23641"),
		float: vec4("#D23641"),
		FloatLike: vec4("#D23641"),
		Array: vec4("#0198E1"),
		vec4: vec4("#4FD5D6"),
		vec3: vec4("#31C3E7"),
		vec2: vec4("#BF5FFF"),
		String: vec4("#6ADA7A"),
		Object: vec4("#ffee14")
	}

	this.tooltip = 'issablock'
	this.oninputs = function() {
		for (var i = 0; i < this.inputs.length; i++){
			var inp = this.inputs[i]
			if (inp.type && this.colormap[inp.type.name]){
				inp.color = this.colormap[inp.type.name]
			} else {
				inp.color = vec4("gray")
			}
		}
	}


	this.onoutputs = function(){
		for (var i = 0;i<this.outputs.length;i++){
			var outp = this.outputs[i]
			if (outp.type && this.colormap[outp.type.name]){
				outp.color = this.colormap[outp.type.name]
			} else {
				outp.color = vec4("gray")
			}
		}
	}

	this.bordercolorfn = function(pos){
		var check = (int(mod(0.34*( gl_FragCoord.x + gl_FragCoord.y ),2.)) == 1)?1.0: 0.0
		return mix(bordercolor, mix(vec4(focusbordercolor.xyz*.8,1.0), focusbordercolor, check), borderselected)
		return vec4(check)
	}

	this.inselection = function(){
		this.updatecolor()
	}

	this.updatecolor = function(){
		if (this._inselection) {
			this.bordercolor = this.focusbordercolor
			this.borderselected = 1
		} else {
			this.borderselected = 0
			if (this.over){
				this.bordercolor = this.hoverbordercolor
			} else {
				this.bordercolor = this.neutralbordercolor
			}
		}
	}


	this.move = function(x,y) {
		var nx = this.pos[0] + x
		var ny = this.pos[1] + y
		if (nx<0) nx = 0
		if (ny<0) ny = 0
		this.pos = vec2(Math.round(nx),Math.round(ny))
		var fg = this.find("flowgraph")
		fg.setActiveBlock(this)
		fg.updateConnections()

	}

	this.keydownUparrow = function(){this.move(0,-1);}
	this.keydownDownarrow = function(){this.move(0,1);}
	this.keydownLeftarrow = function(){this.move(-1,0);}
	this.keydownRightarrow = function(){this.move(1,0);}
	this.keydownUparrowShift = function(){this.move(0,-10);}
	this.keydownDownarrowShift = function(){this.move(0,10);}
	this.keydownLeftarrowShift = function(){this.move(-10,0);}
	this.keydownRightarrowShift = function(){this.move(10,0);}

	this.keydownDelete = function(){
		var fg = this.find("flowgraph")
		fg.removeBlock(this)
	}

	this.keydown = function(v){
		this.defaultKeyboardHandler(v)
	}

	this.init = function(){
		this.neutralbordercolor = this.bordercolor
		this.find("flowgraph").allblocks.push(this)
	}

	this.destroy = function(){
		fg = this.find("flowgraph")
		if (fg){
			var index = fg.allblocks.indexOf(this)
			if (index > -1) fg.allblocks.splice(index, 1)
		}
	}

	this.setupMove = function(){
		this.startx = this.pos[0]
		this.starty = this.pos[1]
		//console.log(this.pos)
	}

	this.updateMove = function(dx, dy, snap){
		var x = Math.floor((this.startx+dx)/snap)*this.snap
		var y = Math.floor((this.starty+dy)/snap)*this.snap
		this.pos = vec2(x,y)
	}

	this.pointerstart = function(event){
		//this.moveToFront()
		var props = this.find("mainproperties")
		if (props) props.target = this.name
		var	fg = this.find("flowgraph")
		if (!this.screen.keyboard.shift && !fg.inSelection(this)){
			fg.clearSelection()
		}
		if (this.screen.keyboard.shift && fg.inSelection(this)){
			fg.removeFromSelection(this)
			fg.updateSelectedItems()
			return
		}
		fg.setActiveBlock(this)
		fg.updateSelectedItems()
		fg.setupSelectionMove()
	}

	this.pointermove = function(event){
		this.find("flowgraph").moveSelected(event.delta[0], event.delta[1], false)
	}

	this.pointerend = function(event){
		var x = Math.floor(this.pos[0]/this.snap)*this.snap
		var y = Math.floor(this.pos[1]/this.snap)*this.snap
		this.pos = vec2(x,y)
		this.redraw()
		this.relayout()
		this.find("flowgraph").moveSelected(event.delta[0], event.delta[1], true)
	}

	this.over = false

	this.pointerover = function(){
		if (!this.over) {
			var fg = this.find("flowgraph")
			fg.inspect = this
		}

		this.over = true
		this.screen.status = this.hovertext
		this.updatecolor()
	}

	this.pointerout = function(){
		this.over = false
		this.updatecolor()
	}

	this.flexdirection = "column"

	this.layout = function(){
		var ab = this.findChild("addbuttons")
		if (ab){
			ab.y = this._layout.height + 2
		}
	}

	define.class(this, "inputbutton", "$ui/view", function($ui$, view, label){
		//this.drawtarget = 'pick'

		this.attributes = {
			color: Config({type: vec4, value: vec4(0,0,0,0), meta: "color"}),
			name: "thing",
			title: "tadaa",
			type: ""
		}

		this.marginbottom = 4

		this.tapped = function(){
			var	bl = this.parent.parent.parent
			var	fg = this.find("flowgraph")
			fg.setConnectionEndpoint(bl.name, this.name, this.type, bl.type)
		}

		this.pointerover  = function(){
			this.screen.status = this.hovertext
		}

		this.render = function(){
			this.hovertext = "Input " + this.title+ (this.type?(": "+ this.type): "")
			return [
				ballbutton({borderwidth: 2, bgcolor: this.color, click: this.tapped.bind(this), alignself: "center"}),
				label({marginleft: 5, text: uppercaseFirst(this.title), bgcolor: NaN, alignself: "center"})
			]
		}
	})

	define.class(this, "outputbutton", "$ui/view", function($ui$, view, label){
		//this.drawtarget = 'pick'

		this.flexdirection = 'row'
		this.bgcolor = NaN
		this.flex = 1
		this.width = 120
		this.justifycontent = "flex-end"

		this.attributes = {
			color: Config({type: vec4, value: vec4(0,0,0,0), meta: "color"}),
			name: "thing",
			title: "thing",
			type: ""
		}

		this.pointerover  = function(){
			this.screen.status = this.hovertext
		}

		this.tapped = function(){
			var	bl = this.parent.parent.parent
			var	fg = this.find("flowgraph")
			fg.setConnectionStartpoint(bl.name, this.name, this.type)
		}

		this.marginbottom = 4

		this.render = function(){
				this.hovertext = "Output " + this.title+ (this.type?(": "+ this.type): "")

			return [
				label({text: uppercaseFirst(this.name), bgcolor: NaN, alignself: "center", align: "right", marginright: 5, flex: 0}),
				ballbutton({flex:0, borderwidth: 2, bgcolor: this.color, click: this.tapped.bind(this), alignself: "center"})
			]
		}
	})

	this.renderInputs = function(){
		var res = []
		for(var i = 0;i<this.inputs.length;i++){
			var inp = this.inputs[i]
			res.push(this.inputbutton({name: inp.name, type: inp.type.name, title: inp.title, color: inp.color}))
		}
		return res
	}

	this.renderOutputs = function(){
		var res = []
		for(var i = 0;i<this.outputs.length;i++){
			var outp = this.outputs[i]
			res.push(this.outputbutton({name: outp.name, type: outp.type.name, title: outp.title, color: outp.color}))
		}
		return res
	}

	this.renameBlock = function(e){
		this.screen.openModal(function(){
			return renameblockdialog({oldname: this.name, width: this.screen.size[0],height: this.screen.size[1],
				position: "absolute",
				x: e.value.x,
				y: e.value.y + 20,
				blur: function(){
					this.screen.closeModal(false)

			}} )

		}.bind(this)).then(function(res){

			if (res){
				this.find("flowgraph").setBlockName(this, res)
			}
		}.bind(this))

	}

	this.removeBlock = function(){
		this.find("flowgraph").removeBlock(this)
	}

	this.render = function(){

		var editors = [];

		for (var i=0;i<this._editables.length;i++) {
			var editable = this._editables[i];

			var ast = new astscanner(this.nodeprops,[{type:"Property", name:editable.name}])
			var value;
			if (ast.atindex > -1 && ast.atparent && ast.atparent.keys) {
				var found = ast.atparent.keys[ast.atindex]
				if (found && found.value) {
					value = found.value.value
				}
			}

			editors.push(view({flex:1, alignitems:"center"},
				label({flex:0.25, margin:vec4(10,5,10,5), bold:true, text:editable.title + ":"}),
				textbox({flex:3,
					multiline:false,
					fgcolor:vec4(0.8,0.8,0.8,1),
					paddingleft:5,
					originalvalue:value,
					editablename:editable.name,
					value:value,
					onfocus: function(ev,v,o) {
						if (!v && o._value && o._value != o._originalvalue) {
							var fg = this.find("flowgraph")
							if (fg && fg.sourceset) {
								var editablename = o._editablename;
								fg.sourceset.fork(function(src) {
									var ast = new astscanner(this.nodeprops,[{type:"Property", name:editablename}])
									var value;
									if (ast.atindex > -1 && ast.atparent && ast.atparent.keys) {
										var found = ast.atparent.keys[ast.atindex]
										if (found && found.value) {
											value = found.value;
											value.raw = '"' + o._value + '"';
											value.value = o._value
										}
									} else {
										ast.at.keys.push({
											key:{
												type:"Property",
												name:editablename
											},
											value:{
												type:"Value",
												kind:"string",
												raw:'"' +  o._value + '"',
												value: o._value
											}})
									}
								}.bind(this))
							}
						}
					}.bind(this)})));
		}

		var screenbutton;
		if (this.showscreenbutton) {
			screenbutton = [
				button({
					class: "header",
					icon: "desktop",
					click: function(e){
						var comp = this.screen.locationhash.composition;
						if (comp) {
							var ext = ".js"
							var location = define.expandVariables(comp)
							if (location.lastIndexOf(ext) === location.length - ext.length) {
								location = location.substring(0, location.length - ext.length)
								if (this.name) {
									location = location + "?" + this.name
								}
								window.open(location,'_blank');
							}

						}
					}.bind(this)}),
			]
		}

		return [
			view({class: 'header',alignitems: "center" }
				,view({bgcolor: NaN, justifycontent: "center", alignitems: "center" }
					,label({text: this.title,class: 'head'})
					,button({
						class: "header",
						icon: "pencil",
						click: function(e){this.renameBlock(e);}.bind(this)}),
					screenbutton
				)
				,button({class: "header", icon: "remove",click: function(e){this.removeBlock(e);}.bind(this)})
			)
			,view({class: 'main', bgcolor:vec4(0.2,0.3,0.3,0.5)},
				editors
			)
			,view({class: 'between1'}
				,view({class: 'head',render: function(){return this.renderInputs()}.bind(this)}

				)
				,view({class: 'between2', flexdirection: 'column', render: function(){return this.renderOutputs()}.bind(this)}

				)
			)
		]
	}
})
