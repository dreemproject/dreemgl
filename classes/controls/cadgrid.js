/* Copyright 2015 Teem2 LLC. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.  
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing, 
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, 
   either express or implied. See the License for the specific language governing permissions and limitations under the License.*/


define.class(function(view, label){
	// The CADGrid class provides a simple way to fill a frame with a classic engineering grid. 
	// todo:
	// - support zooming with incremental subdivision lines
	// - link up to 

	this.flex = 1;
	this.flexdirection = "column"
	this.alignitem = "stretch"
	this.alignself = "stretch"

	this.bgcolor = vec4("#d0d0d0")
	this.gridcolor = vec4("#ffffff")
	// CADGrid shader - used various floored modulo functions to find out if either a major or minor gridline is being touched.
	this.bg = {
		grid: function(a){
			if (floor(mod(a.x * view.layout.width,50. )) == 0. ||floor(mod(a.y * view.layout.height,50. )) == 0.)	{
				return mix(view.gridcolor, vec4(0.9,0.9,1.0,1.0), 0.5);
			}
			if (floor(mod(a.x * view.layout.width,10. )) == 0. ||floor(mod(a.y * view.layout.height,10. )) == 0.)	{
				return mix(view.gridcolor, vec4(0.9,0.9,1.0,1.0), 0.2);
			}
			return view.gridcolor;
		},
		color:function(){
			return grid(mesh.xy)
		}
	}

	var cadgrid = this.constructor
	
	// The CADGrid does not do anything to its children - plain passthrough
	this.render = function(){return this.constructor_children;}
	
	// Minimal usage example:
	this.constructor.examples = {
		Usage:function(){return cadgrid({width:200,height:200})}
	}
})