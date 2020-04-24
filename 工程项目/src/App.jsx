import React from 'react';
import { connect } from 'react-redux'
import Routes from './router/router.js';
import { switchMenu,switchSubMenu} from '@/redux/action'


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentWillMount(){
    const {dispatch} = this.props
    let url = window.location.hash.slice(1,window.location.hash.length)
    dispatch(switchMenu(url==='/'?'/home':url))
    dispatch(switchSubMenu([url.split('/')[1]]))
  }
 
  render() {
    return (
      <Routes />
    );
  }
}

export default connect()(App);
