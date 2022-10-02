import * as model from './model.js';
import recipeView from './views/recipeView.js';
import { MODAL_CLOSE_SEC } from './config.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView';
import addRecipeView from './views/addRecipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime';

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

if (module.hot) {
  module.hot.accept();
}

const controlRecipes = async function () {
  try {
    // getting the id
    const id = window.location.hash.slice(1);
    // console.log(id);

    if (!id) return;
    recipeView.renderSpinner(); // displaying the spinner.

    // 0) update result view to add active class
    resultsView.update(model.getSearchResultsPage());

    //  3 - Updating bookmark view
    bookmarksView.update(model.state.bookmarks);

    //  1 - Loading recipe
    await model.loadRecipe(id);

    //  2 - Rendering recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    // console.log(err);
    recipeView.renderError();
  }
};

// search result
const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();
    // 1. get search query
    const query = searchView.getQuery();
    if (!query) return;

    // 2. load search result
    await model.loadSearchResults(query);

    // 3. Render result
    // console.log(model.state.search.results);
    // resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultsPage()); // after pagination

    // 4. Render the initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (goToPage) {
  // 1. Render New result
  resultsView.render(model.getSearchResultsPage(goToPage)); // after pagination

  // 2. Render New pagination buttons
  paginationView.render(model.state.search);
};

// updating servings

const controlServings = function (newServings) {
  model.updateServings(newServings);

  // update the view after adding servings
  recipeView.update(model.state.recipe);
};

// Bookmark
const controlAddBookmark = function () {
  // ADD/REMOVE bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // Update recipe View
  recipeView.update(model.state.recipe);

  // Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // show loading
    addRecipeView.renderSpinner();

    // upload the new recipe data
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    // render recipe view
    recipeView.render(model.state.recipe);

    // success message
    addRecipeView.renderMessage();

    // Render bookmark View
    bookmarksView.render(model.state.bookmarks);

    // Change ID in the URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error('💥💥', err);
    addRecipeView.renderError(err.message);
  }
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView._addHandlerUpload(controlAddRecipe);
  // controlServings();
};

init();
