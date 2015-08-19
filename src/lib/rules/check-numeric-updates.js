'use strict';

var utils = require('../utils');

function eMQCheckNumericUpdates(context) {

  return utils.lookupCall(context, utils.CALL_PATTERNS.UPDATE,
    function(callSource, args) {
      if((!args[1]) || 'ObjectExpression' !== args[1].type) {
        context.report(args[1], 'Expected ' + callSource +
          ' call second argument value to be an object.');
        return false;
      }
      if(!args[1].properties.length) {
        return false;
      }
      return utils.everyProperties(args[1], [/\$mul|\$inc/], function(property) {
        if('ObjectExpression' !== property.value.type) {
          context.report(property, 'Expected ' + property.key.name +
            ' operator value to be an object.');
          return false;
        }
        return property.value.properties.every(function(propertyNode) {
          if((!utils.nodeIsDynamic(propertyNode.value)) &&
            !utils.nodeWillBeNumber(propertyNode.value)) {
            context.report(propertyNode, property.key.name +
              ' operator require numbers (key: ' + propertyNode.key.name + ').');
            return false;
          }
          return true;
        });
      });
    }
  );

}

module.exports = eMQCheckNumericUpdates;
