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
			this.walk = function(node, parent, state, index){
				if(!node) return
				var fn = this[node.type]
				if(!fn) throw new Error("Cannot find type " + node.type)
				fn.call(this, node, parent, state, index)
			}
			BODY
		})
	}.toString().match(/function\s*\(\)\{\n([\S\s]*)\}/)[1].replace(/(^|\n)\t\t/g,'\n')

	var out = '\n'
	for(var key in defs){
		out += '	this.' + key + ' = function(node, parent, state, index){\n'
		var def = defs[key]
		for(var sub in def){
			var type = def[sub]
			if(type == 1) out += '		this.walk(node.' + sub + ', node, state, -1)\n'
			else if(type == 2) out += '		var arr = node.' + sub + '\n\t\tif(arr) for(var i = 0, len = arr.length; i < len; i++) this.walk(arr[i], node, state, i)\n'
			else if(type == 3) {
				out += '		var arr = node.' + sub + '\n\t\tif(arr) for(var i = 0, len = arr.length; i < len; i++) { this.walk(arr[i].key, node, state, i); this.walk(arr[i].value, node, state, i) }\n'
			}
		}
		out += '	}\n\n'
	}
	fs.writeFileSync(module.filename, head + template.replace(/BODY/,out))
	console.log("Written " + module.filename)
}

// generated
define.class(function(){
	this.walk = function(node, parent, state, index){
		if(!node) return
		var fn = this[node.type]
		if(!fn) throw new Error("Cannot find type " + node.type)
		fn.call(this, node, parent, state, index)
	}
	
	this.Program = function(node, parent, state, index){
		var arr = node.steps
		if(arr) for(var i = 0, len = arr.length; i < len; i++) this.walk(arr[i], node, state, i)
	}

	this.Empty = function(node, parent, state, index){
	}

	this.Id = function(node, parent, state, index){
	}

	this.Property = function(node, parent, state, index){
	}

	this.Value = function(node, parent, state, index){
	}

	this.This = function(node, parent, state, index){
	}

	this.Array = function(node, parent, state, index){
		var arr = node.elems
		if(arr) for(var i = 0, len = arr.length; i < len; i++) this.walk(arr[i], node, state, i)
	}

	this.Object = function(node, parent, state, index){
		var arr = node.keys
		if(arr) for(var i = 0, len = arr.length; i < len; i++) { this.walk(arr[i].key, node, state, i); this.walk(arr[i].value, node, state, i) }
	}

	this.Index = function(node, parent, state, index){
		this.walk(node.object, node, state, -1)
		this.walk(node.index, node, state, -1)
	}

	this.Key = function(node, parent, state, index){
		this.walk(node.object, node, state, -1)
		this.walk(node.key, node, state, -1)
	}

	this.ThisCall = function(node, parent, state, index){
		this.walk(node.object, node, state, -1)
		this.walk(node.key, node, state, -1)
	}

	this.Block = function(node, parent, state, index){
		var arr = node.steps
		if(arr) for(var i = 0, len = arr.length; i < len; i++) this.walk(arr[i], node, state, i)
	}

	this.List = function(node, parent, state, index){
		var arr = node.items
		if(arr) for(var i = 0, len = arr.length; i < len; i++) this.walk(arr[i], node, state, i)
	}

	this.Comprehension = function(node, parent, state, index){
		this.walk(node.for, node, state, -1)
		this.walk(node.expr, node, state, -1)
	}

	this.Template = function(node, parent, state, index){
		var arr = node.chain
		if(arr) for(var i = 0, len = arr.length; i < len; i++) this.walk(arr[i], node, state, i)
	}

	this.Break = function(node, parent, state, index){
		this.walk(node.label, node, state, -1)
	}

	this.Continue = function(node, parent, state, index){
		this.walk(node.label, node, state, -1)
	}

	this.Label = function(node, parent, state, index){
		this.walk(node.label, node, state, -1)
		this.walk(node.body, node, state, -1)
	}

	this.If = function(node, parent, state, index){
		this.walk(node.test, node, state, -1)
		this.walk(node.then, node, state, -1)
		this.walk(node.else, node, state, -1)
	}

	this.Switch = function(node, parent, state, index){
		this.walk(node.on, node, state, -1)
		var arr = node.cases
		if(arr) for(var i = 0, len = arr.length; i < len; i++) this.walk(arr[i], node, state, i)
	}

	this.Case = function(node, parent, state, index){
		this.walk(node.test, node, state, -1)
		var arr = node.steps
		if(arr) for(var i = 0, len = arr.length; i < len; i++) this.walk(arr[i], node, state, i)
	}

	this.Throw = function(node, parent, state, index){
		this.walk(node.arg, node, state, -1)
	}

	this.Try = function(node, parent, state, index){
		this.walk(node.try, node, state, -1)
		this.walk(node.arg, node, state, -1)
		this.walk(node.catch, node, state, -1)
		this.walk(node.finally, node, state, -1)
	}

	this.While = function(node, parent, state, index){
		this.walk(node.test, node, state, -1)
		this.walk(node.loop, node, state, -1)
	}

	this.DoWhile = function(node, parent, state, index){
		this.walk(node.loop, node, state, -1)
		this.walk(node.test, node, state, -1)
	}

	this.For = function(node, parent, state, index){
		this.walk(node.init, node, state, -1)
		this.walk(node.test, node, state, -1)
		this.walk(node.update, node, state, -1)
		this.walk(node.loop, node, state, -1)
	}

	this.ForIn = function(node, parent, state, index){
		this.walk(node.left, node, state, -1)
		this.walk(node.right, node, state, -1)
		this.walk(node.loop, node, state, -1)
	}

	this.ForOf = function(node, parent, state, index){
		this.walk(node.left, node, state, -1)
		this.walk(node.right, node, state, -1)
		this.walk(node.loop, node, state, -1)
	}

	this.ForFrom = function(node, parent, state, index){
		this.walk(node.right, node, state, -1)
		this.walk(node.left, node, state, -1)
		this.walk(node.loop, node, state, -1)
	}

	this.ForTo = function(node, parent, state, index){
		this.walk(node.left, node, state, -1)
		this.walk(node.right, node, state, -1)
		this.walk(node.loop, node, state, -1)
		this.walk(node.in, node, state, -1)
	}

	this.Var = function(node, parent, state, index){
		var arr = node.defs
		if(arr) for(var i = 0, len = arr.length; i < len; i++) this.walk(arr[i], node, state, i)
	}

	this.TypeVar = function(node, parent, state, index){
		this.walk(node.typing, node, state, -1)
		var arr = node.defs
		if(arr) for(var i = 0, len = arr.length; i < len; i++) this.walk(arr[i], node, state, i)
		this.walk(node.dim, node, state, -1)
	}

	this.Struct = function(node, parent, state, index){
		this.walk(node.id, node, state, -1)
		this.walk(node.struct, node, state, -1)
		this.walk(node.base, node, state, -1)
	}

	this.Define = function(node, parent, state, index){
		this.walk(node.id, node, state, -1)
		this.walk(node.value, node, state, -1)
	}

	this.Enum = function(node, parent, state, index){
		this.walk(node.id, node, state, -1)
		var arr = node.enums
		if(arr) for(var i = 0, len = arr.length; i < len; i++) this.walk(arr[i], node, state, i)
	}

	this.Def = function(node, parent, state, index){
		this.walk(node.id, node, state, -1)
		this.walk(node.init, node, state, -1)
		this.walk(node.dim, node, state, -1)
	}

	this.Function = function(node, parent, state, index){
		this.walk(node.id, node, state, -1)
		this.walk(node.name, node, state, -1)
		var arr = node.params
		if(arr) for(var i = 0, len = arr.length; i < len; i++) this.walk(arr[i], node, state, i)
		this.walk(node.rest, node, state, -1)
		this.walk(node.body, node, state, -1)
	}

	this.Return = function(node, parent, state, index){
		this.walk(node.arg, node, state, -1)
	}

	this.Yield = function(node, parent, state, index){
		this.walk(node.arg, node, state, -1)
	}

	this.Await = function(node, parent, state, index){
		this.walk(node.arg, node, state, -1)
	}

	this.Unary = function(node, parent, state, index){
		this.walk(node.arg, node, state, -1)
	}

	this.Binary = function(node, parent, state, index){
		this.walk(node.left, node, state, -1)
		this.walk(node.right, node, state, -1)
	}

	this.Logic = function(node, parent, state, index){
		this.walk(node.left, node, state, -1)
		this.walk(node.right, node, state, -1)
	}

	this.Assign = function(node, parent, state, index){
		this.walk(node.left, node, state, -1)
		this.walk(node.right, node, state, -1)
	}

	this.Update = function(node, parent, state, index){
		this.walk(node.arg, node, state, -1)
	}

	this.Condition = function(node, parent, state, index){
		this.walk(node.test, node, state, -1)
		this.walk(node.then, node, state, -1)
		this.walk(node.else, node, state, -1)
	}

	this.New = function(node, parent, state, index){
		this.walk(node.fn, node, state, -1)
		var arr = node.args
		if(arr) for(var i = 0, len = arr.length; i < len; i++) this.walk(arr[i], node, state, i)
	}

	this.Call = function(node, parent, state, index){
		this.walk(node.fn, node, state, -1)
		var arr = node.args
		if(arr) for(var i = 0, len = arr.length; i < len; i++) this.walk(arr[i], node, state, i)
	}

	this.Nest = function(node, parent, state, index){
		this.walk(node.fn, node, state, -1)
		this.walk(node.body, node, state, -1)
	}

	this.Class = function(node, parent, state, index){
		this.walk(node.id, node, state, -1)
		this.walk(node.base, node, state, -1)
		this.walk(node.body, node, state, -1)
	}

	this.Signal = function(node, parent, state, index){
		this.walk(node.left, node, state, -1)
		this.walk(node.right, node, state, -1)
	}

	this.Quote = function(node, parent, state, index){
		this.walk(node.quote, node, state, -1)
	}

	this.AssignQuote = function(node, parent, state, index){
		this.walk(node.left, node, state, -1)
		this.walk(node.quote, node, state, -1)
	}

	this.Rest = function(node, parent, state, index){
		this.walk(node.id, node, state, -1)
	}

	this.Then = function(node, parent, state, index){
		this.walk(node.name, node, state, -1)
		this.walk(node.do, node, state, -1)
	}

	this.Debugger = function(node, parent, state, index){
	}

	this.With = function(node, parent, state, index){
		this.walk(node.object, node, state, -1)
		this.walk(node.body, node, state, -1)
	}


})
	