/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
   Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and limitations under the License.*/

define.class("./controller", function($$, controllerbutton) {

    this.attributes = {
    };

    this.style = {
        controllerbutton: {
            height: 30,
            width: 30
        }
    };

    this.render = function() {
        return [
            controllerbutton({text:'0', controller:this}),
            controllerbutton({text:'1', controller:this}),
            controllerbutton({text:'2', controller:this}),
            controllerbutton({text:'3', controller:this}),
            controllerbutton({text:'4', controller:this}),
            controllerbutton({text:'5', controller:this}),
            controllerbutton({text:'6', controller:this}),
            controllerbutton({text:'7', controller:this}),
            controllerbutton({text:'8', controller:this}),
            controllerbutton({text:'9', controller:this}),
            controllerbutton({text:'A', controller:this}),
            controllerbutton({text:'B', controller:this}),
            controllerbutton({text:'C', controller:this}),
            controllerbutton({text:'D', controller:this}),
            controllerbutton({text:'E', controller:this}),
            controllerbutton({text:'F', controller:this}),
            controllerbutton({text:'G', controller:this}),
            controllerbutton({text:'H', controller:this}),
            controllerbutton({text:'I', controller:this}),
            controllerbutton({text:'J', controller:this}),
            controllerbutton({text:'K', controller:this}),
            controllerbutton({text:'L', controller:this}),
            controllerbutton({text:'M', controller:this}),
            controllerbutton({text:'N', controller:this}),
            controllerbutton({text:'O', controller:this}),
            controllerbutton({text:'P', controller:this}),
            controllerbutton({text:'Q', controller:this}),
            controllerbutton({text:'R', controller:this}),
            controllerbutton({text:'S', controller:this}),
            controllerbutton({text:'T', controller:this}),
            controllerbutton({text:'U', controller:this}),
            controllerbutton({text:'V', controller:this}),
            controllerbutton({text:'W', controller:this}),
            controllerbutton({text:'X', controller:this}),
            controllerbutton({text:'Y', controller:this}),
            controllerbutton({text:'Z', controller:this}),
        ];
    }

});
