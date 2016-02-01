/* Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
 You may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
 either express or implied. See the License for the specific language governing permissions and limitations under the License.*/

define.class("./controller", function($ui$, knob) {

    this.attributes = {
        value:Config({type:float, value:0.5, persist:true})
    };

    this.render = function() {
        return [
            knob({
                innerradius:70,
                outerradius: 190,
                bgcolor:vec4(0,0,0,1),
                onvalue:function(event) {
                    var value = event.value;
                    this.parent.value = value;
                }
            })
        ];
    }

});
