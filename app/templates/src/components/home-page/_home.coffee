define [
	"knockout"
	"text!./home.html"
], (ko, homeTemplate) ->

	class HomeViewModel
		constructor: (route) ->
			@message = ko.observable('Welcome to <%= longName.replace("'", "\\ '") %>!');

		doSomething: ->
			@message "You invoked doSomething() on the viewmodel."

	viewModel: HomeViewModel
	template: homeTemplate