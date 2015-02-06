define(['knockout', 'text!./<%= filename %>.html'], function(ko, templateMarkup) {

  function <%= viewModelClassName %>(params) {
    this.message = ko.observable('Hello from the <%= name %> component!');
  }

  return <%= viewModelClassName %>

});
