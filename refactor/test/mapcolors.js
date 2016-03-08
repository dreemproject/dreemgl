/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
   Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and limitations under the License.*/

//Pure JS based composition
define.class('$server/composition', function(require, $ui$,foldcontainer, screen, view, menubar, button,label, speakergrid){
	
	
	define.class(this, "colortest", "$ui/view",  function( $ui$, view){
		
		var styleset =  require("$widgets/map/mapstyle.js");
		var mapstyle = styleset().mapstyle;
		this.flexdirection = "column" ;
		this.bgcolor = NaN;
		this.overflow = "scroll";
		this.render =function(){
			var k = Object.keys(mapstyle);
			var roads = [];
			
			var res = [];
			
			for(var i =0 ;i<k.length;i++){
				
				var  s = mapstyle[k[i]];
				if (s.roadcolor){
					roads.push(view({margin:4,padding:10,bgcolor:s.roadcolor}, label({text:k[i], fgcolor:vec4.contrastcolor(s.roadcolor),bgcolor:NaN})))
				}
				else{
					if (s.color1){
						res.push(view({margin:4,padding:10,bgcolor:s.color1}, label({text:k[i],fgcolor:vec4.contrastcolor(s.color1), bgcolor:NaN})))
					}
				}
			}
			
			
			return [
				foldcontainer({title:"Roads", basecolor:"ocean"},view({flexdirection:"row", bgcolor:NaN},roads)),
				foldcontainer({title:"Areas", basecolor:"ocean"},view({flexdirection:"column",flexwrap:"wrap",height:700, bgcolor:NaN},res))
				];
		}
	});

	this.justifycontent = "center" ;
	this.alignitems = "center"
	this.style = {
		"*":{fontsize:12}
	}
	this.render = function(){ return [
		screen({clearcolor:vec4('black'), title:"Colors used in map"},
			this.colortest({flex:1})
		)
	]}
})
