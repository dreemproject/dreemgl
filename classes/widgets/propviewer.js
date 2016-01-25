/* Copyright 2015-2016 Teem. Licensed under the Apache License, Version 2.0 (the "License"); Dreem is a collaboration between Teem & Samsung Electronics, sponsored by Samsung. 
   You may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 
   Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
   either express or implied. See the License for the specific language governing permissions and limitations under the License.*/


define.class(function(require, $ui$, foldcontainer, view, label, button, scrollbar, textbox,$widgets$,propeditor){
	
	this.attributes = {
		target:Config({type:String,value:""}),
	}
	
	this.borderwidth = 0;
	this.flexdirection= "column";
	this.margin = 0;
	this.clearcolor = vec4("#303030");
	this.bgcolor = vec4("blue");
	this.padding = 0
	this.bg = 0;
	
	this.uppercaseFirst = function (inp) {
		if (!inp || inp.length == 0) return inp;
		return inp.charAt(0).toUpperCase() + inp.slice(1);
	}
	
	this.render = function(){
		var c = this.find(this.target);
		if (!c) return [];

		var res = [];
		var keysgroups = {};
		
        for (var key in c._attributes) {
			var attr = c._attributes[key];
			
			var typename = attr.type? attr.type.name:"NONE";
			
			var meta = (attr.type && attr.type.meta)? attr.type.meta:"";
			if (key == "layout"){
				meta = "hidden";
			}
			if (typename != "NONE" && typename != "Event" && meta != "hidden" ){
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
				groupcontent.push(propeditor({value:thevalue, property:attr, propertyname: key, fontsize:this.fontsize}))
			}
			
			res.push(
				foldcontainer({
						collapsed: true,
						basecolor:"#303030",
						autogradient: false,
						icon:undefined, 
						title: this.uppercaseFirst(group),
						bordercolor:"#4f4f4f"	,
						fontsize:this.fontsize						
					}, 
					view({
							flexdirection:"column", 
							flex:1, 
							margin:0, 
							padding:0,
							bg:0
						},
						groupcontent
					)
				)
			)
			
			res[res.length-1].collapsed = function(){
				window.mydbg = 1
			}
		}
		return res;
	}
})