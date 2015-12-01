/* Copyright 2015 Teem2 LLC. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.  
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing, 
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, 
   either express or implied. See the License for the specific language governing permissions and limitations under the License.*/


define.class(function(require, $containers$, view, foldcontainer, $controls$, label, button, icon, $widgets$, markdown, codeviewer){
	
	var Parser = require("$system/parse/onejsparser")

	this.bgcolor = vec4("white")
	this.padding = 20
	this.flexdirection = "column"
	this.alignitems = "stretch"
	this.flexwrap = "none" 
	this.mode = "2D"
	
	this.attributes = {
		// the class for which to create the documentation. If a string is assigned, the model will be interpreted as a markdown text document.
		class:{type:Object}
	}

	define.class(this, 'ClassDocItem', function($containers$, view){
		this.bg = 0
		// the item to display. 
		// An "attribute" item can have name, body_text, defvalue and type properties.
		// A "function" item can have name, params and body_text properties.
		this.attributes = {
			item: {type: Object},
			// the type of this display block. Accepted values: "function", "attribute"
			blocktype: {type:String, value:"function"}
		}

		//this.bgcolor = vec4("#ffffff");
		this.margin = 4;
		this.padding = 4;
		this.flexdirection = "column" ;
		this.flexwrap = "none"

		this.render = function(){	
			var res = [];
			if (this.blocktype === "function"){
				var functionsig = "()"
				if (this.item.params && this.item.params.length > 0) { 
					functionsig = "(" + this.item.params.map(function(a){return a.name}).join(", ") + ")";
				}
				res.push(label({margin:vec4(2),text: this.item.name + functionsig , fontsize: 20, fgcolor: "black"}));
			}
			else{
				var sub = [];
				
				if (this.item.type){
					sub.push(label({margin:vec4(2),text: "type: "+ this.item.type, fontsize: 15, fgcolor: "#404040"}));
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
							view({},
								[
									label({margin:vec4(2),text: "default:", fontsize: 15, fgcolor: "#404040"}),
									view({bordercolor: "#808080", borderwidth: 1, cornerradius:4, bgcolor: this.item.defvalue, padding: vec4(8,3,8,3)},
										label({fgcolor: color , fontsize: 15, bgcolor:"transparent" , text:labeltext})
									)
								]
							));
					}
					else{
						if (this.item.type === "String"){
							sub.push(label({margin:vec4(2),text: "default: \""+ this.item.defvalue.toString() + "\"" , fontsize: 15, fgcolor: "#404040"}))
						}else{
							sub.push(label({margin:vec4(2),text: "default: "+ this.item.defvalue.toString(), fontsize: 15, fgcolor: "#404040"}))
						}
					}
				}
				
				var title = label({margin:vec4(2),text: this.item.name, fontsize: 20, fgcolor: "black"})
				
				res.push(view({flex: 1},[title,view({flex: 1, flexdirection:"column", alignitems:"flex-end" },sub)]));
			}
			
			if (this.item.body_text){
				for(var t in this.item.body_text){
					res.push(label({text: this.item.body_text[t], fgcolor: "gray", fontsize: 14, margin: vec4(10,0,10,5)}));
				}
			}
			
			if (this.item.params && this.item.params.length > 0){
				res.push(label({ fgcolor:"#5050dd", margin:vec4(2,0,4,4), text:"parameters:" }));
				for (var a in this.item.params){	
					var parm = this.item.params[a];
					var left = label({ fgcolor:"black", margin:vec4(10,0,4,4), text:parm.name});
					var right;
					
					if (parm.body_text && parm.body_text.length > 0){
						right= view({flex: 0.8},parm.body_text.map(function(a){return label({fgcolor:"gray", text:a})}))
					} else {
						right = view({flex: 1.0});
					}
					res.push(view({height:1, borderwidth: 1, bordercolor:"#e0e0e0", padding: 0}));
					res.push(view({ flexdirection:"row"},[left, right]));
				}
				res.push(view({height:1, borderwidth: 1, bordercolor:"#e0e0e0", padding: 0}));
			}
			
			if (this.blocktype === "example"){
				res.push(				
					view({flexdirection:"row",  flex:1, padding: vec4(2)}
							,view({flex: 1, borderwidth: 1, flexdirection:"column", padding: vec4(4), bordercolor: "#e0e0e0"}
								,label({fgcolor:"black", text:"Code", margin:vec4(10)})
								,codeviewer({margin:vec4(10), wrap:true, source:this.item.examplefunc.toString(), padding:vec4(4), fontsize: 14, bgcolor:"#000030", multiline: true})
							)
							,view({flex: 1, borderwidth: 1, flexdirection:"column", padding: vec4(4), bordercolor: "#e0e0e0", bgcolor: "gray" } 
								,label({fgcolor:"white",bgcolor:"transparent",  text:"Live demo", margin:vec4(10)})								
								,this.item.examplefunc()
							)
					)
				);
			}
			return res;
		}
	});

	// Build a minimal correct version of the ClassDoc structure
	function BlankDoc(){
		return {
			class_name:"",
			body_text: [], // array with strings. each string = paragraph
			examples: [],
			events: [],
			attributes: [],
			state_attributes: [],
			methods: [],
			inner_classes: [],
			base_class_chain: []
		}
	}
	
	// Build a documentation structure for a given constructor function
	function parseDoc(constructor) {
		if (!constructor) return

		var proto = constructor.prototype
		var class_doc = BlankDoc()
		var p = constructor
		
		// build parent chain
		while(p) {
			var prot = Object.getPrototypeOf(p.prototype);
			if (prot) {
				p = prot.constructor; 					
				class_doc.base_class_chain.push({name:p.name, path:p.module? (p.module.id? p.module.id:""):"", p: p});
			} else {
				p = null;
			}				
		}
		
		class_doc.class_name = proto.constructor.name

		// ok lets add the comments at the top of the class
		var ast = Parser.parse(proto.constructor.body.toString());

		// lets process the inner classes
		// lets do an ast match what we want is
		var class_body = ast.steps[0]

		function grabFirstCommentBelow(commentarray){
			var res = []
			if (!commentarray) return res
			var last1 = false
			for(var i = 0; i < commentarray.length; i++) {
				var com = commentarray[i]
				if (com === 1){
					if(last1 === true){
						break
					} 
					else {
						last1 = true
					}
				} 
				else {
					last1 = false
					res.push(com)
				}
			}		
			return res
		}

		function grabFirstCommentAbove(commentarray){
			var res = []
			if (!commentarray) return res
			var last1 = false
			for (var i = commentarray.length -1;i>=0;i--) {
				var com = commentarray[i];
				if (com === 1){
					if(last1 === true){
						break
					} 
					else {
						last1 = true
					}
				} 
				else {
					last1 = false
					res.unshift(com.trim())
				}
			}
			return res
		}		
		var body_steps = class_body.body.steps

		if(!body_steps[0]) return class_doc

		grabFirstCommentBelow(body_steps[0].cmu)
		
		for (var i = 0; i < body_steps.length; i++) {				
			var step = body_steps[i]

			if(step.type === 'Assign'){
				if(step.left.type === 'Key' && step.left.object.type === 'This' && step.left.key.name === 'attributes' && step.right.type === 'Object'){
					for(var j = 0; j < step.right.keys.length; j++){
						var key = step.right.keys[j]
						var attrname = key.key.name
						var attr = proto._attributes[attrname]

						var cmt = grabFirstCommentAbove(key.cmu)
						var defvaluename = undefined
						if (attr.value){
							defvaluename = attr.value
						}

						var typename = "typeless";
						if (attr.type) typename = attr.type.name.toString()

						if(typename === 'Event'){
							class_doc.events.push({name: attrname, body_text: grabFirstCommentAbove(step.cmu)})
						}
						else{
							class_doc.attributes.push({name: attrname, type:typename, defvalue: defvaluename, body_text: grabFirstCommentAbove(key.cmu)})
						}
					}
				}
				if(step.left.type === 'Key' && step.left.object.type === 'Key' && step.left.object.object.type === 'This' && 
					step.left.object.key.name === 'constructor' && step.left.key.name === 'examples' && step.right.type === 'Object'){
					for(var j = 0; j < step.right.keys.length; j++){
						var key = step.right.keys[j]

						var example = {}
						example.body_text = grabFirstCommentAbove(key.cmu)

						var examplename = key.key.name
						example.name = examplename
						example.examplefunc = proto.constructor.examples[examplename]
						class_doc.examples.push(example)
					}
				}

				if(step.left.type === 'Key' && step.left.object.type === 'This' && step.right.type === 'Function'){
					var stepleft = step.left
					var method = {name:stepleft.key.name, params:[]};
					var stepright = step.right;

					method.body_text = grabFirstCommentAbove(step.cmu);
					
					for(var p in stepright.params){							
						var param = stepright.params[p];						
						var paramname = param.id.name; 		
						var paramtag = '<' + paramname  + '>';
						var param = {name: paramname, body_text: []}
						
						var remaining = [];
						for(var a in method.body_text){
							var L = method.body_text[a];
							if (L.indexOf(paramtag) === 0) {
								param.body_text.push(L.substr(paramtag.length).trim());
							}
							else{
								remaining.push(L);
							}
						}
						method.params.push(param)
						method.body_text = remaining
					}
					class_doc.methods.push(method)			
				}
			}
			else if (step.type ==="Call"){
				if (step.fn.object.type ==="Id"){
					if (step.fn.object.name === "define"){
						if (step.fn.key.name === "class"){
							var innerclassname = step.args[1].value
							var newclass = parseDoc(proto[innerclassname])
							newclass.class_name = innerclassname;
							newclass.body_text = grabFirstCommentAbove(step.cmu)
							class_doc.inner_classes.push(newclass)
						} 
					}
				}
			}
		}
		return class_doc
	}
	
	// This class will recursively expand a class_doc sturcture to an on-screen view.
	
	define.class(this, 'dividerline', function($containers$, view){
		this.height = 1;
		this.borderwidth = 1;
		this.bordercolor = vec4("#c0c0e0");
		this.padding = 0;
		this.margin = vec4(0,10,0,0);
	})
	
	
	define.class(this, 'ClassDocView', function($containers$, view){
	
		this.attributes = {
			// If collapsible is true, the render function will build a foldcontainer around this class. This is used for recursion levels > 0 of the docviewer class.	
			collapsible: {type: Boolean, value:false},
			// the class_doc structure to display. 
			class_doc: {type: Object}
		}

		this.flexdirection = "column"
		this.flexwrap = "none" 
		
		this.bg = 0

		this.BuildGroup = function (inputarray, title, icon, color, blocktype){
			if (!blocktype) blocktype = "attribute"
			var subs = []
			
			for (var i = 0;i< inputarray.length;i++){
				subs.push(this.outer.ClassDocItem({blocktype:blocktype, item: inputarray[i]}))
				if (i< inputarray.length -1 ) subs.push(this.outer.dividerline());
			}
			
			return foldcontainer(
					{collapsed:true, 
						attributes:{collapsed:{persist:true}},
						basecolor:color, icon:icon, title:title ,flex:1, fontsize: 20,margin: vec4(10,0,0,20), fgcolor: "white" }, 
						view({flexdirection: "column", flex: 1}, subs)
				);
		}
		
		this.render = function(){
			var body = [];
			var res =[];
			var class_doc = this.class_doc;
			if (!this.class_doc) return [];
			
			if (!this.collapsible ){
				body.push(view({},[icon({fontsize: 38, icon:"cube", fgcolor: "black" }),label({text:class_doc.class_name,fontsize: 30,margin: vec4(10,10,0,20), fgcolor: "black" })]));
			}

			if (class_doc.base_class_chain.length> 0){
				body.push(view({}, class_doc.base_class_chain.map(function(r){
					return [
						icon({icon:"arrow-right", fgcolor:"gray", fontsize:15, margin:vec4(2)})
						,button({margin: vec4(2),padding:vec4(3), text:r.name, fontsize:12, click: function(){this.screen.locationhash = {path: '$root'  + r.path};}.bind(this)})
					]
				}.bind(this))));
			}
		
			if (class_doc.body_text.length > 0) {
				body.push(markdown({body:class_doc.body_text,fontsize: 14, margin: vec4(10,0,10,10), fgcolor: "#303030" }));
			}

			res.push(view({flexdirection:"column", margin: vec4(10,0,0,20)}, body));
		
			if(class_doc.examples.length >0) res.push(this.BuildGroup(class_doc.examples, "Examples", "flask", "#e0e0e0", "example"));
			if(class_doc.attributes.length >0) res.push(this.BuildGroup(class_doc.attributes, "Attributes", "gears", "#f0f0c0"));
			if(class_doc.state_attributes.length >0) res.push(this.BuildGroup(class_doc.state_attributes, "State Attributes", "archive", "#f0c0c0"));
			if(class_doc.events.length >0) res.push(this.BuildGroup(class_doc.events, "Events", "plug", "#f0c0f0"));
					
			if (class_doc.inner_classes.length > 0){
				var classes = []
				for (var a in class_doc.inner_classes){
					classes.push(this.outer.ClassDocView({collapsible:true, class_doc: class_doc.inner_classes[a]}))				
				}
				res.push(foldcontainer({collapsed:true,  basecolor:"#c0f0c0", icon:"cubes", title:"Inner classes" , fontsize: 20,margin: vec4(10,0,0,20), fgcolor: "white" }, view({flexdirection: "column", flex: 1}, classes)));
			}
		
			if(class_doc.methods.length >0) res.push(this.BuildGroup(class_doc.methods, "Methods", "paw", "#c0c0f0", "function"));
			
			
			if (this.collapsible){
				
				return foldcontainer({basecolor:"#c0f0c0",collapsed:true,icon:"cube", title:class_doc.class_name},view({flexdirection:"column", flex:1},res));
			}
			
			return res;	
		}
	})
	
	this.render = function(){	
		var functions = [];
		var res = [];
		var R = this.class// 	require("$classes/dataset")
		if(typeof(R) === "string") {
			return [markdown({body: " " + R.toString()})]
		} 
		else if(typeof(R) === 'function'){
			var class_doc = parseDoc(R)		
			return [
				this.ClassDocView({class_doc:class_doc}),
			
			]
		}

	}

	var docviewer = this.constructor;
	// Show the documentation for a dreemgl class.
	this.constructor.examples = {
		Usage:function(){
			return [docviewer({class: docviewer})]		
		}
	}
})