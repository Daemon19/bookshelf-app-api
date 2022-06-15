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

module.exports = { addBookHandler };