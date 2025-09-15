"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/redux-thunk";
exports.ids = ["vendor-chunks/redux-thunk"];
exports.modules = {

/***/ "(ssr)/./node_modules/redux-thunk/dist/redux-thunk.mjs":
/*!*******************************************************!*\
  !*** ./node_modules/redux-thunk/dist/redux-thunk.mjs ***!
  \*******************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   thunk: () => (/* binding */ thunk),\n/* harmony export */   withExtraArgument: () => (/* binding */ withExtraArgument)\n/* harmony export */ });\n// src/index.ts\r\nfunction createThunkMiddleware(extraArgument) {\r\n  const middleware = ({ dispatch, getState }) => (next) => (action) => {\r\n    if (typeof action === \"function\") {\r\n      return action(dispatch, getState, extraArgument);\r\n    }\r\n    return next(action);\r\n  };\r\n  return middleware;\r\n}\r\nvar thunk = createThunkMiddleware();\r\nvar withExtraArgument = createThunkMiddleware;\r\n\r\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvcmVkdXgtdGh1bmsvZGlzdC9yZWR1eC10aHVuay5tanMiLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQTtBQUNBO0FBQ0Esd0JBQXdCLG9CQUFvQjtBQUM1QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFJRSIsInNvdXJjZXMiOlsiRDpcXERTUHJvamVjdHNcXGFpZHNcXGFpLWRhdGEtc2NpZW50aXN0XFxmcm9udGVuZFxcbm9kZV9tb2R1bGVzXFxyZWR1eC10aHVua1xcZGlzdFxccmVkdXgtdGh1bmsubWpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIHNyYy9pbmRleC50c1xyXG5mdW5jdGlvbiBjcmVhdGVUaHVua01pZGRsZXdhcmUoZXh0cmFBcmd1bWVudCkge1xyXG4gIGNvbnN0IG1pZGRsZXdhcmUgPSAoeyBkaXNwYXRjaCwgZ2V0U3RhdGUgfSkgPT4gKG5leHQpID0+IChhY3Rpb24pID0+IHtcclxuICAgIGlmICh0eXBlb2YgYWN0aW9uID09PSBcImZ1bmN0aW9uXCIpIHtcclxuICAgICAgcmV0dXJuIGFjdGlvbihkaXNwYXRjaCwgZ2V0U3RhdGUsIGV4dHJhQXJndW1lbnQpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIG5leHQoYWN0aW9uKTtcclxuICB9O1xyXG4gIHJldHVybiBtaWRkbGV3YXJlO1xyXG59XHJcbnZhciB0aHVuayA9IGNyZWF0ZVRodW5rTWlkZGxld2FyZSgpO1xyXG52YXIgd2l0aEV4dHJhQXJndW1lbnQgPSBjcmVhdGVUaHVua01pZGRsZXdhcmU7XHJcbmV4cG9ydCB7XHJcbiAgdGh1bmssXHJcbiAgd2l0aEV4dHJhQXJndW1lbnRcclxufTtcclxuIl0sIm5hbWVzIjpbXSwiaWdub3JlTGlzdCI6WzBdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/redux-thunk/dist/redux-thunk.mjs\n");

/***/ })

};
;