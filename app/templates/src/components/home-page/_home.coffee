define [
	"knockout"
	"text!./home.html"
], (ko, homeTemplate) ->
	HomeViewModel = (route) ->
    @message = ko.observable('Welcome to <%= longName.replace("'", "\\ '") %>!');

	HomeViewModel::doSomething = ->
		@message "You invoked doSomething() on the viewmodel."
		return

		viewModel: HomeViewModel
		template: homeTemplate

