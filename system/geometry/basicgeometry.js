/* Copyright 2015 Teem2 LLC. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.  
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing, 
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, 
   either express or implied. See the License for the specific language governing permissions and limitations under the License.*/


define(function(require, exports){		
	var v1 = vec3(0,0,0);
	var v2 = vec3(0,0,0);
	var v3 = vec3(0,0,0);
	var n1 = vec3(0,0,0);
	var n2 = vec3(0,0,0);
	var n3 = vec3(0,0,0);
	var t1 = vec2(0,0);
	var t2 = vec2(0,0);
	var t3 = vec2(0,0);
	
	var v1n1t1 = function(x,y,z,nx,ny,nz,tx,ty){
		v1[0] = x;
		v1[1] = y;
		v1[2] = z;
		n1[0] = nx;
		n1[1] = ny;
		n1[2] = nz;
		t1[0] = tx;
		t1[1] = ty;
	}

	var v2n2t2 = function(x,y,z,nx,ny,nz,tx,ty){
		v2[0] = x;
		v2[1] = y;
		v2[2] = z;
		n2[0] = nx;
		n2[1] = ny;
		n2[2] = nz;
		t2[0] = tx;
		t2[1] = ty;
	}

	var v3n3t3 = function(x,y,z,nx,ny,nz,tx,ty){
		v3[0] = x;
		v3[1] = y;
		v3[2] = z;
		n3[0] = nx;
		n3[1] = ny;
		n3[2] = nz;
		t3[0] = tx;
		t3[1] = ty;
	}
	
	exports.createModel = function(data, cb) {
		var lines = data.split('\n');
		var vertices = [vec3(0,0,0)];
		var normals = [vec3(0,0,0)];
		var texcoords = [vec3(0,0,0)]
		var multicoords = [vec3(0,0,0)]
		var faceidx = 0;

		for(var i = 0; i < lines.length; i++) {
			var line = lines[i].trim();
			if (line.length > 0) {
				line = line.replace("  "," ");
				var parts = line.split(' ');
				var linetype = parts[0];
				if (linetype == 'f') {

					if (parts[1].indexOf('/')>-1) splitter = '/'; else splitter = '\\';
				
					var triangles = [[1,2,3]]
					
					if (parts.length > 4) {  // dirty triangle fan implementation for Ngons.. 
						for (var j = 1;j<parts.length-3;j++){							
							triangles.push([1,j+2, j+3]);						
						}
					}
					
					for (var j = 0; j < triangles.length; j++) {						
						var t = triangles[j];
						
						var ia = t[0];
						var ib = t[1];
						var ic = t[2];						
					
						var i1 = parts[ia].split(splitter).map(function(a){return Math.floor(a);});
						var i2 = parts[ib].split(splitter).map(function(a){return Math.floor(a);});
						var i3 = parts[ic].split(splitter).map(function(a){return Math.floor(a);});
						
						var n1,n2,n3,t1,t2,t3;						
						var v1 = vertices[i1[0]];
						var v2 = vertices[i2[0]];
						var v3 = vertices[i3[0]];
						
						if (i1.length == 1 || i1[1].length == 0) {
							t1 = vec3(0,0,0);
							t2 = vec3(1,0,0);
							t3 = vec3(1,1,0);							
						} else {
							t1 = texcoords[i1[1]];
							t2 = texcoords[i2[1]];
							t3 = texcoords[i3[1]];
						}
						
						if (i1.length  < 3) {// generate normals;
							var ab = vec3.sub(v2,v1);
							var bc = vec3.sub(v3,v1);						
							n3 = n2 =n1 = vec3.normalize(vec3.cross(ab,bc));							
						} 
						else {
							n1 = normals[i1[2]];
							n2 = normals[i2[2]];
							n3 = normals[i3[2]];
						}
						
						cb(faceidx, v1,v2,v3, n1,n2,n3,t1,t2,t3,faceidx);
						faceidx++;
					}
				}
				else if (linetype == 'v')  {vertices.push(vec3(parseFloat(parts[1]), parseFloat(parts[2]), parseFloat(parts[3])))}
				else if (linetype == 'vt') {texcoords.push(vec3(parseFloat(parts[1]), parseFloat(parts[2]), parseFloat(parts[3])))}
				else if (linetype == 'vn') {normals.push(vec3(parseFloat(parts[1]), parseFloat(parts[2]),parseFloat(parts[3])))}
				else if (linetype == 'vp') {multicoords.push(vec3(parseFloat(parts[1]), parseFloat(parts[2]), parseFloat(parts[3])))}
			}
		}
		
		//console.log("loaded " + (vertices.length -1) + " vertices and " + faceidx + " triangles");
	};		

	exports.createCube = function(width, height, depth, cb) {
		
		if(arguments.length === 2) cb = height, height = depth = width
		if(arguments.length === 3) cb = depth, depth = height, height = width
	
		var hw = width  / 2;
		var hh = height / 2;
		var hd = depth  / 2;

// vertices:		
//
//   d --- c
//  /|    /|
// a --- b |
// | h - |-g
// |/    |/		
// e --- f
//
// faces:
//
// abcd -> abc, acd ->  0, 0,-1
// aefb -> aef, afb ->  0,-1, 0
// adhe -> adh, ahe -> -1, 0, 0
// bfgc -> bfg, bgc ->  1, 0, 0
// cghd -> cgh, chd ->  0, 1, 0
// ehgf -> ehg, egf ->  0, 0, 1

		var ax = -hw, ay = -hh, az = -hd;
		var bx = hw, by = -hh, bz = -hd;
		var cx = hw, cy = hh, cz = -hd;
		var dx = -hw, dy = hh, dz = -hd;
		var ex = -hw, ey = -hh, ez = hd;
		var fx  = hw, fy = -hh, fz = hd;
		var gx = hw, gy = hh, gz = hd;
		var hx = -hw, hy = hh, hz = hd;			
		
		v1n1t1(ax,ay,az,0,0,-1,0,0); v2n2t2(bx,by,bz,0,0,-1,1,0); v3n3t3(cx,cy,cz,0,0,-1,1,1);		
		cb(0, v1, v2, v3, n1, n2, n3, t1, t2, t3, 0);
		v1n1t1(ax,ay,az,0,0,-1,0,0); v2n2t2(cx,cy,cz,0,0,-1,1,1); v3n3t3(dx,dy,dz,0,0,-1,0,1);
		cb(1, v1, v2, v3, n1, n2, n3, t1, t2, t3, 0);
	
		v1n1t1(ax,ay,az,0,-1,0,0,0);v2n2t2(ex,ey,ez,0,-1,0,1,0);v3n3t3(fx,fy,fz,0,-1,0,1,1);		
		cb(2, v1, v2, v3, n1, n2, n3, t1, t2, t3, 1);
		v1n1t1(ax,ay,az,0,-1,0,0,0);v2n2t2(fx,fy,fz,0,-1,0,1,1);v3n3t3(bx,by,bz,0,-1,0,0,1);		
		cb(3, v1, v2, v3, n1, n2, n3, t1, t2, t3, 1);

		v1n1t1(ax,ay,az,-1,0,0,0,0);v2n2t2(dx,dy,dz,-1,0,0,1,0);v3n3t3(hx,hy,hz,-1,0,0,1,1);		
		cb(4, v1, v2, v3, n1, n2, n3, t1, t2, t3, 2);
		v1n1t1(ax,ay,az,-1,0,0,0,0);v2n2t2(hx,hy,hz,-1,0,0,1,1);v3n3t3(ex,ey,ez,-1,0,0,0,1);		
		cb(5, v1, v2, v3, n1, n2, n3, t1, t2, t3, 2);

		v1n1t1(bx,by,bz,1,0,0,0,0);v2n2t2(fx,fy,fz,1,0,0,1,0);v3n3t3(gx,gy,gz,1,0,0,1,1);		
		cb(6, v1, v2, v3, n1, n2, n3, t1, t2, t3, 3);
		v1n1t1(bx,by,bz,1,0,0,0,0);v2n2t2(gx,gy,gz,1,0,0,1,1);v3n3t3(cx,cy,cz,1,0,0,0,1);		
		cb(7, v1, v2, v3, n1, n2, n3, t1, t2, t3, 3);

		v1n1t1(cx,cy,cz,0,1,0,0,0);v2n2t2(gx,gy,gz,0,1,0,1,0);v3n3t3(hx,hy,hz,0,1,0,1,1);		
		cb(8, v1, v2, v3, n1, n2, n3, t1, t2, t3, 4);
		v1n1t1(cx,cy,cz,0,1,0,0,0);v2n2t2(hx,hy,hz,0,1,0,1,1);v3n3t3(dx,dy,dz,0,1,0,0,1);		
		cb(9, v1, v2, v3, n1, n2, n3, t1, t2, t3, 4);

		v1n1t1(ex,ey,ez,0,0,1,0,0);v2n2t2(hx,hy,hz,0,0,1,1,0);v3n3t3(gx,gy,gz,0,0,1,1,1);		
		cb(10, v1, v2, v3, n1, n2, n3, t1, t2, t3, 5);
		v1n1t1(ex,ey,ez,0,0,1,0,0);v2n2t2(gx,gy,gz,0,0,1,1,1);v3n3t3(fx,fy,fz,0,0,1,0,1);		
		cb(11, v1, v2, v3, n1, n2, n3, t1, t2, t3, 5);		
	}
	
	exports.createSphere = function(R, xdetail,ydetail, cb) {		
		for (var p = 0; p < xdetail ; p+=1) {
			var angle1 = (p * (3.14159265359 * 2))/xdetail;
			var angle2 = (p + 1) * (3.14159265359 * 2)/xdetail;
			var ax1 = Math.sin(angle1)
			var ax2 = Math.sin(angle2)
			var ay1 = Math.cos(angle1)
			var ay2 = Math.cos(angle2)
			var tx1 = p / xdetail;
			var tx2 = (p + 1) / xdetail;
			
			for (var q = 0;q < ydetail;q += 1) {
				var ty1 = q / ydetail;
				var ty2 = (q + 1) / ydetail;
				
				var angle3 = q * 3.14159265359 / ydetail
				var angle4 = (q + 1) * 3.14159265359 / ydetail
				var r1 = Math.sin(angle3);
				var r2 = Math.sin(angle4);
				var h1 = Math.cos(angle3);
				var h2 = Math.cos(angle4);
				
				// a   b  -> ax1 * r1, ay1 * r1, h1   -> ax2 * r1, ay2 * r1, h1 
				// d   c  -> ax1 * r2, ay1 * r2, h2   -> ax2 * r2, ay2 * r2, h2 
				var ax = ax1 * r1, ay = ay1 * r1, az = h1;
				var bx = ax2 * r1, by = ay2 * r1, bz = h1;
				var dx = ax1 * r2, dy = ay1 * r2, dz = h2;
				var cx = ax2 * r2, cy = ay2 * r2, cz = h2;
				
				v1n1t1(ax*R,ay*R,az*R,ax,ay,az,tx1,ty1); v2n2t2(bx*R,by*R,bz*R,bx,by,bz,tx2,ty1); v3n3t3(cx*R,cy*R,cz*R,cx,cy,cz,tx2,ty2);		
				cb(0, v1, v2, v3, n1, n2, n3, t1, t2, t3, 0);
				
				v1n1t1(ax*R,ay*R,az*R,ax,ay,az,tx1,ty1); v2n2t2(cx*R,cy*R,cz*R,cx,cy,cz,tx2,ty2); v3n3t3(dx*R,dy*R,dz*R,dx,dy,dz,tx1,ty2);
				cb(1, v1, v2, v3, n1, n2, n3, t1, t2, t3, 0);
			}
		}
	}

	function B1(t) { return t * t * t; }
	function B2(t) { return 3 * t * t * (1 - t); }
	function B3(t) { return 3 * t * (1 - t) * (1 - t); }
	function B4(t) { return (1 - t) * (1 - t) * (1 - t); }

	function getBezier(percent,C1,C2,C3,C4) {		
		var pos = vec3();
		
		var b1 = B1(percent);
		var b2 = B2(percent);
		var b3 = B3(percent);
		var b4 = B4(percent);
		
		pos[0] = C1[0] * b1 + C2[0] * b2 + C3[0] * b3 + C4[0] * b4;
		pos[1] = C1[1] * b1 + C2[1] * b2 + C3[1] * b3 + C4[1] * b4;
		pos[2] = C1[2] * b1 + C2[2] * b2 + C3[2] * b3 + C4[2] * b4;

		return pos;
	}
	
	exports.createPlane = function(width, height, xdiv, ydiv, cb){
		
		var ox = -width/2;
		var oy = -height/2;
		var ix = width / xdiv;
		var iy = height / ydiv;
		var tx = 1/xdiv;
		var ty = 1/ydiv;
		for (var x = 0;x<xdiv;x++){
			for (var y = 0; y < ydiv; y++){
				
				var ax = ox + (x + 0) * ix;var ay = oy + (y + 0) * iy;
				var bx = ox + (x + 1) * ix;var by = oy + (y + 0) * iy;
				var cx = ox + (x + 1) * ix;var cy = oy + (y + 1) * iy;
				var dx = ox + (x + 0) * ix;var dy = oy + (y + 1) * iy;
				
				var atx = tx * x; var aty = ty * y;
				var btx = tx * (x+1); var bty = ty * y;
				var ctx = tx * (x+1); var cty = ty * (y+1);
				var dtx = tx * x; var dty = ty * (y+1);
				
				v1n1t1(ax,ay,0,0,0,-1,atx,aty); v2n2t2(bx,by,0,0,0,-1,btx,bty); v3n3t3(cx,cy,0,0,0,-1,ctx,cty);		
				cb(0, v1, v2, v3, n1, n2, n3, t1, t2, t3, 0);
				v1n1t1(ax,ay,0,0,0,-1,atx,aty); v2n2t2(cx,cy,0,0,0,-1,ctx,cty); v3n3t3(dx,dy,0,0,0,-1,dtx,dty);
				cb(1, v1, v2, v3, n1, n2, n3, t1, t2, t3, 0);
		
		
			}
		}
		
	}

	
	exports.createTeapot = function (radius, detail, cb){

		var patchdata = [
    /* rim */  	[102, 103, 104, 105, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
    /* body */ 	[12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27],
				[24, 25, 26, 27, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40],
    /* lid */  	[96, 96, 96, 96, 97, 98, 99, 100, 101, 101, 101, 101, 0, 1, 2, 3,],
				[0, 1, 2, 3, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117],
    /* bottom */[118, 118, 118, 118, 124, 122, 119, 121, 123, 126, 125, 120, 40, 39, 38, 37],
    /* handle */[41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56],
				[53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 28, 65, 66, 67],
    /* spout */ [68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83],
				[80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95]
			];			

		var controlpoints  =
		[
			[0.2, 0, 2.7], 
			[0.2, -0.112, 2.7], 	
			[0.112, -0.2, 2.7], 
			[0, -0.2, 2.7], 
			[1.3375, 0, 2.53125], 
			[1.3375, -0.749, 2.53125],
			[0.749, -1.3375, 2.53125], 
			[0, -1.3375, 2.53125], 
			[1.4375,  0, 2.53125], 
			[1.4375, -0.805, 2.53125], 
			[0.805, -1.4375, 2.53125], 
			[0, -1.4375, 2.53125], 
			[1.5, 0, 2.4], 
			[1.5, -0.84, 2.4], 
			[0.84, -1.5, 2.4], [0, -1.5, 2.4], [1.75, 0, 1.875],
			[1.75, -0.98, 1.875], [0.98, -1.75, 1.875], [0, -1.75, 1.875], [2, 0, 1.35], [2, -1.12, 1.35], [1.12, -2, 1.35], [0, -2, 1.35], [2, 0, 0.9], [2, -1.12, 0.9], [1.12, -2, 0.9], [0, -2, 0.9], [-2, 0, 0.9], [2, 0, 0.45], [2, -1.12, 0.45], [1.12, -2, 0.45], [0, -2, 0.45], [1.5, 0, 0.225], [1.5, -0.84, 0.225], [0.84, -1.5, 0.225], [0, -1.5, 0.225], [1.5, 0, 0.15], [1.5, -0.84, 0.15], [0.84, -1.5, 0.15], [0,
    -1.5, 0.15], [-1.6, 0, 2.025], [-1.6, -0.3, 2.025], [-1.5,-0.3, 2.25], [-1.5, 0, 2.25], [-2.3, 0, 2.025], [-2.3, -0.3, 2.025], [-2.5, -0.3, 2.25], [-2.5, 0, 2.25], [-2.7, 0, 2.025], [-2.7, -0.3, 2.025], [-3, -0.3, 2.25], [-3, 0, 2.25], [-2.7, 0, 1.8], [-2.7, -0.3, 1.8], [-3, -0.3, 1.8],
    [-3, 0, 1.8], [-2.7, 0, 1.575], [-2.7, -0.3, 1.575], [-3, -0.3, 1.35], [-3, 0, 1.35], [-2.5, 0, 1.125], [-2.5, -0.3, 1.125], [-2.65, -0.3, 0.9375], [-2.65, 0, 0.9375], [-2, -0.3, 0.9], [-1.9, -0.3, 0.6], [-1.9, 0, 0.6], [1.7, 0, 1.425], [1.7, -0.66, 1.425], [1.7, -0.66, 0.6], [1.7, 0, 0.6], [2.6, 0, 1.425], [2.6, -0.66, 1.425], [3.1, -0.66, 0.825], [3.1, 0, 0.825], [2.3, 0, 2.1], [2.3, -0.25, 2.1],
    [2.4, -0.25, 2.025], [2.4, 0, 2.025], [2.7, 0, 2.4], [2.7,
    -0.25, 2.4], [3.3, -0.25, 2.4], [3.3, 0, 2.4], [2.8, 0,
    2.475], [2.8, -0.25, 2.475], [3.525, -0.25, 2.49375],
    [3.525, 0, 2.49375], [2.9, 0, 2.475], [2.9, -0.15, 2.475],
    [3.45, -0.15, 2.5125], [3.45, 0, 2.5125], [2.8, 0, 2.4],
    [2.8, -0.15, 2.4], [3.2, -0.15, 2.4], [3.2, 0, 2.4], [0, 0,
    3.15], [0.8, 0, 3.15], [0.8, -0.45, 3.15], [0.45, -0.8,
    3.15], [0, -0.8, 3.15], [0, 0, 2.85], [1.4, 0, 2.4], [1.4,
    -0.784, 2.4], [0.784, -1.4, 2.4], [0, -1.4, 2.4], [0.4, 0,
    2.55], [0.4, -0.224, 2.55], [0.224, -0.4, 2.55], [0, -0.4,
    2.55], [1.3, 0, 2.55], [1.3, -0.728, 2.55], [0.728, -1.3,
    2.55], [0, -1.3, 2.55], [1.3, 0, 2.4], [1.3, -0.728, 2.4],[0.728, -1.3, 2.4], [0, -1.3, 2.4], [0, 0, 0], [1.425,-0.798, 0], [1.5, 0, 0.075], [1.425, 0, 0], [0.798, -1.425,0], [0, -1.5, 0.075], [0, -1.425, 0], [1.5, -0.84, 0.075],[0.84, -1.5, 0.075]];
		
		for(var i =0;i<10;i++){
			var patch = patchdata[i];
			var pcontrol = []
			for (var j = 0;j<16;j++) {
				var cp = controlpoints[patch[j]];
				pcontrol.push(vec3.mulfloat(vec3(cp[0], cp[1], cp[2]), radius));
			}
			
			//var detail = 10;
			var ndetail = -0.01/detail;
			
			for (var j =0 ;j<detail;j++) {
				var p1 = j/detail;
				var p2 = (j+1)/detail;
				var p1n = p1 + ndetail
				var p2n = p2 + ndetail
				
				var P1a = getBezier(p1, pcontrol[0], pcontrol[1], pcontrol[2], pcontrol[3]);
				var P2a = getBezier(p1, pcontrol[4], pcontrol[5], pcontrol[6], pcontrol[7]);
				var P3a = getBezier(p1, pcontrol[8], pcontrol[9], pcontrol[10], pcontrol[11]);
				var P4a = getBezier(p1, pcontrol[12], pcontrol[13], pcontrol[14], pcontrol[15]);

				var P1an = getBezier(p1n, pcontrol[0], pcontrol[1], pcontrol[2], pcontrol[3]);
				var P2an = getBezier(p1n, pcontrol[4], pcontrol[5], pcontrol[6], pcontrol[7]);
				var P3an = getBezier(p1n, pcontrol[8], pcontrol[9], pcontrol[10], pcontrol[11]);
				var P4an = getBezier(p1n, pcontrol[12], pcontrol[13], pcontrol[14], pcontrol[15]);

				var P1b = getBezier(p2, pcontrol[0], pcontrol[1], pcontrol[2], pcontrol[3]);
				var P2b = getBezier(p2, pcontrol[4], pcontrol[5], pcontrol[6], pcontrol[7]);
				var P3b = getBezier(p2, pcontrol[8], pcontrol[9], pcontrol[10], pcontrol[11]);
				var P4b = getBezier(p2, pcontrol[12], pcontrol[13], pcontrol[14], pcontrol[15]);
                
				var P1bn = getBezier(p2n, pcontrol[0], pcontrol[1], pcontrol[2], pcontrol[3]);
				var P2bn = getBezier(p2n, pcontrol[4], pcontrol[5], pcontrol[6], pcontrol[7]);
				var P3bn = getBezier(p2n, pcontrol[8], pcontrol[9], pcontrol[10], pcontrol[11]);
				var P4bn = getBezier(p2n, pcontrol[12], pcontrol[13], pcontrol[14], pcontrol[15]);

				for (var k =0 ;k<detail;k++)
				{
					var q1 = k/detail;
					var q2 = (k+1)/detail;
					var q1n = q1 + ndetail
					var q2n = q2 + ndetail
					
					var AA = getBezier(q1, P1a, P2a, P3a, P4a);
					var AAn1 = getBezier(q1n, P1a, P2a, P3a, P4a);
					var AAn2 = getBezier(q1, P1an, P2an, P3an, P4an);

					var BB = getBezier(q2, P1a, P2a, P3a, P4a);
					var BBn1 = getBezier(q2n, P1a, P2a, P3a, P4a);
					var BBn2 = getBezier(q2, P1an, P2an, P3an, P4an);

					var CC = getBezier(q2, P1b, P2b, P3b, P4b);
					var CCn1 = getBezier(q2n, P1b, P2b, P3b, P4b);
					var CCn2 = getBezier(q2, P1bn, P2bn, P3bn, P4bn);

					var DD = getBezier(q1, P1b, P2b, P3b, P4b);
					var DDn1 = getBezier(q1n, P1b, P2b, P3b, P4b);
					var DDn2 = getBezier(q1, P1bn, P2bn, P3bn, P4bn);

					function calcnormal(a,b,c){
						var _ab = vec3.sub(a,b);
						var _cb = vec3.sub(c,b);
						return vec3.normalize(vec3.cross(_ab,_cb));
					}
					
					var normA = calcnormal(AA,AAn1, AAn2)
					var normB = calcnormal(BB,BBn1, BBn2)
					var normC = calcnormal(CC,CCn1, CCn2)
					var normD = calcnormal(DD,DDn1, DDn2)
					
					
					v1n1t1(AA[0],AA[1],AA[2],normA[0],normA[1],normA[2],q1,p1); v2n2t2(BB[0],BB[1],BB[2],normB[0],normB[1],normB[2],q2,p1); v3n3t3(CC[0],CC[1], CC[2],normC[0],normC[1],normC[2],q2,p2);		
					cb(0, v1, v2, v3, n1, n2, n3, t1, t2, t3, 0);
					v1n1t1(AA[0],AA[1],AA[2],normA[0],normA[1],normA[2],q1,p1); v2n2t2(CC[0],CC[1],CC[2],normC[0],normC[1],normC[2],q2,p2); v3n3t3(DD[0],DD[1],DD[2],normD[0],normD[1],normD[2],q1,p2);
					cb(1, v1, v2, v3, n1, n2, n3, t1, t2, t3, 0);


					v1n1t1(AA[0],-AA[1],AA[2],normA[0],-normA[1],normA[2],q1,p1); v2n2t2(BB[0],-BB[1],BB[2],normB[0],-normB[1],normB[2],q2,p1); v3n3t3(CC[0],-CC[1], CC[2],normC[0],-normC[1],normC[2],q2,p2);		
					cb(0, v1, v2, v3, n1, n2, n3, t1, t2, t3, 0);
					v1n1t1(AA[0],-AA[1],AA[2],normA[0],-normA[1],normA[2],q1,p1); v2n2t2(CC[0],-CC[1],CC[2],normC[0],-normC[1],normC[2],q2,p2); v3n3t3(DD[0],-DD[1],DD[2],normD[0],-normD[1],normD[2],q1,p2);
					cb(1, v1, v2, v3, n1, n2, n3, t1, t2, t3, 0);

					if (i<6){
						
						v1n1t1(-AA[0],AA[1],AA[2],-normA[0],normA[1],normA[2],q1,p1); v2n2t2(-BB[0],BB[1],BB[2],-normB[0],normB[1],normB[2],q2,p1); v3n3t3(-CC[0],CC[1], CC[2],-normC[0],normC[1],normC[2],q2,p2);		
						cb(0, v1, v2, v3, n1, n2, n3, t1, t2, t3, 0);
						v1n1t1(-AA[0],AA[1],AA[2],-normA[0],normA[1],normA[2],q1,p1); v2n2t2(-CC[0],CC[1],CC[2],-normC[0],normC[1],normC[2],q2,p2); v3n3t3(-DD[0],DD[1],DD[2],-normD[0],normD[1],normD[2],q1,p2);
						cb(1, v1, v2, v3, n1, n2, n3, t1, t2, t3, 0);


						v1n1t1(-AA[0],-AA[1],AA[2],-normA[0],-normA[1],normA[2],q1,p1); v2n2t2(-BB[0],-BB[1],BB[2],-normB[0],-normB[1],normB[2],q2,p1); v3n3t3(-CC[0],-CC[1], CC[2],-normC[0],-normC[1],normC[2],q2,p2);		
						cb(0, v1, v2, v3, n1, n2, n3, t1, t2, t3, 0);
						v1n1t1(-AA[0],-AA[1],AA[2],-normA[0],-normA[1],normA[2],q1,p1); v2n2t2(-CC[0],-CC[1],CC[2],-normC[0],-normC[1],normC[2],q2,p2); v3n3t3(-DD[0],-DD[1],DD[2],-normD[0],-normD[1],normD[2],q1,p2);
						cb(1, v1, v2, v3, n1, n2, n3, t1, t2, t3, 0);
					}
					
					}
			}
			
			
		}
	}
})