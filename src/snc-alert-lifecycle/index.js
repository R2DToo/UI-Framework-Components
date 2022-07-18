import {createCustomElement, actionTypes} from '@servicenow/ui-core';
const { COMPONENT_PROPERTY_CHANGED, COMPONENT_BOOTSTRAPPED, COMPONENT_ERROR_THROWN} = actionTypes;
import snabbdom from '@servicenow/ui-renderer-snabbdom';
import styles from './styles.scss';

const view = (state, {updateState, dispatch}) => {
	console.log('snc-alert-lifecycle state: ', state);

	return (
		<div id="snc-alert-lifecycle">
			<div className="process-wrapper">
				<div id="progress-bar-container">
					<ul>
						{state.steps.map((step, index) => {
							return <li class={{active: step.active}} onclick={() => {dispatch("STEP_CLICKED", {index: index})}}><div className="step-inner">{step.label}</div></li>
						})}
					</ul>

					<div id="line">
						<div id="line-progress" style={{width: `${state.progress}%`}}></div>
					</div>
				</div>

				<div id="progress-content-section">
					{state.steps.map((step) => {
						return <div className={`section-content`} class={{active: step.active}}>
							<h2>{step.label}</h2>
							{step.description}
							{/* {step.link} */}
						</div>
					})}
				</div>
			</div>
		</div>
	);
};

createCustomElement('snc-alert-lifecycle', {
	renderer: {type: snabbdom},
	view,
	styles,
	properties: {},
	setInitialState() {
		return {
			steps: [
				{label: 'Events', active: true, link: (<div onclick={() => {dispatch("UPDATE_PAGE#PARAMETER", {params: {list: "f089c8d297230150ada0b9cfe153af09"}});}}>Events</div>), description: (<div>
					<p>The Alert Correlation capability enhances Event Management with alert data analysis and alert aggregation. Alert Correlation helps organize incoming real-time alerts and reduce alert noise. Out of the box techniques used are Tag-based Alert Clustering, Automated Temporaral Analysis, CMDB Topological Analysis, and Text Analysis.</p>
				</div>)},
				{label: 'Event Rules', active: false, link: (<div onclick={() => {dispatch("UPDATE_PAGE#PARAMETER", {params: {list: "f089c8d297230150ada0b9cfe153af09"}});}}>Events</div>), description: (<div><p>Use event rules to generate alerts for tracking and remediation. Event rules are stored in the Event Rule [em_match_rule] table. Configure and customize event rules to manage events and alert generation.</p></div>)},
				{label: 'Event Field Mapping', active: false, link: (<div onclick={() => {dispatch("UPDATE_PAGE#PARAMETER", {params: {list: "f089c8d297230150ada0b9cfe153af09"}});}}>Events</div>), description: (<div><p>Extract and transform attributes when an event source is not capable of passing the values in event field, then pass the values in Additional Information field on event which can be parsed and mapped to other field on alert before alert generation.</p></div>)},
				{label: 'Alerts', active: false, link: (<div onclick={() => {dispatch("UPDATE_PAGE#PARAMETER", {params: {list: "f089c8d297230150ada0b9cfe153af09"}});}}>Events</div>), description: (<div>
					<p>Alerts are generated from de-duplicated events. You can view more information about them, acknowledge them, and take action to resolve them.</p>
					<p>You can respond to an alert in the following ways:</p>
					<ul>
						<li>Manually remediate the alert.</li>
						<li>Acknowledge an alert that requires attention.</li>
						<li>Create an incident or security incident.</li>
						<li>Create a case.</li>
						<li>Close the alert.</li>
						<li>Resolve any incident that is related to the alert.</li>
						<li>Reopen the alert.</li>
						<li>As well as endless workflows.</li>
					</ul>
				</div>)},
				{label: 'Alert Management Rules', active: false, link: (<div onclick={() => {dispatch("UPDATE_PAGE#PARAMETER", {params: {list: "f089c8d297230150ada0b9cfe153af09"}});}}>Events</div>), description: (<div><p>Alert Management Rules provided with the base system help you respond to alerts. You can create filters to specify conditions for the rule so that the remedial action specified in the rule takes effect only when the conditions are met. For example, launch the required subflow or open an incident based on an alert. The alert's execution history is automatically updated to indicate the actions that were invoked.</p></div>)},
				{label: 'Correlation', active: false, link: (<div onclick={() => {dispatch("UPDATE_PAGE#PARAMETER", {params: {list: "f089c8d297230150ada0b9cfe153af09"}});}}>Events</div>), description: (<div><p>The Alert Correlation capability enhances Event Management with alert data analysis and alert aggregation. Alert Correlation helps organize incoming real-time alerts and reduce alert noise. Out of the box techniques used are Tag-based Alert Clustering, Automated Temporal Analysis, CMDB Topological Analysis, and Text Analysis.</p></div>)}
			],
			dummyStateChange: false,
			progress: 0
		}
	},
	actionHandlers: {
		[COMPONENT_ERROR_THROWN]: (coeffects) => {
			console.log("%csnc-alert-lifecycle ERROR_THROWN: %o", "color:red", coeffects.action.payload);
		},
		'STEP_CLICKED': (coeffects) => {
			const {action, state, updateState} = coeffects;
			console.log("STEP_CLICKED payload: ", action.payload);
			let updatedSteps = state.steps;
			updatedSteps.forEach((step) => step.active = false);
			updatedSteps[action.payload.index].active = true;
			let progress = (100 / 5) * (action.payload.index);
			updateState({steps: updatedSteps, dummyStateChange: !state.dummyStateChange, progress: progress});
		},
	},
});
