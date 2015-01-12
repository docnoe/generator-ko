define [
	"knockout"
	"text!./nav-bar.html"
], (ko, template) ->
	NavBarViewModel = (params) ->

		# This viewmodel doesn't do anything except pass through the 'route' parameter to the view.
		# You could remove this viewmodel entirely, and define 'nav-bar' as a template-only component.
		# But in most apps, you'll want some viewmodel logic to determine what navigation options appear.
		@route = params.route
		return
		viewModel: NavBarViewModel
		template: template

