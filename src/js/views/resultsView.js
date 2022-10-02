import icons from 'url:../../img/icons.svg'; // parcel 2
import View from './View.js';
import previewView from './previewView.js';

class ResultsView extends View {
  _parentElement = document.querySelector('.results');
  _errMessage = 'No recipe found !! Please try again';
  _message = '';

  _generateMarkup() {
    // console.log(this._data);
    // for looping over to show result
    return this._data.map(result => previewView.render(result, false)).join('');
  }
}

export default new ResultsView();
