define [
  "knockout"
  "text!./<%= filename %>.html"
], (ko, templateMarkup) ->

  class <%= viewModelClassName %>
    constructor: (params) ->
      @message = ko.observable("Hello from the <%= name %> component!")
      # This runs when the component is torn down. Put here any logic necessary to clean up,
      # for example cancelling setTimeouts or disposing Knockout subscriptions/computeds.
      @dispose = ->


  viewModel: <%= viewModelClassName %>
  template: templateMarkup
