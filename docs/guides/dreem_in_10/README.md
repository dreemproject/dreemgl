<!---
   Copyright 2015-2016 Teem. Licensed under the Apache License, Version 2.0 (the "License"); Dreem is a collaboration between Teem & Samsung Electronics, sponsored by Samsung.
   You may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
   Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
   either express or implied. See the License for the specific language governing permissions and limitations under the License.
-->

# DreemGL in 10 Minutes - Part 1

This introduction gets you familiar with the DreemGL toolkit, and how you can use it create multi-screen experiences with it. You'll become familiar with the structure of a *multi-screen application* or *composition*, how we call them in Dreem. You will get to know the classes and APIs for creating UIs, learn how to add interactive elements, we will show you how to load data, and pass data between server and clients.

## The DreemGL Toolkit
DreemGL is a toolkit for prototyping GPU-accelereated multi-screen experiences with IoT integration for smart environments. DreemGL simplifies the prototyping of applications that connect large screens in the environment to multiple handheld devices, tablets, or IoT smart objects.

The UI on all screens can take advantage of GPU capabilities, enabling more fluid and subtle animations on mobile GPUs, matching video game level graphics performance. DreemGL applications are written in pure JavaScript, the The Lingua Franca of the Web.

### System Requirements

#### Required Software
 - Recent version of Node.js, which can be downloaded [here](https://nodejs.org/en/download/).
 - Git client (command line or [desktop application](https://desktop.github.com/))

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
https://github.com/teem2/dreemgl

This is the link to the master branch of Dreem, which should be stable. The branch which is used for development is the DreemGL dev branch:
https://github.com/teem2/dreemgl/tree/dev

*Please do not use the dev branch for development, unless you are using a specific feature, which is not available in master, yet. There will be many breaking changes for existing compositions going into a dev branch!*

### Launching the DreemGL server
You can launch the DreemGL server by running

```bash
node server.js
```

By default the server is running on port 2000, but you can configure a different port using the `-port` option, e.g.

```bash
node server.js -port 3555
```

To test if everything is working fine, open the following URL for the *shadertest.js* composition in a supported browser:
<a href="http://localhost:2000/examples/shadertest" target="_blank">http://localhost:2000/examples/shadertest</a>

You should be seeing an animated shape rendering a shaders, similar to the image below:
<img src="./img/shadertest.png" width="500"/>

There are a number of command line flags for the server, the most important ones being the `-port` and the `-path` flags: ds

```bash
> node server.js --help
Teem Server 2.0
commandline: node server.js <flags>
-port [port] Server port
-nomoni  Start process without monitor
-iface [interface] Server interface
-browser Opens webbrowser on default app
-notify Shows errors in system notification
-devtools Automatically opens devtools in the browser
-close Auto closes your tab when reloading the server
-delay Delay reloads your pages when reloading the server
-restart Auto restarts after crash (Handy for client dev, not server dev)
-edit Automatically open an exception in your code editor at the right line
-path [name]:[directory] add a path to the server under name $name
```


## DreemGL - Core concepts
DreemGL uses the concept of a `composition`. The composition acts as a container for all source elements of a multi-screen experience. The core elements of a composition are:

 - **Composition** The composition context contains all global objects, constants, and properties which are used across screens and servers for that specific composition. You create a composition by subclassing the composition.
 - **Server:** The server object inside a composition. Each composition can contain one instance of a server object.
 - **Screen:** A `screen` corresponds to a physical display, e.g. a TV screen, smartphone screen, smartwatch screen, screen of an IoT device, or a desktop PC's screen. A composition can have a unlimited number of screens (TODO: Is there a limit for the number of screens per composition?). Screens best correspond to the concept of a mobile or TV app in the traditional application development model.
 - **Teem Hub or Bus:** Bundles the RPC APIs and features for communication betweeen different screens, devices, and the server.

***Todo: Add a screenshot of a composition architecture, showing DreemGL server running with multiple screens connected, the hub or bus, as well as IoT devices connected.***

#### Power of the composition based approach
There are a number of reasons why we chose to use a composition based approach instead of an app based approach (single app per screen device):

 - **Central file for all screens:**
   A composition bundles all the code for the whole multi-screen experience:
    - JavaScript classes, which can be run on both server and client.
    - Screens or physical displays: All screens for devices with displays are part of the composition.
 - **Share code between client and server:** JavaScript classes can be run both on the server (Node.js environment), and in the browser. There is no need to create separate implementation of the functionality for client or server side.
 - **Run on the GPU, but code in JavaScript:** The whole UI renders in GL, but developers do not need to learn `GLSL` (the `OpenGL Shading Language`, a high-level shading language based on the syntax of the C programming language).
 - **Multi-runtime support:**DreemGL has been architectured to support multiple runtimes, where the runtimes can share a large portion of the DreemGL runtime code. The default runtime is the *WebGL runtime*, which renders in browsers. There is also basic support for Tizen OS runtime based on the DALi 3d toolkit with the Node.js add-on, a feauture which is called the *DALi runtime*. DALi runtime applications can be run on Ubuntu 14.04 with the latest versions of the DALi toolkit pre-compiled, or on Hardkernel's Odroid XU4 development board, the reference devices for the Tizen 3.0 TV profile.

## DreemGL 'Hello World'
Before we dive into the source code of our *Hello World* composition, you need to understand how the server maps compositions to URIs.

### Compositions and URIs
You create a composition in its own file. When running a composition, the server maps the composition's JavaScript file to a URI. Remember the *shadertest.js* composition? The URI for the composition is
<a href="http://localhost:2000/examples/shadertest" target="_blank">http://localhost:2000/examples/shadertest</a>

You will find the corresponding file at `DREEM/examples/shadertest.js`, where `DREEM` is the root folder of your DreemGL installation. While you can add your own compositions to the DREEM/examples, the better approach is to put your all your own compositions into a separate folder (e.g. a folder on the same level as the DreemGL toolkit folder). You can make your own composition folder available to DreemGL by using the `-path` option when launching the server, e.g.

```bash
node server.js -path project1:../myproject
```
Here *project1* is the virtual server path assigned to the *myproject* folder. If you create a composition named *helloworld.js* in this folder, you can run the composition by loading:
<a href="http://localhost:2000/examples/shadertest" target="_blank">http://localhost:2000/project1/helloworld</a>

As you can see, the file ending `.js` is omitted when running a composition.

### 'Hello World' composition
Here is our first composition. It doesn't do much, just renders a single screen with a green background color. But we use it explain the general syntax of classes and compositions.

**helloworld.js [(open composition in new tab)](http://localhost:2000/guide/examples/helloworld)**

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

DreemGL uses an [Asynchronous Module Definition (AMD)](https://github.com/amdjs/amdjs-api/blob/master/AMD.md) based style of defining classes. The Asynchronous Module Definition is a JavaScript specification of an API for defining code modules and their dependencies, and loading them asynchronously if desired.

Implementations of AMD provide the following benefits:

 - AMD implementations allow developers to encapsulate code in smaller, more logically-organized files in a way similar to other programming languages such as Java.
 - Website performance improvements. AMD implementations load smaller JavaScript files, and only load them when they're needed.
 - Fewer page errors. AMD implementations allow developers to define dependencies that must load before a module is executed, so the module doesn't try to use outside code that isn't yet available.

So back to the DreemGL class definition. The two key concepts you need to be aware of here are the idea of a `define.class` method for facilitating module definition and a require mechanism for handling dependency loading.

Take a look at the signature of the structure for class definitions below:

```javascript
define.class(
  superclass,          /* superclass is referenced using $folder/classname syntax */
  definition function  /* function for instantiating the module or object */
    ($ui$, view)        /* requiring of dependencies, like class imports from packages in other languages */
    {
      ...              /* class body */
  }
);
```

The first argument to define class is a string containing a path symbol (`$server` in this case), and the classname of the superclass: `composition`. The file name of the superclass is `composition.js`, and the file can be found in the folder `DREEM/system/server`. In Dreem, the file name of the class file is automatically used as the classname. This limits the names you can use for your class files, since the name has to be valid JavaScript identifier, with some limitations.

A JavaScript identifier must start with a letter, underscore (_), or dollar sign ($); subsequent characters can also be digits (0-9). Because JavaScript is case sensitive, letters include the characters "A" through "Z" (uppercase) and the characters "a" through "z" (lowercase).

For a DreemGL class name there are additional limitations:

 - Only a single underscore is allowed at the beginning of a class name.
 - Calls names can not start with `$`.
 - If you want to separate lexical units in composition names, remember to use `_` (underscore) instead of `-` (dash), so `hello_world.js` instead of `hello-world.js`, which would result in an error.

For a composition to be able to render anything visible (or a UI) there needs to be at least one screen object as a direct child of the composition. DreemGL uses a very specific and efficient rendering mechanism, which makes us of the `render()` function:

```javascript
this.render = function () {
  return [ screen({name: 'default', clearcolor: "grey"}) ];
}
```

The render function returns an array of views (or view subclasses), which will rendered as direct children of the current class. The following code instantiates a screen object, and sets the attribute `name` to `default`, and the `clearcolor` attribute to `grey`.

The `new` keyword is not required, but can be used, so feel free to use this syntax, which is a more explicit form of instantiation, if you prefer this.

```javascript
return [ screen({name: 'default', clearcolor: "grey"}) ];
```

Compositions can have multiple screens, and each screen needs to have name attribute with a unique name.
We will have a more detailed look at the `render()` function in a bit, but you should first learn how to define classes in Dreem.

**helloworld_multiscreen.js [(open composition in new tab)](http://localhost:2000/guide/examples/helloworld_multiscreen)**

```javascript
define.class("$server/composition",
  function (
    // imports from classes/ui folder
    $ui$, screen
  ) {
    this.render = function() {
      return[
        screen({name:'default',clearcolor: 'bostonuniversityred'}),
        screen({name:'mobile',clearcolor: 'brilliantazure'})
      ];
    };
  }
);
```

With more than one screen in a composition, DreemGL will render the first screen child by default. To access another screen, you have to append the screen name directly to the query string (directly behind the question mark). The screen with name `mobile` can therefore be accessed using the URI:
<a href="http://localhost:2000/guide/examples/helloworld_multiscreen?mobile" target="_blank">http://localhost:2000/guide/examples/helloworld_multiscreen?mobile</a>

### Classes

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

The first argument to define.class is the *require* function, which sets the base class: `$ui/view`. The following function has a list of arguments, which are the imports for the class.

  - `require` and `exports` are special cases: They can be placed anywhere in the argument list, where they appear does not matter.
  - `exports` is the class constructor function, and can hold static methods.
  -  `require` is simply the local instance of require if needed for normal requires.
  - `$ui$` switches directory in the dependency-class list, in this case to the folder `DREEM/classes/ui`, from where the `label.js` class is imported.

There are a number of predefined directory switches:

| Path Symbol | DreemGL Folder | Description |
| ----------- | ------------ | ----------- |
| `$examples$` | [$root/examples](../examples)| DreemGL example compositions |
| `$server$` | [$root/classes/server](../classes/server)| Composition, dataset, IO, services. |
| `$system$` | [$root/system](../system)| System classes like geometry, shader support, runtimes, RPC classes. |
| `$ui$` | [$root/classes/ui](../classes/ui)| Core UI components. |
| `$widgets$` | [$root/system](../classes/widgets)| UI widgets used by applications, e.g. colorpicker, searchbox, radiogroup. |
| `$3d$` | [$root/classes/3d](../classes/3d)| System classes for 3d support in DreemGL |
| `$$` | current directory | Used to import classes relative to current directory. |
| `$$$` | parent directory | Used to import classes from parent directory or subfolder of parent directory. |
| `relative$dir$` | relative directory| Directory relative to current or parent directory. |


The body of the function (the 2nd argument passed to define.class) is the class body, where you can attributes, add your own functions/methods to the class.

The following example app consists of a composition named `class1.js`, which imports the `simplebox.js` class. The `simplebox` class does not provide much functionality, it shows a rectangle with a background color.

**Class example: simplebox.js **
<a href='/guides/examples/classes/class1.js' target='_blank'>Run example in new tab</a>

```javascript
define.class('$ui/view',
  function() {
    this.w = 200;
    this.h = 100;
    this.bgcolor = 'green';
    this.init = function() {
      console.log("class init event")
    }
  }
);
```

The composition import the class `simplebox.js`. The directory switch `$$` with the following `simplebox` means: Import the class `simplebox.js` from the same folder as the composition.

```javascript
define.class("$server/composition",
  function (
    $ui$, screen,  // imports from classes/ui folder
    $$, simplebox  // import custom class
  ) {
    this.render = function() {
      return[
        screen(
          {name:'default'},
          simplebox()
        )
      ];
    };
  }
);
```

### Class initialization
In the DreemGL classes, you'll find a number of so called `at` functions, e.g. `atConstructor`, `atRender`, etc.
During the initialization process of a class, the following functions are called in this order:
 1. `_atConstructor()` is called before that if you want to put important things in your baseclass and you dont want your users to have to call it manually
 2. `atConstructor()` is called when you construct the class
 3. `init()` is called once the class has been initialized.
 4. `render()` is called after `init()`.
 5. `atRender() `is called directly after render. We use it for example to add scrollbars to a view.

The following class shows the functions in exactly the order they are called at. `render()` and `atRender()` can be called multiple times, if any attributes of the class change, which are used within render.

```javascript
define.class('$ui/view',
  function() {
    this._atConstructor = function() {
      console.log('class_init_test#_atConstructor()');
    };

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

    this.atRender = function() {
      console.log('class_init_test#atRender()');
    };
  }
);
```

There is a similarly named `doRender()` function on the composition, which is an internal API (and should be renamed at some point in the future).

## Rendering in Dreem
As a framework rendering to a GL device, DreemGL does not render the UI by modifying a DOM. The DreemGL application is rendered to a WebGL context inside a HTML5 canvas.

### The render() function
The `render()` function in DreemGL is the function that provides the children of a view node, and it automatically re-executes when any of the view's attributes you ‘reference’ in that render function change externally.

The use of the `render()` function provides a functional way to define state through the render structure. Instead of building and managing a tree structure, attributes are mapped directly to a render tree: There is no separation between init and update, all code is basically init code. When something in the structure changes, a new set of children is returned by the render function. The difference between Facebook's React framework's approach and Dreem's approach is that in React's case the render process returns a new tree or subtree, which will be attached to the virtual DOM tree. In Dreem, the render function can only return children, since there is no DOM or virtual DOM tree to work with.

### The View Class - Baseclass of all visible objects in Dreem
The view.js class is the baseclass of all visible items on screen. It contains all attributes that are used by the render system  to layout, and draw a view. A view has a set of `children`. You can access the child views of a view using the `this.children` reference. Each view owns a set of shaders that it iterates over to draw them.
