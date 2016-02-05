/* Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
 You may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
 either express or implied. See the License for the specific language governing permissions and limitations under the License.*/

define.class('$server/composition', function(require,
											 $ui$, screen, view, splitcontainer, cadgrid,
                                             $$, designer){

	this.render = function(){
		return [
			screen(
				splitcontainer(
					cadgrid({
							name:"grid",
							flex:3,
							overflow:"scroll",
							bgcolor:"#4e4e4e",
							gridsize:5,
							majorevery:5,
							majorline:"#575757",
							minorline:"#484848"
						},
						view({x:30, y:40, size:[100,100], bgcolor:'lightred'}),
						view({x:300, y:40, size:[200,200], bgcolor:'lightgreen'},
							view({x:10, y:10, size:[100,100], bgcolor:'orange'})),
						view({x:200, y:150, size:[100,100], bgcolor:'lightblue'})
					),
					designer({target:"grid"})
				)
			)
		]
	}
});

