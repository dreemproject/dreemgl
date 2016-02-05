/* Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
 You may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
 either express or implied. See the License for the specific language governing permissions and limitations under the License.*/

define.class("$ui/view", function(require,
								  $ui$, view, cadgrid, splitcontainer,
								  $widgets$, palette, propviewer,
								  $server$, sourceset, dataset,
								  $$, dockpanel){

	this.name = "designer";
	this.flex = 1;
	this.clearcolor = "#565656";
	this.bgcolor = "#565656";
	this.flexdirection = "column";

	this.render = function(){
		return [
			splitcontainer({},
				cadgrid({
					name:"grid",
					flex:3,
					overflow:"scroll",
					bgcolor:"#4e4e4e",
					gridsize:5,
					majorevery:5,
					majorline:"#575757",
					minorline:"#484848"
				}),
				splitcontainer({flex:1,direction:"horizontal"},
					dockpanel({alignitems:"stretch", aligncontent:"stretch", title:"Components", viewport:"2D", flex:1},
						palette({
							name:"components",
							flex:1,
							bgcolor:"#4e4e4e",
							items:{
								Views:[
									{classname:"view",  label:"View",  icon:"clone", desc:"A rectangular view"},
									{classname:"label", label:"Text",  text:"Aa",    desc:"A text label" },
									{classname:"icon",  label:"Image", icon:"image", desc:"An image or icon"}
								]
							},
							dropTest:function(ev, v, item, orig, dv) {
								var name = v && v.name ? v.name : "unknown";
								console.log("test if", item.label, "from", orig.position, "can be dropped onto", name, "@", ev.position, dv);
								return name === "grid";
							},
							drop:function(ev, v, item, orig, dv) {
								var name = v && v.name ? v.name : "unknown";
								console.log("dropped", item.label, "from", orig.position, "onto", name, "@", ev.position, dv);
							}
						})
					),
					dockpanel({title:"Properties", viewport:"2D", flex:2},
						propviewer({name:"mainproperties", target:"grid", flex:1, overflow:"scroll"})
					)
				)
			)
		];
	}
});
