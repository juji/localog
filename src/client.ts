import { Socket } from "net"
import { PassThrough } from 'stream';

let socketFile: string|number = './.localog'

type LocalogData = { 
  type: string, 
  message: any,
  name?: string,
  stack?: string,
  cwd?: string
}

let socket: Socket|null = null
let buff: PassThrough|null = null
let BSEP = '\uffff';
let FSEP ='\ufffe'

export function close(){
  if(socket) {
    socket.end(() => { 
      buff = null
      socket = null 
    })
  }
}

async function send({ type, message, name, stack, cwd }:LocalogData){
  
  if(!socket){

    socket = new Socket()
    buff = new PassThrough()
    
    // silent error
    socket.on('error',() => {
      close()
    })

    socket.setKeepAlive(true)
    
    socket.on('ready',() => {
      if(!socket) return console.error('Socket not around');
      buff && buff.pipe(socket)
    })
    
    // @ts-expect-error i don't know why
    socket.connect( socketFile )

  }


  buff && buff.write(
    FSEP + 
    JSON.stringify({ 
      type, message, name, stack, cwd 
    }) 
    + BSEP
  )


}

export function setAddress( address: string|number ){
  socketFile = address
}

export function setSeparators( frontSeparator: string, backSeparator: string ){
  FSEP = frontSeparator
  BSEP = backSeparator
}

export function stringify(str: any){
  send({ type: 'stringify', message: JSON.stringify(str) })
}
export function json(str: any){
  send({ type: 'json', message: JSON.stringify(str) })
}
export function info(str: string){
  send({ type: 'info', message: str })
}
export function start(str: string){
  send({ type: 'start', message: str })
}
export function warn(str: string){
  send({ type: 'warn', message: str })
}
export function success(str: string){
  send({ type: 'success', message: str })
}
export function error(message: string | Error){
  if(typeof message === 'string'){
    send({ type: 'error', message })
  }else{
    send({ 
      type: 'error', 
      message: message.message,
      name: message.name,
      stack: message.stack,
      cwd: process.cwd()
    })
  }
}
export function box(str: string){
  send({ type: 'box', message: str })
}

process.on('exit', () => { close() });
process.on('SIGINT', () => { close() });
process.on('SIGUSR1', () => { close() });
process.on('SIGUSR2', () => { close() });

const localog = {
  close,
  setAddress,
  setSeparators,
  stringify,
  json,
  info,
  start,
  warn,
  success,
  error,
  box,
} 

export default localog
