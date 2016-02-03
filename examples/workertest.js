/* Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
 You may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
 either express or implied. See the License for the specific language governing permissions and limitations under the License.*/

//Pure JS based composition
define.class('$server/composition', function(require, $ui$, screen, view){
	this.render = function(){ return [
		screen({clearcolor:'#484230', flexdirection:'row'},
			view({
				init:function(){
					
					var worker = define.class('$system/base/worker', function(){
						this.method = function(){

						}
					})

					var myworker = worker.spawn()
					myworker.method.then(function(){

					})



					var worker = require.worker(function(maprenderer){
						// these methods are proxied
						this.method = function(){
							return 'thing'
						}
					})

					// call a method
					worker.method().then(function(result){
					})
				}
			})
		)
	]}
})
