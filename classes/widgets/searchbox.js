/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
   Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and limitations under the License.*/


define.class(function(require, $ui$, view, label, button, scrollbar, textbox, icon){
	this.attributes={
		searchtextlabel:"search",
		fontsize: 12,
		value:""
	}

	this.margin = 4
	this.bgcolor="#3b3b3b"

	this.flexdirection = "row";
	this.bordercolor = "#505050" ;
	this.borderwidth = 2;
	this.borderradius = 5;
	this.dofocus = function(){

		var tb = this.findChild("thetext");
		if (tb){
			if (tb.focus){
				this.find("thelabel").visible = false;
			}
			else{
				if (this.value.trim() == ""){
					this.find("thelabel").visible = true;
				}
				else{
					this.find("thelabel").visible = false;
				}
			}
		}
	}
	this.justifycontent= "center"

	// forward the focus
	this.focus = function(){
		if(this._focus) this.find("thetext").focus = true
	}

	this.render = function(){
		return [
			textbox({
				multiline:false,
				borderradius:15,
				name:"thetext",
				value:function(){
					this.parent.value = this.value
				},
				flex:1,
				bgcolor:"#3b3b3b",
				fgcolor: "white",
				focus: function(){
					this.dofocus()
				}.bind(this)
			}),
			label({name:"thelabel",position:"absolute",margin:7, text:this.searchtextlabel,fontsize:this.fontsize, bgcolor:NaN, fgcolor:"#707070"}),
			icon({icon:"search", margin:6, fgcolor:"#707070", alignself:"center"})]
	}
})
