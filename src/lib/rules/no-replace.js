'use strict';

var utils = require('../utils');

function eMQNoReplace(context) {

  return utils.lookupCall(context, utils.CALL_PATTERNS.UPDATE,
    function(callSource, args) {
      if((!args[1])) {
        return false;
      }
      return utils.everyProperties(args[1], [/[^\$].*/], function(property) {
        if(0 !== property.key.name.indexOf('$')) {
          context.report(property, 'Raw update of a complete collection entry.');
          return false;
        }
      });
    }
  );

}

module.exports = eMQNoReplace;
