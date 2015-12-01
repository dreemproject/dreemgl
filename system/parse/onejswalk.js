/* Copyright 2015 Teem2 LLC. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.  
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing, 
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, 
   either express or implied. See the License for the specific language governing permissions and limitations under the License.*/
// self generating onejs walker utility class, run with nodejs to regenerate

if(typeof process !== 'undefined' && require.main === module){
	var require = require('../../define')
	var fs = require('fs')
	var defs = require('./onejsdef.js')
	// read self
	var head = fs.readFileSync(module.filename).toString().match(/^[\S\s]*\/\/ generated/)[0]
	// the template for the generated bottom part
	var template = function(){
		define.class(function(require, exports, self){
			self.walk = function(node, parent, state){
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
		out += '	self.' + key + ' = function(node, parent, state){\n'
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
define.class(function(require, exports, self){
	self.walk = function(node, parent, state){
		if(!node) return
		var fn = this[node.type]
		if(!fn) throw new Error("Cannot find type " + node.type)
		fn.call(this, node, parent, state)
	}
	
	self.Program = function(node, parent, state){
		var arr = node.steps
		if(arr) for(var i = 0, len = arr.length; i < len; i++) this.walk(arr[i], node, state)
	}

	self.Empty = function(node, parent, state){
	}

	self.Id = function(node, parent, state){
		this.walk(node.typing, node, state)
	}

	self.Value = function(node, parent, state){
	}

	self.This = function(node, parent, state){
	}

	self.Array = function(node, parent, state){
		var arr = node.elems
		if(arr) for(var i = 0, len = arr.length; i < len; i++) this.walk(arr[i], node, state)
	}

	self.Object = function(node, parent, state){
		var arr = node.keys
		if(arr) for(var i = 0, len = arr.length; i < len; i++) this.walk(arr[i].value, node, state)
	}

	self.Index = function(node, parent, state){
		this.walk(node.object, node, state)
		this.walk(node.index, node, state)
	}

	self.Key = function(node, parent, state){
		this.walk(node.object, node, state)
		this.walk(node.key, node, state)
	}

	self.ThisCall = function(node, parent, state){
		this.walk(node.object, node, state)
		this.walk(node.key, node, state)
	}

	self.Block = function(node, parent, state){
		var arr = node.steps
		if(arr) for(var i = 0, len = arr.length; i < len; i++) this.walk(arr[i], node, state)
	}

	self.List = function(node, parent, state){
		var arr = node.items
		if(arr) for(var i = 0, len = arr.length; i < len; i++) this.walk(arr[i], node, state)
	}

	self.Comprehension = function(node, parent, state){
		this.walk(node.for, node, state)
		this.walk(node.expr, node, state)
	}

	self.Template = function(node, parent, state){
		var arr = node.chain
		if(arr) for(var i = 0, len = arr.length; i < len; i++) this.walk(arr[i], node, state)
	}

	self.Break = function(node, parent, state){
		this.walk(node.label, node, state)
	}

	self.Continue = function(node, parent, state){
		this.walk(node.label, node, state)
	}

	self.Label = function(node, parent, state){
		this.walk(node.label, node, state)
		this.walk(node.body, node, state)
	}

	self.If = function(node, parent, state){
		this.walk(node.test, node, state)
		this.walk(node.then, node, state)
		this.walk(node.else, node, state)
	}

	self.Switch = function(node, parent, state){
		this.walk(node.on, node, state)
		var arr = node.cases
		if(arr) for(var i = 0, len = arr.length; i < len; i++) this.walk(arr[i], node, state)
	}

	self.Case = function(node, parent, state){
		this.walk(node.test, node, state)
		var arr = node.steps
		if(arr) for(var i = 0, len = arr.length; i < len; i++) this.walk(arr[i], node, state)
	}

	self.Throw = function(node, parent, state){
		this.walk(node.arg, node, state)
	}

	self.Try = function(node, parent, state){
		this.walk(node.try, node, state)
		this.walk(node.arg, node, state)
		this.walk(node.catch, node, state)
		this.walk(node.finally, node, state)
	}

	self.While = function(node, parent, state){
		this.walk(node.test, node, state)
		this.walk(node.loop, node, state)
	}

	self.DoWhile = function(node, parent, state){
		this.walk(node.loop, node, state)
		this.walk(node.test, node, state)
	}

	self.For = function(node, parent, state){
		this.walk(node.init, node, state)
		this.walk(node.test, node, state)
		this.walk(node.update, node, state)
		this.walk(node.loop, node, state)
	}

	self.ForIn = function(node, parent, state){
		this.walk(node.left, node, state)
		this.walk(node.right, node, state)
		this.walk(node.loop, node, state)
	}

	self.ForOf = function(node, parent, state){
		this.walk(node.left, node, state)
		this.walk(node.right, node, state)
		this.walk(node.loop, node, state)
	}

	self.ForFrom = function(node, parent, state){
		this.walk(node.right, node, state)
		this.walk(node.left, node, state)
		this.walk(node.loop, node, state)
	}

	self.ForTo = function(node, parent, state){
		this.walk(node.left, node, state)
		this.walk(node.right, node, state)
		this.walk(node.loop, node, state)
		this.walk(node.in, node, state)
	}

	self.Var = function(node, parent, state){
		var arr = node.defs
		if(arr) for(var i = 0, len = arr.length; i < len; i++) this.walk(arr[i], node, state)
	}

	self.TypeVar = function(node, parent, state){
		this.walk(node.typing, node, state)
		var arr = node.defs
		if(arr) for(var i = 0, len = arr.length; i < len; i++) this.walk(arr[i], node, state)
		this.walk(node.dim, node, state)
	}

	self.Struct = function(node, parent, state){
		this.walk(node.id, node, state)
		this.walk(node.struct, node, state)
		this.walk(node.base, node, state)
	}

	self.Define = function(node, parent, state){
		this.walk(node.id, node, state)
		this.walk(node.value, node, state)
	}

	self.Enum = function(node, parent, state){
		this.walk(node.id, node, state)
		var arr = node.enums
		if(arr) for(var i = 0, len = arr.length; i < len; i++) this.walk(arr[i], node, state)
	}

	self.Def = function(node, parent, state){
		this.walk(node.id, node, state)
		this.walk(node.init, node, state)
		this.walk(node.dim, node, state)
	}

	self.Function = function(node, parent, state){
		this.walk(node.id, node, state)
		this.walk(node.name, node, state)
		var arr = node.params
		if(arr) for(var i = 0, len = arr.length; i < len; i++) this.walk(arr[i], node, state)
		this.walk(node.rest, node, state)
		this.walk(node.body, node, state)
	}

	self.Return = function(node, parent, state){
		this.walk(node.arg, node, state)
	}

	self.Yield = function(node, parent, state){
		this.walk(node.arg, node, state)
	}

	self.Await = function(node, parent, state){
		this.walk(node.arg, node, state)
	}

	self.Unary = function(node, parent, state){
		this.walk(node.arg, node, state)
	}

	self.Binary = function(node, parent, state){
		this.walk(node.left, node, state)
		this.walk(node.right, node, state)
	}

	self.Logic = function(node, parent, state){
		this.walk(node.left, node, state)
		this.walk(node.right, node, state)
	}

	self.Assign = function(node, parent, state){
		this.walk(node.left, node, state)
		this.walk(node.right, node, state)
	}

	self.Update = function(node, parent, state){
		this.walk(node.arg, node, state)
	}

	self.Condition = function(node, parent, state){
		this.walk(node.test, node, state)
		this.walk(node.then, node, state)
		this.walk(node.else, node, state)
	}

	self.New = function(node, parent, state){
		this.walk(node.fn, node, state)
		var arr = node.args
		if(arr) for(var i = 0, len = arr.length; i < len; i++) this.walk(arr[i], node, state)
	}

	self.Call = function(node, parent, state){
		this.walk(node.fn, node, state)
		var arr = node.args
		if(arr) for(var i = 0, len = arr.length; i < len; i++) this.walk(arr[i], node, state)
	}

	self.Nest = function(node, parent, state){
		this.walk(node.fn, node, state)
		this.walk(node.body, node, state)
	}

	self.Class = function(node, parent, state){
		this.walk(node.id, node, state)
		this.walk(node.base, node, state)
		this.walk(node.body, node, state)
	}

	self.Signal = function(node, parent, state){
		this.walk(node.left, node, state)
		this.walk(node.right, node, state)
	}

	self.Quote = function(node, parent, state){
		this.walk(node.quote, node, state)
	}

	self.AssignQuote = function(node, parent, state){
		this.walk(node.left, node, state)
		this.walk(node.quote, node, state)
	}

	self.Rest = function(node, parent, state){
		this.walk(node.id, node, state)
	}

	self.Then = function(node, parent, state){
		this.walk(node.name, node, state)
		this.walk(node.do, node, state)
	}

	self.Debugger = function(node, parent, state){
	}

	self.With = function(node, parent, state){
		this.walk(node.object, node, state)
		this.walk(node.body, node, state)
	}


})
	