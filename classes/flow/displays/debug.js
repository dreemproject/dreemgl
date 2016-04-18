/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
   Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and limitations under the License.*/

define.class('$ui/screen', function(require, $ui$, screen, cadgrid, view, label){

    this.style = {
       view: {
           bgcolor: 'transparent'
       },
       label: {
           bgcolor: 'transparent'
       }
    };

    this.attributes = {
		outnumber: Config({persist:true, type:Number, flow:"out", value:100}),
		outboolean: Config({persist:true, type:Boolean, flow:"out", value:true}),
		outfloat: Config({persist:true, type:float, flow:"out", value:3.1415}),
		outint: Config({persist:true, type:int, flow:"out", value:42}),
		outvec2: Config({persist:true, type:vec2, flow:"out", value:vec2(1,2)}),
		outvec3: Config({persist:true, type:vec3, flow:"out", value:vec3(1,2,3)}),
		outvec4: Config({persist:true, type:vec4, flow:"out", value:vec4(1,2,3,4)}),
		outarray: Config({persist:true, type:Array, flow:"out", value:[1,2,3,4,5,"6"]}),
		outstring: Config({persist:true, type:String, flow:"out", value:"Cats"}),
		outobject: Config({persist:true, type:Object, flow:"out", value:{some:{complex:'object'}}}),

		number: Config({persist:true, type:Number, flow:"in"}),
		boolean: Config({persist:true, type:Boolean, flow:"in"}),
        float: Config({persist:true, type:float, flow:"in"}),
        int: Config({persist:true, type:int, flow:"in"}),
        vec2: Config({persist:true, type:vec2, flow:"in"}),
        vec3: Config({persist:true, type:vec3, flow:"in"}),
        vec4: Config({persist:true, type:vec4, flow:"in"}),
        array: Config({persist:true, type:Array, flow:"in"}),
        string: Config({persist:true, type:String, flow:"in"}),
        object: Config({persist:true, type:Object, flow:"in"})
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
		console.log("int", this.int)
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
		this.outvec4 = v;
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

		this.outobject = this.object;
		this.outstring = this.string;
		this.outarray = this.array;
		this.outvec4 = this.vec4;
		this.outvec3 = this.vec3;
		this.outvec2 = this.vec2;
		this.outint = this.int;
		this.outfloat = this.float;
		this.outboolean = this.boolean;
		this.outnumber = this.number;
	}

    this.render = function(){
        var arr = this.array
        if (arr) {
            arr = JSON.stringify(this.array);
            if (arr.length > 100) {
                arr = this.array.length + " object in array"
            }
        }

        var str = this.string;
        if (str && str.length > 100) {
            str = str.substring(0,100) + '...'
        }

        var obj = this.object
        if (obj) {
            obj = JSON.stringify(this.object);
            if (obj.length > 100) {
                obj = obj.substring(0,100) + '...'
            }
        }


        return cadgrid({bgcolor:"#000030", majorline: "#003040", minorline: "#002030" },
            view({bgcolor:NaN, flexdirection:"column", flex:1, justifycontent:"center" },
                view({bgcolor:NaN, flexdirection:"row", flex:1, justifycontent:"center" },
                    view({width:800, bgcolor:vec4(1,1,1,0.15),padding:30, borderradius:50,  flexdirection:"column", alignitems:"center", justifycontent:"space-between" },
                        view({flex:1}, label({text:'number', paddingright:15}), label({text:this.number, fgcolor:'#FF7260'})),
						view({flex:1}, label({text:'boolean', paddingright:15}), label({text:this.boolean, fgcolor:'#FF7260'})),
                        view({flex:1}, label({text:'float',  paddingright:15}), label({text:this.float,  fgcolor:'#D23641'})),
                        view({flex:1}, label({text:'int',    paddingright:15}), label({text:this.int,    fgcolor:'#FF0080'})),
                        view({flex:1}, label({text:'vec2',   paddingright:15}), label({text:this.vec2,   fgcolor:'#129492'})),
                        view({flex:1}, label({text:'vec3',   paddingright:15}), label({text:this.vec3,   fgcolor:'#31C3E7'})),
                        view({flex:1}, label({text:'vec4',   paddingright:15}), label({text:this.vec4,   fgcolor:'#4FD5D6'})),
                        view({flex:1}, label({text:'array',  paddingright:15}), label({text:arr,  fgcolor:'#0198E1'})),
						view({flex:1, alignself:"stretch", overflow:"scroll"}, label({text:JSON.stringify(this.array)})),
                        view({flex:1}, label({text:'string', paddingright:15}), label({text:str, fgcolor:'#6ADA7A'})),
						view({flex:1, alignself:"stretch", overflow:"scroll"}, label({text:JSON.stringify(this.string)})),
                        view({flex:1}, label({text:'object', paddingright:15}), label({text:obj, fgcolor:'#ffee14'})),
						view({flex:1, alignself:"stretch", overflow:"scroll"}, label({text:JSON.stringify(this.object)}))
                    )
                )
            )
        );
    }
});
