'use strict'

import { getUser, login } from '#root/services/login.js'

import { startListeners } from '#root/listeners/index.js'
const user = await getUser()

if (!user) await login()

startListeners()
