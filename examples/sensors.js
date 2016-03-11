/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
 Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
 You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
 software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and limitations under the License.*/

define.class('$server/composition', function($ui$, screen, cadgrid, view, icon, label, $sensors$, gyro){

	this.render = function() {
		return [
			screen({name:'default', clearcolor:vec4('black')},
				gyro({
					name:"gyro",
					onacceleration:function(ev,v,o) {
						o.find("x").text = v[0];
						o.find("y").text = v[1];
						o.find("z").text = v[2];
					},
					onorientation:function(ev,v,o) {
						o.find("alpha").text = v[0];
						o.find("beta").text  = v[1];
						o.find("gamma").text = v[2];
					},
					onsupported:function(ev,v,o) {
						o.find("searching").visible = false;
						o.find("gyrout").visible = true;
					}
				}),
				cadgrid({
						flex:1,
						flexdirection:"column",
						justifycontent:"space-around",
						alignitems:"center"
					},
					label({name:"searching", visible:true, text:"Searching for gyro device...", fgcolor:"#666", fontsize:40}),

					view({  name:"gyrout",
						    visible:false,
							flexdirection:"column",
							justifycontent:"space-around",
							alignitems:"center"
						},
						label({marginbottom:15, text:"Move your device to see\ngyroscope values change:", fgcolor:"#666", fontsize:20}),
						view({padding:5}, label({marginright:10, fgcolor:"red", text:"x"}),     label({fgcolor:"blue", name:"x", text:"0"}) ),
						view({padding:5}, label({marginright:10, fgcolor:"red", text:"y"}),     label({fgcolor:"blue", name:"y", text:"0"}) ),
						view({padding:5}, label({marginright:10, fgcolor:"red", text:"z"}),     label({fgcolor:"blue", name:"z", text:"0"}) ),
						view({padding:5}, label({marginright:10, fgcolor:"red", text:"alpha"}), label({fgcolor:"blue", name:"alpha", text:"0"}) ),
						view({padding:5}, label({marginright:10, fgcolor:"red", text:"beta"}),  label({fgcolor:"blue", name:"beta", text:"0"}) ),
						view({padding:5}, label({marginright:10, fgcolor:"red", text:"gamma"}), label({fgcolor:"blue", name:"gamma", text:"0"}) )
					)
				)
			)
		]
	}
});
