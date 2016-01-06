define.class('$ui/view', function() {

    this.attributes = {
      apikey:   "AIzaSyDL5stf137yu1GJpVzU2tlCFE0ssgaC9R0",
      endpoint: "http://maps.googleapis.com/maps/api/staticmap?",
      location: "Seocho-gu, Seoul, South Korea",
      format:"jpg",
      maptype:"roadmap", //of roadmap,satellite,terrain,hybrid
      mapscale:2, //1, 2 (or 4)
      mapzoom:14, //0 ~ 21+ (0 is whole earth)
      mapsize:wire(function(){ return this.width + 'x' + this.height }),
      mapurl:wire("this.endpoint + 'key=' + this.apikey + '&center=' + encodeURIComponent(this.location) + '&maptype=' + this.maptype + '&scale=' + this.mapscale + '&zoom=' + this.mapzoom + '&size=' + this.mapsize + '&format=' + this.format"),
      ybgimage:wire("this.mapurl"),
      aaa:'http://www.keenthemes.com/preview/metronic/theme/assets/global/plugins/jcrop/demos/demo_files/image1.jpg',
      bgimage:wire('this.aaa'),
      xbgimage:'http://maps.googleapis.com/maps/api/staticmap?key=AIzaSyDL5stf137yu1GJpVzU2tlCFE0ssgaC9R0&center=Portland%2C%20OR&maptype=roadmap&scale=2&zoom=14&size=500x500&format=jpg'
    };

});


