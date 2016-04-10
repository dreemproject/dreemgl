/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
   Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and limitations under the License.*/

define.class('$ui/screen', function(require, $ui$, screen, cadgrid, textbox, view, label, checkbox){

    this.attributes = {
		number: Config({type:Number, flow:"out", value:100, persist:true}),
		boolean: Config({type:Boolean, flow:"out", value:true, persist:true}),
        float: Config({type:float, flow:"out", value:3.1415, persist:true}),
        int: Config({type:int, flow:"out", value:42, persist:true}),
        vec2: Config({type:vec2, flow:"out", value:vec2(1,2), persist:true}),
        vec3: Config({type:vec3, flow:"out", value:vec3(1,2,3), persist:true}),
        vec4: Config({type:vec4, flow:"out", value:vec4(1,2,3,4), persist:true}),
        array: Config({type:Array, flow:"out", value:[1,2,3,4,5,"6"], persist:true}),
        string: Config({type:String, flow:"out", value:"Cats", persist:true}),
        object: Config({type:Object, flow:"out", value:{some:{complex:'object', persist:true}}})
    };

    this.render = function(){
        return cadgrid({bgcolor:"#000030", majorline: "#003040", minorline: "#002030", flexdirection:"column", alignitems:"center", justifycontent:"space-around" },
			view({alignitems:"center"}, label({flex:0, text:"Number", marginright:20}), textbox({flex:0, value:this.number, onvalue:function(ev,v,o){ this.number = o.value }.bind(this)})),
			view({alignitems:"center"}, label({flex:0, text:"Boolean", marginright:20}), checkbox({flex:0, value:this.boolean, onclick:function(ev,v,o){ this.boolean = o.value }.bind(this)})),
			view({alignitems:"center"}, label({flex:0, text:"Float", marginright:20}), textbox({flex:0, value:this.float, onvalue:function(ev,v,o){ this.float = o.value }.bind(this)})),
			view({alignitems:"center"}, label({flex:0, text:"Int", marginright:20}), textbox({flex:0, value:this.int, onvalue:function(ev,v,o){ this.int = o.value }.bind(this)})),
			view({alignitems:"center"}, label({flex:0, text:"String", marginright:20}), textbox({flex:0, value:this.string, onvalue:function(ev,v,o){ this.string = o.value }.bind(this)}))
		);
    }

});
