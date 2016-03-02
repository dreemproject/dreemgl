/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
   Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and limitations under the License.*/

define.class(function(require, shape3d){

	var GLGeom = require('$system/geometry/basicgeometry')

	this.attributes = {
		radius: Config({type:float, value:1}),
		pointradius: Config({type:float, value:0}),
		height: Config({type:float, value:1}),
		detail: Config({type:float, value:60}),
		cap: true
	}

	this.shape3d = {
		update:function(){
			
			var view = this.view
			
				var D = view.height;
				var R = view.radius 
				
				var gamma = Math.asin(R/D);
				var beta = R / Math.tan(gamma);
				var alpha = beta * Math.sin(gamma); // = radius for the cone!
				var conet = beta * Math.cos(gamma);
		
		coneoffs = D - conet;
			
			this.mesh = this.vertexstruct.array();
			GLGeom.createCone(alpha,view.pointradius, view.height, view.detail,view.cap, function(triidx,v1,v2,v3,n1,n2,n3,t1,t2,t3,faceidx){
				this.mesh.push(v1[0],v1[1]+coneoffs,v1[2],n1,t1);
				this.mesh.push(v2[0],v2[1]+coneoffs,v2[2],n2,t2);
				this.mesh.push(v3[0],v3[1]+coneoffs,v3[2],n3,t3);
			}.bind(this))	
			
			GLGeom.createSphere(view.radius*1, view.detail, view.detail,function(triidx,v1,v2,v3,n1,n2,n3,t1,t2,t3,faceidx){
				this.mesh.push(v1,n1,t1);
				this.mesh.push(v2,n2,t2);
				this.mesh.push(v3,n3,t3);
			}.bind(this))	
		}
	}
})
