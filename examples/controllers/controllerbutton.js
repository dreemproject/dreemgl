define.class("$ui/button", function() {

    this.height = 50;

    this.attributes = {
        value:wire('this.text')
    }

    this.mouseleftdown = function(){
        console.log('press', this.value)
        this.parent.press(this.value)
    }

    this.mouseleftup = function(){
        console.log('unpress', this.value)
        this.parent.unpress(this.value)
    }

});