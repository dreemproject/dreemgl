# Dreem GL

DreemGL is an open source JS webGL and DALi (Dynamic Animation Library; a cross-platform 3D UI Toolkit) prototyping framework with 
shader styling and render functions.

To start dreemGL type

```node server.js```

Intro presentation

[http://127.0.0.1:2000/introduction](http://127.0.0.1:2000/introductio)

To try livecoding a shader open this:

[http://127.0.0.1:2000/rendertest](http://127.0.0.1:2000/rendertest) and open 
[compositions/rendertest.js](compositions/rendertest.js) in your editor and start typing away and saving, reload should 
be live.

As the server starts, it also shows other local IP's its listening on (for trying it on your phone)

## Path symbols

The server.js has a set of 'default path symbols' which are referencable using the $symbol syntax in require strings: '$widgets/myfile',
The default path symbols are:
```
	'system':'$root/system',
	'resources':'$root/resources',
	'examples':'$root/examples',
	'3d':'$root/classes/3d',
	'behaviors':'$root/classes/behaviors',
	'server':'$root/classes/server',
	'ui':'$root/classes/ui',
	'testing':'$root/classes/testing',
	'widgets':'$root/classes/widgets',
```

Adding a path is done using the commandline
node server.js -path mylib:../mydir

## Dreemclasses 
classes are defined in a single file, using the following syntax:
```
define.class('$ui/view', function($ui$, label){
})
```
Please note the 'require' syntax to specify the baseclass, and the $ui$ to switch directory in the dependency-class list.
Other syntax: $$ - current directory, $$$ - parent directory, relative$dir$

After the baseclass and dependencies, you can define attributes on a dreemclass.

## Attributes 

Attributes are properties that can be wired to other properties, and have a type. 

The way to create them in a class is to assign an object to this.attributes. The setter of 'attributes' will handle creating all the attributes on the class for you. Types of attributes are automatically inferred if assigned with a plain value, but can also be configured using a Config({meta:'hello'}) object. Assigning a Config object to any existing attribute also refines its settings.
Options for the config attribute are:
```
	type:vec2,float,String
	value:0.4,vec2(3),"hello"
	meta:'metadataforeditor'
	persist:true // make sure the attribute survives a livereload / rerender
```
```
this.attributes = {
	propfloat: 1.0,
	propstring: "HELLO",
	propcustom: Config({type:vec2})
}
```
Attributes are also automatically created if you pass them to the constructor function. view({myprop:10}) automatically creates the myprop attribute

## Styles

Styles are supported using the 'style' property that can live on 4 levels:
- composition
- screen
- class
- nestedclass
These levels are also inherited in that order. 
Styles allow subclassing of classes used in the render function of the class on which the properties are set. The subclassing is done using a matching syntax
There are no limitations what you can put in a style since its an actual subclass.

The following style match patterns are supported
```
this.style = {
	$:{ // match all
	}
	$_myclass:{ // match all with class:'myclass'
	},
	label:{ // match all labels
	}
	label_name:{ // match all labels with name:'name'
	},
	label_class:{ // match all labels with class:'class'
	}
}
```
Have fun!

## License
This software is licensed under the  Apache License, Version 2.0. You will find the terms in the file named 
["LICENSE.md"](LICENSE.md) in this directory.
