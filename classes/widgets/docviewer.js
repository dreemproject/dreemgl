/* Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
   You may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
   Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
   either express or implied. See the License for the specific language governing permissions and limitations under the License.*/


define.class(function(require, $ui$, view, foldcontainer, label, gbutton, icon, $widgets$, markdown, jsviewer){

	var parseDoc = require('$system/parse/jsdocgen').parseDoc

	this.bgcolor = vec4("#343434")
	this.padding = 20
	this.flexdirection = "column"
	this.alignitems = "stretch"
	this.flexwrap = "nowrap"
	this.viewport = "2d"

	this.attributes = {
		// the class for which to create the documentation. If a string is assigned, the model will be interpreted as a markdown text document.
		classconstr: Config({type:Function})
	}

	// A doc item is an item with a heading, such as methods or attributes
	define.class(this, 'ClassDocItem', function($ui$, view){
		this.bgcolor = NaN
		// the item to display.
		// An "attribute" item can have name, body_text, defvalue and type properties.
		// A "function" item can have name, params and body_text properties.
		this.attributes = {
			item: Config({type: Object}),
			// the type of this display block. Accepted values: "function", "attribute"
			blocktype: Config({type:String, value:"function"})
		}
		this.flex = 1
		//this.bgcolor = vec4("#ffffff");
		this.margin = 4
		this.padding = 4
		this.flexdirection = "column"
		this.flexwrap = "nowrap"

		this.render = function(){
			var res = [];
			if (this.blocktype === "function"){
				var functionsig = "()"
				if (this.item.params && this.item.params.length > 0) {
					functionsig = "(" + this.item.params.map(function(a){return a.name}).join(", ") + ")";
				}
				res.push(label({bgcolor:NaN,margin:vec4(2),text: this.item.name + functionsig , fontsize: 20, fgcolor: "f0f0f0", bold:true}));
			}
			else{
				var sub = [];

				if (this.item.type){
					sub.push(label({bgcolor:NaN,margin:vec4(2),text: "type: "+ this.item.type, fontsize: 15, fgcolor: "white"}));
				}

				if (this.item.defvalue !== undefined){
					if (this.item.type === "vec4"){
						var type  = define.typemap.types[this.item.type] ;
						var defvalue = type(this.item.defvalue);
						var labeltext = (Math.round(defvalue[0]*100)/100) + ", " +
						(Math.round(defvalue[1]*100)/100) + ", " +
						(Math.round(defvalue[2]*100)/100) + ", " +
						(Math.round(defvalue[3]*100)/100) ;

						var zwartdiff = defvalue[0] + defvalue[1] + defvalue[2];
						var witdiff = (1-defvalue[0]) + (1-defvalue[1]) + (1-defvalue[2]);
						var color = "black";
						if (witdiff > zwartdiff) color = "white";

						sub.push(
							view({bgcolor:NaN},
								[
									label({margin:vec4(2),text: "default:", bgcolor:NaN, fontsize: 15, fgcolor: "white"}),
									view({bgcolor:NaN,bordercolor: "#808080", borderwidth: 1, cornerradius:4, bgcolor: this.item.defvalue, padding: vec4(8,3,8,3)},
										label({bgcolor:NaN,fgcolor: color , fontsize: 15, bgcolor:"transparent" , text:labeltext})
									)
								]
							));
					}
					else{
						if (this.item.type === "String"){
							sub.push(label({bgcolor:NaN,margin:vec4(2),text: "default: \""+ this.item.defvalue.toString() + "\"" , fontsize: 15, fgcolor: "#404040"}))
						}else{
							sub.push(label({bgcolor:NaN,margin:vec4(2),text: "default: "+ this.item.defvalue.toString(), fontsize: 15, fgcolor: "#404040"}))
						}
					}
				}

				var name = this.item.name;
				if (this.blocktype === "example") {
					name = name.split(/(?=[A-Z])/).join(" ");
				}
				var title = label({bgcolor:NaN,margin:vec4(2),text: name, fontsize: 20, fgcolor: "white"})

				res.push(view({bgcolor:NaN,flex: 1,alignitems:"flex-start",justifycontent:"space-between"},[title,view({bgcolor:NaN,alignself:"flex-start",alignitems:"flex-end",  flexdirection:"column", alignitems:"flex-end" },sub)]));
			}

			if (this.item.body_text){
				for(var t in this.item.body_text){
					res.push(label({bgcolor:NaN,text: this.item.body_text[t], fgcolor: "white", fontsize: 12, margin: vec4(10,0,10,5)}));
				}
			}

			if (this.item.params && this.item.params.length > 0){
				res.push(label({ bgcolor:NaN,fgcolor:"#808080", margin:vec4(2,0,4,4), text:"parameters:" }));
				for (var a in this.item.params){
					var parm = this.item.params[a];
					var left = label({bgcolor:NaN, fgcolor:"white", margin:vec4(10,0,4,4), text:parm.name});
					var right;

					if (parm.body_text && parm.body_text.length > 0){
						right= view({flex: 0.8},parm.body_text.map(function(a){return label({fgcolor:"#f0f0f0", text:a})}))
					} else {
						right = view({flex: 1.0});
					}
					res.push(view({bgcolor:NaN,height:1, borderwidth: 1, bordercolor:"#e0e0e0", padding: 0}));
					res.push(view({bgcolor:NaN,flexdirection:"row"},[left, right]));
				}
				res.push(view({bgcolor:NaN,height:1, borderwidth: 1, bordercolor:"#e0e0e0", padding: 0}));
			}

			if (this.blocktype === "example"){
				res.push(
					view({flexdirection:"row", flex:1, padding: vec4(2), bgcolor: "#202020"}
							,view({bgcolor:NaN,flex: 1, borderwidth: 1, flexdirection:"column", padding: vec4(4), bordercolor: "#eee", bgcolor:NaN}
								,label({fgcolor:"#888", bgcolor:NaN, text:"Code", margin:vec4(10)})
								,jsviewer({margin:vec4(0), wrap:true, source:this.item.examplefunc.toString(), padding:vec4(4), fontsize: 12, bgcolor:"#000025", multiline: true})
							)
							,view({flex: 1, borderwidth: vec4(0,1,1,1), flexdirection:"column", padding: vec4(4), bordercolor: "#eee", bgcolor: "#333" }
								,label({fgcolor:"white",bgcolor:NaN,  text:"Live demo", margin:vec4(10)})
								,this.item.examplefunc()
							)
					)
				);
			}
			return res;
		}
	});

	// Build a documentation structure for a given constructor function
//	this.parseDoc =

	// This class will recursively expand a class_doc sturcture to an on-screen view.

	define.class(this, 'dividerline', function($ui$, view){
		this.height = 1;
		this.borderwidth = 1;
		this.bgcolor = vec4("#202020");
		this.bordercolor = vec4("#202020");
		this.padding = 0;
		this.margin = vec4(0,10,0,0);
	})


	define.class(this, 'ClassDocView', function($ui$, view){

		this.attributes = {
			// If collapsible is true, the render function will build a foldcontainer around this class. This is used for recursion levels > 0 of the docviewer class.
			collapsible: Config({type: Boolean, value:false}),
			// the class_doc structure to display.
			class_doc: Config({type: Object})
		}

		this.flexdirection = "column"
		this.flexwrap = "nowrap"

		this.bgcolor = NaN

		this.BuildGroup = function (inputarray, title, icon, color, blocktype){
			if (!blocktype) blocktype = "attribute"
			var subs = []

			for (var i = 0;i< inputarray.length;i++){
				subs.push(this.outer.ClassDocItem({blocktype:blocktype, item: inputarray[i]}))
				if (i< inputarray.length -1 ) subs.push(this.outer.dividerline());
			}

			return foldcontainer(
					{
						collapsed:true, bordercolor:"#202020",bgcolor:NaN,
						basecolor:color, icon:icon, title:title ,flex:1, fontsize: 15,margin: vec4(10,0,0,20), fgcolor: "white" },
						view({flexdirection: "column", flex: 1, bgcolor:NaN
					}, subs)
				);
		}

		this.render = function(){
			var body = [];
			var res =[];
			var class_doc = this.class_doc;
			if (!this.class_doc) return [];

			if (!this.collapsible ){
				body.push(view({bgcolor:NaN},[icon({bgcolor:NaN,fontsize: 38, icon:"cube", fgcolor: "White" }),label({bgcolor:NaN,text:class_doc.class_name,fontsize: 30,margin: vec4(10,10,0,20), fgcolor: "White" })]));
			}

			if (class_doc.base_class_chain.length> 0){
				body.push(view({bgcolor:NaN, margin:vec4(14)}, class_doc.base_class_chain.map(function(r){
					return [
						icon({bgcolor:NaN,icon:"arrow-right", fgcolor:"#f0f0f0", fontsize:15, margin:vec4(2)})
						,gbutton({margin: vec4(0),padding:vec4(10,0,10,0), text:r.name, fontsize:10, click: function(){this.screen.locationhash = {path: '$root'  + r.path};}.bind(this)})
					]
				}.bind(this))));
			}

			if (class_doc.body_text.length > 0) {
				body.push(markdown({bgcolor:NaN,body:class_doc.body_text, margin: vec4(10,0,10,10), fontcolor: "white" }));
			}

			res.push(view({bgcolor:NaN,flexdirection:"column", margin: vec4(10,0,0,20)}, body));

			if(class_doc.examples.length >0) res.push(this.BuildGroup(class_doc.examples, "Examples", "flask", "#303030", "example"));
			if(class_doc.attributes.length >0) res.push(this.BuildGroup(class_doc.attributes, "Attributes", "gears", "#303000"));
			if(class_doc.state_attributes.length >0) res.push(this.BuildGroup(class_doc.state_attributes, "State Attributes", "archive", "#300000"));
			if(class_doc.events.length >0) res.push(this.BuildGroup(class_doc.events, "Events", "plug", "#300033"));

			if (class_doc.inner_classes.length > 0){
				var classes = []
				for (var a in class_doc.inner_classes){
					classes.push(this.outer.ClassDocView({collapsible:true, class_doc: class_doc.inner_classes[a]}))
				}
				res.push(foldcontainer({bgcolor:NaN,bordercolor:"#202020",collapsed:true,  basecolor:"#002000", icon:"cubes", title:"Inner classes" , fontsize: 15,margin: vec4(10,0,0,20), fgcolor: "white" }, view({flexdirection: "column", flex: 1, bgcolor:"#404040"}, classes)));
			}

			if(class_doc.methods.length >0) res.push(this.BuildGroup(class_doc.methods, "Methods", "paw", "#000030", "function"));


			if (this.collapsible){

				return foldcontainer({bgcolor:NaN,bordercolor:"#202020",basecolor:"#002000",collapsed:true,icon:"cube", title:class_doc.class_name, fontsize: 15},view({bgcolor:NaN, flexdirection:"column", flex:1},res));
			}

			return res;
		}
	})

	this.render = function(){
		var functions = [];
		var res = [];
		var R = this.classconstr// 	require("$classes/dataset")
		if(typeof(R) === "string") {
			return [markdown({bgcolor:NaN, body: " " + R.toString()})]
		}
		else if(typeof(R) === 'function'){

			var class_doc = parseDoc(R)

			return [
				this.ClassDocView({class_doc:class_doc})

			]
		}

	}

	var docviewer = this.constructor;
	// Show the documentation for a dreemgl class.
	this.constructor.examples = {
		Usage:function(){
			return [docviewer({classconstr: docviewer})]
		}
	}
})
