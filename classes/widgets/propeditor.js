/* Copyright 2015 Teem2 LLC. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.  
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing, 
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, 
   either express or implied. See the License for the specific language governing permissions and limitations under the License.*/


define.class(function(require, $ui$, view, label, button, scrollbar, textbox,$widgets$, colorpicker, radiogroup){
	this.attributes = {
		target:{type:String,value:""},
		property:{type:Object},
		propertyname:{type:String,value:""}
		
	}
	
	this.margin = vec4(4);
	this.bgcolor = "white"
	
	this.borderwidth =  2;
	this.borderradius = 0;
	this.bordercolor ="#202020" 
	this.wrap = function(node){
		return [
			label({margin:4, flex: 0.2, text:this.propertyname, bg:0, fgcolor:"#303030" })
			,node
		]	
	}
	
	this.render = function(){
		
		var typename = this.property.type?this.property.type.name:"";
		if (typename =="Enum"){
			return this.wrap(radiogroup({values:this.property.type.values, currentvalue : this.property.value}));
		}
		if (typename =="vec4"){
		
		if (this.property.meta=="color"){
				return this.wrap(view({width:200, flexdirection:"column"},colorpicker()))
			}
			
			return this.wrap(view({},
					textbox({flex:1, fgcolor:"#303030", value:0,padding:4, borderradius:0, borderwidth:1, bordercolor:"gray", margin:2}), 
					textbox({flex:1, fgcolor:"#303030", value:0,padding:4, borderradius:0, borderwidth:1, bordercolor:"gray", margin:2}), 
					textbox({flex:1, fgcolor:"#303030", value:0,padding:4, borderradius:0, borderwidth:1, bordercolor:"gray", margin:2}), 
					textbox({flex:1, fgcolor:"#303030", value:0,padding:4, borderradius:0, borderwidth:1, bordercolor:"gray", margin:2})
					)
				);
		}
		
		if (typename =="vec3"){
			return this.wrap(view({},
				textbox({flex:1, fgcolor:"#303030", value:0,padding:4, borderradius:0, borderwidth:1, bordercolor:"gray", margin:2}), 
				textbox({flex:1, fgcolor:"#303030", value:0,padding:4, borderradius:0, borderwidth:1, bordercolor:"gray", margin:2}), 
				textbox({flex:1, fgcolor:"#303030", value:0,padding:4, borderradius:0, borderwidth:1, bordercolor:"gray", margin:2})
				)
			);            			
		}
		
		if (typename =="FloatLike"){
			return this.wrap(textbox({flex:1, fgcolor:"#303030", value:0,padding:4, borderradius:0, borderwidth:1, bordercolor:"gray", margin:2}) )
				
		}
		if (typename =="String"){
			return this.wrap(view({},
				textbox({flex:1, fgcolor:"#303030", value:"textvalue",padding:4, borderradius:0, borderwidth:1, bordercolor:"gray", margin:2})) )
		}
		if (typename =="vec2"){
			return this.wrap(view({},
				textbox({flex:1, fgcolor:"#303030", value:0,padding:4, borderradius:0, borderwidth:1, bordercolor:"gray", margin:2}), 
				textbox({flex:1, fgcolor:"#303030", value:0,padding:4, borderradius:0, borderwidth:1, bordercolor:"gray", margin:2})
				));            
		}
		if (!this.property) return [];
		//console.log(this.property);
		return this.wrap(label({margin:4,text:typename, bg:0, fgcolor:"#303030"}))
	}
	
})