# DreemGL in 10 Minutes

DreemGL is a GL (webGL) based UI toolkit and IOT system written in JavaScript. In DreemGL Shaders replace CSS and are written in type inferenced JS, 
large data can be rendered using vertexbuffers, the DOM is created React-style, and multiple devices/screens share one 'composition' space with automated RPC system.

This introduction gets you familiar with the DreemGL toolkit, and how you can use it create multi-screen experiences with it. You'll become familiar with the structure of a *multi-screen application* or *composition*, how we call them in Dreem. You will get to know the classes and APIs for creating UIs, learn how to add interactive elements, we will show you how to load data, and pass data between server and clients.

## The DreemGL Toolkit
DreemGL is a toolkit for prototyping GPU-accelereated multi-screen experiences with IoT integration for smart environments. DreemGL simplifies the prototyping of applications that connect large screens in the environment to multiple handheld devices, tablets, or IoT smart objects.

The UI on all screens can take advantage of GPU capabilities, enabling more fluid and subtle animations on mobile GPUs, matching video game level graphics performance. DreemGL applications are written in pure JavaScript, the The Lingua Franca of the Web.

### System Requirements

#### Required Software
 - Node.js version 4.2.6 or higher [https://nodejs.org/en/download/](https://nodejs.org/en/download/).
 - Git client (command line [https://git-scm.com/downloads](https://git-scm.com/downloads) or [Github desktop application](https://desktop.github.com/) for Windows or Mac)
 - Web browser with webGL support (See your favorite browser for support)

#### Teem Server - Supported Operating Systems
Running the DreemGL server component - the Node.js based Teem server - is supported on the following platforms:
 - Windows 7, Windows 8.1
 - Mac OS X 10.7
 - Linux (tested on Ubuntu Linux 14.04, should work on other distrutions)

#### WebGL Runtime - OS & Browser Combinations
DreemGL applications using the WebGL runtime can be run with the following operating & browser combinations:

| OS | OS Version | Browser | Browser Version | Notes |
|----|------------|---------|-----------------|-------|
| Windows | 7, 8.1, (10) | Chrome | 45+ | Not testing on Windows 10, but should work. |
|         | 7, 8.1, (10) | Firefox | 42+ | Not testing on Windows 10, but should work. |
|         | 10 | Edge |  | Supports WebGL, but still some issues with DreemGL |
| OS X | 10.7+ | Safari | 9+ | |
|          |       | Firefox | 42+ |  |
|          |       | Chrome | 23+ |  |
| Linux | Any recent distrubution | Safari | 23+ | Tested on Ubuntu 14.04 |
|          |       | Chrome | 45+ |  |
|          |       | Firefox | 42+ |  |
| iOS | 8+ | Safari | 8.4, 9+ |  |
| Android |  | Chrome | 25+ | Depends on device/GPU driver support for WebGL. Tested on Nexus 5, Galaxy S6, Galaxy Note 5, NVidia Shield Tablet. |

### Installing Dreem
For now, the best way to install DreemGL on your computer is to check out the source code from Github, using the following URL:
https://github.com/dreemproject/dreemgl

This is the link to the master branch of Dreem, which should be stable. The branch which is used for development is the DreemGL dev branch:
https://github.com/dreemproject/dreemgl/tree/dev

*Please do not use the dev branch for development, unless you are using a specific feature, which is not available in master, yet. There will be many breaking changes for existing compositions going into a dev branch!*

### Launching the DreemGL server
You can launch the DreemGL server by running

```bash
$ node server.js
Server running on http://127.0.0.1:2000/
```

To test if everything is working fine, open the following URL for the *treeart2.js* composition in a supported browser:
<a href="/examples/treeart2" target="_blank" data-example="Animated shader tree demo|580|500">http://localhost:2000/examples/treeart2</a>

You should be seeing an animated tree with some nice shader effects:

<img src="https://raw.githubusercontent.com/dreemproject/dreemgl/dev/docs/images/treeart.png" width="581" height="500"/>

There are a number of command line flags for the server, the most important ones being the `-iface` `-port` and the `-path` flags:

```bash
> node server.js --help
Teem Server 2.0
commandline: node server.js <flags>
-port [port] Server port
-nomoni  Start process without monitor
-iface [interface] Server interface
-restart Auto restarts after crash (Handy for client dev, not server dev)
-path [name]:[directory] add a path to the server under name $name
```

By default the server is running on 127.0.0.1 with port 2000. If you want to access the server from other IP addresses or devices on your local network, you have to launch it with the ```-iface 0.0.0.0``` option. This way it will bind to your local IP address:

```bash
$ node server.js -iface 0.0.0.0
Server running on http://127.0.0.1:2000/ on http://192.168.0.14:2000/ Ready to go!
```

This will bind the DreemGL server to the IP address(es) of your network card (can be multiple, e.g. if you are using a VPN connection). All IP addresses will be listed, as you can see above. In our case the IP address was *192.168.0.14*, but for your machine it will be different. If you want to connect to a composition from one or more of your devices, for the example above the URI for the treeart2 demo would be *http://192.168.0.14:2000/examples/treeart2*.

The port can be set using the `-port` option, e.g.

```bash
$ node server.js -iface 0.0.0.0 -port 3555
Server running on http://127.0.0.1:3555/ on http://192.168.0.14:3555/ Ready to go!
```

Throughout the guide you will see that we are using the host and port *localhost:2000*, but the hyperlinks are relative, so they will work with your own IP address.

## DreemGL - Core concepts
DreemGL uses the concept of a `composition`. The composition acts as a container for all source elements of a multi-screen experience. The core elements of a composition are:

 - **composition** The composition context contains all global objects, constants, and properties which are used across screens and servers for that specific composition. You create a composition by subclassing the composition.
 - **screen:** A `screen` corresponds to a physical device with a screen, e.g. a TV screen, smartphone screen, smartwatch screen, screen of an IoT device, or a desktop PC's screen. This is often a webbrowser. A composition can have any number of different screens for different devices or activities. Screens best correspond to the concept of a mobile or TV app in the traditional application development model.
 - **service:** Base class for all server-side dreemGL components.
 - **view:** Base class for all visual child nodes of screen

***Todo: Add a screenshot of a composition architecture, showing DreemGL server running with multiple screens connected, the hub or bus, as well as IoT devices connected.***

#### Power of the composition based approach
There are a number of reasons why we chose to use a composition based approach instead of an app based approach (single app per screen device):

 - **Central file for all screens:**
   A composition bundles all the code for the whole multi-screen experience:
    - JavaScript classes, which can be run on both server and client.
    - Screens or physical displays: All screens for devices with displays are part of the composition.
 - **Share code between client and server:** JavaScript classes can be run both on the server (Node.js environment), and in the browser. There is no need to create separate implementation of the functionality for client or server side.
 - **Run on the GPU, but code in JavaScript:** The whole UI renders in GL, but developers do not need to use the syntax of `GLSL` (the `OpenGL Shading Language`, a high-level shading language based on the syntax of the C programming language) but can comfortably stay in JS.
 - **Multi-runtime support:**DreemGL has been architectured to support multiple runtimes, where the runtimes can share a large portion of the DreemGL runtime code. The default runtime is the *WebGL runtime*, which renders in browsers. There is also basic support for Tizen OS runtime based on the DALi 3d toolkit with the Node.js add-on, a feauture which is called the *DALi runtime*. DALi runtime applications can be run on Ubuntu 14.04 with the latest versions of the DALi toolkit pre-compiled, or on Hardkernel's Odroid XU4 development board, the reference devices for the Tizen 3.0 TV profile.

## DreemGL 'Hello World'
Before we dive into the source code of our *Hello World* composition, you need to understand how the server maps compositions to URIs.

### Compositions and URIs
You create a composition in its own file. When running a composition, the server maps the composition's JavaScript file to a URI. Remember the *treeart2.js* composition? The URI for the composition is
<a href="/examples/treeart2" target="_blank" data-example="Animated shader tree demo|400|400">http://localhost:2000/examples/treeart2</a>

You will find the corresponding file at `DREEM/examples/treeart2`, where `DREEM` is the root folder of your DreemGL installation. While you can add your own compositions to the DREEM/examples, the better approach is to put your all your own compositions into a separate folder (e.g. a folder on the same level as the DreemGL toolkit folder). You can make your own composition folder available to DreemGL by using the `-path` option when launching the server, e.g.

```bash
node server.js -path project1:../myproject
```
Here *project1* is the virtual server path assigned to the *myproject* folder. If you create a composition named *helloworld.js* in this folder, you can run the composition by loading:

<a href="/project1/helloworld" target="_blank" data-example="Hello world composition|400|400">http://localhost:2000/project1/helloworld</a>

As you can see, the file ending `.js` is omitted when running a composition.

### 'Hello World' composition
Here is our first composition. It doesn't do much, just renders a single screen with a green background color. But we use it explain the general syntax of classes and compositions.

**helloworld.js <a href="/docs/examples/dreem10/helloworld" data-example="Hello world composition|400|400">Open composition in new tab</a>**

```javascript
define.class("$server/composition",
  function (
    // imports from classes/ui folder
    $ui$, screen
  ) {
    this.render = function() {
      var s = screen({name:'default',clearcolor: 'green'});
      return[s];
    };
  }
);
```

All compositions need to subclass the *$server/composition* class. The syntax for creating a class or subclassing an existing class in DreemGL is:

```javascript
define.class("$server/composition", function() {});
```

`$server` is a *default path symbol*, which resolves to a default path or folder in the DreemGL framework. The *default path symbols* are use in class definitions. The following table shows an overview all default paths you can use:

| Path Symbol | DreemGL Folder | Description |
| ----------- | ------------ | ----------- |
| `$behaviors` | [$root/classes/behaviors](../examples)| Behaviors (e.g. drag support)  |
| `$examples` | [$root/examples](../examples)| DreemGL example compositions |
| `$resources` | [$root/resources](../resources)| Fonts, icons, and textures. |
| `$server` | [$root/classes/server](../classes/server)| Composition, dataset, IO, services. |
| `$system` | [$root/system](../system)| System classes like geometry, shader support, runtimes, RPC classes. |
| `$testing` | [$root/classes/testing](../classes/testing)| Classes used for testing.  |
| `$ui` | [$root/classes/ui](../classes/ui)| Core UI components. |
| `$widgets` | [$root/system](../classes/widgets)| UI widgets used by applications, e.g. colorpicker, searchbox, radiogroup. |
| `$3d` | [$root/classes/3d](../classes/3d)| System classes for 3d support in DreemGL |

DreemGL uses an [Asynchronous Module Definition (AMD)](https://github.com/amdjs/amdjs-api/blob/master/AMD.md) based style of defining modules and internally works a lot like require.js. The loader is called define.js (after the define global it creates)
In define.js classes are a first class citizen of the module system, which is used in the live reloading and the nested classes which the shaders are using.
The name of the class is also handily used for the constructor so debugging with browser devtools is nicer.

So back to the DreemGL class definition. The two key concepts you need to be aware of here are the idea of a `define.class` method for facilitating module definition and a require mechanism for handling dependency loading.

Take a look at the signature of the structure for class definitions below:

```javascript
define.class(
  superclass,           // superclass is referenced using $folder/classname syntax
  function($ui$, view)  // requiring of dependencies, like class imports from packages in other languages
    {
      ...               // class body
  }
);
```

The first argument to define class is a string containing a path symbol (`$server` in this case), and the classname of the superclass: `composition`. The file name of the superclass is `composition.js`, and the file can be found in the folder `DREEM/system/server`. In Dreem, the file name of the class file is automatically used as the classname. This limits the names you can use for your class files, since the name has to be valid JavaScript identifier, with some limitations.

A JavaScript identifier must start with a letter, underscore (_), or dollar sign ($) but don't use this one; subsequent characters can also be digits (0-9). Because JavaScript is case sensitive, letters include the characters "A" through "Z" (uppercase) and the characters "a" through "z" (lowercase).

For a DreemGL class name there are additional limitations:

 - Only a single underscore is allowed at the beginning of a class name.
 - Don't use `$` in file names, since it has a special functionality in class looks or requires.
 - If you want to separate lexical units in composition names, it's recommended to use `_` (underscore) instead of `-` (dash), so `hello_world.js` instead of `hello-world.js`, spaces and - characters are replaced with '_' by the class name generator

### The Screen Class
For a composition to be able to render anything visible (or a UI) there needs to be at least one screen object as a direct child of the composition. DreemGL uses a very specific and efficient rendering mechanism, which makes us of the `render()` function:

```javascript
this.render = function () {
  return [ screen({name: 'default', clearcolor: "grey"}) ];
}
```

The render function returns an array of views (or view subclasses), which will rendered as direct children of the current class. The following code instantiates a screen object, and sets the attribute `name` to `default`, and the `clearcolor` attribute to `grey`.

The `new` keyword is not used, and should be avoided - since it breaks the styling system when used on classes.

```javascript
return [ screen({name: 'default', clearcolor: "grey"}) ];
```

Compositions can have multiple screens, and each screen needs to have name attribute with a unique name.
We will have a more detailed look at the `render()` function in a bit, but you should first learn how to define classes in Dreem.

**docs/examples/dreem10/helloworld_multiscreen.js** <a href="/docs/examples/dreem10/helloworld_multiscreen" data-example="Multiscreen composition|400|400">open composition in new tab</a>

```javascript
// composition with two screens
define.class("$server/composition",
  function (
    // imports from classes/ui folder
    $ui$, screen, label
  ) {
    this.render = function() {
      return[
        screen(
					{name:'default',clearcolor: 'coolgrey'},
					label({fontsize: 30, text: "default screen"})
					),
        screen(
					{name:'mobile',clearcolor: 'brilliantazure'},
					label({fontsize: 30, text: "mobile screen"})
				)
      ];
    };
  }
);

```

With more than one screen in a composition, DreemGL will render the first screen child by default. To access another screen, you have to append the screen name directly to the query string (directly behind the question mark). The screen with name `mobile` can therefore be accessed by using the screen name as the only value of the query string (no key/value pair, just the name of the screen directly following the question mark).
<a href="/docs/examples/dreem10/helloworld_multiscreen?mobile" target="_blank" data-example="helloworld_multiscreen?mobile|400|400">http://localhost:2000/docs/examples/dreem10/helloworld_multiscreen?mobile</a>

For the default screen, just remove the `?mobile` query string, and DreemGL will load the default screen:
<a href="/docs/examples/dreem10/helloworld_multiscreen" target="_blank" data-example="helloworld_multiscreen|400|400">http://localhost:2000/docs/examples/dreem10/helloworld_multiscreen</a>

### Classes in DreemGL

Let's have another look at class definitions. As you have already learned, DreemGL classes are defined in a single file. Classes use the same define syntax as compositions. Take a look at the following code sample:

```javascript
define.class('$ui/view', function(require, exports, $ui$, label) {
    var mylib = require('./mylib')

    this.method = function(){
    }

    exports.staticmethod = function(){
    }
})
```

You can see the the same class definition construct as we had earlier in our composition. This code sample uses a different formatting style, where the class definition with superclass and imports is on a single line.

The first argument to define.class is the *require* function, which sets the base class: `$ui/view`. The second argument is the class body function. The arguments of this function act as imports of classes used by this specific class.

When requiring or importing classes DreemGL provides a number of shortcuts to folders, which are listed below. The shortcuts are called *directory switches*, which include all commonly folders with classes in the toolkit. 

| Path Symbol | DreemGL Folder | Description |
| ----------- | ------------ | ----------- |
| `$examples$` | [$root/examples](../examples)| DreemGL example compositions |
| `$server$` | [$root/classes/server](../classes/server)| Composition, dataset, IO, services. |
| `$system$` | [$root/system](../system)| System classes like geometry, shader support, runtimes, RPC classes. |
| `$ui$` | [$root/classes/ui](../classes/ui)| Core UI components. |
| `$widgets$` | [$root/system](../classes/widgets)| UI widgets used by applications, e.g. colorpicker, searchbox, radiogroup. |
| `$3d$` | [$root/classes/3d](../classes/3d)| System classes for 3d support in DreemGL |
| `$$` | current directory | Used to import classes relative to current directory. |
| `relative$dir$` | relative directory| Directory relative to current or parent directory. |

  - `require` and `exports` are special cases: They can be placed anywhere in the argument list, where they appear does not matter.
  - `exports` is the class constructor function, and can hold static methods.
  -  `require` is simply the local instance of require if needed for normal requires.
  - `$ui$` switches directory in the dependency-class list, in this case to the folder `DREEM/classes/ui`, from where the `label.js` class is imported.


The body of the function (the 2nd argument passed to define.class) is the class body, where you can attributes, add your own functions/methods to the class.

The following example app consists of a composition named `require_external_class.js`, which imports the `simplebox.js` class. The `simplebox` class does not provide much functionality, it is just a rectangle with a default orange background color.

The composition imports the class `simplebox.js`. The directory switch `$$` with the following `simplebox` means: Import the class `simplebox.js` from the same folder as the composition. You can list any number of classes from a directory following the directory switch. As long as you don't use another directory switch, all classes will be imported based on the folder from last directory switch used.

**Example: Requiring an external class** - <a href='/docs/examples/dreem10/require_external_class' target='_blank' data-example="require_external_class|400|400">click to run</a>

```javascript
// Composition showing import of class simplebox.js from the same directory
define.class("$server/composition",
	function (
		$ui$, screen,  // imports from classes/ui folder
		$$, simplebox  // import custom class
	) {
		this.render = function() {
			return[
				screen(
					{name:'normal', bgcolor: 'battleshipgrey'},
					simplebox({x: 50, y: 20, w:200, h:100})
				)
			];
		};
	}
);
```

The `$$, simplebox` way of importing a class is just a shortcut, you can always require an external class or library using `this.myclass = require('./myclass.js')`, so the above composition could be written like this:

```javascript
// Composition showing import of class simplebox.js using require
define.class("$server/composition",
	function (require, $ui$, screen) {
		this.simplebox = require('./simplebox.js');
		this.render = function() {
			return[
				screen(
					{name:'normal', bgcolor: 'battleshipgrey'},
					this.simplebox({x: 10, y:10}),
					this.simplebox({x: 100, y: 50, w:100, h:60, bgcolor: 'celestialblue'})
				)
			];
		};
	}
);
```

When using `require` to import a class, the require module itself must be imported before it can be used. As mentioned earlier, the `require` module is a special case, since it can be listed at any position inside the class body function arguments.

Let's take a closer look at both ways of importing:

```javascript
define.class("$server/composition", function (require, $ui$, screen) {
	this.simplebox = require('./simplebox.js');
...
```

And the short version:

```javascript
define.class("$server/composition", function ($ui$, screen, $$, simplebox) {
...
```

As you can see, the class body function arguments for the first version contain *require* as the first argument. The require module is then used to load the class *simplebox.js*. For the short version, DreemGL takes care of converting the imports into requires.

Finally, here is the class which is being imported, the `simplebox.js`. It subclasses view, and sets default values for absolute positioning.

```javascript
// simple view with default w/h and bgcolor; used by require_external_class.js
define.class('$ui/view',
	function() {
		this.position = 'absolute';
		this.w = 120;
		this.h = 80;
		this.bgcolor = 'fluorescentorange';
		this.init = function() {
			console.log("class init event")
		}
	}
);
```

### The View Class - Baseclass of all visible objects in Dreem
The view.js class is the baseclass of all visible items on screen. It contains all attributes that are used by the render system  to layout, and draw a view. A view has a set of `children`. The child views of a view using the `this.children` reference. Each view owns a set of shaders that it iterates over to draw them.

**Example: Requiring an external class** - <a href='/docs/examples/dreem10/view_children' target='_blank' data-example="view_children|400|400">click to run</a>

```javascript
define.class("$server/composition", function ($ui$, screen, view, label) {
    this.render = function() {
      return[
        screen( { name:'normal', clearcolor: 'white' }
          ,view({
              name: 'container', w: 305, bgcolor: 'battleshipgrey',
              oninit: function() {
                for (var i=0; i<this.children.length; i++) {
                  console.log("child #" + i + ": name=" + this.children[ i ].name);
                  this.children[ i ].text = "view #" + i;
                }
              }
            }
            ,label({ name: 'v1', w: 80, h:30, margin: 10, bgcolor: 'amaranthred' })
            ,label({ name: 'v2', w: 80, h:30, margin: 10, bgcolor: 'castletongreen' })
            ,label({ name: 'v3', w: 80, h:30, margin: 10, bgcolor: 'amber' })
          )
        )
      ];
    };
  }
);
```

In the above example the screen has exactly one child, the view with ```name='container'```. That view contains three subviews: The labels with the name v1, v2, and v2. We defined an ```oninit``` function in the view, which iterates over the ```this.children``` array, and sets the text attribute on each label to ```view #x``` where ```x``` is the index nub.

### Class initialization
In the DreemGL classes, you'll find a number of so called `at` functions, e.g. `atConstructor`, `atRender`, etc.
During the initialization process of a class, the following functions are called in this order:

 1. `atConstructor()` is called when you construct the class, generally not used by views: use init
 2. `init()` is called to initialize the class, create things here.
 3. `render()` is called after `init()` and gives the view the opportunity to return its child list.

The following class shows the functions in exactly the order they are called at. `render()` and `atRender()` can be called multiple times, if any attributes of the class change, which are used within render.

```javascript
define.class('$ui/view',
  function() {
    this.atConstructor = function() {
      console.log('class_init_test#atConstructor()');
    };

    this.init = function() {
      console.log('class_init_test#init()');
    };

    this.render = function() {
      console.log('class_init_test#render()');
      return [];
    }
  }
);
```

## Rendering in Dreem
As a framework rendering to a GL device, DreemGL does not render the UI by modifying a DOM. The DreemGL application is rendered to a WebGL context inside a HTML5 canvas.

### The render() function
The `render()` function in DreemGL is the function that provides the children of a view node, and it automatically re-executes when any of the view's attributes you ‘reference’ in that render function change externally.

The use of the `render()` function provides a functional way to define state through the render structure. Instead of building and managing a tree structure, attributes are mapped directly to a render tree: There is no separation between init and update, all code is basically init code. When something in the structure changes, a new set of children is returned by the render function. The difference between Facebook's React framework's approach and Dreem's approach is that in React's case the render process returns a new tree or subtree, which will be attached to the virtual DOM tree. In Dreem, the render function can only return children, since there is no DOM or virtual DOM tree to work with.

```javascript
define.class('$ui/view',
  function() {
    this.atConstructor = function() {
      console.log('class_init_test#atConstructor()');
    };

    this.init = function() {
      console.log('class_init_test#init()');
    };

    this.render = function() {
      console.log('class_init_test#render()');
      return [
      	view({w: 100, h: 100, bgcolor: 'red'})
      ];
    }
  }
);
```

## Attributes
**Attributes** are special properties on an object. Inside the class body function of a DreemGL class, you can define attributes like this:

```javascript
this.attributes = {
    aBool: false,
    numColor: 0,
    someText: "Just a string",
	colors: [],
    moreText: Config(type:string, value:"Another string"),
	joined: Config({value: false, type: Boolean}),
	userid: Config({value: -1, type: Number}),
    moreColor: Config({type: Array})
    candidate: Config({type: Object, value: {}, persist:true}),
};
```

As you can see, there is a short syntax available, listing just the attribute name and value. 

Attributes come with a powerful, built-in API to allow other parts of your code to bind to value of changes of your attributes.

### Creating Attributes
To create attributes, define a magical attribute setter as shown in [node.js](https://github.com/dreemproject/dreemgl/blob/dev/system/base/node.js).

`this.attributes = {}` is actually a function call. Using setters as
init calls allows DreemGL to create nested json and assign them to
classes all at once: `{attributes:{}}`

## Service Class and the RPC System
DreemGL has a powerful WebSocket based RPC system, which makes it extremely easy to share data across multiple screens using and between server and client. To write code running on the Node.js server, you can simple extend the `<a href='http://localhost:2000/docs/api/index.html#!/api/service' target='_blank'>service</a>` class.

### Binding to server-side attributes
The `service` class can be treated like any other class in DreemGL, where you can add attributes and methods to the class. This RPC system then exposes the service and all the attributes to all screens in your composition. Let's start with a small example:

<a href="/docs/examples/dreem10/service_colorview_example" target="_blank" data-example="service_colorview|400|400">/docs/examples/dreem10/service_colorview</a>

```javascript
// service example with embedded classes for service and view
define.class("$server/composition",
	function ($server$, service, $ui$, screen, view) {

		// Embedded service class which sends a random set of pos/size values
		// to the client.
		define.class(this, "boxrandomizer", "$server/service", function(){

			this.attributes = {
				viewprops1: Config({ type:Array, value: [] }),
				viewprops2: Config({ type:Array, value: [] }),
				colors: Config({type: Array,
					value: ['uclagold', 'utahcrimson', 'richelectricblue', 'willpowerorange', 'upsdellred', 'yelloworange', 'seagreen']}),
				color1: Config({ type:String, value:'black' }),
				color2: Config({ type:String, value:'black' })
			}
			this.randinterval = null;

			// Set up the interval for calling randomizeBoxDims
			this.oninit = function(){
				this.randinterval = this.setInterval(this.randomizeViewProps, 2500);
			}

			// Generates a set of view dimensions and two random color values
			this.randomizeViewProps = function() {
				var rand = this.randomInt;
				this.viewprops1 = vec4(rand(1, 100), rand(1, 100), rand(100, 200), rand(100, 200));
				this.viewprops2 = vec4(rand(1, 100), rand(1, 100), rand(100, 200), rand(100, 200));
				this.color1 = this.colors[rand(1, this.colors.length-1)]
				this.color2 = this.colors[rand(1, this.colors.length-1)]
			}

			// Generate a random int value for a range
			this.randomInt = function(min, max) {
				if (max == null) {
					max = min;
					min = 0;
				}
				return min + Math.floor(Math.random() * (max - min + 1));
			};

		});

		// View class which will receive the props from boxrandomizer service
		define.class(this, "colorview", view, function() {

			this.borderradius = vec4(10);

			this.attributes = {
			  dimensions: Config({value: vec4(0), type:vec4}),
				newx: Config({type:int, value:0}),
				newy: Config({type:int, value:0}),
				neww: Config({type:int, value:0}),
				newh: Config({type:int, value:0})
			};

			this.onnewx = function() {
				this.x = this.newx
			}
			this.onnewy = function() {
				this.y = this.newy
			}
			this.onneww = function() {
				this.w = this.neww
			}
			this.onnewh = function() {
				this.h = this.newh
			}

			this.ondimensions = function() {
				var dims = this.dimensions;
				this.newx = Config({value:dims[0], motion:"inoutquad", duration:.75})
				this.newy = Config({value:dims[1], motion:"inoutquad", duration:.95})
				this.neww = Config({value:dims[2], motion:"inoutquad", duration:1.1})
				this.newh = Config({value:dims[3], motion:"inoutquad", duration:.8})
			}

		})

		this.render = function() {
			var s = screen();
			return[
				this.boxrandomizer({name:'boxrandom'}),
				screen(
					{name:'default',clearcolor: 'onyx'},
					// The position and bgcolor of these two colorviews will be set through the
					// boxrandomizer service's attributes.
					this.colorview({
						name: 'v1',
						position: 'absolute',
						dimensions: wire("this.rpc.boxrandom.viewprops1"),
						bgcolor: wire("this.rpc.boxrandom.color1"),
						opacity: 0.6
					}),
					this.colorview({
						name: 'v2',
						position: 'absolute',
						dimensions: wire("this.rpc.boxrandom.viewprops2"),
						bgcolor: wire("this.rpc.boxrandom.color2"),
						opacity: 0.4
					})

				)
			];
		};
	}
);
```

<iframe name='docrunner' style="width:1px; height:1px; border:0" src="/docs/examples/docexamplerunner"></iframe>
