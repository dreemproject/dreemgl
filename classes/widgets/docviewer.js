/* Copyright 2015 Teem2 LLC. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.  
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing, 
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, 
   either express or implied. See the License for the specific language governing permissions and limitations under the License.*/


define.class(function(require, $ui$, view, foldcontainer, label, button, icon, $widgets$, markdown, jsviewer){
	
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
		this.bg = 0
		this.bgcolor = "red" ;
		// the item to display. 
		// An "attribute" item can have name, body_text, defvalue and type properties.
		// A "function" item can have name, params and body_text properties.
		this.attributes = {
			item: Config({type: Object}),
			// the type of this display block. Accepted values: "function", "attribute"
			blocktype: Config({type:String, value:"function"})
		}
		this.flex =1 ;
		//this.bgcolor = vec4("#ffffff");
		this.margin = 4;
		this.padding = 4;
		this.flexdirection = "column" ;
		this.flexwrap = "nowrap"

		this.render = function(){	
			var res = [];
			if (this.blocktype === "function"){
				var functionsig = "()"
				if (this.item.params && this.item.params.length > 0) { 
					functionsig = "(" + this.item.params.map(function(a){return a.name}).join(", ") + ")";
				}
				res.push(label({bg:0,margin:vec4(2),text: this.item.name + functionsig , fontsize: 20, fgcolor: "black"}));
			}
			else{
				var sub = [];
				
				if (this.item.type){
					sub.push(label({bg:0,margin:vec4(2),text: "type: "+ this.item.type, fontsize: 15, fgcolor: "white"}));
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
							view({bg:0},
								[
									label({margin:vec4(2),text: "default:", bg:0, fontsize: 15, fgcolor: "white"}),
									view({bg:0,bordercolor: "#808080", borderwidth: 1, cornerradius:4, bgcolor: this.item.defvalue, padding: vec4(8,3,8,3)},
										label({bg:0,fgcolor: color , fontsize: 15, bgcolor:"transparent" , text:labeltext})
									)
								]
							));
					}
					else{
						if (this.item.type === "String"){
							sub.push(label({bg:0,margin:vec4(2),text: "default: \""+ this.item.defvalue.toString() + "\"" , fontsize: 15, fgcolor: "#404040"}))
						}else{
							sub.push(label({bg:0,margin:vec4(2),text: "default: "+ this.item.defvalue.toString(), fontsize: 15, fgcolor: "#404040"}))
						}
					}
				}
				
				var title = label({bg:0,margin:vec4(2),text: this.item.name, fontsize: 20, fgcolor: "white"})
				
				res.push(view({bg:0,flex: 1,alignitems:"flex-start",justifycontent:"space-between"},[title,view({bg:0,alignself:"flex-start",alignitems:"flex-end",  flexdirection:"column", alignitems:"flex-end" },sub)]));
			}
			
			if (this.item.body_text){
				for(var t in this.item.body_text){
					res.push(label({bg:0,text: this.item.body_text[t], fgcolor: "white", fontsize: 14, margin: vec4(10,0,10,5)}));
				}
			}
			
			if (this.item.params && this.item.params.length > 0){
				res.push(label({ bg:0,fgcolor:"#808080", margin:vec4(2,0,4,4), text:"parameters:" }));
				for (var a in this.item.params){	
					var parm = this.item.params[a];
					var left = label({bg:0, fgcolor:"white", margin:vec4(10,0,4,4), text:parm.name});
					var right;
					
					if (parm.body_text && parm.body_text.length > 0){
						right= view({flex: 0.8},parm.body_text.map(function(a){return label({fgcolor:"#f0f0f0", text:a})}))
					} else {
						right = view({flex: 1.0});
					}
					res.push(view({bg:0,height:1, borderwidth: 1, bordercolor:"#e0e0e0", padding: 0}));
					res.push(view({bg:0,flexdirection:"row"},[left, right]));
				}
				res.push(view({bg:0,height:1, borderwidth: 1, bordercolor:"#e0e0e0", padding: 0}));
			}
			
			if (this.blocktype === "example"){
				res.push(				
					view({flexdirection:"row", flex:1, padding: vec4(2), bgcolor: "#f0f0f0"}
							,view({bg:0,flex: 1, borderwidth: 1, flexdirection:"column", padding: vec4(4), bordercolor: "#e0e0e0", bgcolor: "#f0f0f0"}
								,label({fgcolor:"white", bg:0,text:"Code", margin:vec4(10)})
								,jsviewer({margin:vec4(0), wrap:true, source:this.item.examplefunc.toString(), padding:vec4(4), fontsize: 14, bgcolor:"#000030", multiline: true})
							)
							,view({bg:0,flex: 1, borderwidth: 1, flexdirection:"column", padding: vec4(4), bordercolor: "#e0e0e0", bgcolor: "#f0f0f0" } 
								,label({fgcolor:"white",bgcolor:"transparent",  text:"Live demo", margin:vec4(10)})								
								,this.item.examplefunc()
							)
					)
				);
			}
			return res;
		}
	});

	// Build a documentation structure for a given constructor function
	this.parseDoc = function parseDoc(constructor) {
		if (!constructor) return

		if (!this.BlankDoc) {
			// Build a minimal correct version of the ClassDoc structure
			this.BlankDoc = function BlankDoc(){
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
		}

		var class_doc = this.BlankDoc()

		var proto = constructor.prototype

		if (!proto) {
			//xxx console.log('this has do constructor, what do?', constructor)
			return class_doc;
		}

		var p = constructor
		
		// build parent chain
		while(p) {
			if (p.prototype) {
				var prot = Object.getPrototypeOf(p.prototype);
				if (prot) {
					p = prot.constructor;
					class_doc.base_class_chain.push({name:p.name, path:p.module? (p.module.id? p.module.id:""):"", p: p});
				} else {
					p = null;
				}
			} else {
				p = null;
			}
		}
		
		class_doc.class_name = proto.constructor.name

		if (!this.Parser) {
			this.Parser = require("$system/parse/onejsparser")
		}

		// ok lets add the comments at the top of the class
		var ast = this.Parser.parse(proto.constructor.body.toString());

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

		var classcomment = grabFirstCommentBelow(body_steps[0].cmu)
		if (classcomment) {
			if (!class_doc.body_text) {
				class_doc.body_text = []
			}
			for (i=0;i<classcomment.length;i++) {
				class_doc.body_text.push(classcomment[i]);
			}
		}

		for (var i = 0; i < body_steps.length; i++) {				
			var step = body_steps[i]

			if(step.type === 'Assign'){
				if(step.left.type === 'Key' && step.left.object.type === 'This' && step.left.key.name === 'attributes' && step.right.type === 'Object'){
					for(var j = 0; j < step.right.keys.length; j++){
						var key = step.right.keys[j]
						var attrname = key.key.name
						var attr = proto._attributes[attrname]
						if (!attr) {
							//TODO not sure why this one has no name sometimes, plx fix
							continue;
						}

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

						var pbody_text = [];
						if (param.cm1) {
							for (var k = 0; k < param.cm1.length;k++) {
								if (param.cm1[k] != 1) {
									pbody_text.push(param.cm1[k])
								}
							}
						}

						param = {name: paramname, body_text: pbody_text};

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
		
		this.bg = 0

		this.BuildGroup = function (inputarray, title, icon, color, blocktype){
			if (!blocktype) blocktype = "attribute"
			var subs = []
			
			for (var i = 0;i< inputarray.length;i++){
				subs.push(this.outer.ClassDocItem({blocktype:blocktype, item: inputarray[i]}))
				if (i< inputarray.length -1 ) subs.push(this.outer.dividerline());
			}
			
			return foldcontainer(
					{
						collapsed:true, bordercolor:"#202020",bg:0,
						basecolor:color, icon:icon, title:title ,flex:1, fontsize: 20,margin: vec4(10,0,0,20), fgcolor: "white" },
						view({flexdirection: "column", flex: 1, bg:0
					}, subs)
				);
		}
		
		this.render = function(){
			var body = [];
			var res =[];
			var class_doc = this.class_doc;
			if (!this.class_doc) return [];
			
			if (!this.collapsible ){
				body.push(view({bg:0},[icon({bg:0,fontsize: 38, icon:"cube", fgcolor: "black" }),label({bg:0,text:class_doc.class_name,fontsize: 30,margin: vec4(10,10,0,20), fgcolor: "black" })]));
			}

			if (class_doc.base_class_chain.length> 0){
				body.push(view({bg:0}, class_doc.base_class_chain.map(function(r){
					return [
						icon({bg:0,icon:"arrow-right", fgcolor:"#f0f0f0", fontsize:15, margin:vec4(2)})
						,button({margin: vec4(2),padding:vec4(3), text:r.name, fontsize:12, click: function(){this.screen.locationhash = {path: '$root'  + r.path};}.bind(this)})
					]
				}.bind(this))));
			}
		
			if (class_doc.body_text.length > 0) {
				body.push(markdown({bg:0,body:class_doc.body_text,fontsize: 14, margin: vec4(10,0,10,10), fgcolor: "white" }));
			}

			res.push(view({bg:0,flexdirection:"column", margin: vec4(10,0,0,20)}, body));
		
			if(class_doc.examples.length >0) res.push(this.BuildGroup(class_doc.examples, "Examples", "flask", "#e0e0e0", "example"));
			if(class_doc.attributes.length >0) res.push(this.BuildGroup(class_doc.attributes, "Attributes", "gears", "#f0f0c0"));
			if(class_doc.state_attributes.length >0) res.push(this.BuildGroup(class_doc.state_attributes, "State Attributes", "archive", "#f0c0c0"));
			if(class_doc.events.length >0) res.push(this.BuildGroup(class_doc.events, "Events", "plug", "#f0c0f0"));
					
			if (class_doc.inner_classes.length > 0){
				var classes = []
				for (var a in class_doc.inner_classes){
					classes.push(this.outer.ClassDocView({collapsible:true, class_doc: class_doc.inner_classes[a]}))				
				}
				res.push(foldcontainer({bg:0,bordercolor:"#202020",collapsed:true,  basecolor:"#c0f0c0", icon:"cubes", title:"Inner classes" , fontsize: 20,margin: vec4(10,0,0,20), fgcolor: "white" }, view({flexdirection: "column", flex: 1}, classes)));
			}
		
			if(class_doc.methods.length >0) res.push(this.BuildGroup(class_doc.methods, "Methods", "paw", "#c0c0f0", "function"));
			
			
			if (this.collapsible){
				
				return foldcontainer({bg:0,bordercolor:"#202020",basecolor:"#c0f0c0",collapsed:true,icon:"cube", title:class_doc.class_name},view({bg:0, flexdirection:"column", flex:1},res));
			}
			
			return res;	
		}
	})

	this.printJSDuck = function(class_doc, parentclass) {
		var i, j, str;
		var output = [];

		output.push('/**');
		var classname = class_doc.class_name;
		if (parentclass) {
			classname = parentclass + '.' + classname
		}
		output.push(' * @class ' + classname);
		if (class_doc.base_class_chain) {
			var base = class_doc.base_class_chain[0];
			if (base && base.name) {
				output.push(' * @extends ' + base.name);
			}
		}
		if (class_doc.body_text) {
			for (i=0; i < class_doc.body_text.length; i++) {
				output.push(' * ' + class_doc.body_text[i]);
			}
		}

		output.push(' */');
		var attrs = [];
		if (class_doc.attributes) {
			for (i=0; i < class_doc.attributes.length; i++) {
				var attr = class_doc.attributes[i];
				if (attr.body_text) { // && attr.body_text.length
					attrs.push(attr.name);
					output.push('/**');
					var defval = attr.defvalue;
					if (typeof(defval) === 'function') {
						defval = undefined;
					}
					if (defval) {
						output.push(' * @attribute {' +attr.type + '} [' + attr.name + '="' + defval + '"]');
					} else {
						output.push(' * @attribute {' +attr.type + '} ' + attr.name);
					}
					for (j=0;j < attr.body_text.length; j++) {
						str = attr.body_text[j];
						output.push(' * ' + str);
					}
					output.push(' */');
				}
			}
		}

		if (class_doc.methods) {
			for (i=0; i < class_doc.methods.length; i++) {
				var meth = class_doc.methods[i];
				if (meth.body_text) { //  && meth.body_text.length
					if (meth && meth.name) {
						output.push('/**');
						output.push(' * @method ' + meth.name);
						//if (meth.name.startsWith('on')) {
						//	output.push(' * @event ' + meth.name);
						//} else {
						//	output.push(' * @method ' + meth.name);
						//}

						for (j=0;j < meth.body_text.length; j++) {
							str = meth.body_text[j];
							output.push(' * ' + str);
						}

						if (meth.params) {
							for (j=0;j < meth.params.length; j++) {
								var param = meth.params[j];

								var pbody = '';
								if (param.body_text && param.body_text.length) {
									pbody = param.body_text.join('; ')
								}
								var typegrabber = /^([^\{}]*)(\{[^\}]+\})\s+(.*)$/;
								var result = typegrabber.exec(pbody);
								var ptype = ' ';
								if (result) {
									ptype = ' ' + result[2] + ' ';
									pbody = (result[1] + result[3]).trim();
								}

								output.push(' * @param' + ptype + param.name);
								if (pbody.length) {
									output.push(' * ' + pbody);
								}
							}
						}

						output.push(' */');
					}
				}
			}
		}

		if (class_doc.events && class_doc.events.length) {
			for (i = 0; i < class_doc.events.length;i++) {
				var event = class_doc.events[i];
				output.push('/**');
				output.push(' * @event ' + event.name);
				for (j=0;j < event.body_text.length; j++) {
					str = event.body_text[j];
					output.push(' * ' + str);
				}
				output.push(' */');
			}
		}
		if (class_doc.inner_classes && class_doc.inner_classes.length) {
			for (i = 0; i < class_doc.inner_classes.length; i++) {
				var inner = class_doc.inner_classes[i];
				output = output.concat(this.printJSDuck(inner, classname));
			}
		}
		if (class_doc.examples && class_doc.examples.length) {
			console.log('EXAMPLES', class_doc.examples)
		}
		if (class_doc.state_attributes && class_doc.state_attributes.length) {
			console.log('STATE', class_doc.state_attributes)
		}

		return output;

	};

	this.renderToJSDuck = function(R) {

		var class_doc = parseDoc(R)

		var pr = this.printJSDuck(class_doc).join('\n');

//		console.log(pr)

		return pr;

	}
	
	this.render = function(){	
		var functions = [];
		var res = [];
		var R = this.classconstr// 	require("$classes/dataset")
		if(typeof(R) === "string") {
			return [markdown({bg:0, body: " " + R.toString()})]
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