'use strict'

const Event = use('App/Models/Event')
const moment = require('moment')

class EventController {
  async index ({ request, auth }) {
    const { page } = request.get()

    const events = await Event.query()
      .with('user')
      .where('user_id', auth.user.id)
      .orderBy('date', 'asc')
      .paginate(page)

    return events
  }

  async store ({ request, response, auth }) {
    const data = request.only(['title', 'location', 'date'])

    const otherEvent = await Event.query()
      .where({
        user_id: auth.user.id,
        date: data.date
      })
      .first()

    if (otherEvent) {
      return response.status(400).send({
        error: { message: 'You already have an event this date' }
      })
    }

    const event = await Event.create({ ...data, user_id: auth.user.id })

    return event
  }

  async show ({ params, response, auth }) {
    const event = await Event.findOrFail(params.id)

    if (event.user_id !== auth.user.id) {
      return response.status(400).send({
        error: { message: 'You do not have permission to show this event' }
      })
    }

    await event.load('user')

    return event
  }

  async update ({ params, request, response, auth }) {
    const event = await Event.findOrFail(params.id)

    if (event.user_id !== auth.user.id) {
      return response.status(400).send({
        error: { message: 'You do not have permission to update this event' }
      })
    }

    if (moment().isAfter(event.date)) {
      return response.status(400).send({
        error: { message: 'You do not have permission to update past event' }
      })
    }

    const data = request.only(['title', 'location', 'date'])

    event.merge(data)

    await event.save()

    return event
  }

  async destroy ({ params, response, auth }) {
    const event = await Event.findOrFail(params.id)

    if (event.user_id !== auth.user.id) {
      return response.status(400).send({
        error: { message: 'You do not have permission to delete this event' }
      })
    }

    if (moment().isAfter(event.date)) {
      return response.status(400).send({
        error: { message: 'You do not have permission to delete past event' }
      })
    }

    await event.delete()
  }
}

module.exports = EventController
