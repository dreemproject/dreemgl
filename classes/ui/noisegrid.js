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
		holecolor: Config({type:vec4, value:vec4("#202020"), meta:"color"}),
		glowcolor: Config({type:vec4, value:vec4("#404040"), meta:"color"}),
		edgecolor: Config({type:vec4, value:vec4("#5b5b5b"), meta:"color"})
	}
	
	//this.bgcolor = vec4("white")

	// CADGrid shader - uses various floored modulo functions to find out if either a major or minor gridline is being touched.
	this.bgcolorfn = function(a){
			
			var dist2 = vec2(0.5,1.0) - a.xy;
			var N = noise.cheapnoise(gl_FragCoord.xy*0.08)*0.3;
			return mix(glowcolor, edgecolor, N+ 1.0-length(a.y));
		}
		
})