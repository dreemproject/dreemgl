# Flexbox Layout in DreemGL Part 2

## Container attributes (continued)

### The *alignitems* attribute

The **alignitems** attribute aligns flex items of the current flex line the same way as justifycontent but in the perpendicular direction. The values **flex-start**, **flex-end**, and **center** should be self-explanatory. **stretch** will stretch the width/height of an item along the cross axis.

Check the following example: The flexdirection of the container is set to **row**, and each of the views has a different height. Depending on the **alignitems** value, the views are arranged accordingly. The last row with the **alignitems** value of **stretch** is a special case: For that row there has been no height set for the red and the orange view, therefore the height is stretched to the maximum value.

<a href="/docs/examples/flexbox/alignitems" target="_blank">/docs/examples/flexbox/alignitems.js</a>

<iframe style="width:320px; height:400px; border:0" src="/docs/examples/flexbox/alignitems"></iframe>
<br/>
<iframe style="width:860px; height:400px; border:0" src="/docs/examples/docsourceviewer#file=flexbox/alignitems.js"></iframe>

#### Changing container size with *alignitems='stretch'*

When setting **alignitems** to **stretch**, the item width/height will be adjusted when the container size changes along the cross axis. Check the following example, where no height is set on both the red and the blue view. The cross axis is the y-axis. Clicking anywhere into the container area will grow or shrink the height of the container over a duration of 1 second. As you can see, the red and blue view the will grow and shrink with the container along the cross axis.

<a href="/docs/examples/flexbox/alignitems_animation" target="_blank">/docs/examples/flexbox/alignitems_animation.js</a>

<iframe style="width:385px; height:185px; border:0" src="/docs/examples/flexbox/alignitems_animation"></iframe>
<br/>
<iframe style="width:860px; height:400px; border:0" src="/docs/examples/docsourceviewer#file=flexbox/alignitems_animation.js"></iframe>


### Centering using *flexbox*

To center content with flexbox inside a container, set the **flexdirection** and the **justifycontent** attributes to **center**. 

<a href="/docs/examples/flexbox/flexcentering1" target="_blank">/docs/examples/flexbox/flexcentering1</a>

<iframe style="width:200px; height:200px; border:0" src="/docs/examples/flexbox/flexcentering1"></iframe>

<iframe style="width:656px; height:200px; border:0" src="/docs/examples/docsourceviewer#file=flexbox/flexcentering1.js"></iframe>

## Child attributes

Only two attributes can be set on the child directly to influence the layout of that specific item. **flex** and **alignself**

### The *alignself* attribute

**alignself** makes it possible to override the align-items value for specific flex items. The align-self attribute accepts the same 5 values as the align-items:

* **flex-start** cross-start margin edge of the item is placed on the cross-start line
* **flex-end** cross-end margin edge of the item is placed on the cross-end line
* **center** item is centered in the cross-axis
* **stretch** (default) stretch to fill the container (still respect min-width/max-width)

Take a look at the following example. The top row of items uses **alignitems='center'** with a **flexdirection='row'** setting. Therefore all views are center along x-axis. For the bottom row, all children override the container alignment along the main axis by using a different **alignself** value.

<a href="/docs/examples/flexbox/alignself" target="_blank">/docs/examples/flexbox/alignself.js</a>

<iframe style="width:320px; height:310px; border:0" src="/docs/examples/flexbox/alignself"></iframe>

<iframe style="width:860px; height:400px; border:0" src="/docs/examples/docsourceviewer#file=flexbox/alignself.js"></iframe>

### The *flex* attribute

The value of the **flex** property specifies the ratio at which it grows relative to its siblings. To fill to the maximum available space, you should use a value of 1. For proportional scaling relative to siblings, you can use any number relative to another child's flex value.

The following example will make things clearer: For all rows, the **flexdirection='row'** and **alignitems='stretch**. Let's go through all rows:

* Row #1: Red view has width specified using **flex=.5**, green view uses a value of **flex=1**. The green view is two times as wide as the red view.
* Row #2: The red and orange view have a fixed width **w=80**. The green view uses a **flex=1** value to fill the space.
* Row #3: All four views have a **flex=.25** value, so are all equally wide.

Clicking into the container will animate the width (shrinking and growing). You can see that for the middle row the red and orange view maintain a width of 80, only the green view will adapt to the new space available.

<a href="/docs/examples/flexbox/childflex" target="_blank">/docs/examples/flexbox/childflex.js</a>

<iframe style="width:860px; height:200px; border:0" src="/docs/examples/flexbox/childflex"></iframe>

<iframe style="width:860px; height:400px; border:0" src="/docs/examples/docsourceviewer#file=flexbox/childflex.js"></iframe>
