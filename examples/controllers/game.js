define.class("./controller", function($$, controllerbutton) {

    this.attributes = {
    };

    this.render = function() {
        return [
            controllerbutton({text:'up', value:'~U', controller:this}),
            controllerbutton({text:'down', value:'~D', controller:this}),
            controllerbutton({text:'left', value:'~L', controller:this}),
            controllerbutton({text:'right', value:'~R', controller:this}),

            controllerbutton({text:'select', value:'~select', controller:this}),
            controllerbutton({text:'start', value:'~start', controller:this}),

            controllerbutton({text:'triangle', value:'~T', controller:this}),
            controllerbutton({text:'square', value:'~S', controller:this}),
            controllerbutton({text:'circle', value:'~C', controller:this}),
            controllerbutton({text:'cross', value:'~X', controller:this}),

            controllerbutton({text:'L1', value:'~L1', controller:this}),
            controllerbutton({text:'L2', value:'~L2', controller:this}),
            controllerbutton({text:'R1', value:'~R1', controller:this}),
            controllerbutton({text:'R2', value:'~R2', controller:this})
        ];
    }

});