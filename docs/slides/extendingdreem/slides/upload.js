/* Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
 You may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
 either express or implied. See the License for the specific language governing permissions and limitations under the License.*/

define.class(function ($ui$, view, label, textbox, $widgets$, jsviewer, $$, device) {

    this.slidetitle = "File Upload via POST API";

    this.bgcolor = "transparent";
    this.flexdirection = "column";

    this.attributes = {
    };

    this.render = function render() {
        return [
            label({marginleft:15, fgcolor:'red', bgcolor:'transparent', text:'Use POST API when uploading large data files!'})
        ];
    }
});
