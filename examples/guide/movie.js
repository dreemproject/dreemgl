define.class(function (require, $ui$, view, label) {

    this.flexdirection = 'column';
    this.padding = 10;
    this.margin = 10;
    this.borderwidth = 2;
    this.bordercolor = vec4(0.3,0.3,0.3,0.3);

    this.attributes = {
        Title:  Config({type: String, value: ""}),
        Year:   Config({type: String, value: ""}),
        imdbID: Config({type: String, value: ""}),
        Type:   Config({type: String, value: ""}),
        Poster: Config({type: String, value: ""})
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
    ]}
});