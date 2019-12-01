import React, { Component } from 'react';
import "./App.css";

import Title from './components/Title/Title';
import NewsPost from './components/News/News';
import Input from './components/Input/Input';
import Select from './components/Select/Select';
import Pagination from './components/Pagination/Pagination';
import { BASE_PATH, SEARCH_PATH, SEARCH_PARAM, PAGE_HITS, PAGE_PARAM, HITS } from "./consts/consts";

class App extends Component {

  state = {
    searchQuery: '',
    result: {},
    hitsPerPage: 20,
    page: 0,
  };

  componentDidMount() {
    const { searchQuery, hitsPerPage, page } = this.state;
    this.fetchData(searchQuery, hitsPerPage, page);
  }

  fetchData = (searchQuery, hitsPerPage, page) => {
    fetch(`${BASE_PATH}${SEARCH_PATH}?${SEARCH_PARAM}${searchQuery}&${PAGE_HITS}${hitsPerPage}&${PAGE_PARAM}${page}`)
        .then(res => res.json())
        .then(result => this.setNews(result))
        .catch(error => error);
  };

  handleInputChange = ({ target }) => {
    this.setState({
      searchQuery: target.value
    })
  };

  getSearch = ({ key }) => {
    if(key === 'Enter') {
      const { searchQuery, hitsPerPage } = this.state;
      this.setState({
        page: 0,
      });
      this.fetchData(searchQuery, hitsPerPage, 0);
    }
  };

  setNews = result => {
    this.setState({ result });
  };

  handleHitsChange = ({ target }) => {
    const { searchQuery } = this.state;

    this.setState({
      hitsPerPage: +target.value,
      page: 0
    }, () => {
      this.fetchData(searchQuery, this.state.hitsPerPage, 0);
    })
  };

  handlePageChange = ({ target }) => {
    const btnType = target.getAttribute('data-name');
    let { page } = this.state;

    if(!isNaN(btnType)) {
      this.updatePage(+btnType);
    } else {
      switch (btnType) {
        case 'next':
          this.updatePage(page + 1);
          break;
        case 'prev':
          this.updatePage(page - 1);
          break;
        default:
          this.updatePage(0);
      }
    }
  };

  updatePage = number => {
    const { searchQuery, hitsPerPage } = this.state;
    this.setState({
      page: number,
    }, () => {
      this.fetchData(searchQuery, hitsPerPage, number);
    })
  };

  render() {
    const { searchQuery, result, hitsPerPage } = this.state;
    const { hits = [], page, nbPages } = result;

    return (
        <div className="wrapper">
          <Title title="Hacker News" />
          <Select options={ HITS } handleChange={ this.handleHitsChange } value={ hitsPerPage } />
          <Pagination
              onClick={ this.handlePageChange }
              page={ page }
              lastPage={ nbPages }
          />
          <Input onKeyPress={ this.getSearch } onChange={ this.handleInputChange } value={ searchQuery } />
          <ul className="newsList">
            {hits.map(({ author, created_at, num_comments, objectID, title, points, url }) =>
                <NewsPost
                    key={ objectID }
                    author={ author }
                    created_at={ created_at }
                    num_comments={ num_comments }
                    title={ title }
                    points={ points }
                    url={ url }
                />
            )}
          </ul>
        </div>
    );
  }
}

export default App;