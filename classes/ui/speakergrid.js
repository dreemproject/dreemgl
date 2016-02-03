/* Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others. 
   You may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 
   Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
   either express or implied. See the License for the specific language governing permissions and limitations under the License.*/


define.class(function(view, label){

	this.flex = 1;
	this.flexdirection = "column"
	this.alignitem = "stretch"
	this.alignself = "stretch"
	
	this.attributes = {
		holerad : Config({type:float, value: 8}),
		spacing : Config({type:float, value: 0.60}),
		ring : Config({type:float, value: 0.2}),
		holecolor: Config({type:vec4, value:vec4("#202020"), meta:"color"}),
		glowcolor: Config({type:vec4, value:vec4("#505050"), meta:"color"}),
		edgecolor: Config({type:vec4, value:vec4("#101010"), meta:"color"})
	}
	
	this.bgcolor = vec4("white")

	// CADGrid shader - uses various floored modulo functions to find out if either a major or minor gridline is being touched.
	this.hardrect = {
		grid: function(a){
			
			return view.bgcolor;
		},
		pixtohex:function(p){
		
			var b0 = 2.0 / 3.0;
			var b1 = 0.0;
			var b2 = (-1.0 / 3.0);
			var b3 = sqrt(1.) / 3.0;
			
			var q = b0 * p.x + b1 * p.y;
			var r = b2 * p.x + b3 * p.y;
			return vec3(q, r, -q - r);
		},
		color:function(){
			var hex = pixtohex(gl_FragCoord.xy*(10./view.holerad));
			
			var hexmod = vec3(mod(hex.x,10.0)/10,mod(hex.y,10.0)/10,mod(hex.z,10.)/10.);
			
			var dist = vec2(0.5,0.5) - hexmod.yz;
			var l = length(dist);
			if (l<view.spacing*0.5) 
			{
				if (l>(view.spacing*0.5)*(1.-view.ring))				
				{
					var angle = atan(dist.y, dist.x);
					
					return mix(view.glowcolor,view.edgecolor, abs(angle/PI));;
				}
				return vec4("black");
			}
			
			var dist2 = vec2(0.5,0.5) - mesh.xy;
			
			return mix(view.glowcolor, view.edgecolor, length(dist2));
		}
	}

	var speakergrid = this.constructor
	
	// The CADGrid does not do anything to its children - plain passthrough
	this.render = function(){return this.constructor_children;}
	
	// Minimal usage example:
	this.constructor.examples = {
		Usage:function(){return speakergrid({width:200,height:200})}
	}
})