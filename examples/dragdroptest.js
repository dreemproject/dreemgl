/* Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
 You may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
 either express or implied. See the License for the specific language governing permissions and limitations under the License.*/

//Pure JS based composition
define.class('$server/composition', function(require, $ui$, screen, view){
	this.render = function(){ return [
		screen({clearcolor:'#484230', hardrect:false, flexdirection:'row'},
			view({bgcolor:'gray'},
				view({
					name:'T0',
					size:[300, 300],
					bgcolor:'red',
					onpointerstart:function(event){
						var outer = this
						this.startDrag(event, function(){
							return view({
								drawtarget:'color',
								name:'dragger',
								position:'absolute',
								bgcolor:vec4(1,0,1,0.5),
								candrop:0.,
								bgcolorfn:function(pos){
									return mix('transparent','white',pow(1.0-2.*length(pos-.5),0.5)*abs(sin(8.*length(pos-.5)+8.*candrop*time)))
								},
								isDropTarget:function(view){
									// negotiate with the target view wether its a drop target and set the cursor
									if(!view || view === outer){
										this.screen.pointer.cursor = 'no-drop'
										this.candrop = 0
										return false
									}
									this.candrop = view.dropthingy
									this.screen.pointer.cursor = 'copy'
									return true
								},
								atDrop:function(view){ 
									// dropped on a view, make it do stuff
									console.log("Dropped on"+view.name)
								},
								size:[100,100]
							})
						})
					}
				}),
				view({
					dragover:function(){
						this.bordercolor = 'yellow'
					},
					dragout:function(){
						this.bordercolor = 'blue'
					},
					dropthingy:-1,
					borderwidth:2,
					bordercolor:'blue',
					name:'T1',
					size:[300, 300],
					bgcolor:'blue'
				}),
				view({
					dropthingy:1,
					dragover:function(){
						this.bordercolor = 'yellow'
					},
					dragout:function(){
						this.bordercolor = 'purple'
					},
					borderwidth:2,
					bordercolor:'purple',
					name:'T2',
					size:[300, 300],
					bgcolor:'purple'
				})
			)
		)
	]}
})
