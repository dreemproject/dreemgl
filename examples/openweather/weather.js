define.class('$ui/view', function($ui$, label) {

    this.flexdirection = 'column';
    this.flex = 1;
    this.name = 'weather';

    this.attributes = {
      apikey:   "67f157589d7e8f03302c19d068b7474a",
      endpoint: "http://api.openweathermap.org/data/2.5/weather?",
      location: "Portland,OR",
      servicename:'openweather',
      reporturl:wire("this.endpoint + 'appid=' + this.apikey + '&q=' + encodeURIComponent(this.location)"),
      reportjson:wire('rpc.openweather.response'), // TODO use rpc[this.servicename].response once that works
      report: wire('(this.reportjson ? JSON.parse(this.reportjson) : null)')
    };

    this.onreporturl = function(event) {
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
            if (this.report.name) {
                var name = this.report.name;
                if (this.report.sys && this.report.sys.country) {
                    name = name + ', ' + this.report.sys.country
                }
                views.push(label({ text:name, fgcolor:'red'}))
            }
            if (this.report.main && this.report.main.temp) {
                views.push(label({ text:"Temp: " + this.report.main.temp, fgcolor:'blue'}))
            }
            if (this.report.weather) {
                for (var i =0;i < this.report.weather.length;i++) {
                    var condition = this.report.weather[i];
                    if (condition.main) {
                        views.push(label({ text:condition.main, fgcolor:'green'}));
                    }
                }
            }
        }

      return views;
    };

});


