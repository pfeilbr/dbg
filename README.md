## Remote livereload setup

1. Place the following in the page you would like to reload on change
```html
<script src="https://dbg.herokuapp.com/socket.io/socket.io.js"></script>
<script>
    var socket = io('https://dbg.herokuapp.com');
    socket.on('msg', function(msg) {
      if (msg === 'reload') {
        location.href = location.href;
      }
    })
</script>
```

2. Call the following endpoint with your message (msg) after the page has been modified
https://dbg.herokuapp.com/broadcast/{{msg}}

  e.g. https://dbg.herokuapp.com/broadcast/reload
  ```sh
  $ curl https://dbg.herokuapp.com/broadcast/reload
  ```

  or remote code execution
  
  ```sh
  $ curl -H "Content-Type: application/json" -X POST -d '{"type":"eval","code":"location.href = location.href;"}' http://localhost:5000/broadcast/json
  ```

## TODO

* create POST '/broadcast/json' endpoint for remote code execution
  e.g. `curl -H "Content-Type: application/json" -X POST -d '{"type":"eval","code":"location.href = location.href;"}' https://dbg.herokuapp.com/broadcast/json`
