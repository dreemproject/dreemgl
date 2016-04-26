/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
   Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and limitations under the License.*/

define.class('$base/view', function(require){

	this.title = ''

	this.attribute = {
		click:Config({type:Event})
	}

	define.class(this, 'Button', '$stamps/buttonstamp', function(){
		this.w = float.width('100%')
		this.h = float.height('100%')
	})

	// check if icon is an image, we use that
	this.draw = function(){
		var c = this.canvas
		//for(var i = 0 ; i < 10;i++)
		//	c.drawRect(i*2,0,1,100)
		c.drawButton(this.title, this.icon)
	}
})