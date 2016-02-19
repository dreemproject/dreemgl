/* Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
   You may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
   Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
   either express or implied. See the License for the specific language governing permissions and limitations under the License.*/


define.class('$ui/button', function(require,$ui$, textbox, label, view){

	this.attributes = {
		commands:[],
	}
	this.oninit = function(){
		this.buttoncolor1 = this.bgcolor;
		this.buttoncolor2 = this.bgcolor;
		
	}
	this.borderwidth =0 ;
	this.borderradius = 0;
	this.padding = 4;
	this.render = function(){
		var res = [];
		this.buttonres = undefined;
		this.iconres = undefined

		if (this.icon && this.icon.length > 0){
			this.iconres = icon({alignself:"center", fgcolor:this.textcolor, bgcolor:NaN,icon: this.icon});
			res.push(this.iconres);
		}

		if (this.text && this.text.length > 0){
			this.buttonres = label({alignself:"center", bgcolor:NaN, fgcolor:this.textcolor,  position: "relative", text: this.text})
			res.push(this.buttonres);
		}

		return view({bgcolor:NaN,margin:this.internalmargin, alignitems:"center", flexdirection:"row",justifycontent:"center"},res);


	}

})
