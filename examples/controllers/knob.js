define.class("./controller", function($ui$, knob, $$, controllerbutton) {

    this.attributes = {
    };

    this.render = function() {
        return [
            knob({
                innerradius:70,
                outerradius: 190,
                bgcolor:vec4(0,0,0,1),
                onvalue:function(event) {
                    var value = event.value;
                    this.parent.value = value;
                }
            })
        ];
    }

});