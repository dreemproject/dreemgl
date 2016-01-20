# Getting Started with DreemGL
DreemGL is DreemGL, an open-source multi-screen prototyping framework
for iOT with a visual editor and shader styling for webGL and DALi
runtimes written in JavaScript. An overview of the framework is shown
here:

![Architecture Image]
(https://github.com/teem2/dreemgl/tree/dev/docs/architecture.png)

## Views

view.js is the baseclass of all visible items on screen.  It contains
all attributes that are used by the render system to layout, and draw
a view. A **view** has a set of 'children' on this.children and a set of
**shaders** that it iterates over to draw them.

So if you look in
[system/platform/webgl/devicewebgl.js](https://github.com/teem2/dreemgl/blob/dev/system/platform/webgl/devicewebgl.js),
you will see the main `drawpass`. The `doColor` method loops over the
set of views that need layout, meaning the ones that need their
matrices set up, and then loops over the surfaces to draw them. To do
this, DreemGL uses a `drawpass` or a `render to texture` . The
`drawpass` class holds the actual loop-over-views loop to then draw
the shaders.

### Adding Children to Views Using Render Functions

To add children to views, the recommended way is to use `render`
functions which generate children based on state on properties. If you
do it this way, then `livereload` works. If you make the UI much more
stateful by dynamically adding children using the `appendChild`
function, then live reloading becomes much harder as described further on.

Learning how to use the render functions is very important. For many
smaller scale datasets, it works great and is the recommended
methodology. For very large scale datasets, it is adviseable to use
the typed-array api, where you essentially write your own renderer for
very large datasets.


### How Render Functions Work

When the UI initializes, it calls `render` on the composition,
returning a tree. Then, the UI finds the screen it wants to show, and
then it calls `Render.process` (see
[system/base/render.js](https://github.com/teem2/dreemgl/blob/dev/system/base/render.js))
on that screen.

This will emit the `init` event on the screen, and call the `render`
function on that screen. At that point, every widget in the tree will
recursively get `render` on itself called to determine its children.

*So how do render functions know when to re-render themselves?* 
If you look at
[system/base/render.js](https://github.com/teem2/dreemgl/blob/dev/system/base/render.js),
you will see that DreemGL 'watches' all the attribute getters on the
object it calls `render` on.

So, this example:

`view({prop:10, render:function(){ return view({bla:this.prop}) }})`

creates an update bind between the `prop` on the parent view and its
`render1 function. If that `prop` gets changed anywhere, 'render` will
be called again automatically.

This is similar to how react works, except the 'state' object is put on the component in pieces.

`render` is relatively fast, and can be used to do a fair amount of
dynamic UI with a `render` function. It is also incremental and
cached, so if you just add an item at the end of a list, it is not
very expensive to just use the `render` function.


### Adding Children to Views Using appendChild 

If you make the UI much more stateful by dynamically adding children
using the `appendChild` function, then live reloading becomes much
harder. Unless you have a very good reason, we recommend that you do
not use `appendChild` and instead use the `render` functions.

The reason you may need to use an `appendChild` function, is that if you call
a constructor (of a view) like this: 

`view({props})` 

it returns a view, but that view has not yet been initialized. `init`
has not been called on it yet, nor does it have `render` called on it
yet. There is also other behind-the-scenes stuff happening such as
style application, which restricts the creation of views to be inside
specific scopes.


## Attributes
**Attributes** are special properties on an object. You can define them like this:
`this.attributes={propname:Config({value:10})`

### Creating Attributes
To create attributes, define a magical attribute setter as shown in [node.js](https://github.com/teem2/dreemgl/blob/dev/system/base/node.js).

`this.attributes = {}` is actually a function call. Using setters as
init calls allows DreemGL to create nested json and assign them to
classes all at once: `{attributes:{}}`

Again, all of these things are defined in
[node.js](https://github.com/teem2/dreemgl/blob/dev/system/base/node.js).

### Listening to Changes

Attributes can listen to changes, as they are implemented with an
underlying getter/setter (see
[system/base/node.js](https://github.com/teem2/dreemgl/blob/dev/system/base/node.js)).

Attributes can be assigned 'listeners' which you can see, for example,
in `borderradius` in
[view.js](https://github.com/teem2/dreemgl/blob/dev/system/base/view.js).

The reason DreemGL uses these setters is that there is a very clean json mapping like so:

`view({someattrib:function(){ } })`

which is the same as:

`this.someattrib = function(){}`

### Using Attributes
The recommended usage methodology is as follows.

1. Define an attribute:

`this.attributes = {prop:Config({...})}`

Note that the `Config` wrapper allows you to store values in the
attribute config object, which can contain type, name, meta data for
the visual editor, etc.

2. Define an attribute on a view. The arguments to the `view({...})` is the same object that is assigned
to the `this.attributes = {}` setter of the instance, which is what
lets you define an attribute on a view as follows:

`view({prop:10})`

This creates an attribute called `prop`, of type `float` automatically,

3. Put a listener on the attribute and assign a function to it. In
this example, we have created an attribute called `prop`. Now lets
put a listener on it and assign a function to it as follows:

`this.prop = function(){ }` is a shortcut for
`this.addListener('prop', function(){})` if it's an attribute.

It's a shortcut for `addlistener` with one side note: if you assign to
the property again with a new function, it will *remove the old
listener and set the new one*.

This makes it very easy to hook/unhook functions on listeners. And, it
means you can write your components in a very clear and simple way, such as:

`this.click = function(){ }`

Attributes are also automatically readable in shaders. So, the following example:

`view({prop:10, bg:{color(){ return prop*vec4(1) }}})` 

makes a view where the background shader reads a property all without
the need for declaring/creating attributes.

Please note that event flow does follow the inheritance structure of
the class. Base classes get their listeners called first as you can
see in the implementation of
[node.js](https://github.com/teem2/dreemgl/blob/dev/system/base/node.js).


## Adding Children to Views Using Render Functions

To add children to views, the recommended way is to use `render`
functions which generate children based on state on properties. If you
do it this way, then `livereload` works. If you make the UI much more
stateful by dynamically adding children using the `appendChild`
function, then live reloading becomes much harder as described further on.

Learning how to use the render functions is very important. For many
smaller scale datasets, it works great and is the recommended
methodology. For very large scale datasets, it is adviseable to use
the typed-array api, where you essentially write your own renderer for
very large datasets.


### How Render Functions Work

When the UI initializes, it calls `render` on the composition,
returning a tree. Then, the UI finds the screen it wants to show, and
then it calls `Render.process` (see
[system/base/render.js](https://github.com/teem2/dreemgl/blob/dev/system/base/render.js))
on that screen.

This will emit the `init` event on the screen, and call the `render`
function on that screen. At that point, every widget in the tree will
recursively get `render` on itself called to determine its children.

*So how do render functions know when to re-render themselves?* 

If you look at
[system/base/render.js](https://github.com/teem2/dreemgl/blob/dev/system/base/render.js),
you will see that DreemGL 'watches' all the attribute getters on the
object it calls `render` on.

So, this example:

`view({prop:10, render:function(){ return view({bla:this.prop}) }})`

creates an update bind between the `prop` on the parent view and its
`render` function. If that `prop` gets changed anywhere, 'render` will
be called again automatically.

This is similar to how react works, except the 'state' object is put on the component in pieces.

`render` is relatively fast, and can be used to do a fair amount of
dynamic UI with a `render` function. It is also incremental and
cached, so if you just add an item at the end of a list, it is not
very expensive to just use the `render` function.


## Adding Children to Views Using appendChild Function 

If you make the UI much more stateful by dynamically adding children
using the `appendChild` function, then live reloading becomes much
harder. Unless you have a very good reason, we recommend that you do
not use `appendChild` and instead use the `render` functions.

The reason you may need to use an `appendChild` function, is that if you call
a constructor (of a view) like this: 

`view({props})` 

it returns a view, but that view has not yet been initialized. `init`
has not been called on it yet, nor does it have `render` called on it
yet. There is also other behind-the-scenes stuff happening such as
style application, which restricts the creation of views to be inside
specific scopes.


### Other Useful Documentation

 * [API Reference] need to add links
 * [IoT]Adding components and services
 * [Dreem-in-10] an introduction/tutorial
 * [DALI] 


