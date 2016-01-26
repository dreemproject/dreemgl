/*Copyright 2015-2016 Teem. Licensed under the Apache License, Version 2.0 (the "License"); Dreem is a collaboration between Teem & Samsung Electronics, sponsored by Samsung.
 You may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
 either express or implied. See the License for the specific language governing permissions and limitations under the License.*/

// Flexbox flexdirection example.
define.class("$server/composition",
	function ($ui$, screen, view, label, speakergrid, $$, newradiogroup) {

		this.attributes = {
			flexcontainer: null 	// reference to flex container view
		};

		var containeroptions = {
			flexDirection: ["column","row"],
			justifyContent: ["flex-start","flex-end","center","space-between","space-around"],
			alignItems: ["flex-start","flex-end","center","stretch"],
			flexWrap: ["nowrap","wrap"]
		};

		var childoptions = {
			alignSelf: ["auto","flex-start","flex-end","center","baseline","stretch"]
		};

		this.setContainerWidth = function (newWidth) {
			if (this.flexcontainer != null) {
				console.log("Setting flexcontainer width to " + newWidth);
				this.flexcontainer.width = newWidth;
			}
		};

		this.applyContainerStyle = function (stylename, value) {
			if (this.flexcontainer != null) {
				console.log("Setting flexcontainer " + stylename + " to " + value);
				this.flexcontainer[stylename] = value;
			}
		};

		// Create a single screen with background color 'green'
		this.render = function () {
			var composition = this;
			return [
				screen(
					{
						name: 'default',
						clearcolor: 'battleshipgrey'
					},

					/* Two boxes at the top with controls */
					view(
						{
							bgcolor: 'darkgrayx11',
							borderradius: vec4(10),
							flexdirection:"row",
						  margin: 10,
							padding: vec4(10)
						},


						/* Left box: flex container controls */
						view(
							{
								flex:.5,
								bgcolor: 'cadet',
								flexdirection: 'column',
							},

								label(
									{
										text: "flexcontainer settings",
										fontsize: 29,
										fontstyle: 'bold',
										margin:5,
										padding:6,
										bgcolor: 0,
										fgcolor: 'white'
									}
							),

							view(
								{
									flexdirection:"column",
									bgcolor:"gray",
									margin:5,
									padding:6,
									bg:0
								}

								,newradiogroup(
									{
										title: "container width",
										fontsize: 16,
										values: ["auto", 400, 600, 900],
										init: function() {
											this.currentvalue = 'row';
										},
										currentvalue: function() {
											console.log("currentvalue=" + this.currentvalue);
											composition.setContainerWidth(this.currentvalue)
										}
									}
								)

								,newradiogroup(
									{
										title: "flexdirection",
										fontsize: 16,
										values: containeroptions.flexDirection,
										init: function() {
											this.currentvalue = 'row';
										},
										currentvalue: function() {
											console.log("currentvalue=" + this.currentvalue);
											composition.applyContainerStyle('flexdirection', this.currentvalue)
										}
									}
								)

								,newradiogroup(
									{
										title: "justifycontent",
										fontsize: 18,
										currentvalue: containeroptions.justifyContent[0],
										values: containeroptions.justifyContent,
										init: function() {
											this.currentvalue = this.values[0];
										},
										currentvalue: function() {
											console.log("currentvalue=" + this.currentvalue);
											composition.applyContainerStyle('justifycontent', this.currentvalue)
										}
									}
								)

								,newradiogroup(
									{
										title: "alignitems",
										fontsize: 12,
										currentvalue: containeroptions.alignItems[0],
										values: containeroptions.alignItems,
										init: function() {
											this.currentvalue = this.values[0];
										},
										currentvalue: function() {
											composition.applyContainerStyle('alignitems', this.currentvalue)
										}
									}
								)


								,newradiogroup(
									{
										title: "flexwrap",
										fontsize: 12,
										values: containeroptions.flexWrap,
										init: function() {
											this.currentvalue = 'wrap';
										},
										currentvalue: function() {
											composition.applyContainerStyle('flexwrap', this.currentvalue)
										}
									}
								)

							)
						),
						view(
							{
								flex:.5,
								bgcolor: 'cadet',
								flexdirection: 'column',
							},


							label(
								{
									text: "Child #1",
									fontsize: 22,
									fontstyle: 'bold',
									margin:5,
									padding:6,
									bgcolor: 0,
									fgcolor: 'white'
								}
							),

							view(
								{
									flexdirection:"column",
									bgcolor:"gray",
									margin:5,
									padding:6,
									bg:0
								}
								,newradiogroup(
									{
										title: "flexwrap",
										fontsize: 18,
										values: containeroptions.flexWrap,
										init: function() {
											this.currentvalue = 'wrap';
										},
										currentvalue: function() {
											composition.applyContainerStyle('flexwrap', this.currentvalue)
										}
									}
								)


							)
						)
					),

					/* Boxes which are controlled by layout */
					view(
						{
							flex:1,
							flexdirection: "column",
							margin: 10,
							padding: vec4(10),
							borderradius: vec4(10),
							bg:'cadet'
						}
						,view(
							{
								flex: 1,
								flexdirection: "column",
								bgcolor: 'cadet',
								w: 800
							},

								view(
									{
										name: 'flexcontainer',
										flex: 1,
										bgcolor: 'avocado',
										init:function() {
											composition.flexcontainer = this;
										},
										flexdirection:function() {
											console.log("Changed to " + this.flexdirection);
										},
										alignself:function() {
											console.log("Changed to " + this.flexdirection);
										}
									},

									// The views which are controled by the flexbox container
									view(
										{
											w: 80,
											h: 80,
											padding: 20,
											bgcolor: 'airforceblueraf'},
										view({w:40, h:40, bgcolor: 'gray'},
											label({text: 'Hello', fgcolor: 'black', fontsize: '16'})
										)
									),
									view(
										{
											w: 80,
											h: 80,
											padding: 20,
											bgcolor: 'amaranth'},
										view({w:40, h:40, bgcolor: 'gray'})
									),
									view(
										{
											w: 80,
											h: 80,
											padding: 20,
											bgcolor: 'amber'},
										view({w:40, h:40, bgcolor: 'gray'})
									),
									view(
										{
											w: 80,
											h: 80,
											padding: 20,
											bgcolor: 'britishracinggreen'},
										view({w:40, h:40, bgcolor: 'gray'})
									),
									view(
										{
											w: 80,
											h: 80,
											padding: 20,
											bgcolor: 'almond'},
										view({w:40, h:40, bgcolor: 'gray'})
									)

								)
							)
						)

				) // screen

			];
		}
	}
);
