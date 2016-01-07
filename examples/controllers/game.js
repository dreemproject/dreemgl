define.class("./controller", function($$, controllerbutton) {

    this.attributes = {
    };

    this.render = function() {
        return [
            controllerbutton({text:'up', value:'~U'}),
            controllerbutton({text:'down', value:'~D'}),
            controllerbutton({text:'left', value:'~L'}),
            controllerbutton({text:'right', value:'~R'}),

            controllerbutton({text:'select', value:'~select'}),
            controllerbutton({text:'start', value:'~start'}),

            controllerbutton({text:'triangle', value:'~T'}),
            controllerbutton({text:'square', value:'~S'}),
            controllerbutton({text:'circle', value:'~C'}),
            controllerbutton({text:'cross', value:'~X'}),

            controllerbutton({text:'L1', value:'~L1'}),
            controllerbutton({text:'L2', value:'~L2'}),
            controllerbutton({text:'R1', value:'~R1'}),
            controllerbutton({text:'R2', value:'~R2'})
        ];
    }

});