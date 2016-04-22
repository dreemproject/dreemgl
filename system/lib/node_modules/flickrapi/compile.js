/**
 * This compiles a client-side Flickr library
 * based on the flickr method information.
 *
 * run with `node compile`
 */
(function() {
  "use strict";
  process.CLIENT_COMPILE = true;

  var habitat = require("habitat"),
      env = habitat.load(),
      flickrOptions = env.get("FLICKR"),
      APIBuilder = require("./src/flickr-api-object.js"),
      Utils = require("./src/utils.js"),
      filename = "flickrapi";

  if(process.argv.indexOf("dev") > -1) {
    filename = "flickrapi.dev";
  }

  var buffer = (function() {
    var data = "";
    return {
      write: function(s) { data += s + "\n"; },
      getData: function() { return data; }
    };
  }());


  var methods = {};
  var setupMethods = function(node, name) {
    name = name || "flickr";
    if(typeof node === "function" && node.data) {
      Object.keys(node.data).forEach(function(key){
        if(!node.data[key] || node.data[key].length === 0) {
          delete node.data[key];
        }
      });
      methods[name] = node.data;
    } else {
      Object.keys(node).forEach(function(key) {
        setupMethods(node[key], name + "." + key);
      });
    }
  };

  var stripDev = function(methods) {
    Object.keys(methods).forEach(function(methodName) {
      var data = methods[methodName];
      delete data.required;
      delete data.optional;
      delete data.errors;
      delete data.url;
    });
  };

  /**
   * Write out a (nested) object
   */
  var writeTree = function(node, name, write, wrapped) {
    if(typeof node === "function") {
      if (wrapped) {
        write("Flickr.prototype"+name + " = (function(Utils) {");
        write("  var method_name = \"flickr"+name+"\";");
        write("  var security = " + JSON.stringify(node.security,null,2) + ";");
        if(process.argv.indexOf("dev") > -1) {
          write("  var required = " + JSON.stringify(node.data.required,null,2) + ";");
          write("  var optional = " + JSON.stringify(node.data.optional,null,2) + ";");
          write("  var errors = " + JSON.stringify(node.data.errors,null,2) + ";");
          write("  var fn = " + node.toString());
          write("  fn.data = { required: required, optional: optional, errors: errors, name: method_name };");
          write("  return fn;");
        }
        else { write("  return " + node.toString()); }
        write("}(Utils));\n");
        methods.push("flickr"+name);
      } else {
        write(name + " = " + node.toString() + ";");
      }
    } else {
      Object.keys(node).forEach(function(key) {
        writeTree(node[key], name + "." + key, write, wrapped);
      });
    }
  };

  /**
   * Compile a client-side library based on the flickr-api-object code.
   */
  new APIBuilder(flickrOptions, Utils, function(err, flickr) {
    if(err) {
      console.error(err);
      process.exit(1);
    }

    delete flickr.options;
    buffer.write("(function() {");

    // library-specific Utils
    buffer.write(" var Utils = {};");
    writeTree(require("./browser/Utils.js"), "Utils", buffer.write);
    buffer.write(" Utils.errors = " + JSON.stringify(Utils.getCallErrors(),false, 4) + ";");

    // Flickr object definition
    buffer.write(" var Flickr = " + (function(flickrOptions) {
  this.bindOptions(flickrOptions);
}).toString() + ";");
    buffer.write(" Flickr.prototype = {};");

    // Prototype from methods
    setupMethods(flickr);

    if (process.argv.indexOf("dev") === -1) { stripDev(methods); }
    buffer.write(" Flickr.methods = " + JSON.stringify(methods,false,1) + ";");
    var fn = (function() {
  Object.keys(Flickr.methods).forEach(function(method) {
    var level = method.split(".").slice(1);
    var e = Flickr.prototype, key;
    while(level.length > 1) {
      key = level.splice(0,1)[0];
      if(!e[key]) { e[key] = {}; }
      e = e[key];
    }
    e[level] = Utils.generateAPIFunction(Flickr.methods[method]);
  });
}).toString();
    if (process.argv.indexOf("dev") > -1) { fn = fn.replace("generateAPIFunction","generateAPIDevFunction"); }
    buffer.write("\n(" + fn + "());\n");

    // option binding for individual instances
    buffer.write(" Flickr.prototype.bindOptions = " + (function(flickrOptions) {
  this.flickrOptions = flickrOptions;
  (function bindOptions(obj, props) {
    Object.keys(props).forEach(function(key) {
      if (key === "flickrOptions") return;
      if (typeof obj[key] === "object") {
        bindOptions(obj[key], props[key]);
        obj[key].flickrOptions = flickrOptions;
      }
    });
  }(this, Flickr.prototype));
}).toString() + ";");

    // end of library
    buffer.write("\n window.Flickr = Flickr;");
    buffer.write("}());");

    // write out the library to file
    var fs = require("fs");
    filename = "./browser/"+filename+".js";
    fs.writeFile(filename, buffer.getData(), function() {
      console.log("written "+filename);
      process.exit(0);
    });
  });

}());
