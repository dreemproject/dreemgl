/* Copyright 2015 Teem2 LLC - Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
 software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
 either express or implied. See the License for the specific language governing permissions and limitations under the License.*/

define.class(function ($ui$, view, label) {

    this.attributes = {
        syntaxCode: {type: String}
    };

    this.slidetitle = "External Components in DreemGL";
    this.flexdirection = 'column';
    this.bgcolor = 'transparent';

    this.render = function render() {
        return [
            label({
                text:'+ Plugins are directories or symlinks - No special work required!',
                fgcolor:'#333',
                bgcolor:'transparent',
                fontsize:25,
                margintop:50
            }),
            label({
                text:'+ Navigate filesystem with "$" argument syntax',
                fgcolor:'#333',
                bgcolor:'transparent',
                fontsize:25,
                margintop:50
            }),
            label({
                text:'+ Integrate internally via nodejs or externally via POST API',
                fgcolor:'#333',
                bgcolor:'transparent',
                fontsize:25,
                margintop:50
            }),
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