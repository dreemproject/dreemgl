/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
   Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and limitations under the License.*/

//Pure JS based composition
define.class('$server/composition', function($ui$, screen, view, menubar, button,label, speakergrid){


	this.justifycontent = "center" ;
	this.alignitems = "center"
	this.style = {
		"*":{fontsize:12}
	}
	this.render = function(){ return [
		screen({clearcolor:vec4('black'), title:"Small menu bar test frame"},
			view({flex:1, bg:'false'},
				speakergrid({ }
				,view({bgcolor:vec4(0,0.1,0.2,0.8) , flexdirection:"column"},view({bg:false},menubar({name:"themenu", menus:
					[
						{name:"File", commands:[
							{name:"New project", action:function(){console.log("new project with a long name") ;}},
							{name:"Open", action:function(){console.log("Open") ;}},
							{name:"Save", action:function(){console.log("Save") ;}}
						]}
						,{name:"Edit", commands:[
							{name:"Undo", action:function(){console.log("Undo") ;}},
							{name:"Redo", action:function(){console.log("Redo") ;}},
							{name:"Cut", action:function(){console.log("Cut") ;}},
							{name:"Copy", action:function(){console.log("Copy") ;}},
							{name:"Paste", action:function(){console.log("Paste") ;}}
						]},
						{name:"Status text", commands:[
							{name:"Clear", action:function(){this.find("themenu").errortext = "";this.find("themenu").statustext = "";this.find("themenu").infotext = "";}},
							{name:"Error", action:function(){this.find("themenu").errortext = "I am an error!";}},
							{name:"Info", action:function(){this.find("themenu").infotext = "I am highly informative";}},
							{name:"Status", action:function(){this.find("themenu").statustext = "I have status!";}}
						]}],
						position:"relative",margin:0,flex:1}))
					),
					view({bg:false, flex:1, alignitems:"center", justifycontent:"center" },
					button({text:"Open a menu!", alignself:"center", click:function(e){
						this.screen.contextMenu([{name:"Peekaboo!"},{name:"Submenu", commands:[{name:"I am in a submenu!"}]}], e.value.x, e.value.y)
					} })))
				)
		)
	]}
})
