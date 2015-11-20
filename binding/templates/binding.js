define(["knockout"], function(ko) {
  return ko.bindingHandlers.<%= name %> = {
    init: function(element, valueAccessor) {
      return console.log(valueAccessor());
    }
  };
});