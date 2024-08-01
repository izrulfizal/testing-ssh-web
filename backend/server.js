const express = require('express');
const { Client } = require('ssh2');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.post('/ssh/connect', (req, res) => {
  const { host, port, username, password } = req.body;
  const conn = new Client();

  conn.on('ready', () => {
    conn.shell((err, stream) => {
      if (err) throw err;

      stream.on('close', () => {
        conn.end();
        res.end();
      }).on('data', (data) => {
        res.write(data);
      });

      req.on('data', (data) => {
        stream.write(data);
      });
    });
  }).connect({
    host: host,
    port: port || 22,
    username: username,
    password: password
  });
});

app.listen(3000, () => {
  console.log('SSH Server running on port 3000');
});
