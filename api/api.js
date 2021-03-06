const bodyParser = require('body-parser');
const express = require('express');
const helmet = require('helmet');
const http = require('http');
const mapRoutes = require('express-routes-mapper');
const cors = require('cors');

const config = require('../config');
const dbService = require('./services/db.service');
const auth = require('./policies/auth.policy');
const role = require('./policies/role.policy');

const app = express();
const server = http.Server(app);

const environment = process.env.NODE_ENV;
const mappedOpenRoutes = mapRoutes(config.publicRoutes, 'api/controllers/');
const mappedAuthRoutes = mapRoutes(config.privateRoutes, 'api/controllers/');
const DB = dbService(environment, config.migrate).start();

// allow cross origin requests
// configure to only allow requests from certain origins
app.use(cors());
app.use(
  helmet({
    dnsPrefetchControl: false,
    frameguard: false,
    ieNoOpen: false,
  }),
);

app.use(express.static('documentation'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.all(
  '/private/*',
  (req, res, next) => auth(req, res, next),
  (req, res, next) => role(req, res, next),
);

app.use('/public', mappedOpenRoutes);
app.use('/private', mappedAuthRoutes);

server.listen(config.port, () => {
  if (environment !== 'production' && environment !== 'development' && environment !== 'testing') {
    console.error(
      `NODE_ENV is set to ${environment}, but only production and development are valid.`,
    );
    process.exit(1);
  }
  return DB;
});
