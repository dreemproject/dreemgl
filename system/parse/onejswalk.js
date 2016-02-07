/* Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others. 
   You may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 
   Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
   either express or implied. See the License for the specific language governing permissions and limitations under the License.*/
// self generating onejs walker utility class, run with nodejs to regenerate

if(typeof process !== 'undefined' && require.main === module){
	var require = require('../base/define')
	var defs = require('./onejsdef.js')
	var fs = require('fs')
	// read self
	var head = fs.readFileSync(module.filename).toString().match(/^[\S\s]*\/\/ generated/)[0]
	// the template for the generated bottom part
	var template = function(){
		define.class(function(){
			this.walk = function(node, parent, state){
				if(!node) return
				var fn = this[node.type]
				if(!fn) throw new Error("Cannot find type " + node.type)
				fn.call(this, node, parent, state)
			}
			BODY
		})
	}.toString().match(/function\s*\(\)\{\n([\S\s]*)\}/)[1].replace(/(^|\n)\t\t/g,'\n')

	var out = '\n'	
	for(var key in defs){
		out += '	this.' + key + ' = function(node, parent, state){\n'
		var def = defs[key]
		for(var sub in def){
			var type = def[sub]
			if(type == 1) out += '		this.walk(node.' + sub + ', node, state)\n'
			else if(type == 2) out += '		var arr = node.' + sub + '\n\t\tif(arr) for(var i = 0, len = arr.length; i < len; i++) this.walk(arr[i], node, state)\n'
			else if(type == 3) out += '		var arr = node.' + sub + '\n\t\tif(arr) for(var i = 0, len = arr.length; i < len; i++) this.walk(arr[i].value, node, state)\n'
		}
		out += '	}\n\n'
	}
	fs.writeFileSync(module.filename, head + template.replace(/BODY/,out))
	console.log("Written " + module.filename)
}

// generated
define.class(function(){
	this.walk = function(node, parent, state){
		if(!node) return
		var fn = this[node.type]
		if(!fn) throw new Error("Cannot find type " + node.type)
		fn.call(this, node, parent, state)
	}
	
	this.Program = function(node, parent, state){
		var arr = node.steps
		if(arr) for(var i = 0, len = arr.length; i < len; i++) this.walk(arr[i], node, state)
	}

	this.Empty = function(node, parent, state){
	}

	this.Id = function(node, parent, state){
		this.walk(node.typing, node, state)
	}

	this.Value = function(node, parent, state){
	}

	this.This = function(node, parent, state){
	}

	this.Array = function(node, parent, state){
		var arr = node.elems
		if(arr) for(var i = 0, len = arr.length; i < len; i++) this.walk(arr[i], node, state)
	}

	this.Object = function(node, parent, state){
		var arr = node.keys
		if(arr) for(var i = 0, len = arr.length; i < len; i++) this.walk(arr[i].value, node, state)
	}

	this.Index = function(node, parent, state){
		this.walk(node.object, node, state)
		this.walk(node.index, node, state)
	}

	this.Key = function(node, parent, state){
		this.walk(node.object, node, state)
		this.walk(node.key, node, state)
	}

	this.ThisCall = function(node, parent, state){
		this.walk(node.object, node, state)
		this.walk(node.key, node, state)
	}

	this.Block = function(node, parent, state){
		var arr = node.steps
		if(arr) for(var i = 0, len = arr.length; i < len; i++) this.walk(arr[i], node, state)
	}

	this.List = function(node, parent, state){
		var arr = node.items
		if(arr) for(var i = 0, len = arr.length; i < len; i++) this.walk(arr[i], node, state)
	}

	this.Comprehension = function(node, parent, state){
		this.walk(node.for, node, state)
		this.walk(node.expr, node, state)
	}

	this.Template = function(node, parent, state){
		var arr = node.chain
		if(arr) for(var i = 0, len = arr.length; i < len; i++) this.walk(arr[i], node, state)
	}

	this.Break = function(node, parent, state){
		this.walk(node.label, node, state)
	}

	this.Continue = function(node, parent, state){
		this.walk(node.label, node, state)
	}

	this.Label = function(node, parent, state){
		this.walk(node.label, node, state)
		this.walk(node.body, node, state)
	}

	this.If = function(node, parent, state){
		this.walk(node.test, node, state)
		this.walk(node.then, node, state)
		this.walk(node.else, node, state)
	}

	this.Switch = function(node, parent, state){
		this.walk(node.on, node, state)
		var arr = node.cases
		if(arr) for(var i = 0, len = arr.length; i < len; i++) this.walk(arr[i], node, state)
	}

	this.Case = function(node, parent, state){
		this.walk(node.test, node, state)
		var arr = node.steps
		if(arr) for(var i = 0, len = arr.length; i < len; i++) this.walk(arr[i], node, state)
	}

	this.Throw = function(node, parent, state){
		this.walk(node.arg, node, state)
	}

	this.Try = function(node, parent, state){
		this.walk(node.try, node, state)
		this.walk(node.arg, node, state)
		this.walk(node.catch, node, state)
		this.walk(node.finally, node, state)
	}

	this.While = function(node, parent, state){
		this.walk(node.test, node, state)
		this.walk(node.loop, node, state)
	}

	this.DoWhile = function(node, parent, state){
		this.walk(node.loop, node, state)
		this.walk(node.test, node, state)
	}

	this.For = function(node, parent, state){
		this.walk(node.init, node, state)
		this.walk(node.test, node, state)
		this.walk(node.update, node, state)
		this.walk(node.loop, node, state)
	}

	this.ForIn = function(node, parent, state){
		this.walk(node.left, node, state)
		this.walk(node.right, node, state)
		this.walk(node.loop, node, state)
	}

	this.ForOf = function(node, parent, state){
		this.walk(node.left, node, state)
		this.walk(node.right, node, state)
		this.walk(node.loop, node, state)
	}

	this.ForFrom = function(node, parent, state){
		this.walk(node.right, node, state)
		this.walk(node.left, node, state)
		this.walk(node.loop, node, state)
	}

	this.ForTo = function(node, parent, state){
		this.walk(node.left, node, state)
		this.walk(node.right, node, state)
		this.walk(node.loop, node, state)
		this.walk(node.in, node, state)
	}

	this.Var = function(node, parent, state){
		var arr = node.defs
		if(arr) for(var i = 0, len = arr.length; i < len; i++) this.walk(arr[i], node, state)
	}

	this.TypeVar = function(node, parent, state){
		this.walk(node.typing, node, state)
		var arr = node.defs
		if(arr) for(var i = 0, len = arr.length; i < len; i++) this.walk(arr[i], node, state)
		this.walk(node.dim, node, state)
	}

	this.Struct = function(node, parent, state){
		this.walk(node.id, node, state)
		this.walk(node.struct, node, state)
		this.walk(node.base, node, state)
	}

	this.Define = function(node, parent, state){
		this.walk(node.id, node, state)
		this.walk(node.value, node, state)
	}

	this.Enum = function(node, parent, state){
		this.walk(node.id, node, state)
		var arr = node.enums
		if(arr) for(var i = 0, len = arr.length; i < len; i++) this.walk(arr[i], node, state)
	}

	this.Def = function(node, parent, state){
		this.walk(node.id, node, state)
		this.walk(node.init, node, state)
		this.walk(node.dim, node, state)
	}

	this.Function = function(node, parent, state){
		this.walk(node.id, node, state)
		this.walk(node.name, node, state)
		var arr = node.params
		if(arr) for(var i = 0, len = arr.length; i < len; i++) this.walk(arr[i], node, state)
		this.walk(node.rest, node, state)
		this.walk(node.body, node, state)
	}

	this.Return = function(node, parent, state){
		this.walk(node.arg, node, state)
	}

	this.Yield = function(node, parent, state){
		this.walk(node.arg, node, state)
	}

	this.Await = function(node, parent, state){
		this.walk(node.arg, node, state)
	}

	this.Unary = function(node, parent, state){
		this.walk(node.arg, node, state)
	}

	this.Binary = function(node, parent, state){
		this.walk(node.left, node, state)
		this.walk(node.right, node, state)
	}

	this.Logic = function(node, parent, state){
		this.walk(node.left, node, state)
		this.walk(node.right, node, state)
	}

	this.Assign = function(node, parent, state){
		this.walk(node.left, node, state)
		this.walk(node.right, node, state)
	}

	this.Update = function(node, parent, state){
		this.walk(node.arg, node, state)
	}

	this.Condition = function(node, parent, state){
		this.walk(node.test, node, state)
		this.walk(node.then, node, state)
		this.walk(node.else, node, state)
	}

	this.New = function(node, parent, state){
		this.walk(node.fn, node, state)
		var arr = node.args
		if(arr) for(var i = 0, len = arr.length; i < len; i++) this.walk(arr[i], node, state)
	}

	this.Call = function(node, parent, state){
		this.walk(node.fn, node, state)
		var arr = node.args
		if(arr) for(var i = 0, len = arr.length; i < len; i++) this.walk(arr[i], node, state)
	}

	this.Nest = function(node, parent, state){
		this.walk(node.fn, node, state)
		this.walk(node.body, node, state)
	}

	this.Class = function(node, parent, state){
		this.walk(node.id, node, state)
		this.walk(node.base, node, state)
		this.walk(node.body, node, state)
	}

	this.Signal = function(node, parent, state){
		this.walk(node.left, node, state)
		this.walk(node.right, node, state)
	}

	this.Quote = function(node, parent, state){
		this.walk(node.quote, node, state)
	}

	this.AssignQuote = function(node, parent, state){
		this.walk(node.left, node, state)
		this.walk(node.quote, node, state)
	}

	this.Rest = function(node, parent, state){
		this.walk(node.id, node, state)
	}

	this.Then = function(node, parent, state){
		this.walk(node.name, node, state)
		this.walk(node.do, node, state)
	}

	this.Debugger = function(node, parent, state){
	}

	this.With = function(node, parent, state){
		this.walk(node.object, node, state)
		this.walk(node.body, node, state)
	}


})
	