define [
  "knockout"
], (ko) ->

  class <%= viewModelClassName %>
    constructor: (params) ->
      @message = ko.observable("Hello from the <%= name %> singleton!")

  return new <%= viewModelClassName %>()