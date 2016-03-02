/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
   Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and limitations under the License.*/

define.class(function($server$, composition, $ui$, screen, view, label, cadgrid, require){
  this.render = function(){ return [
      screen({name:'default', clearcolor:'#484230'},
             view({
				 flexflow: 'row wrap'
				 ,flexdirection:'row'
				 ,flex:1
				 ,bgcolor: 'gray'
             }

				  ,label({
					  fontsize: 36.0
					  ,fgcolor: '#c2c5ca'
					  ,text: 'Label'
					  ,bg: 0
					  ,bgcolor: 'transparent'
				  })

				  ,cadgrid({name:"centralconstructiongrid", overflow:"scroll" ,bgcolor: "#3b3b3b",gridsize:5,majorevery:5,  majorline:"#474747", minorline:"#373737"})
				 )

			)
  ]}

})
