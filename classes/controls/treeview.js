/* Copyright 2015 Teem2 LLC. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.  
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing, 
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, 
   either express or implied. See the License for the specific language governing permissions and limitations under the License.*/

define.class(function($containers$, view, $, label, button, icon){

	// the treeview control - classic treeview with expandable nodes.
	this.attributes = {
		// the dataset to use for tree expansion
		dataset: Object,
		// the current selected value	
		select: Event
	}

	this.bgcolor = 'white'
	this.boundscheck = true
	this.mode = '2D'
	this.overflow ='scroll'

	// The fold button is a very very flat button. 
	define.class(this, 'foldbutton', function(button){
		this.borderwidth = 0
		this.padding =  0
		this.labelactivecolor = vec4("#303000")
		this.bordercolor= "transparent"
		this.buttoncolor1 =  vec4(1,1,1,0.0)
		this.buttoncolor2 =  vec4(1,1,1,0.0)
		this.pressedcolor1 = vec4(0,0,0,0.14)
		this.pressedcolor2 = vec4(0,0,0,0.05)
		this.hovercolor1 =   vec4(0,0,0,0.1)
		this.hovercolor2 =   vec4(0,0,0,0.1)
		this.borderradius = 0
		this.borderwidth = 0
		this.fgcolor = "black"
		this.labelclass = {
			bg:1,
			subpixel:true
		}
		this.margin = 0
		this.bg = NaN 
		
		//this.alignself = "flex-start" 	
	})

	// newitemheading combines a few foldbuttons in to a full "item" in the tree
	define.class(this, 'newitemheading', function($containers$, view){
		this.borderwidth = 0;
		this.attributes = {
			folded: false,
			select: Event
		}
		this.padding =  0
		this.labelactivecolor = vec4("#303000")
		this.bordercolor= "transparent"
		this.buttoncolor1 = vec4(1,1,1,0.0)
		this.buttoncolor2 = vec4(1,1,1,0.0)
		this.pressedcolor1 = vec4(0,0,0,0.14)
		this.pressedcolor2 = vec4(0,0,0,0.05)
		this.hovercolor1 = vec4(0,0,0,0.1)
		this.hovercolor2 = vec4(0,0,0,0.1)
		this.cornerradius = 0
		this.fgcolor = "black"
		this.margin = 0
		this.bgcolor = "transparent"
		//this.alignself = "flex-start"
		
		this.render = function(){
			return [
				this.haschildren?this.outer.foldbutton({
					icon:this.folded? "arrow-right":"arrow-down", 
					padding: 2, 
					click: this.toggleclick
				}):[], 
				//flatbutton({icon:this.folded?"arrow-right":"arrow-down",padding: 2, click: this.toggleclick}),
				this.outer.foldbutton({
					text: this.text, 
					click:function(){
						this.emit('select',{node:this})
					}.bind(this)
				})
			];
		}
	});
	
	// the treeitem subclass contains 3 controls: a newitemheading, a set of treelines and an optional set of children treeitems in case the current node is expanded
	define.class(this, 'treeitem', function($containers$, view){

		this.attributes = {
			text: "",
			item: Object,
		}

		//this.flex = 1.0
		this.padding = vec4(3)
		this.fgcolor = vec4("black")
		this.bg = 0
		this.flexdirection = "row"
	
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
		this.render = function(){
			//debugger;
			if (!this.item) return [label({text:"empty"})];
			//this.collapsed;
			//console.log("treeitem", this.item.name, this.item.children);
			return [view({flexdirection:"row", bg:0}, [
				view({bg:0, flexwrap:"none", flexdirection:"column" },
					this.outer.newitemheading({
						haschildren: this.item.children && this.item.children.length, 
						folded: this.item.collapsed, 
						toggleclick: this.toggle.bind(this), 
						select: this.processSelect.bind(this),
						text:this.item.name,
						id:this.item.id
					}),
					this.item.collapsed==false?
						view({bg:0, flexdirection:"row" },
							view({bg:0, flexdirection:"column" ,  padding: 0 },
								this.item.children?
								this.item.children.map(function(m, i, array){return [
									view({bg:0,flexdirection:"row" , padding: 0},
										this.outer.treeline({alignself:"stretch", height:32, width:20,last:i === array.length - 1?1:0}), 
										this.outer.treeitem({item: m})										
									)
									]}.bind(this))
								:[]
							)
						)
					:[]
				)
			])]
		}
	})
	
	// subclass to render the gridlines of the tree
	define.class(this, 'treeline', function($containers$, view){
		//this.bgcolor = vec4("red");
		//this.flex = 1
		this.last = 0
	//	this.alignself = "stretch"
		this.fgcolor = vec4(0.5, 0.5, 0.5, 1.)
		this.bgcolor = "#c0c0c0" 
		this.bg = {
			last: 0,
			color: function(){
				var pos = mesh.xy * vec2(view.layout.width, view.layout.height)
				var center = 18
				var left = 11
				var field = shape.union(
					shape.box(pos, left, 0., 1., view.layout.height * (1. - view.last) + center * view.last),
					shape.box(pos, left, center, view.layout.width, 1.)
				)
				var edge = .4

				//if(mod(floor(gl_FragCoord.x) + floor(gl_FragCoord.y), 2.) > 0.){
					return vec4(view.fgcolor.rgb, smoothstep(edge, -edge, field))
				//}
				return vec4(view.fgcolor.rgb, 0)
			}
		}
	})
	
	this.bordercolor = vec4("gray")
	this.cornerradius = 0
	this.clipping = true
	this.bgcolor = vec4("white")

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