# DreemGL Visual Toolkit

Extending DreemGL to communicate with and access IoT devices, web services and other external resources means creating 
a DreemGL component.

## Setting Up

Add `$widgets$toolkit` to any composition screen to bring up the visual toolkit for that screen.

    define.class("$server/composition", function ($ui$, screen, view, label, icon, cadgrid, $widgets$, toolkit) {
        this.render = function() {
          return screen({flexdirection:'row'},
            cadgrid({
              flex:3,
              name:"grid",
              bgcolor:"#4e4e4e",
              gridsize:5,
              majorevery:5,
              majorline:"#575757",
              minorline:"#484848"}
            ),
            toolkit());
        };
      }
    );


## Live Example

If you have the DreemGL server running the example sandbox can be found here:

<iframe style="border:0;width:900px; height:600px" src="/examples/usingtoolkit"></iframe>



