define(['knockout', 'text!./<%= filename %>.html'], function(ko, templateMarkup) {

   return function <%= viewModelClassName %>(params) {
    this.message = ko.observable('Hello from the <%= name %> class!');
  }

});
