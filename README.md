# Localog

Localog is a developer's utililty to help logging when developing a cli app.
It renders logs in another terminal window.

## How To

In your `package.json`:

```json
{
  "scripts": {
    "localog": "localog"
  }
}
```

Run it, on a terminal:

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

<image src="https://d33kc2wwsvguti.cloudfront.net/k1k7st%2Fpreview%2F58496528%2Fmain_large.gif?response-content-disposition=inline%3Bfilename%3D%22main_large.gif%22%3B&response-content-type=image%2Fgif&Expires=1717802328&Signature=M8tNQxy3C4u-HAqksQK2VD-GImSBSYJzFwJ6yUDL0h5iABKSM029faWzFj08TkHpLPGU6IYwstxGwVuHWMtRH1RSxaN7Wh7yYgUTLdo~QmQTKxGt20LJUtCCJvCrm0Meew7tZFZghbRojIhmfD9pzFdmfzVoCoaiKB9LeXXaCcVRE40YGEI3SmWHjm2Y01578wlrVrNwoQVMtF5pKzIwYgIFOaWVQAgCpJ40aXoDk1h71xkaOXGe13NEjBqaLlkfmIUSRimRpdvtEV7A5sjTLA3LLeuY6lSFUsME9ipOYvuB479-gjIWpDYEpmEIO2BUZYcJzlYt9oXOUJjL9UTW1Q__&Key-Pair-Id=APKAJT5WQLLEOADKLHBQ" width="1282px" height="auto" style="max-width:100%" />

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

  // utils to set separator
  // used in sending data
  setSeparator,

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


### setSeparator

localog uses `\uffff` to separate data from one another. 
You can set it to any character you want. 
NOTE: it should be just one character.

```json
{
  "scripts": {
    "localog": "localog --separator='|'"
  }
}
```

In your app:
```ts
import { setSeparator, success } from 'localog'

// before you log anything
setSeparator('|')

// do your awesome stuff
success('My project  is awesome!')
```

### close

If you found that somehow, your app won't turn off because the client is still opening connection,
shut it down with `close`.

```ts
import { close } from 'localog'

// closing the localog connection
close()
```


## License

MIT
