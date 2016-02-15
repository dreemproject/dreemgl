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
		define.class(function(exports){
			BODY
			this.Object = function(obj){
				if(arguments.length > 1) return this._Object.apply(this, arguments)
				var ret = {type:'Object',keys:[]}
				for(var key in obj){
					ret.keys.push({key:key, value:obj})
				}
				return ret
			}

			this.Value = function(v){
				if(arguments.length > 1) return this._Object.apply(this, arguments)
				if(typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean'){
					return {type:'Value', value:v, kind:typeof v}
				}
				else throw new Error('Dont support value')
			}
		})
	}.toString().match(/function\s*\(\)\{\n([\S\s]*)\}/)[1].replace(/(^|\n)\t\t/g,'\n')

	var rename = {for:'_for', else:'_else', try:'_try',catch:'_catch', finally:'_finally', in:'_in', do:'_do', const:'_const'}
	var out = '\n'	
	for(var key in defs){
		out += '	this._'+key+' = this.' + key + ' = function('
		var def = defs[key]
		var args = ''
		var body = '		return {\n			type:"'+key+'"'
		for(var sub in def){
			var ren = rename[sub] || sub
			if(args) args += ', '
			args += ren
			body += ',\n			' + sub + ':' + ren 

			//var type = def[sub]
		}
		body += '\n		}\n'
		out += args + '){\n' + body +  '	}\n\n'
	}
	fs.writeFileSync(module.filename, head + template.replace(/BODY/,out))
	console.log("Written " + module.filename)
}

// generated
define.class(function(exports){
	
	this._Program = this.Program = function(steps){
		return {
			type:"Program",
			steps:steps
		}
	}

	this._Empty = this.Empty = function(){
		return {
			type:"Empty"
		}
	}

	this._Id = this.Id = function(name, flag, typing){
		return {
			type:"Id",
			name:name,
			flag:flag,
			typing:typing
		}
	}

	this._Value = this.Value = function(value, raw, kind, multi){
		return {
			type:"Value",
			value:value,
			raw:raw,
			kind:kind,
			multi:multi
		}
	}

	this._This = this.This = function(){
		return {
			type:"This"
		}
	}

	this._Array = this.Array = function(elems){
		return {
			type:"Array",
			elems:elems
		}
	}

	this._Object = this.Object = function(keys){
		return {
			type:"Object",
			keys:keys
		}
	}

	this._Index = this.Index = function(object, index){
		return {
			type:"Index",
			object:object,
			index:index
		}
	}

	this._Key = this.Key = function(object, key, exist){
		return {
			type:"Key",
			object:object,
			key:key,
			exist:exist
		}
	}

	this._ThisCall = this.ThisCall = function(object, key){
		return {
			type:"ThisCall",
			object:object,
			key:key
		}
	}

	this._Block = this.Block = function(steps){
		return {
			type:"Block",
			steps:steps
		}
	}

	this._List = this.List = function(items){
		return {
			type:"List",
			items:items
		}
	}

	this._Comprehension = this.Comprehension = function(_for, expr){
		return {
			type:"Comprehension",
			for:_for,
			expr:expr
		}
	}

	this._Template = this.Template = function(chain){
		return {
			type:"Template",
			chain:chain
		}
	}

	this._Break = this.Break = function(label){
		return {
			type:"Break",
			label:label
		}
	}

	this._Continue = this.Continue = function(label){
		return {
			type:"Continue",
			label:label
		}
	}

	this._Label = this.Label = function(label, body){
		return {
			type:"Label",
			label:label,
			body:body
		}
	}

	this._If = this.If = function(test, then, _else, postfix, compr){
		return {
			type:"If",
			test:test,
			then:then,
			else:_else,
			postfix:postfix,
			compr:compr
		}
	}

	this._Switch = this.Switch = function(on, cases){
		return {
			type:"Switch",
			on:on,
			cases:cases
		}
	}

	this._Case = this.Case = function(test, steps){
		return {
			type:"Case",
			test:test,
			steps:steps
		}
	}

	this._Throw = this.Throw = function(arg){
		return {
			type:"Throw",
			arg:arg
		}
	}

	this._Try = this.Try = function(_try, arg, _catch, _finally){
		return {
			type:"Try",
			try:_try,
			arg:arg,
			catch:_catch,
			finally:_finally
		}
	}

	this._While = this.While = function(test, loop){
		return {
			type:"While",
			test:test,
			loop:loop
		}
	}

	this._DoWhile = this.DoWhile = function(loop, test){
		return {
			type:"DoWhile",
			loop:loop,
			test:test
		}
	}

	this._For = this.For = function(init, test, update, loop, compr){
		return {
			type:"For",
			init:init,
			test:test,
			update:update,
			loop:loop,
			compr:compr
		}
	}

	this._ForIn = this.ForIn = function(left, right, loop, compr){
		return {
			type:"ForIn",
			left:left,
			right:right,
			loop:loop,
			compr:compr
		}
	}

	this._ForOf = this.ForOf = function(left, right, loop, compr){
		return {
			type:"ForOf",
			left:left,
			right:right,
			loop:loop,
			compr:compr
		}
	}

	this._ForFrom = this.ForFrom = function(right, left, loop, compr){
		return {
			type:"ForFrom",
			right:right,
			left:left,
			loop:loop,
			compr:compr
		}
	}

	this._ForTo = this.ForTo = function(left, right, loop, _in, compr){
		return {
			type:"ForTo",
			left:left,
			right:right,
			loop:loop,
			in:_in,
			compr:compr
		}
	}

	this._Var = this.Var = function(defs, _const){
		return {
			type:"Var",
			defs:defs,
			const:_const
		}
	}

	this._TypeVar = this.TypeVar = function(typing, defs, dim){
		return {
			type:"TypeVar",
			typing:typing,
			defs:defs,
			dim:dim
		}
	}

	this._Struct = this.Struct = function(id, struct, base){
		return {
			type:"Struct",
			id:id,
			struct:struct,
			base:base
		}
	}

	this._Define = this.Define = function(id, value){
		return {
			type:"Define",
			id:id,
			value:value
		}
	}

	this._Enum = this.Enum = function(id, enums){
		return {
			type:"Enum",
			id:id,
			enums:enums
		}
	}

	this._Def = this.Def = function(id, init, dim){
		return {
			type:"Def",
			id:id,
			init:init,
			dim:dim
		}
	}

	this._Function = this.Function = function(id, name, params, rest, body, arrow, gen, def){
		return {
			type:"Function",
			id:id,
			name:name,
			params:params,
			rest:rest,
			body:body,
			arrow:arrow,
			gen:gen,
			def:def
		}
	}

	this._Return = this.Return = function(arg){
		return {
			type:"Return",
			arg:arg
		}
	}

	this._Yield = this.Yield = function(arg){
		return {
			type:"Yield",
			arg:arg
		}
	}

	this._Await = this.Await = function(arg){
		return {
			type:"Await",
			arg:arg
		}
	}

	this._Unary = this.Unary = function(op, prefix, arg){
		return {
			type:"Unary",
			op:op,
			prefix:prefix,
			arg:arg
		}
	}

	this._Binary = this.Binary = function(op, prio, left, right){
		return {
			type:"Binary",
			op:op,
			prio:prio,
			left:left,
			right:right
		}
	}

	this._Logic = this.Logic = function(op, prio, left, right){
		return {
			type:"Logic",
			op:op,
			prio:prio,
			left:left,
			right:right
		}
	}

	this._Assign = this.Assign = function(op, prio, left, right){
		return {
			type:"Assign",
			op:op,
			prio:prio,
			left:left,
			right:right
		}
	}

	this._Update = this.Update = function(op, prio, arg, prefix){
		return {
			type:"Update",
			op:op,
			prio:prio,
			arg:arg,
			prefix:prefix
		}
	}

	this._Condition = this.Condition = function(test, then, _else){
		return {
			type:"Condition",
			test:test,
			then:then,
			else:_else
		}
	}

	this._New = this.New = function(fn, args){
		return {
			type:"New",
			fn:fn,
			args:args
		}
	}

	this._Call = this.Call = function(fn, args, extarg){
		return {
			type:"Call",
			fn:fn,
			args:args,
			extarg:extarg
		}
	}

	this._Nest = this.Nest = function(fn, body, arrow){
		return {
			type:"Nest",
			fn:fn,
			body:body,
			arrow:arrow
		}
	}

	this._Class = this.Class = function(id, base, body){
		return {
			type:"Class",
			id:id,
			base:base,
			body:body
		}
	}

	this._Signal = this.Signal = function(left, right){
		return {
			type:"Signal",
			left:left,
			right:right
		}
	}

	this._Quote = this.Quote = function(quote){
		return {
			type:"Quote",
			quote:quote
		}
	}

	this._AssignQuote = this.AssignQuote = function(left, quote){
		return {
			type:"AssignQuote",
			left:left,
			quote:quote
		}
	}

	this._Rest = this.Rest = function(id, dots){
		return {
			type:"Rest",
			id:id,
			dots:dots
		}
	}

	this._Then = this.Then = function(name, _do){
		return {
			type:"Then",
			name:name,
			do:_do
		}
	}

	this._Debugger = this.Debugger = function(){
		return {
			type:"Debugger"
		}
	}

	this._With = this.With = function(object, body){
		return {
			type:"With",
			object:object,
			body:body
		}
	}


	this.Object = function(obj){
		if(arguments.length > 1) return this._Object.apply(this, arguments)
		var ret = {type:'Object',keys:[]}
		for(var key in obj){
			ret.keys.push({key:key, value:obj})
		}
		return ret
	}

	this.Value = function(v){
		if(arguments.length > 1) return this._Object.apply(this, arguments)
		if(typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean'){
			return {type:'Value', value:v, kind:typeof v}
		}
		else throw new Error('Dont support value')
	}
})
	