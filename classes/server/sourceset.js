/* Copyright 2015 Teem2 LLC. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.  
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing, 
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. 
   See the License for the specific language governing permissions and limitations under the License.*/

define.class(function(require, $server$, dataset){
	// Sourceset is a dataset-api on source
	var jsparser = require('$system/parse/onejsparser')

	this.atConstructor = function(source){
		if(source) this.parse(source)
	}
	
	// convert a string in to a meaningful javascript object for this dataset. The default is JSON, but you could use this function to accept any format of choice.
	this.parse = function(source){
		// lets create an AST
		this.ast = jsparser.parse(source)
		// we need to find the render function in the composition root
		// so how shall we do that.
		// well.. 
		// lets write the code
		function findRenderFunction(ast){
			var steps = ast.steps[0].body.steps
			for(var i = 0; i < steps.length; i++){
				var step = steps[i]
				if(step.type === 'Assign' && step.left.type === 'Key' &&
					step.left.key.name === 'render'){
					return step.right
				}
			}
		}
		
		function findReturnArray(body){
			var steps = body.steps
			for(var i = 0; i < steps.length; i++){
				var step = steps[i]
				if(step.type === 'Return'){
					return step.arg
				}
			}
		}

		var render = findRenderFunction(this.ast)
		// lets find the return array
		var ret = findReturnArray(render.body)
			
		this.data = {name:'root', node:ret.elems, children:[]}
		// now we need to walk this fucker.
		function walkTree(array, output){
			for(var i = 0; i < array.length; i++){
				var item = array[i]

				if(item.type === 'Object'){
					// lets put some props on there
					continue
				}
				if(item.type !== 'Call') continue
				var name 
				if(item.fn.type === 'Key'){
					name = 'this.' + item.fn.key.name
				}
				else{
					name = item.fn.name
				}
				var child = {
					name: name,
					node: item,
					children:[]
				}
				output.children.push(child)
				walkTree(item.args, child)
			}
		}
		walkTree(ret.elems, this.data)

		//	Call->args->object
		//console.log(this.calltree)
		// cal something
		this.notifyAssignedAttributes()
	}

	// convert an object in to a string. Defaults to standard JSON, but you could overload this function to provide a more efficient fileformat. Do not forget to convert the JSONParse function as well.
	this.stringify = function(data /*Object*/) /*String*/ {

	}
})