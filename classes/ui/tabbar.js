/* Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
 You may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
 either express or implied. See the License for the specific language governing permissions and limitations under the License.*/
// Sprite class

define.class("$ui/view", function($ui$, button){
// Presents a bar of configurable tabs.  [example](http://localhost:2000/examples/tabbar).

	this.attributes = {

		// Tab definitions.  This can be a simple list of strings or and array of more complicated
		// objects that describe tab behavior in detail.
		tabs:Config({type:Array, value:[]}),

		// Color of default tabs, can be overridden in style
		tabcolor: Config({value:vec4(0,0,0,1), meta:"color" }),
		activetabcolor: Config({value:vec4(1,1,1,1), meta:"color" }),

		textcolor: Config({value:vec4(1,1,1,1), meta:"color" }),
		activetextcolor: Config({value:vec4(0,0,0,1), meta:"color" }),

		tabclass:undefined,

		// Current tab selection
		activetab:0
	};

	this.tooldragroot = true;
	this.flexdirection = "row";
	this.bgcolor = NaN;

	this.style = {
		button: {
			flex: 1,
			justifycontent:"center",
			alignitems:"center",
			bgcolor:this.tabcolor,
			borderradius:0,
			arrowheight:5.0,
			showarrow:true,
			bgcolorfn:function(p) {
				var atx = p.x * layout.width;
				var aty = p.y * layout.height;
				if (showarrow && aty < arrowheight && (atx + aty < layout.width * 0.5 || atx - aty > layout.width * 0.5)) {
					return "transparent"
				} else {
					return bgcolor;
				}
			}
		},
	    button_folder: {
			y:1,
			flex: 0,
			bgcolor:this.tabcolor,
			borderradius:vec4(15,15,0,0),
			bgcolorfn:function(p) { return bgcolor; }
		}
	};

	this.render = function() {
		var tabs = [];
		if (this.tabs) {
			for (var i=0;i<this.tabs.length;i++) {
				var tabdef = this.tabs[i];
				var active = i === this.activetab;

				var tab = button({
					textcolor: active ? this.activetextcolor : this.textcolor,
					textactivecolor: active ? this.activetextcolor : this.textcolor,
					bgcolor: active ? this.activetabcolor : this.tabcolor,
					buttoncolor1:"transparent",
					buttoncolor2:"transparent",
					hovercolor1:"transparent",
					hovercolor2:"transparent",
					pressedcolor1:"transparent",
					pressedcolor2:"transparent",
					borderwidth:0,
					class:this.tabclass,
					tabindex:i,
					click:function(ev,v,o) {
						this.activetab = o.tabindex;
					}.bind(this)
				});

				if (typeof(tabdef) === "string") {
					tab.text = tabdef
				} else {
					for (var prop in tabdef) {
						if (tabdef.hasOwnProperty(prop)) {
							tab[prop] = tabdef[prop]
						}
					}
				}

				tabs.push(tab);
			}
		}

		return tabs;
	};

	var tabbar = this.constructor;
	this.constructor.examples = {

		Usage: function() {
			return [
				tabbar({tabs:["one", "two", "three"], onselection:function(ev,tab,bar) {
					if (tab) {
						console.log('Selected', tab.text)
					}
				}})
			]
		},

		Advanced: function() {

			var selectionhandler = function(tab,state) {
				tab.parent.defaultselectionhandler(tab);
				alert("custom logic for " + state + " handler can go here")
			};

			return [
				tabbar({tabs:[
					{
						class:"folder",
						normal:{
							icon:"gear",
							fgcolor:"gray"
						},
						hover:{
							fgcolor:"lightblue"
						},
						active:{
							fgcolor:"lightgreen"
						},
						selected:{
							fgcolor:"red"
						},
						disabled:{
							fgcolor:"pink"
						}
					},
					{
						class:"folder",
						label:"two",
						bgcolor:"#114",
						bold:true,
						selected:{ on:selectionhandler }
					},
					{
						class:"folder",
						label:"three",
						state:"disabled",
						disabled:{
							bgcolor:"gray",
							fgcolor:"#a9a9a9"
						}
					}
				]})
			]
		}

	}
});
