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
   * filter repositories
   *
   * @param {Object[]} repositories
   * @param {String} text
   */
  function filterRepository(repositories, text) {
    var filter;

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

  //----------------------------------------------------------------------------

  /**
   * split query string
   *
   * @param {String} text
   * @return {String[]}
   */
  function parseQueryString(text) {
    return _(text.split('&'))
      .map(function(q) {
        return (/=/.exec(q)) ? {
          key: decodeURIComponent(RegExp.leftContext),
          value: decodeURIComponent(RegExp.rightContext)
        } : {
          key: decodeURIComponent(q),
          value: ''
        };
      })
      .groupBy('key')
      .map(function(pair) {
        return [
          _.head(pair).key,
          _.map(pair, 'value')
        ];
      })
      .fromPairs()
      .value();
  }

  //----------------------------------------------------------------------------

  /**
   * for input event
   *
   * @param {Event} event
   */
  function onInput(event) {
    var text = event.target.value;

    filterRepository(repositories, text);

    history.pushState({
      query: text
    }, null, '/?q=' + encodeURIComponent(text));
  }

  /**
   * for popstate event
   *
   * @param {Event} event
   */
  function onPopState(event) {
    var text, inputFilter;

    if (event.state && event.state.query) {
      text = event.state.query;
    } else {
      text = '';
    }

    inputFilter = document.getElementById('js-input-filter');

    if (!inputFilter) {
      return;
    }

    inputFilter.value = text;

    filterRepository(repositories, text);
  }

  /**
   * initialize events
   */
  function initialize() {
    var inputFilter = document.getElementById('js-input-filter'),
        query, queries, text;

    if (!inputFilter) {
      return;
    }

    inputFilter.addEventListener('input', _.debounce(onInput, 300), false);

    window.addEventListener('popstate', onPopState, false);

    query = location.search.replace(/^\?/, '');
    queries = parseQueryString(query);

    if (!queries.q) {
      return;
    }

    text = queries.q.join(' ');

    filterRepository(repositories, text);
  }

  document.addEventListener('DOMContentLoaded', initialize, false);

}());
