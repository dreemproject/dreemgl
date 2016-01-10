define.class('$ui/screen', function($ui$, view, $examples$staticmap$, map){

    this.attributes = {
        location: Config({type:String, flow:"in"}),
        zoomLevel: Config({type:float, flow:"in"})
    };

    this.bestZoom = function () {

        var zl = this.zoomLevel * 21;
        if (!zl) {
            zl = 14; //default
        }
        if (zl < 0) {
            zl = 0; //min
        }
        if (zl > 21) {
            zl = 21; //max
        }

        return Math.round(zl);
    };

    this.render = function(){
        return view({bgcolor:"#000030"}, map({width:300, height:300, location:this.location, mapzoom:this.bestZoom()}))
    }
});
