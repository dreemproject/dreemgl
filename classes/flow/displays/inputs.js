/* Copyright 2015 Teem2 LLC. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
 software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
 either express or implied. See the License for the specific language governing permissions and limitations under the License.*/

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
        number: Config({type:Number, flow:"in"}),
        float: Config({type:float, flow:"in"}),
        int: Config({type:int, flow:"in"}),
        vec2: Config({type:vec2, flow:"in"}),
        vec3: Config({type:vec3, flow:"in"}),
        vec4: Config({type:vec4, flow:"in"}),
        array: Config({type:Array, flow:"in"}),
        string: Config({type:String, flow:"in"}),
        object: Config({type:Object, flow:"in"})
    };

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
            view({bg:false, flexdirection:"column", flex:1, justifycontent:"center" },
                view({bg:false, flexdirection:"row", flex:1, justifycontent:"center" },
                    view({width:800, bgcolor:vec4(1,1,1,0.15),padding:40,borderradius:50,  flexdirection:"column" ,alignitems:"center", justifycontent:"center" },
                        view({flexdirection:"row", flex:1}, label({text:'number', paddingright:15}), label({text:this.number, fgcolor:'#FF7260'})),
                        view({flexdirection:"row", flex:1}, label({text:'float',  paddingright:15}), label({text:this.float,  fgcolor:'#D23641'})),
                        view({flexdirection:"row", flex:1}, label({text:'int',    paddingright:15}), label({text:this.int,    fgcolor:'#FF0080'})),
                        view({flexdirection:"row", flex:1}, label({text:'vec2',   paddingright:15}), label({text:this.vec2,   fgcolor:'#129492'})),
                        view({flexdirection:"row", flex:1}, label({text:'vec3',   paddingright:15}), label({text:this.vec3,   fgcolor:'#31C3E7'})),
                        view({flexdirection:"row", flex:1}, label({text:'vec4',   paddingright:15}), label({text:this.vec4,   fgcolor:'#4FD5D6'})),
                        view({flexdirection:"row", flex:1}, label({text:'array',  paddingright:15}), label({text:arr,  fgcolor:'#0198E1'})),
                        view({flexdirection:"row", flex:1}, label({text:'string', paddingright:15}), label({text:str, fgcolor:'#6ADA7A'})),
                        view({flexdirection:"row", flex:1}, label({text:'object', paddingright:15}), label({text:obj, fgcolor:'#ffee14'}))
                    )
                )
            )
        );
    }
});