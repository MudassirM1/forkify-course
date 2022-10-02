import icons from 'url:../../img/icons.svg'; // parcel 2
import View from './View.js';
import previewView from './previewView.js';

class BookmarksView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _errMessage = 'No bookmarks yet. Find a nice recipe and bookmark it';
  _message = '';

  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }

  _generateMarkup() {
    // console.log(this._data);
    // for looping over to show result
    return this._data
      .map(bookmark => previewView.render(bookmark, false))
      .join('');
  }
}

export default new BookmarksView();
