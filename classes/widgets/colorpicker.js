/* Copyright 2015 Teem2 LLC. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.  
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing, 
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, 
   either express or implied. See the License for the specific language governing permissions and limitations under the License.*/


define.class(function(require, $containers$, view, $controls$, label, button, scrollbar){
	
	
	var Shader = this.Shader = require('$system/platform/$platform/shader$platform')
		
	this.attributes =  {
		value: {type: vec4, value: "white"}
		,fgcolor: {type: vec4, value: "white"}		
		,fontsize:{type: int, value: 15}
		,internalbordercolor: {type:vec4, value:vec4(1,1,1,0.6)}
		//,basehue: {type:float, value:0.5}
		,basesat: {type:float, value:0.8}
		,baseval: {type:float, value:0.5}
	}

	this.basehue = 0.5;
	this.bgcolor = vec4(0.0,0.0,0.0,0.4)
	this.flexdirection = "column";
	this.padding = vec4(10)
	this.minwidth = 200;
	this.maxwidth = 300;
	this.borderradius = 3
	this.borderwidth = 1
	this.bordercolor = this.internalbordercolor
	this.contrastcolor = vec4("black");

	this.internalbordercolor= function(){
		this.bordercolor = this.internalbordercolor		
	}

	this.updatecontrol = function(name, val){
		var c = this.find(name);
		if (c){
			c.currentcolor = this.value;
			c.contrastcolor = this.contrastcolor;
			c.basehue = this.basehue;
			c.basesat = this.basesat;
			c.baseval = this.baseval;
			newoff = val * (255);
			if (newoff < 0) newoff += 256;
			
			//console.log(name, val, newoff);
			
			c._offset = newoff
		}
		else{
//			console.log("control not found in colorpicker:", name);
		}
	}
	
	this.updatelabel = function(name, val){
		var c = this.find(name);
		if (c) c.text = val;
	}
	
	this.updateallcontrols = function(){
		this.updatecontrol("hsvider", this.basehue);
		this.updatecontrol("sslider", this.basesat);
		this.updatecontrol("lslider", this.baseval);
		this.updatecontrol("rslider", this.value[0]);
		this.updatecontrol("gslider", this.value[1]);
		this.updatecontrol("bslider", this.value[2]);
		this.updatecontrol("triangleview", this.basehue);		
		this.updatecontrol("colorcirclecontrol", this.basehue);		
	
		this.updatelabel("texth", Math.round(this.basehue * 360));
		this.updatelabel("texts", Math.round(this.basesat * 100));
		this.updatelabel("textv", Math.round(this.baseval * 100));
		this.updatelabel("textr", Math.round(this.value[0] * 255));
		this.updatelabel("textg", Math.round(this.value[1] * 255));
		this.updatelabel("textb", Math.round(this.value[2] * 255));
		this.updatelabel("texta", Math.round(this.value[3] * 255));
	}
	
	this.value = function(){
		this.createHSVFromColor();		
		this.contrastcolor = vec4.fromHSV(0, 0, 1 - this.baseval * (1 - this.basesat*0.5),0.8)
		this.updateallcontrols();
	}
	
	this.layout = function(){
		this.value = this.value;
		this.layout = function(){}
	}

	this.createColorFromHSV = function(){
		this._value = vec4.fromHSV(this.basehue, this.basesat, this.baseval);		
	}

	this.createHSVFromColor = function(){
		var res = vec4.toHSV(this.value);
		this.basehue = res[0];		
		this.basesat = res[1];		
		this.baseval  = res[2];		
	}
	
	this.setRed = function(r){
		this.value[0] = r;
		this.createHSVFromColor();
		this.updateallcontrols();	
	}
	
	this.setGreen = function(g){
		this.value[1] = g;
		this.createHSVFromColor();
		this.updateallcontrols();	
	}

	this.setBlue = function(b){
		this.value[2] = b;
		this.createHSVFromColor();
		this.updateallcontrols();	
	}

	this.setHueBase = function(h){
		this.basehue = h;
		this.createColorFromHSV(); 	
		this.updateallcontrols();		
	}
	this.setSatBase = function(s){
		this.basesat = s;
		this.createColorFromHSV(); 	
		this.updateallcontrols();		
	}
	
	this.setLumBase = function(s){
		this.baseval  = s;
		this.createColorFromHSV(); 	
		this.updateallcontrols();		
	}
	
	
	define.class(this, "customslider", function($containers$view){
		this.height = 19;
		
		this.attributes = {
				
			// hsv color for the left side
			hsvfrom:{type:vec3, value: vec3(0,1,0.5)},

			// hsv color for the right side
			hsvto:{type:vec3, value: vec3(1,1,0.5)},
			hsvhueadd:{float, value:0},
			
			basehue:{type:float, value: 0},
			currentcolor: {type:vec4, value: vec4("red")},
			contrastcolor: {type:vec4, value: vec4("white")},
			
			// Color of the draggable part of the scrollbar
			draggercolor: {type: vec4, value: vec4(1,1,1,0.8)},

			// Color of the draggable part of the scrollbar
			draggerradius: {type: float, value: 3},
			
			// Color when the mouse is hovering over the draggable part of the scrollbar
			hovercolor: {type: vec4, value: vec4("#8080c0")},
			
			// Color of the draggable part of the scrollbar while actively scrolling
			activecolor: {type: vec4, value: vec4("#8080c0")},
			
			// Is this a horizontal or a vertical scrollbar? 
			vertical: {type: Boolean, value: false},
			
			// Current start offset of the scrollbar. Ranges from 0 to total - page
			offset: {type:float, value:0},
			
			// Page size, in total
			page: {type:float, value:25},

			// total size. 
			total: {type:float, value:255+25},


			// set animation on bgcolor
			bgcolor: {duration: 1.0}
		}

		var scrollbar = this.constructor;

		this.page = function(){
			this.redraw()
		}

		this.offset = function(){
			this.redraw()
		}

		var mesh = vec2.array()
		mesh.pushQuad(0,0,0,1,1,0,1,1)

		this.bg = {
			offset: 0,
			page: 0.3,
		
			color: function(){
				// we have a rectangle
				var hsvamix = vec4(mix(view.hsvfrom, view.hsvto, mesh.x), 1.0)
				hsvamix.r += view.hsvhueadd * view.basehue;
				var bg =  colorlib.hsva(hsvamix);
			
				var rel = vec2(mesh.x*view.layout.width, mesh.y*view.layout.height)
				var offset = view.offset / view.total
				var page = view.page / view.total
				var edge = 0.1//min(length(vec2(length(dFdx(rel)), length(dFdy(rel)))) * SQRT_1_2, 0.001)
				var field = float(0)
				if(view.vertical){
					field = shape.roundbox(rel, 0.00 * view.layout.width, offset*view.layout.height,.9*view.layout.width, page*view.layout.height, view.draggerradius)
				}
				else{
					field = shape.roundbox(rel, offset * view.layout.width, 0.00*view.layout.height,page*view.layout.width, 1.0*view.layout.height, view.draggerradius)
				}
				var fg = vec4(view.contrastcolor.rgb, smoothstep(-edge, edge, 1-abs(-field-1.))*view.contrastcolor.a)
				var fg2 = vec4(view.currentcolor.rgb, smoothstep(0.,-edge, field)*view.currentcolor.a)
				//return vec4(vec3(sin(field*0.1))+ fg2.a*vec3(1,0,0) + fg.a*vec3(0,1,0), 1.)
				return mix(bg.rgba, mix(fg2.rgba, fg.rgba, fg.a), max(fg.a,fg2.a))
			},
			mesh: mesh,
			update:function(){},
			position: function(){
				return vec4(mesh.x * view.layout.width, mesh.y * view.layout.height, 0, 1) * view.totalmatrix * view.viewmatrix
			}
		}

		this.borderwidth = 0
		this.margin = 1
		this.bordercolor = vec4("#303060")		
		this.pressed = 0
		this.hovered = 0
			
		this.mouseover  = function(){
		}
		
		this.mouseout = function(){
		}
		
		this.mouseleftdown = function(start){
			// detect if we clicked not on the button
			if(this.vertical){
				var p = start[1] / this.layout.height
			}
			else{
				var p = start[0] / this.layout.width
			}
			var offset = this.offset / this.total
			var page = this.page / this.total
			if(p < offset){
				var value = clamp(p - 0.5 * page, 0, 1.-page) * this.total
				if(value != this.offset){
					this.offset = value
				}
			}
			else if (p > offset + page){
				var value = clamp(p - 0.5*page, 0, 1.-page) * this.total
				if(value != this.offset){
					this.offset = value
				}
			}
			var start_offset = offset//this.offset / this.total
			this.mousemove = function(pos){
				if(this.vertical){
					var p = start_offset + (pos[1] - start[1]) / this.layout.height
				}
				else{
					var p = start_offset + (pos[0] - start[0]) / this.layout.width
				}
				var value = clamp(p, 0, 1.-page) * this.total
				if(value != this.offset){
					this.offset = value
				}
			}
		}
		
		this.mouseleftup = function(){
			this.mousemove = function(){}
		}

		this.drawcount = 0;
	})

	
	define.class(this, 'colorcirclecontrol', function($containers$view){
		this.width = 200;
		this.height = 200;
		this.attributes = {
			ringwidth:{type:float, value: 0.3},
			hover:{type:float, value: 0, motion:"linear", duration: 0.1},
			
			
			basehue: {type:float, value:0.7},
			basesat: {type:float, value:0.7},
			baseval: {type:float, value:0.7},
			currentcolor: {type:vec4, value:"white"},
			contrastcolor: {type:vec4, value: vec4("white")},
			draggersize: {type:float, value: 8},
			
		}
		this.overcount = 0;
		this.updatehue = function(mousepos){
				var dx = mousepos[0] - this.layout.width/2;
				var dy = mousepos[1] - this.layout.height/2;
				dx /= this.layout.width/2;
				dy /= this.layout.height/2;
				var angle = Math.atan2(dy,dx);
				
				this.outer.setHueBase(-angle/ 6.283+ 0.25);
		}
		
		this.mouseleftdown = function(m){
			
			this.updatehue(m);
			
			this.mousemove = function(m){
				this.updatehue(m);
			};
		}
		this.mouseleftup = function(){
			this.mousemove = function(){};
		}
		this.mouseout = function(){
			this.overcount--;
			if (this.overcount < 0) this.overcount = 0;
			if (this.overcount == 0) this.hover = 0;
			if (this.overcount == 0) this.redraw();
			
		}
		this.mouseover = function(){
			if (this.overcount == 0) this.hover = 1;
			this.overcount++;
			this.redraw();
		}

		this.bg = function(){
			this.vertexstruct =  define.struct({		
				p:float,
				side: float
			})
			this.mesh = this.vertexstruct.array();
			this.drawtype = this.TRIANGLE_STRIP
				
			this.position = function(){
				uv = vec2(sin(mesh.p), cos(mesh.p))*(1-view.ringwidth + view.ringwidth*mesh.side);
				off = mesh.p / 6.283
				var rad = min(view.layout.width, view.layout.height)/2;
				pos = vec2(view.layout.width/2 + rad * uv.x, view.layout.height/2 + rad * uv.y)
				return vec4(pos, 0, 1) * view.totalmatrix * view.viewmatrix
			}
			
			this.color = function(){
				
				var f =  sin(mesh.side*3.1415);
				var edge = 1-pow(f,.50);
				var aaedge = pow(f,0.2);
				//return vec4(view.hover, edge,0,1);
				
				var color = colorlib.hsva(vec4(off, 1, 1, 1));
				
				
				
				var edgecolor = vec4(1,1,1,1);
				var mixed = mix(color, edgecolor, view.hover*edge);
				mixed.a *= aaedge;
				return mixed;
			}
			
			this.update = function(){
				var view = this.view
				var width = view.layout?view.layout.width:view.width
				var height = view.layout?view.layout.height:view.height
				var cx = width/2;
				var cy = height/2;
				var radius = Math.min(cx,cy);
				this.mesh = this.vertexstruct.array()
				var cnt = 100;
				for (var i = 0;i<cnt;i++) {
					this.mesh.push(i*6.283/(cnt-1), 0);
					this.mesh.push(i*6.283/(cnt-1), 1);
				}
			}
		};	
		
		define.class(this, 'fg', this.Shader, function(){

			this.vertexstruct = define.struct({		
				p:vec2,			
			})

			this.mesh = this.vertexstruct.array()

			this.update = function(){
				var view = this.view
				var width = view.layout? view.layout.width: view.width
				var height = view.layout? view.layout.height: view.height
				var cx = width/2;
				var cy = height/2;
				var radius = Math.min(cx,cy);
				this.mesh = this.vertexstruct.array()
				//this.mesh.push(view.basehue,  vec3(0,0.5,0),0);
				this.mesh.push(-1,-1);
				this.mesh.push( 1,-1);
				this.mesh.push( 1, 1);
				this.mesh.push(-1,-1);
				this.mesh.push( 1, 1);
				this.mesh.push(-1, 1);
			}
			
			this.position = function(){
				
				var huepos = vec2(sin(view.basehue * PI * 2 + mesh.p.x*.1),
							   cos(view.basehue* PI * 2 + mesh.p.x*.1)) * (mesh.p.y*0.15 + 0.85) * 100;
			
				pos = vec2(min(view.layout.width, view.layout.height))/2.0  ;
				pos += huepos;

				return vec4(pos, 0, 1) * view.totalmatrix * view.viewmatrix
			}
			
				
			this.color = function(){
				var D = abs(mesh.p.x);
				var alpha = vec4(view.contrastcolor.xyz,0);
				return mix(view.currentcolor, mix(view.contrastcolor, alpha, smoothstep(0.9, 1.0, D)), smoothstep(0.6, 1.0, D));
				//if (D<0.7) return view.currentcolor; 			
				//if (D<1.0) return view.contrastcolor;
				
				//return vec4(1.,1.,1.,0.);
			}
		
		})
		
		this.fg = 2;
	
	})
	
	define.class(this, 'triangleview', function($containers$view){
		this.width = 200;
		this.height = 200;
		
		this.attributes = {
			basehue: {type:float, value:0.7},
			basesat: {type:float, value:0.7},
			baseval: {type:float, value:0.7},
			currentcolor: {type:vec4, value:"white"},
			contrastcolor: {type:vec4, value: vec4("white")},
			draggersize: {type:float, value: 8},
			hover:{type:float, motion:"linear", duration:0.1, value:1}
		}
		
		define.class(this, 'fg', this.Shader, function(){
			this.vertexstruct = define.struct({		
				p:vec2,			
			})
			this.mesh = this.vertexstruct.array()
			this.update = function(){
				var view = this.view
				var width = view.layout?view.layout.width:view.width
				var height = view.layout?view.layout.height:view.height
				var cx = width/2;
				var cy = height/2;
				var radius = Math.min(cx,cy);
				this.mesh = this.vertexstruct.array()
				//this.mesh.push(view.basehue,  vec3(0,0.5,0),0);
				this.mesh.push(-1,-1);
				this.mesh.push( 1,-1);
				this.mesh.push( 1, 1);
				this.mesh.push(-1,-1);
				this.mesh.push( 1, 1);
				this.mesh.push(-1, 1);
			}
			
			this.position = function(){
				
				huepos = vec2(sin(view.basehue * PI * 2), cos(view.basehue* PI * 2)) * 0.7 * 100;

				var satdir =  vec2(sin((view.basehue - 1./4.) * PI * 2. ), cos((view.basehue - 1./4.)* PI * 2.)) * 0.7 * 100.0;
				var valdir = vec2(sin((view.basehue - 3./4.) * PI * 2.), cos((view.basehue - 3./4.)* PI * 2.)) * 0.7 * 100.0;
				
				huepos += (satdir - huepos   )* (1-view.basesat)  + (valdir - huepos ) * (1 - view.baseval);
			
				pos = vec2(min(view.layout.width, view.layout.height))/2  + mesh.p * view.draggersize;
				pos += huepos;

				return vec4(pos, 0, 1) * view.totalmatrix * view.viewmatrix
			}
			
				
			this.color = function(){
				var D = sqrt(dot(mesh.p, mesh.p));
				if (D<0.7) return view.currentcolor; 			
				if (D<1.0) return view.contrastcolor;
				
				return vec4(1.,1.,1.,0.);
			}
		
		})
		
		this.fg = 2;
		define.class(this, 'bg', this.Shader, function(){
			
			this.vertexstruct = define.struct({		
				p:float,			
				hsvoff: vec3,
				center: float
			})
			
			this.mesh = this.vertexstruct.array()
			this.drawtype = this.TRIANGLES
		
			this.position = function(){
				off = mesh.p / 6.283
				var rad = min(view.layout.width, view.layout.height)/2;
				uv = vec2(sin(mesh.p * PI * 2), cos(mesh.p* PI * 2)) * 0.7;
				pos = vec2(view.layout.width/2 + rad * uv.x, view.layout.height/2 + rad * uv.y)
				return vec4(pos, 0, 1) * view.totalmatrix * view.viewmatrix
			}
			
			this.color = function(){
				
				var edge = 1-pow(mesh.center,1.);
				var aaedge = pow(mesh.center,2.0);				
				var hsv = vec3(view.basehue,1,1) + mesh.hsvoff;
			
				var color = colorlib.hsva(vec4(hsv, 1));;
				var edgecolor = vec4(1,1,1,1);
				var mixed = mix(color, edgecolor, view.hover*edge);
				//mixed.a *= aaedge;
				return color;
			}
			
			this.update = function(){
				var view = this.view
				var width = view.layout?view.layout.width:view.width
				var height = view.layout?view.layout.height:view.height
				var cx = width/2;
				var cy = height/2;
				var radius = Math.min(cx,cy);
				this.mesh = this.vertexstruct.array()
				//this.mesh.push(view.basehue,  vec3(0,0.5,0),0);
				this.mesh.push(view.basehue,       vec3( 0, 0, 0),1);
				this.mesh.push(view.basehue + 1/4, vec3( 0,0,-1),1);
				this.mesh.push(view.basehue + 2/4, vec3( 0,-1,-1),1);
				
				this.mesh.push(view.basehue,       vec3( 0, 0, 0),1);
				this.mesh.push(view.basehue + 2/4, vec3( 0, -1,-1),1);
				this.mesh.push(view.basehue + 3/4, vec3( 0, -1, 0),1);
				
			}				
		})
	
	})
	
	this.colorcircle = 0;
	this.colortriangle = 0;
	
	
	define.class(this, 'colorarea', function($containers$view){
		this.bg ={
			color:function(){
					return vec4(mesh.x, mesh.y,0,1);
				}
			};
		this.width = 100;
		this.height = 100;		
	})
	
	
	this.render = function(){
		return [
			view({flexdirection:"column", flex:1,alignitems:"center", justifycontent:"center", bgcolor:"transparent"}
				
				,view({margin:10, bg:0, position:"relative", alignself:"center"}
					,view({bg:0, width:200, height:200, padding:3})
					,this.colorcirclecontrol({position:"absolute",width:200, height:200})
					,this.triangleview({basehue:this.basehue, position:"absolute"})
				)
				,view({bg:0, flexdirection:"column"}
					,this.customslider({name:"rslider",flex:1, hsvfrom:vec3(0,1,0), hsvto:vec3(0,1,0.5), offset:function(v){this.outer.setRed(v.value/255)}})
					,this.customslider({name:"gslider", flex:1, hsvfrom:vec3(0.33,1,0), hsvto:vec3(0.333,1,0.5), offset:function(v){this.outer.setGreen(v.value/255)}})
					,this.customslider({name:"bslider",height: 18, flex:1, hsvfrom:vec3(0.666,1,0), hsvto:vec3(0.666,1,0.5), offset:function(v){this.outer.setBlue(v.value/255)}})
					,view({bg:0}
						,label({flex:1, text:"rgb", fontsize:18, bg:0, fgcolor: this.fgcolor})
						,view({flex:1, bg:0},label({name:"textr",text:"100", fontsize:18, bg:0, fgcolor: this.fgcolor}))
						,view({flex:1, bg:0},label({name:"textg",text:"100", fontsize:18, bg:0, fgcolor: this.fgcolor}))
						,view({flex:1, bg:0},label({name:"textb",text:"100", fontsize:18, bg:0, fgcolor: this.fgcolor}))
						
					)
					,this.customslider({name:"hsvider",height: 18, flex:1, hsvfrom:vec3(0.0,this.basesat,this.baseval), hsvto:vec3(1,this.basesat,this.baseval), offset:function(v){this.outer.setHueBase(v.value/255)}})
					,this.customslider({name:"sslider",height: 18, flex:1, hsvhueadd: 1,  hsvfrom:vec3(0,0,this.baseval), hsvto:vec3(0,1,this.baseval), offset:function(v){this.outer.setSatBase(v.value/255)}})
					,this.customslider({name:"lslider",height: 18, flex:1, hsvhueadd: 1, hsvfrom:vec3(0,this.basesat,0), hsvto:vec3(0,this.basesat,1), offset:function(v){this.outer.setLumBase(v.value/255)}})
					,view({bg:0}
						,label({flex:1, text:"hsv", fontsize:18, bg:0, fgcolor: this.fgcolor})
						,view({flex:1, bg:0},label({name:"texth",text:"100", fontsize:18, bg:0, fgcolor: this.fgcolor}))
						,view({flex:1, bg:0},label({name:"texts",text:"100", fontsize:18, bg:0, fgcolor: this.fgcolor}))
						,view({flex:1, bg:0},label({name:"textv",text:"100", fontsize:18, bg:0, fgcolor: this.fgcolor}))
						
					)
				)
			)
			
			,view({ bg:0,justifycontent:"flex-end", flexdirection:"row", alignitems:"flex-end"}
				,view({ bg:0,bgcolor:"transparent", margin:2,borderwidth:1, borderradius:1, bordercolor:this.internalbordercolor,flex:1, padding:1}
					,label({bg:0, margin:vec4(10,5,0,0),text:"#", fgcolor:this.fgcolor, fontsize: this.fontsize})
					,label({bg:0,  margin:vec4(0,5,0,0), text:"ff00ff",  fgcolor:this.fgcolor, padding:vec4(20,2,2,2), fontsize: this.fontsize})
					,label({bg:0, margin:vec4(10,5,0,0),text:"alpha ",  fgcolor:this.fgcolor, fontsize: this.fontsize})
					,label({name:"texta", bg:0,  margin:vec4(0,5,0,0), text:"128",  fgcolor:this.fgcolor, padding:vec4(20,2,2,2), fontsize: this.fontsize})
				)
			)				
		]
		
	}
})