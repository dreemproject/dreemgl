/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
   Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and limitations under the License.*/

//Pure JS based composition
define.class('$server/composition', function(require, $ui$,treeview,  speakergrid, splitcontainer, screen, view, label, $widgets$, propviewer, colorpicker, $$, flowgraph, renamedialog, newcompositiondialog, opencompositiondialog, aboutdialog, docviewerdialog, renameblockdialog){

	this.flexwrap = "nowrap";
	this.overflow = "scroll"
	this.render = function(){
		return [
			screen({
				bgcolor:NaN,
				clearcolor:vec4('blue'),
				flexwrap:"nowrap",
				flexdirection:"row",
				style:{
					$:{
						fontsize:12
					},
					"textbox":{
						padding:4
					}
				}},
				speakergrid({glowcolor:"#505060",  flexwrap:"nowrap", overflow:"scroll" },
					label({margin:10, paddingtop:10, fontsize:30, text:"Rename block", bgcolor:NaN}),
					renameblockdialog({oldname:"this is my old name" }),
					label({margin:10, paddingtop:10, fontsize:30, text:"Rename composition", bgcolor:NaN}),
					renamedialog(),
					label({margin:10, fontsize:30, text:"New composition", bgcolor:NaN}),
					newcompositiondialog(),
					label({margin:10, fontsize:30, text:"Open composition", bgcolor:NaN}),
					opencompositiondialog(),
					label({margin:10, fontsize:30, text:"About", bgcolor:NaN}),
					aboutdialog(),
					label({margin:10, fontsize:30, text:"Docviewer", bgcolor:NaN}),
					docviewerdialog({title:"I am a custom markdown viewer" , body:"Huzzah"})
				)
			)
		]
	}
})
