# Flexbox Layout in DreemGL Part 1

The [CSS3 Flexible Box](https://www.w3.org/TR/css3-flexbox/), or *flexbox*, is a layout mode providing for the arrangement of elements (children of a container element) such that the elements behave predictably when the UI layout must accommodate different screen sizes and different display devices. CSS3 Flexible Box is a W3C standard (working draft). For many applications, the flexible box model provides an improvement over the block model in that it does not use floats, nor do the flex container's margins collapse with the margins of its contents.

Many designers will find the *flexbox* model easier to use than the traditional CSS box model. Child elements in a *flexbox* can be laid out in any direction and can have flexible dimensions to adapt to the display space. Positioning child elements is thus much easier, and complex layouts can be achieved more simply and with cleaner code, as the display order of the elements is independent of their order in the source code. This independence intentionally affects only the visual rendering, leaving speech order and navigation based on the source order.

## Flexible boxes concept

The defining aspect of the flex layout is the ability to alter its items' width and/or height to best fill the available space on any display device. A flex container expands items to fill available free space, or shrinks them to prevent overflow.

The *flexbox* layout algorithm is direction-agnostic as opposed to the block layout, which is vertically-biased, or the inline layout, which is horizontally-biased. While the block layout works well for pages, it lacks sufficient definition to support application components that have to change orientation, resize, stretch, or shrink as the user agent changes, flips from vertical to horizontal, and so forth.

## Flexible boxes vocabulary

While a discussion of flexible boxes is liberated from terms like horizontal/inline axis and vertical/block axis, it requires a new terminology to properly describe the model. Consider the following diagram when reviewing the vocabulary items below. It shows a flex container that has a flexdirection of row, meaning that the flex items follow each other horizontally across the main axis according to the established writing mode, the direction in which the element's text flows, in this case left-to-right.

<img src="https://raw.githubusercontent.com/dreemproject/dreemgl/master/docs/images/flexbox-diagram.png" width="750" height="511">

### Flex container

The parent element in which flex items are contained. A flex container is defined using the flex or inline-flex values of the display attribute.
Flex item
Each child of a flex container becomes a flex item. Text directly contained in a flex container is wrapped in an anonymous flex item.

### Axes

Every flexible box layout follows two axes. The main axis is the axis along which the flex items follow each other. The cross axis is the axis perpendicular to the main axis.

 - The **flexdirection** attribute establishes the main axis.
 - The **justifycontent** attribute defines how flex items are laid out along the main axis on the current line.
 - The **alignitems** attribute defines the default for how flex items are laid out along the cross axis on the current line.
 - The **alignself** attribute defines how a single flex item is aligned on the cross axis, and overrides the default established by alignitems.

### Directions

The **main start/main** end and **cross start/cross** end sides of the flex container describe the origin and terminus of the flow of flex items. They follow the main axis and cross axis of the flex container in the vector established by the writing-mode (left-to-right, right-to-left, etc.).

Flex items can be laid out on either a single line or on several lines according to the flexwrap attribute, which controls the direction of the cross axis and the direction in which new lines are stacked.

### Dimensions

The flex items' agnostic equivalents of height and width are main size and cross size, which respectively follow the main axis and cross axis of the flex container.

# DreemGL's *flexbox* implementation

The DreemGL implementation of *flexbox* is based on [Facebook's open source css-layout library](https://github.com/facebook/css-layout).

While DreemGL uses the Facebook css-layout JavaScript library, the attribute names use a slightly different naming scheme. In Facebook's *flexbox* implementation attribute use camel-case spelling, in DreemGL all attribute name are lower case, e.g. `marginleft` instead or `marginLeft`. For the values, the *hyphen* has been removed, so it's `flexstart` instead of `flex-start`.

## Supported attributes

<table style="border: 1px solid darkgrey">
	<tr>
	  <th style="align: left">Attribute name</th>
	  <th>Type / Value</th>
	</tr>
	<tr>
	  <td>w, width, h, height</td>
	  <td>positive number</td>
	</tr>
	<tr>
	  <td>minwidth, minheight</td>
	  <td>positive number</td>
	</tr>
	<tr>
	  <td>maxwidth, maxheight</td>
	  <td>positive number</td>
	</tr>
	<tr>
	  <td>left, right, top, bottom</td>
	  <td>number</td>
	</tr>
	<tr>
	  <td>margin</td><td>vec4</td>
	</tr>
	<tr>
	  <td>marginleft, marginright, margintop, marginbottom</td>
	  <td>typeless</td>
	</tr>
	<tr>
	  <td>paddding</td>
	  <td>vec4 (left, top, right, bottom); can be assigned a single value to set them all at once.</td>
	</tr>
	<tr>
	  <td>paddingleft, paddingright, paddingtop, paddingbottom</td><td>positive number</td>
	</tr>
	<tr>
	  <td>borderwidth, borderleftwidth, borderrightwidth, bordertopwidth, borderbottomwidth</td>
	  <td>positive number</td>
	</tr>
	<tr>
	  <td>flexdirection</td>
	  <td>'column', 'row'</td>
	</tr>
	<tr>
	  <td>justifycontent</td>
	  <td>'flex-start', 'center', 'flex-end', 'space-between', 'space-around'</td>
	</tr>
	<tr>
	  <td>alignitems, alignself</td>
	  <td>'flex-start', 'center', 'flex-end', 'stretch'</td>
	</tr>
	<tr>
	  <td>flex</td>
	  <td>positive number</td>
	</tr>
	<tr>
	  <td>flexwrap</td>
	  <td>'wrap', 'nowrap'</td>
	</tr>
	<tr>
	  <td>position</td>
	  <td>'relative', 'absolute'</td>
	</tr>
</table>

## The Flexbool tool

This DreemGL application lets you play around with the various attributes and values, providing immediate visual feedback. You should open the application in a separate browser tab while going through this guide, and can use it to verify your understanding of flexbox.

<a href="/docs/examples/flexbox/flexboxtool" target="_blank">Open flexbox tool in tab</a>

<iframe style="width:860px; height:864px; border:0" src="/docs/examples/flexbox/flexboxtool"></iframe>

## Container attributes

### The *flexdirection* attribute

The **flexdirection** attribute controls how items are laid out in the flex container, by setting the direction of the main axis. The two directions available are horizontal layout using the value *row*, and vertical layout using the value **column**. The following examples shows two containers with three children, each. The first container uses the default **row** direction for layout, the second container the **column** layout.

<a href="/docs/examples/flexbox/flexdirection" target="_blank">/docs/examples/flexbox/flexdirection.js</a>

<iframe style="width:200px; height:200px; border:0" src="/docs/examples/flexbox/flexdirection"></iframe>
<br/>
<iframe style="width:860px; height:400px; border:0" src="/docs/examples/docsourceviewer#file=flexbox/flexdirection.js"></iframe>

### The *flexwrap* attribute

By default flexbox will arrange all items on a single line, with no wrapping in place. The **flexwrap** attribute controls if the flex container lay out its items in single or multiple lines. The example below shows two containers with 5 boxes. The first container has **flexwrap** set to **nowrap**, the second container has **flexwrap** set to **wrap**, therefore the last item (which does not fit into the container) has been pushed to a new line.

<iframe style="width:300px; height:220px; border:0" src="/docs/examples/flexbox/flexwrap"></iframe>
<br/>
<iframe style="width:860px; height:400px; border:0" src="/docs/examples/docsourceviewer#file=flexbox/flexwrap.js"></iframe>

### The *justifycontent* attribute

This defines the alignment along the main axis. It helps distribute extra free space left over when either all the flex items on a line are inflexible, or are flexible but have reached their maximum size. It also exerts some control over the alignment of items when they overflow the line.

* **flex-start** (default): items are packed toward the start line
* **flex-end** items are packed toward to end line
* **center** items are centered along the line
* **space-between** items are evenly distributed in the line; first item is on the start line, last item on the end line
* **space-around** items are evenly distributed in the line with equal space around them. Note that visually the spaces aren't equal, since all the items have equal space on both sides. The first item will have one unit of space against the container edge, but two units of space between the next item because that next item has its own spacing that applies.

<a href="/docs/examples/flexbox/justifycontent" target="_blank">/docs/examples/flexbox/justifycontent.js</a>

<iframe style="width:320px; height:340px; border:0" src="/docs/examples/flexbox/justifycontent"></iframe>
<br/>
<iframe style="width:860px; height:400px; border:0" src="/docs/examples/docsourceviewer#file=flexbox/justifycontent.js"></iframe>

To continue with part #2 of the flexbox guide, please <a href='/docs/api/index.html#!/guide/flexbox_part2'>click here</a>.
