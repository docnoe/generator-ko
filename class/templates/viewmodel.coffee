define [
  "knockout"
], (ko) ->

  class <%= viewModelClassName %>
    constructor: (params) ->
      @message = ko.observable("Hello from the <%= name %> class!")
