# DreemGL

DreemGL is an open-source multi-screen prototyping framework for mediated environments, 
with a visual editor and shader styling for webGL and DALi runtimes written in JavaScript.
As a toolkit for gpu-accelerated multiscreen development, DreemGL includes features such as:

* IoT Integration for Smart Environments that is elegantly simple
* Visual layouts and compositions using real data from network services
* Fast prototyping that allows designers to easily test compositions that connect multiple users in shared experiences on big screens or projections, while allowing each person to use the control tools and preferences they have configured.

An overview of the DreemGL's architecture:
<img alt="Architecture Image" src="https://raw.githubusercontent.com/dreemproject/dreemgl/dev/docs/images/architecture.png"/>

## Getting Started with DreemGL

The fastest way to get started with DreemGL is to walk through [DreemGL in 10 Minutes](http://docs.dreemproject.org/docs/api/index.html#!/guide/dreem_in_10_part1).

### Working with DreemGL NPM

Install the DreemGl NPM globally to include the `dreemgl` command line standalone launcher:

`npm install -g dreemgl`

#### Serve a single DreemGL composition

The easiest way to get started quickly is to have DreemGL serve an individual composition using the standalone launcher:

`dreemgl -port 3000 ./mydreemglapp.js`

#### Serve DreemGL from within an expresss app

It's easy to integrate the DreemGL runtime from within an express app:

```
// Create an express app
var express = require('express');
var app = express();

// Init DreemGL setup
require = require('dreemgl')

// These options will be used when building composition servers, use dummy bus for simplicity
define.$compositionOptions = {
	busclass: '$system/rpc/dummybusserver',
	clientdefines: { busclass:"$system/rpc/dummybusclient" }
}

// The ExpressAdapter helps configure DreemGl to work with express easily
var ExpressAdapter = require('$system/adapters/expressadapter')()

// Configure serving the static JS files that DreemGL will ask for
ExpressAdapter.mountStatic(express, app)

// Configure requests to be handled by the ExpressAdapter.requestHandler, in this case everything:
app.get('/*', ExpressAdapter.requestHandler);

// Start the server listening on port 3000
app.listen(3000, function() { console.log("Started express server on port 3000") });

```

A more complex example using the firebase bus can be found in the DreemGL repository at `./examples/express+firebase.js`

### Working with DreemGL Repository

For more complex usage, it's often easier to work outside of the NPM with the full DreemGL stack from the github repository.  Once you have downloaded the source from the [master branch of dreemproject in Github](https://github.com/dreemproject/dreemgl), you can start DreemGL by typing: 

```node server.js```

To test if everything is working fine, open the following URL for the treeart2.js composition in a supported browser: [http://localhost:2000/examples/treeart2](http://localhost:2000/examples/treeart2). You should be seeing an animated tree with some nice shader effects.

To try livecoding a shader open this:
[http://127.0.0.1:2000/test/rendertest](http://127.0.0.1:2000/test/rendertest) and open
[./test/rendertest.js](/test/rendertest.js) in your editor and start typing away and saving, reload is live.

## Documentation

DreemGL provides an [API
reference](http://docs.dreemproject.org/docs/api/index.html#!/api), a [Developer's Guide](http://docs.dreemproject.org/docs/api/index.html#!/guide/devguide), and
guides for all components, including the visual layout toolkit, the
flow graph, and IoT integration. See the links to [all available
guides](http://docs.dreemproject.org/docs/api/index.html#!/guide).

DreemGL can generate documentation automatically from all the code in its system. When DreemGL is running, this documentation can be accessed locally at [http://localhost:2000/docs/api/index.html](http://localhost:2000/docs/api/index.html). 

Instructions for adding documentation and rebuilding the documentation can be found in the [Developer's Guide](http://docs.dreemproject.org/docs/api/index.html#!/guide/devguide).

##Talk to Us

Have a question? Comment? Something cool to show people? We're all on Slack. Join us!
[![Slack Status](https://dreemproject.herokuapp.com/badge.svg)](https://dreemproject.herokuapp.com/)

## Contributing to DreemGL

Like DreemGL? Get involved. Find more information in the file ["Contributing.md"](https://github.com/dreemproject/dreemgl/blob/master/CONTRIBUTING.md), also in this directory. 

### Filing Feature Requests and Bug Reports

DreemGl is an open-source project and uses [JIRA](https://dreem2.atlassian.net/secure/Dashboard.jspa) to track feature requests and bug reports. We encourage you to post your reports here.

## License

This software is licensed under the  Apache License, Version 2.0. You will find the terms in the file named
["LICENSE.md"](https://github.com/dreemproject/dreemgl/blob/master/LICENSE.md), also in this directory.

## Attribution

DreemGL is produced in collaboration between [Teeming Society](http://teem.nu) and [Samsung Electronics](http://www.samsung.com/us/), sponsored by Samsung Electronics and others.
