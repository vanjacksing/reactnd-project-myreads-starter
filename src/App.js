import React, {Component} from 'react'
import {Route, Link} from 'react-router-dom'
import SearchBook from './SearchBook'
import BookShelf from './BookShelf'
import * as BooksAPI from "./BooksAPI"
import './App.css'

class BooksApp extends Component {
  state = {
    books: [] // List of user's books
  };

  componentDidMount() {
    // Getting list of user's books from the server
    BooksAPI.getAll().then(books => {
      this.setState({ books: books });
    });
  }

  updateShelf = (book, shelf) => {
    const bookIdx = this.state.books.findIndex((b) => b.id === book.id)
    let newBooks = this.state.books
    // If the book passed as argument is not present in user's booklist, then add it to the state
    if (bookIdx === -1) {
      book.shelf = shelf;
      newBooks.push(book)
      this.setState({ books: newBooks });
    } else {
    // If the book is already in user's booklist, then modify it's shelf property
        newBooks[bookIdx].shelf = shelf;
        this.setState({ books: newBooks });
      }
    // Update info on server
    BooksAPI.update(book, shelf);
    }

  render() {
    // Filter out booklists for each shelf
    let currentBooks = this.state.books.filter(
      book => book.shelf === "currentlyReading"
    );
    let wantToReadBooks = this.state.books.filter(
      book => book.shelf === "wantToRead"
    );
    let readBooks = this.state.books.filter(book => book.shelf === "read");
    
    return <div className="app">
        <Route path="/" exact render={() => <div className="list-books">
              <div className="list-books-title">
                <h1>MyReads</h1>
              </div>
              <div className="list-books-content">
                <div>
                  <BookShelf shelfUpdater={this.updateShelf} shelf={currentBooks} title="Currently Reading" />
                  <BookShelf shelfUpdater={this.updateShelf} shelf={wantToReadBooks} title="Want to read" />
                  <BookShelf shelfUpdater={this.updateShelf} shelf={readBooks} title="Read" />
                </div>
              </div>
              <div className="open-search">
                <Link to="/search">Add a book</Link>
              </div>
            </div>} />
        <Route path="/search" render={() => <SearchBook 
        shelfUpdater={this.updateShelf}
        books={this.state.books} />} />
      </div>;
  }
}

export default BooksApp
