/* Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
 You may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
 either express or implied. See the License for the specific language governing permissions and limitations under the License.*/


define.class('$ui/screen', function(require, $ui$, screen, cadgrid, view){
// internal, An Album will display a simple list of image urls, or objects with `.image` url properties.

    this.attributes = {

        // The input for the selection control widget
        selection: Config({type:String, flow:"in"}),

        // The currently selected item
        selecteditem: Config({type:Object, value:null, persist:true, flow:"out"}),

        // Items to display in the album (typically a list of image URLs, or structures with .image attributes)
        items: Config({type:Array, flow:"in", persist:true}),

        selected: Config({type:int, value:0, persist:true}),
        lastknob: Config({type:float, value:0.5, persist:true})
    };

    this.onselected = function(event) {
        this.selecteditem = this.items[this.selected]
    };

    // Fired when selection controller has input ready to process
    this.onselection = function(event) {
        if (!this.items || !this.items.length) {
            return;
        }

        var dir = event.value;
        if (dir === 'left') {
            this.selected = Math.max(0, this.selected - 1)
        } else if (dir === 'right') {
            this.selected = Math.min(this.items.length - 1, this.selected + 1)
        } else if (dir === 'up') {
            this.selected = Math.max(0, this.selected - 6)
        } else if (dir === 'down') {
            this.selected = Math.min(this.items.length - 1, this.selected + 6)
        } else {
            var knobval = parseFloat(dir);
            if (knobval) {
                this.selected = this.items.length * knobval;
            }
        }
    };

    this.render = function() {

        var views = [];
        if (this.items) {
            var j = 0;
            for (var i = 0; i < this.items.length; i++) {
                var item = this.items[i];
                var img;
                if (typeof(item.Poster) === 'string' && item.Poster.startsWith('http')) {
                    img = item.Poster
                } else if (typeof(item.image) === 'string' && item.image.startsWith('http')) {
                    img = item.image
                } else if (typeof(item) === 'string' && item.startsWith('http')) {
                    img = item
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
