/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
   Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and limitations under the License.*/

define.class(function ($ui$, view, label, $widgets$, jsviewer) {

    this.attributes = {
        syntaxCode: Config({type: String})
    };

    this.slidetitle = "Navigating via $";
    this.flexdirection = 'column';
    this.bgcolor = 'transparent';

    this.render = function render() {
        return [
            label({
                text:'+ "$" in argument names are similar to "/" in the file system',
                fgcolor:'#333',
                bgcolor:'transparent',
                fontsize:20,
                margintop:5
            }),
            label({
                text:'+ Using "$dir$, $subdir$, classname" searches for `dir/subdir/classname.js`',
                fgcolor:'#333',
                bgcolor:'transparent',
                fontsize:20,
                margintop:5
            }),
            label({
                text:'+ "$$" searches the directory of the current file',
                fgcolor:'#333',
                bgcolor:'transparent',
                fontsize:20,
                margintop:5
            }),
            jsviewer({
                flex: 0,
                mode:'2d',
                overflow:'scroll',
                alignself: 'center',
                margin: vec4(10),
                source: this.syntaxCode,
                padding: vec4(4),
                fontsize: 14,
                bgcolor: "#000030",
                multiline: true,
                margintop: 15
            }),
            label({
                text:'Note, the following are equivilent:',
                fgcolor:'#F06',
                bgcolor:'transparent',
                fontsize:12,
                margintop:5,
                marginleft:50
            }),
            label({
                text:'$dir$subdir$class',
                fgcolor:'#FFF',
                bgcolor:'transparent',
                fontsize:14,
                margintop:0,
                marginleft:100
            }),
            label({
                text:'$dir$subdir$, class',
                fgcolor:'#FFF',
                bgcolor:'transparent',
                fontsize:14,
                margintop:0,
                marginleft:100
            }),
            label({
                text:'$dir$, subdir$class',
                fgcolor:'#FFF',
                bgcolor:'transparent',
                fontsize:14,
                margintop:0,
                marginleft:100
            }),
            label({
                text:'$dir$, $subdir$, class',
                fgcolor:'#FFF',
                bgcolor:'transparent',
                fontsize:14,
                margintop:0,
                marginleft:100
            })
        ];
    };
});
