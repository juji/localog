// import consola from 'consola'
import { success } from './src/client'

// 9999999 is good enough, i think
// but the GIF size tho..
for(let i = 0; i < 99999; i++)
  success(`${i}: Hello, ${new Date().toISOString()}`)

