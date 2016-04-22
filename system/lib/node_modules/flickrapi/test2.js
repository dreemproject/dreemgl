var habitat = require("habitat"),
    env = habitat.load(),
    Flickr = require("./src/FlickrApi"),
    FlickrOptions = env.get("FLICKR");

Flickr.tokenOnly(FlickrOptions, function(err, flickr1) {
  console.log("set up the first token-only flickr instance");
  flickr1.photos.search({tags:"panda"}, function(err,res) { console.log(res); });
});

Flickr.tokenOnly(FlickrOptions, function(err, flickr2) {
  console.log("set up the second token-only flickr instance");
  flickr2.photos.search({tags:"bear"}, function(err,res) { console.log(res); });
});

