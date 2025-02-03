import express from 'express';
import cors from 'cors';
import history from 'connect-history-api-fallback';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import serveStatic from 'serve-static';
const app = express();
app.use(cors())

app.use(history({
    index: '/index.html',
    rewrites: [
      {
        from: /^\/libs\/.*$/,
        to: function(context) {
          return '/bower_components' + context.parsedUrl.pathname;
        }
      }
    ]
  }));

app.use(serveStatic(__dirname + "/dist"));
var port = process.env.PORT || 3000;
app.listen(port);
console.log('server started '+ port);

