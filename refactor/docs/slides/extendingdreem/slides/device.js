/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
   Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and limitations under the License.*/

define.class(function (require, $ui$, view, label, icon) {

    this.bgcolor = 'transparent';
    this.flexdirection = 'column';
	this.alignitems = "center";
	this.justifycontent = "center";
    this.padding = 10;
    this.margin = 10;

    this.attributes = {
        deviceId:  Config({type:String}),
        deviceType: Config({type:String})
    };

    this.render = function() {
        return [
          icon({flex:1, width:this.width, bgcolor:NaN, icon:this.deviceType, fontsize:50, fgcolor:"#333", alignself:'center'}),
          label({flex:0.5, name:'txt', text:this.deviceId, fontsize:11, fgcolor:'#333', bgcolor:'transparent', alignself:'center'})
        ]
    }

});
