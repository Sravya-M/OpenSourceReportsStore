import React, { Component } from 'react';
import AppNavbar from './components/AppNavbar';
import { Provider } from 'react-redux';
import store from './store';
import { Container } from 'reactstrap';
import { loadUser } from './actions/authActions';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import ItemModal from './components/ItemModal';
import ShoppingList from './components/ShoppingList';

class App extends Component {
  componentDidMount() {
    store.dispatch(loadUser());
  }
  render() {
    return (
      <Provider store={store}>
        <div className='App'>
          <AppNavbar />
          <Container>
            <ItemModal />
            <ShoppingList />
          </Container>
        </div>
      </Provider>
    );
  }
}

export default App;