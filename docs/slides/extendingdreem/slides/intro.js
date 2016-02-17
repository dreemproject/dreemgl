/* Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
 You may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
 either express or implied. See the License for the specific language governing permissions and limitations under the License.*/

define.class(function ($ui$, view, label) {

    this.attributes = {
        syntaxCode: Config({type: String})
    };

    this.slidetitle = "Adding Components to DreemGL";
    this.flexdirection = 'column';
    this.bgcolor = 'transparent';

    this.render = function render() {
        return [
            label({
                text:'+ Components are directories - No special work required!',
                fgcolor:'#333',
                bgcolor:'transparent',
                fontsize:25,
                margintop:50
            }),
            label({
                text:'+ Navigate class filesystem with "$" argument syntax',
                fgcolor:'#333',
                bgcolor:'transparent',
                fontsize:25,
                margintop:50
            }),
            label({
                text:'+ Integrate internally via nodejs (write entirely in DreemGL!)',
                fgcolor:'#333',
                bgcolor:'transparent',
                fontsize:25,
                margintop:50
            }),
            //label({
            //    text:'(Web services, nodejs plugins)',
            //    fgcolor:'#F33',
            //    bgcolor:'transparent',
            //    fontsize:15,
            //    marginleft:25,
            //    margintop:10
            //}),
            label({
                text:'+ Integrate externally via POST API (write in any language!)',
                fgcolor:'#333',
                bgcolor:'transparent',
                fontsize:25,
                margintop:50
            }),
            //label({
            //    text:'(Other services, IoT Devices)',
            //    fgcolor:'#F33',
            //    bgcolor:'transparent',
            //    fontsize:15,
            //    marginleft:25,
            //    margintop:10
            //}),
            label({
                text:'+ See `./examples/guide/README.md` for implementation guide',
                fgcolor:'#333',
                bgcolor:'transparent',
                fontsize:25,
                margintop:50
            })
        ];
    };
});
