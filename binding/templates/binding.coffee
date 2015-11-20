define [
  "knockout"
], (ko) ->
  ko.bindingHandlers.<%= name %> =
    init: (element, valueAccessor) ->
      console.log valueAccessor()
