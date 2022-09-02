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
							return <li class={{active: step.active, ['step' + index]: true}} onclick={() => {dispatch("STEP_CLICKED", {index: index})}}><div className="step-inner">{step.label}</div></li>
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
				{label: 'Core Business Domain', active: true, link: (<div onclick={() => {dispatch("UPDATE_PAGE#PARAMETER", {params: {list: "f089c8d297230150ada0b9cfe153af09"}});}}>Events</div>), description: (<div>
					<p>A boundary for a broad set of differentiating business features/capabilities providing business value and achieve the desired business outcomes.</p>
				</div>)},
				{label: 'Sub Domain', active: false, link: (<div onclick={() => {dispatch("UPDATE_PAGE#PARAMETER", {params: {list: "f089c8d297230150ada0b9cfe153af09"}});}}>Events</div>), description: (<div>
					<p>Core Business Domains are sliced into smaller segments called Sub Domains, in which it’s capabilities are solved by one or more logical component boundaries.</p>
				</div>)},
				{label: 'Generic Domain', active: false, link: (<div onclick={() => {dispatch("UPDATE_PAGE#PARAMETER", {params: {list: "f089c8d297230150ada0b9cfe153af09"}});}}>Events</div>), description: (<div>
					<p>Generic Domain is a boundary set of capabilities that are cross-cutting, such as identity, platform, and infrastructure. A generic domain’s capabilities are by one or more logical component boundaries.</p>
				</div>)},
				{label: 'Capability', active: false, link: (<div onclick={() => {dispatch("UPDATE_PAGE#PARAMETER", {params: {list: "f089c8d297230150ada0b9cfe153af09"}});}}>Events</div>), description: (<div>
					<p>
Represents the desired  features/behaviors that directly fulfill a stakeholder need within a Sub Domain or Generic Domain. Capabilities have a persona, benefit hypothesis, and acceptance criteria. A capability is a solved by one or more component boundaries.</p>
				</div>)},
				{label: 'Logical System', active: false, link: (<div onclick={() => {dispatch("UPDATE_PAGE#PARAMETER", {params: {list: "f089c8d297230150ada0b9cfe153af09"}});}}>Events</div>), description: (<div>
					<p>A set of Logical component boundaries working together to provide the capabilities of one (when modernized) or many (when polluted) domains.</p>
				</div>)},
				{label: 'Logical Component Boundary', active: false, link: (<div onclick={() => {dispatch("UPDATE_PAGE#PARAMETER", {params: {list: "f089c8d297230150ada0b9cfe153af09"}});}}>Events</div>), description: (<div>
					<p>This is a set of Logical Components that support the Logical System. A logical component boundary’s service tier defines its criticality, potential impact to our business, characteristics, and non-functional requirements.</p>
				</div>)},
				{label: 'Logical Components', active: false, link: (<div onclick={() => {dispatch("UPDATE_PAGE#PARAMETER", {params: {list: "f089c8d297230150ada0b9cfe153af09"}});}}>Events</div>), description: (<div>
					<p>A component represents an independently deployed resource that makes up a logical component boundary within a core business domain, or a logical representation of concrete resource or a generic domain.</p>
				</div>)}
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
			let progress = (100 / 6) * (action.payload.index);
			updateState({steps: updatedSteps, dummyStateChange: !state.dummyStateChange, progress: progress});
		},
	},
});
