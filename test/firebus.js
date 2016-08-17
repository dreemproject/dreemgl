/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
 Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
 You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
 software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and limitations under the License.*/

//Pure JS based composition
define.class('$server/composition', function(
	$server$, service,
	$ui$, screen, view, button, label,
	$behaviors$, draggable){ this.render = function(){ return [

	service({
		name:'myservice',
		flowdata:{x:30,y:20},
		test: 10,
		init:function(){
			//console.log(new Error().stack)
		},
		dosomething: function(){
			console.log("dosomething called on server")
			this.test = 40
			this.test = function(value){
				console.log("TEST ATTRIBUTE SET ON SERVEr")
			}
		}
	}),
	screen({
			name:'mobile',
			testcall:function(){
				console.log("CALLED FROM REMOTE!")
			},
			flowdata:{x:10,y:10},
			// make an exportable attribute to something internal
			pointerpos: Config({type:vec2, value:wire('find.main.pos')})
		},
		view({
			name:'main',
			size: vec2(200, 200),
			bgcolor: vec4('yellow'),
			is: draggable()
		}, label({text:"dragme"}))
	),
	screen({
			name:'remote',
			flowdata:{x:30,y:10},
			movepos: Config({type:vec2,value:wire('this.rpc.mobile.pointerpos')})
		},
		view({
			size: vec2(200, 200),
			pos: wire('this.screen.movepos'),
			bgcolor: 'pink'
		}, button({
			text: "test",
			click: function(){
				this.rpc.mobile.testcall()
			}}))
	)
]}})
