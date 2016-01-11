define.class("$ui/button", function() {

    this.height = 50;
    this.alignitems = 'center'
    this.justifycontent = 'center'
    this.attributes = {
        value:wire('this.text'),
        controller:Config({type:Object})
    };

    this.mouseleftdown = function() {
        console.log('press', this.value);
        if (this.controller && this.controller.press) {
            this.controller.press(this.value)
        }
    };

    this.mouseleftup = function() {
        console.log('unpress', this.value);
        if (this.controller && this.controller.unpress) {
            this.controller.unpress(this.value)
        }
    }

});