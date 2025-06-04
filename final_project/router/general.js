const express = require('express');
let books = require("./booksdb.js");
const public_users = express.Router();

// In-memory user storage
let users = [];

// Username validation (returns true if username exists)
const isValid = (username) => {
  return users.some(user => user.username === username);
};

// Register user
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (isValid(username)) {
    return res.status(409).json({ message: "Username already exists" });
  }

  users.push({ username, password });

  return res.status(200).json({ message: "User registered successfully" });
});

// ✅ Async get book list (Task 10)
const getBooks = () => {
  return new Promise((resolve, reject) => {
    if (books) {
      resolve(books);
    } else {
      reject("No books found");
    }
  });
};

// ✅ Updated GET route for full book list using async/await
public_users.get('/', async (req, res) => {
  try {
    const bookList = await getBooks();
    return res.status(200).json(bookList);
  } catch (err) {
    return res.status(500).json({ message: err });
  }
});

// ✅ Async get book by ISBN (Task 11)
const getBookByISBN = (isbn) => {
  return new Promise((resolve, reject) => {
    const book = books[isbn];
    if (book) {
      resolve(book);
    } else {
      reject("Book not found");
    }
  });
};

// ✅ Updated GET route for book by ISBN using async/await
public_users.get('/isbn/:isbn', async (req, res) => {
  const { isbn } = req.params;

  try {
    const book = await getBookByISBN(isbn);
    return res.status(200).json(book);
  } catch (err) {
    return res.status(404).json({ message: err });
  }
});

// ✅ Async get books by Author (Task 12)
const getBooksByAuthor = (author) => {
  return new Promise((resolve, reject) => {
    const matches = [];

    for (const isbn in books) {
      if (books[isbn].author.toLowerCase() === author.toLowerCase()) {
        matches.push({ isbn, ...books[isbn] });
      }
    }

    if (matches.length > 0) {
      resolve(matches);
    } else {
      reject("No books found by this author");
    }
  });
};

// ✅ Updated GET route for books by author using async/await
public_users.get('/author/:author', async (req, res) => {
  const { author } = req.params;

  try {
    const booksByAuthor = await getBooksByAuthor(author);
    return res.status(200).json(booksByAuthor);
  } catch (err) {
    return res.status(404).json({ message: err });
  }
});

// ✅ Async get books by Title (Task 13)
const getBooksByTitle = (title) => {
  return new Promise((resolve, reject) => {
    const matches = [];

    for (const isbn in books) {
      if (books[isbn].title.toLowerCase() === title.toLowerCase()) {
        matches.push({ isbn, ...books[isbn] });
      }
    }

    if (matches.length > 0) {
      resolve(matches);
    } else {
      reject("No books found with this title");
    }
  });
};

// ✅ Updated GET route for books by title using async/await
public_users.get('/title/:title', async (req, res) => {
  const { title } = req.params;

  try {
    const booksByTitle = await getBooksByTitle(title);
    return res.status(200).json(booksByTitle);
  } catch (err) {
    return res.status(404).json({ message: err });
  }
});

// 🔄 GET book reviews (unchanged)
public_users.get('/review/:isbn', (req, res) => {
  const { isbn } = req.params;
  const book = books[isbn];

  if (book) {
    return res.status(200).json(book.reviews);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
module.exports.users = users;
module.exports.isValid = isValid;
