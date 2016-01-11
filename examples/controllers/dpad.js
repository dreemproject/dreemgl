define.class("./controller", function($ui$, view, $$, controllerbutton) {

    this.style = {
        view: {
          bgcolor:'transparent'
        },
        controllerbutton: {
            width: 100,
            height: 100,
            margin:5
        }
    }

    this.flex = 1;
    this.flexdirection = 'column';
    this.alignitems = "center";
    this.justifycontent = "center";

    this.render = function() {
        return [
            view(
                {width:this.width, flex:1, flexdirection:'row',alignitems:'center',justifycontent:'center'},
                controllerbutton({text:'up', value:'~U', controller:this})
            ),
            view({flex:1, alignitems:'center', flexdirection:'row', justifycontent:'center'},
                controllerbutton({text:'left', value:'~L', controller:this}),
                controllerbutton({text:'right', value:'~R', controller:this})
            ),
            view(
                {width:this.width, flex:1, flexdirection:'row',alignitems:'center',justifycontent:'center'},
                controllerbutton({text:'down', value:'~D', controller:this})
            )
        ];
    }

});