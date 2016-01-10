define.class('$ui/screen', function($ui$, view, $examples$staticmap$, map){

    this.attributes = {
        location: Config({type:String, flow:"in"})
    }

    this.render = function(){
        return view({bgcolor:"#000030"}, map({width:300, height:300, location:this.location}))
    }
})
