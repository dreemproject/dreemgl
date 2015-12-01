/* Copyright 2015 Teem2 LLC. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.  
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing, 
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, 
   either express or implied. See the License for the specific language governing permissions and limitations under the License.*/
// ruler class

define.class(function($containers$, view, $controls$, label, icon){

	// the foldcontainer shows/hides all its children when the top bar is clicked
	this.title = "folding thing"
	this.position ="relative"
	this.borderwidth = 1;
	this.borderradius = 1;
	this.margin = 2
	this.bg = 0;
	this.alignitems ="stretch"
	this.bordercolor = vec4("#c0c0c0")
	this.padding =0;
	this.flexdirection = "column"
	this.attributes = {
		// The current state of the foldcontainer. False = open, True = closed.
		collapsed: false,
		// The icon to use in the top left of the foldcontainer. See the FontAwesome cheatsheet for acceptable icon names.
		icon: 'times',
		// The main color from which the foldcontainer will build some gradients.
		basecolor: {type: vec4, value: vec4("#8080c0")}
	}
	// Function to change the open/closed state. Used by the click handler of the clickablebar.
	this.toggle = function(){
		this.collapsed = !this.collapsed;		
	}

	// subclass to lay out the clickable portion of the folding container 
	define.class(this, 'clickablebar', function(view){
		
		this.bggradient = function(a,b){	
			var fill = mix(col1, col2,  (a.y)/0.8);
			return fill;
		}
		
		// default click-handler - when not bound this write "nothing happens" to the console. 
		this.toggle = function(){console.log("nothing happens")}
		
		this.attributes = {
			title: {type:String},
			col1: {value:vec4("yellow")},
			col2: {value:vec4("yellow")}
		}

		this.position = "relative"

		this.bg = {
			color: function(){	
				var fill = mix(view.col1, view.col2,  (mesh.y)/0.8)
				return fill;
			}			
		}

		this.padding = 6
		// The clickable bar creates icon and a textfield children.
		this.render = function(){			
			return [icon({fontsize:16, icon:this.icon, fgcolor: "#303030" }), label({marginleft:5,fgcolor:"#303030", fontsize: 16, text:this.title,  bgcolor: "transparent" })];
		}

		this.statedefault = function(){
			this.col1 = vec4.vec4_mul_float32(vec4(this.parent.basecolor), 1.0)
			this.col2 = vec4.vec4_mul_float32(vec4(this.parent.basecolor), 1.2)
		}			
		
		this.stateover = function(){
			this.col2 = vec4.vec4_mul_float32_rgb(vec4(this.parent.basecolor), 1.1)
			this.col1 = this.parent.basecolor
		}

		this.stateclick = function(){
			this.col1 = vec4.vec4_mul_float32(vec4(this.parent.basecolor), 1.3)
			this.col2 = vec4.vec4_mul_float32(vec4(this.parent.basecolor), 1.0)
			this.outer.toggle()
		}
		
		this.init = this.statedefault
		this.mouseover = this.stateover
		this.mouseout = this.statedefault
		this.mouseleftdown = this.stateclick
		this.mouseleftup = this.statedefault
	})

	define.class(this, 'containerview', function(view){
		this.bg = {
			color:function(){
				return mix(view.bgcolor*1.7, vec4("white"), (mesh.y/8))
			}
		},
		this.padding = vec4(5,5,5,5),
		this.position = "relative"
	})
	
	// render the foldcontainer - using a clickablebar for the title nad a containerview for the children. 
	this.render = function(){
		
		this.bar = this.clickablebar({
			bgcolor:"red",
			borderwidth: this.borderwidth, 
			bordercolor: this.bordercolor,
			icon: this.icon, 
			title: this.title
		});
		
		this.bar.click = this.toggle.bind(this);
		var res = [this.bar];

		if (this.collapsed == false) {
			this.container = this.containerview({
			bgcolor: this.basecolor, 
				borderwidth: this.borderwidth, 
				bordercolor:this.bordercolor,  

			},
			this.constructor_children) 
			res.push(this.container)
		}
		this.children = [];
		
		return res;
	}

	
	var foldcontainer = this.constructor;

	this.constructor.examples = {
		BasicExample:function(){
			return [
				foldcontainer({icon:"flask", title:"folding thing", basecolor: "#90c0f0" } ,					
					label({text:"I can be folded away!", fgcolor:"black", bgcolor:"transparent", margin:vec4(10) })
				)
			]
		}
	}
});