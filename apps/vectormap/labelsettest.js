/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
 Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
 You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
 software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and limitations under the License.*/

define.class('$server/composition', function (require,  $server$, fileio,$ui$, numberbox,view, label, screen, speakergrid, splitcontainer,noisegrid, labelset, $$, map, urlfetch, acceleroremote,$3d$, ballrotate){


	this.render = function(){
		this.thelabels = [];
		for (var i =0 ;i<1000;i++){
			var l = {text:i.toString(), pos:vec3(Math.random()*1000,Math.random()*1000,0)}
			this.thelabels.push(l);
		}
		return [
			screen({name:"index",style:{$:{fontsize:12}}},
				labelset({labels:this.thelabels, fgcolor:"white", bgcolor:"blue"})
			)
		];
	}
})
