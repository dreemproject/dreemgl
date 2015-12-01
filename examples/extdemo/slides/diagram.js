/* Copyright 2015 Teem2 LLC - Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
 software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
 either express or implied. See the License for the specific language governing permissions and limitations under the License.*/

define.class(function (require, $containers$, view, $controls$, label) {

    this.slidetitle = "Server Proxy vs POST API";

    this.flexdirection = 'column';
    this.bgcolor = 'transparent';

    this.render = function render() {
        return [
            label({
                text:'When nodejs libraries are available, write everying in DreemGL for convenience!',
                fgcolor:'#333',
                bgcolor:'transparent',
                fontsize:15,
                margintop:0
            }),
            view({
                bgimage:require('./server.png'),
                marginleft:100,
                margintop:0
            }),
            label({
                text:'Otherwise, use the POST API to drive DreemGL externally from devices and services.',
                fgcolor:'#333',
                bgcolor:'transparent',
                alignself:'right',
                fontsize:15,
                margintop:0
            }),
            view({
                bgimage:require('./postapi.png'),
                marginleft:400,
                margintop:0
            })
        ];
    };
});