(function(){

  'use strict';

  var repositoryJSON = document.getElementById('json-repository-data').innerHTML,
      repositoryData = JSON.parse(repositoryJSON);

  var repositories = _.map(repositoryData.repositories, function(repository) {
    return _.assign({}, repository, {
      element: document.querySelector('[data-repository-id="' + repository.id + '"]')
    });
  });

  var repositoryCount = document.getElementById('js-repository-count');

  /**
   * is repository has filter texts?
   *
   * @param {Object} repository
   * @param {String[]} texts
   * @return {Boolean}
   */
  function hasFilterText(repository, texts) {
    var matches = _.map(texts, function(s) {
      return _.includes(
        // find from name and description
        repository.name + ' ' + repository.description, s
      );
    });

    // and conditions
    return !_.includes(matches, false);
  }

  /**
   * change visible for element
   *
   * @param {Object} repository
   * @param {Boolean} visible
   */
  function switchVisible(repository, visible) {
    var element = repository.element;

    if (!element) {
      return;
    }

    element.style.display = (visible) ? '' : 'none';
  }

  /**
   * count visible elements
   *
   * @param {Object[]} repositories
   * @return {Number}
   */
  function countVisibleRepository(repositories) {
    return _.filter(repositories, function(repository) {
      var element = repository.element;

      if (!element) {
        return false;
      }

      return (element.style.display !== 'none');
    }).length;
  }

  /**
   * for input event
   *
   * @param {Event} event
   */
  function onInput(event) {
    var text = event.target.value,
        filter;

    if (text) {
      filter = _.partialRight(hasFilterText, text.split(/\s+/));
    } else {
      filter = _.stubTrue;
    }

    _.forEach(repositories, function(repository) {
      switchVisible(repository, filter(repository));
    });

    repositoryCount.innerHTML = countVisibleRepository(repositories);
  }

  /**
   * initialize events
   */
  function initialize() {
    var inputFilter = document.getElementById('js-input-filter');

    if (!inputFilter) {
      return;
    }

    inputFilter.addEventListener('input', _.debounce(onInput, 300), false);
  }

  document.addEventListener('DOMContentLoaded', initialize, false);

}());
