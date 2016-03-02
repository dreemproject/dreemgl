# DreemGL IoT Guide

This document describes how to extend DreemGL to communicate with and access IoT devices, web services and other external resources.

## Simple Web Service as a DreemGL Component

The example provided by the guide can be found mounted at [/docs/examples/components](/docs/examples/components).

The guide will walk you through building a simple component that talks to a server-side web service. This component will
provide a search object and simple UI for the [OMDB](http://omdbapi.com/) database.

### Live Example

If you have the DreemGL server running the example outlined in this document will render below:

<iframe style="border:0;width:900px; height:600px" src="/docs/examples/components"></iframe>

### Live Slides

Additionally, a live slide-show that demonstrates many of the same concepts in this guide can be found [/docs/slides/extendingdreem](/docs/slides/extendingdreem)

## Setting Up

Dreem GL components provide additonal functionality for compositions and are implemented in thier own repository and 
then linked in as sibling directories that live within the DreemGL directory structure.  The simplest way to add a 
component to a Dreem GL server is with a symlink into the DreemGL `$root` directory:

    ln -s /path/to/component-directory/ /path/to/dreemgl's-$root/<componentname>

Note here that the name you choose for `<componentname>` is important in that it will be the namespace that other 
compositions will use to instantiate it's classes later.  For example, this guide is in `./docs/examples/components`, 
so all of it's classes can then be accessed using `$docs$guides$components$<classname>`, 
`$docs$, examples$components$<classname>` or `$docs$examples$components$, <classname>`.  Within a component you can 
use '$$' to search the current directory, so this name is only important in how other components and compositions will 
access the component's objects.  

### Include README.md &amp; package.json

Be sure to include a `README.md` with instructions for use and a `package.json` to help manage dependancies:

    {
      "name": "<component name>",
      "version": "0.0.1",
      "description": "<description>",
      "dependencies": {},
      "engine": "node >= 0.10.0"
    }

If required, be sure to install any dependancies in the component directory:

    npm install

## Creating a New Component

### Server Side

DreemGL components are usually collections of both server objects and UI widgets.  If your component has some 
server-side behavior, include a `$server/service` object.  This example provides a server-side lookups of the 
[OMDB](http://omdbapi.com/) database.  Here is a simple object that encapsulates a single "search" within the 
database (see `./docs/examples/components/search.js` for more detailed version):

    define.class('$server/service', function(require) {

        this.attributes = {
          results: {type:Array},
          keyword: {type:String}
        };

        this.onkeyword = function (keyword) {
            var request = require('request');
            request("http://www.omdbapi.com/?s=" + keyword.replace(/[^a-z0-9_-]/ig, '+'), (function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    this.results = JSON.parse(body)["Search"];
                }
            }).bind(this))
        }
    });

The search object has two attributes, the `keyword` to search term used in the search and the resulting list of movie
objects `results` from the server.  Setting the `keyword` triggers the `onkeyword` event which fetches the data from the
search API and sets it's own results attribute upon return.

### Screen/Client Side

Client-side UI views are also an important part of external components, and this example provies a simple view
to consume the data coming from it's server component (see `./docs/examples/components/movie.js` for complete code):

    define.class('$ui/view', function (label) {

        this.attributes = {
          Title: {type:String},
          Year: {type:String},
          Poster: {type:String}
        }
        this.onPoster = function (poster) { this.bgimage = poster; };

        this.render = function() { return [
            label({ fgcolor:'black', text:this.Title + '[' + this.Year + ']' })
        ]; }

    });

The server returns blocks of JSON which look like this:

    {"Title":"Snow White and the Huntsman",
     "Year":"2012",
     "imdbID":"tt1735898",
     "Type":"movie",
     "Poster":"..."}

When rendered into a javascript object these blocks can be consumed directly by the `movie()` object to create
new movies views which can be added directly to the heirarchy.  An example of how this can be accomplished is provided
in the next section.

## Including Examples and Usage

### Examples 

In addition to a `REAMDE.md` DreemGL components often provide one or more example compositions.  Including an `index.js` 
composition with some simple examples and usage information is usually a good practice, as these will immediately be 
available to anyone browing to your component's root directory.

For this guide one screen gathers user input (see `./docs/examples/components/browser.js`) and displays the list of 
movies (as `movie` objects) returned by the web service:

    define.class('$ui/screen', function($ui$, view, button, label, $$, movie) {

        this.attributes = {
          term: {type:String},
          movies: {type:Array}
        };

        this.renderMovies = function() {
            var mviews = [];
            for (var i=0;i<this.movies.length;i++) {
                mviews.push(movie(this.movies[i]));
            }
            return mviews;
        };

        this.render = function() { return [
            view(
                {flexdirection:'column'},
                label({ name:'search', text:'Aliens'}),
                button({text:'Search', click:function() {
                    this.screen.term = this.parent.search.text;
                }}),
                view(this.renderMovies())
            )
        ] }
    });

And finally, the `index.js` wires all the components together:

    define.class('$server/composition', function($$, search, browser) {

        this.render = function() { return [
            search({
                name:'omdb',
                keyword:'${this.rpc.user.main.term}'
            }),
            browser({
                name:'main',
                movies:'${this.rpc.omdb.results}'
            })
        ] }
    });
    
### Usage
    
Individual DreemGL classes can include inline usage examples directly in thier codebase.  To add inline examples, 
attach them to `this.constructor` as an attribute named `examples`.  For example:

    	var example = this.constructor;    	
    	this.constructor.examples = {
    	  // Basic Usage
    		Usage:function(){
    			return [
    				example({some:'attributes'})
    			]
    		},
    		// Some other use case
    		Exmaple:function(){
    			return [
    				example({some:[{other:'example'}]})
    			]
    		}    		
    	}

    
    

## Working with screen &lt;&mdash;&gt; server RPC

All communication between the user and the server must go though the RPC bus, availabel via `this.rpc`.  To make
calls on the server, use `this.rpc.serverObjectName.attributeOrMethodName` for server objects
and `this.rpc.screenName.attributeOrMethodName` for screen objects.

### Attributes

Attributes can be get and set like so:

    this.rpc.object.someAttribute = "value"

    console.log("My value is", this.rpc.object.someAttribute);

### Methods

All RPC method calls are promises that return with the result of the method, and can be called like so:

    this.rpc.server.methodCall().then(function(ret) {
        console.log("My value is:", ret.value);
    })

# Communicating with External Services and Devices

When you have a physcial device or external service that cannot be integrated directly within the Dreem system itself,
or if you otherwise need to send data into the system, you can interact directly with Dreem objects using the HTTP
POST API methods.  

## Using POST API

The composition server will respond to HTTP POSTs requests sending JSON data in the following format:

    {
      "rpcid": "<see below>",
      "type": "<attribute|method>",

      //used only if type=attribute
      "get":true|false,
      "attribute": "<attribute name>",
      "value": "<attribute value, if setting>",

      //used only if type=method
      "method": "<method name>",
      "args": ["<array>", "<of>", "<arguments>"]
    }


### RPC ID

The RPC ID refers to the object that the RPC method will be called on, and is simply the string that would otherwise
come after a call to `this.rpc` in Dreem code, except for the name of the attribute or method name itself.  For example,
the attribute you would have set in this code `this.rpc.mobile.deviceID` would have an
RPC ID of `mobile`.  Likewise, a method called with `this.rpc.localapi.register()` would have an RPC ID of `localapi`.

### Attributes

#### Setter

The JSON structure for a setting an attribute is as follows:

    {
      "rpcid": "<see above>",
      "type": "attribute",

      "attribute": "<attribute name>",
      "value": "<attribute value>"
    }

An an example, to set the search term variable on the example above, you can use [curl](http://curl.haxx.se/) like so:

    curl -X POST -d '{"rpcid":"main", "type":"attribute", "attribute":"term", "value":"Snow"}' http://localhost:2000/docs/examples/components

Which will return:

    {"type":"return","attribute":"term","value":"OK"}

#### Getter

Getting attributes is identical to setting, but without a `value` property and setting the `get` property:

    {
      "rpcid": "<see above>",
      "type": "attribute",
      "get": true,

      "attribute": "<attribute name>"
    }

Reading the kework attribute off the omdb search object:

    curl -X POST -d '{"rpcid":"omdb", "type":"attribute", "attribute":"keyword", "get":true}' http://localhost:2000/docs/examples/components

If you had set the search term with the previous example, it will now return:

    {"type":"return","attribute":"keyword","value":"Snow"}

### Method Calls

In additon to setting attributes, methods can be called directly on Dreem objects.  The method JSON structure looks
like this:

    {
      "rpcid": "<see above>",
      "type": "method",

      "method": "<method name>",
      "args": ["<array>", "<of>", "<arguments>"]
    }

This will directly manipulate the `onkeyword` function of the omdb search object to trigger a

    curl -X POST -d '{"rpcid":"omdb", "type":"method", "method":"onkeyword", "args":["Red"]}' http://localhost:2000/docs/examples/components

The screen will redraw and this the API will return:

    {"type":"return","method":"onkeyword"}

#Examples of Connected Devices

See the Hue ambient lights example here: [http://localhost:2000/examples/components/hue/README.md](http://localhost:2000/examples/components/hue/README.md)
