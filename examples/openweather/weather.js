define.class('$ui/view', function($ui$, label) {

    this.flexdirection = 'column';
    this.flex = 1;
    this.name = 'weather';

    this.attributes = {
      apikey:   "67f157589d7e8f03302c19d068b7474a",
      endpoint: "http://api.openweathermap.org/data/2.5/weather?",
      location: "Portland,OR",
      servicename:'openweather',
      reportURL:wire("this.endpoint + 'appid=' + this.apikey + '&q=' + encodeURIComponent(this.location)"),
      report:wire('this.rpc.openweather.response'),
      reportx:{
          "coord":{"lon":-122.68,"lat":45.52},
          "weather":[{"id":701,"main":"Mist","description":"mist","icon":"50d"}],
          "base":"stations",
          "main":{"temp":271.77,"pressure":1015,"humidity":80,"temp_min":271.15,"temp_max":273.15},
          "visibility":16093,
          "wind":{"speed":4.1,"deg":120},
          "clouds":{"all":90},"dt":1451857662,
          "sys":{"type":1,"id":2274,"message":0.0295,"country":"US","sunrise":1451836250,"sunset":1451868026},
          "id":5746545,
          "name":"Portland",
          "cod":200}
    };

    this.onreportURL = function(event) {
        var url = event.value;
        var weatherservice = this.rpc[this.servicename];
        if (weatherservice) {
            weatherservice.url = url
        } else {
            console.log('weather service object does not exist', this.servicename)
        }
    };

    this.render = function() {
        var views = [];

        if (this.report) {
            console.log('>>', this.report)
            views.push(label({ text:this.report.name, fgcolor:'red'}))
        }

       //[
       //    label({ text:this.report.name, fgcolor:'red'}),
       //    label({ text:this.rep, fgcolor:'pink'}),
       //    label({ text:"Temp: " + this.report.main.temp, fgcolor:'blue'}),
       //    label({ text:this.report.weather[0].main, fgcolor:'green'})
       //];

      return views;
    };



});


