define.class('$system/base/node', function(){

    this.attributes = {
        keyword: Config({type:String, flow:"in"}),
        results: Config({type:Array, flow:"out", value:[]})
    }

    this.onkeyword = function() {
        console.log('fire kw', this.keyword)
        omdb.keyword = this.keyword;
    }

    this.render = function() {
        return omdb({name:'omdb', onresults:(function(event) {
            console.log('got results', event)
            this.results = event.value }).bind(this)})
    }

})