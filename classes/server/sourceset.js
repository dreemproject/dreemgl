 /* Copyright 2015 Teem2 LLC. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.  
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing, 
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. 
   See the License for the specific language governing permissions and limitations under the License.*/

define.class(function(require, $server$, dataset){
	// Sourceset is a dataset-api on source
	var jsparser = require('$system/parse/onejsparser')
	var jsformatter = require('$system/parse/jsformatter')

	this.attributes = {
		change: Config({type:Event})
	}

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

	this.atConstructor = function(source){
		if(source) this.parse(source)
		this.last_source = source
	}
	
	this.fork = function(callback){
		this.undo_stack.push(this.last_source)
		this.redo_stack.length = 0
		callback()
		// lets reserialize
		this.last_source = this.stringify()
		this.process()
		this.notifyAssignedAttributes()
		// save to disk.
		this.emit('change')
	}

	this.addBlock = function(folder, classname){

		var id = 0
		var uname = classname + id
		while(uname in this.data.childnames){
			id++
			uname = classname + id
		}
		
		// add it to the deplist.
		var deps = this.ast.steps[0].params
		var $folder = '$'+folder.replace(/\//g,'$')+'$'
		
		var dir = '$$'
		for(var i = 0; i < deps.length; i ++){
			var name = deps[i].id.name
			if(name === $folder) break
		}
		if(i === deps.length){
			deps.push(
				{type:'Def',id:{type:'Id', name:$folder}},
				{type:'Def',id:{type:'Id', name:classname}}
			)
		}
		else{
			for(var j = i; j < deps.length; j ++){
				if(deps[j].id.name === classname) break
			}
			if(j === deps.length){
				deps.splice(i,0,
					{type:'Def',id:{type:'Id', name:classname}}
				)
			}
		}

		this.data.retarray.elems.push({
			type:"Call",
			fn:{type:"Id",name:classname},
			args:[{
				type:"Object",
				keys:[
					{
						key:{type:"Id",name:"name"}, 
					 	value:{type:"Value",kind:"string",value:uname}
					},
					{key:{type:"Id",name:"flowdata"}, value:genFlowDataObject({x:0,y:0})}
				]
			}]
		})
	}

	this.removeBlock = function(blockname){
		// lets remove this thing
		node = this.data.childnames[blockname]
		// lets find it
		var id = this.data.retarray.elems.indexOf(node.node)
		this.data.retarray.elems.splice(id, 1)
	}

	function genFlowDataObject(data){
		var obj = {
			type:"Object",
			keys:[]
		}
		for(var key in data){
			obj.keys.push({
				kind:"init",
				key:{type:"Id",name:key},
				value:{type:"Value",kind:"num",value:data[key]}
			})
		}
		return obj
	}

	this.setFlowData = function(block, data){
		var target = this.data.childnames[block]
		var fdn = target.flowdatanode

		fdn.value = genFlowDataObject(data)
	}

	this.deleteWire = function(sblock, soutput, tblock, tinput){
		var target = this.data.childnames[tblock]
		if(!target) return console.error("cannot find target " + tblock)
		// ok we need to do keys
		var props = target.propobj.keys
		for(var i = 0; i < props.length; i++){
			if(props[i].key.name == tinput){
				props.splice(i,1)
				break
			}
		}
	}

	this.createWire = function(sblock, soutput, tblock, tinput){
		var target = this.data.childnames[tblock]
		if(!target) return console.error("cannot find target " + tblock)
		// ok we need to do keys
		var props = target.propobj.keys
		for(var i = 0; i < props.length; i++){
			if(props[i].key.name == tinput) break
		}

		// create a new one
		var to = {
			type:"Call",
			fn:{
				type:"Id",
				name:"wire"
			},
			args:[{
				type:"Value",
				kind:"string",
				value:'this.rpc.' + sblock + '.' + soutput
			}]
		}

		if(i === props.length){
			props.push({
				key:{name:tinput, type:'Id'},
				value:to
			})
		}
		else{
			props[i].value.value = to
		}
	}

	this.process = function(){
		var resolver = {}

		var deps = this.ast.steps[0].params
		var args = this.classconstr.module.factory.body.class_args

		for(var i = 0; i < deps.length; i++){
			resolver[ deps[i].id.name ] = args[i]
		}

		// we need to find the render function in the composition root
		// so how shall we do that.
		// well.. 
		// lets write the code
		
		// lets find the return array
		var ret = findReturnArray(findRenderFunction(this.ast).body)
			
		var data = this.data = {
			retarray: ret,
			name:'root', 
			node:ret.elems, 
			children:[],
			childnames:{}
		}
		
		// now we need to walk this fucker.
		function walkArgs(array, output){
			for(var i = 0; i < array.length; i++){
				var item = array[i]
				if(item.type === 'Object'){
					output.propobj = item
					// lets put some props on there
					// whats the name of this thing?
					var keys = item.keys
					for(var j = 0; j < keys.length; j++){
						var key = keys[j]
						var name = key.key.name
						var value = key.value
						if(name === 'flowdata'){
							var fdoutput = output.flowdata = {}
							output.flowdatanode = key
							var flowdata = value

							for(var k = 0; k < flowdata.keys.length; k++){
								var fditem = flowdata.keys[k]
								var value 
								if(fditem.value.type === 'Unary'){
									value = fditem.value.op === '-'? -fditem.value.arg.value: fditem.value.arg.value
								}
								else{
									value = fditem.value.value
								}
								fdoutput[fditem.key.name] = value
							}
						}
						else if(name === 'name'){
							output.name = key.value.value
							data.childnames[output.name] = output
						}
						else if(key.value.type === 'Call' && key.value.fn.name === 'wire'){
							var wire = key.value
							var str = wire.args[0].value

							if(str.indexOf('this.rpc') !== 0) continue

							var parts = str.slice(9).split('.')
							if(parts.length !== 2) continue
							if(!output.wires) output.wires = []
							output.wires.push({
								from:parts[0],
								output:parts[1],
								input:name
							})
						}
					}
					continue
				}
			}
		}

		function walkComposition(array, output){
			for(var i = 0; i < array.length; i++){
				var item = array[i]

				if(item.type !== 'Call') continue
				var classname 
				if(item.fn.type === 'Key' && item.fn.object.type === 'This'){
					classname = 'this.' + item.fn.key.name
				}
				else if(item.fn.type === 'Id'){
					classname = item.fn.name
				}
				else {
					console.error(classname = "Please implement in sourceset.js")
				}

				var child = {
					classname: classname,
					node: item,
					children:[],
					inputs:[],
					outputs:[]
				}
				
				// we haz classname.
				var clazz = resolver[classname]
				var attribs = clazz.prototype._attributes
				for(var key in attribs){
					var attrib = attribs[key]
					
					if(attrib.flow){
						var con = {
							name: key,
							title: key,
							type: attrib.type,
							attrib: attrib
						}
						if(attrib.flow === 'in'){
							child.inputs.push(con)
						}
						else if(attrib.flow === 'out'){
							child.outputs.push(con)
						}
					}
				}

				output.children.push(child)
				walkArgs(item.args, child)
				//walkTree(item.args, child)
			}
		}
		walkComposition(ret.elems, this.data)
	}

	// convert a string in to a meaningful javascript object for this dataset. The default is JSON, but you could use this function to accept any format of choice.
	this.parse = function(classconstr){
		var source = classconstr.module.factory.body.toString()
		this.classconstr = classconstr

		// lets create an AST
		this.ast = jsparser.parse(source)
		this.process()
		this.notifyAssignedAttributes()
	}

	// convert an object in to a string. Defaults to standard JSON, but you could overload this function to provide a more efficient fileformat. Do not forget to convert the JSONParse function as well.
	this.stringify = function(){
		var buf = {
			out:'',
			charCodeAt: function(i){return this.out.charCodeAt(i)},
			char_count:0
		}
		jsformatter.walk(this.ast, buf, function(str){
			buf.char_count += str.length
			buf.out += str
		})
		return buf.out
	}
})