const { addBookHandler, getAllBooksHandler } = require('./handler');

const routes = [
  {
    path: '/books',
    method: 'POST',
    handler: addBookHandler,
  },
  {
    path: '/books',
    method: 'GET',
    handler: getAllBooksHandler,
  },
];

module.exports = routes;
