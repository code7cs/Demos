import React from 'react';

export default function Child(props) {
	// props.item = 2; // TypeError: Cannot assign to read only property 'item' of object '#<Object>'

	const handleNumber = (e) => {
		props.onNumberChange(e.target.value);
	};

	return (
		<div>
			<span>From Child --- Please enter a number: </span>
			<input type="number" onChange={handleNumber} />
			<p>From Child --- Current number is: {props.item}</p>
		</div>
	);
}
