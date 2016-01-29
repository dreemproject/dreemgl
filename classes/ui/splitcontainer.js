/* Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
 You may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
 either express or implied. See the License for the specific language governing permissions and limitations under the License.*/

 define.class(function($ui$, view, label){
 	// Splitcontainer adds dragbars between nodes to make all the nodes resizable.

 	// should the splitter bars be introduced horizontally or vertically?
 	this.attributes = {
 		// wether the splitcontainer is vertical or not
 		direction: Config({type: Enum("horizontal", "vertical"), value:"vertical"}),
 		// set the width (or height) of the splitter bar
 		splitsize: Config({type: float, value: 8}),
 		// the minimum size of a child controlled by the splitter
 		minimalchildsize: Config({type: float, value: 20}),
 		// the color of the splitter bar
 		splittercolor: Config({type: vec4, value: vec4("#484848")}),
 		// color of splitter bar on hover
 		hovercolor: Config({type: vec4, value: vec4("#707070")}),
 		// color of the splitter bar when dragging it
 		activecolor: Config({type: vec4, value: vec4("#7070a0")})
 	}

 	this.bg = false;
 	this.flex = 1.0
 	this.flexdirection = "row";
 	this.position = "relative"
 	this.borderwidth = 0
 	this.bordercolor = vec4("#303060")

 	this.direction = function(){
 		this.flexdirection = this.direction=="horizontal"?"column":"row" ;

 		}

 	// the visual class that defines the draggable bar between the resizable children
 	define.class(this, 'splitter', function(view){

 		this.attributes = {
 			firstnode: Config({type: int, value: 0})
 		}

 		this.bgcolor = vec4("#737373");
 		this.alignitem = "stretch";
 		this.borderradius = 3;
 		this.attributes = {
 			vertical: Config({type: Boolean, value: false}),
 			splitsize: Config({type: float, value: 6}),
 			splittercolor: Config({type: vec4, value: vec4("#404050")}),
 			hovercolor: Config({type: vec4, value: vec4("#f050a0")}),
 			bgcolor: Config({duration:0.1, motion:"linear"}),
 			activecolor: Config({type: vec4, value: vec4("#7070a0")})
 		}
 		this.flex = 0
 		this.neutralcolor = this.bgcolor;

    this.pointerover  = function(){
 			this.bgcolor = this.hovercolor;
 		}
 		this.pointerout  = function(){
 			this.bgcolor = this.neutralcolor;
 		}

 		this.pointerstart = function(){
 			this._flexstart = {
 				left: this.parent.children[this.firstnode].flex,
 				right: this.parent.children[this.firstnode+2].flex,

 				leftwidth: this.parent.children[this.firstnode].layout.width,
 				leftheight: this.parent.children[this.firstnode].layout.height,

 				rightwidth: this.parent.children[this.firstnode+2].layout.width,
 				rightheight: this.parent.children[this.firstnode+2].layout.height
 			}
 		}

    this.pointermove = function(event){
      var leftnode = this.parent.children[this.firstnode]
      var rightnode = this.parent.children[this.firstnode + 2]

      var f1 = this._flexstart.left
      var f2 = this._flexstart.right

      var totf = f1 + f2

      if (this.vertical){
        var h1 = this._flexstart.leftheight
        var h2 = this._flexstart.rightheight

        var hadd = h1 + h2
        h1 += event.value[0].delta[1]
        h2 -= event.value[0].delta[1]
        if (h1 < this.parent.minimalchildsize || h2 < this.parent.minimalchildsize) return
        var f1n = h1 / (hadd)
        var f2n = h2 / (hadd)
        leftnode.flex = f1n * totf
        rightnode.flex = f2n* totf
      } else {
        var w1 = this._flexstart.leftwidth
        var w2 = this._flexstart.rightwidth

        var wadd = w1 + w2
        w1 += event.value[0].delta[0]
        w2 -= event.value[0].delta[0]
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
      */
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
 		this.bg = {
 			acolor: function(){

 				if (view.vertical )
 				{
 					var yy = mesh.y*view.layout.height;
 					var ymix = yy<1.0? 1.: ((yy>view.layout.height-1.0)?1.:0.0)
 					return mix(view.bgcolor, "black", ymix);
 				}
 				var xx = mesh.x*view.layout.width;
 				var xmix = xx<1.0? 1.: ((xx>view.layout.width-1.0)?1.:0.0)
 				return mix(view.bgcolor, "black",xmix);
 			}
 		}
 		this.vertical = function(){
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
 			children.push(view({bg:0,clipping: true, flex: this.constructor_children[0].flex},this.constructor_children[0]));

 			for (var i = 1; i < this.constructor_children.length; i++){

 				children.push( this.splitter({
 					vertical: this.direction=="horizontal",
 					cursor: this.direction=="horizontal"?'ns-resize':'ew-resize',
 					firstnode: (i-1)*2,
 					splitsize: this.splitsize,
 					splittercolor: this.splittercolor,
 					hovercolor: this.hovercolor,
 					activecolor: this.activecolor
 				}))

 				children.push(view({
 					bg:false,
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
 			splitcontainer({alignself:'stretch', vertical: false, margin: 4, flex: 1.0, borderwidth:2, bordercolor: "darkblue", padding: vec4(2) },
 			label({flex: 0.2, fontsize: 26, text:"A", bgcolor: "transparent" ,multiline: true, align:"center" , fgcolor:"black", margin: 2})
 			,label({flex: 0.2, fontsize: 26, text:"B", bgcolor: "transparent" ,multiline: true, align:"center" ,fgcolor:"black", margin: 2})
 			,label({flex: 0.2, fontsize: 26, text:"C", bgcolor: "transparent" ,multiline: true, align:"center" , fgcolor:"black",margin: 2})
 			,label({flex: 0.2, fontsize: 26, text:"D", bgcolor: "transparent" ,multiline: true, align:"center" , fgcolor:"black",margin: 2})
 		)]}
 	}

})
