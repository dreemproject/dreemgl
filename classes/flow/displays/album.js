/* Copyright 2015-2016 Teem2 LLC. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
 software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
 either express or implied. See the License for the specific language governing permissions and limitations under the License.*/

define.class('$ui/screen', function(require, $ui$, screen, cadgrid, view){

    this.attributes = {
        selection: Config({type:String, flow:"in"}),
        selected: Config({type:int, value:0, persist:true}),
        lastknob: Config({type:float, value:0.5, persist:true}),
        images: Config({type:Array, flow:"in", persist:true})
    };

    this.onselection = function(event) {
        if (!this.images || !this.images.length) {
            return;
        }

        var dir = event.value;
        if (dir === 'left') {
            this.selected = Math.max(0, this.selected - 1)
        } else if (dir === 'right') {
            this.selected = Math.min(this.images.length - 1, this.selected + 1)
        } else if (dir === 'up') {
            this.selected = Math.max(0, this.selected - 6)
        } else if (dir === 'down') {
            this.selected = Math.min(this.images.length - 1, this.selected + 6)
        } else {
            var knobval = parseFloat(dir);
            if (knobval) {
                this.selected = this.images.length * knobval;
            }
        }

    };

    this.render = function() {

        var views = [];
        if (this.images) {
            var j = 0;
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
                    var v = view({width:100, height:150, margin:5, flex:0, bgimage:img});
                    if (j++ == this.selected) {
                        v.bordercolor = 'yellow'
                        v.borderwidth = 5
                        v.borderradius = 5
                    }
                    views.push(v)
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