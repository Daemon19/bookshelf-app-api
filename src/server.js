const Hapi = require('@hapi/hapi');

const init = async () => {
  const server = Hapi.server({
    port: 5000,
    host: 'localhost',
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  // TODO: Create routes array
  // server.route(routes)

  await server.start();
  console.log(`Server berlajan pada ${server.info.uri}`);
};

init();
