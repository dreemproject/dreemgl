/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
   Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and limitations under the License.*/

define.class('$ui/view', function(require, $ui$, view, icon, treeview, cadgrid, label, button, $$, ballbutton){

	function uppercaseFirst (inp) {
		if (!inp || inp.length == 0) return inp;
		return inp.charAt(0).toUpperCase() + inp.slice(1);
	}

	define.class(this, "classlibclass", view, function($ui$, view, label, icon){
		this.attributes = {
			classdesc: Config({type:Object, value: undefined}),
			col1: Config({value:vec4("#454545"), persist:true, meta:"color", motion:"linear", duration:0.1}),
			col2: Config({value:vec4("#454545"), persist:true, meta:"color", motion:"linear", duration:0.2}),
			folder:""
		}

		this.hardrect = {
			color: function(){
				var fill = mix(view.col1, view.col2,  (mesh.y)/0.8)
				return fill;
			}
		}

		this.margin = vec4(2)
		this.justifycontent = "flex-start"
		this.alignitems = "center"
		this.addBlock = function(){
			var fg = this.find("flowgraph");
			if (fg){

				fg.addBlock(this.folder,this.classdesc.name.substr(0,this.classdesc.name.length-3 ));
			}
		}

		this.doHover = function(){
			this.screen.status = "Add block: " +this.classdesc.name.substr(0,this.classdesc.name.length-3 );
		}

		this.render = function(){
			return [
				//view({bgcolor:"#707070", width:30, height:30, borderwidth:1, borderradius:2, bordercolor:"#505050", margin:2, justifycontent:"center" }
				//	,icon({icon:"cube", fgcolor:this.fgcolor,margin:0,alignself:"center", fontsize:20})
				//)
				//,
				view({justifycontent:"space-between", flex:1, bgcolor:NaN},
					label({text:this.classdesc.name.substr(0,this.classdesc.name.length-3 ), margin:3,fgcolor:this.fgcolor, bgcolor:NaN, flex:1})
					,button({icon:"plus", pointerhover: this.doHover.bind(this),click: this.addBlock.bind(this)})
				)
			]
		}
	})


	define.class(this, "libraryfolder", view, function($ui$, view, foldcontainer){

		this.attributes = {
			dataset:Config({type:Object}),
			parentfolder : ""
		}

		this.flexwrap  = "nowrap"
		this.flexdirection = "column"
		this.fgcolor = "#f0f0f0"
		this.bgcolor = "#4e4e4e"

		this.render =function(){
			var data = this.dataset

			if (!this.dataset) return [];
			var res = [];
			//console.log(this.dataset);
			for(var a = 0;a<data.children.length;a++){
				var ds = data.children[a];

				if (ds.isfolder){
					if (ds.children && ds.children.length > 0){
						res.push(this.outer.libraryfolder({marginleft:10,parentfolder: ((this.parentfolder && this.parentfolder.length>0)?this.parentfolder+"/":"")+data.name, dataset: ds, fgcolor:this.fgcolor}));
					}
				}
					else{
					res.push(this.outer.classlibclass({marginleft:20,classdesc: ds,folder:((this.parentfolder && this.parentfolder.length>0)?this.parentfolder+"/":"")+data.name, fgcolor:this.fgcolor}));

				}
			}

			return foldcontainer({title:data.name, basecolor:vec4("#3b3b3b"),padding:0,bordercolor:vec4("#3b3b3b"),icon:undefined},view({bgcolor:NaN, flex:1,flexdirection:"column"},res));
		}
	})

	this.flex = 1;
	this.attributes = {
		dataset:{},
//			fontsize:Config({type:float, meta:"fontsize", value: 15})
	}
	this.overflow = "scroll"
	this.flexdirection = "column"
	this.fgcolor = "#f0f0f0"
	this.bgcolor = "#4e4e4e"
	this.render =function(){
		var data = this.dataset.data
		if (!this.dataset) return [];
		var res = [];
		for(var a  in data.children){
			var ds = data.children[a];
			if (ds.children && ds.children.length > 0){
					res.push(this.libraryfolder({dataset: ds, fgcolor:this.fgcolor}));
				}
			}

		return res;
	}

})
