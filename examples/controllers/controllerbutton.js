/* Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
 You may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
 either express or implied. See the License for the specific language governing permissions and limitations under the License.*/

define.class("$ui/button", function() {

    this.height = 50;
    this.alignitems = 'center'
    this.justifycontent = 'center'
    this.attributes = {
        value:wire('this.text'),
        controller:Config({type:Object})
    };

    this.mouseleftdown = function() {
        console.log('press', this.value);
        if (this.controller && this.controller.press) {
            this.controller.press(this.value)
        }
    };

    this.mouseleftup = function() {
        console.log('unpress', this.value);
        if (this.controller && this.controller.unpress) {
            this.controller.unpress(this.value)
        }
    }

});
