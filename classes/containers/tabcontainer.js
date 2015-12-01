/* Copyright 2015 Teem2 LLC. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.  
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing, 
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, 
   either express or implied. See the License for the specific language governing permissions and limitations under the License.*/
// ruler class

define.class(function(view, button, label){
	// Create a tabcontrol - 1 tab for each instance-child. Each instance-child can provide a title and an icon property which will be used in the activation button for the tab.

	this.attributes = {
		// The currently active tab. 
		activetab, {type: int, value: 0},
		color: {type: vec4, value: vec4("#404050")},
		hovercolor: {type: vec4, value: vec4("#5050a0")},
		activecolor: {type: vec4, value: vec4("#7070a0")}
	}

	// The currently active tab. 
	this.persists("activetab")
	
	this.flex = 1;
	
	this.buttoncolor1= vec4("#b0b0b0")
	this.buttoncolor2= vec4("#c0c0c0")
	this.hovercolor1= vec4("#8080c0")
	this.hovercolor2=vec4("#3b5898")
	this.pressedcolor1= vec4("#3b5898")
	this.pressedcolor2= vec4("#637aad")

	define.class(this, "tabbutton", function (button){
		this.margin = 0
		this.marginleft = 6
		this.borderwidth = 0
	})
	
	var tabbuttonprox = this.tabbutton;
	this.flexwrap= ""
	this.flexdirection = "column"
	this.position = "relative"
	this.flexdirection = "column"
	
	this.render = function(){		
		var myparent = this;
		if (this.constructor_children.length > 1){		
			this.bar =[ view({flexdirection:"row", bgcolor: "#f0f0f0", borderwidth:1, cornerradius: 0, bordercolor: "#c0c0c0"  },this.constructor_children.map(
				function(m,id)
					{						
							return tabbuttonprox({tabid: id, tabdebug:m.tabdebug, target: myparent, text: m.tabname, icon: m.tabicon? m.tabicon:"", click: function(){this.target.activetab = this.tabid}});
					})), view({flex: 1, borderwidth: 2,cornerradius: 0,  bordercolor: "#b0b0b0" ,padding: 4, alignself: "stretch"}, this.constructor_children[this.activetab])];			
			return this.bar;						
		}else{
			return [];// this.constructor_children;
		}
	}

	var tabcontrol = this.constructor
	this.constructor.examples = {
		Usage:{
			return [
				tabcontrol({}
					,label({tabicon:"flask", tabname:"Flask",  text: "I am on tab 1 - my icon is a flask!", fgcolor: "blue", fontsize: 20})
					,label({tabicon:"gears",tabname:"Gears",text: "I am on tab 2 - my icon is a gearbox!", fgcolor: "red", fontsize: 20})
					,label({tabicon:"briefcase",tabname:"Briefcase",text: "I am on tab 3 - my icon is a briefcase!", fgcolor: "green", fontsize: 20})
					,label({tabicon:"battery-full",tabname:"Battery",text: "I am on tab 4 - my icon is a battery!", fgcolor: "yellow", fontsize: 20})
				)
			]
		}
	}
})