# Localog

Localog is a developer's utililty to help logging when developing a cli app.
It renders logs in another terminal window.

## Install

```bash
npm i localog
```

## How To

In your `package.json`:

```json
{
  "scripts": {
    "localog": "localog"
  }
}
```

Run the server, on a terminal:

```bash
npm run localog
```

Where ever in your app:

```ts
import { success } from 'localog'

// success('Hello')

// test this
for(let i = 0; i < 99999; i++)
  success(`${i}: Hello, ${new Date().toISOString()}`)
```

<image src="https://pouch.jumpshare.com/preview/GgdK4APi25dPhH7UfKCD0CQXzgbQDTW5kzQ2ZmM4smFz1_FMjAZKU6paq-X7seMHilz3pwRXMuGl-46Fn3RX5QDMyBnOB0rQth0B17d-cJ0" width="808px" height="auto" style="max-width:100%" />

## Methods

Under the hood, localog uses (some) [consola](https://www.npmjs.com/package/consola) functions. It also has some other functionalities:

```ts
import {

  // json utilities
  json,
  stringfy,

  // same as consola
  info,
  start,
  warn,
  success,
  error,
  box,

  // utils to set socket file / port
  // to send data to
  setAddress,

  // utils to set separators
  // used in sending data
  setSeparators,

  // utils to close the connection
  // will be done automatically 
  // on exit SIGINT SIGUSR1 SIGUSR2
  close,

} from 'localog'
// or import localog from localog
```

### json

Logging JSON

```ts
import { json } from 'localog'

json({ hello: 'world' })
// will print: { hello: 'world' }
```

### stringify

Logging stringified JSON

```ts
import { stringify } from 'localog'

stringify({ 
  hello: 'world', 
  message: {
    what: 'is this?',
    oh: 'this is a very complicated json',
    "i will": [
      'need', 'someway',
      'to', 'see', 'all'
    ],
    the: "message",
    "on": new Date()
  } 
})

/* Will output:
{
  "hello": "world",
  "message": {
    "what": "is this?",
    "oh": "this is a very complicated json",
    "i will": [
      "need",
      "someway",
      "to",
      "see",
      "all"
    ],
    "the": "message",
    "on": "2024-06-07T17:03:21.784Z"
  }
}
*/
```

### consola's method

`info`, `start`, `warn`, `success`, `error`, and `box`, are consola's method.

[Checkout consola's doc](https://www.npmjs.com/package/consola#getting-started) to see how it will look like on the terminal.


### setAddress

localog listens and sends data to `./.localog` by default. 
You can change this into any other file, or port number.

```json
{
  "scripts": {
    "localog": "localog --socket='/tmp/my-awesome-socket'"
    // or "localog": "localog --port=5432"
  }
}
```

In your app:
```ts
import { setAddress, success } from 'localog'

// before you log into anything
setAddress('/tmp/my-awesome-socket')
// or setAddress( 5432 )

success('Hello')
```


### setSeparators

localog uses `\ufffe` and `\uffff` to separate data from one another. 
You can set it to any character you want. 
NOTE: it should be just one character.

```json
{
  "scripts": {
    "localog": "localog --frontSeparator='^' --backSeparator='$'"
  }
}
```

In your app:
```ts
import { setSeparators, success } from 'localog'

// before you log anything
setSeparators('^', '$')

// do your awesome stuff
success('My project is awesome!')
```

### close

The client will open connection to the server. It will keep it open until `exit`, `SIGINT`, 
`SIGUSR1`, or `SIGUSR2` signal is detected.

If you, somehow, need the client localog to shut down connection to it's server,
try shutting it down with `close`.

```ts
import { close } from 'localog'

// closing the localog connection
close()
```


## License

MIT
