/* Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
 You may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
 either express or implied. See the License for the specific language governing permissions and limitations under the License.*/

define.class('$ui/screen', function(require, $ui$,screen, cadgrid){

    this.attributes = {
        number: Config({type:Number, flow:"out", value:100}),
        float: Config({type:float, flow:"out", value:3.1415}),
        int: Config({type:int, flow:"out", value:42}),
        vec2: Config({type:vec2, flow:"out", value:vec2(1,2)}),
        vec3: Config({type:vec3, flow:"out", value:vec3(1,2,3)}),
        vec4: Config({type:vec4, flow:"out", value:vec4(1,2,3,4)}),
        array: Config({type:Array, flow:"out", value:[1,2,3,4,5,"6"]}),
        string: Config({type:String, flow:"out", value:"Cats"}),
        url: Config({type:String, flow:"out", value:"http://www.samsung.com/us/"}),
        images: Config({type:Array, flow:"out", value:["https://pbs.twimg.com/profile_images/3207590400/4cd4d8b352ec49cf21c64de20f58f7b4.jpeg","http://hdwpro.com/wp-content/uploads/2015/12/Dark-Pink-Flower.png"]}),
        location: Config({type:String, flow:"out", value:"Portland,OR"}),
        object: Config({type:Object, flow:"out", value:{some:{complex:'object'}}})
    };

    this.render = function(){
        return cadgrid({bgcolor:"#000030", majorline: "#003040", minorline: "#002030" });
    }

});
