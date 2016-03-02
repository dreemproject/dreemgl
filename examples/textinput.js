/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
   Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and limitations under the License.*/

//Pure JS based composition
define.class('$server/composition',function($ui$, screen, view, textbox, button, label){
	// internal

	// what if we do this
	this.style = {
		label:{
			margin:30
		}
	}

 	// so how is that going to work hm?
 	// well we have a _style object.
 	// and that one has an entry for 'textbox'
 	// so what happens? well

 	// we inherit the _style object and copy over props.

 	// we look up textbox in _style
	// this._classes[name]

	this.render = function(){ return [
		screen({clearcolor:'#484230', flexdirection:'row'},
			textbox({value:"T1", bgcolor:'red'}),
			textbox({value:"T2", bgcolor:'orange'}),
			button({text:'test'}),
			label({fgcolor:'red', pointerstart:function(){
				// lets open a modal dialog
				this.screen.openModal(function(){return [
					view({
						// TODO(aki): fix modal menus
						// miss:function(){
						// 	this.screen.closeModal(false)
						// },
						init:function(){
							console.log('here')
						},
						pos:[0,0],
						size:[300,300],position:'absolute',text:'body'
					}, button({text:'test123'}))
				]}).then(function(result){
					console.log(result)
				})
			},text:'Click me to open modal'})
		)
	]}
})
