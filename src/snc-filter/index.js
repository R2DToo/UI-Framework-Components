import {createCustomElement, actionTypes} from '@servicenow/ui-core';
const { COMPONENT_PROPERTY_CHANGED, COMPONENT_BOOTSTRAPPED, COMPONENT_ERROR_THROWN} = actionTypes;
import {createHttpEffect} from '@servicenow/ui-effect-http';
import {snabbdom, Fragment} from '@servicenow/ui-renderer-snabbdom';
import styles from './styles.scss';
import '@servicenow/now-popover';
import '@servicenow/now-button';

const view = (state, {updateState, dispatch}) => {
	console.log('snc-filter state: ', state);

	return (
		<div id="snc-filter">
			<now-popover interaction-type="dialog" hide-tail={true} positions={[{"target":"bottom-center","content":"top-center"}]} container={{}}>
				<now-button slot="trigger" label="Check out my popover" variant="secondary" size="md"></now-button>
				<sn-content slot="content" >
					<now-button label="OR" variant="secondary-positive" size="md"></now-button>
					<now-button label="AND" variant="secondary-negative" size="md"></now-button>
				</sn-content>
			</now-popover>
		</div>
	);
};


createCustomElement('snc-filter', {
	renderer: {type: snabbdom},
	view,
	styles,
	properties: {},
	setInitialState({properties}) {
		return {}
	},
	actionHandlers: {
		[COMPONENT_ERROR_THROWN]: (coeffects) => {
			console.log("%cERROR_THROWN: %o", "color:red", coeffects.action.payload);
		},
	},
});
