define.class("./controller", function($$, controllerbutton) {

    this.attributes = {
    };

    this.render = function() {
        return [
            controllerbutton({text:'up', value:'~U'}),
            controllerbutton({text:'down', value:'~D'}),
            controllerbutton({text:'left', value:'~L'}),
            controllerbutton({text:'right', value:'~R'})
        ];
    }

});