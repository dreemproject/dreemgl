/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
 Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
 You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
 software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and limitations under the License.*/

define.class("$ui/view", function(require,$ui$, view,label, button, noisegrid,speakergrid)
{
	this.flex = 1;
	this.attributes = {
		target: "index"
	}
	this.render = function(){
		return [
			speakergrid({flex:1, padding: 70},noisegrid({padding:20,borderradius: 20, justifycontent: "center"},

				view({bg:0, alignself:"center", flexdirection:"column"}
					,label({name:"thelabel", text: "", bg:0})
					,button({icon:"arrows",margin: 10, padding:20, pointerstart : function(){this.setAccelTarget("Move");}.bind(this), pointerend: function(){this.setAccelTarget("");}.bind(this)})
					,button({icon:"video-camera",margin: 10, padding:20, pointerstart : function(){this.setAccelTarget("Pan");}.bind(this), pointerend: function(){this.setAccelTarget("");}.bind(this)})
				)
			)
			)
		]
	};

	this.setAccelTarget = function(target){
		this.acceltarget = target;
	}

	this.setAccel = function(x,y,z){
		//	this.find("thelabel").text = x + "_" + y + "_" + z;
		if (this.acceltarget == "Move"){
			this.rpc[this.target].acceleromove(x,y,z);

		}
		if (this.acceltarget == "Pan"){
			this.rpc[this.target].acceleropan(x,y,z);
		}
	}

	this.init = function()
	{
		this.acceltarget = "";
		window.ondevicemotion = function(event) {
			var ax = event.accelerationIncludingGravity.x;
			var ay = event.accelerationIncludingGravity.y;
			var az = event.accelerationIncludingGravity.z;

			this.setAccel(ax,ay,az);

		}.bind(this)
	}
}
)
