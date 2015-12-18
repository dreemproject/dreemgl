/* Copyright 2015 Teem2 LLC. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.  
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing, 
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, 
   either express or implied. See the License for the specific language governing permissions and limitations under the License.*/


define.class(function(require, $ui$, view, label, button, scrollbar, textbox, icon){
	
	this.attributes ={
		values:{type:Object, value:[]},
		currentvalue:{type:String, value:""},
		fgcolor: {type:vec4, value:vec4("#303030"), meta:"color"},
		fontsize: {type: float, value: 12, meta:"fontsize"}
	}
	this.flexdirection = "row"
	this.bgcolor = "#383838";
	this.fgcolor ="#f0f0f0"
	this.borderradius = 5;
	this.render = function(){
		var res = [];
		
		
		if (this.title && this.title.length > 0){
			res.push(
			view({bgcolor:this.bordercolor, margin:0,borderradius:vec4(4,1,1,4), padding:4},
				label({name:"thetitle", align:"right",  bg:0,text:this.title,flex:1, fontsize: this.fontsize, fgcolor:this.fgcolor})
				)
			)
		}
		
		
		var radio = this;
		for(var i =0 ;i<this.values.length;i++)
		{
			var v = (this.values[i])?this.values[i].toString():"undefined";
			if (v == this.currentvalue || ((v==undefined || v=="undefined") && !this.currentvalue)){
				
				res.push(
					view({
						alignItems:"center",
						bgcolor:"#505050",
						padding:2,
					
						borderradius:  (i == this.values.length -1)?vec4(1,4,4,1):vec4(0),						
						margin:(i == this.values.length -1)?vec4(2,2,2,2):vec4(2,2,0,2)
						
						},
						label({
								font: require('$resources/fonts/opensans_bold_ascii.glf'),
								text:(v&&v.trim().length > 0)?v:"undefined", 
								bg:0, 
								fgcolor:this.fgcolor,
								fontsize:this.fontsize
							}
						)
					)
				)
			}
			else{
				res.push(button({
						bgcolor:"#505050",
						borderwidth:0,
						padding:2,
						
						borderradius:  (i == this.values.length -1)?vec4(1,4,4,1):vec4(0),						
						margin:(i == this.values.length -1)?vec4(2,2,2,2):vec4(2,2,0,2),
						fgcolor:"#909090",
						
						padding:2,text:(v===undefined)?"unD": ((v.trim().length > 0)?v:"AAA"), onclick:function(){
							radio.currentvalue = (this.text=="undefined" ||this.text=="unD") ? undefined:this.text;
						},fontsize:this.fontsize
					}))
			}
		}
		return res;
	}
})