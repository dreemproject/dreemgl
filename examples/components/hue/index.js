define.class("$server/composition", function (require, $ui$, icon, slider, button, checkbox, label, screen, view, cadgrid, $widgets$, colorpicker, $$, basestation, bulb) {

		this.render = function () {

			return [
				basestation(),
				screen({
					name:"desktop",
					clearcolor: '#888'
				},
					cadgrid({
						name:"main",
						bgcolor: vec4(0.07999999821186066, 0.10000000149011612, 0.10000000149011612, 1),
						toolselect: false,
						toolmove: false,
						gridsize: 5,
						majorevery: 10,
						majorline: vec4(0, 0.20000000298023224, 0.30000001192092896, 1),
						minorline: vec4(0, 0.19792191684246063, 0.17214606702327728, 1),
						flexdirection: "row",
						justifycontent: "space-around",
						alignitems: "center",
						render:function() {
							var lights = [];

							var baselights = this.rpc.basestation.lights;

							for (var uid in baselights) {
								if (baselights.hasOwnProperty(uid)) {
									var light = baselights[uid];

									var huebulb = bulb(light);
									huebulb.click = function(ev,v,o){
										if (!this.__lock) {
											this.__lock = true;
											o.on = !o.on;
											o.reset();
											this.rpc
												.basestation
												.setLightState(o.id, {on: o.on})
												.then(function () {
													this.__lock = false;
												}.bind(this), function () {
													this.__lock = false;
												}.bind(this))
										}
									}.bind(this);

									lights.push(
										view({
												flex:0,
												padding:10,
												flexdirection:"column",
											    aligncontent: "stretch",
												justifycontent: "center",
												bgcolor:vec4(0.4)
											},
											huebulb,
											slider({
												flex:1,
												height:10,
												margin:40,
												width:250,
												value:light.bri / 255.0,
												bgcolor:"black",
												fgcolor:"white",
												smooth:false,
												bulb:huebulb,
												onvalue:function(ev,v,o) {
													if (!this.__lock) {
														this.__lock = true;

														o.bulb.bri = v * 255;
														o.bulb.reset();

														this.rpc
															.basestation
															.setLightState(o.bulb.id, {bri: o.bulb.bri})
															.then(function(){
																this.__lock = false;
															}.bind(this), function(){
																this.__lock = false;
															}.bind(this))
														;
													}
												}.bind(this)
											}),
											colorpicker({
												flex:1,
												alignself:"center",
												colorwheel:true,
												colorsliders:false,
												colorbox:false,
												value:huebulb.textcolor,
												bulb:huebulb,
												valuechange:function(ev, v, o) {

													function debounce(func, wait, immediate) {
														var timeout;
														return function() {
															var context = this;
															var args = arguments;
															var later = function() {
																timeout = null;
																if (!immediate) func.apply(context, args);
															};
															var callNow = immediate && !timeout;
															clearTimeout(timeout);
															timeout = setTimeout(later, wait);
															if (callNow) func.apply(context, args);
														};
													}

													var red = o._value[0];
													var green = o._value[1];
													var blue = o._value[2];

													// This magic is how to get the right color on a hue bulb
													// http://www.developers.meethue.com/documentation/color-conversions-rgb-xy

													red = (red > 0.04045) ? Math.pow((red + 0.055) / (1.0 + 0.055), 2.4) : (red / 12.92);
													green = (green > 0.04045) ? Math.pow((green + 0.055) / (1.0 + 0.055), 2.4) : (green / 12.92);
													blue = (blue > 0.04045) ? Math.pow((blue + 0.055) / (1.0 + 0.055), 2.4) : (blue / 12.92);

													var xx = red * 0.664511 + green * 0.154324 + blue * 0.162028;
													var yy = red * 0.283881 + green * 0.668433 + blue * 0.047685;
													var zz = red * 0.000088 + green * 0.072310 + blue * 0.986039;

													var x = xx / (xx + yy + zz);
													var y = yy / (xx + yy + zz);

													if (!this.__lock) {
														this.__lock = true;

														o.bulb.rgb = [red * 255, green * 255, blue * 255];
														o.bulb.reset();

														this.rpc
															.basestation
															.setLightState(o.bulb.id, { xy:[x,y] })
															.then(function(){
																this.__lock = false;
															}.bind(this), function(){
																this.__lock = false;
															}.bind(this))
													}
												}.bind(this)
											})
										)
									)
								}
							}

							return lights;
						}
					}))
			]


		}


	}
)
