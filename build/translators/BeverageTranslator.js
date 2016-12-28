'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _DefaultTranslator2 = require('./DefaultTranslator');

var _DefaultTranslator3 = _interopRequireDefault(_DefaultTranslator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ID_FIELDS = ['availableId', 'beerVariationId', 'externalId', 'glasswareId', 'srmId', 'styleId'];

var BeverageTranslator = function (_DefaultTranslator) {
  _inherits(BeverageTranslator, _DefaultTranslator);

  function BeverageTranslator() {
    _classCallCheck(this, BeverageTranslator);

    return _possibleConstructorReturn(this, (BeverageTranslator.__proto__ || Object.getPrototypeOf(BeverageTranslator)).apply(this, arguments));
  }

  _createClass(BeverageTranslator, [{
    key: 'fromApi',
    value: function fromApi(apiValue) {
      var obj = _get(BeverageTranslator.prototype.__proto__ || Object.getPrototypeOf(BeverageTranslator.prototype), 'fromApi', this).call(this, apiValue);
      ID_FIELDS.forEach(function (field) {
        obj[field] = obj[field] && obj[field].toString();
      });
      return obj;
    }
  }]);

  return BeverageTranslator;
}(_DefaultTranslator3.default);

exports.default = BeverageTranslator;