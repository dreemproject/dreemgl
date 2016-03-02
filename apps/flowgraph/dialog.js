/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
   Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and limitations under the License.*/

define.class('$ui/view', function(require, $ui$, view, icon, label){
	this.attributes = {
		title: Config({type:String, value:"Untitled"}),
		fontsize: Config({type:float, value:12, meta:"fontsize"})
	}

	this.padding = 0;
	this.margin = 140;
	this.borderradius =  vec4(10,10,1,1);
	this.bgcolor = vec4("#4e4e4e");
	this.flex = 1;
	this.maxwidth = 500;

	this.flexdirection ="column"
	this.dropshadowopacity = 0.4;
	this.padding=4;
	this.dropshadowhardness=0,
	this.dropshadowradius=20
	this.dropshadowoffset=vec2(9,9);

	this.render = function(){
		return [
				view({margin:vec4(1,1,2,0),bgcolor:"#4e4e4e", borderwidth:0,borderradius:vec4(10,10,1,.1),padding:vec4(10,2,10,2)},
					label({font: require('$resources/fonts/opensans_bold_ascii.glf'),margin:5, text:this.title, bgcolor:NaN, fontsize:this.fontsize, fgcolor: "white" })
				),
				view({padding:2, bgcolor:"#707070"})

			,this.constructor_children
		];
	}
})
