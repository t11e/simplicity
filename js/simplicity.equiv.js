/**
 * @name $.simplicity.equiv
 * @function
 * @description
 *
 * Deep equality checker.
 *
 * @see Ported from http://philrathe.com/articles/equiv.
 *
 * @param lhs The first object to be compared
 * @param rhs The second object to be compared
 *
 */
(function ($) {
  // Determine what is o.
  function hoozit(o) {
    if (o.constructor === String) {
      return "string";

    } else if (o.constructor === Boolean) {
      return "boolean";

    } else if (o.constructor === Number) {

      if (isNaN(o)) {
        return "nan";
      } else {
        return "number";
      }

    } else if (typeof o === "undefined") {
      return "undefined";

    // consider: typeof null === object
    } else if (o === null) {
      return "null";

    // consider: typeof [] === object
    } else if (o instanceof Array) {
      return "array";

    // consider: typeof new Date() === object
    } else if (o instanceof Date) {
      return "date";

    // consider: /./ instanceof Object;
    //       /./ instanceof RegExp;
    //      typeof /./ === "function"; // => false in IE and Opera,
    //                      true in FF and Safari
    } else if (o instanceof RegExp) {
      return "regexp";

    } else if (typeof o === "object") {
      return "object";

    } else if (o instanceof Function) {
      return "function";
    } else {
      return undefined;
    }
  }

  // Call the o related callback with the given arguments.
  function bindCallbacks(o, callbacks, args) {
    var prop = hoozit(o);
    if (prop) {
      if (hoozit(callbacks[prop]) === "function") {
        return callbacks[prop].apply(callbacks, args);
      } else {
        return callbacks[prop]; // or undefined
      }
    }
  }


  // Test for equality any JavaScript type.
  // Discussions and reference: http://philrathe.com/articles/equiv
  // Test suites: http://philrathe.com/tests/equiv
  // Author: Philippe Rathé <prathe@gmail.com>

  /*jslint immed: false */
  var equiv = function () {

    var innerEquiv; // the real equiv function
    var callers = []; // stack to decide between skip/abort functions


    var callbacks = function () {

      // for string, boolean, number and null
      function useStrictEquality(b, a) {
        if (b instanceof a.constructor || a instanceof b.constructor) {
          // to catch short annotaion VS 'new' annotation of a declaration
          // e.g. var i = 1;
          //    var j = new Number(1);
          /*jslint eqeqeq: false */
          /*jshint eqeqeq: false */
          return a == b;
        } else {
          return a === b;
        }
      }

      return {
        "string": useStrictEquality,
        "boolean": useStrictEquality,
        "number": useStrictEquality,
        "null": useStrictEquality,
        "undefined": useStrictEquality,

        "nan": function (b) {
          return isNaN(b);
        },

        "date": function (b, a) {
          return hoozit(b) === "date" && a.valueOf() === b.valueOf();
        },

        "regexp": function (b, a) {
          return hoozit(b) === "regexp" &&
            a.source === b.source && // the regex itself
            a.global === b.global && // and its modifers (gmi) ...
            a.ignoreCase === b.ignoreCase &&
            a.multiline === b.multiline;
        },

        // - skip when the property is a method of an instance (OOP)
        // - abort otherwise,
        //   initial === would have catch identical references anyway
        "function": function () {
          var caller = callers[callers.length - 1];
          return caller !== Object &&
              typeof caller !== "undefined";
        },

        "array": function (b, a) {
          var i;
          var len;

          // b could be an object literal here
          if (hoozit(b) !== "array") {
            return false;
          }

          len = a.length;
          if (len !== b.length) { // safe and faster
            return false;
          }
          for (i = 0; i < len; i += 1) {
            if (!innerEquiv(a[i], b[i])) {
              return false;
            }
          }
          return true;
        },

        "object": function (b, a) {
          var i;
          var eq = true; // unless we can proove it
          var aProperties = [], bProperties = []; // collection of strings

          // comparing constructors is more strict than using instanceof
          if (a.constructor !== b.constructor) {
            return false;
          }

          // stack constructor before traversing properties
          callers.push(a.constructor);

          for (i in a) { // be strict: don't ensures hasOwnProperty and go deep

            aProperties.push(i); // collect a's properties

            if (!innerEquiv(a[i], b[i])) {
              eq = false;
            }
          }

          callers.pop(); // unstack, we are done

          for (i in b) {
            bProperties.push(i); // collect b's properties
          }

          // Ensures identical properties name
          return eq && innerEquiv(aProperties.sort(), bProperties.sort());
        }
      };
    }();

    innerEquiv = function () { // can take multiple arguments
      var args = Array.prototype.slice.apply(arguments);
      if (args.length < 2) {
        return true; // end transition
      }

      return (function (a, b) {
        if (a === b) {
          return true; // catch the most you can
        } else if (a === null || b === null || typeof a === "undefined" || typeof b === "undefined" || hoozit(a) !== hoozit(b)) {
          return false; // don't lose time with error prone cases
        } else {
          return bindCallbacks(a, callbacks, [b, a]);
        }

      // apply transition with (1..n) arguments
      })(args[0], args[1]) && arguments.callee.apply(this, args.splice(1, args.length - 1));
    };

    return innerEquiv;

  }();

  $.simplicity = $.simplicity || {};
  $.simplicity.equiv = equiv;
}(jQuery));
