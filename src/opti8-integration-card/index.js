import {createCustomElement, actionTypes} from '@servicenow/ui-core';
const {COMPONENT_ERROR_THROWN,COMPONENT_PROPERTY_CHANGED,COMPONENT_BOOTSTRAPPED} = actionTypes;
import snabbdom from '@servicenow/ui-renderer-snabbdom';
import styles from './styles.scss';
import '@servicenow/now-rich-text';


const view = (state, {updateState, dispatch}) => {
	// console.log('opti8-integration-card state: ', state);

	const copyTextToClipboard = async (text) => {
		if (navigator.clipboard) {
			await navigator.clipboard.writeText(text);
		}
	};

	return (
		<article className="card">
			<div className="card-header">
				<div>
					<span><img src={state.properties.svgIcon}/></span>
					<h2>{state.properties.name}{state.properties.count > 0 && <span>&nbsp;({state.properties.count})</span>}</h2>
				</div>
				<label className="toggle">
					<input type="checkbox" checked={state.properties.active == 'true' ? true : false} disabled/>
					<span></span>
				</label>
			</div>
			<div className="card-body-compact">
				<p>{state.properties.type == "PULL" ? state.properties.description : ''}</p>
			</div>
			{/* <div className="card-body">
				{state.properties.description && <p>
					{state.properties.type == "Webhook"
					? <svg attrs={{xmlns: "http://www.w3.org/2000/svg", height: "24px", width: "24px", viewBox: "0 0 24 24"}}><path attr-d="M0 0h24v24H0V0z" attr-fill="none"/><path attr-d="M17 7h-4v2h4c1.65 0 3 1.35 3 3s-1.35 3-3 3h-4v2h4c2.76 0 5-2.24 5-5s-2.24-5-5-5zm-6 8H7c-1.65 0-3-1.35-3-3s1.35-3 3-3h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-2zm-3-4h8v2H8z"/></svg>
					: <svg attrs={{xmlns: "http://www.w3.org/2000/svg", height: "24px", width: "24px", viewBox: "0 0 24 24", 'enable-background': "new 0 0 24 24"}}><rect attr-fill="none" attr-height="24" attr-width="24"/><g><path attr-d="M19.88,18.47c0.44-0.7,0.7-1.51,0.7-2.39c0-2.49-2.01-4.5-4.5-4.5s-4.5,2.01-4.5,4.5s2.01,4.5,4.49,4.5 c0.88,0,1.7-0.26,2.39-0.7L21.58,23L23,21.58L19.88,18.47z M16.08,18.58c-1.38,0-2.5-1.12-2.5-2.5c0-1.38,1.12-2.5,2.5-2.5 s2.5,1.12,2.5,2.5C18.58,17.46,17.46,18.58,16.08,18.58z M15.72,10.08c-0.74,0.02-1.45,0.18-2.1,0.45l-0.55-0.83l-3.8,6.18 l-3.01-3.52l-3.63,5.81L1,17l5-8l3,3.5L13,6C13,6,15.72,10.08,15.72,10.08z M18.31,10.58c-0.64-0.28-1.33-0.45-2.05-0.49 c0,0,5.12-8.09,5.12-8.09L23,3.18L18.31,10.58z"/></g></svg>}
					&nbsp;&nbsp;{state.properties.description}
				</p>}
			</div> */}
			<div className="card-footer">
				<span class={{disabled: state.properties.type == 'PULL'}} onclick={() => {if (state.properties.type != 'PULL') {copyTextToClipboard(state.properties.description)}}}>{state.properties.type}</span>
				<a href={state.properties.link} target="_blank" rel="noopener noreferrer">View integration</a>
			</div>
		</article>
	);
};

createCustomElement('opti8-integration-card', {
	renderer: {type: snabbdom},
	view,
	styles,
	properties: {
		svgIcon: {
			default: ''
		},
		name: {
			default: ''
		},
		active: {
			default: 'false'
		},
		link: {
			default: ''
		},
		type: {
			default: ''
		},
		description: {
			default: ''
		},
		count: {
			default: 0
		}
	},
	actionHandlers: {
		[COMPONENT_ERROR_THROWN]: (coeffects) => {
			console.log("%cERROR_THROWN: %o", "color:red", coeffects.action.payload);
		},
	}
});
