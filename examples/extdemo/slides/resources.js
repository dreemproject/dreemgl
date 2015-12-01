/* Copyright 2015 Teem2 LLC - Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
 software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
 either express or implied. See the License for the specific language governing permissions and limitations under the License.*/

define.class(function ($containers$, view, $controls$, label) {

    this.slidetitle = "Resources";

    this.flexdirection = 'column';
    this.bgcolor = 'transparent';

    this.attributes = {
        smallfont: {type:int, value:30},
        largefont: {type:int, value:40},
        space: {type:int, value:20}
    };

    this.render = function render() {
        return [
            label({
                text:'+ Detailed Component Guide',
                fgcolor:'#333', bgcolor:'transparent',
                fontsize:this.largefont,
                margintop:0
            }),
            label({
                text:'./compositions/guide/README.md',
                fgcolor:'darkyellow', bgcolor:'transparent',
                alignself:'center',
                fontsize:this.smallfont,
                margintop:this.space
            }),
            label({
                text:'+ Web Service Example (Sample Component)',
                fgcolor:'#333', bgcolor:'transparent',
                fontsize:this.largefont,
                margintop:this.space
            }),
            label({
                text:'https://github.com/teem2/teem-sample_component',
                fgcolor:'darkyellow', bgcolor:'transparent',
                alignself:'center',
                fontsize:this.smallfont,
                margintop:this.space
            }),
            label({
                text:'+ IoT Example (Estimote Beacon)',
                fgcolor:'#333', bgcolor:'transparent',
                fontsize:this.largefont,
                margintop:this.space
            }),
            label({
                text:'https://github.com/teem2/teem-estimotebeacon',
                fgcolor:'darkyellow', bgcolor:'transparent',
                alignself:'center',
                fontsize:this.smallfont,
                margintop:this.space
            }),
            label({
                text:'+ Questions?',
                fgcolor:'#333', bgcolor:'transparent',
                fontsize:this.largefont,
                margintop:this.space
            }),
            label({
                text:'Find me on slack or email mason@teem.nu!',
                fgcolor:'darkpink', bgcolor:'transparent',
                alignself:'center',
                fontsize:this.smallfont,
                margintop:this.space
            })

        ];
    };
});

//https://github.com/teem2/dreemgl/tree/master/compositions/guide