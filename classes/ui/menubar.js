/* Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others. 
   You may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 
   Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
   either express or implied. See the License for the specific language governing permissions and limitations under the License.*/
// Sprite class

define.class( function(require, $ui$, view, label, menubutton){	

	this.bgcolor = "#585858" 
	this.flexdirection = "row" 
	//this.dropshadowradius = 20;
	//this.dropshadowopacity = 0.3;
	//this.dropshadowhardness = 0;
	this.attributes = {
		errortext:"",
		infotext: "",
		statustext: "",
		menus:[]
	}	
	
	this.onstatustext = function(){
		if (this.statustext && this.statustext.length > 0)
		{
			this.setTimeout(function(){this.statustext = ""}.bind(this), 4000);
		}
	}
		
	this.render = function(){
		if (!this.menus) return []

		var mres = []
			
		for(var m in this.menus){
			var res = []
			var menu = this.menus[m]
			mres.push(
				menubutton({
					buttoncolor1:"#585858",
					buttoncolor2:"#585858",
					hovercolor1:"#737373",
					hovercolor2:"#737373",
					bold:false,
	
					borderwidth:0, 
					borderradius:8,
					margin:vec4(4,0,0,0),
					padding:5,  
					text:menu.name, 
					commands: menu.commands, 
					click: function(){
						// lets open a modal dialog
						this.screen.contextMenu(this.commands, this.layout.absx,this.layout.absy + this.layout.height);
					}
			}))
		}

		var labelres = []
		if (this.errortext && this.errortext.length > 0 && this.errortext !== "undefined"){
			labelres.push(label({margin:vec4(13,0,0,0), text:"ERROR", bold:true, fgcolor: "#e05f21", alignself:"center", bgcolor:NaN}));
			labelres.push(label({margin:vec4(3,0,3,0), text:this.errortext, fgcolor: "#e05f21", alignself:"center", bgcolor:NaN}));
		}
		if (this.infotext && this.infotext.length > 0 && this.infotext !== "undefined"){
			labelres.push(label({margin:vec4(13,0,0,0), text:"INFO",  bold:true, fgcolor: "white", alignself:"center", bgcolor:NaN}));
			labelres.push(label({margin:vec4(3,0,3,0),text:this.infotext, fgcolor: "white", alignself:"center", bgcolor:NaN}));
		}
		if (this.statustext && this.statustext.length > 0 && this.statustext !== "undefined"){
			labelres.push(label({margin:vec4(13,0,4,0),text:this.statustext, fgcolor: "#d0d0d0", alignself:"center", bgcolor:NaN}));
		}
		return view({bgcolor:NaN, flex:1, justifycontent:"space-between" }, view({bgcolor:NaN,alignself:"center"},mres), view({bgcolor:NaN,alignself:"center"},labelres));
	}
	
})