/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
   Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and limitations under the License.*/

define.class('$ui/view', function(require, $$, dialog, $ui$, textbox,view, icon, treeview, cadgrid, label, button, $$, ballbutton){

	this.bgcolor = vec4(0,0,0,0.5);

	this.render =function(){
		return dialog({title:"Rename composition"},
			view({bgcolor:NaN, flexdirection:"column", padding:20 },
				view({margin:10, flexdirection:"row",bgcolor:NaN, flex:1},
					label({text:"old name:",bgcolor:NaN}),
					textbox({value:"tadaa", enabled: false, marginleft: 20, bgcolor:"#202020", multiline:false})
				),
				view({margin:10, flexdirection:"row",bgcolor:NaN, flex:1},
					label({text:"new name:",bgcolor:NaN}),
					textbox({value:"tadaa", name:"newnamebox", marginleft: 20, bgcolor:"#202020", multiline:false})
				),
				view({flexdirection:"row",bgcolor:NaN, alignitems: "flex-end", justifycontent:"flex-end", alignself:"flex-end"   },
					button({padding:10, text:"OK", icon:"check", click: function(){this.screen.closeModal(this.find("newnamebox").value);} }),
					button({padding: 10, marginleft:10, icon:"close", text:"Cancel", click: function(){this.screen.closeModal(false);} })
 				)
			)
		);
	}
})
