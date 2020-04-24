import React from 'react';
import { Breadcrumb, Icon } from 'antd';
import { connect } from 'react-redux'
import { switchMenu } from '@/redux/action'

import "@/styles/breadcrumb.less";

class HeadBar extends React.Component {
  state = {
    current: '',
    collapsed: false
  };
  handleTabClick(obj) {
    const { dispatch } = this.props
    dispatch(switchMenu(obj.key))
  }
  render() {
    return (
      <div className>
        <div className='menus-wrapper'>
        <Breadcrumb>
            <Breadcrumb.Item href="">
            <Icon type="home" />
            </Breadcrumb.Item>
            <Breadcrumb.Item href="">
            <Icon type="user" />
            <span>Application List</span>
            </Breadcrumb.Item>
            <Breadcrumb.Item>Application</Breadcrumb.Item>
        </Breadcrumb>
        </div>
      </div>
    )
  }
}


const mapStateToProps = state => {
  return {
    swtichActive: state.swtichActive,
  }
};
export default connect(mapStateToProps)(HeadBar)