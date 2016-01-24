/* Copyright 2015-2016 Teem. Licensed under the Apache License, Version 2.0 (the "License"); Dreem is a collaboration between Teem & Samsung Electronics, sponsored by Samsung. 
   You may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 
   Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
   either express or implied. See the License for the specific language governing permissions and limitations under the License.*/


define.class(function(require, $ui$, view, checkbox,foldcontainer,  label, button, scrollbar,textbox, numberbox,$widgets$, colorpicker, radiogroup){
	this.attributes = {
		target:Config({type:String,value:""}),
		property:Config({type:Object}),
		value:Config({type:Object}),
		propertyname:Config({type:String,value:""}),
		fontsize: Config({type:float, value: 13})
	}
	
	this.bg = {
		color:function(){								
			var col1 = vec3("#3b3b3b");
			var col2=vec3("#3b3b3b");
			return vec4(mix(col1, col2, 1.0-pow(abs(uv.y),4.0) ),1.0)
		}
	};
	
	this.margin = 0
	this.padding = 0
	this.border = 0
	this.flexdirection = "row"
	this.flex = 1
	this.bordercolor = "gray"
	this.fgcolor = "#c0c0c0"

	// lets have the style parameterized by self and self props
	// these things are memo-ized on our class
	this.style = function(context){
		return {
			label:{
				bg: 0,
				margin: 4,
				fontsize: this.fontsize,
			},
		}
	}

	this.wrap = function(node, hasownlabel){
		if (hasownlabel === undefined) hasownlabel = false		
		if (hasownlabel) return [node];
		
		return [
			label({bg:0,margin:4, fontsize:this.fontsize, flex: 0.2, text:this.propertyname, bg:0, fgcolor:this.fgcolor })
			,node
		]	
	}
	
	this.style = {
		radiogroup:{
			margin:vec4(2,0,2,5)
		},
		foldconainer_color:{
			 width:302, title:"colorpicker",  bordercolor:"#383838", icon:"circle", collapsed:true
		},
		view_colorview:{
			bg:0,width:300, flexdirection:"column"			
		},
		numberbox_vec4:{
			flex:1,decimals:3, stepvalue:0.01, margin:2
		},
		numberbox_vec3:{
			flex:1, decimals:3, stepvalue:0.01, margin:2
		},
		numberbox_vec2:{
			 flex:1, decimals:3, stepvalue:0.01,
		},
		numberbox_floatlike:{
			decimals:3, stepvalue:0.01, margin:2, flex:1, 
		}
	}

	this.render = function(){
		
		var typename = this.property.type?this.property.type.name:"";
		var meta = (this.property.meta)?this.property.meta:"";
		
		if (typename =="Enum"){
			return this.wrap(radiogroup({
				title:this.propertyname,values:this.property.type.values, currentvalue: this.value}), true);
		}
		
		if (typename =="vec4"){
		
			if (this.property.meta=="color"){
				return this.wrap(				
					foldcontainer({class:'color', basecolor:vec4(this.value[0],this.value[1],this.value[2],1.0)},
						view({class:'color_view'},
							colorpicker({value:this.value})
						)
					)
				)
			}
			
			var t1 = "";
			var t2 = "";
			var t3 = "";
			var t4 = "";
			if (this.property.meta =="tlbr")
			{
				t1 = "top"
				t2 = "left";
				t3 = "bottom";
				t4 = "right" 
			}else
			if (this.property.meta =="ltrb")
			{
				t1 = "left";
				t2 = "top"
				t3 = "right" 
				t4 = "bottom";
			}
			return this.wrap(
				view({bg:0},
					numberbox({title:t1, class:'vec4', value:this.value[0]}), 
					numberbox({title:t2, class:'vec4', value:this.value[1]}), 
					numberbox({title:t3, class:'vec4', value:this.value[2]}), 
					numberbox({title:t4, class:'vec4', value:this.value[3]})
				)
			);
		}
		
		if (typename =="vec3"){
			
			var t1 = "";
			var t2 = "";
			var t3 = "";
			if (this.property.meta =="xyz"){
				t1 = "X"
				t2 = "Y";
				t3 = "Z";
				
			}
				
			return this.wrap(
				view({bg:0},
					numberbox({title:t1, class:'vec3', value:this.value[0]}), 
					numberbox({title:t2, class:'vec3', value:this.value[1]}), 
					numberbox({title:t3, class:'vec3', value:this.value[2]})
				)
			);
		}
		
		if (typename =="vec2"){
			return this.wrap(
				view({bg:0},
					numberbox({class:'vec2', value:this.value[0],margin:2}), 
					numberbox({class:'vec2', value:this.value[1],margin:2})
				)
			);            
		}
		
		if (typename =="FloatLike"){
			return this.wrap(
				view({bg:0},
					numberbox({class:'floatlike', minvalue: this.property.minvalue, maxvalue: this.property.maxvalue,  value:this.value}) 
				)
			)
		}
		
		if (typename =="IntLike"){
			return this.wrap(
				view({bg:0},
					numberbox({flex:1, minvalue: this.property.minvalue, maxvalue: this.property.maxvalue, fontsize:this.fontsize, value:this.value, stepvalue:1, margin:2}) 
				)
			)
		}
		
		if (typename =="String"){			
			return this.wrap(
				view({bg:0},
					textbox({flex:1, fontsize:this.fontsize, fgcolor:"#d0d0d0",bgcolor:"#505050", value:this.value,padding:4, borderradius:0, borderwidth:1, bordercolor:"gray", margin:2})
				) 
			)
		}
		
		if (typename =="Boolean" || typename=="BoolLike"){
			return this.wrap(
				view({bg:0},
					checkbox({flex:1, fgcolor:"white", value:this.value,padding:4, borderradius:0, borderwidth:1, bordercolor:"gray", margin:2})
				) 
			)
		}
		
		if (typename == "Object" && meta == "font") {
			return this.wrap(
				label({fontsize: this.fontsize, margin:4,text:"FONT PICKER!", bg:0, fgcolor:this.fgcolor})
			)			
		}

		if (typename == "Object" && meta == "texture") {
			return this.wrap(
				label({fontsize: this.fontsize, margin:4,text:"IMAGE PICKER!", bg:0, fgcolor:this.fgcolor})
			)
		}
		
		if (!this.property) return [];
		//console.log(this.property);
		return this.wrap(label({margin:4,text:typename + " " + meta, bg:0, fgcolor:this.fgcolor}))
	}
	
})