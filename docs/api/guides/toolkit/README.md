# DreemGL Visual Layout Toolkit

The layout `toolkit` widget is meant for quickly prototyping and designing new compositions.  

## Setting Up

The layout `toolkit` is for prototyping user interfaces and as such is limited to compositions with simple render functions (particularly functions without loops
or flow control logic).  The simplest way to begin is with a blank `toolkit` application to complete the visual layout and design. Then, more complex logic can be added when the application is developed. The purpose of this guide is to describe the process of prototping visual layout.

For example:

    define.class("$server/composition", function ($ui$, screen, view, label, icon, cadgrid, $widgets$, toolkit) {
        this.render = function() {
          return screen(
            cadgrid({
              toolrect:false,
              toolmove:false,
              flex:3,
              name:"grid",
              bgcolor:"#4e4e4e",
              gridsize:5,
              majorevery:5,
              majorline:"#575757",
              minorline:"#484848"}
            ),
            toolkit()
          );
        };
      }
    );

Note the there are two special `tool-` properties being added to the `cadgrid`.  These indicate to the `toolkit` that
this view should not be mmoved (`toolmove:false`) and should not show the selection rectangle when 
selected (`toolrect:false`).  A side effect of `toolmove:false` informing toolkit that it is unable to move this view, 
it can be used as backdrop for multiple selection, essentially a main canvas for the toolkit to select and drag within.

## Special Properties

There are a number of special properties that can be added to views to influence toolkit behavior:

| Property | Default | Behavior |
|----------|---------|----------|
| tooltarget | true | When false, is completely ignored by `toolkit` |
| tooldragroot | false | When true, inner children cannot be dragged |
| toolrect | true | When true, draw selection rectangle, don't when false |
| toolresize | true | When true view can be resized, is false then not |
| tooldrop | true | A valid location for dropping components on to |
| toolselect | true | When false cannot be selected |
| toolremove | true | When false, cannot be removed/deleted |
| tooltextedit | true | When true can edit text in place |
| toolrotate | true | When true toolkit can rotate view |

## Component Palette

The `toolkit` includes a configurable component palette that allows you to drop coponets and behaviors onto DreemGL 
views in a simple way.  Custom component descriptors are included in the `toolkit` as follows:

    toolkit({
      components:[
          {
            label:"Human Readbale Name",
            desc:"A long form description of the item",
            icon:"optional icon code",
            classname:"classname",
            classdir:"$$",
            params:{
              include:"any params",
              to:"attach to the dropped object",
              including:functions() {}            
            }
          }  
      ]
    })

For example, the default componets are `view`, `label`, `checkbox`, `button` and `icon` objects and, and are configured 
with param values as such:

		[
			{
				label:"View",
				icon:"sticky-note",
				desc:"A rectangular view",
				classname:"view",
				classdir:"$ui$",
				params:{
					height:150,
					width:200,
					pickalpha:-1,
					bgcolor:'white'
				}
			},
			{
				label:"Text",
				text:"Aa",
				desc:"A text label",
				classname:"label",
				classdir:"$ui$",
				params:{
					fontsize:44,
					pickalpha:-1,
					bgcolor:"transparent",
					fgcolor:'#999',
					text:'Label'
				}
			},
			{
				label:"Check Button",
				icon:"check-square-o",
				desc:"A check button",
				classname:"checkbox",
				classdir:"$ui$",
				params:{
					tooldragroot:true,
					fontsize:24,
					bgcolor:"transparent",
					buttoncolor1:"transparent",
					buttoncolor2:"transparent",
					hovercolor1:"transparent",
					hovercolor2:"transparent",
					pressedcolor1:"transparent",
					pressedcolor2:"transparent",
					pickalpha:-1,
					fgcolor:'white'
				}
			},
			{
				label:"Button",
				icon:"stop",
				desc:"A basic button",
				classname:"button",
				classdir:"$ui$",
				params:{
					tooldragroot:true,
					fontsize:24,
					pickalpha:-1,
					text:'Button'
				}
			},
			{
				label:"Icon",
				icon:"info-circle",
				desc:"A Fontawesome icon",
				classname:"icon",
				classdir:"$ui$",
				params:{
					fgcolor:'#e22',
					bgcolor:'transparent',
					pickalpha:-1,
					icon:'heart',
					fontsize:80
				}
			}
		]

When an item is pulled out of the component palette and dropped onto a view, it inserts a new view at that location,
 populating it with the `params` attribute in the component descriptor.  Behaviors can also be dropped onto views
 by attaching named functions to the `behaviors` attribute of the component descriptor.

## Live Example

If you have the DreemGL server running a live example can be found at [/examples/usingtoolkit](/examples/usingtoolkit):

<iframe style="border:0;width:900px; height:800px" src="/examples/usingtoolkit"></iframe>



