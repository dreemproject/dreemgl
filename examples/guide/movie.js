define.class(function ($containers$, view, $controls$, label) {

    this.flexdirection = 'column';
    this.padding = 10;
    this.margin = 10;
    this.borderwidth = 2;
    this.bordercolor = vec4(0.3,0.3,0.3,0.3)

    this.attributes = {
        Title: {type:String},
        Year: {type:String},
        imdbID: {type:String},
        Type: {type:String},
        Poster: {type:String}
    };

    this.onPoster = function (event) {
        this.bgimage = event.value;
    };

    this.render = function() { return [
        label({
            name:"label",
            text:this.Title + " (" + this.Year + ")",
            fgcolor:'white',
            fontsize:10,
            bgcolor:vec4(0,0,0,0.5),
            multiline: true
        })
    ] }

});