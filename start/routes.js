'use strict'

const Route = use('Route')

Route.post('/users', 'UserController.store').validator('User')
Route.post('/sessions', 'SessionController.store').validator('Session')

Route.group(() => {
  Route.put('/users', 'UserController.update').validator('UpdateUser')

  Route.resource('/events', 'EventController')
    .apiOnly()
    .validator(new Map([[['/events.store'], ['CreateEvent']]]))

  Route.post('/invite/:id', 'InviteController.create').validator('InviteEvent')
}).middleware(['auth'])
