'use strict';


/*
 * DEPENDENCIES
 */

var convert = require('colr-convert');


/*
 * CONSTRUCTOR
 */

function Colr () {
  if ((this instanceof Colr) === false) { return new Colr(); }
  this._ = {};
}


/*
 * STATIC METHODS
 */

Colr.fromHex = function (hex) {
  return (new Colr()).fromHex(hex);
};

Colr.fromGrayscale = function (value) {
  return (new Colr()).fromGrayscale(value);
};

Colr.fromRgb = function (r, g, b) {
  return (new Colr()).fromRgb(r, g, b);
};

Colr.fromRgbArray = function (arr) {
  return (new Colr()).fromRgb(arr[0], arr[1], arr[2]);
};

Colr.fromRgbObject = function (obj) {
  return (new Colr()).fromRgb(obj.r, obj.g, obj.b);
};
Colr.fromHsl = function (h, s, l) {
  return (new Colr()).fromHsl(h, s, l);
};

Colr.fromHslArray = function (arr) {
  return (new Colr()).fromHsl(arr[0], arr[1], arr[2]);
};

Colr.fromHslObject = function (obj) {
  return (new Colr()).fromHsl(obj.h, obj.s, obj.l);
};

Colr.fromHsv = function (h, s, v) {
  return (new Colr()).fromHsv(h, s, v);
};

Colr.fromHsvArray = function (arr) {
  return (new Colr()).fromHsv(arr[0], arr[1], arr[2]);
};

Colr.fromHsvObject = function (obj) {
  return (new Colr()).fromHsv(obj.h, obj.s, obj.v);
};


/*
 * IMPORTERS
 */

// HEX

Colr.prototype.fromHex = function (input) {
  if (names[input]) input = names[input];
  var value = convert.hex.rgb(input);
  this._ = { rgb: value };
  return this;
};

// GRAYSCALE

Colr.prototype.fromGrayscale = function (input) {
  input = clampByte(input);
  var value = convert.grayscale.rgb(input);
  this._ = { rgb: value };
  return this;
};

// RGB

Colr.prototype.fromRgb = function (r, g, b) {
  if (typeof(r) !== 'number' || typeof(g) !== 'number' || typeof(b) !== 'number') {
    throw new Error('Arguments must be numbers');
  }
  var value = clampRgb(r, g, b);
  this._ = { rgb: value };
  return this;
};

Colr.prototype.fromRgbArray = function (arr) {
  return this.fromRgb(arr[0], arr[1], arr[2]);
};

Colr.prototype.fromRgbObject = function (obj) {
  return this.fromRgb(obj.r, obj.g, obj.b);
};

// HSL

Colr.prototype.fromHsl = function (h, s, l) {
  if (typeof(h) !== 'number' || typeof(s) !== 'number' || typeof(l) !== 'number') {
    throw new Error('Arguments must be numbers');
  }
  this._ = { hsl: clampHsx(h, s, l) };
  return this;
};

Colr.prototype.fromHslArray = function (arr) {
  return this.fromHsl(arr[0], arr[1], arr[2]);
};

Colr.prototype.fromHslObject = function (obj) {
  return this.fromHsl(obj.h, obj.s, obj.l);
};

// HSV

Colr.prototype.fromHsv = function (h, s, v) {
  if (typeof(h) !== 'number' || typeof(s) !== 'number' || typeof(v) !== 'number') {
    throw new Error('Arguments must be numbers');
  }
  this._ = { hsv: clampHsx(h, s, v) };
  return this;
};

Colr.prototype.fromHsvArray = function (arr) {
  return this.fromHsv(arr[0], arr[1], arr[2]);
};

Colr.prototype.fromHsvObject = function (obj) {
  return this.fromHsv(obj.h, obj.s, obj.v);
};


/*
 * EXPORTERS
 */

// HEX

Colr.prototype.toHex = function () {
  var cached = this._.hex;
  if (cached !== undefined) { return cached; }

  var input;
  var cachedFrom = this._.rgb;

  if (cachedFrom !== undefined) { input = cachedFrom; }
  else { input = this.toRawRgbArray(); }

  input[0] = Math.round(input[0]);
  input[1] = Math.round(input[1]);
  input[2] = Math.round(input[2]);

  var value = convert.rgb.hex(input);
  this._.hex = value;

  return value;
};

// GRAYSCALE

Colr.prototype.toGrayscale = function () {
  var cached = this._.grayscale;
  if (cached !== undefined) { return cached; }

  var input;
  var cachedFrom = this._.rgb;

  if (cachedFrom !== undefined) { input = cachedFrom; }
  else { input = this.toRawRgbArray(); }

  var value = convert.rgb.grayscale(input);
  this._.grayscale = value;
  return value;
};

// RGB

Colr.prototype.toRawRgbArray = function () {
  var cached = this._.rgb;
  if (cached !== undefined) { return cached; }

  var value;

  if ((value = this._.hsv) !== undefined) {
    value = convert.hsv.rgb(value);
  } else if ((value = this._.hsl) !== undefined) {
    value = convert.hsl.rgb(value);
  } else {
    throw new Error('No data to convert');
  }

  this._.rgb = value;
  return value;
};

Colr.prototype.toRawRgbObject = function () {
  var arr = this.toRawRgbArray();
  return { r: arr[0], g: arr[1], b: arr[2] };
};

Colr.prototype.toRgbArray = function () {
  var arr = this.toRawRgbArray();
  return [ Math.round(arr[0]), Math.round(arr[1]), Math.round(arr[2]) ];
};

Colr.prototype.toRgbObject = function () {
  var arr = this.toRgbArray();
  return { r: arr[0], g: arr[1], b: arr[2] };
};

// HSL

Colr.prototype.toRawHslArray = function () {
  var cached = this._.hsl;
  if (cached !== undefined) { return cached; }

  var value;

  if ((value = this._.hsv) !== undefined) {
    value = convert.hsv.hsl(value);
  } else if ((value = this._.rgb) !== undefined) {
    value = convert.rgb.hsl(value);
  } else {
    throw new Error('No data to convert');
  }

  this._.hsl = value;
  return value;
};

Colr.prototype.toRawHslObject = function () {
  var arr = this.toRawHslArray();
  return { h: arr[0], s: arr[1], l: arr[2] };
};

Colr.prototype.toHslArray = function () {
  var arr = this.toRawHslArray();
  return [ Math.round(arr[0]), Math.round(arr[1]), Math.round(arr[2]) ];
};

Colr.prototype.toHslObject = function () {
  var arr = this.toHslArray();
  return { h: arr[0], s: arr[1], l: arr[2] };
};

// HSV

Colr.prototype.toRawHsvArray = function () {
  var cached = this._.hsv;
  if (cached !== undefined) { return cached; }

  var value;

  if ((value = this._.hsl) !== undefined) {
    value = convert.hsl.hsv(value);
  } else if ((value = this._.rgb) !== undefined) {
    value = convert.rgb.hsv(value);
  } else {
    throw new Error('No data to convert');
  }

  this._.hsv = value;
  return value;
};

Colr.prototype.toRawHsvObject = function () {
  var arr = this.toRawHsvArray();
  return { h: arr[0], s: arr[1], v: arr[2] };
};

Colr.prototype.toHsvArray = function () {
  var arr = this.toRawHsvArray();
  return [ Math.round(arr[0]), Math.round(arr[1]), Math.round(arr[2]) ];
};

Colr.prototype.toHsvObject = function () {
  var arr = this.toHsvArray();
  return { h: arr[0], s: arr[1], v: arr[2] };
};


/*
 * MODIFIERS
 */

Colr.prototype.lighten = function (amount) {
  var hsl = this.toRawHslArray();
  hsl[2] = clampPercentage(hsl[2] + amount);
  this._ = { hsl: hsl };
  return this;
};

Colr.prototype.darken = function (amount) {
  var hsl = this.toRawHslArray();
  hsl[2] = clampPercentage(hsl[2] - amount);
  this._ = { hsl: hsl };
  return this;
};

/*
 * MISC
 */

Colr.prototype.clone = function () {
  var colr = new Colr();
  colr._.hex = this._.hex;
  colr._.grayscale = this._.grayscale;

  if (this._.rgb !== undefined) {
    colr._.rgb = this._.rgb.slice(0);
  }
  if (this._.hsv !== undefined) {
    colr._.hsv = this._.hsv.slice(0);
  }
  if (this._.hsl !== undefined) {
    colr._.hsl = this._.hsl.slice(0);
  }

  return colr;
};

/*
 * UTILS
 */

function clampPercentage (val) {
  return Math.max(Math.min(val, 100), 0);
}

function clampByte (byte) {
  return Math.max(Math.min(byte, 255), 0);
}

function clampRgb (r, g, b) {
  return [
    Math.max(Math.min(r, 255), 0),
    Math.max(Math.min(g, 255), 0),
    Math.max(Math.min(b, 255), 0),
  ];
}

function clampHsx (h, s, x) {
  return [
    Math.max(Math.min(h, 360), 0),
    Math.max(Math.min(s, 100), 0),
    Math.max(Math.min(x, 100), 0),
  ];
}

/*
 * CSS COLOR NAMES
 */

var names = {
  "aliceblue": "#f0f8ff",
  "antiquewhite": "#faebd7",
  "aqua": "#00ffff",
  "aquamarine": "#7fffd4",
  "azure": "#f0ffff",
  "beige": "#f5f5dc",
  "bisque": "#ffe4c4",
  "black": "#000000",
  "blanchedalmond": "#ffebcd",
  "blue": "#0000ff",
  "blueviolet": "#8a2be2",
  "brown": "#a52a2a",
  "burlywood": "#deb887",
  "cadetblue": "#5f9ea0",
  "chartreuse": "#7fff00",
  "chocolate": "#d2691e",
  "coral": "#ff7f50",
  "cornflowerblue": "#6495ed",
  "cornsilk": "#fff8dc",
  "crimson": "#dc143c",
  "cyan": "#00ffff",
  "darkblue": "#00008b",
  "darkcyan": "#008b8b",
  "darkgoldenrod": "#b8860b",
  "darkgray": "#a9a9a9",
  "darkgreen": "#006400",
  "darkgrey": "#a9a9a9",
  "darkkhaki": "#bdb76b",
  "darkmagenta": "#8b008b",
  "darkolivegreen": "#556b2f",
  "darkorange": "#ff8c00",
  "darkorchid": "#9932cc",
  "darkred": "#8b0000",
  "darksalmon": "#e9967a",
  "darkseagreen": "#8fbc8f",
  "darkslateblue": "#483d8b",
  "darkslategray": "#2f4f4f",
  "darkslategrey": "#2f4f4f",
  "darkturquoise": "#00ced1",
  "darkviolet": "#9400d3",
  "deeppink": "#ff1493",
  "deepskyblue": "#00bfff",
  "dimgray": "#696969",
  "dimgrey": "#696969",
  "dodgerblue": "#1e90ff",
  "firebrick": "#b22222",
  "floralwhite": "#fffaf0",
  "forestgreen": "#228b22",
  "fuchsia": "#ff00ff",
  "gainsboro": "#dcdcdc",
  "ghostwhite": "#f8f8ff",
  "gold": "#ffd700",
  "goldenrod": "#daa520",
  "gray": "#808080",
  "green": "#008000",
  "greenyellow": "#adff2f",
  "grey": "#808080",
  "honeydew": "#f0fff0",
  "hotpink": "#ff69b4",
  "indianred": "#cd5c5c",
  "indigo": "#4b0082",
  "ivory": "#fffff0",
  "khaki": "#f0e68c",
  "lavender": "#e6e6fa",
  "lavenderblush": "#fff0f5",
  "lawngreen": "#7cfc00",
  "lemonchiffon": "#fffacd",
  "lightblue": "#add8e6",
  "lightcoral": "#f08080",
  "lightcyan": "#e0ffff",
  "lightgoldenrodyellow": "#fafad2",
  "lightgray": "#d3d3d3",
  "lightgreen": "#90ee90",
  "lightgrey": "#d3d3d3",
  "lightpink": "#ffb6c1",
  "lightsalmon": "#ffa07a",
  "lightseagreen": "#20b2aa",
  "lightskyblue": "#87cefa",
  "lightslategray": "#778899",
  "lightslategrey": "#778899",
  "lightsteelblue": "#b0c4de",
  "lightyellow": "#ffffe0",
  "lime": "#00ff00",
  "limegreen": "#32cd32",
  "linen": "#faf0e6",
  "magenta": "#ff00ff",
  "maroon": "#800000",
  "mediumaquamarine": "#66cdaa",
  "mediumblue": "#0000cd",
  "mediumorchid": "#ba55d3",
  "mediumpurple": "#9370db",
  "mediumseagreen": "#3cb371",
  "mediumslateblue": "#7b68ee",
  "mediumspringgreen": "#00fa9a",
  "mediumturquoise": "#48d1cc",
  "mediumvioletred": "#c71585",
  "midnightblue": "#191970",
  "mintcream": "#f5fffa",
  "mistyrose": "#ffe4e1",
  "moccasin": "#ffe4b5",
  "navajowhite": "#ffdead",
  "navy": "#000080",
  "oldlace": "#fdf5e6",
  "olive": "#808000",
  "olivedrab": "#6b8e23",
  "orange": "#ffa500",
  "orangered": "#ff4500",
  "orchid": "#da70d6",
  "palegoldenrod": "#eee8aa",
  "palegreen": "#98fb98",
  "paleturquoise": "#afeeee",
  "palevioletred": "#db7093",
  "papayawhip": "#ffefd5",
  "peachpuff": "#ffdab9",
  "peru": "#cd853f",
  "pink": "#ffc0cb",
  "plum": "#dda0dd",
  "powderblue": "#b0e0e6",
  "purple": "#800080",
  "rebeccapurple": "#663399",
  "red": "#ff0000",
  "rosybrown": "#bc8f8f",
  "royalblue": "#4169e1",
  "saddlebrown": "#8b4513",
  "salmon": "#fa8072",
  "sandybrown": "#f4a460",
  "seagreen": "#2e8b57",
  "seashell": "#fff5ee",
  "sienna": "#a0522d",
  "silver": "#c0c0c0",
  "skyblue": "#87ceeb",
  "slateblue": "#6a5acd",
  "slategray": "#708090",
  "slategrey": "#708090",
  "snow": "#fffafa",
  "springgreen": "#00ff7f",
  "steelblue": "#4682b4",
  "tan": "#d2b48c",
  "teal": "#008080",
  "thistle": "#d8bfd8",
  "tomato": "#ff6347",
  "turquoise": "#40e0d0",
  "violet": "#ee82ee",
  "wheat": "#f5deb3",
  "white": "#ffffff",
  "whitesmoke": "#f5f5f5",
  "yellow": "#ffff00",
  "yellowgreen": "#9acd32"
};

module.exports = Colr;
