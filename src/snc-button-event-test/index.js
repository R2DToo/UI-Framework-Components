import {createCustomElement} from '@servicenow/ui-core';
import snabbdom from '@servicenow/ui-renderer-snabbdom';
import styles from './styles.scss';

const EXAMPLE_EVENT = "EXAMPLE_BUTTON_CLICKED";

const view = (state, { dispatch}) => {
	const fireEvent = (event_name) => {
		console.log("%cFIRE EVENT: " + event_name, "color: blue;");
		dispatch(event_name);
	}

	return (
		<div>
			<button onclick={() => {fireEvent(EXAMPLE_EVENT)}}>Click me to fire event</button>
		</div>
	);
};

createCustomElement('snc-button-event-test', {
	renderer: {type: snabbdom},
	view,
	styles,
	actions: {
		[EXAMPLE_EVENT]: {}
	}
});
