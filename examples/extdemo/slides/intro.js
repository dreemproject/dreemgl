/* Copyright 2015 Teem2 LLC - Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
 software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
 either express or implied. See the License for the specific language governing permissions and limitations under the License.*/

define.class(function ($containers$, view, $controls$, label, $widgets$, codeviewer) {

    this.attributes = {
        syntaxCode: {type: String}
    };

    this.slidetitle = "External Components in DreemGL";
    this.flexdirection = 'column';
    this.bgcolor = 'transparent';

    this.render = function render() {
        return [
            label({
                text:'+ Plugin components are directories - No special work required!',
                fgcolor:'#333',
                bgcolor:'transparent',
                fontsize:25,
                margintop:5
            }),
            label({
                text:'(note: define.$plugins defaults to $compositions directory for convenience, but can be changed for security)',
                fgcolor:'#666',
                bgcolor:'transparent',
                fontsize:14,
                margintop:5,
                marginleft:25
            }),
            label({
                text:'+ Compositions can auto load classes from plugin directories:',
                fgcolor:'#333',
                bgcolor:'transparent',
                fontsize:25,
                margintop:15
            }),
            label({
                text:'Use the `componentname$classname` syntax:',
                fgcolor:'#444',
                bgcolor:'transparent',
                fontsize:20,
                margintop:5,
                marginleft:95
            }),
            codeviewer({
                flex: 0,
                mode:'2D',
                overflow:'scroll',
                alignself: 'center',
                margin: vec4(10),
                source: this.syntaxCode,
                padding: vec4(4),
                fontsize: 14,
                bgcolor: "#000030",
                multiline: true}
            ),
            label({
                text:'+ Example composition in `index.js`, no special mounting!',
                fgcolor:'#333',
                bgcolor:'transparent',
                fontsize:25,
                margintop:10
            }),
            label({
                text:'+ See `./examples/guide/README.md` for more full details.',
                fgcolor:'#333',
                bgcolor:'transparent',
                fontsize:25,
                margintop:20
            })
        ];
    };
});