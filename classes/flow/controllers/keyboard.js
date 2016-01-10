define.class('$ui/screen', function($ui$, view, $examples$controllers$, keyboard){

    this.attributes = {
        keys: Config({type:Array, flow:"out"})
    }

    this.render = function(){
        return view({bgcolor:"#000030"}, keyboard({
                onactivekeys: (function (event) {this.active = event.value;}).bind(this)
            }))
    }
})
