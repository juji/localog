import { rm } from 'fs/promises';
import { createServer } from 'net'
import consola from 'consola'
import commandLineArgs, { OptionDefinition } from 'command-line-args'
import { showHelp } from './help';

const optionDefinitions: OptionDefinition[] = [
  { name: 'socket', alias: 's', type: String, defaultValue: './.localog' },
  { name: 'port', alias: 'p', type: Number },
  { name: 'help', alias: 'h', type: Boolean },
  { name: 'separator', type: String, defaultValue: '\uffff' }
]

const options = commandLineArgs(optionDefinitions)
if(options.help) showHelp()

const socket = options.port ? options.port : options.socket
const SEP = options.separator

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
      const endsWithSEP = str.at(-1) === SEP

      if(str[0] !== '{'){
        str = temp + str
        temp = ''
      }

      // if(!endsWithSEP) console.log('NOT endsWithSEP')

      const data = str.split(SEP)

      for(let i =0; i<data.length; i++){

        if(!data[i]) continue;

        if(i === (data.length-1) && !endsWithSEP){
          temp += data[i];
          continue;
        }

        let json;
        try{
          json = JSON.parse(data[i])
        }catch(e){
          consola.error(e)
          console.info(data[i])
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
        }
        else if(json.type === 'box' && json.message){
          consola.box( json.message )
        }
        else if(json.type === 'json'){
          console.log(JSON.parse(json.message))
        }
        else if(json.type === 'stringfy'){
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
