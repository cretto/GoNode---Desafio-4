'use strict'

const Event = use('App/Models/Event')
const moment = use('moment')
const Kue = use('Kue')
const Job = use('App/jobs/NewInviteMail')

class InviteController {
  async create ({ params, request, response, auth }) {
    try {
      const email = request.input('email')

      const event = await Event.findOrFail(params.id)

      if (moment().isAfter(event.date)) {
        return response.status(400).send({
          error: { message: 'You do not invite someone for a past event' }
        })
      }

      const { title, location, date } = event

      Kue.dispatch(
        Job.key,
        {
          email,
          title,
          location,
          date,
          user: auth.user.name
        },
        { attempts: 3 }
      )

      return response.send(200)
    } catch (error) {
      return response
        .status(error.status || 400)
        .send({ error: { message: 'Something went wrong!' } })
    }
  }
}

module.exports = InviteController
