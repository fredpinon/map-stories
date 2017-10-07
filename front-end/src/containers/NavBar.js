import React, {Component} from 'react';
import { Link } from 'react-router-dom';

import { connect } from 'react-redux';
import { storeToken } from '../actions';

import '../css/NavBar.css';
import LoginButton from '../components/LoginButton';

class NavBar extends Component {

  handleLogin = () => {
    // get token from faceBook then store in redux
    new Promise((resolve, reject) => setTimeout(() => resolve('1039oiNCjnu2080'), 500))
    .then(token => this.props.logIn(token));
  }

  render() {
    return (
      <div className="NavBar">
        <div className="logo">
          <Link to='/'>Map Stories</Link>
        </div>
        <LoginButton handleLogin={this.handleLogin}/>
      </div>
    );
  }
}

const mapStateToProps = () => ({});

const mapDispatchToProps = (dispatch) => ({
  logIn: (token) => dispatch(storeToken(token))
});

export default connect(mapStateToProps, mapDispatchToProps)(NavBar);
