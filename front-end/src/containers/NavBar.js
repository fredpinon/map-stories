import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';

import { connect } from 'react-redux';
import { storeCredentials, logOutUser, fetchStoriesSearch, clearSearch, loginUser } from '../actions';

import '../css/NavBar.css';
import LoginButton from '../components/LoginButton';
import Logged from '../components/Logged';
import Search from '../components/Search';

import AppBar from 'material-ui/AppBar';
import TextField from 'material-ui/TextField';

const _ = require('underscore');

class NavBar extends Component {

  handleLogin = (response) => {
    const userCredentials = {
      token: response.accessToken,
      email: response.email,
      name: response.name,
      picture: response.picture.data.url,
    };
    this.props.loginUserToDb(userCredentials);
    this.props.saveUserInStore(userCredentials);
  }

  handleSignOut = () => this.props.logOut();

  handleSearching = query => this.search(query);

  search = _.debounce((query) => {
    if (query.length > 2) this.props.searchStory(query);
    else this.props.clear();
  }, 500);

  render() {
    const { pathname } = this.props.location;
    return (
      <AppBar
        className="NavBar"
        title={<Link to='/'>Map Stories</Link>}
        showMenuIconButton={false}
        iconElementRight={
          this.props.userCredentials.token
          ? (
            <div className="LoggedInActions">
              {pathname === '/' ? <Search passQuery={this.handleSearching}/> : null}
              <img className="ProfilePic" src={this.props.userCredentials.picture}/>
              <Logged handleSignOut={this.handleSignOut}/>
            </div>
          ) : (
            <div className="LoggedInActions">
              {pathname === '/' ? <Search passQuery={this.handleSearching}/> : null}
              <img className="ProfilePic" src={this.props.userCredentials.picture}/>
              <LoginButton handleLogin={this.handleLogin}/>
            </div>
          )}
        />
      );
    }
  }

  const mapStateToProps = (state) => ({
    userCredentials: state.authentication,
    page: state.pages.storiesList
  });

  const mapDispatchToProps = (dispatch) => ({
    saveUserInStore: (userCredentials) => dispatch(storeCredentials(userCredentials)),
    loginUserToDb : (userCredentials) => dispatch(loginUser(userCredentials)),
    logOut: () => dispatch(logOutUser()),
    searchStory: (query) => dispatch(fetchStoriesSearch(query)),
    clear: () => dispatch(clearSearch())
  });

  export default withRouter(connect(mapStateToProps, mapDispatchToProps)(NavBar));
