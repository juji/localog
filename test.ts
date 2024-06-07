import consola from 'consola'
import { error } from './src/client'

try{

  throw new Error('this is an error')

}catch(e){

  error(e)
  consola.error(new Error('asdf'))
  console.log(e.name)
  console.log(e.message)
  console.log(e.stack)

}
// error(JSON.stringify())

