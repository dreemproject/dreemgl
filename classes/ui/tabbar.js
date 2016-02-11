/* Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
 You may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
 either express or implied. See the License for the specific language governing permissions and limitations under the License.*/
// Sprite class

define.class("$ui/view", function($ui$, view, label){

	this.attributes = {
		tabs:Config({type:Array, value:[
			{
				title:"Tab 1"
			}
		]})
	};

	this.flexdirection = "row";
	this.tooldragroot = true;

	this.createTab = function(tab) {

		// accecpt various formats
		if (typeof(tab) === "string") {
			return this.tab({
				text:tab
			})
		} else if (typeof(tab) === "function") {
			return this.tab(tab);
		} else {
			return this.tab({
				text:(tab.title || tab.label || tab.text)
			})
		}

	};

	this.render = function() {
		var tabs = [];
		var i,tab;
		if (this.constructor_children) {
			for (i=0;i<this.constructor_children.length;i++) {
				tab = this.constructor_children[i];
				tabs.push(this.createTab(tab));
			}
		}

		if (this.tabs) {
			for (i=0;i<this.tabs.length;i++) {
				tab = this.tabs[i];
				tabs.push(this.createTab(tab));
			}
		}

		return tabs;
	};

	define.class(this, "tab", view, function() {
		this.attributes = {
			text:"Untitled"
		};
		this.bgcolor = "black";
		this.borderradius = vec4(5,5,0,0);
		this.render = function() {
			return label({
				alignself:"stretch",
				fgcolor:"white",
				text:this.text,
				padding:5,
				bgcolor:NaN
			})
		};
	});

	var tabbar = this.constructor;
	this.constructor.examples = {
		Usage: function() {
			return [
				tabbar({tabs:["One", "Two", {label:"Three"}]})
			]
		}
	}
});
