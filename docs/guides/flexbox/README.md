<!---
   Copyright 2015-2016 Teem. Licensed under the Apache License, Version 2.0 (the "License"); Dreem is a collaboration between Teem & Samsung Electronics, sponsored by Samsung.
   You may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
   Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
   either express or implied. See the License for the specific language governing permissions and limitations under the License.
-->

# Flexbox Layout in Dreem
*Flexible Box Layout* or *Flexbox* is the latest layout model coming to CSS3, an upcoming W3C standard. The new flex layout allows elements within a container to be arranged in a way fitting to the screen or device that it is being viewed on. The Dreem implementation of Flexbox is based on [Facebook's open source css-layout library](https://github.com/facebook/css-layout).

While Dreem uses the Facebook css-layout JavaScript library, the attribute names use a slightly different naming scheme. While in Facebook's CSS layout implementation attribute use camel-case spelling, in Dreem all attribute name are lower case, e.g. `marginleft` instead or `marginLeft`. For the values, the *hyphen* has been removed, so it's `flexstart` instead of `flex-start`.

## Supported attribute

Name | Value
----:|------
w, width, h, height | positive number
minwidth, minheight | positive number
maxwidth, maxheight | positive number
left, right, top, bottom | number
margin | vec4
marginleft, marginright, margintop, marginbottom | typeless
paddding | vec4 (left, top, right, bottom); can be assigned a single value to set them all at once.
paddingleft, paddingright, paddingtop, paddingbottom | positive number
borderwidth, borderleftwidth, borderrightwidth, bordertopwidth, borderbottomwidth | positive number
flexdirection | 'column', 'row'
justifycontent | 'flex-start', 'center', 'flex-end', 'space-between', 'space-around'
alignitems, alignself | 'flex-start', 'center', 'flex-end', 'stretch'
flex | positive number
flexwrap | 'wrap', 'nowrap'
position | 'relative', 'absolute'

### The Flexbox stanard
Flexbox is a W3C
The main idea is to give each container - in Dreem a view - the ability to alter its items width and height to best fill the available space, which is a very useful feature for multi-screen experiences with different screen resolutions. A Flexbox container expands items to fill available free space, or shrinks them to prevent overflow.

Opposed to regular layouts (block layouts with vertical arrangement, and inline with horizontal arrangement), the Flexbox layout is direction agnostic. For applications with their different requirements (change of orientation, resizing, dynamically updating a )
Most importantly, the flexbox layout is direction-agnostic as opposed to the regular layouts (block which is vertically-based and inline which is horizontally-based). While those work well for pages, they lack flexibility (no pun intended) to support large or complex applications (especially when it comes to orientation changing, resizing, stretching, shrinking, etc.).

<iframe style="width:850px; height:800px" src="http://localhost:2000/examples/guides/flexbox/flexboxtool"></iframe>

## The *flexdirection* attribute
The default layout applied to a view's children is the `flexdirection='column'`. In this examples we have two views as direct children of screen, and each of them has 10 childviews.

<iframe style="width:600px; height:240px" src="http://localhost:2000/examples/guides/flexbox/flexbox1"></iframe>

<iframe style="width:850px; height:240px" src="http://localhost:2000/examples/guides/docsourceviewer#file=flexbox/flexbox1.js"></iframe>
