const { nanoid } = require('nanoid');
const books = require('./books');

const BOOK_ID_SIZE = 16;

const addBookHandler = (request, h) => {
  try {
    const failResponse = (reason) => h.response({
      status: 'fail',
      message: `Gagal menambahkan buku. ${reason}`,
    }).code(400);

    if (request.payload.name === undefined) return failResponse('Mohon isi nama buku');

    const {
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
    } = request.payload;

    if (readPage > pageCount) {
      return failResponse('readPage tidak boleh lebih besar dari pageCount');
    }

    const id = nanoid(BOOK_ID_SIZE);
    const finished = pageCount === readPage;
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;

    books.push({
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      id,
      finished,
      insertedAt,
      updatedAt,
    });

    return h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: { bookId: id },
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

  books[index] = { ...books[index], ...newBook };

  return {
    status: 'success',
    message: 'Buku berhasil diperbarui',
  };
};

module.exports = {
  addBookHandler, getAllBooksHandler, getBookByIdHandler, updateBookByIdHandler,
};
