define.class("$ui/view", function($ui$, label) {

    this.bgcolor = 'pink';
    this.padding = 10;
    this.margin = 10;
    this.borderwidth = 2;
    this.bordercolor = "#333";
    this.flex = 1;
    this.height = 100;
    this.borderradius = 20;

    this.attributes = {
        distance: Config({type:String}),
        data: Config({type:Object}),
        changelog: Config({type:String})
    };

    this.ondata = function (e) {
        var data = e.value;
        if (data && data.beacon) {
            this.distance = parseFloat(data.beacon.distance).toFixed(2) + ' m';
        }
    };

    this.render = function () {
        return [
            label({text: this.distance, fgcolor:'#333', bgcolor:'transparent'})
        ];
    };

});