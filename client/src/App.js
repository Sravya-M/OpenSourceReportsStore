import React, { Component } from 'react';
import AppNavbar from './components/AppNavbar';
import { Provider } from 'react-redux';
import store from './store';
import { loadUser } from './actions/authActions';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import HomePage from './components/HomePage';
import ReportsList from './components/ReportsList';
import AppFooter from './components/AppFooter';


class App extends Component {
  componentDidMount() {
    store.dispatch(loadUser());
  }
  render() {
    return (
      <Provider store={store}>
        <div className='App'>
          <AppNavbar />
          <HomePage />
          <ReportsList />
          <AppFooter />
        </div>
      </Provider>
    );
  }
}

export default App;