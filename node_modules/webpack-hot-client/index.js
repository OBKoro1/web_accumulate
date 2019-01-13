'use strict';

const stringify = require('json-stringify-safe');
const weblog = require('webpack-log');
const WebSocket = require('ws');
const HotClientError = require('./lib/HotClientError');
const { modifyCompiler, payload, sendData, validateCompiler } = require('./lib/util');

const defaults = {
  autoConfigure: true,
  host: 'localhost',
  hot: true,
  https: false,
  logLevel: 'info',
  logTime: false,
  port: 8081,
  reload: true,
  send: {
    errors: true,
    warnings: true
  },
  server: null,
  stats: {
    context: process.cwd()
  },
  test: false
};
const timefix = 11000;

module.exports = (compiler, opts) => {
  const options = Object.assign({}, defaults, opts);
  const log = weblog({
    name: 'hot',
    id: 'webpack-hot-client',
    level: options.logLevel,
    timestamp: options.logTime
  });
  const envTarget = process.env.WHC_TARGET;

  // issue #36. some alternative compiler targets still run in a server, but we
  // don't want to be in the business of supporting them all.
  if (!envTarget) {
    process.env.WHC_TARGET = 'web';
  } else if (envTarget !== 'web') {
    log.warn(`WHC_TARGET changed to '${envTarget}'. Changing this value is allowed but is unsupported.`);
  }

  if (typeof options.host === 'string') {
    options.host = {
      server: options.host,
      client: options.host
    };
  } else if (!options.host.server) {
    throw new HotClientError('`options.server` must be defined when setting host to an Object');
  } else if (!options.host.client) {
    throw new HotClientError('`options.client` must be defined when setting host to an Object');
  }

  /* istanbul ignore if */
  if (options.host.client !== options.host.server) {
    log.warn('`options.host.client` does not match `options.host.server`. This can cause unpredictable behavior in the browser.');
  }

  if (options.autoConfigure) {
    validateCompiler(compiler);
  }

  const { host, port, server } = options;
  const wssOptions = options.server ? { server } : { host: host.server, port };
  const wss = new WebSocket.Server(wssOptions);
  let stats;

  options.log = log;

  if (options.server) {
    const addr = options.server.address();
    log.info(`WebSocket Server Attached to ${addr.address}:${addr.port}`);
  }

  function broadcast(data) {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
  }

  wss.broadcast = broadcast;

  if (options.server) {
    options.webSocket = {
      host: wss._server.address().address, // eslint-disable-line no-underscore-dangle
      port: wss._server.address().port // eslint-disable-line no-underscore-dangle
    };
  } else {
    options.webSocket = { host: host.client, port };
  }

  if (options.autoConfigure) {
    modifyCompiler(compiler, options);
  }

  const compile = (comp) => {
    const compilerName = comp.name || '<unnamed compiler>';
    stats = null;
    log.info('webpack: Compiling...');
    broadcast(payload('compile', { compilerName }));
  };

  const done = (result) => {
    log.info('webpack: Compiling Done');
    // apply a fix for compiler.watch as outline here: ff0000-ad-tech/wp-plugin-watch-offset
    result.startTime -= timefix; // eslint-disable-line no-param-reassign
    stats = result;

    const jsonStats = stats.toJson(options.stats);

    /* istanbul ignore if */
    if (!jsonStats) {
      options.log.error('compiler done: `stats` is undefined');
    }

    sendData(broadcast, jsonStats, options);
  };

  const invalid = (filePath, comp) => {
    const context = comp.context || comp.options.context || process.cwd();
    const fileName = (filePath || '<unknown>')
      .replace(context, '')
      .substring(1);
    log.info('webpack: Bundle Invalidated');
    broadcast(payload('invalid', { fileName }));
  };

  // as of webpack@4 MultiCompiler no longer exports the compile hook
  const compilers = compiler.compilers || [compiler];
  for (const comp of compilers) {
    comp.hooks.compile.tap('WebpackHotClient', () => {
      compile(comp);
    });

    // we need the compiler object reference here, otherwise we'd let the
    // MultiHook do it's thing in a MultiCompiler situation.
    comp.hooks.invalid.tap('WebpackHotClient', (filePath) => {
      invalid(filePath, comp);
    });
  }

  compiler.hooks.done.tap('WebpackHotClient', done);

  wss.on('error', (err) => {
    /* istanbul ignore next */
    log.error('WebSocket Server Error', err);
  });

  wss.on('listening', () => {
    // eslint-disable-next-line no-shadow
    const { host, port } = options;
    log.info(`WebSocket Server Listening at ${host.server}:${port}`);
  });

  wss.on('connection', (socket) => {
    log.info('WebSocket Client Connected');

    socket.on('error', (err) => {
      /* istanbul ignore if */
      if (err.errno !== 'ECONNRESET') {
        log.warn('client socket error', JSON.stringify(err));
      }
    });

    socket.on('message', (data) => {
      const message = JSON.parse(data);

      if (message.type === 'broadcast') {
        for (const client of wss.clients) {
          if (client.readyState === WebSocket.OPEN) {
            client.send(stringify(message.data));
          }
        }
      }
    });

    // only send stats to newly connected clients if no previous clients have
    // connected
    if (stats && !wss.clients.length) {
      const jsonStats = stats.toJson(options.stats);

      /* istanbul ignore if */
      if (!jsonStats) {
        options.log.error('Client Connection: `stats` is undefined');
      }

      sendData(broadcast, jsonStats, options);
    }
  });

  return {
    close(callback) {
      try {
        wss.close(callback);
      } catch (err) {
        /* istanbul ignore next */
        log.error(err);
      }
    },
    options: Object.freeze(Object.assign({}, options)),
    wss
  };
};
