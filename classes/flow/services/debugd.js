/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
 Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
 You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
 software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and limitations under the License.*/

define.class('$server/service', function() {

	this.attributes = {
		outnumber: Config({type:Number, flow:"out", value:100, persist:true}),
		outboolean: Config({type:Boolean, flow:"out", value:true, persist:true}),
		outfloat: Config({type:float, flow:"out", value:3.1415, persist:true}),
		outint: Config({type:int, flow:"out", value:42, persist:true}),
		outvec2: Config({type:vec2, flow:"out", value:vec2(1,2), persist:true}),
		outvec3: Config({type:vec3, flow:"out", value:vec3(1,2,3), persist:true}),
		outvec4: Config({type:vec4, flow:"out", value:vec4(1,2,3,4), persist:true}),
		outarray: Config({type:Array, flow:"out", value:[1,2,3,4,5,"6"], persist:true}),
		outstring: Config({type:String, flow:"out", value:"Cats", persist:true}),
		outobject: Config({type:Object, flow:"out", value:{some:{complex:'object', persist:true}}}),

		number: Config({type:Number, flow:"in"}),
		boolean: Config({type:Boolean, flow:"in"}),
		float: Config({type:float, flow:"in"}),
		int: Config({type:int, flow:"in"}),
		vec2: Config({type:vec2, flow:"in"}),
		vec3: Config({type:vec3, flow:"in"}),
		vec4: Config({type:vec4, flow:"in"}),
		array: Config({type:Array, flow:"in"}),
		string: Config({type:String, flow:"in"}),
		object: Config({type:Object, flow:"in"}),
	};

	this.onnumber = function(ev, v, o) {
		console.log("number", this.number)
		console.log("\n")
		this.outnumber = v;
	}

	this.onboolean = function(ev, v, o) {
		console.log("boolean", this.boolean)
		console.log("\n")
		this.outboolean = v;
	}

	this.onfloat = function(ev, v, o) {
		console.log("float", this.float)
		console.log("\n")
		this.outfloat = v;
	}

	this.onint = function(ev, v, o) {
		console.log("int", this._int)
		console.log("\n")
		this.outint = v;
	}

	this.onvec2 = function(ev, v, o) {
		console.log("vec2", this.vec2)
		console.log("\n")
		this.outvec2 = v;
	}

	this.onvec3 = function(ev, v, o) {
		console.log("vec3", this.vec3)
		console.log("\n")
		this.outvec3 = v;
	}

	this.onvec4 = function(ev, v, o) {
		console.log("vec4", this.vec4)
		console.log("\n")
		this.onvec4 = v;
	}

	this.onarray = function(ev, v, o) {
		console.log("array", this.array)
		console.log("\n")
		this.outarray = v;
	}

	this.onstring = function(ev, v, o) {
		console.log("string", this.string)
		console.log("\n")
		this.outstring = v;
	}

	this.onobject = function(ev, v, o) {
		console.log("object", this.object)
		console.log("\n")
		this.outobject = v;
	}

	this.init = function(ev, v, o) {
		console.log("number", this.number)
		console.log("boolean", this.boolean)
		console.log("float", this.float)
		console.log("int", this.int)
		console.log("vec2", this.vec2)
		console.log("vec3", this.vec3)
		console.log("vec4", this.vec4)
		console.log("array", this.array)
		console.log("string", this.string)
		console.log("object", this.object)
		console.log("\n\n")
		this.outobject = v;
		this.outstring = v;
		this.outarray = v;
		this.onvec4 = v;
		this.outvec3 = v;
		this.outvec2 = v;
		this.outint = v;
		this.outfloat = v;
		this.outboolean = v;
		this.outnumber = v;
	}

});


