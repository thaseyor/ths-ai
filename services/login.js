'use strict'

import api from '#root/api.js'
import input from 'input'

import { phone } from '#root/config.js'

export const getUser = async () => {
  try {
    const user = await api.call('users.getFullUser', {
      id: {
        _: 'inputUserSelf',
      },
    })

    return user
  } catch (error) {
    return null
  }
}

const signIn = async ({ phone, phone_code_hash }) => {
  return api.call('auth.signIn', {
    phone_code: await input.text('Phone code: '),
    phone_number: phone,
    phone_code_hash,
  })
}

const sendCode = (phone) => {
  return api.call('auth.sendCode', {
    phone_number: phone,
    settings: {
      _: 'codeSettings',
    },
  })
}

const getPassword = () => {
  return api.call('account.getPassword')
}

const checkPassword = ({ srp_id, A, M1 }) => {
  return api.call('auth.checkPassword', {
    password: {
      _: 'inputCheckPasswordSRP',
      srp_id,
      A,
      M1,
    },
  })
}

export const login = async () => {
  const { phone_code_hash } = await sendCode(phone)

  try {
    const signInResult = await signIn({
      phone,
      phone_code_hash,
    })

    if (signInResult._ === 'auth.authorizationSignUpRequired') {
      await signUp({
        phone,
        phone_code_hash,
      })
    }
  } catch (error) {
    if (error.error_message !== 'SESSION_PASSWORD_NEEDED') {
      console.log(`error:`, error)
      return
    }

    // 2FA
    const { srp_id, current_algo, srp_B } = await getPassword()
    const { g, p, salt1, salt2 } = current_algo

    const { A, M1 } = await api.mtproto.crypto.getSRPParams({
      g,
      p,
      salt1,
      salt2,
      gB: srp_B,
      password: await input.text('Password: '),
    })

    await checkPassword({ srp_id, A, M1 })
  }
}
