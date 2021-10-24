/******/ (function(modules) {
  // webpackBootstrap
  /******/ // The module cache
  /******/ var installedModules = {}; // The require function
  /******/
  /******/ /******/ function __webpack_require__(moduleId) {
    /******/
    /******/ // Check if module is in cache
    /******/ if (installedModules[moduleId])
      /******/ return installedModules[moduleId].exports; // Create a new module (and put it into the cache)
    /******/
    /******/ /******/ var module = (installedModules[moduleId] = {
      /******/ exports: {},
      /******/ id: moduleId,
      /******/ loaded: false
      /******/
    }); // Execute the module function
    /******/
    /******/ /******/ modules[moduleId].call(
      module.exports,
      module,
      module.exports,
      __webpack_require__
    ); // Flag the module as loaded
    /******/
    /******/ /******/ module.loaded = true; // Return the exports of the module
    /******/
    /******/ /******/ return module.exports;
    /******/
  } // expose the modules object (__webpack_modules__)
  /******/
  /******/
  /******/ /******/ __webpack_require__.m = modules; // expose the module cache
  /******/
  /******/ /******/ __webpack_require__.c = installedModules; // __webpack_public_path__
  /******/
  /******/ /******/ __webpack_require__.p = ""; // Load entry module and return exports
  /******/
  /******/ /******/ return __webpack_require__(0);
  /******/
})(
  /************************************************************************/
  /******/ [
    /* 0 */
    /*!**********************************!*\
  !*** ./src/DagHighchartsConf.js ***!
  \**********************************/
    /***/ function(module, exports, __webpack_require__) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true
      });

      var _highcharts = __webpack_require__(/*! highcharts */ 1);

      var _highcharts2 = _interopRequireDefault(_highcharts);

      var _numeral = __webpack_require__(/*! numeral */ 2);

      var _numeral2 = _interopRequireDefault(_numeral);

      var _lodash = __webpack_require__(/*! lodash */ 3);

      var _lodash2 = _interopRequireDefault(_lodash);

      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }

      /* Default formatter, enhanced with numeral + formatTemplate 
	self: this context
	value: numeric value
	formatNumeral: NumeralJS format string
	formatTemplate: Numberformat template {point, val, numeral}
	callBack: Function called if no formatTemplate. function(formattedValue)
	*/
      var _formatter = function _formatter(
        self,
        value,
        formatNumeral,
        formatTemplate,
        callBack
      ) {
        if (formatNumeral) {
          value = (0, _numeral2.default)(value).format(formatNumeral);
        }
        if (formatTemplate) {
          var pointFormatTemplate = _lodash2.default.template(formatTemplate);
          return pointFormatTemplate({
            point: self,
            self: self,
            val: value,
            value: value,
            numeral: _numeral2.default
          });
        }
        if (callBack) {
          return callBack(value);
        }
        return value;
      };

      var axisFormatter = function axisFormatter() {
        //If formatNumeral exists, use numeralJS
        var value = this.value;
        var formatNumeral = this.axis.options.labels.formatNumeral;
        var formatTemplate = this.axis.options.labels.formatTemplate;
        if (formatNumeral || formatTemplate) {
          return _formatter(this, value, formatNumeral, formatTemplate);
        }
        return this.axis.defaultLabelFormatter.call(this);
      };

      /* Adds DAG default configuration to Highcharts */
      var DagHighchartsConf = {
        plotOptions: {
          series: {
            dataLabels: {
              formatter: function formatter() {
                var value = this.y;
                var fNum = this.series.options.dataLabels.formatNumeral;
                var fTmp = this.series.options.dataLabels.formatTemplate;
                if (fNum || fTmp) {
                  return _formatter(this, value, fNum, fTmp);
                }
                return this.y;
              }
            }
          }
        },
        tooltip: {
          pointFormatter: function pointFormatter() {
            var val = this.y;
            //If formatNumeral exists, use numeralJS
            if (this.series.options.dataLabels.formatNumeral) {
              val = (0, _numeral2.default)(val).format(
                this.series.options.dataLabels.formatNumeral
              );
            }
            if (this.series.chart.options.tooltip.formatTemplate) {
              var pointFormatTemplate = _lodash2.default.template(
                this.series.chart.options.tooltip.formatTemplate
              );
              return pointFormatTemplate({
                point: this,
                val: val,
                numeral: _numeral2.default
              });
            } else {
              return (
                '<span style="color:' +
                this.color +
                '">\u25CF</span> ' +
                this.series.name +
                ": <b>" +
                val +
                "</b><br/>"
              );
            }
          }
        },
        xAxis: {
          labels: {
            formatter: function formatter() {
              return axisFormatter.call(this);
            }
          }
        },
        yAxis: {
          labels: {
            formatter: function formatter() {
              return axisFormatter.call(this);
            }
          }
        }
      };

      _highcharts2.default.setOptions(DagHighchartsConf);

      exports.default = DagHighchartsConf;

      /***/
    },
    /* 1 */
    /*!*****************************!*\
  !*** external "Highcharts" ***!
  \*****************************/
    /***/ function(module, exports) {
      module.exports = Highcharts;

      /***/
    },
    /* 2 */
    /*!**************************!*\
  !*** external "numeral" ***!
  \**************************/
    /***/ function(module, exports) {
      module.exports = numeral;

      /***/
    },
    /* 3 */
    /*!*************************!*\
  !*** external "lodash" ***!
  \*************************/
    /***/ function(module, exports) {
      module.exports = _;

      /***/
    }
    /******/
  ]
);
