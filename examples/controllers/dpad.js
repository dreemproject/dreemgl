/* Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
 You may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
 either express or implied. See the License for the specific language governing permissions and limitations under the License.*/

define.class("./controller", function($ui$, view, $$, controllerbutton) {

    this.style = {
        view: {
          bgcolor:'transparent'
        },
        controllerbutton: {
            width: 100,
            height: 100,
            margin:5
        }
    }

    this.flex = 1;
    this.flexdirection = 'column';
    this.alignitems = "center";
    this.justifycontent = "center";

    this.render = function() {
        return [
            view(
                {width:this.width, flex:1, flexdirection:'row',alignitems:'center',justifycontent:'center'},
                controllerbutton({text:'up', value:'~U', controller:this})
            ),
            view({flex:1, alignitems:'center', flexdirection:'row', justifycontent:'center'},
                controllerbutton({text:'left', value:'~L', controller:this}),
                controllerbutton({text:'right', value:'~R', controller:this})
            ),
            view(
                {width:this.width, flex:1, flexdirection:'row',alignitems:'center',justifycontent:'center'},
                controllerbutton({text:'down', value:'~D', controller:this})
            )
        ];
    }

});
