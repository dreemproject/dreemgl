/* Copyright 2015-2016 Teem. Licensed under the Apache License, Version 2.0 (the "License"); Dreem is a collaboration between Teem & Samsung Electronics, sponsored by Samsung. 
   You may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 
   Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
   either express or implied. See the License for the specific language governing permissions and limitations under the License.*/

define.class('$ui/view', function($ui$, view, label, button, icon){
// The treeview control - classic treeview with expandable nodes.

	this.attributes = {
		// the dataset to use for tree expansion. It follows a {name:'test',children:[{name:'child'}]} format
		dataset: {},
		// the current selected value
		select: Config({type:Event})
	}
	
	this.bgcolor = '#3b3b3b'
	this.boundscheck = true
	this.viewport = '2d'
	this.overflow ='scroll'

	// The fold button is a very very flat button. 
	define.class(this, 'foldbutton', button, function(){

		this.borderwidth = 0
	//	this.borderradius = 0;
		this.padding =  0
		this.pickalpha = -1
		this.labelactivecolor = vec4("#303000")

		this.buttoncolor1 = "#3b3b3b"
		this.buttoncolor2 = "#3b3b3b"
		this.pressedcolor1 = "#505050"
		this.pressedcolor2 = "#505050"
		this.hovercolor1 = "#707070"
		this.hovercolor2 = "#707070"
		this.borderradius = 0
		this.borderwidth = 0
		this.fgcolor = "#d0d0d0"
		this.bgcolor = "white";
		this.margin = 0
		//this.alignself = "flex-start" 	
	})

	// newitemheading combines a few foldbuttons in to a full "item" in the tree
	define.class(this, 'newitemheading', view, function(){
		this.borderwidth = 0;
		this.attributes = {
			folded: false,
			select: Config({type:Event}),
			toggleclick: Config({type:Function})
		}
		this.flexwrap = "nowrap" ;
		this.padding =  0
		this.labelactivecolor = vec4("#303000")
		this.bordercolor= "transparent"
		this.buttoncolor1 = "#3b3b3b"
		this.buttoncolor2 = "#3b3b3b"
		this.pressedcolor1 = "#707070"
		this.pressedcolor2 = "#707070"
		this.hovercolor1 = "#505050"
		this.hovercolor2 = "#505050"
		this.cornerradius = 0
		this.fgcolor = "#f0f0f0"
		this.margin = 2
		this.bgcolor = "transparent"
		//this.alignself = "flex-start"
		
		this.render = function(){
			return [
				this.haschildren?this.outer.foldbutton({
					icon:this.folded? "chevron-right":"chevron-down", 
					padding: 2, 
					bg:0,
					click: this.toggleclick
				}):[], 
				//flatbutton({icon:this.folded?"arrow-right":"arrow-down",padding: 2, click: this.toggleclick}),
				this.outer.foldbutton({
					bg:0,
					text: this.text, 
					click:function(){
						this.emit('select',{node:this})
					}.bind(this)
				})
			];
		}
	});
	
	// the treeitem subclass contains 3 controls: a newitemheading, a set of treelines and an optional set of children treeitems in case the current node is expanded
	define.class(this, 'treeitem', view, function(){

		this.attributes = {
			text: "",
			item: {},
		}

		//this.flex = 1.0
		this.padding = vec4(0)
		this.fgcolor = vec4("black")
		this.bgcolor = "#3b3b3b";
		this.flexdirection = "row"
		this.flexwrap = 'nowrap'
		// Open/close this node
		this.toggle = function(){
			if (this.item){
				if (!this.item.collapsed) this.item.collapsed = true
				else this.item.collapsed = false
				//this.collapsed = this.item.collapsed;
				// a bottom level assign re-renders the item
				this.item = this.item
				//this.reRender()
			}
			//this.reLayout();
			//this.setDirty(true)
		}
		
		// build path for the current treeitem and call the outer selectclick handler
		this.processSelect = function(value){

			function walk(stack, node){
				if(stack === node) return [node]
				if(stack.children) for(var i = 0; i < stack.children.length; i++){
					var child = stack.children[i]
					var ret = walk(child, node)
					if(ret !== undefined){
						ret.unshift(stack)
						return ret
					}
				}
			}

			var path = walk(this.outer.data, this.item)

			this.outer.emit('select', {item:this.item, path:path})
		}
		
		this.atConstructor = function(){
			if (this.item){
				if (!this.item.collapsed) this.item.collapsed = false
			}
			//	this.text = this.item.name;
		}
		
		this.count = 0;
		
		this.flexdirection = "column";
		//this.width = 1;
	
		this.render = function(){
			//debugger;
			if (!this.item) return [label({text:""})];
			//this.collapsed;
			var res = [
				this.outer.newitemheading({
						haschildren: this.item.children && this.item.children.length, 
						folded: this.item.collapsed, 
						toggleclick: this.toggle.bind(this), 
						select: this.processSelect.bind(this),
						text:this.item.name,
						id:this.item.id
					})
			];
					
					
			if (this.item.collapsed == false)
			{
				if (this.item.children)
				{
					
					var childrenarray = this.item.children.map(function(m, i, thearray){return [
									this.outer.treeline({last:(i == thearray.length-1)?1:0, flexwrap:"nowrap",abg:{
											color:function(){
													return "yellow";
												}
											}, 
											padding:0, 
											flexdirection:"row" },
											view({bgcolor:"blue", width:14, alignself:"stretch",init:function(){
											//	console.log(this.size)
											} , 
											layout:function(){
												//console.log(this.layout)
											}}),
										this.outer.treeitem({item: m})										
									)
									]}.bind(this));
									
					res.push(view({
								bg:0, 
								flexdirection:"column" , 
								flexwrap:"nowrap"
							},
							childrenarray
							)
					);
				}
			}
			return res;
			
		}
	})
	
	// subclass to render the gridlines of the tree
	define.class(this, 'treeline', view, function(){
		//this.bgcolor = vec4("red");
		//this.flex = 1
		this.last = 0
		
		this.render = function(){
			return this.constructor_children;
		}
		this.alignself = "stretch";
		
		this.fgcolor = vec4("#808080")
		
		this.bgcolor = "#3b3b3b" 
		this.bg = {
			color: function(){
				
				var pos = mesh.xy * vec2(view.layout.width, view.layout.height)
				var center = 16
				var left = 7
				var field = shape.union(
					shape.box(pos, left, 0., 1., view.layout.height * (1. - view.last) + center * view.last),
					shape.box(pos, left, center, view.layout.width, 1.)
				)
				var edge = .4

				//if(mod(floor(gl_FragCoord.x) + floor(gl_FragCoord.y), 2.) > 0.){
					return mix(view.bgcolor,view.fgcolor, smoothstep(edge, -edge, field))
				//}
				return "red";
				return vec4(view.bgcolor)
			}
		}
	})
	
	this.clipping = true
	
	this.flexdirection = "row"
//	this.flex = 1

	this.alignself = "stretch"

	// the renderfunction for the treeview recursively expands using treeitem subclasses.
	this.render = function(){
		//var data;
		if(!this.dataset) return
		if (this.atBuildTree) this.data = this.atBuildTree(this.dataset.data)
		else{
			this.data = this.dataset.data
		}

		return [this.treeitem({item:this.data})]
	}

	
	var treeview = this.constructor;
	
	// Basic usage of the treeview control.
	this.constructor.examples = {
		Usage:function(){
			return [treeview({dataset:{name:"root", children:[{name:"child1"}]}})]
		}
	}
})