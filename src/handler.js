const { nanoid } = require('nanoid');
const books = require('./books');

const BOOK_ID_SIZE = 16;

const addBookHandler = (request, h) => {
  try {
    const failResponse = (message) => h.response({
      status: 'fail',
      message: `Gagal menambahkan buku. ${message}`,
    }).code(400);

    const book = request.payload;

    if (book.name === undefined) return failResponse('Mohon isi nama buku');

    if (book.readPage > book.pageCount) {
      return failResponse('readPage tidak boleh lebih besar dari pageCount');
    }

    book.id = nanoid(BOOK_ID_SIZE);
    book.finished = book.pageCount === book.readPage;
    book.insertedAt = new Date().toISOString();
    book.updatedAt = book.insertedAt;

    books.push(book);

    return h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: { bookId: book.id },
    }).code(201);
  } catch (err) {
    return h.response({
      status: 'fail',
      message: 'Buku gagal ditambahkan',
    }).code(500);
  }
};

const getAllBooksHandler = () => {
  const responseBooks = books.map(({ id, name, publisher }) => ({ id, name, publisher }));

  return {
    status: 'success',
    data: {
      books: responseBooks,
    },
  };
};

const getBookByIdHandler = (request, h) => {
  const { id } = request.params;
  const book = books.find((b) => b.id === id);

  if (book === undefined) {
    return h.response({
      status: 'fail',
      message: 'Buku tidak ditemukan',
    }).code(404);
  }

  return {
    status: 'success',
    data: { book },
  };
};

const updateBookByIdHandler = (request, h) => {
  const failResponse = (message, code) => h.response({
    status: 'fail',
    message: `Gagal memperbarui buku. ${message}`,
  }).code(code);

  const { id } = request.params;
  const newBook = request.payload;

  if (newBook.name === undefined) return failResponse('Mohon isi nama buku', 400);

  if (newBook.readPage > newBook.pageCount) {
    return failResponse('readPage tidak boleh lebih besar dari pageCount', 400);
  }

  const index = books.findIndex((book) => book.id === id);

  if (index === -1) return failResponse('Id tidak ditemukan', 404);

  const finished = newBook.readPage === newBook.pageCount;
  const updatedAt = new Date().toISOString();

  books[index] = {
    ...books[index], ...newBook, finished, updatedAt,
  };

  return {
    status: 'success',
    message: 'Buku berhasil diperbarui',
  };
};

const deleteBookByIdHandler = (request, h) => {
  const { id } = request.params;
  const index = books.findIndex((book) => book.id === id);

  if (index === -1) {
    return h.response(
      { status: 'fail', message: 'Buku gagal dihapus. Id tidak ditemukan' },
    ).code(404);
  }

  books.splice(index, 1);

  return {
    status: 'success',
    message: 'Buku berhasil dihapus',
  };
};

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  updateBookByIdHandler,
  deleteBookByIdHandler,
};
