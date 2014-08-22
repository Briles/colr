(function () {
  'use strict';

  /*
  * CONSTRUCTOR
  */

  var Colr = function () {
    this.r = this.b = this.g = 0;
  };


  /*
  * STATIC METHODS
  */

  Colr.fromHex = function (hex) {
    return (new Colr()).fromHex(hex);
  };

  Colr.fromRgb = function (r, g, b) {
    return (new Colr()).fromRgb(r, g, b);
  };

  Colr.fromRgbArray = function (arr) {
    return (new Colr()).fromRgbArray(arr);
  };

  Colr.fromRgbObject = function (obj) {
    return (new Colr()).fromRgbObject(obj);
  };

  Colr.fromGrayscale = function (value) {
    return (new Colr()).fromGrayscale(value);
  };

  Colr.fromHsl = function (h, s, l) {
    return (new Colr()).fromHsl(h, s, l);
  };

  Colr.fromHslArray = function (arr) {
    return (new Colr()).fromHslArray(arr);
  };

  Colr.fromHslObject = function (obj) {
    return (new Colr()).fromHslObject(obj);
  };


  /*
  * IMPORTERS
  */

  // HEX

  Colr.prototype.fromHex = function (hex) {
    if (typeof hex !== 'string') {
      throw new Error('colr.fromHex: requires string');
    }
    if (hex[0] === '#') {
      hex = hex.slice(1);
    }
    if (! hex.match(/^[0-9a-f]*$/i)) {
      throw new Error('colr.fromHex: invalid hex characters');
    }
    if (hex.length >= 6) {
      this.r = parseInt(hex.slice(0,2), 16);
      this.g = parseInt(hex.slice(2,4), 16);
      this.b = parseInt(hex.slice(4,6), 16);
    } else if (hex.length >= 3){
      this.r = parseInt(hex[0] + hex[0], 16);
      this.g = parseInt(hex[1] + hex[1], 16);
      this.b = parseInt(hex[2] + hex[2], 16);
    } else {
      throw new Error('colr.fromHex: invalid hex length');
    }
    this._sanitize();
    return this;
  };

  // RGB

  Colr.prototype.fromRgb = function (r, g, b) {
    if (typeof r != 'number' || typeof g != 'number' || typeof b != 'number') {
      throw new Error('colr.fromRgb requires three numbers');
    }
    this.r = r;
    this.g = g;
    this.b = b;
    this._sanitize();
    return this;
  };

  Colr.prototype.fromRgbArray = function (arr) {
    return this.fromRgb.apply(this, arr);
  };

  Colr.prototype.fromRgbObject = function (obj) {
    return this.fromRgb(obj.r, obj.g, obj.b);
  };

  // GRAYSCALE
  
  Colr.prototype.fromGrayscale = function (value) {
    if (typeof value != 'number') {
      throw new Error('colr.fromGrayscale requires a number');
    }
    this.r = value;
    this.g = value;
    this.b = value;
    this._sanitize();
    return this;
  };

  // HSL

  Colr.prototype.fromHsl = function (h, s, l) {
    if (typeof h != 'number' || typeof s != 'number' || typeof l != 'number') {
      throw new Error('colr.fromHsl requires three numbers');
    }

    var r, g, b;

    // clamp values: 0-360 (hue) and 0-100 (saturation and lightness)
    h = Math.max(0, Math.min(360, h)) / 360;
    s = Math.max(0, Math.min(100, s)) / 100;
    l = Math.max(0, Math.min(100, l)) / 100;

    // following code is from tinycolor
    // github.com/bgrins/TinyColor

    function hue2rgb(p, q, t) {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
    }

    if (s === 0) {
        r = g = b = l; // achromatic
    } else {
        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    this.r = r * 255;
    this.g = g * 255;
    this.b = b * 255;
    this._sanitize();
    return this;
  };

  Colr.prototype.fromHslArray = function (arr) {
    return this.fromHsl.apply(this, arr);
  };

  Colr.prototype.fromHslObject = function (obj) {
    return this.fromHsl(obj.h, obj.s, obj.l);
  };


  /*
  * EXPORTERS
  */

  // HEX

  Colr.prototype.toHex = function () {
    var r = this.r.toString(16);
    var g = this.g.toString(16);
    var b = this.b.toString(16);
    if (r.length < 2) r = '0' + r;
    if (g.length < 2) g = '0' + g;
    if (b.length < 2) b = '0' + b;
    return ('#' + r + g + b).toUpperCase();
  };

  // RGB

  Colr.prototype.toRgbArray = function () {
    return [ this.r, this.g, this.b ];
  };

  Colr.prototype.toRgbObject = function () {
    return {
      r: this.r,
      g: this.g,
      b: this.b,
    };
  };

  // GRAYSCALE

  Colr.prototype.toGrayscale = function () {
    return (this.r * 299 + this.g * 587 + this.b * 114) / 1000;
  };

  // HSL

  Colr.prototype.toHslArray = function () {
    var r = this.r / 255;
    var g = this.g / 255;
    var b = this.b / 255;

    // following code is from tinycolor
    // github.com/bgrins/TinyColor

    var max = Math.max(r, g, b);
    var min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0; // achromatic
    } else {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch(max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return [h * 360, s * 100, l * 100];
  };

  Colr.prototype.toHslObject = function () {
    var hsl = this.toHslArray();
    return { h: hsl[0], s: hsl[1], l: hsl[2] };
  };


  /*
  * MODIFIERS
  */

  Colr.prototype.lighten = function (amount) {
    var hsl = this.toHslObject();
    hsl.l += amount;
    this.fromHslObject(hsl);
    return this;
  };

  Colr.prototype.darken = function (amount) {
    var hsl = this.toHslObject();
    hsl.l -= amount;
    this.fromHslObject(hsl);
    return this;
  };

  /*
  * MISC
  */

  Colr.prototype.clone = function () {
    var colr = new Colr();
    colr.fromRgbArray(this.toRgbArray());
    return colr;
  };

  Colr.prototype._sanitize = function () {
    this.r = Math.max(0, Math.min(255, Math.round(this.r)));
    this.g = Math.max(0, Math.min(255, Math.round(this.g)));
    this.b = Math.max(0, Math.min(255, Math.round(this.b)));
  };

  module.exports = Colr;

}());