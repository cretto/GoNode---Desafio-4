'use strict'

const User = use('App/Models/User')
const Hash = use('Hash')

class UserController {
  async store ({ request }) {
    const data = request.only(['name', 'email', 'password'])

    const user = await User.create(data)

    return user
  }

  async update ({ request, response, auth }) {
    try {
      const { name, password, old_password: oldPassword } = request.all()

      const user = await User.findByOrFail('id', auth.user.id)

      if (oldPassword && !password) {
        return response
          .status(400)
          .send({ error: { message: 'The new password does not be empty' } })
      }

      if (!(await Hash.verify(oldPassword, user.password))) {
        return response
          .status(400)
          .send({ error: { message: 'The old password does not match' } })
      }

      if (name) user.name = name
      if (password) user.password = password

      await user.save()

      return user
    } catch (error) {
      return response
        .status(error.status)
        .send({ error: { message: 'Something went wrong!' } })
    }
  }
}

module.exports = UserController
