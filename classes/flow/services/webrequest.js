define.class('$ui/screen', function($ui$, view, $examples$controllers$){

    this.attributes = {
        value: Config({type:vec2, flow:"out"})
    }

    this.render = function(){
        return view({bgcolor:"#000030"})
    }
})
