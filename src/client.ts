import { Socket } from "net"
import { Duplex, DuplexOptions } from 'stream';

let socketFile: string|number = './.localog'

type Data = { type: string, message: any }

let socket: Socket|null = null
let buff: MyDup|null = null
const SEP = '\uffff';

class MyDup extends Duplex{

  constructor(options: DuplexOptions) {
    super(options);
  }

  _write(chunk: any, encoding: BufferEncoding, callback: (error?: Error | null | undefined) => void): void {
    this.push(chunk)
    callback()
  }

  _read(size: number): void {
    // console.log('read', size)
  }
  
}

export function close(){
  if(socket) {
    socket.end(() => { 
      buff = null
      socket = null 
    })
  }
}

async function send({ type, message }:Data){
  
  if(!socket){

    socket = new Socket()
    buff = new MyDup({})
    
    // silent error
    socket.on('error',() => {})

    socket.setKeepAlive(true)
    
    socket.on('ready',() => {
      if(!socket) return console.error('Socket not around');
      buff && buff.pipe(socket)
    })
    
    // @ts-expect-error i don't know why
    socket.connect( socketFile )

  }


  buff && buff.write(JSON.stringify({ type, message }) + SEP)


}

export function setSocketFile( file: string|number ){
  socketFile = file
}

export function stringfy(str: any){
  send({ type: 'stringfy', message: JSON.stringify(str) })
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
export function error(str: string){
  send({ type: 'error', message: str })
}
export function box(str: string){
  send({ type: 'box', message: str })
}

// 9999999 is good enough, i think
// for(let i = 0; i < 9999999; i++){
//   success( i + ' Example content ' + Math.random() )
// }
// console.log('itt done')

export default {
  close,
  setSocketFile,
  stringfy,
  json,
  info,
  start,
  warn,
  success,
  error,
  box,
}