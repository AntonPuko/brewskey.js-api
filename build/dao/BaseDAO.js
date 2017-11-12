'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _nullthrows = require('nullthrows');

var _nullthrows2 = _interopRequireDefault(_nullthrows);

var _odata = require('odata');

var _odata2 = _interopRequireDefault(_odata);

var _LoadObject = require('../load_object/LoadObject');

var _LoadObject2 = _interopRequireDefault(_LoadObject);

var _constants = require('../constants');

var _filters = require('../filters');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ID_REG_EXP = /\bid\b/;

var BaseDAO = function () {
  function BaseDAO(config) {
    _classCallCheck(this, BaseDAO);

    this.getEntityName = this.getEntityName.bind(this);
    this.getTranslator = this.getTranslator.bind(this);
    this.__buildHandler = this.__buildHandler.bind(this);
    this._getCacheKey = this._getCacheKey.bind(this);
    this._setFilters = this._setFilters.bind(this);
    this.__resolveSingle = this.__resolveSingle.bind(this);
    this.__resolveMany = this.__resolveMany.bind(this);
    this.__resolveManyIDs = this.__resolveManyIDs.bind(this);
    this.__resolve = this.__resolve.bind(this);
    this._entityLoaderByID = new Map();
    this._entityIDsLoaderByQuery = new Map();
    this._countLoaderByQuery = new Map();
    this._subscribers = [];

    this.__reformatIDValue = function (value) {
      return isNaN(value) || value === '' ? '\'' + value + '\'' : value;
    };

    this.__reformatQueryValue = function (value) {
      return typeof value === 'string' ? '\'' + value + '\'' : value;
    };

    this.__config = config;
  }

  _createClass(BaseDAO, [{
    key: 'getEntityName',
    value: function getEntityName() {
      return this.__config.entityName;
    }
  }, {
    key: 'getTranslator',
    value: function getTranslator() {
      return this.__config.translator;
    }
  }, {
    key: '__buildHandler',
    value: function __buildHandler() {
      var queryOptions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var shouldSelectExpand = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      var shouldCount = queryOptions.shouldCount,
          skip = queryOptions.skip,
          take = queryOptions.take;

      var selectExpandQuery = this.__config.selectExpandQuery;
      var handler = (0, _odata2.default)(this.getEntityName());

      if (shouldSelectExpand && selectExpandQuery) {
        var expand = selectExpandQuery.expand,
            select = selectExpandQuery.select;

        if (select) {
          handler = handler.select(select.join(','));
        }

        if (expand) {
          var navigationPropString = Object.entries(expand).map(function (_ref) {
            var _ref2 = _slicedToArray(_ref, 2),
                key = _ref2[0],
                value = _ref2[1];

            if (!value || !Array.isArray(value) || !value.length) {
              return key;
            }
            return key + '($select=' + value.join(',') + ')';
          }).join(',');

          handler = handler.expand(navigationPropString);
        }
      }

      if (Number.isInteger(skip)) {
        handler = handler.skip(skip || 0);
      }

      if (Number.isInteger(take)) {
        handler = handler.top(take || 0);
      }

      if (shouldCount) {
        handler = handler.inlineCount('true');
      }

      handler = this._setFilters(handler, queryOptions);

      if (queryOptions.orderBy) {
        var orderBy = queryOptions.orderBy[0].column;
        var direction = queryOptions.orderBy[0].direction;
        if (direction === 'desc') {
          handler.orderByDesc(orderBy);
        } else if (orderBy) {
          handler.orderBy(orderBy);
        }
      }

      if (BaseDAO._organizationID) {
        handler.customParam('organizationID', BaseDAO._organizationID);
      }

      return handler;
    }
  }, {
    key: '_getCacheKey',
    value: function _getCacheKey(queryOptions) {
      return JSON.stringify(queryOptions || '_');
    }
  }, {
    key: '_setFilters',
    value: function _setFilters(handler) {
      var _this = this;

      var queryOptions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      if (!queryOptions.filters || !queryOptions.filters.length) {
        return handler;
      }
      var renderedFilters = queryOptions.filters.map(function (_ref3) {
        var operator = _ref3.operator,
            params = _ref3.params,
            values = _ref3.values;

        var isValidOperator = _constants.FILTER_FUNCTION_OPERATORS.find(function (op) {
          return op === operator;
        });

        var filters = values.map(function (value) {
          return params.map(function (param) {
            // we have to use two reformat functions because of the issue:
            // https://github.com/Brewskey/brewskey.admin/issues/371
            // this is not ideal though, because it doesn't resolve
            // situations when we get stringified value from front-end
            // which is stored as number on the server.
            var reformattedValue = ID_REG_EXP.test(param) ? _this.__reformatIDValue(value) : _this.__reformatQueryValue(value);

            if (isValidOperator) {
              return '(' + operator + '(' + param + ', ' + reformattedValue + '))';
            }

            return '(' + param + ' ' + operator + ' ' + reformattedValue + ')';
          });
        });

        return filters.reduce(function (previousFilter, currentFilters) {
          return [].concat(_toConsumableArray(previousFilter), _toConsumableArray(currentFilters));
        }).join(' or ');
      }).map(function (filter) {
        return '(' + filter + ')';
      }).join(' and ');
      return handler.filter(renderedFilters);
    }
  }, {
    key: '__resolveSingle',
    value: function () {
      var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(handler, params) {
        var _this2 = this;

        var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'get';
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                return _context.abrupt('return', this.__resolve(handler, params, method).then(function (result) {
                  return _this2.getTranslator().fromApi(result);
                }));

              case 1:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function __resolveSingle(_x5, _x6) {
        return _ref4.apply(this, arguments);
      }

      return __resolveSingle;
    }()
  }, {
    key: '__resolveMany',
    value: function () {
      var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(handler, params) {
        var _this3 = this;

        var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'get';
        var result;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return this.__resolve(handler, params, method);

              case 2:
                result = _context2.sent;
                return _context2.abrupt('return', (result || []).map(function (item) {
                  return _this3.getTranslator().fromApi(item);
                }));

              case 4:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function __resolveMany(_x8, _x9) {
        return _ref5.apply(this, arguments);
      }

      return __resolveMany;
    }()
  }, {
    key: '__resolveManyIDs',
    value: function () {
      var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(handler, params, selector) {
        var method = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'get';
        var result;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                selector = selector || function (item) {
                  return item.id;
                };
                _context3.next = 3;
                return this.__resolve(handler, params, method);

              case 3:
                result = _context3.sent;
                return _context3.abrupt('return', (result || []).map(selector));

              case 5:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function __resolveManyIDs(_x11, _x12, _x13) {
        return _ref6.apply(this, arguments);
      }

      return __resolveManyIDs;
    }()
  }, {
    key: '__resolve',
    value: function () {
      var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(handler, params) {
        var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'get';
        var request, resultHandler;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                request = void 0;
                _context4.t0 = method;
                _context4.next = _context4.t0 === 'delete' ? 4 : _context4.t0 === 'patch' ? 6 : _context4.t0 === 'post' ? 8 : _context4.t0 === 'put' ? 10 : 12;
                break;

              case 4:
                request = handler.remove().save();
                return _context4.abrupt('break', 13);

              case 6:
                request = handler.patch(params).save();
                return _context4.abrupt('break', 13);

              case 8:
                request = handler.post(params).save();
                return _context4.abrupt('break', 13);

              case 10:
                request = handler.put(params).save();
                return _context4.abrupt('break', 13);

              case 12:
                request = handler.get();

              case 13:
                _context4.next = 15;
                return request;

              case 15:
                resultHandler = _context4.sent;
                return _context4.abrupt('return', resultHandler.data);

              case 17:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function __resolve(_x15, _x16) {
        return _ref7.apply(this, arguments);
      }

      return __resolve;
    }()
  }], [{
    key: 'setOrganizationID',
    value: function setOrganizationID(organizationID) {
      BaseDAO._organizationID = organizationID;
    }
  }]);

  return BaseDAO;
}();

BaseDAO._organizationID = null;
exports.default = BaseDAO;