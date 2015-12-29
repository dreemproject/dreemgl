/* Copyright 2015 Teem2 LLC. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.  
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing, 
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, 
   either express or implied. See the License for the specific language governing permissions and limitations under the License.*/

define.class('$ui/view', function(require, $ui$, view, icon, treeview, cadgrid, label, button, $$, ballbutton){

			
	this.cursor = "move";
	this.position = "absolute" ;
	this.bgcolor = vec4("#6c6c6c" )
	this.padding = 0;
	this.borderradius = 10;
	this.borderwidth = 2;
	this.bordercolor = vec4("#6c6c6c")
	
	this.attributes = {
		pos: Config({persist: true}),
		inputattributes: Config({type:Object, value:["color"]}),
		outputattributes: Config({type:Object, value:["clicked","something"]}),
		title: Config({type:String, value:"Untitled"}),
		snap: Config({type:int, value:1}),
		bordercolor: Config({motion:"linear", duration: 0.1}),
		borderselected: Config({type:float, value:0, motion:"linear", duration: 0.1}),
		focusbordercolor: Config({motion:"linear", duration: 0.1, type:vec4, value:"#d0d0d0", meta:"color"}),
		hoverbordercolor: Config({motion:"linear", duration: 0.1, type:vec4, value:"#e0e0e0", meta:"color"}),
		inselection : Config({type:boolean, value:false})
	}
		
	this.tooltip = 'issablock'

		
	this.bordercolorfn = function(pos){
		var check = (int(mod(0.34*( gl_FragCoord.x + gl_FragCoord.y ),2.)) == 1)?1.0:0.0;		
		return mix(bordercolor, mix(vec4(focusbordercolor.xyz*.8,1.0), focusbordercolor, check), borderselected);
		return vec4(check);
	}
		
	this.inselection = function(){	
		this.updatecolor();
	}
	
	this.updatecolor = function(){	
			if (this._inselection) {
				this.bordercolor = this.focusbordercolor;
				this.borderselected = 1;
			}
			else{
				this.borderselected = 0;
				if (this.over){
					this.bordercolor = this.hoverbordercolor;
				}
				else{
					this.bordercolor = this.neutralbordercolor;
				}
			}
		}
		
		
	this.move = function(x,y) {
		var nx = this.pos[0] + x;
		var ny = this.pos[1] + y;
		if (nx<0) nx = 0;
		if (ny<0) ny = 0;
		this.pos = vec2(Math.round(nx),Math.round(ny));
		var fg = this.find("flowgraph")
		fg.setActiveBlock(this);
		fg.updateconnections();
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
		fg.removeBlock(this);
	}
	
	this.keydown = function(v){			
		this.screen.defaultKeyboardHandler(this, v);
	}
	
	this.init = function(){
		this.neutralbordercolor = this.bordercolor;
		this.find("flowgraph").allblocks.push(this);	
	}
	
	this.destroy = function(){
		fg = this.find("flowgraph");
		if (fg){
			var index = fg.allblocks.indexOf(this);
			if (index > -1) fg.allblocks.splice(index, 1);
		}
	}
		
	this.setupMove = function(){
		this.startx = this.pos[0];
		this.starty = this.pos[1];	
	}
	
	this.updateMove = function(dx, dy, snap){
		var x = Math.floor((this.startx+dx)/snap)*this.snap;
		var y = Math.floor((this.starty+dy)/snap)*this.snap;	
		this.pos = vec2(x,y);	
	}
	
	this.mouseleftdown = function(p){
		this.moveToFront()
		var props = this.find("mainproperties");
		if (props) props.target = this.name;
		
		var	fg = this.find("flowgraph");
		
		if (!this.screen.keyboard.shift && !fg.inSelection(this)){
			fg.clearSelection();
		}
		if (this.screen.keyboard.shift && fg.inSelection(this)){
			fg.removeFromSelection(this);
			fg.updateSelectedItems();
	
			return;
		}
		fg.setActiveBlock(this);
		fg.updateSelectedItems();
		
		
		this.startposition = this.parent.localMouse();
		fg.setupSelectionMove();
		this.mousemove = function(evt){
			p = this.parent.localMouse()
			var dx = p[0] - this.startposition[0];
			var dy = p[1] - this.startposition[1];
	
			var	fg = this.find("flowgraph");
			fg.moveSelected(dx,dy);
			
			
		}.bind(this);
	}
	
	this.mouseleftup = function(p){
		var x = Math.floor(this.pos[0]/this.snap)*this.snap;
		var y = Math.floor(this.pos[1]/this.snap)*this.snap;
		this.pos = vec2(x,y);
		this.redraw();
		this.relayout();
		
		this.mousemove = function(){};
	}
	
	this.over = false;
	
	this.mouseover = function(){
		this.over = true;
		this.updatecolor();
	}
		
	this.mouseout = function(){
		this.over = false;
		this.updatecolor();
	}

		
	this.flexdirection = "column"

	this.layout = function(){
		var ab = this.findChild("addbuttons");
		if (ab){
			ab.y = this._layout.height + 2;
		}
	}
	
	define.class(this, "inputbutton", function($ui$, view, label){
		this.bg = false;
		this.attributes = {
			name:"thing"
		}
		
		this.clicked = function(){
			var	bl = this.parent.parent.parent;
			var	fg = this.find("flowgraph");
			fg.setconnectionendpoint(bl.name, this.name);
		
		}	

		this.render =function(){
			return [
				ballbutton({bgcolor:this.bgcolor, mouseleftdown:function(){this.clicked();}.bind(this), alignself:"center"}),
				label({text:this.name, bg:false, alignself:"center"})
			]
		}
	})
	
	define.class(this, "outputbutton", function($ui$, view, label){
		this.bg = false;
		this.attributes = {
			name:"thing"		}
		
		this.clicked = function(){					
			var	bl = this.parent.parent.parent;
			var	fg = this.find("flowgraph");
			fg.setconnectionstartpoint(bl.name, this.name);			
		}
		
		this.render =function(){
			return [
				label({text:this.name, bg:false, alignself:"center"}),
				ballbutton({bgcolor:this.bgcolor, mouseleftdown:function(){this.clicked();}.bind(this), alignself:"center"})				
			]
		}
	})
	
	this.render = function(){
		return [
			label({text:this.title, bg:0, margin:vec4(6,0,4,0)})
			,view({bgcolor:"#343434", height: 40,width:140, flex: 1, margin:1})
			,view({bg:false, width:140, flex: 1, justifycontent:"space-between"}
			,view({bg:false, position:"relative", x:-8,alignself:"flex-start", flexdirection:"column"}
			,this.inputbutton({name:"input 1", bgcolor:"#ff00ff"})
			,this.inputbutton({name:"input 2", bgcolor:"#800000"})
			,this.inputbutton({name:"input 3", bgcolor:"#ffff00"})
			)
			,view({bg:false, position:"relative", x:8,alignself:"flex-start", flexdirection:"column"}
			,this.outputbutton({name:"output 1", bgcolor:"#a78f68" })
		
			,this.outputbutton({name:"output 2", bgcolor:"#ff8000"})
			)
			)
			,view({name:"addbuttons",flexdirection:"row", position:"absolute",alignitems:"stretch",width:140, bg:0, justifycontent:"space-between"}
				,button({icon:"plus"})
				,button({icon:"plus"})
			)
		]
	}
})
