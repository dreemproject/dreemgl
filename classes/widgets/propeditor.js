/* Copyright 2015 Teem2 LLC. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.  
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing, 
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, 
   either express or implied. See the License for the specific language governing permissions and limitations under the License.*/


define.class(function(require, $ui$, checkbox,foldcontainer, view, label, button, scrollbar, textbox,$widgets$, colorpicker, radiogroup){
	this.attributes = {
		target:{type:String,value:""},
		property:{type:Object},
		propertyname:{type:String,value:""}
		
	}
	this.bg = {
		color:function(){								
								var col1 = vec3(0.95,0.95,0.95);
								var col2= vec3(1,1,1);
								return vec4(mix(col1, col2, 1.0-pow(abs(uv.y),4.0) ),1.0)
							}
	};
	
	this.margin = 0;
	this.bgcolor = "white"
	this.padding = 0;
	this.border = 0;
	
	this.flexdirection = "row";
	this.wrap = function(node){
		return [
			label({bg:0,margin:4, fontsize:14, flex: 0.2, text:this.propertyname, bg:0, fgcolor:"#303030" })
			,node
		]	
	}
	
	this.render = function(){
		
		var typename = this.property.type?this.property.type.name:"";
		if (typename =="Enum"){
			return this.wrap(radiogroup({bg:0,values:this.property.type.values, currentvalue: this.property.value}));
		}
		
		if (typename =="vec4"){
		
			if (this.property.meta=="color"){
				return this.wrap(view({bg:0,width:300, flexdirection:"column"},colorpicker({color:this.property.value})))
			}
			
			return this.wrap(view({bg:0},
					textbox({flex:1, fontsize:14, fgcolor:"#303030", value:0,padding:4, borderradius:0, borderwidth:1, bordercolor:"gray", margin:2}), 
					textbox({flex:1, fontsize:14, fgcolor:"#303030", value:0,padding:4, borderradius:0, borderwidth:1, bordercolor:"gray", margin:2}), 
					textbox({flex:1, fontsize:14, fgcolor:"#303030", value:0,padding:4, borderradius:0, borderwidth:1, bordercolor:"gray", margin:2}), 
					textbox({flex:1, fontsize:14, fgcolor:"#303030", value:0,padding:4, borderradius:0, borderwidth:1, bordercolor:"gray", margin:2})
					)
				);
		}
		
		if (typename =="vec3"){
			return this.wrap(view({bg:0},
				textbox({flex:1, fontsize:14, fgcolor:"#303030", value:0,padding:4, borderradius:0, borderwidth:1, bordercolor:"gray", margin:2}), 
				textbox({flex:1, fontsize:14, fgcolor:"#303030", value:0,padding:4, borderradius:0, borderwidth:1, bordercolor:"gray", margin:2}), 
				textbox({flex:1, fontsize:14, fgcolor:"#303030", value:0,padding:4, borderradius:0, borderwidth:1, bordercolor:"gray", margin:2})
				)
			);            			
		}
		
		if (typename =="FloatLike"){
			return this.wrap(view({bg:0},textbox({flex:1, fontsize:14, fgcolor:"#303030", value:0,padding:4, borderradius:0, borderwidth:1, bordercolor:"gray", margin:2}) ))
				
		}
		
		if (typename =="String"){
			return this.wrap(view({bg:0},
				textbox({flex:1, fgcolor:"#308030", value:this.property.value,padding:4, borderradius:0, borderwidth:1, bordercolor:"gray", margin:2})) )
		}
		
		if (typename =="Boolean"){
			return this.wrap(view({bg:0},
				checkbox({flex:1, fgcolor:"#308030", value:this.property.value,padding:4, borderradius:0, borderwidth:1, bordercolor:"gray", margin:2})) )
		}
		
		if (typename =="vec2"){
			return this.wrap(view({bg:0},
				textbox({flex:1, fgcolor:"#303030", value:0,padding:4, borderradius:0, borderwidth:1, bordercolor:"gray", margin:2}), 
				textbox({flex:1, fgcolor:"#303030", value:0,padding:4, borderradius:0, borderwidth:1, bordercolor:"gray", margin:2})
				)
			);            
		}
		
		if (!this.property) return [];
		//console.log(this.property);
		return this.wrap(label({margin:4,text:typename, bg:0, fgcolor:"#303030"}))
	}
	
})