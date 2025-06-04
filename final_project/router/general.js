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

// Get full book list
public_users.get('/', (req, res) => {
  return res.status(200).json(books);
});

// Get book by ISBN
public_users.get('/isbn/:isbn', (req, res) => {
  const { isbn } = req.params;
  const book = books[isbn];

  if (book) {
    return res.status(200).json(book);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

// Get book by author
public_users.get('/author/:author', (req, res) => {
  const { author } = req.params;
  const matches = [];

  for (const isbn in books) {
    if (books[isbn].author.toLowerCase() === author.toLowerCase()) {
      matches.push({ isbn, ...books[isbn] });
    }
  }

  return res.status(200).json(matches);
});

// Get book by title
public_users.get('/title/:title', (req, res) => {
  const { title } = req.params;
  const matches = [];

  for (const isbn in books) {
    if (books[isbn].title.toLowerCase() === title.toLowerCase()) {
      matches.push({ isbn, ...books[isbn] });
    }
  }

  return res.status(200).json(matches);
});

// Get book reviews
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
