define.class('$ui/screen', function($ui$, view, $examples$controllers$, dpad){

    this.attributes = {
        value: Config({type:String, flow:"out"}),
        active: Config({type:Array, flow:"out"})
    }

    this.render = function(){
        return view({bgcolor:"#000030"}, dpad({
            onvalue:(function(event){this.value = event.value;}).bind(this),
            onactivekeys:(function(event){this.active = event.value;}).bind(this)
        }))
    }
})
