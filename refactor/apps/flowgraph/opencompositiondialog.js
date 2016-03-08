/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
   Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and limitations under the License.*/

define.class('$ui/view', function(require, $$, dialog, $ui$, textbox, view, icon, treeview, cadgrid, label, button, $$, ballbutton){

	this.bgcolor = vec4(0,0,0,0.5);

	this.attributes = {
		compositions: []
	}

	this.init = function(){
		this.rpc.fileio.getCompositionList().then(function(ret){
			this.compositions = ret.value.children[0].children;
		}.bind(this))
	}
	this.render =function(){

		var res = [];

		for(var i =0 ;i<this.compositions.length;i++){
			var c= this.compositions[i];
			console.log(c);
			res.push(button({text:c.name,name:c.name, margin:4, click:function(){this.screen.closeModal(this.name);}}));
		}

		return dialog({title:"Open composition", position:"relative"},
			view({bgcolor:NaN, flexdirection:"column", padding:vec4(20,10,10,10) }
			,res,
			view({flexdirection:"row",bgcolor:NaN, alignitems: "flex-end", justifycontent:"flex-end", alignself:"flex-end"   },

					button({padding: 10, marginleft:10, icon:"close",text:"Cancel", click: function(){this.screen.closeModal(false);} })
 				)
			)
		);
	}
})
