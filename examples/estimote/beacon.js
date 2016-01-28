/* Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
 You may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
 either express or implied. See the License for the specific language governing permissions and limitations under the License.*/

define.class("$ui/view", function($ui$, label) {

    this.bgcolor = 'pink';
    this.padding = 10;
    this.margin = 10;
    this.borderwidth = 2;
    this.bordercolor = "#333";
    this.flex = 1;
    this.height = 100;
    this.borderradius = 20;

    this.attributes = {
        distance: Config({type:String}),
        data: Config({type:Object}),
        changelog: Config({type:String})
    };

    this.ondata = function (e) {
        var data = e.value;
        if (data && data.beacon) {
            this.distance = parseFloat(data.beacon.distance).toFixed(2) + ' m';
        }
    };

    this.render = function () {
        return [
            label({text: this.distance, fgcolor:'#333', bgcolor:'transparent'})
        ];
    };

});
