import react from 'react';
import htm from 'htm';
import superagent from 'superagent';
import { AsyncPage } from './AsyncPage.js';
import { FourOhFour } from './FourOhFour.js';
import { Header } from '../Header.js';

const html = htm.bind(react.createElement);

export class Author extends AsyncPage {
  static async preloadAsyncData(props) {
    const { body } = await superagent.get(
      `http://localhost:3001/api/author/${props.match.params.authorId}`
    );
    return { author: body };
  }
  render() {
    const author = authors.find(author => author.id === this.props.match.params.authorId);

    if (!author) {
      return html`<${FourOhFour}
        staticContext=${this.props.staticContext}
        error="Author not found"
      />`;
    }

    return html`<div>
      <${Header} />
      <h2>${author.name}</h2>
      <p>${author.bio}</p>
      <h3>Books</h3>
      <ul>
        ${author.books.map(book => html`<li key=${book.id}>${book.title} (${book.year})</li>`)}
      </ul>
    </div>`;
  }
}
