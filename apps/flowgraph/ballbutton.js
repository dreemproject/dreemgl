/* Copyright 2015 Teem2 LLC. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.  
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing, 
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, 
   either express or implied. See the License for the specific language governing permissions and limitations under the License.*/

define.class('$ui/button', function(require, $ui$, view, icon, treeview, cadgrid, label, button){

		this.attributes = {
			ballsize: 16,
			icon: ""
		}
		
		this.ballsize = function(){
			this.width = this.ballsize;
			this.height = this.ballsize;
			this.borderradius = this.ballsize/2;
		}
		
		this.borderradius = 8;
		this.borderwidth = 3;
		this.bordercolor = "#6c6c6c"
		this.bgcolor ="#00ffff";
		this.width = 16;
		this.height = 16;
		this.cursor = "pointer" 
		this.alignitems = "center";
		this.justifycontent = "center" ;
		this.bgcolor = function(){
			
			var hsv = vec4.toHSV(this.bgcolor);
			var lighter = vec4.fromHSV(hsv[0], hsv[1]*0.5, Math.min(1, hsv[2]*1.5), 1);
			var pressed = vec4.fromHSV(hsv[0], Math.min(hsv[1]*1.5, 1.0), Math.min(1, hsv[2]*1.8), 1);
			this.buttoncolor1 = this.bgcolor;
			this.buttoncolor2 = this.bgcolor;
			this.hovercolor1 = lighter;
			this.hovercolor2 = lighter;
			this.pressedcolor1 = lighter;
			this.pressedcolor2 = lighter;
		}
		
		this.justifycontent = "center"
		
		this.render =function(){
			if (this.icon && this.icon.length > 0)
			return [icon({icon:this.icon, alignself:"center", fgcolor:wire("this.parent.bordercolor") })];
			return [];
		}
		
	})