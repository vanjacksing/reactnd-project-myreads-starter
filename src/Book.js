import React, {Component} from 'react'

class Book extends Component {

    render() {

        // Mapping shelf name to corresponding option name
        const shelves = { 
          currentlyReading: "Currently reading", 
          wantToRead: "Want to Read", 
          read: "Read", 
          none: "None" 
        };

        // Check that background image is properly set
        const backgroundImage = this.props.book.imageLinks ? this.props.book.imageLinks.thumbnail : 'none'
        // Check that author is properly set
        const author = this.props.book.authors ? this.props.book.authors[0] : "Unknown author"

        return <div className="book">
            <div className="book-top">
              <div className="book-cover" style={{ width: 128, height: 193, 
                backgroundImage: `url(${backgroundImage})`
                  }} />
              <div className="book-shelf-changer">
                <select 
                value={this.props.book.shelf ? this.props.book.shelf : "none"} 
                onChange={event => this.props.shelfUpdater(this.props.book, event.target.value)}>
                  <option value="none" disabled>
                    Move to...
                  </option>
                  {Object.entries(shelves).map(
                    ([shelf, shelfName]) => (
                      <option value={shelf} key={shelf}>
                        {shelfName}
                      </option>
                    )
                  )}
                </select>
              </div>
            </div>
            <div className="book-title">{this.props.book.title}</div>
            <div className="book-authors">
              {author}
            </div>
          </div>;
    }
}

export default Book