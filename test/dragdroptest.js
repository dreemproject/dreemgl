/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
   Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and limitations under the License.*/

//Pure JS based composition
define.class('$server/composition', function(require, $ui$, screen, view){
	this.render = function(){ return [
		screen({clearcolor:'#484230', hardrect:false, flexdirection:'row'},
			view({bgcolor:'gray'},
				view({
					name:'T0',
					size:[300, 300],
					bgcolor:'red',
					// the onpointerstart event is where to start a drag and drop op
					onpointerstart:function(event){
						var outer = this
						// startDrag needs a start pointer event and a render function to provide the dragging view
						this.startDrag(event, function(){
							return view({
								drawtarget:'color',
								name:'dragger',
								position:'absolute',
								bgcolor:vec4(1,0,1,0.5),
								candrop:0.,
								// little example hack of shader styled drag item
								bgcolorfn:function(pos){
									return mix('transparent','white',pow(1.0-2.*length(pos-.5),0.5)*abs(sin(8.*length(pos-.5)+8.*candrop*time)))
								},
								// called to check wether something is a drop target. Cursor/style management is your own
								// if return true it will send dragover/dragout events to the underlying view
								isDropTarget:function(view,ev){
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
								// called when the drop is made on a valid droptarget, no events are sent, its up to the implementor
								atDrop:function(view, event){
									// dropped on a view, make it do stuff
									console.log("Dropped on ", view.name, "at", event.position)
								},
								size:[100,100],
								init:function(){
									console.log(this.width)
								}
							})
						})
					}
				}),
				view({
					// called when the drag origin thinks we are a droptarget
					dragover:function(){
						this.bordercolor = 'yellow'
					},
					// called when the drag leaves our space
					dragout:function(){
						this.bordercolor = 'blue'
					},
					// called as the drag item moves over us for extra fancy effects if needed
					dragmove:function(event){

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
