define.class('$ui/view', function() {

    this.attributes = {
      apikey:   "AIzaSyDL5stf137yu1GJpVzU2tlCFE0ssgaC9R0",
      endpoint: "http://maps.googleapis.com/maps/api/staticmap?",
      location: "Seocho-gu, Seoul, South Korea",
      format:"jpg",
      maptype:"roadmap", //of roadmap,satellite,terrain,hybrid
      mapscale:2, //1, 2 (or 4)
      mapzoom:14, //0 ~ 21+ (0 is whole earth)
      mapurl:wire("this.endpoint + 'key=' + this.apikey + '&center=' + encodeURIComponent(this.location) + '&maptype=' + this.maptype + '&scale=' + this.mapscale + '&zoom=' + this.mapzoom + '&size=' + this.width + 'x' + this.height + '&format=' + this.format"),
      bgimage:wire("this.mapurl")
    };

});


