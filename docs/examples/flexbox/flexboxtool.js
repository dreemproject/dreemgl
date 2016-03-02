/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
   Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and limitations under the License.*/

// Flexbox flexdirection example.
define.class("$server/composition",
	function ($ui$, screen, view, label, speakergrid, $widgets$, radiogroup, $$, flexboxtoolitem) {

		this.examplewidth = 860;

		this.attributes = {
			flexcontainer: null, 		// reference to flex container view
			selectedChild: null,		// the currently selected child of the flexcontainer
			childInfoLabel: null		// reference to label object orange box title
		};

		var containeroptions = {
			flexDirection: ["column","row"],
			justifyContent: ["flex-start","flex-end","center","space-between","space-around"],
			alignItems: ["flex-start","flex-end","center","stretch"],
			flexWrap: ["nowrap","wrap"]
		};

		var childoptions = {
			alignSelf: ["(none)","flex-start","flex-end","center","stretch"]
		};

		this.setContainerWidth = function (newWidth) {
			if (this.flexcontainer != null) {
				this.flexcontainer.width = newWidth;
			}
		};

		this.setContainerHeight = function (newHeight) {
			if (this.flexcontainer != null) {
				if (newHeight === 'auto') {
					this.flex = 1;
				} else {
					this.flex = 0;
				}
				this.flexcontainer.height = newHeight;
				this.flexcontainer.doLayout();
			}
		};

		this.applyContainerStyle = function (stylename, value) {
			if (this.flexcontainer != null) {
				this.flexcontainer[stylename] = value;
			}
		};

		this.selectedChild = function() {
			if (this.selectedChild != null) {
				// this.childLabel = "child with name='' selected!";
				this.childInfoLabel.text = "Selected child: " + this.selectedChild.name;
			}
		};

		this.setChildAlignself = function(value) {
			if (this.selectedChild != null) {
				if (value == '(none)') value = '';
				this.selectedChild.alignself = value;
			}
		};

		this.render = function () {
			var composition = this;
			return [
				screen(
					{
						name: 'default',
						clearcolor: 'yankeesblue'
					},

					/* Two boxes at the top with controls */
					view(
						{
							w:this.composition.examplewidth,
							h: 240,
							clip: true,
							bgcolor: 'darkgrayx11',
							flexdirection:"row",
							padding: vec4(5)
						},


						/* Left box: flexcontainer settings */
						view(
							{
								flex:.6,
								bgcolor: 'cadet',
								flexdirection: 'column'
							},

								label(
									{
										text: "flexcontainer settings",
										fontsize: 16,
										bold: true,
										paddingleft:6,
										bgcolor: 0,
										fgcolor: 'white'
									}
							),

							view(
								{
									flexdirection:"column",
									bgcolor:"gray",
									padding:6,
								},

								radiogroup(
									{
										title: "container width",
										fontsize: 11,
										values: ["auto", 400, 600, 750],
										init: function() {
											this.currentvalue = 'auto';
										},
										currentvalue: function() {
											composition.setContainerWidth(this.currentvalue);
										}
									}
								),

								radiogroup(
									{
										title: "container height",
										fontsize: 11,
										values: ["auto", 400, 600],
										init: function() {
											this.currentvalue = '600';
										},
										currentvalue: function() {
											composition.setContainerHeight(this.currentvalue);
										}
									}
								),

								radiogroup(
									{
										title: "flexdirection",
										fontsize: 11,
										values: containeroptions.flexDirection,
										init: function() {
											this.currentvalue = 'row';
										},
										currentvalue: function() {
											composition.applyContainerStyle('flexdirection', this.currentvalue);
										}
									}
								),

								radiogroup(
									{
										title: "justifycontent",
										fontsize: 11,
										currentvalue: containeroptions.justifyContent[0],
										values: containeroptions.justifyContent,
										init: function() {
											this.currentvalue = this.values[0];
										},
										currentvalue: function() {
											composition.applyContainerStyle('justifycontent', this.currentvalue);
										}
									}
								),

								radiogroup(
									{
										title: "alignitems",
										fontsize: 11,
										currentvalue: containeroptions.alignItems[0],
										values: containeroptions.alignItems,
										init: function() {
											this.currentvalue = this.values[0];
										},
										currentvalue: function() {
											composition.applyContainerStyle('alignitems', this.currentvalue);
										}
									}
								),


								radiogroup(
									{
										title: "flexwrap",
										fontsize: 11,
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

						// blue box for selected child and instructions.
						view(
							{
								flex:.5,
								bgcolor: 'onyx',
								flexdirection: 'column'
							},

							label(
								{
									name: 'childLabel',
									text: null,
									fontsize: 16,
									bold: true,
									paddingleft:6,
									bgcolor: 0,
									fgcolor: 'white',
									init: function() {
										composition.childInfoLabel = this;
									}
								}
							),

							view(
								{
									flexdirection:"column",
									bgcolor:"gray",
									margin:5,
									padding:6,
								},
								radiogroup(
									{
										title: "alignself",
										fontsize: 11,
										values: childoptions.alignSelf,
										init: function() {
											this.currentvalue = '(none)';
										},
										currentvalue: function() {
											composition.setChildAlignself(this.currentvalue)
										}
									}
								),
								label(
									{
										text: "Instructions:\n" +
											"The controls on the left side let you control the container\n" +
											"element (grey view colored boxes). Click child to select it.\n" +
										  "For the child, the selectable value is the \"alignself\" property.\n" +
										  "Selecting \"stretch\" has no effect, since we are using\n" +
										  "explicit width and height values for the children.\n" +
										  "When selecting \"auto\" for the container width, the width will\n" +
										  "be 100% of the parent view (flex=1), height value of \"auto\"\n" +
										  "scales to content height (which depends on layout settings).",
										fontsize: 12,
										bgcolor: 0,
										fgcolor: 'white',
										multiline: true
									}
								)

							)
						)
					),

					/* Boxes which are controlled by layout */
					view(
						{
							w:this.composition.examplewidth,
							flexdirection: "column",
							margintop: 10,
							padding: vec4(5),
							bgcolor: 'blackbean'
						},
						view(
							{
								flex: 1,
								flexdirection: "column",
								bgcolor: 'onyx'
							},


								// flex container element
								view(
									{
										name: 'flexcontainer',
										h: 600,
										bgcolor: 'darkmediumgray',
										init:function() {
											composition.flexcontainer = this;
										}
									},

									// The views which are controled by the flexbox container
									flexboxtoolitem(
										{
											name: 'c1',
											bgcolor: 'viridiangreen',
											init: function() {
												composition.selectedChild = this;
											}
										}
									),
									flexboxtoolitem(
										{
											name: 'c2',
											bgcolor: 'amber'
										}
									),
									flexboxtoolitem(
										{
											name: 'c3',
											bgcolor: 'britishracinggreen'
										}
									),
									flexboxtoolitem(
										{
											name: 'c4',
											bgcolor: 'sandybrown'
										}
									),
									flexboxtoolitem(
										{
											name: 'c5',
											bgcolor: 'alizarincrimson'
										}
									)

							)
						)
					)

				) // screen

			];
		}
	}
);
