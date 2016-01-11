define.class('$ui/screen', function($ui$, view, $examples$staticmap$, map){

    this.attributes = {
        location: Config({type:String, flow:"in"}),
        zoomLevel: Config({type:String, flow:"in"}),
        zooml: Config({type:int, value:14})
    };

    this.bestZoom = function () {

        var zl = this.zooml;

        var zlf = parseFloat(this.zoomLevel);

        if (zlf) {
            zl = zlf * 21;
        } else {
            if (this.zoomLevel === 'up' || this.zoomLevel === 'left') {
                zl++;
                this.zoomLevel = undefined
            } else if (this.zoomLevel === 'down' || this.zoomLevel === 'right') {
                zl--;
                this.zoomLevel = undefined
            }
        }

        if (!zl) {
            zl = 14; //default
        }
        if (zl < 0) {
            zl = 0; //min
        }
        if (zl > 21) {
            zl = 21; //max
        }

        this.zooml = Math.round(zl);
        return this.zooml;
    };

    this.render = function(){
        return map({width:400, height:400, location:this.location, mapzoom:this.bestZoom()})
    }
});
