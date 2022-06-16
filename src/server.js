const Hapi = require('@hapi/hapi');
const routes = require('./routes');

const init = async () => {
  const port = parseInt(process.env.PORT, 10) || 5000;

  const server = Hapi.server({
    port,
    host: 'localhost',
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  server.route(routes);

  await server.start();
  console.log(`Server berlajan pada ${server.info.uri}`);
};

init();
