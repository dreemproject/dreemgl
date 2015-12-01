/* Copyright 2015 Teem2 LLC - Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
 software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
 either express or implied. See the License for the specific language governing permissions and limitations under the License.*/

define.class(function (require, $containers$, view) {

    this.attributes = {
        celltype: {type: Object},
        data: {type: Array},
        cellwidth: {type: int, value:130},
        cellheight: {type: int, value:160}
    };

    this.render = function render() {

        var views = [];
        if (this.data) {
            for (var i = 0; i < this.data.length; i++) {
                var data = this.data[i];
                data.width = this.cellwidth;
                data.height = this.cellheight;
                views.push(this.celltype(data));
            }
        }
        return views;
    }


});