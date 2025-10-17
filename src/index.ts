import { rm } from 'fs/promises';
import { createServer } from 'net'
import consola from 'consola'
import commandLineArgs, { OptionDefinition } from 'command-line-args'
import { showHelp } from './help';
import pc from "picocolors"
import { sep } from 'path';

const optionDefinitions: OptionDefinition[] = [
  { name: 'socket', alias: 's', type: String, defaultValue: './.localog' },
  { name: 'port', alias: 'p', type: Number },
  { name: 'help', alias: 'h', type: Boolean },
  { name: 'backSeparator', type: String, defaultValue: '\uffff' },
  { name: 'frontSeparator', type: String, defaultValue: '\ufffe' }
]

const options = commandLineArgs(optionDefinitions)
if(options.help) showHelp()

const socket = options.port ? options.port : options.socket
let BSEP = options.backSeparator;
let FSEP = options.frontSeparator;

function processErrorStack({ stack, cwd }: { stack: string, cwd?: string }){

  return stack.split('\n').slice(1).map((v:string) => {

    let str = v
      .replace('file://', '')
      .replace(cwd + sep, '')
      .replace(/(\ +)at\ /,`$1${pc.gray('at ')}`)

    let m = str.match(/\(([^)]+)\)/)
    
    if(m && m[1]) {
      str = str.replace(/\([^)]+\)/, `(${pc.cyan(m[1])})`)
    }

    return str

  }).join('\n')
  
}

;(async () => {

  // sometimes the socket needs cleaning up
  // example closing manually using: 'SIGHUP'
  try{ 
    if(typeof socket === 'string')
    await rm(socket) 
  }catch(e){}

  let temp = ''
  const s = createServer((stream) => {

    stream.on('data', d => {
      let str = d.toString()
      
      if(str[0] !== FSEP){
        str = FSEP + temp + str
        temp = ''
      }
        
      const endsWithSEP = str.at(-1) === BSEP
      const data = str.split(BSEP)

      for(let i =0; i<data.length; i++){

        if(!data[i]) continue;
        const dataStr = data[i].slice(1)
        if(!dataStr) continue;

        if(i === (data.length-1) && !endsWithSEP){
          temp = dataStr;
          continue;
        }

        let json;
        try{
          json = JSON.parse(dataStr)
        }catch(e){
          consola.error(e)
          console.info(dataStr)
          continue;
        }

        if(json.type === 'info' && json.message){
          consola.info( json.message )
        }
        else if(json.type === 'start' && json.message){
          consola.start( json.message )
        }
        else if(json.type === 'warn' && json.message){
          consola.warn( json.message )
        }
        else if(json.type === 'success' && json.message){
          consola.success( json.message )
        }
        else if(json.type === 'error' && json.message){
          consola.error( json.message )
          if(json.stack){
            console.log(
              processErrorStack(json)
            )
          }
        }
        else if(json.type === 'box' && json.message){
          consola.box( json.message )
        }
        else if(json.type === 'json'){
          console.log(JSON.parse(json.message))
        }
        else if(json.type === 'stringify'){
          console.log(JSON.stringify(JSON.parse(json.message), null, 2))
        }
        else{
          console.log(data)
        }

      }
    })

  })
  
  s.maxConnections = Infinity
  
  s.listen(socket,() => {
    consola.info("logger start, listening to", options.port ? options.port : options.socket);
  })
  
  // https://stackoverflow.com/questions/14031763/doing-a-cleanup-action-just-before-node-js-exits
  process.on('exit', () => { s.close() });
  process.on('SIGINT', () => { s.close() });
  process.on('SIGUSR1', () => { s.close() });
  process.on('SIGUSR2', () => { s.close() });

})()
