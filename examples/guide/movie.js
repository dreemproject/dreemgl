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
        var url = event.value;
        if (url && url.startsWith && url.startsWith('http')) {
            this.bgimage = "https://maps.googleapis.com/maps/api/staticmap?key=AIzaSyDL5stf137yu1GJpVzU2tlCFE0ssgaC9R0&center=Portland%2C%20OR&maptype=roadmap&scale=2&zoom=14&size=100x100&format=jpg";
        } else {
            this.bgimage = null;
        }
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