/*
	Script for extracting the fontawesome meta information for each glyph into a serialized
	JSON structure. The script needs to be run in the browser dev console with this page open:
  https://fortawesome.github.io/Font-Awesome/cheatsheet/

  The script generates an array into the JavaScript console, which should be copied over
  into the appendix_generator.js file.
 */

var output = "var fontawesomeMeta = [\n";

$('.row .col-md-4').each(function() {
	var glyph = {};
	var hexValue = "";
	var s = $(this).text();
	var matchUni = s.match(/(&#x[a-f0-9]*;)/);
	if (matchUni && matchUni[0]) {
		glyph.unicodeEnt = matchUni[0];
		hexValue = matchUni[0].substring(3,7);
		glyph.unicode = String.fromCharCode(parseInt(hexValue, 16));
	}
	var m = s.match(/fa-.*/);
	if (m && m[0]) {
		glyph.className = m[0];
	}
	if (glyph.unicode !== undefined) {
		output += "\t\t" + JSON.stringify( glyph ) + ",\n"
	}
});
console.log( output );
