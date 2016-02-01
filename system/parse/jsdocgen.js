/* Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
 You may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
 either express or implied. See the License for the specific language governing permissions and limitations under the License.*/

define.class(function(require, exports){

	exports.parseDoc = function parseDoc(constructor){
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

		if (!proto.constructor.body) {
			return;
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
						if (attr.type && attr.type.name) typename = attr.type.name.toString()

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

					method.body_text = grabFirstCommentAbove(step.cmu)

					for(var p in stepright.params){
						var param = stepright.params[p]
						var paramname = param.id.name
						var paramtag = '<' + paramname + '>'

						var pbody_text = []

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

})
