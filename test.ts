// import consola from 'consola'
import { success } from './src/client'

for(let i = 0; i < 99999; i++)
  success(`${i}: Hello, ${new Date().toISOString()}`)

