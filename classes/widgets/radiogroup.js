/* Copyright 2015-2016 Teem. Licensed under the Apache License, Version 2.0 (the "License"); Dreem is a collaboration between Teem & Samsung Electronics, sponsored by Samsung. 
   You may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 
   Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
   either express or implied. See the License for the specific language governing permissions and limitations under the License.*/


define.class(function(require, $ui$, view, label, button, scrollbar, textbox, icon){
	
	this.attributes ={
		values: Config({type:Object, value:[]}),
		currentvalue: Config({type:String, value:""}),
		fgcolor: Config({type:vec4, value:vec4("white"), meta:"color"}),
		fontsize: Config({type: float, value: 12, meta:"fontsize"})
	}
	
	this.flexdirection = "row"
	this.bgcolor = "#262626";
	this.title = ""
	this.borderradius = 5;
	
	this.render = function(){
		var res = [];
		
		if (this.title && this.title.length > 0){
			res.push(
			view({bgcolor:this.bordercolor, margin:0,borderradius:vec4(4,1,1,4), padding:4},
				label({name:"thetitle", margin:vec4(5,0,5,0),align:"right",  bg:0,text:this.title,flex:1, fontsize: this.fontsize, fgcolor:this.fgcolor})
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
						alignitems:"center",
						bgcolor:"#3b3b3b",
						padding:2,
					
						borderradius:  (i == this.values.length -1)?vec4(1,4,4,1):vec4(1),						
						margin:(i == this.values.length -1)?vec4(2,2,2,0):vec4(2,2,0,2)
						
						},
						label({
								font: require('$resources/fonts/opensans_bold_ascii.glf'),
								text:(v&&v.trim().length > 0)?v:"undefined", 
								bg:0, 
								margin: vec4(5,0,5,0),
								fgcolor:this.fgcolor,
								fontsize:this.fontsize
							}
						)
					)
				)
			}
			else{
				res.push(button({
						bgcolor:"#3b3b3b",
						borderwidth:0,
						padding:2,
						buttoncolor1: "#3b3b3b",
						buttoncolor2: "#3b3b3b",
						internalmargin: vec4(5,0,5,0),
						borderradius:  (i == this.values.length -1)?vec4(1,4,4,1):vec4(1),						
						margin:(i == this.values.length -1)?vec4(2,2,2,2):vec4(2,2,0,2),
						fgcolor:"#909090",
						bold: false,
						
						padding:2,text:(v===undefined)?"unD": ((v.trim().length > 0)?v:"AAA"), mouseleftdown:function(){
							radio.currentvalue = (this.text=="undefined" ||this.text=="unD") ? undefined:this.text;
						},fontsize:this.fontsize
					}))
			}
		}
		return res;
	}
})