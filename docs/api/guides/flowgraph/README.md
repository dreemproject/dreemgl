# DreemGL Flow Graph

The Flow Graph is an application which allows a user to visually design application data flow.

## Loading a Composition

The Flow Graph is located at [/apps/flowgraph](/apps/flowgraph).  It loads compositions using the `#composition` hash
parameter (see example below).  

## Blocks

There are two varieties of top-level composition blocks that can be wired together, Services and Screens.  All arguments
in the composition's main function will be available for use by the flowgraph.

### Services

Service blocks are objects that extend from `$server/service`.  To be visible in the flowgraph services must have 
a `flowdata` attribute which contains contains position object e.g. `{x:100, y:100}`.

### Screens

Screen blocks are objects that extend from `$ui/screen`.  To be visible in the flowgraph services must have 
a `flowdata` attribute which contains contains position object, with `screen=true` e.g. `{x:100, y:100, screen:true}`.

Clicking on the small screen icon will open an `target='_blank'` browser window to the appropriate screen using the
default `screenForClient` mechanic (i.e. `?screenname`).

## Wires

Blocks are connected via attribute wires.  In DreemGL code an atrribute wire is an initializer using a wire function, 
typically an rpc call, such as:

    userscreen({
        userProfile:wire("this.rpc.userservice.profile")
    })
    
Complex wires that supply data into arrays and objects can be built using javascript in the wire expressions.  For example,
arrays can be built from multiple calls:   

    map({
        locations:wire("[this.rpc.source1.data,this.rpc.source2.data,this.rpc.source3.data]")
    })

And objects can be built inline with static keys: 
    
    profilescreen({
        profile:wire("{username:this.rpc.userservice.username, likes:this.rpc.prefsservice.favorites, address:this.rpc.locationservice.location}")
    })
  
### Preparing attributes

In order to make an attribute visible to the flowgraph, an attribute must have a `flow` property with a value of either
'out' or 'in'.  e.g. 

    this.attributes = {
        userid: Config({type: int, flow: 'in'}),
        onuserid:function(ev,v,o) { this.profile = this.getProfileFromUserID(v) },
        profile: Config({type:Object, flow: 'out'})
    }

### Wiring attributes

To wire attributes in the flowgraph click on either the output or the input and click again on the corespondingly 
respective input or output you want to attach it to.

#### Solid, single-color wires (one-to-one, one-to-many)

When wires are a solid color, this indicates an exact type match, so there will be no conversion.

#### Solid, mixed-color wires (one-to-one, one-to-many)

A mixed color indicates a type conversion.  Many data types are type convertable, however can produce unexpected 
conversions, so be wary when using automatic conversion.

#### Dashed wires (many-to-one)

Wires that appear to be chopped up or dashed indicates that the value is being added as an item inside of a larger
container object, typically an `Array` or an `Object`.  Adding more than one wire to an `Array` or an `Object` will 
automatically trigger this value-inserting behavior, as will connecting any primitive type to an array.

## Debugging

### Service (debugd)

A debug service which will print out values to the console can be added to the library by including `$flow$services$,debugd` 
in your composition's main function.

### Screen (debug)

A debug screen which will print out values on a special screen can be added to the library by including `$flow$displays$,debug` 
in your composition's main function.

### Manual Input Screen (outputs)

Similar to the debug screen the `outputs` screen provides writable output values that can be used as inputs into ther screens.
The outputs screen can be added to the library by including `$flow$displays$,outputs` in your compostion's main function

## Live Example

If you have the DreemGL server running a live example can be found at [/apps/flowgraph?#composition=$examples/flow.js](/apps/flowgraph?#composition=$examples/flow.js):

<iframe style="border:0;width:900px; height:800px" src="/apps/flowgraph?#composition=$examples/flow.js"></iframe>



