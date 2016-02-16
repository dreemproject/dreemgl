/* Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
 You may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
 either express or implied. See the License for the specific language governing permissions and limitations under the License.*/

define.class("$server/dataset", function(require){
	// internal, sourcefile is a dataset-api representing a dreem source file

	var jsparser = require('$system/parse/onejsparser')
	var jsformatter = require('$system/parse/jsformatter')

	this.attributes = {
		change: Config({type:Event})
	}

	this.atConstructor = function(source){
		if(source) this.parse(source)
		this.last_source = source
	}

	this.fork = function(callback){
		this.undo_stack.push(this.last_source)
		this.redo_stack.length = 0
		callback(this)
		// lets reserialize
		this.last_source = this.stringify()
		this.notifyAssignedAttributes()
		// save to disk.
		this.emit('change')
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
