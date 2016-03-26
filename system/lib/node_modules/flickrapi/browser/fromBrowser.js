function testFlickrAPI(proxied) {
  var api_key, flickr;

  // local API proxy test
  if(proxied) {
    flickr = new Flickr({ endpoint: "//localhost:3000/service/rest/" });
  }

  // plain Flickr access with API key
  else {
    api_key = document.getElementById("api_key").value;
    flickr = new Flickr({ api_key: api_key });
  }

  // run a search.
  flickr.photos.search({
    text: "red+panda"
  }, function(err, response) {
    if(err) {
      console.error(err);
    }
    console.log(response);
  });
}

var select = document.getElementById("methods");
Object.keys(Flickr.methods).forEach(function(name) {
  var option = document.createElement("option");
  option.value = name;
  option.innerHTML = name;
  if (name === "flickr.photos.search") {
    option.selected = true;
  }
  select.appendChild(option);
});

select.onchange = function(evt) {
  var methodName = select.options[select.selectedIndex].value,
      data = Flickr.methods[methodName],
      div = document.getElementById("arguments");

  div.innerHTML = "";
  ["required","optional"].forEach(function(type) {
    if(data[type] && data[type].length > 0) {
      data[type].forEach(function(r) {
        var t = document.createElement("div");
        t.setAttribute("class", type);
        div.appendChild(t);
        var v;
        v = document.createElement("label");
        v.for = methodName;
        v.innerHTML = r.name;
        t.appendChild(v);
        v = document.createElement("input");
        v.id = methodName;
        v.type = "text";
        t.appendChild(v);
        v = document.createElement("p");
        v.innerHTML = r._content;
        t.appendChild(v);
      });
    }
  });
};

select.onchange();
