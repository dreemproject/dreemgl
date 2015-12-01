/* Copyright 2015 Teem2 LLC. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.  
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing, 
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, 
   either express or implied. See the License for the specific language governing permissions and limitations under the License.*/


define.class(function($containers$, view, $controls$, label){
	// splitcontainer adds dragbars between nodes to make all the nodes resizable. 
	
	// should the splitter bars be introduced horizontally or vertically? 
	this.attributes = {
		vertical: {type: Boolean, value: true},
		splitsize: {type: float, value: 8},
		minimalchildsize: {type: float, value: 20},
		splittercolor: {type: vec4, value: vec4("#404050")},
		hovercolor: {type: vec4, value: vec4("#5050a0")},
		activecolor: {type: vec4, value: vec4("#7070a0")}
	}

	this.flex = 1.0
	this.flexdirection = this.vertical?"column":"row"
	this.position = "relative" 
	this.borderwidth = 0
	this.bordercolor = vec4("#303060")
	
	this.vertical = function(){
		this.flexdirection = this.vertical?"column":"row" ;
	}
	
	// the visual class that defines the draggable bar between the resizable children
	define.class(this, 'splitter', function(view){
		
		this.attributes = {
			firstnode: {type: int, value: 0}
		}
	
		this.bgcolor = vec4("gray");
		this.alignitem = "stretch";
		this.attributes = {
			vertical: {type: Boolean, value: false},
			splitsize: {type: float, value: 10},
			splittercolor: {type: vec4, value: vec4("#404050")},
			hovercolor: {type: vec4, value: vec4("#5050a0")},
			activecolor: {type: vec4, value: vec4("#7070a0")}
		}
		this.flex = 0

		this.mouseover  = function(){
			//this.setDirty(true);
		}

		this.mouseout  = function(){
			//this.setDirty(true);
		}

		this.mouseleftdown = function(pos){

			var dragstart = this.parent.localMouse()

			this.pressed++
			//var dragstart = {x: this.screen.mouse.x, y:this.screen.mouse.y}
			
			var flexstart = {
				left: this.parent.children[this.firstnode].flex, 
				right: this.parent.children[this.firstnode+2].flex,
				
				leftwidth: this.parent.children[this.firstnode].layout.width, 
				leftheight: this.parent.children[this.firstnode].layout.height,
				
				rightwidth: this.parent.children[this.firstnode+2].layout.width,
				rightheight: this.parent.children[this.firstnode+2].layout.height
			}

			this.mousemove = function(pos){
				var dragnow = this.parent.localMouse()
				var dx = dragnow[0] - dragstart[0]
				var dy = dragnow[1] - dragstart[1]

				var leftnode = this.parent.children[this.firstnode]
				var rightnode = this.parent.children[this.firstnode + 2]

				var f1 = flexstart.left
				var f2 = flexstart.right

				var totf = f1 + f2

				if (this.vertical){
					var h1 = flexstart.leftheight
					var h2 = flexstart.rightheight
					
					var hadd = h1 + h2
					h1 += dy
					h2 -= dy
					if (h1 < this.parent.minimalchildsize || h2 < this.parent.minimalchildsize) return
					var f1n = h1 / (hadd)
					var f2n = h2 / (hadd)
					leftnode.flex = f1n * totf
					rightnode.flex = f2n* totf
				}
				else{
					var w1 = flexstart.leftwidth
					var w2 = flexstart.rightwidth
					
					var wadd = w1 + w2
					w1 += dx
					w2 -= dx
					if (w1 < this.parent.minimalchildsize || w2 < this.parent.minimalchildsize) return
					var f1n = w1 / (wadd)
					var f2n = w2 / (wadd)
					leftnode.flex = f1n * totf
					rightnode.flex = f2n * totf
				} 
				this.parent.redraw()
				// lets trigger layout dirty...
				/*
				leftnode.setDirty(true);
				leftnode.reLayout();
				rightnode.reLayout();
				rightnode.setDirty(true);
				this.setDirty(true);
				*/
			}.bind(this)

			//this.setDirty(true);
		}

		this.mouseleftup = function(){
			//this.pressed--;
			this.mousemove = function(){};
			//this.setDirty(true);			
		}
		/*
		this.atDraw = function(){
			if (this.hovered > 0){
				if (this.pressed > 0){
					this.bg_shader.color1 = this.activecolor;
				}else{
					this.bg_shader.color1 = this.hovercolor;
				}
			}else{
				this.bg_shader.color1 = this.splittercolor;
			}
		}
		*/
		this.render = function(){
			if (this.vertical){
				this.height = this.splitsize
				this.width = NaN
			}
			else{
				this.width = this.splitsize
				this.height = NaN
			}
		}	
	})
	
	this.render = function(){
		if (this.constructor_children.length > 1){
			var children = []
			children.push(view({clipping: true, flex: this.constructor_children[0].flex},this.constructor_children[0]));

			for (var i = 1; i < this.constructor_children.length; i++){

				children.push( this.splitter({
					vertical: this.vertical,
					firstnode: (i-1)*2, 
					splitsize: this.splitsize, 
					splittercolor: this.splittercolor, 
					hovercolor: this.hovercolor, 
					activecolor: this.activecolor
				}))

				children.push(view({
					clipping: true, 
					flex: this.constructor_children[i].flex 
				},this.constructor_children[i]))				

			}
			return children
		}
		else {
			return this.constructor_children;
		}
	}

	var splitcontainer = this.constructor
	
	// Basic usage of the splitcontainer
	this.constructor.examples = {
		Usage:function(){ return [
			splitcontainer({vertical: false, margin: 4, flex: 1.0, borderwidth:2, bordercolor: "darkblue", padding: vec4(2) },
			label({flex: 0.2, fontsize: 26, text:"A", bgcolor: "transparent" ,multiline: true, align:"center" , fgcolor:"black", margin: 2})
			,label({flex: 0.2, fontsize: 26, text:"B", bgcolor: "transparent" ,multiline: true, align:"center" ,fgcolor:"black", margin: 2})
			,label({flex: 0.2, fontsize: 26, text:"C", bgcolor: "transparent" ,multiline: true, align:"center" , fgcolor:"black",margin: 2})
			,label({flex: 0.2, fontsize: 26, text:"D", bgcolor: "transparent" ,multiline: true, align:"center" , fgcolor:"black",margin: 2})
		)]}
	}

})