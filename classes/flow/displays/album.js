/* Copyright 2015-2016 Teem2 LLC. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
 software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
 either express or implied. See the License for the specific language governing permissions and limitations under the License.*/

define.class('$ui/screen', function(require, $ui$, screen, cadgrid, view){

    this.attributes = {
        images: Config({type:Array, flow:"in"})
    };

    this.render = function() {

        var views = [];
        if (this.images) {
            for (var i = 0; i < this.images.length; i++) {
                var image = this.images[i];
                var img;
                if (typeof(image.Poster) === 'string' && image.Poster.startsWith('http')) {
                    img = image.Poster
                } else if (typeof(image.image) === 'string' && image.image.startsWith('http')) {
                    img = image.image
                } else if (typeof(image) === 'string' && image.startsWith('http')) {
                    img = image
                }
                if (img) {
                    views.push(view({width:100, height:150, margin:5, flex:0, bgimage:img}))
                }
            }
        }

        return cadgrid({bgcolor:"#000030", majorline: "#003040", minorline: "#002030" },
            view({bg:false, flexdirection:"column", flex:1, justifycontent:"center" },
                view({bg:false, flexdirection:"row", flex:1, justifycontent:"center" },
                    view({width:800, bgcolor:vec4(1,1,1,0.15),padding:40,borderradius:50, flexdirection:"row"},
                        views)
                )
            )
        );
    }
});