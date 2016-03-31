define [
  "knockout"
  "crossroads"
  "hasher"
], (ko, crossroads, hasher) ->

  # This module configures crossroads.js, a routing library. If you prefer, you
  # can use any other routing library (or none at all) as Knockout is designed to
  # compose cleanly with external libraries.
  #
  # You *don't* have to follow the pattern established here (each route entry
  # specifies a 'page', which is a Knockout component) - there's nothing built into
  # Knockout that requires or even knows about this technique. It's just one of
  # many possible ways of setting up client-side routes.
  Router = (config) ->
    currentRoute = @currentRoute = ko.observable({})
    ko.utils.arrayForEach config.routes, (route) ->
      crossroads.addRoute route.url, (requestParams) ->
        currentRoute ko.utils.extend(requestParams, route.params)
        return

      return

    activateCrossroads()
    return
  activateCrossroads = ->
    parseHash = (newHash, oldHash) ->
      crossroads.parse newHash
      return
    crossroads.normalizeFn = crossroads.NORM_AS_OBJECT
    hasher.initialized.add parseHash
    hasher.changed.add parseHash
    hasher.init()
    return
  return new Router(routes: [
    {
      url: ""
      params:
        page: "home-page"
    }
  ])
  return

