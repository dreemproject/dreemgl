/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
 Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
 You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
 software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and limitations under the License.*/

define.class("$server/composition",function(require, $ui$, screen, label, button, view, $widgets$, videoplayer) {

		this.render = function() {
			return [
				screen(
					view({flex: 1, flexdirection: 'column', justifycontents:'space-around'},

							 // You can use bgimagemode 'aspect-fit', or another setting,
							 // to force the video to the size of the player. The default
							 // value is 'resize' which sizes the videoplayer to the size
							 // of the video.
							 videoplayer({name: 'player', autoplay: false,
														width: 640, height: 480,
														bgcolor: vec4('gray'),
														url: './assets/big_buck_bunny_720p_2mb.mp4',
														update: function() {
															this.screen.find('time').text = 'time: ' + this.currenttime.toFixed(2)
														}
													 }),

							 view({width: 640, height: 50, flexdirection: 'row'},
										button({text: 'Start/Stop', width: 100, height: 30, flex:0,
														click: function() {
															var player = this.screen.find('player')
															if (player.playing)
																player.stop();
															else
																player.play();
														}
													 }),
										button({text: 'Pause', width: 100, height: 30, flex:0,
														click: function() {
															var player = this.screen.find('player')
															player.pause();
														}
													 }),
										label({name: 'time', text: '', marginleft:10, width: 200})
									 )
							)
				)
			]
		}
}
)
