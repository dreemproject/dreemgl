/* Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
   You may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
   Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
   either express or implied. See the License for the specific language governing permissions and limitations under the License.*/


define.class(function(require, $ui$, foldcontainer, view, label, button, scrollbar, textbox, $widgets$, propeditor){
// The property viewer allows for the visual inspection and manipulation of properties on DreemGL objects

	this.attributes = {

		// The target who's properties to view.  Can be either a DreemGL object or a named reference to one.
		target:Config({type:Object, value:""}),

		// Shows properties for unknown property types
		showunknown:Config({type:boolean, value:false}),

		// internal, Callback used by the property editor to actually set properties.
		callback:Config({type:Function}),

		// internal
		astarget:Config({type:String, persist:true}),
		onastarget:function(ev,v,o) {
			var node = this.screen;

			if (v) {
				var astpath = JSON.parse(v);
				// console.log('path', astpath);
				for (var i=1;i<astpath.length;i++) {
					var pathitem = astpath[i];
					var child = node.children[pathitem.childindex];
					if (child && pathitem.type == child.constructor.name) {
						node = child;
					} else {
						break;
					}
				}
			}

			this.target = node;
		}
	};

	this.borderwidth = 0;
	this.flexdirection= "column";
	this.margin = 0;
	this.clearcolor = "#4e4e4e";
	this.padding = 0;
	this.bgcolor = NaN;

	this.uppercaseFirst = function (inp) {
		if (!inp || inp.length == 0) return inp;
		return inp.charAt(0).toUpperCase() + inp.slice(1);
	};

	this.render = function(){
		var c = this.target;
		if (typeof(this.target) === 'string') {
			c = this.find(this.target);
		}

		if (!c) return [];

		var res = [];
		var keysgroups = {};

        for (var key in c._attributes) {
			var attr = c._attributes[key];

			var typename = "NONE";
			var meta = attr.meta;

			if (attr.type) {
				typename = attr.type.name;
				if (attr.type.meta) {
					meta = attr.type.meta;
				}
			}

			if (key == "layout") {
				meta = "hidden";
			}

			if (typename != "NONE" && typename != "Event" && meta != "hidden") {
				if (!keysgroups[attr.group]) keysgroups[attr.group] = [];
				keysgroups[attr.group].push(key);
			}
		}

		for(var group in keysgroups){
			var groupcontent = [];

			keys = keysgroups[group];

			keys.sort();

			for(var i = 0 ;i<keys.length;i++){
				var key = keys[i];
				var thevalue = c["_"+key];
				var attr = c._attributes[key];
				var props = {
					target:this.target,
					value:thevalue,
					property:attr,
					propertyname: key,
					fontsize:this.fontsize,
					showunknown:this.showunknown
				};

				if (this.callback) {
					props.callback = this.callback;
				}
				groupcontent.push(propeditor(props))
			}

			res.push(
				foldcontainer({
						collapsed: true,
						basecolor:this.clearcolor,
						autogradient: false,
						icon:undefined,
						title: this.uppercaseFirst(group),
						bordercolor:"#565656",
						fontsize:this.fontsize
					},
					view({
							flexdirection:"column",
							flex:1,
							margin:0,
							padding:0,
							bgcolor:NaN
						},
						groupcontent
					)
				)
			);

			res[res.length-1].collapsed = function(){
				window.mydbg = 1
			}
		}
		return res;
	};

	var propviewer = this.constructor;
	this.constructor.examples = {
		Usage: function () {
			return [
				label({height:30, width:300,
					name:"inspectable",
					text:"Inspect me below!",
					fgcolor:'red',
					bordercolor:'pink',
					borderwidth:3}),
				propviewer({y:40, width:300, height:700, target:"inspectable", overflow:"scroll"})
			]
		}
	}

});
