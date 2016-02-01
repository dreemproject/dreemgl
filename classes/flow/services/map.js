/* Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
 You may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
 either express or implied. See the License for the specific language governing permissions and limitations under the License.*/

define.class('$ui/screen', function($ui$, view, $examples$staticmap$, map){

    this.attributes = {
        location: Config({type:String, flow:"in"}),
        zoomLevel: Config({type:String, flow:"in"}),
        zooml: Config({type:int, value:14})
    };

    this.bestZoom = function () {

        var zl = this.zooml;

        var zlf = parseFloat(this.zoomLevel);

        if (zlf) {
            zl = zlf * 21;
        } else {
            if (this.zoomLevel === 'up' || this.zoomLevel === 'left') {
                zl++;
                this.zoomLevel = undefined
            } else if (this.zoomLevel === 'down' || this.zoomLevel === 'right') {
                zl--;
                this.zoomLevel = undefined
            }
        }

        if (!zl) {
            zl = 14; //default
        }
        if (zl < 0) {
            zl = 0; //min
        }
        if (zl > 21) {
            zl = 21; //max
        }

        this.zooml = Math.round(zl);
        return this.zooml;
    };

    this.render = function(){
        return map({width:400, height:400, location:this.location, mapzoom:this.bestZoom()})
    }
});
