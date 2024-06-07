import commandLineUsage from 'command-line-usage'

export function showHelp(){

  console.log(commandLineUsage([
    {
      header: 'LocaLog',
      content: 'Log helper for developing a cli app'
    },
    {
      header: 'Options',
      optionList: [
        {
          name: 'help',
          alias: 'h',
          description: 'Display this usage guide.',
          type: Boolean
        },
        {
          name: 'socket',
          alias: 's',
          description: 'Unix socket to listen to. Default: "./.localog"',
          type: String,
        },
        {
          name: 'port',
          alias: 'p',
          description: 'Port to listen to. Has higher priority than Unix socket',
          type: Number,
        },
        {
          name: 'separator',
          description: 'Separator to be used in parsing data. Default: "\uffff"',
          type: String,
          typeLabel: '{underline string}'
        }
      ]
    },
    {
      content: 'Project home: {underline https://github.com/juji/localog}'
    }
  ]))

  process.exit()

}