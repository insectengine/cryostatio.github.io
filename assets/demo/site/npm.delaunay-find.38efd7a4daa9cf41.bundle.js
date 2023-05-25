"use strict";(self.webpackChunkcryostat_web=self.webpackChunkcryostat_web||[]).push([[5525],{33759:(__unused_webpack_module,exports,__webpack_require__)=>{eval('var __webpack_unused_export__;\n\n\n__webpack_unused_export__ = true;\nexports.Z = void 0;\n\nvar _delaunator = _interopRequireDefault(__webpack_require__(88030));\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }\n\n// From https://github.com/d3/d3-delaunay/blob/master/src/delaunay.js\nfunction pointX(p) {\n  return p[0];\n}\n\nfunction pointY(p) {\n  return p[1];\n} // A triangulation is collinear if all its triangles have a non-null area\n\n\nfunction collinear(d) {\n  var triangles = d.triangles,\n      coords = d.coords;\n\n  for (var i = 0; i < triangles.length; i += 3) {\n    var a = 2 * triangles[i];\n    var b = 2 * triangles[i + 1];\n    var c = 2 * triangles[i + 2];\n    var cross = (coords[c] - coords[a]) * (coords[b + 1] - coords[a + 1]) - (coords[b] - coords[a]) * (coords[c + 1] - coords[a + 1]); // eslint-disable-next-line no-magic-numbers\n\n    if (cross > 1e-10) {\n      return false;\n    }\n  }\n\n  return true;\n}\n\nfunction jitter(x, y, r) {\n  return [x + Math.sin(x + y) * r, y + Math.cos(x - y) * r];\n} // eslint-disable-next-line max-params\n\n\nfunction flatArray(points, fx, fy, that) {\n  var n = points.length;\n  var array = new Float64Array(n * 2);\n\n  for (var i = 0; i < n; ++i) {\n    var p = points[i];\n    array[i * 2] = fx.call(that, p, i, points);\n    array[i * 2 + 1] = fy.call(that, p, i, points);\n  }\n\n  return array;\n}\n\nvar Delaunay =\n/*#__PURE__*/\nfunction () {\n  function Delaunay(points) {\n    var delaunator = new _delaunator["default"](points);\n    this.inedges = new Int32Array(points.length / 2);\n    this._hullIndex = new Int32Array(points.length / 2);\n    this.points = delaunator.coords;\n\n    this._init(delaunator);\n  } // eslint-disable-next-line max-statements, complexity\n\n\n  var _proto = Delaunay.prototype;\n\n  _proto._init = function _init(delaunator) {\n    var d = delaunator;\n    var points = this.points; // check for collinear\n    // eslint-disable-next-line no-magic-numbers\n\n    if (d.hull && d.hull.length > 2 && collinear(d)) {\n      this.collinear = Int32Array.from({\n        length: points.length / 2\n      }, function (_, i) {\n        return i;\n      }).sort(function (i, j) {\n        return points[2 * i] - points[2 * j] || points[2 * i + 1] - points[2 * j + 1];\n      }); // for exact neighbors\n\n      var e = this.collinear[0];\n      var f = this.collinear[this.collinear.length - 1];\n      var bounds = [points[2 * e], points[2 * e + 1], points[2 * f], points[2 * f + 1]];\n      var r = 1e-8 * // eslint-disable-line no-magic-numbers\n      Math.sqrt(Math.pow(bounds[3] - bounds[1], 2) + Math.pow(bounds[2] - bounds[0], 2));\n\n      for (var i = 0, n = points.length / 2; i < n; ++i) {\n        var p = jitter(points[2 * i], points[2 * i + 1], r);\n        points[2 * i] = p[0];\n        points[2 * i + 1] = p[1];\n      }\n\n      delaunator = new _delaunator["default"](points);\n    }\n\n    var halfedges = this.halfedges = delaunator.halfedges;\n    var hull = this.hull = delaunator.hull;\n    var triangles = this.triangles = delaunator.triangles;\n    var inedges = this.inedges.fill(-1);\n\n    var hullIndex = this._hullIndex.fill(-1); // Compute an index from each point to an (arbitrary) incoming halfedge\n    // Used to give the first neighbor of each point; for this reason,\n    // on the hull we give priority to exterior halfedges\n\n\n    for (var _e = 0, _n = halfedges.length; _e < _n; ++_e) {\n      var _p = triangles[_e % 3 === 2 ? _e - 2 : _e + 1];\n      if (halfedges[_e] === -1 || inedges[_p] === -1) inedges[_p] = _e;\n    }\n\n    for (var _i = 0, _n2 = hull.length; _i < _n2; ++_i) {\n      hullIndex[hull[_i]] = _i;\n    } // degenerate case: 1 or 2 (distinct) points\n\n\n    if (hull.length <= 2 && hull.length > 0) {\n      this.triangles = new Int32Array(3).fill(-1);\n      this.halfedges = new Int32Array(3).fill(-1);\n      this.triangles[0] = hull[0];\n      this.triangles[1] = hull[1];\n      this.triangles[2] = hull[1];\n      inedges[hull[0]] = 1;\n      if (hull.length === 2) inedges[hull[1]] = 0;\n    }\n  } // eslint-disable-next-line max-statements\n  ;\n\n  _proto.neighbors = function neighbors(i) {\n    var results = [];\n    var inedges = this.inedges,\n        hull = this.hull,\n        _hullIndex = this._hullIndex,\n        halfedges = this.halfedges,\n        triangles = this.triangles;\n    var e0 = inedges[i];\n    if (e0 === -1) return results; // coincident point\n\n    var e = e0;\n    var p0 = -1;\n\n    do {\n      p0 = triangles[e];\n      results.push(p0);\n      e = e % 3 === 2 ? e - 2 : e + 1;\n      if (triangles[e] !== i) break; // bad triangulation\n\n      e = halfedges[e];\n\n      if (e === -1) {\n        var p = hull[(_hullIndex[i] + 1) % hull.length];\n        if (p !== p0) results.push(p);\n        break;\n      }\n    } while (e !== e0);\n\n    return results;\n  };\n\n  _proto.find = function find(x, y, i) {\n    if (i === void 0) {\n      i = 0;\n    }\n\n    // eslint-disable-next-line no-self-compare\n    if ((x = +x, x !== x) || (y = +y, y !== y)) return -1;\n    var i0 = i;\n    var c;\n\n    while ((c = this._step(i, x, y)) >= 0 && c !== i && c !== i0) {\n      i = c;\n    }\n\n    return c;\n  };\n\n  _proto._step = function _step(i, x, y) {\n    var inedges = this.inedges,\n        points = this.points;\n    if (inedges[i] === -1 || !points.length) return (i + 1) % (points.length >> 1);\n    var c = i;\n    var dc = Math.pow(x - points[i * 2], 2) + Math.pow(y - points[i * 2 + 1], 2);\n\n    for (var _iterator = this.neighbors(i), _isArray = Array.isArray(_iterator), _i2 = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {\n      var _ref;\n\n      if (_isArray) {\n        if (_i2 >= _iterator.length) break;\n        _ref = _iterator[_i2++];\n      } else {\n        _i2 = _iterator.next();\n        if (_i2.done) break;\n        _ref = _i2.value;\n      }\n\n      var t = _ref;\n      var dt = Math.pow(x - points[t * 2], 2) + Math.pow(y - points[t * 2 + 1], 2);\n\n      if (dt < dc) {\n        dc = dt;\n        c = t;\n      }\n    }\n\n    return c;\n  };\n\n  return Delaunay;\n}(); // eslint-disable-next-line max-params\n\n\nexports.Z = Delaunay;\n\nDelaunay.from = function (points, fx, fy, that) {\n  if (fx === void 0) {\n    fx = pointX;\n  }\n\n  if (fy === void 0) {\n    fy = pointY;\n  }\n\n  return new Delaunay(flatArray(points, fx, fy, that));\n}; // only public methods will be .from and .find//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMzM3NTkuanMiLCJtYXBwaW5ncyI6IjtBQUFhOztBQUViLHlCQUFrQjtBQUNsQixTQUFrQjs7QUFFbEIseUNBQXlDLG1CQUFPLENBQUMsS0FBMEI7O0FBRTNFLHVDQUF1Qyx1Q0FBdUM7O0FBRTlFO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxFQUFFOzs7QUFHRjtBQUNBO0FBQ0E7O0FBRUEsa0JBQWtCLHNCQUFzQjtBQUN4QztBQUNBO0FBQ0E7QUFDQSx1SUFBdUk7O0FBRXZJO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEVBQUU7OztBQUdGO0FBQ0E7QUFDQTs7QUFFQSxrQkFBa0IsT0FBTztBQUN6QjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxJQUFJOzs7QUFHSjs7QUFFQTtBQUNBO0FBQ0EsOEJBQThCO0FBQzlCOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBLE9BQU87QUFDUDtBQUNBLE9BQU8sR0FBRzs7QUFFVjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLDZDQUE2QyxPQUFPO0FBQ3BEO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsOENBQThDO0FBQzlDLHNEQUFzRDtBQUN0RDs7O0FBR0EsNENBQTRDLFNBQVM7QUFDckQ7QUFDQTtBQUNBOztBQUVBLHdDQUF3QyxVQUFVO0FBQ2xEO0FBQ0EsTUFBTTs7O0FBR047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBbUM7O0FBRW5DO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQ0FBcUM7O0FBRXJDOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNOztBQUVOO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLDJKQUEySjtBQUMzSjs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxDQUFDLElBQUk7OztBQUdMLFNBQWtCOztBQUVsQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxHQUFHIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vY3J5b3N0YXQtd2ViLy4vbm9kZV9tb2R1bGVzL2RlbGF1bmF5LWZpbmQvbGliL2luZGV4LmpzP2I5ZjUiXSwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IHZvaWQgMDtcblxudmFyIF9kZWxhdW5hdG9yID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChyZXF1aXJlKFwiZGVsYXVuYXRvci9kZWxhdW5hdG9yLmpzXCIpKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgXCJkZWZhdWx0XCI6IG9iaiB9OyB9XG5cbi8vIEZyb20gaHR0cHM6Ly9naXRodWIuY29tL2QzL2QzLWRlbGF1bmF5L2Jsb2IvbWFzdGVyL3NyYy9kZWxhdW5heS5qc1xuZnVuY3Rpb24gcG9pbnRYKHApIHtcbiAgcmV0dXJuIHBbMF07XG59XG5cbmZ1bmN0aW9uIHBvaW50WShwKSB7XG4gIHJldHVybiBwWzFdO1xufSAvLyBBIHRyaWFuZ3VsYXRpb24gaXMgY29sbGluZWFyIGlmIGFsbCBpdHMgdHJpYW5nbGVzIGhhdmUgYSBub24tbnVsbCBhcmVhXG5cblxuZnVuY3Rpb24gY29sbGluZWFyKGQpIHtcbiAgdmFyIHRyaWFuZ2xlcyA9IGQudHJpYW5nbGVzLFxuICAgICAgY29vcmRzID0gZC5jb29yZHM7XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCB0cmlhbmdsZXMubGVuZ3RoOyBpICs9IDMpIHtcbiAgICB2YXIgYSA9IDIgKiB0cmlhbmdsZXNbaV07XG4gICAgdmFyIGIgPSAyICogdHJpYW5nbGVzW2kgKyAxXTtcbiAgICB2YXIgYyA9IDIgKiB0cmlhbmdsZXNbaSArIDJdO1xuICAgIHZhciBjcm9zcyA9IChjb29yZHNbY10gLSBjb29yZHNbYV0pICogKGNvb3Jkc1tiICsgMV0gLSBjb29yZHNbYSArIDFdKSAtIChjb29yZHNbYl0gLSBjb29yZHNbYV0pICogKGNvb3Jkc1tjICsgMV0gLSBjb29yZHNbYSArIDFdKTsgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLW1hZ2ljLW51bWJlcnNcblxuICAgIGlmIChjcm9zcyA+IDFlLTEwKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59XG5cbmZ1bmN0aW9uIGppdHRlcih4LCB5LCByKSB7XG4gIHJldHVybiBbeCArIE1hdGguc2luKHggKyB5KSAqIHIsIHkgKyBNYXRoLmNvcyh4IC0geSkgKiByXTtcbn0gLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG1heC1wYXJhbXNcblxuXG5mdW5jdGlvbiBmbGF0QXJyYXkocG9pbnRzLCBmeCwgZnksIHRoYXQpIHtcbiAgdmFyIG4gPSBwb2ludHMubGVuZ3RoO1xuICB2YXIgYXJyYXkgPSBuZXcgRmxvYXQ2NEFycmF5KG4gKiAyKTtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IG47ICsraSkge1xuICAgIHZhciBwID0gcG9pbnRzW2ldO1xuICAgIGFycmF5W2kgKiAyXSA9IGZ4LmNhbGwodGhhdCwgcCwgaSwgcG9pbnRzKTtcbiAgICBhcnJheVtpICogMiArIDFdID0gZnkuY2FsbCh0aGF0LCBwLCBpLCBwb2ludHMpO1xuICB9XG5cbiAgcmV0dXJuIGFycmF5O1xufVxuXG52YXIgRGVsYXVuYXkgPVxuLyojX19QVVJFX18qL1xuZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBEZWxhdW5heShwb2ludHMpIHtcbiAgICB2YXIgZGVsYXVuYXRvciA9IG5ldyBfZGVsYXVuYXRvcltcImRlZmF1bHRcIl0ocG9pbnRzKTtcbiAgICB0aGlzLmluZWRnZXMgPSBuZXcgSW50MzJBcnJheShwb2ludHMubGVuZ3RoIC8gMik7XG4gICAgdGhpcy5faHVsbEluZGV4ID0gbmV3IEludDMyQXJyYXkocG9pbnRzLmxlbmd0aCAvIDIpO1xuICAgIHRoaXMucG9pbnRzID0gZGVsYXVuYXRvci5jb29yZHM7XG5cbiAgICB0aGlzLl9pbml0KGRlbGF1bmF0b3IpO1xuICB9IC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBtYXgtc3RhdGVtZW50cywgY29tcGxleGl0eVxuXG5cbiAgdmFyIF9wcm90byA9IERlbGF1bmF5LnByb3RvdHlwZTtcblxuICBfcHJvdG8uX2luaXQgPSBmdW5jdGlvbiBfaW5pdChkZWxhdW5hdG9yKSB7XG4gICAgdmFyIGQgPSBkZWxhdW5hdG9yO1xuICAgIHZhciBwb2ludHMgPSB0aGlzLnBvaW50czsgLy8gY2hlY2sgZm9yIGNvbGxpbmVhclxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1tYWdpYy1udW1iZXJzXG5cbiAgICBpZiAoZC5odWxsICYmIGQuaHVsbC5sZW5ndGggPiAyICYmIGNvbGxpbmVhcihkKSkge1xuICAgICAgdGhpcy5jb2xsaW5lYXIgPSBJbnQzMkFycmF5LmZyb20oe1xuICAgICAgICBsZW5ndGg6IHBvaW50cy5sZW5ndGggLyAyXG4gICAgICB9LCBmdW5jdGlvbiAoXywgaSkge1xuICAgICAgICByZXR1cm4gaTtcbiAgICAgIH0pLnNvcnQoZnVuY3Rpb24gKGksIGopIHtcbiAgICAgICAgcmV0dXJuIHBvaW50c1syICogaV0gLSBwb2ludHNbMiAqIGpdIHx8IHBvaW50c1syICogaSArIDFdIC0gcG9pbnRzWzIgKiBqICsgMV07XG4gICAgICB9KTsgLy8gZm9yIGV4YWN0IG5laWdoYm9yc1xuXG4gICAgICB2YXIgZSA9IHRoaXMuY29sbGluZWFyWzBdO1xuICAgICAgdmFyIGYgPSB0aGlzLmNvbGxpbmVhclt0aGlzLmNvbGxpbmVhci5sZW5ndGggLSAxXTtcbiAgICAgIHZhciBib3VuZHMgPSBbcG9pbnRzWzIgKiBlXSwgcG9pbnRzWzIgKiBlICsgMV0sIHBvaW50c1syICogZl0sIHBvaW50c1syICogZiArIDFdXTtcbiAgICAgIHZhciByID0gMWUtOCAqIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tbWFnaWMtbnVtYmVyc1xuICAgICAgTWF0aC5zcXJ0KE1hdGgucG93KGJvdW5kc1szXSAtIGJvdW5kc1sxXSwgMikgKyBNYXRoLnBvdyhib3VuZHNbMl0gLSBib3VuZHNbMF0sIDIpKTtcblxuICAgICAgZm9yICh2YXIgaSA9IDAsIG4gPSBwb2ludHMubGVuZ3RoIC8gMjsgaSA8IG47ICsraSkge1xuICAgICAgICB2YXIgcCA9IGppdHRlcihwb2ludHNbMiAqIGldLCBwb2ludHNbMiAqIGkgKyAxXSwgcik7XG4gICAgICAgIHBvaW50c1syICogaV0gPSBwWzBdO1xuICAgICAgICBwb2ludHNbMiAqIGkgKyAxXSA9IHBbMV07XG4gICAgICB9XG5cbiAgICAgIGRlbGF1bmF0b3IgPSBuZXcgX2RlbGF1bmF0b3JbXCJkZWZhdWx0XCJdKHBvaW50cyk7XG4gICAgfVxuXG4gICAgdmFyIGhhbGZlZGdlcyA9IHRoaXMuaGFsZmVkZ2VzID0gZGVsYXVuYXRvci5oYWxmZWRnZXM7XG4gICAgdmFyIGh1bGwgPSB0aGlzLmh1bGwgPSBkZWxhdW5hdG9yLmh1bGw7XG4gICAgdmFyIHRyaWFuZ2xlcyA9IHRoaXMudHJpYW5nbGVzID0gZGVsYXVuYXRvci50cmlhbmdsZXM7XG4gICAgdmFyIGluZWRnZXMgPSB0aGlzLmluZWRnZXMuZmlsbCgtMSk7XG5cbiAgICB2YXIgaHVsbEluZGV4ID0gdGhpcy5faHVsbEluZGV4LmZpbGwoLTEpOyAvLyBDb21wdXRlIGFuIGluZGV4IGZyb20gZWFjaCBwb2ludCB0byBhbiAoYXJiaXRyYXJ5KSBpbmNvbWluZyBoYWxmZWRnZVxuICAgIC8vIFVzZWQgdG8gZ2l2ZSB0aGUgZmlyc3QgbmVpZ2hib3Igb2YgZWFjaCBwb2ludDsgZm9yIHRoaXMgcmVhc29uLFxuICAgIC8vIG9uIHRoZSBodWxsIHdlIGdpdmUgcHJpb3JpdHkgdG8gZXh0ZXJpb3IgaGFsZmVkZ2VzXG5cblxuICAgIGZvciAodmFyIF9lID0gMCwgX24gPSBoYWxmZWRnZXMubGVuZ3RoOyBfZSA8IF9uOyArK19lKSB7XG4gICAgICB2YXIgX3AgPSB0cmlhbmdsZXNbX2UgJSAzID09PSAyID8gX2UgLSAyIDogX2UgKyAxXTtcbiAgICAgIGlmIChoYWxmZWRnZXNbX2VdID09PSAtMSB8fCBpbmVkZ2VzW19wXSA9PT0gLTEpIGluZWRnZXNbX3BdID0gX2U7XG4gICAgfVxuXG4gICAgZm9yICh2YXIgX2kgPSAwLCBfbjIgPSBodWxsLmxlbmd0aDsgX2kgPCBfbjI7ICsrX2kpIHtcbiAgICAgIGh1bGxJbmRleFtodWxsW19pXV0gPSBfaTtcbiAgICB9IC8vIGRlZ2VuZXJhdGUgY2FzZTogMSBvciAyIChkaXN0aW5jdCkgcG9pbnRzXG5cblxuICAgIGlmIChodWxsLmxlbmd0aCA8PSAyICYmIGh1bGwubGVuZ3RoID4gMCkge1xuICAgICAgdGhpcy50cmlhbmdsZXMgPSBuZXcgSW50MzJBcnJheSgzKS5maWxsKC0xKTtcbiAgICAgIHRoaXMuaGFsZmVkZ2VzID0gbmV3IEludDMyQXJyYXkoMykuZmlsbCgtMSk7XG4gICAgICB0aGlzLnRyaWFuZ2xlc1swXSA9IGh1bGxbMF07XG4gICAgICB0aGlzLnRyaWFuZ2xlc1sxXSA9IGh1bGxbMV07XG4gICAgICB0aGlzLnRyaWFuZ2xlc1syXSA9IGh1bGxbMV07XG4gICAgICBpbmVkZ2VzW2h1bGxbMF1dID0gMTtcbiAgICAgIGlmIChodWxsLmxlbmd0aCA9PT0gMikgaW5lZGdlc1todWxsWzFdXSA9IDA7XG4gICAgfVxuICB9IC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBtYXgtc3RhdGVtZW50c1xuICA7XG5cbiAgX3Byb3RvLm5laWdoYm9ycyA9IGZ1bmN0aW9uIG5laWdoYm9ycyhpKSB7XG4gICAgdmFyIHJlc3VsdHMgPSBbXTtcbiAgICB2YXIgaW5lZGdlcyA9IHRoaXMuaW5lZGdlcyxcbiAgICAgICAgaHVsbCA9IHRoaXMuaHVsbCxcbiAgICAgICAgX2h1bGxJbmRleCA9IHRoaXMuX2h1bGxJbmRleCxcbiAgICAgICAgaGFsZmVkZ2VzID0gdGhpcy5oYWxmZWRnZXMsXG4gICAgICAgIHRyaWFuZ2xlcyA9IHRoaXMudHJpYW5nbGVzO1xuICAgIHZhciBlMCA9IGluZWRnZXNbaV07XG4gICAgaWYgKGUwID09PSAtMSkgcmV0dXJuIHJlc3VsdHM7IC8vIGNvaW5jaWRlbnQgcG9pbnRcblxuICAgIHZhciBlID0gZTA7XG4gICAgdmFyIHAwID0gLTE7XG5cbiAgICBkbyB7XG4gICAgICBwMCA9IHRyaWFuZ2xlc1tlXTtcbiAgICAgIHJlc3VsdHMucHVzaChwMCk7XG4gICAgICBlID0gZSAlIDMgPT09IDIgPyBlIC0gMiA6IGUgKyAxO1xuICAgICAgaWYgKHRyaWFuZ2xlc1tlXSAhPT0gaSkgYnJlYWs7IC8vIGJhZCB0cmlhbmd1bGF0aW9uXG5cbiAgICAgIGUgPSBoYWxmZWRnZXNbZV07XG5cbiAgICAgIGlmIChlID09PSAtMSkge1xuICAgICAgICB2YXIgcCA9IGh1bGxbKF9odWxsSW5kZXhbaV0gKyAxKSAlIGh1bGwubGVuZ3RoXTtcbiAgICAgICAgaWYgKHAgIT09IHAwKSByZXN1bHRzLnB1c2gocCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH0gd2hpbGUgKGUgIT09IGUwKTtcblxuICAgIHJldHVybiByZXN1bHRzO1xuICB9O1xuXG4gIF9wcm90by5maW5kID0gZnVuY3Rpb24gZmluZCh4LCB5LCBpKSB7XG4gICAgaWYgKGkgPT09IHZvaWQgMCkge1xuICAgICAgaSA9IDA7XG4gICAgfVxuXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXNlbGYtY29tcGFyZVxuICAgIGlmICgoeCA9ICt4LCB4ICE9PSB4KSB8fCAoeSA9ICt5LCB5ICE9PSB5KSkgcmV0dXJuIC0xO1xuICAgIHZhciBpMCA9IGk7XG4gICAgdmFyIGM7XG5cbiAgICB3aGlsZSAoKGMgPSB0aGlzLl9zdGVwKGksIHgsIHkpKSA+PSAwICYmIGMgIT09IGkgJiYgYyAhPT0gaTApIHtcbiAgICAgIGkgPSBjO1xuICAgIH1cblxuICAgIHJldHVybiBjO1xuICB9O1xuXG4gIF9wcm90by5fc3RlcCA9IGZ1bmN0aW9uIF9zdGVwKGksIHgsIHkpIHtcbiAgICB2YXIgaW5lZGdlcyA9IHRoaXMuaW5lZGdlcyxcbiAgICAgICAgcG9pbnRzID0gdGhpcy5wb2ludHM7XG4gICAgaWYgKGluZWRnZXNbaV0gPT09IC0xIHx8ICFwb2ludHMubGVuZ3RoKSByZXR1cm4gKGkgKyAxKSAlIChwb2ludHMubGVuZ3RoID4+IDEpO1xuICAgIHZhciBjID0gaTtcbiAgICB2YXIgZGMgPSBNYXRoLnBvdyh4IC0gcG9pbnRzW2kgKiAyXSwgMikgKyBNYXRoLnBvdyh5IC0gcG9pbnRzW2kgKiAyICsgMV0sIDIpO1xuXG4gICAgZm9yICh2YXIgX2l0ZXJhdG9yID0gdGhpcy5uZWlnaGJvcnMoaSksIF9pc0FycmF5ID0gQXJyYXkuaXNBcnJheShfaXRlcmF0b3IpLCBfaTIgPSAwLCBfaXRlcmF0b3IgPSBfaXNBcnJheSA/IF9pdGVyYXRvciA6IF9pdGVyYXRvcltTeW1ib2wuaXRlcmF0b3JdKCk7Oykge1xuICAgICAgdmFyIF9yZWY7XG5cbiAgICAgIGlmIChfaXNBcnJheSkge1xuICAgICAgICBpZiAoX2kyID49IF9pdGVyYXRvci5sZW5ndGgpIGJyZWFrO1xuICAgICAgICBfcmVmID0gX2l0ZXJhdG9yW19pMisrXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIF9pMiA9IF9pdGVyYXRvci5uZXh0KCk7XG4gICAgICAgIGlmIChfaTIuZG9uZSkgYnJlYWs7XG4gICAgICAgIF9yZWYgPSBfaTIudmFsdWU7XG4gICAgICB9XG5cbiAgICAgIHZhciB0ID0gX3JlZjtcbiAgICAgIHZhciBkdCA9IE1hdGgucG93KHggLSBwb2ludHNbdCAqIDJdLCAyKSArIE1hdGgucG93KHkgLSBwb2ludHNbdCAqIDIgKyAxXSwgMik7XG5cbiAgICAgIGlmIChkdCA8IGRjKSB7XG4gICAgICAgIGRjID0gZHQ7XG4gICAgICAgIGMgPSB0O1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBjO1xuICB9O1xuXG4gIHJldHVybiBEZWxhdW5heTtcbn0oKTsgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG1heC1wYXJhbXNcblxuXG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IERlbGF1bmF5O1xuXG5EZWxhdW5heS5mcm9tID0gZnVuY3Rpb24gKHBvaW50cywgZngsIGZ5LCB0aGF0KSB7XG4gIGlmIChmeCA9PT0gdm9pZCAwKSB7XG4gICAgZnggPSBwb2ludFg7XG4gIH1cblxuICBpZiAoZnkgPT09IHZvaWQgMCkge1xuICAgIGZ5ID0gcG9pbnRZO1xuICB9XG5cbiAgcmV0dXJuIG5ldyBEZWxhdW5heShmbGF0QXJyYXkocG9pbnRzLCBmeCwgZnksIHRoYXQpKTtcbn07IC8vIG9ubHkgcHVibGljIG1ldGhvZHMgd2lsbCBiZSAuZnJvbSBhbmQgLmZpbmQiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///33759\n')}}]);