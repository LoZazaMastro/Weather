const manifest = {"name":"Weather"};
const API_VERSION = 2;
const internalAPIConnection = window.__DECKY_SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED_deckyLoaderAPIInit;
if (!internalAPIConnection) {
    throw new Error('[@decky/api]: Failed to connect to the loader as as the loader API was not initialized. This is likely a bug in Decky Loader.');
}
let api;
try {
    api = internalAPIConnection.connect(API_VERSION, manifest.name);
}
catch {
    api = internalAPIConnection.connect(1, manifest.name);
    console.warn(`[@decky/api] Requested API version ${API_VERSION} but the running loader only supports version 1. Some features may not work.`);
}
if (api._version != API_VERSION) {
    console.warn(`[@decky/api] Requested API version ${API_VERSION} but the running loader only supports version ${api._version}. Some features may not work.`);
}
const callable = api.callable;
const toaster = api.toaster;
const definePlugin = (fn) => {
    return (...args) => {
        return fn(...args);
    };
};

var DefaultContext = {
  color: undefined,
  size: undefined,
  className: undefined,
  style: undefined,
  attr: undefined
};
var IconContext = SP_REACT.createContext && /*#__PURE__*/SP_REACT.createContext(DefaultContext);

var _excluded = ["attr", "size", "title"];
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), true).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: true, configurable: true, writable: true }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function Tree2Element(tree) {
  return tree && tree.map((node, i) => /*#__PURE__*/SP_REACT.createElement(node.tag, _objectSpread({
    key: i
  }, node.attr), Tree2Element(node.child)));
}
function GenIcon(data) {
  return props => /*#__PURE__*/SP_REACT.createElement(IconBase, _extends({
    attr: _objectSpread({}, data.attr)
  }, props), Tree2Element(data.child));
}
function IconBase(props) {
  var elem = conf => {
    var {
        attr,
        size,
        title
      } = props,
      svgProps = _objectWithoutProperties(props, _excluded);
    var computedSize = size || conf.size || "1em";
    var className;
    if (conf.className) className = conf.className;
    if (props.className) className = (className ? className + " " : "") + props.className;
    return /*#__PURE__*/SP_REACT.createElement("svg", _extends({
      stroke: "currentColor",
      fill: "currentColor",
      strokeWidth: "0"
    }, conf.attr, attr, svgProps, {
      className: className,
      style: _objectSpread(_objectSpread({
        color: props.color || conf.color
      }, conf.style), props.style),
      height: computedSize,
      width: computedSize,
      xmlns: "http://www.w3.org/2000/svg"
    }), title && /*#__PURE__*/SP_REACT.createElement("title", null, title), props.children);
  };
  return IconContext !== undefined ? /*#__PURE__*/SP_REACT.createElement(IconContext.Consumer, null, conf => elem(conf)) : elem(DefaultContext);
}

// THIS FILE IS AUTO GENERATED
function FiX (props) {
  return GenIcon({"attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"line","attr":{"x1":"18","y1":"6","x2":"6","y2":"18"},"child":[]},{"tag":"line","attr":{"x1":"6","y1":"6","x2":"18","y2":"18"},"child":[]}]})(props);
}function FiWind (props) {
  return GenIcon({"attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"path","attr":{"d":"M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"},"child":[]}]})(props);
}function FiThermometer (props) {
  return GenIcon({"attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"path","attr":{"d":"M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"},"child":[]}]})(props);
}function FiSun (props) {
  return GenIcon({"attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"circle","attr":{"cx":"12","cy":"12","r":"5"},"child":[]},{"tag":"line","attr":{"x1":"12","y1":"1","x2":"12","y2":"3"},"child":[]},{"tag":"line","attr":{"x1":"12","y1":"21","x2":"12","y2":"23"},"child":[]},{"tag":"line","attr":{"x1":"4.22","y1":"4.22","x2":"5.64","y2":"5.64"},"child":[]},{"tag":"line","attr":{"x1":"18.36","y1":"18.36","x2":"19.78","y2":"19.78"},"child":[]},{"tag":"line","attr":{"x1":"1","y1":"12","x2":"3","y2":"12"},"child":[]},{"tag":"line","attr":{"x1":"21","y1":"12","x2":"23","y2":"12"},"child":[]},{"tag":"line","attr":{"x1":"4.22","y1":"19.78","x2":"5.64","y2":"18.36"},"child":[]},{"tag":"line","attr":{"x1":"18.36","y1":"5.64","x2":"19.78","y2":"4.22"},"child":[]}]})(props);
}function FiSettings (props) {
  return GenIcon({"attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"circle","attr":{"cx":"12","cy":"12","r":"3"},"child":[]},{"tag":"path","attr":{"d":"M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"},"child":[]}]})(props);
}function FiRefreshCw (props) {
  return GenIcon({"attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"polyline","attr":{"points":"23 4 23 10 17 10"},"child":[]},{"tag":"polyline","attr":{"points":"1 20 1 14 7 14"},"child":[]},{"tag":"path","attr":{"d":"M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"},"child":[]}]})(props);
}function FiMapPin (props) {
  return GenIcon({"attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"path","attr":{"d":"M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"},"child":[]},{"tag":"circle","attr":{"cx":"12","cy":"10","r":"3"},"child":[]}]})(props);
}function FiDroplet (props) {
  return GenIcon({"attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"path","attr":{"d":"M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"},"child":[]}]})(props);
}function FiChevronRight (props) {
  return GenIcon({"attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"polyline","attr":{"points":"9 18 15 12 9 6"},"child":[]}]})(props);
}function FiChevronLeft (props) {
  return GenIcon({"attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"polyline","attr":{"points":"15 18 9 12 15 6"},"child":[]}]})(props);
}

// THIS FILE IS AUTO GENERATED
function WiThunderstorm (props) {
  return GenIcon({"attr":{"version":"1.1","id":"Layer_1","x":"0px","y":"0px","viewBox":"0 0 30 30","style":"enable-background:new 0 0 30 30;"},"child":[{"tag":"path","attr":{"d":"M4.63,16.91c0,1.11,0.33,2.1,0.99,2.97s1.52,1.47,2.58,1.79l-0.66,1.68c-0.03,0.14,0.02,0.22,0.14,0.22h2.13l-0.98,4.3h0.28\n\tl3.92-5.75c0.04-0.04,0.04-0.09,0.01-0.14c-0.03-0.05-0.08-0.07-0.15-0.07h-2.18l2.48-4.64c0.07-0.14,0.02-0.22-0.14-0.22h-2.94\n\tc-0.09,0-0.17,0.05-0.23,0.15l-1.07,2.87c-0.71-0.18-1.3-0.57-1.77-1.16c-0.47-0.59-0.7-1.26-0.7-2.01c0-0.83,0.28-1.55,0.85-2.17\n\tc0.57-0.61,1.27-0.97,2.1-1.07l0.53-0.07c0.13,0,0.2-0.06,0.2-0.18l0.07-0.51c0.11-1.08,0.56-1.99,1.37-2.72\n\tc0.81-0.73,1.76-1.1,2.85-1.1c1.09,0,2.04,0.37,2.85,1.1c0.82,0.73,1.28,1.64,1.4,2.72l0.07,0.58c0,0.11,0.06,0.17,0.18,0.17h1.6\n\tc0.91,0,1.68,0.32,2.32,0.95c0.64,0.63,0.97,1.4,0.97,2.28c0,0.85-0.3,1.59-0.89,2.21c-0.59,0.62-1.33,0.97-2.2,1.04\n\tc-0.13,0-0.2,0.06-0.2,0.18v1.37c0,0.11,0.07,0.17,0.2,0.17c1.33-0.04,2.46-0.55,3.39-1.51s1.39-2.11,1.39-3.45\n\tc0-0.9-0.22-1.73-0.67-2.49c-0.44-0.76-1.05-1.36-1.81-1.8c-0.77-0.44-1.6-0.66-2.5-0.66H20.1c-0.33-1.33-1.04-2.42-2.11-3.26\n\ts-2.3-1.27-3.68-1.27c-1.41,0-2.67,0.44-3.76,1.31s-1.79,1.99-2.1,3.36c-1.11,0.26-2.02,0.83-2.74,1.73S4.63,15.76,4.63,16.91z\n\t M12.77,26.62c0,0.39,0.19,0.65,0.58,0.77c0.01,0,0.05,0,0.11,0.01c0.06,0.01,0.11,0.01,0.14,0.01c0.17,0,0.33-0.05,0.49-0.15\n\tc0.16-0.1,0.27-0.26,0.32-0.48l2.25-8.69c0.06-0.24,0.04-0.45-0.07-0.65c-0.11-0.19-0.27-0.32-0.5-0.39\n\tc-0.17-0.02-0.26-0.03-0.26-0.03c-0.16,0-0.32,0.05-0.47,0.15c-0.15,0.1-0.26,0.25-0.31,0.45l-2.26,8.72\n\tC12.78,26.44,12.77,26.53,12.77,26.62z M16.93,23.56c0,0.13,0.03,0.26,0.1,0.38c0.14,0.22,0.31,0.37,0.51,0.44\n\tc0.11,0.03,0.21,0.05,0.3,0.05s0.2-0.02,0.32-0.08c0.21-0.09,0.35-0.28,0.42-0.57l1.44-5.67c0.03-0.14,0.05-0.23,0.05-0.27\n\tc0-0.15-0.05-0.3-0.16-0.45s-0.26-0.26-0.46-0.32c-0.17-0.02-0.26-0.03-0.26-0.03c-0.17,0-0.33,0.05-0.47,0.15\n\tc-0.14,0.1-0.24,0.25-0.3,0.45l-1.46,5.7c0,0.02,0,0.05-0.01,0.11C16.93,23.5,16.93,23.53,16.93,23.56z"},"child":[]}]})(props);
}function WiSnow (props) {
  return GenIcon({"attr":{"version":"1.1","id":"Layer_1","x":"0px","y":"0px","viewBox":"0 0 30 30","style":"enable-background:new 0 0 30 30;"},"child":[{"tag":"path","attr":{"d":"M4.64,16.95c0-1.16,0.35-2.18,1.06-3.08s1.62-1.48,2.74-1.76c0.31-1.36,1.01-2.48,2.1-3.36s2.34-1.31,3.75-1.31\n\tc1.38,0,2.6,0.43,3.68,1.28c1.08,0.85,1.78,1.95,2.1,3.29h0.32c0.89,0,1.72,0.22,2.48,0.66c0.76,0.44,1.37,1.04,1.81,1.8\n\tc0.44,0.76,0.67,1.59,0.67,2.48c0,1.32-0.46,2.47-1.39,3.42c-0.92,0.96-2.05,1.46-3.38,1.5c-0.13,0-0.2-0.06-0.2-0.17v-1.33\n\tc0-0.12,0.07-0.18,0.2-0.18c0.85-0.04,1.58-0.38,2.18-1.02s0.9-1.38,0.9-2.23c0-0.89-0.32-1.65-0.97-2.3s-1.42-0.97-2.32-0.97h-1.61\n\tc-0.12,0-0.18-0.06-0.18-0.17l-0.08-0.58c-0.11-1.08-0.58-1.99-1.39-2.72c-0.82-0.73-1.76-1.1-2.85-1.1c-1.1,0-2.05,0.37-2.86,1.11\n\tc-0.81,0.74-1.27,1.65-1.37,2.75l-0.06,0.5c0,0.12-0.07,0.19-0.2,0.19l-0.53,0.07c-0.83,0.07-1.53,0.41-2.1,1.04\n\ts-0.85,1.35-0.85,2.19c0,0.85,0.3,1.59,0.9,2.23s1.33,0.97,2.18,1.02c0.11,0,0.17,0.06,0.17,0.18v1.33c0,0.11-0.06,0.17-0.17,0.17\n\tc-1.34-0.04-2.47-0.54-3.4-1.5C5.1,19.42,4.64,18.27,4.64,16.95z M11,21.02c0-0.22,0.08-0.42,0.24-0.58\n\tc0.16-0.16,0.35-0.24,0.59-0.24c0.23,0,0.43,0.08,0.59,0.24c0.16,0.16,0.24,0.36,0.24,0.58c0,0.24-0.08,0.44-0.24,0.6\n\tc-0.16,0.17-0.35,0.25-0.59,0.25c-0.23,0-0.43-0.08-0.59-0.25C11.08,21.46,11,21.26,11,21.02z M11,24.65c0-0.24,0.08-0.44,0.24-0.6\n\tc0.16-0.15,0.35-0.23,0.58-0.23c0.23,0,0.43,0.08,0.59,0.23c0.16,0.16,0.24,0.35,0.24,0.59c0,0.24-0.08,0.43-0.24,0.59\n\tc-0.16,0.16-0.35,0.23-0.59,0.23c-0.23,0-0.43-0.08-0.59-0.23C11.08,25.08,11,24.88,11,24.65z M14.19,22.95\n\tc0-0.23,0.08-0.44,0.25-0.62c0.16-0.16,0.35-0.24,0.57-0.24c0.23,0,0.43,0.09,0.6,0.26c0.17,0.17,0.26,0.37,0.26,0.6\n\tc0,0.23-0.08,0.43-0.25,0.6c-0.17,0.17-0.37,0.25-0.61,0.25c-0.23,0-0.42-0.08-0.58-0.25S14.19,23.18,14.19,22.95z M14.19,19.33\n\tc0-0.23,0.08-0.43,0.25-0.6c0.18-0.16,0.37-0.24,0.57-0.24c0.24,0,0.44,0.08,0.61,0.25c0.17,0.17,0.25,0.36,0.25,0.6\n\tc0,0.23-0.08,0.43-0.25,0.59c-0.17,0.16-0.37,0.24-0.61,0.24c-0.23,0-0.42-0.08-0.58-0.24C14.27,19.76,14.19,19.56,14.19,19.33z\n\t M14.19,26.61c0-0.23,0.08-0.43,0.25-0.61c0.16-0.16,0.35-0.24,0.57-0.24c0.24,0,0.44,0.08,0.61,0.25c0.17,0.17,0.25,0.37,0.25,0.6\n\ts-0.08,0.43-0.25,0.59c-0.17,0.16-0.37,0.24-0.61,0.24c-0.23,0-0.42-0.08-0.58-0.24C14.27,27.03,14.19,26.84,14.19,26.61z\n\t M17.41,21.02c0-0.22,0.08-0.41,0.25-0.58c0.17-0.17,0.37-0.25,0.6-0.25c0.23,0,0.43,0.08,0.59,0.24c0.16,0.16,0.24,0.36,0.24,0.58\n\tc0,0.24-0.08,0.44-0.24,0.6c-0.16,0.17-0.35,0.25-0.59,0.25c-0.24,0-0.44-0.08-0.6-0.25C17.5,21.45,17.41,21.25,17.41,21.02z\n\t M17.41,24.65c0-0.22,0.08-0.42,0.25-0.6c0.16-0.15,0.36-0.23,0.6-0.23c0.24,0,0.43,0.08,0.59,0.23s0.23,0.35,0.23,0.59\n\tc0,0.24-0.08,0.43-0.23,0.59c-0.16,0.16-0.35,0.23-0.59,0.23c-0.24,0-0.44-0.08-0.6-0.24C17.5,25.07,17.41,24.88,17.41,24.65z"},"child":[]}]})(props);
}function WiRain (props) {
  return GenIcon({"attr":{"version":"1.1","id":"Layer_1","x":"0px","y":"0px","viewBox":"0 0 30 30","style":"enable-background:new 0 0 30 30;"},"child":[{"tag":"path","attr":{"d":"M4.64,16.91c0-1.15,0.36-2.17,1.08-3.07c0.72-0.9,1.63-1.47,2.73-1.73c0.31-1.36,1.02-2.48,2.11-3.36s2.34-1.31,3.75-1.31\n\tc1.38,0,2.6,0.43,3.68,1.28c1.08,0.85,1.78,1.95,2.1,3.29h0.32c0.89,0,1.72,0.22,2.48,0.65s1.37,1.03,1.81,1.78\n\tc0.44,0.75,0.67,1.58,0.67,2.47c0,0.88-0.21,1.69-0.63,2.44c-0.42,0.75-1,1.35-1.73,1.8c-0.73,0.45-1.53,0.69-2.4,0.71\n\tc-0.13,0-0.2-0.06-0.2-0.17v-1.33c0-0.12,0.07-0.18,0.2-0.18c0.85-0.04,1.58-0.38,2.18-1.02s0.9-1.39,0.9-2.26s-0.33-1.62-0.98-2.26\n\ts-1.42-0.96-2.31-0.96h-1.61c-0.12,0-0.18-0.06-0.18-0.17l-0.08-0.58c-0.11-1.08-0.58-1.99-1.39-2.71\n\tc-0.82-0.73-1.76-1.09-2.85-1.09c-1.09,0-2.05,0.36-2.85,1.09c-0.81,0.73-1.26,1.63-1.36,2.71l-0.07,0.53c0,0.12-0.07,0.19-0.2,0.19\n\tl-0.53,0.03c-0.83,0.1-1.53,0.46-2.1,1.07s-0.85,1.33-0.85,2.16c0,0.87,0.3,1.62,0.9,2.26s1.33,0.98,2.18,1.02\n\tc0.11,0,0.17,0.06,0.17,0.18v1.33c0,0.11-0.06,0.17-0.17,0.17c-1.34-0.06-2.47-0.57-3.4-1.53S4.64,18.24,4.64,16.91z M9.99,23.6\n\tc0-0.04,0.01-0.11,0.04-0.2l1.63-5.77c0.06-0.19,0.17-0.34,0.32-0.44c0.15-0.1,0.31-0.15,0.46-0.15c0.07,0,0.15,0.01,0.24,0.03\n\tc0.24,0.04,0.42,0.17,0.54,0.37c0.12,0.2,0.15,0.42,0.08,0.67l-1.63,5.73c-0.12,0.43-0.4,0.64-0.82,0.64\n\tc-0.04,0-0.07-0.01-0.11-0.02c-0.06-0.02-0.09-0.03-0.1-0.03c-0.22-0.06-0.38-0.17-0.49-0.33C10.04,23.93,9.99,23.77,9.99,23.6z\n\t M12.61,26.41l2.44-8.77c0.04-0.19,0.14-0.34,0.3-0.44c0.16-0.1,0.32-0.15,0.49-0.15c0.09,0,0.18,0.01,0.27,0.03\n\tc0.22,0.06,0.38,0.19,0.49,0.39c0.11,0.2,0.13,0.41,0.07,0.64l-2.43,8.78c-0.04,0.17-0.13,0.31-0.29,0.43\n\tc-0.16,0.12-0.32,0.18-0.51,0.18c-0.09,0-0.18-0.02-0.25-0.05c-0.2-0.05-0.37-0.18-0.52-0.39C12.56,26.88,12.54,26.67,12.61,26.41z\n\t M16.74,23.62c0-0.04,0.01-0.11,0.04-0.23l1.63-5.77c0.06-0.19,0.16-0.34,0.3-0.44c0.15-0.1,0.3-0.15,0.46-0.15\n\tc0.08,0,0.17,0.01,0.26,0.03c0.21,0.06,0.36,0.16,0.46,0.31c0.1,0.15,0.15,0.31,0.15,0.47c0,0.03-0.01,0.08-0.02,0.14\n\ts-0.02,0.1-0.02,0.12l-1.63,5.73c-0.04,0.19-0.13,0.35-0.28,0.46s-0.32,0.17-0.51,0.17l-0.24-0.05c-0.2-0.06-0.35-0.16-0.46-0.32\n\tC16.79,23.94,16.74,23.78,16.74,23.62z"},"child":[]}]})(props);
}function WiNightClear (props) {
  return GenIcon({"attr":{"version":"1.1","id":"Layer_1","x":"0px","y":"0px","viewBox":"0 0 30 30","style":"enable-background:new 0 0 30 30;"},"child":[{"tag":"path","attr":{"d":"M7.91,14.48c0-0.96,0.19-1.87,0.56-2.75s0.88-1.63,1.51-2.26c0.63-0.63,1.39-1.14,2.27-1.52c0.88-0.38,1.8-0.57,2.75-0.57\n\th1.14c0.16,0.04,0.23,0.14,0.23,0.28l0.05,0.88c0.04,1.27,0.49,2.35,1.37,3.24c0.88,0.89,1.94,1.37,3.19,1.42l0.82,0.07\n\tc0.16,0,0.24,0.08,0.24,0.23v0.98c0.01,1.28-0.3,2.47-0.93,3.56c-0.63,1.09-1.48,1.95-2.57,2.59c-1.08,0.63-2.27,0.95-3.55,0.95\n\tc-0.97,0-1.9-0.19-2.78-0.56s-1.63-0.88-2.26-1.51c-0.63-0.63-1.13-1.39-1.5-2.26C8.1,16.37,7.91,15.45,7.91,14.48z M9.74,14.48\n\tc0,0.76,0.15,1.48,0.45,2.16c0.3,0.67,0.7,1.24,1.19,1.7c0.49,0.46,1.05,0.82,1.69,1.08c0.63,0.27,1.28,0.4,1.94,0.4\n\tc0.58,0,1.17-0.11,1.76-0.34c0.59-0.23,1.14-0.55,1.65-0.96c0.51-0.41,0.94-0.93,1.31-1.57c0.37-0.64,0.6-1.33,0.71-2.09\n\tc-1.63-0.34-2.94-1.04-3.92-2.1s-1.55-2.3-1.7-3.74C13.86,9.08,13,9.37,12.21,9.9c-0.78,0.53-1.39,1.2-1.82,2.02\n\tC9.96,12.74,9.74,13.59,9.74,14.48z"},"child":[]}]})(props);
}function WiFog (props) {
  return GenIcon({"attr":{"version":"1.1","id":"Layer_1","x":"0px","y":"0px","viewBox":"0 0 30 30","style":"enable-background:new 0 0 30 30;"},"child":[{"tag":"path","attr":{"d":"M2.62,21.05c0-0.24,0.08-0.45,0.25-0.61c0.17-0.16,0.38-0.24,0.63-0.24h18.67c0.25,0,0.45,0.08,0.61,0.24\n\tc0.16,0.16,0.24,0.36,0.24,0.61c0,0.23-0.08,0.43-0.25,0.58c-0.17,0.16-0.37,0.23-0.6,0.23H3.5c-0.25,0-0.46-0.08-0.63-0.23\n\tC2.7,21.47,2.62,21.28,2.62,21.05z M5.24,17.91c0-0.24,0.09-0.44,0.26-0.6c0.15-0.15,0.35-0.23,0.59-0.23h18.67\n\tc0.23,0,0.42,0.08,0.58,0.24c0.16,0.16,0.23,0.35,0.23,0.59c0,0.24-0.08,0.44-0.23,0.6c-0.16,0.17-0.35,0.25-0.58,0.25H6.09\n\tc-0.24,0-0.44-0.08-0.6-0.25C5.32,18.34,5.24,18.14,5.24,17.91z M5.37,15.52c0,0.09,0.05,0.13,0.15,0.13h1.43\n\tc0.06,0,0.13-0.05,0.2-0.16c0.24-0.52,0.59-0.94,1.06-1.27c0.47-0.33,0.99-0.52,1.55-0.56l0.55-0.07c0.11,0,0.17-0.06,0.17-0.18\n\tl0.07-0.5c0.11-1.08,0.56-1.98,1.37-2.7c0.81-0.72,1.76-1.08,2.85-1.08c1.08,0,2.02,0.36,2.83,1.07c0.8,0.71,1.26,1.61,1.37,2.68\n\tl0.08,0.57c0,0.11,0.07,0.17,0.2,0.17h1.59c0.64,0,1.23,0.17,1.76,0.52s0.92,0.8,1.18,1.37c0.07,0.11,0.14,0.16,0.21,0.16h1.43\n\tc0.12,0,0.17-0.07,0.14-0.23c-0.29-1.02-0.88-1.86-1.74-2.51c-0.87-0.65-1.86-0.97-2.97-0.97h-0.32c-0.33-1.33-1.03-2.42-2.1-3.27\n\ts-2.28-1.27-3.65-1.27c-1.4,0-2.64,0.44-3.73,1.32s-1.78,2-2.09,3.36c-0.85,0.2-1.6,0.6-2.24,1.21c-0.64,0.61-1.09,1.33-1.34,2.18\n\tv-0.04C5.37,15.45,5.37,15.48,5.37,15.52z M6.98,24.11c0-0.24,0.09-0.43,0.26-0.59c0.15-0.15,0.35-0.23,0.6-0.23h18.68\n\tc0.24,0,0.44,0.08,0.6,0.23c0.17,0.16,0.25,0.35,0.25,0.58c0,0.24-0.08,0.44-0.25,0.61c-0.17,0.17-0.37,0.25-0.6,0.25H7.84\n\tc-0.23,0-0.43-0.09-0.6-0.26C7.07,24.55,6.98,24.34,6.98,24.11z"},"child":[]}]})(props);
}function WiDaySunny (props) {
  return GenIcon({"attr":{"version":"1.1","id":"Layer_1","x":"0px","y":"0px","viewBox":"0 0 30 30","style":"enable-background:new 0 0 30 30;"},"child":[{"tag":"path","attr":{"d":"M4.37,14.62c0-0.24,0.08-0.45,0.25-0.62c0.17-0.16,0.38-0.24,0.6-0.24h2.04c0.23,0,0.42,0.08,0.58,0.25\n\tc0.15,0.17,0.23,0.37,0.23,0.61S8,15.06,7.85,15.23c-0.15,0.17-0.35,0.25-0.58,0.25H5.23c-0.23,0-0.43-0.08-0.6-0.25\n\tC4.46,15.06,4.37,14.86,4.37,14.62z M7.23,21.55c0-0.23,0.08-0.43,0.23-0.61l1.47-1.43c0.15-0.16,0.35-0.23,0.59-0.23\n\tc0.24,0,0.44,0.08,0.6,0.23s0.24,0.34,0.24,0.57c0,0.24-0.08,0.46-0.24,0.64L8.7,22.14c-0.41,0.32-0.82,0.32-1.23,0\n\tC7.31,21.98,7.23,21.78,7.23,21.55z M7.23,7.71c0-0.23,0.08-0.43,0.23-0.61C7.66,6.93,7.87,6.85,8.1,6.85\n\tc0.22,0,0.42,0.08,0.59,0.24l1.43,1.47c0.16,0.15,0.24,0.35,0.24,0.59c0,0.24-0.08,0.44-0.24,0.6s-0.36,0.24-0.6,0.24\n\tc-0.24,0-0.44-0.08-0.59-0.24L7.47,8.32C7.31,8.16,7.23,7.95,7.23,7.71z M9.78,14.62c0-0.93,0.23-1.8,0.7-2.6s1.1-1.44,1.91-1.91\n\ts1.67-0.7,2.6-0.7c0.7,0,1.37,0.14,2.02,0.42c0.64,0.28,1.2,0.65,1.66,1.12c0.47,0.47,0.84,1.02,1.11,1.66\n\tc0.27,0.64,0.41,1.32,0.41,2.02c0,0.94-0.23,1.81-0.7,2.61c-0.47,0.8-1.1,1.43-1.9,1.9c-0.8,0.47-1.67,0.7-2.61,0.7\n\ts-1.81-0.23-2.61-0.7c-0.8-0.47-1.43-1.1-1.9-1.9C10.02,16.43,9.78,15.56,9.78,14.62z M11.48,14.62c0,0.98,0.34,1.81,1.03,2.5\n\tc0.68,0.69,1.51,1.04,2.49,1.04s1.81-0.35,2.5-1.04s1.04-1.52,1.04-2.5c0-0.96-0.35-1.78-1.04-2.47c-0.69-0.68-1.52-1.02-2.5-1.02\n\tc-0.97,0-1.8,0.34-2.48,1.02C11.82,12.84,11.48,13.66,11.48,14.62z M14.14,22.4c0-0.24,0.08-0.44,0.25-0.6s0.37-0.24,0.6-0.24\n\tc0.24,0,0.45,0.08,0.61,0.24s0.24,0.36,0.24,0.6v1.99c0,0.24-0.08,0.45-0.25,0.62c-0.17,0.17-0.37,0.25-0.6,0.25\n\ts-0.44-0.08-0.6-0.25c-0.17-0.17-0.25-0.38-0.25-0.62V22.4z M14.14,6.9V4.86c0-0.23,0.08-0.43,0.25-0.6C14.56,4.09,14.76,4,15,4\n\ts0.43,0.08,0.6,0.25c0.17,0.17,0.25,0.37,0.25,0.6V6.9c0,0.23-0.08,0.42-0.25,0.58S15.23,7.71,15,7.71s-0.44-0.08-0.6-0.23\n\tS14.14,7.13,14.14,6.9z M19.66,20.08c0-0.23,0.08-0.42,0.23-0.56c0.15-0.16,0.34-0.23,0.56-0.23c0.24,0,0.44,0.08,0.6,0.23\n\tl1.46,1.43c0.16,0.17,0.24,0.38,0.24,0.61c0,0.23-0.08,0.43-0.24,0.59c-0.4,0.31-0.8,0.31-1.2,0l-1.42-1.42\n\tC19.74,20.55,19.66,20.34,19.66,20.08z M19.66,9.16c0-0.25,0.08-0.45,0.23-0.59l1.42-1.47c0.17-0.16,0.37-0.24,0.59-0.24\n\tc0.24,0,0.44,0.08,0.6,0.25c0.17,0.17,0.25,0.37,0.25,0.6c0,0.25-0.08,0.46-0.24,0.62l-1.46,1.43c-0.18,0.16-0.38,0.24-0.6,0.24\n\tc-0.23,0-0.41-0.08-0.56-0.24S19.66,9.4,19.66,9.16z M21.92,14.62c0-0.24,0.08-0.44,0.24-0.62c0.16-0.16,0.35-0.24,0.57-0.24h2.02\n\tc0.23,0,0.43,0.09,0.6,0.26c0.17,0.17,0.26,0.37,0.26,0.6s-0.09,0.43-0.26,0.6c-0.17,0.17-0.37,0.25-0.6,0.25h-2.02\n\tc-0.23,0-0.43-0.08-0.58-0.25S21.92,14.86,21.92,14.62z"},"child":[]}]})(props);
}function WiCloudy (props) {
  return GenIcon({"attr":{"version":"1.1","id":"Layer_1","x":"0px","y":"0px","viewBox":"0 0 30 30","style":"enable-background:new 0 0 30 30;"},"child":[{"tag":"path","attr":{"d":"M3.89,17.6c0-0.99,0.31-1.88,0.93-2.65s1.41-1.27,2.38-1.49c0.26-1.17,0.85-2.14,1.78-2.88c0.93-0.75,2-1.12,3.22-1.12\n\tc1.18,0,2.24,0.36,3.16,1.09c0.93,0.73,1.53,1.66,1.8,2.8h0.27c1.18,0,2.18,0.41,3.01,1.24s1.25,1.83,1.25,3\n\tc0,1.18-0.42,2.18-1.25,3.01s-1.83,1.25-3.01,1.25H8.16c-0.58,0-1.13-0.11-1.65-0.34S5.52,21,5.14,20.62\n\tc-0.38-0.38-0.68-0.84-0.91-1.36S3.89,18.17,3.89,17.6z M5.34,17.6c0,0.76,0.28,1.42,0.82,1.96s1.21,0.82,1.99,0.82h9.28\n\tc0.77,0,1.44-0.27,1.99-0.82c0.55-0.55,0.83-1.2,0.83-1.96c0-0.76-0.27-1.42-0.83-1.96c-0.55-0.54-1.21-0.82-1.99-0.82h-1.39\n\tc-0.1,0-0.15-0.05-0.15-0.15l-0.07-0.49c-0.1-0.94-0.5-1.73-1.19-2.35s-1.51-0.93-2.45-0.93c-0.94,0-1.76,0.31-2.46,0.94\n\tc-0.7,0.62-1.09,1.41-1.18,2.34l-0.07,0.42c0,0.1-0.05,0.15-0.16,0.15l-0.45,0.07c-0.72,0.06-1.32,0.36-1.81,0.89\n\tC5.59,16.24,5.34,16.87,5.34,17.6z M14.19,8.88c-0.1,0.09-0.08,0.16,0.07,0.21c0.43,0.19,0.79,0.37,1.08,0.55\n\tc0.11,0.03,0.19,0.02,0.22-0.03c0.61-0.57,1.31-0.86,2.12-0.86c0.81,0,1.5,0.27,2.1,0.81c0.59,0.54,0.92,1.21,0.99,2l0.09,0.64h1.42\n\tc0.65,0,1.21,0.23,1.68,0.7c0.47,0.47,0.7,1.02,0.7,1.66c0,0.6-0.21,1.12-0.62,1.57s-0.92,0.7-1.53,0.77c-0.1,0-0.15,0.05-0.15,0.16\n\tv1.13c0,0.11,0.05,0.16,0.15,0.16c1.01-0.06,1.86-0.46,2.55-1.19s1.04-1.6,1.04-2.6c0-1.06-0.37-1.96-1.12-2.7\n\tc-0.75-0.75-1.65-1.12-2.7-1.12h-0.15c-0.26-1-0.81-1.82-1.65-2.47c-0.83-0.65-1.77-0.97-2.8-0.97C16.28,7.29,15.11,7.82,14.19,8.88\n\tz"},"child":[]}]})(props);
}

const APP_LOCALES = {
    it: "it-IT",
    en: "en-US",
    fr: "fr-FR",
    es: "es-ES",
    pt: "pt-PT",
    "pt-BR": "pt-BR",
    de: "de-DE",
    nl: "nl-NL",
    uk: "uk-UA",
    zh: "zh-CN",
    ja: "ja-JP",
};
const TRANSLATIONS = {
    en: {
        active: "Active",
        apparent: "Feels like",
        compactLayout: "Compact layout",
        topBarWeather: "Show weather in top bar",
        topBarWeatherIcon: "Show weather icon in top bar",
        topBarLeft: "Move clock and weather to left",
        defaultCity: "Default: Milan",
        emptyLocationBody: "Enter a city or coordinates.",
        emptyLocationTitle: "Empty location",
        forecast: "Forecast",
        hourlyForecast: "Hourly forecast",
        humidity: "Humidity",
        loadingWeather: "Loading weather...",
        location: "Location",
        locationPlaceholder: "Milan, Tokyo, 45.4642,9.19",
        max: "Max",
        min: "Min",
        noForecast: "No forecast",
        noWeatherData: "No weather data available.",
        openSettings: "Open settings",
        rain: "Rain",
        refresh: "Refresh",
        refreshNow: "Refresh now",
        saveLocation: "Save location",
        settings: "Settings",
        settingsNotSaved: "Settings not saved",
        today: "Today",
        unitsAndLayout: "Units and layout",
        unknownError: "Unknown error",
        weatherLocation: "Weather location",
        weatherSettings: "Weather settings",
        weatherUnavailable: "Weather unavailable",
        wind: "Wind",
    },
    it: {
        active: "Attivo",
        apparent: "Percepiti",
        compactLayout: "Layout compatto",
        topBarWeather: "Mostra meteo nella top bar",
        topBarWeatherIcon: "Mostra icona meteo nella top bar",
        topBarLeft: "Sposta orario e meteo a sinistra",
        defaultCity: "Default: Milano",
        emptyLocationBody: "Scrivi una città o coordinate.",
        emptyLocationTitle: "Località vuota",
        forecast: "Previsioni",
        hourlyForecast: "Previsione oraria",
        humidity: "Umidità",
        loadingWeather: "Carico il meteo...",
        location: "Località",
        locationPlaceholder: "Milano, Tokyo, 45.4642,9.19",
        max: "Max",
        min: "Min",
        noForecast: "Nessuna previsione",
        noWeatherData: "Nessun dato meteo disponibile.",
        openSettings: "Apri settaggi",
        rain: "Pioggia",
        refresh: "Aggiorna",
        refreshNow: "Aggiorna ora",
        saveLocation: "Salva località",
        settings: "Settaggi",
        settingsNotSaved: "Impostazioni non salvate",
        today: "Oggi",
        unitsAndLayout: "Unità e layout",
        unknownError: "Errore sconosciuto",
        weatherLocation: "Località meteo",
        weatherSettings: "Settaggi meteo",
        weatherUnavailable: "Meteo non disponibile",
        wind: "Vento",
    },
    fr: {
        active: "Actif",
        apparent: "Ressenti",
        compactLayout: "Disposition compacte",
        defaultCity: "Par défaut : Milan",
        emptyLocationBody: "Saisis une ville ou des coordonnées.",
        emptyLocationTitle: "Lieu vide",
        forecast: "Prévisions",
        hourlyForecast: "Prévision horaire",
        humidity: "Humidité",
        loadingWeather: "Chargement météo...",
        location: "Lieu",
        locationPlaceholder: "Milan, Tokyo, 45.4642,9.19",
        max: "Max",
        min: "Min",
        noForecast: "Aucune prévision",
        noWeatherData: "Aucune donnée météo disponible.",
        openSettings: "Ouvrir les réglages",
        rain: "Pluie",
        refresh: "Actualiser",
        refreshNow: "Actualiser",
        saveLocation: "Enregistrer le lieu",
        settings: "Réglages",
        settingsNotSaved: "Réglages non enregistrés",
        today: "Aujourd'hui",
        unitsAndLayout: "Unités et affichage",
        unknownError: "Erreur inconnue",
        weatherLocation: "Lieu météo",
        weatherSettings: "Réglages météo",
        weatherUnavailable: "Météo indisponible",
        wind: "Vent",
    },
    es: {
        active: "Activo",
        apparent: "Sensación",
        compactLayout: "Diseño compacto",
        defaultCity: "Predeterminado: Milán",
        emptyLocationBody: "Escribe una ciudad o coordenadas.",
        emptyLocationTitle: "Ubicación vacía",
        forecast: "Previsión",
        hourlyForecast: "Previsión horaria",
        humidity: "Humedad",
        loadingWeather: "Cargando el tiempo...",
        location: "Ubicación",
        locationPlaceholder: "Milán, Tokio, 45.4642,9.19",
        max: "Máx",
        min: "Mín",
        noForecast: "Sin previsión",
        noWeatherData: "No hay datos meteorológicos.",
        openSettings: "Abrir ajustes",
        rain: "Lluvia",
        refresh: "Actualizar",
        refreshNow: "Actualizar ahora",
        saveLocation: "Guardar ubicación",
        settings: "Ajustes",
        settingsNotSaved: "Ajustes no guardados",
        today: "Hoy",
        unitsAndLayout: "Unidades y diseño",
        unknownError: "Error desconocido",
        weatherLocation: "Ubicación del tiempo",
        weatherSettings: "Ajustes del tiempo",
        weatherUnavailable: "Tiempo no disponible",
        wind: "Viento",
    },
    pt: {
        active: "Ativo",
        apparent: "Sensação",
        compactLayout: "Layout compacto",
        defaultCity: "Predefinição: Milão",
        emptyLocationBody: "Escreve uma cidade ou coordenadas.",
        emptyLocationTitle: "Localização vazia",
        forecast: "Previsão",
        hourlyForecast: "Previsão horária",
        humidity: "Humidade",
        loadingWeather: "A carregar meteorologia...",
        location: "Localização",
        locationPlaceholder: "Milão, Tóquio, 45.4642,9.19",
        max: "Máx",
        min: "Mín",
        noForecast: "Sem previsão",
        noWeatherData: "Sem dados meteorológicos.",
        openSettings: "Abrir definições",
        rain: "Chuva",
        refresh: "Atualizar",
        refreshNow: "Atualizar agora",
        saveLocation: "Guardar localização",
        settings: "Definições",
        settingsNotSaved: "Definições não guardadas",
        today: "Hoje",
        unitsAndLayout: "Unidades e layout",
        unknownError: "Erro desconhecido",
        weatherLocation: "Localização meteorológica",
        weatherSettings: "Definições meteorológicas",
        weatherUnavailable: "Meteorologia indisponível",
        wind: "Vento",
    },
    "pt-BR": {
        active: "Ativo",
        apparent: "Sensação",
        compactLayout: "Layout compacto",
        defaultCity: "Padrão: Milão",
        emptyLocationBody: "Digite uma cidade ou coordenadas.",
        emptyLocationTitle: "Local vazio",
        forecast: "Previsão",
        hourlyForecast: "Previsão por hora",
        humidity: "Umidade",
        loadingWeather: "Carregando clima...",
        location: "Local",
        locationPlaceholder: "Milão, Tóquio, 45.4642,9.19",
        max: "Máx",
        min: "Mín",
        noForecast: "Sem previsão",
        noWeatherData: "Sem dados de clima.",
        openSettings: "Abrir ajustes",
        rain: "Chuva",
        refresh: "Atualizar",
        refreshNow: "Atualizar agora",
        saveLocation: "Salvar local",
        settings: "Ajustes",
        settingsNotSaved: "Ajustes não salvos",
        today: "Hoje",
        unitsAndLayout: "Unidades e layout",
        unknownError: "Erro desconhecido",
        weatherLocation: "Local do clima",
        weatherSettings: "Ajustes do clima",
        weatherUnavailable: "Clima indisponível",
        wind: "Vento",
    },
    de: {
        active: "Aktiv",
        apparent: "Gefühlt",
        compactLayout: "Kompaktes Layout",
        defaultCity: "Standard: Mailand",
        emptyLocationBody: "Gib eine Stadt oder Koordinaten ein.",
        emptyLocationTitle: "Ort leer",
        forecast: "Vorhersage",
        hourlyForecast: "Stündliche Vorhersage",
        humidity: "Luftfeuchte",
        loadingWeather: "Wetter wird geladen...",
        location: "Ort",
        locationPlaceholder: "Mailand, Tokio, 45.4642,9.19",
        max: "Max",
        min: "Min",
        noForecast: "Keine Vorhersage",
        noWeatherData: "Keine Wetterdaten verfügbar.",
        openSettings: "Einstellungen öffnen",
        rain: "Regen",
        refresh: "Aktualisieren",
        refreshNow: "Jetzt aktualisieren",
        saveLocation: "Ort speichern",
        settings: "Einstellungen",
        settingsNotSaved: "Einstellungen nicht gespeichert",
        today: "Heute",
        unitsAndLayout: "Einheiten und Layout",
        unknownError: "Unbekannter Fehler",
        weatherLocation: "Wetterort",
        weatherSettings: "Wetter-Einstellungen",
        weatherUnavailable: "Wetter nicht verfügbar",
        wind: "Wind",
    },
    nl: {
        active: "Actief",
        apparent: "Voelt als",
        compactLayout: "Compacte lay-out",
        defaultCity: "Standaard: Milaan",
        emptyLocationBody: "Voer een stad of coördinaten in.",
        emptyLocationTitle: "Locatie leeg",
        forecast: "Verwachting",
        hourlyForecast: "Uurlijkse verwachting",
        humidity: "Vochtigheid",
        loadingWeather: "Weer laden...",
        location: "Locatie",
        locationPlaceholder: "Milaan, Tokio, 45.4642,9.19",
        max: "Max",
        min: "Min",
        noForecast: "Geen verwachting",
        noWeatherData: "Geen weergegevens beschikbaar.",
        openSettings: "Instellingen openen",
        rain: "Regen",
        refresh: "Vernieuwen",
        refreshNow: "Nu vernieuwen",
        saveLocation: "Locatie opslaan",
        settings: "Instellingen",
        settingsNotSaved: "Instellingen niet opgeslagen",
        today: "Vandaag",
        unitsAndLayout: "Eenheden en lay-out",
        unknownError: "Onbekende fout",
        weatherLocation: "Weerlocatie",
        weatherSettings: "Weerinstellingen",
        weatherUnavailable: "Weer niet beschikbaar",
        wind: "Wind",
    },
    uk: {
        active: "Активно",
        apparent: "Відчувається",
        compactLayout: "Компактний вигляд",
        defaultCity: "Типово: Мілан",
        emptyLocationBody: "Введіть місто або координати.",
        emptyLocationTitle: "Порожня локація",
        forecast: "Прогноз",
        hourlyForecast: "Погодинний прогноз",
        humidity: "Вологість",
        loadingWeather: "Завантаження погоди...",
        location: "Локація",
        locationPlaceholder: "Мілан, Токіо, 45.4642,9.19",
        max: "Макс",
        min: "Мін",
        noForecast: "Немає прогнозу",
        noWeatherData: "Немає даних про погоду.",
        openSettings: "Відкрити налаштування",
        rain: "Дощ",
        refresh: "Оновити",
        refreshNow: "Оновити зараз",
        saveLocation: "Зберегти локацію",
        settings: "Налаштування",
        settingsNotSaved: "Налаштування не збережено",
        today: "Сьогодні",
        unitsAndLayout: "Одиниці та вигляд",
        unknownError: "Невідома помилка",
        weatherLocation: "Локація погоди",
        weatherSettings: "Налаштування погоди",
        weatherUnavailable: "Погода недоступна",
        wind: "Вітер",
    },
    zh: {
        active: "当前",
        apparent: "体感",
        compactLayout: "紧凑布局",
        defaultCity: "默认：米兰",
        emptyLocationBody: "请输入城市或坐标。",
        emptyLocationTitle: "位置为空",
        forecast: "预报",
        hourlyForecast: "逐小时预报",
        humidity: "湿度",
        loadingWeather: "正在加载天气...",
        location: "位置",
        locationPlaceholder: "米兰、东京、45.4642,9.19",
        max: "最高",
        min: "最低",
        noForecast: "暂无预报",
        noWeatherData: "暂无天气数据。",
        openSettings: "打开设置",
        rain: "降雨",
        refresh: "刷新",
        refreshNow: "立即刷新",
        saveLocation: "保存位置",
        settings: "设置",
        settingsNotSaved: "设置未保存",
        today: "今天",
        unitsAndLayout: "单位和布局",
        unknownError: "未知错误",
        weatherLocation: "天气位置",
        weatherSettings: "天气设置",
        weatherUnavailable: "天气不可用",
        wind: "风",
    },
    ja: {
        active: "有効",
        apparent: "体感",
        compactLayout: "コンパクト表示",
        defaultCity: "既定: ミラノ",
        emptyLocationBody: "都市名または座標を入力してください。",
        emptyLocationTitle: "場所が空です",
        forecast: "予報",
        hourlyForecast: "時間別予報",
        humidity: "湿度",
        loadingWeather: "天気を読み込み中...",
        location: "場所",
        locationPlaceholder: "ミラノ、東京、45.4642,9.19",
        max: "最高",
        min: "最低",
        noForecast: "予報なし",
        noWeatherData: "天気データがありません。",
        openSettings: "設定を開く",
        rain: "雨",
        refresh: "更新",
        refreshNow: "今すぐ更新",
        saveLocation: "場所を保存",
        settings: "設定",
        settingsNotSaved: "設定を保存できません",
        today: "今日",
        unitsAndLayout: "単位と表示",
        unknownError: "不明なエラー",
        weatherLocation: "天気の場所",
        weatherSettings: "天気設定",
        weatherUnavailable: "天気を取得できません",
        wind: "風",
    },
};
const WEATHER_CODE_KEYS = {
    0: "clear",
    1: "mainlyClear",
    2: "partlyCloudy",
    3: "overcast",
    45: "fog",
    48: "rimeFog",
    51: "drizzle",
    53: "drizzle",
    55: "heavyDrizzle",
    56: "freezingDrizzle",
    57: "freezingDrizzle",
    61: "lightRain",
    63: "rain",
    65: "heavyRain",
    66: "freezingRain",
    67: "freezingRain",
    71: "lightSnow",
    73: "snow",
    75: "heavySnow",
    77: "snowGrains",
    80: "lightShowers",
    81: "showers",
    82: "heavyShowers",
    85: "snowShowers",
    86: "snowShowers",
    95: "thunderstorm",
    96: "thunderstormHail",
    99: "thunderstormHail",
};
const CONDITION_LABELS = {
    en: {
        clear: "Clear",
        mainlyClear: "Mostly clear",
        partlyCloudy: "Partly cloudy",
        overcast: "Overcast",
        fog: "Fog",
        rimeFog: "Freezing fog",
        drizzle: "Drizzle",
        heavyDrizzle: "Heavy drizzle",
        freezingDrizzle: "Freezing drizzle",
        lightRain: "Light rain",
        rain: "Rain",
        heavyRain: "Heavy rain",
        freezingRain: "Freezing rain",
        lightSnow: "Light snow",
        snow: "Snow",
        heavySnow: "Heavy snow",
        snowGrains: "Snow grains",
        lightShowers: "Light showers",
        showers: "Showers",
        heavyShowers: "Heavy showers",
        snowShowers: "Snow showers",
        thunderstorm: "Thunderstorm",
        thunderstormHail: "Thunderstorm with hail",
        variable: "Variable",
    },
    it: {
        clear: "Sereno",
        mainlyClear: "Quasi sereno",
        partlyCloudy: "Poco nuvoloso",
        overcast: "Coperto",
        fog: "Nebbia",
        rimeFog: "Nebbia gelata",
        drizzle: "Pioggerella",
        heavyDrizzle: "Pioggerella intensa",
        freezingDrizzle: "Pioggia gelata",
        lightRain: "Pioggia leggera",
        rain: "Pioggia",
        heavyRain: "Pioggia intensa",
        freezingRain: "Pioggia gelata",
        lightSnow: "Neve leggera",
        snow: "Neve",
        heavySnow: "Neve intensa",
        snowGrains: "Nevischio",
        lightShowers: "Rovesci leggeri",
        showers: "Rovesci",
        heavyShowers: "Rovesci forti",
        snowShowers: "Rovesci nevosi",
        thunderstorm: "Temporale",
        thunderstormHail: "Temporale con grandine",
        variable: "Variabile",
    },
    fr: {
        clear: "Ciel dégagé",
        mainlyClear: "Plutôt dégagé",
        partlyCloudy: "Peu nuageux",
        overcast: "Couvert",
        fog: "Brouillard",
        rimeFog: "Brouillard givrant",
        drizzle: "Bruine",
        heavyDrizzle: "Forte bruine",
        freezingDrizzle: "Bruine verglaçante",
        lightRain: "Pluie légère",
        rain: "Pluie",
        heavyRain: "Forte pluie",
        freezingRain: "Pluie verglaçante",
        lightSnow: "Neige légère",
        snow: "Neige",
        heavySnow: "Forte neige",
        snowGrains: "Grésil",
        lightShowers: "Averses légères",
        showers: "Averses",
        heavyShowers: "Fortes averses",
        snowShowers: "Averses de neige",
        thunderstorm: "Orage",
        thunderstormHail: "Orage avec grêle",
        variable: "Variable",
    },
    es: {
        clear: "Despejado",
        mainlyClear: "Casi despejado",
        partlyCloudy: "Poco nuboso",
        overcast: "Cubierto",
        fog: "Niebla",
        rimeFog: "Niebla helada",
        drizzle: "Llovizna",
        heavyDrizzle: "Llovizna intensa",
        freezingDrizzle: "Llovizna helada",
        lightRain: "Lluvia ligera",
        rain: "Lluvia",
        heavyRain: "Lluvia intensa",
        freezingRain: "Lluvia helada",
        lightSnow: "Nieve ligera",
        snow: "Nieve",
        heavySnow: "Nieve intensa",
        snowGrains: "Cinarra",
        lightShowers: "Chubascos ligeros",
        showers: "Chubascos",
        heavyShowers: "Chubascos fuertes",
        snowShowers: "Chubascos de nieve",
        thunderstorm: "Tormenta",
        thunderstormHail: "Tormenta con granizo",
        variable: "Variable",
    },
    pt: {
        clear: "Céu limpo",
        mainlyClear: "Quase limpo",
        partlyCloudy: "Pouco nublado",
        overcast: "Encoberto",
        fog: "Nevoeiro",
        rimeFog: "Nevoeiro gelado",
        drizzle: "Chuvisco",
        heavyDrizzle: "Chuvisco forte",
        freezingDrizzle: "Chuvisco gelado",
        lightRain: "Chuva fraca",
        rain: "Chuva",
        heavyRain: "Chuva forte",
        freezingRain: "Chuva gelada",
        lightSnow: "Neve fraca",
        snow: "Neve",
        heavySnow: "Neve forte",
        snowGrains: "Grãos de neve",
        lightShowers: "Aguaceiros fracos",
        showers: "Aguaceiros",
        heavyShowers: "Aguaceiros fortes",
        snowShowers: "Aguaceiros de neve",
        thunderstorm: "Trovoada",
        thunderstormHail: "Trovoada com granizo",
        variable: "Variável",
    },
    "pt-BR": {
        clear: "Céu limpo",
        mainlyClear: "Quase limpo",
        partlyCloudy: "Parcialmente nublado",
        overcast: "Nublado",
        fog: "Neblina",
        rimeFog: "Neblina congelante",
        drizzle: "Garoa",
        heavyDrizzle: "Garoa forte",
        freezingDrizzle: "Garoa congelante",
        lightRain: "Chuva leve",
        rain: "Chuva",
        heavyRain: "Chuva forte",
        freezingRain: "Chuva congelante",
        lightSnow: "Neve leve",
        snow: "Neve",
        heavySnow: "Neve forte",
        snowGrains: "Grãos de neve",
        lightShowers: "Pancadas leves",
        showers: "Pancadas",
        heavyShowers: "Pancadas fortes",
        snowShowers: "Pancadas de neve",
        thunderstorm: "Tempestade",
        thunderstormHail: "Tempestade com granizo",
        variable: "Variável",
    },
    de: {
        clear: "Klar",
        mainlyClear: "Überwiegend klar",
        partlyCloudy: "Leicht bewölkt",
        overcast: "Bedeckt",
        fog: "Nebel",
        rimeFog: "Reifnebel",
        drizzle: "Nieselregen",
        heavyDrizzle: "Starker Nieselregen",
        freezingDrizzle: "Gefrierender Nieselregen",
        lightRain: "Leichter Regen",
        rain: "Regen",
        heavyRain: "Starker Regen",
        freezingRain: "Gefrierender Regen",
        lightSnow: "Leichter Schnee",
        snow: "Schnee",
        heavySnow: "Starker Schnee",
        snowGrains: "Schneegriesel",
        lightShowers: "Leichte Schauer",
        showers: "Schauer",
        heavyShowers: "Starke Schauer",
        snowShowers: "Schneeschauer",
        thunderstorm: "Gewitter",
        thunderstormHail: "Gewitter mit Hagel",
        variable: "Wechselhaft",
    },
    nl: {
        clear: "Helder",
        mainlyClear: "Vrij helder",
        partlyCloudy: "Licht bewolkt",
        overcast: "Bewolkt",
        fog: "Mist",
        rimeFog: "Aanvriezende mist",
        drizzle: "Motregen",
        heavyDrizzle: "Zware motregen",
        freezingDrizzle: "IJzelmotregen",
        lightRain: "Lichte regen",
        rain: "Regen",
        heavyRain: "Zware regen",
        freezingRain: "IJzelregen",
        lightSnow: "Lichte sneeuw",
        snow: "Sneeuw",
        heavySnow: "Zware sneeuw",
        snowGrains: "Sneeuwkorrels",
        lightShowers: "Lichte buien",
        showers: "Buien",
        heavyShowers: "Zware buien",
        snowShowers: "Sneeuwbuien",
        thunderstorm: "Onweer",
        thunderstormHail: "Onweer met hagel",
        variable: "Wisselvallig",
    },
    uk: {
        clear: "Ясно",
        mainlyClear: "Переважно ясно",
        partlyCloudy: "Мінлива хмарність",
        overcast: "Хмарно",
        fog: "Туман",
        rimeFog: "Крижаний туман",
        drizzle: "Мряка",
        heavyDrizzle: "Сильна мряка",
        freezingDrizzle: "Крижана мряка",
        lightRain: "Невеликий дощ",
        rain: "Дощ",
        heavyRain: "Сильний дощ",
        freezingRain: "Крижаний дощ",
        lightSnow: "Невеликий сніг",
        snow: "Сніг",
        heavySnow: "Сильний сніг",
        snowGrains: "Сніжна крупа",
        lightShowers: "Невеликі зливи",
        showers: "Зливи",
        heavyShowers: "Сильні зливи",
        snowShowers: "Снігові зливи",
        thunderstorm: "Гроза",
        thunderstormHail: "Гроза з градом",
        variable: "Мінливо",
    },
    zh: {
        clear: "晴朗",
        mainlyClear: "大致晴朗",
        partlyCloudy: "局部多云",
        overcast: "阴天",
        fog: "有雾",
        rimeFog: "冻雾",
        drizzle: "毛毛雨",
        heavyDrizzle: "强毛毛雨",
        freezingDrizzle: "冻毛毛雨",
        lightRain: "小雨",
        rain: "雨",
        heavyRain: "大雨",
        freezingRain: "冻雨",
        lightSnow: "小雪",
        snow: "雪",
        heavySnow: "大雪",
        snowGrains: "米雪",
        lightShowers: "小阵雨",
        showers: "阵雨",
        heavyShowers: "强阵雨",
        snowShowers: "阵雪",
        thunderstorm: "雷暴",
        thunderstormHail: "雷暴伴冰雹",
        variable: "多变",
    },
    ja: {
        clear: "晴れ",
        mainlyClear: "ほぼ晴れ",
        partlyCloudy: "一部曇り",
        overcast: "曇り",
        fog: "霧",
        rimeFog: "着氷性の霧",
        drizzle: "霧雨",
        heavyDrizzle: "強い霧雨",
        freezingDrizzle: "凍る霧雨",
        lightRain: "小雨",
        rain: "雨",
        heavyRain: "強い雨",
        freezingRain: "凍る雨",
        lightSnow: "小雪",
        snow: "雪",
        heavySnow: "大雪",
        snowGrains: "霧雪",
        lightShowers: "弱いにわか雨",
        showers: "にわか雨",
        heavyShowers: "強いにわか雨",
        snowShowers: "にわか雪",
        thunderstorm: "雷雨",
        thunderstormHail: "ひょうを伴う雷雨",
        variable: "変わりやすい",
    },
};
const getSettings = callable("get_settings");
const saveSettings = callable("save_settings");
const getWeather = callable("get_weather");
const refreshTopbar = callable("refresh_topbar");
const DeckyFocusable = DFL.Focusable;
const DeckySpinner = DFL.SteamSpinner;
const DEGREE = String.fromCharCode(176);
const MIDDOT = String.fromCharCode(183);
const DEFAULT_SETTINGS = {
    location: "Milano",
    units: "metric",
    compact: false,
    topbar_enabled: true,
    topbar_show_icon: true,
    topbar_left: false,
    location_set: false,
    version: 2,
};
const theme = {
    panel: "rgba(23, 27, 34, 0.96)",
    panelRaised: "rgba(33, 39, 49, 0.98)",
    line: "rgba(255, 255, 255, 0.1)",
    lineHot: "rgba(126, 221, 214, 0.42)",
    text: "rgba(248, 251, 252, 0.98)",
    muted: "rgba(205, 216, 222, 0.68)",
    quiet: "rgba(205, 216, 222, 0.44)",
    accent: "rgb(126, 221, 214)",
    danger: "rgb(255, 196, 196)",
};
const resetButton = {
    font: "inherit",
    letterSpacing: 0,
};
const borderBox = {
    boxSizing: "border-box",
    minWidth: 0,
};
const styles = {
    shell: {
        ...borderBox,
        width: "100%",
        maxWidth: "100%",
        padding: "14px 12px 12px",
        overflow: "hidden",
        color: theme.text,
        fontFamily: "Inter, Arial, sans-serif",
        letterSpacing: 0,
    },
    stack: {
        ...borderBox,
        display: "flex",
        flexDirection: "column",
        gap: 10,
        width: "100%",
        maxWidth: "100%",
        overflow: "hidden",
    },
    topBar: {
        ...borderBox,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 8,
        width: "100%",
    },
    titleBlock: {
        ...borderBox,
        minWidth: 0,
        display: "flex",
        flexDirection: "column",
        gap: 2,
    },
    title: {
        color: theme.text,
        fontSize: 18,
        fontWeight: 750,
        lineHeight: "22px",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
    },
    hero: {
        ...borderBox,
        position: "relative",
        display: "grid",
        gridTemplateColumns: "minmax(0, 1fr) 104px",
        gap: 12,
        alignItems: "center",
        width: "100%",
        minHeight: 190,
        padding: 16,
        borderRadius: 8,
        border: `1px solid ${theme.line}`,
        background: "radial-gradient(circle at 88% 22%, rgba(126, 221, 214, 0.18), transparent 32%), linear-gradient(160deg, rgba(38, 44, 56, 0.98), rgba(11, 13, 17, 0.98))",
        overflow: "hidden",
    },
    heroGlow: {
        position: "absolute",
        right: -46,
        top: -46,
        width: 132,
        height: 132,
        borderRadius: 999,
        background: "radial-gradient(circle, rgba(126, 221, 214, 0.18), transparent 64%)",
        pointerEvents: "none",
    },
    heroCompact: {
        minHeight: 156,
        gridTemplateColumns: "minmax(0, 1fr) 82px",
    },
    location: {
        ...borderBox,
        display: "flex",
        alignItems: "center",
        gap: 6,
        maxWidth: "100%",
        color: theme.muted,
        fontSize: 12,
        lineHeight: "16px",
        overflow: "hidden",
    },
    tempLine: {
        display: "flex",
        alignItems: "flex-start",
        gap: 6,
        marginTop: 10,
    },
    temp: {
        color: theme.text,
        fontSize: 68,
        fontWeight: 800,
        lineHeight: 0.9,
    },
    tempCompact: {
        fontSize: 54,
    },
    unit: {
        color: theme.muted,
        fontSize: 16,
        lineHeight: "18px",
        paddingTop: 6,
    },
    condition: {
        marginTop: 8,
        color: theme.text,
        fontSize: 17,
        lineHeight: "21px",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
    },
    updated: {
        marginTop: 7,
        color: theme.quiet,
        fontSize: 11,
        lineHeight: "14px",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
    },
    iconDisc: {
        ...borderBox,
        justifySelf: "end",
        display: "grid",
        placeItems: "center",
        width: 98,
        height: 98,
        borderRadius: 999,
        border: `1px solid ${theme.line}`,
        background: "radial-gradient(circle at 32% 24%, rgba(255,255,255,0.2), transparent 24%), rgba(255,255,255,0.055)",
        overflow: "hidden",
    },
    iconDiscCompact: {
        width: 76,
        height: 76,
    },
    metricGrid: {
        ...borderBox,
        display: "grid",
        gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
        gap: 6,
        width: "100%",
    },
    metric: {
        ...borderBox,
        minWidth: 0,
        minHeight: 58,
        padding: 9,
        borderRadius: 8,
        border: `1px solid ${theme.line}`,
        background: theme.panel,
        overflow: "hidden",
        transition: "border-color 260ms ease, background 260ms ease",
    },
    metricIcon: {
        display: "flex",
        color: theme.accent,
        marginBottom: 4,
    },
    metricLabel: {
        color: theme.quiet,
        fontSize: 10,
        lineHeight: "12px",
        textTransform: "uppercase",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
    },
    metricValue: {
        color: theme.text,
        fontSize: 13,
        lineHeight: "16px",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
    },
    forecastCard: {
        ...borderBox,
        display: "grid",
        gridTemplateColumns: "32px minmax(0, 1fr) 32px",
        alignItems: "center",
        gap: 8,
        width: "100%",
        minHeight: 86,
        padding: "10px",
        borderRadius: 8,
        border: `1px solid ${theme.line}`,
        background: theme.panel,
        overflow: "hidden",
    },
    forecastLabel: {
        color: theme.text,
        fontSize: 15,
        lineHeight: "18px",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
    },
    forecastCondition: {
        marginTop: 2,
        color: theme.text,
        fontSize: 13,
        lineHeight: "16px",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
    },
    forecastMeta: {
        marginTop: 4,
        color: theme.muted,
        fontSize: 11,
        lineHeight: "14px",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
    },
    hourlySection: {
        ...borderBox,
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 6,
        overflow: "hidden",
    },
    hourlyHead: {
        ...borderBox,
        display: "grid",
        gridTemplateColumns: "minmax(0, 1fr) auto",
        alignItems: "center",
        gap: 8,
        width: "100%",
    },
    hourlyPager: {
        ...borderBox,
        display: "grid",
        gridTemplateColumns: "32px minmax(0, 1fr) 32px",
        alignItems: "center",
        gap: 6,
        width: "100%",
        overflow: "hidden",
    },
    hourlyGrid: {
        ...borderBox,
        display: "grid",
        gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
        gap: 6,
        width: "100%",
    },
    hourlyCard: {
        ...borderBox,
        minHeight: 64,
        padding: 7,
        borderRadius: 8,
        border: `1px solid ${theme.line}`,
        background: theme.panel,
        overflow: "hidden",
        textAlign: "center",
        transition: "border-color 260ms ease, background 260ms ease, opacity 260ms ease",
    },
    hourlyTime: {
        color: theme.quiet,
        fontSize: 10,
        lineHeight: "12px",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
    },
    hourlyTemp: {
        color: theme.text,
        fontSize: 12,
        lineHeight: "15px",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
    },
    actions: {
        ...borderBox,
        display: "grid",
        gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
        gap: 6,
        width: "100%",
    },
    card: {
        ...borderBox,
        display: "flex",
        flexDirection: "column",
        gap: 10,
        width: "100%",
        padding: 12,
        borderRadius: 8,
        border: `1px solid ${theme.line}`,
        background: theme.panel,
        overflow: "hidden",
    },
    fieldLabel: {
        color: theme.muted,
        fontSize: 12,
        lineHeight: "16px",
        textTransform: "uppercase",
    },
    input: {
        ...borderBox,
        width: "100%",
        height: 42,
        padding: "0 12px",
        borderRadius: 8,
        border: `1px solid ${theme.line}`,
        background: "rgba(0,0,0,0.26)",
        color: theme.text,
        outline: "none",
        font: "inherit",
        fontSize: 14,
    },
    status: {
        ...borderBox,
        display: "flex",
        alignItems: "center",
        gap: 8,
        width: "100%",
        minHeight: 44,
        padding: 10,
        borderRadius: 8,
        border: `1px solid ${theme.line}`,
        background: theme.panel,
        color: theme.muted,
        fontSize: 12,
        lineHeight: "16px",
        overflow: "hidden",
    },
    loading: {
        ...borderBox,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        width: "100%",
        minHeight: 156,
        padding: 14,
        borderRadius: 8,
        border: `1px solid ${theme.line}`,
        background: theme.panel,
        color: theme.muted,
        fontSize: 12,
        textAlign: "center",
    },
    ellipsis: {
        minWidth: 0,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
    },
};
function cx(...items) {
    return Object.assign({}, ...items.filter(Boolean));
}
function unitLabel(unit) {
    return unit.replace("deg", DEGREE);
}
function translate(language, key) {
    return TRANSLATIONS[language]?.[key] ?? TRANSLATIONS.en[key];
}
function normalizeLanguage(locale) {
    const value = (locale || "").replace("_", "-").toLowerCase();
    if (value.startsWith("pt-br")) {
        return "pt-BR";
    }
    if (value.startsWith("it"))
        return "it";
    if (value.startsWith("fr"))
        return "fr";
    if (value.startsWith("es"))
        return "es";
    if (value.startsWith("pt"))
        return "pt";
    if (value.startsWith("de"))
        return "de";
    if (value.startsWith("nl"))
        return "nl";
    if (value.startsWith("uk") || value.startsWith("ua"))
        return "uk";
    if (value.startsWith("zh"))
        return "zh";
    if (value.startsWith("ja"))
        return "ja";
    return "en";
}
function detectLanguage() {
    const candidates = typeof navigator !== "undefined"
        ? [...(navigator.languages || []), navigator.language]
        : [];
    for (const candidate of candidates) {
        const language = normalizeLanguage(candidate);
        if (language !== "en" || candidate?.toLowerCase().startsWith("en")) {
            return language;
        }
    }
    return "en";
}
function conditionLabel(weatherCode, language) {
    const key = WEATHER_CODE_KEYS[weatherCode] ?? "variable";
    return CONDITION_LABELS[language]?.[key] ?? CONDITION_LABELS.en[key];
}
function formatError(error, t) {
    return error instanceof Error ? error.message : String(error || t("unknownError"));
}
function formatTemp(value) {
    return Math.round(value).toString();
}
function capitalizeDateLabel(value) {
    return value
        .split(" ")
        .map((part) => (part ? `${part.charAt(0).toUpperCase()}${part.slice(1)}` : part))
        .join(" ");
}
function formatDay(date, index, language, t) {
    if (index === 0) {
        return t("today");
    }
    return capitalizeDateLabel(new Intl.DateTimeFormat(APP_LOCALES[language], {
        weekday: "long",
        day: "numeric",
        month: "long",
    }).format(new Date(`${date}T12:00:00`)));
}
function formatUpdatedAt(isoDate, language) {
    return isoDate
        ? new Intl.DateTimeFormat(APP_LOCALES[language], {
            hour: "2-digit",
            minute: "2-digit",
        }).format(new Date(isoDate))
        : "--:--";
}
function weatherIcon(tone, isDay = true, size = 70) {
    const clear = "rgb(164, 236, 232)";
    const cloud = "rgb(230, 237, 240)";
    const rain = "rgb(137, 205, 236)";
    const storm = "rgb(182, 169, 232)";
    if (tone === "clear") {
        return isDay ? SP_JSX.jsx(WiDaySunny, { size: size, color: clear }) : SP_JSX.jsx(WiNightClear, { size: size, color: clear });
    }
    if (tone === "rain") {
        return SP_JSX.jsx(WiRain, { size: size, color: rain });
    }
    if (tone === "storm") {
        return SP_JSX.jsx(WiThunderstorm, { size: size, color: storm });
    }
    if (tone === "snow") {
        return SP_JSX.jsx(WiSnow, { size: size, color: "rgb(236,252,254)" });
    }
    if (tone === "fog") {
        return SP_JSX.jsx(WiFog, { size: size, color: cloud });
    }
    return SP_JSX.jsx(WiCloudy, { size: size, color: cloud });
}
function metricValue(value, unit) {
    return `${Math.round(value)} ${unitLabel(unit)}`;
}
function Button({ children, disabled, iconOnly, onClick, selected, }) {
    const [focused, setFocused] = SP_REACT.useState(false);
    const activate = SP_REACT.useCallback(() => {
        if (!disabled) {
            onClick?.();
        }
    }, [disabled, onClick]);
    return (SP_JSX.jsx(DeckyFocusable, { focusable: !disabled, "flow-children": "row", noFocusRing: true, onBlur: () => setFocused(false), onActivate: activate, onClick: activate, onFocus: () => setFocused(true), onKeyDown: (event) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                activate();
            }
        }, style: {
            ...borderBox,
            ...resetButton,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            width: iconOnly ? 40 : "100%",
            minWidth: 0,
            maxWidth: "100%",
            height: iconOnly ? 40 : 42,
            minHeight: iconOnly ? 40 : 42,
            padding: iconOnly ? 0 : "0 12px",
            borderRadius: 8,
            border: `1px solid ${selected ? theme.lineHot : theme.line}`,
            background: selected ? "rgba(126, 221, 214, 0.14)" : theme.panelRaised,
            color: disabled ? theme.quiet : theme.text,
            opacity: disabled ? 0.45 : 1,
            outline: "none",
            boxShadow: focused && !disabled ? `inset 0 0 0 2px ${theme.lineHot}` : "none",
            cursor: disabled ? "default" : "pointer",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
        }, tabIndex: disabled ? -1 : 0, children: children }));
}
function FocusGroup({ children, direction, style, }) {
    return (SP_JSX.jsx(DeckyFocusable, { "flow-children": direction, focusable: false, noFocusRing: true, style: {
            ...borderBox,
            ...style,
        }, children: children }));
}
function FocusTextInput({ ariaLabel, disabled, onChange, onSubmit, placeholder, value, }) {
    const inputRef = SP_REACT.useRef(null);
    const [focused, setFocused] = SP_REACT.useState(false);
    const focusInput = SP_REACT.useCallback(() => {
        if (!disabled) {
            inputRef.current?.focus();
        }
    }, [disabled]);
    return (SP_JSX.jsx(DeckyFocusable, { focusable: !disabled, noFocusRing: true, onActivate: focusInput, onBlur: () => setFocused(false), onClick: focusInput, onFocus: () => setFocused(true), style: {
            ...borderBox,
            width: "100%",
            maxWidth: "100%",
            height: 42,
            borderRadius: 8,
            border: `1px solid ${focused ? theme.lineHot : theme.line}`,
            background: "rgba(0,0,0,0.26)",
            boxShadow: focused ? `inset 0 0 0 2px ${theme.lineHot}` : "none",
            overflow: "hidden",
        }, tabIndex: disabled ? -1 : 0, children: SP_JSX.jsx("input", { "aria-label": ariaLabel, disabled: disabled, onChange: onChange, onKeyDown: (event) => {
                if (event.key === "Enter") {
                    event.preventDefault();
                    onSubmit();
                }
            }, placeholder: placeholder, ref: inputRef, style: {
                ...styles.input,
                height: "100%",
                border: 0,
                background: "transparent",
            }, value: value }) }));
}
function isTyping(event) {
    const tag = event.target?.tagName;
    return tag === "INPUT" || tag === "TEXTAREA";
}
function Content() {
    const language = SP_REACT.useMemo(() => detectLanguage(), []);
    const t = SP_REACT.useCallback((key) => translate(language, key), [language]);
    const [settings, setSettings] = SP_REACT.useState(DEFAULT_SETTINGS);
    const [draftLocation, setDraftLocation] = SP_REACT.useState(DEFAULT_SETTINGS.location);
    const [weather, setWeather] = SP_REACT.useState(null);
    const [forecastIndex, setForecastIndex] = SP_REACT.useState(0);
    const [view, setView] = SP_REACT.useState("weather");
    const [loading, setLoading] = SP_REACT.useState(true);
    const [saving, setSaving] = SP_REACT.useState(false);
    const [error, setError] = SP_REACT.useState(null);
    const selectedForecast = SP_REACT.useMemo(() => {
        if (!weather?.daily.length) {
            return null;
        }
        return weather.daily[Math.min(forecastIndex, weather.daily.length - 1)];
    }, [forecastIndex, weather]);
    const moveForecast = SP_REACT.useCallback((delta) => {
        if (!weather?.daily.length) {
            return;
        }
        setForecastIndex((current) => Math.max(0, Math.min(weather.daily.length - 1, current + delta)));
    }, [weather]);
    const withLanguage = SP_REACT.useCallback((nextSettings) => ({ ...nextSettings, language }), [language]);
    const loadWeather = SP_REACT.useCallback(async (nextSettings) => {
        setLoading(true);
        setError(null);
        try {
            const nextWeather = await getWeather(withLanguage(nextSettings));
            setWeather(nextWeather);
            setForecastIndex(0);
        }
        catch (loadError) {
            const message = formatError(loadError, t);
            setError(message);
            toaster.toast({ title: t("weatherUnavailable"), body: message });
        }
        finally {
            setLoading(false);
        }
    }, [t, withLanguage]);
    SP_REACT.useEffect(() => {
        let cancelled = false;
        const boot = async () => {
            try {
                const stored = await getSettings();
                const migrated = stored.location === "Roma" && !stored.location_set
                    ? { ...stored, location: "Milano", language, version: 2 }
                    : { ...DEFAULT_SETTINGS, ...stored, language, version: 2 };
                if (cancelled) {
                    return;
                }
                setSettings(migrated);
                setDraftLocation(migrated.location);
                await loadWeather(migrated);
            }
            catch (bootError) {
                if (!cancelled) {
                    setError(formatError(bootError, t));
                    setLoading(false);
                }
            }
        };
        boot();
        return () => {
            cancelled = true;
        };
    }, [language, loadWeather, t]);
    const persistSettings = SP_REACT.useCallback(async (nextSettings, refreshWeather = true) => {
        setSaving(true);
        setError(null);
        try {
            const saved = await saveSettings({ ...nextSettings, language, version: 2 });
            const localizedSaved = withLanguage(saved);
            setSettings(localizedSaved);
            setDraftLocation(saved.location);
            refreshTopbar().catch(() => undefined);
            if (refreshWeather) {
                await loadWeather(localizedSaved);
            }
            return localizedSaved;
        }
        catch (saveError) {
            const message = formatError(saveError, t);
            setError(message);
            toaster.toast({ title: t("settingsNotSaved"), body: message });
            return null;
        }
        finally {
            setSaving(false);
        }
    }, [language, loadWeather, t, withLanguage]);
    const applyLocation = SP_REACT.useCallback(async () => {
        const location = draftLocation.trim();
        if (!location) {
            toaster.toast({ title: t("emptyLocationTitle"), body: t("emptyLocationBody") });
            return;
        }
        const saved = await persistSettings({ ...settings, location, location_set: true }, true);
        if (saved) {
            setView("weather");
        }
    }, [draftLocation, persistSettings, settings, t]);
    const handleKeyDown = SP_REACT.useCallback((event) => {
        if (isTyping(event) && event.key === "Enter") {
            event.preventDefault();
            applyLocation();
        }
    }, [applyLocation]);
    return (SP_JSX.jsx(DeckyFocusable, { "flow-children": "column", onKeyDown: handleKeyDown, style: styles.shell, tabIndex: 0, children: SP_JSX.jsxs(FocusGroup, { direction: "column", style: styles.stack, children: [view === "settings" && (SP_JSX.jsxs(FocusGroup, { direction: "row", style: styles.topBar, children: [SP_JSX.jsx("div", { style: styles.titleBlock, children: SP_JSX.jsx("div", { style: styles.title, children: t("weatherSettings") }) }), SP_JSX.jsx(Button, { iconOnly: true, onClick: () => setView("weather"), children: SP_JSX.jsx(FiX, {}) })] })), view === "weather" ? (SP_JSX.jsx(WeatherView, { error: error, forecastIndex: forecastIndex, language: language, loading: loading, moveForecast: moveForecast, onRefresh: () => loadWeather(settings), onSettings: () => setView("settings"), saving: saving, selectedForecast: selectedForecast, settings: settings, t: t, weather: weather })) : (SP_JSX.jsx(SettingsView, { draftLocation: draftLocation, error: error, language: language, loading: loading, onApplyLocation: applyLocation, onDraftLocationChange: (event) => setDraftLocation(event.currentTarget.value), onRefresh: () => loadWeather(settings), onToggleCompact: () => persistSettings({ ...settings, compact: !settings.compact }, false), onToggleTopbarLeft: () => persistSettings({ ...settings, topbar_left: !settings.topbar_left }, false), onToggleTopbarWeather: () => persistSettings({ ...settings, topbar_enabled: !settings.topbar_enabled }, false), onUnitsChange: (units) => persistSettings({ ...settings, units }, true), saving: saving, settings: settings, t: t, weather: weather }))] }) }));
}
function WeatherView({ error, forecastIndex, language, loading, moveForecast, onRefresh, onSettings, saving, selectedForecast, settings, t, weather, }) {
    const [lift, setLift] = SP_REACT.useState(false);
    SP_REACT.useEffect(() => {
        const interval = window.setInterval(() => setLift((current) => !current), 1800);
        return () => window.clearInterval(interval);
    }, []);
    if (loading && !weather) {
        return (SP_JSX.jsxs("div", { style: styles.loading, children: [SP_JSX.jsx(DeckySpinner, { background: "transparent" }), SP_JSX.jsx("span", { children: t("loadingWeather") })] }));
    }
    if (!weather) {
        return (SP_JSX.jsxs(SP_JSX.Fragment, { children: [SP_JSX.jsx(Status, { danger: Boolean(error), children: error || t("noWeatherData") }), SP_JSX.jsx(Button, { selected: true, onClick: onSettings, children: t("openSettings") })] }));
    }
    return (SP_JSX.jsxs(SP_JSX.Fragment, { children: [SP_JSX.jsxs("div", { style: cx(styles.hero, settings.compact && styles.heroCompact, {
                    borderColor: lift ? "rgba(126, 221, 214, 0.22)" : theme.line,
                    boxShadow: lift ? "inset 0 0 36px rgba(126, 221, 214, 0.055)" : "inset 0 0 0 rgba(126, 221, 214, 0)",
                    transition: "border-color 1200ms ease-in-out, box-shadow 1200ms ease-in-out",
                }), children: [SP_JSX.jsx("div", { "aria-hidden": "true", style: {
                            ...styles.heroGlow,
                            opacity: lift ? 0.92 : 0.52,
                            transform: lift ? "scale(1.08)" : "scale(0.96)",
                            transition: "opacity 1200ms ease-in-out, transform 1200ms ease-in-out",
                        } }), SP_JSX.jsxs("div", { style: { minWidth: 0 }, children: [SP_JSX.jsxs("div", { style: styles.location, children: [SP_JSX.jsx(FiMapPin, { style: { flex: "0 0 auto" } }), SP_JSX.jsxs("span", { style: styles.ellipsis, children: [weather.location, weather.country ? `, ${weather.country}` : ""] })] }), SP_JSX.jsxs("div", { style: styles.tempLine, children: [SP_JSX.jsx("div", { style: cx(styles.temp, settings.compact && styles.tempCompact), children: formatTemp(weather.current.temperature) }), SP_JSX.jsx("div", { style: styles.unit, children: unitLabel(weather.units.temperature) })] }), SP_JSX.jsx("div", { style: styles.condition, children: conditionLabel(weather.current.weather_code, language) }), SP_JSX.jsxs("div", { style: styles.updated, children: [formatUpdatedAt(weather.updated_at, language), " ", MIDDOT, " ", weather.source] })] }), SP_JSX.jsx("div", { style: cx(styles.iconDisc, settings.compact && styles.iconDiscCompact, {
                            transform: lift ? "translateY(-4px)" : "translateY(0)",
                            transition: "transform 1200ms ease-in-out",
                        }), children: weatherIcon(weather.current.tone, weather.current.is_day, settings.compact ? 56 : 76) })] }), !settings.compact && (SP_JSX.jsxs(FocusGroup, { direction: "row", style: styles.metricGrid, children: [SP_JSX.jsx(Metric, { icon: SP_JSX.jsx(FiThermometer, {}), label: t("apparent"), value: `${formatTemp(weather.current.apparent)}${unitLabel(weather.units.temperature)}` }), SP_JSX.jsx(Metric, { icon: SP_JSX.jsx(FiWind, {}), label: t("wind"), value: metricValue(weather.current.wind, weather.units.wind) }), SP_JSX.jsx(Metric, { icon: SP_JSX.jsx(FiDroplet, {}), label: t("humidity"), value: `${weather.current.humidity}%` })] })), SP_JSX.jsxs(FocusGroup, { direction: "row", style: styles.forecastCard, children: [SP_JSX.jsx(Button, { iconOnly: true, disabled: forecastIndex === 0, onClick: () => moveForecast(-1), children: SP_JSX.jsx(FiChevronLeft, {}) }), SP_JSX.jsxs("div", { style: { minWidth: 0 }, children: [SP_JSX.jsx("div", { style: styles.forecastLabel, children: selectedForecast ? formatDay(selectedForecast.date, forecastIndex, language, t) : t("forecast") }), SP_JSX.jsx("div", { style: styles.forecastCondition, children: selectedForecast ? conditionLabel(selectedForecast.weather_code, language) : t("noForecast") }), SP_JSX.jsx("div", { style: styles.forecastMeta, children: selectedForecast
                                    ? `${t("max")} ${formatTemp(selectedForecast.temp_max)}${unitLabel(weather.units.temperature)} ${MIDDOT} ${t("min")} ${formatTemp(selectedForecast.temp_min)}${unitLabel(weather.units.temperature)} ${MIDDOT} ${t("rain")} ${selectedForecast.precipitation_probability}%`
                                    : t("noForecast") })] }), SP_JSX.jsx(Button, { iconOnly: true, disabled: !weather.daily.length || forecastIndex === weather.daily.length - 1, onClick: () => moveForecast(1), children: SP_JSX.jsx(FiChevronRight, {}) })] }), !settings.compact && SP_JSX.jsx(HourlyForecast, { hours: weather.hourly, t: t, unit: weather.units.temperature }), SP_JSX.jsxs(FocusGroup, { direction: "row", style: styles.actions, children: [SP_JSX.jsxs(Button, { disabled: loading || saving, onClick: onRefresh, children: [SP_JSX.jsx(FiRefreshCw, {}), " ", t("refresh")] }), SP_JSX.jsxs(Button, { selected: true, onClick: onSettings, children: [SP_JSX.jsx(FiSettings, {}), " ", t("settings")] })] })] }));
}
function Metric({ icon, label, value }) {
    return (SP_JSX.jsxs("div", { style: styles.metric, children: [SP_JSX.jsx("div", { style: styles.metricIcon, children: icon }), SP_JSX.jsx("div", { style: styles.metricLabel, children: label }), SP_JSX.jsx("div", { style: styles.metricValue, children: value })] }));
}
function HourlyForecast({ hours, t, unit }) {
    const [hourIndex, setHourIndex] = SP_REACT.useState(0);
    SP_REACT.useEffect(() => {
        setHourIndex(0);
    }, [hours]);
    if (!hours?.length) {
        return null;
    }
    const visibleCount = 4;
    const maxIndex = Math.max(0, hours.length - visibleCount);
    const visibleHours = hours.slice(hourIndex, hourIndex + visibleCount);
    const moveHours = (delta) => {
        setHourIndex((current) => Math.max(0, Math.min(maxIndex, current + delta)));
    };
    return (SP_JSX.jsxs("div", { style: styles.hourlySection, children: [SP_JSX.jsxs(FocusGroup, { direction: "row", style: styles.hourlyHead, children: [SP_JSX.jsx("div", { style: styles.fieldLabel, children: t("hourlyForecast") }), SP_JSX.jsxs("div", { style: { color: theme.quiet, fontSize: 10, lineHeight: "12px", whiteSpace: "nowrap" }, children: [hourIndex + 1, "-", Math.min(hourIndex + visibleCount, hours.length), " / ", hours.length] })] }), SP_JSX.jsxs(FocusGroup, { direction: "row", style: styles.hourlyPager, children: [SP_JSX.jsx(Button, { iconOnly: true, disabled: hourIndex === 0, onClick: () => moveHours(-visibleCount), children: SP_JSX.jsx(FiChevronLeft, {}) }), SP_JSX.jsx("div", { style: styles.hourlyGrid, children: visibleHours.map((hour) => (SP_JSX.jsxs("div", { style: {
                                ...styles.hourlyCard,
                                transform: "translateY(0)",
                            }, children: [SP_JSX.jsx("div", { style: styles.hourlyTime, children: hour.hour }), SP_JSX.jsx("div", { style: { display: "grid", placeItems: "center", height: 24, overflow: "hidden" }, children: weatherIcon(hour.tone, true, 26) }), SP_JSX.jsxs("div", { style: styles.hourlyTemp, children: [formatTemp(hour.temperature), unitLabel(unit)] })] }, hour.time))) }), SP_JSX.jsx(Button, { iconOnly: true, disabled: hourIndex >= maxIndex, onClick: () => moveHours(visibleCount), children: SP_JSX.jsx(FiChevronRight, {}) })] })] }));
}
function Status({ children, danger }) {
    return (SP_JSX.jsx("div", { style: {
            ...styles.status,
            borderColor: danger ? "rgba(255, 196, 196, 0.3)" : theme.line,
            color: danger ? theme.danger : theme.muted,
        }, children: SP_JSX.jsx("span", { style: styles.ellipsis, children: children }) }));
}
function PluginIcon() {
    return SP_JSX.jsx(FiSun, {});
}
function SettingsView({ draftLocation, error, language, loading, onApplyLocation, onDraftLocationChange, onRefresh, onToggleCompact, onToggleTopbarLeft, onToggleTopbarWeather, onUnitsChange, saving, settings, t, weather, }) {
    return (SP_JSX.jsxs(SP_JSX.Fragment, { children: [SP_JSX.jsxs("div", { style: styles.card, children: [SP_JSX.jsxs("div", { children: [SP_JSX.jsx("div", { style: styles.fieldLabel, children: t("location") }), SP_JSX.jsx(FocusTextInput, { ariaLabel: t("weatherLocation"), disabled: saving, onChange: onDraftLocationChange, onSubmit: onApplyLocation, placeholder: t("locationPlaceholder"), value: draftLocation })] }), SP_JSX.jsxs(Button, { disabled: saving || !draftLocation.trim(), selected: true, onClick: onApplyLocation, children: [SP_JSX.jsx(FiMapPin, {}), " ", t("saveLocation")] })] }), SP_JSX.jsxs("div", { style: styles.card, children: [SP_JSX.jsx("div", { style: styles.fieldLabel, children: t("unitsAndLayout") }), SP_JSX.jsxs(FocusGroup, { direction: "row", style: styles.actions, children: [SP_JSX.jsx(Button, { selected: settings.units === "metric", disabled: saving, onClick: () => onUnitsChange("metric"), children: `${DEGREE}C` }), SP_JSX.jsx(Button, { selected: settings.units === "imperial", disabled: saving, onClick: () => onUnitsChange("imperial"), children: `${DEGREE}F` })] }), SP_JSX.jsx(Button, { selected: settings.compact, disabled: saving, onClick: onToggleCompact, children: t("compactLayout") }), SP_JSX.jsx(Button, { selected: settings.topbar_enabled, disabled: saving, onClick: onToggleTopbarWeather, children: t("topBarWeather") }), SP_JSX.jsx(Button, { selected: settings.topbar_left, disabled: saving || !settings.topbar_enabled, onClick: onToggleTopbarLeft, children: t("topBarLeft") })] }), SP_JSX.jsx(Status, { danger: Boolean(error), children: error
                    ? error
                    : weather
                        ? `${t("active")}: ${weather.location} ${MIDDOT} ${formatUpdatedAt(weather.updated_at, language)}`
                        : t("defaultCity") }), SP_JSX.jsxs(Button, { disabled: loading || saving, onClick: onRefresh, children: [SP_JSX.jsx(FiRefreshCw, {}), " ", t("refreshNow")] })] }));
}
var index = definePlugin(() => ({
    name: "Weather",
    titleView: SP_JSX.jsx("div", { className: DFL.staticClasses.Title, children: "Weather" }),
    content: SP_JSX.jsx(Content, {}),
    icon: SP_JSX.jsx(PluginIcon, {}),
    alwaysRender: true,
}));

export { index as default };
//# sourceMappingURL=index.js.map
