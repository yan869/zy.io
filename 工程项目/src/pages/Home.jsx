import React from 'react';
import NavBar from "./NavBar";
import HeadBar from "./HeadBar";
// import Breadcrumb from './Breadcrumb'
import '@/styles/index.less';

class Home extends React.Component {
	render() {
		return (
			<div className="container">
				<NavBar props={this.props}></NavBar>
				<div className='content-wrapper'>
					<HeadBar></HeadBar>
					<div className= "main-container">
						{/* <Breadcrumb/> */}
						<div className="main-content">
							{this.props.children}
						</div>
					</div>
				</div>
			</div>
		)
	}
}

export default Home