import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import * as BooksAPI from './BooksAPI'
import Book from './Book'
import {debounce} from 'lodash' // Used to detect user has stopped typing the search field https://www.carlrippon.com/search-after-stop-typing-react-component/

class SearchBook extends Component {
  state = {
    query: "",  // Search query
    searchResult: []
  };

  updateQuery = query => {
    this.setState({
      query: query
    });
  };

  getBookRealShelf = book => {
    // Check whether the book is already in user's collection and return book object with correct status. 
    // This is used for displaying correct status of books on search results page
    const bookIdx = this.props.books.findIndex(b => b.id === book.id);
    const realShelf = bookIdx === -1 ? "none" : this.props.books[bookIdx].shelf;
    book.shelf = realShelf;
    return book;
  };

  fetchBooks = debounce(() => {
    // debounce is for delaying search function execution. Each time query is changed search execution is delayed. 
    // Query is executed only after 1s of user inactivity
    if (this.state.query) {
          BooksAPI.search(this.state.query).then(books => {
            this.setState({ searchResult: books });
          });
    }
  }, 1000);

  render() {
    const books = this.state.searchResult.length > 0 ? this.state.searchResult.map(book => this.getBookRealShelf(book)) : []
    return (
      <div className="search-books">
        <div className="search-books-bar">
          <Link className="close-search" to="/">
            Close
          </Link>
          <div className="search-books-input-wrapper">
            {/*
                  NOTES: The search from BooksAPI is limited to a particular set of search terms.
                  You can find these search terms here:
                  https://github.com/udacity/reactnd-project-myreads-starter/blob/master/SEARCH_TERMS.md

                  However, remember that the BooksAPI.search method DOES search by title or author. So, don't worry if
                  you don't find a specific author or title. Every search is limited by search terms.
                */}
            <input
              type="text"
              placeholder="Search by title or author"
              value={this.state.query}
              onChange={event => {
                this.updateQuery(event.target.value);
                  this.fetchBooks();
              }}
            />
          </div>
        </div>
        <div className="search-books-results">
          <ol className="books-grid">
            {books &&
              books.map(book => (
                <li key={book.id}>
                  <Book book={book} shelfUpdater={this.props.shelfUpdater} />
                </li>
              ))}
          </ol>
        </div>
      </div>
    );
  }
}

export default SearchBook