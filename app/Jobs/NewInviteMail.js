'use strict'

const Mail = use('Mail')

class NewInviteMail {
  static get concurrency () {
    return 1
  }

  static get key () {
    return 'NewInviteMail-job'
  }

  async handle ({ email, title, location, date, user }) {
    console.log(`Job: ${NewInviteMail.key}`)

    await Mail.send(
      ['emails.invite'],
      {
        title,
        location,
        date,
        user
      },
      message => {
        message
          .to(email)
          .from('henrique.pereira@gmail.com', 'Henrique | GoNode')
          .subject('Convite para evento')
      }
    )
  }
}

module.exports = NewInviteMail
