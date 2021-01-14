// import logo from './logo.svg';
import './App.css';
import React from 'react';
import Child from '../src/components/child';

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			number: 1
		};
		this.age = 66;
	}

	handleNumberChange = (newNumber) => {
		this.setState({ number: newNumber });
	};

	render() {
		return (
			<div>
				<p>From Parent --- Current number is: {this.state.number}</p>
				<Child item={this.state.number} onNumberChange={this.handleNumberChange} />
				<p>{this.state.number}</p>
				<p>{this.state.age}</p>
			</div>
		);
	}
}

export default App;
