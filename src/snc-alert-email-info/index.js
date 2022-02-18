import {createCustomElement, actionTypes} from '@servicenow/ui-core';
const { COMPONENT_PROPERTY_CHANGED} = actionTypes;
import {createHttpEffect} from '@servicenow/ui-effect-http';
import snabbdom from '@servicenow/ui-renderer-snabbdom';
import styles from './styles.scss';
import '@servicenow/now-icon';
import '@servicenow/now-highlighted-value';
import '@servicenow/now-rich-text';

const view = (state, {updateState, dispatch}) => {
	console.log('snc-alert-email-info state: ', state);

	return (
		<div id="info-container">
			<div id="info-header">
				<h1><now-icon icon="circle-chevron-left-outline" size="lg" onclick={() => {dispatch("CLOSE_INFO_BUTTON#CLICKED")}}/>Total Clustered Alerts (<span className="primary-color">{state.properties.focusedChildRecords.length}</span>)</h1>
			</div>
			<div id="cards-header">
				<div className="tabset">
					<input type="radio" name="tabset" id="tab0" aria-controls="alerts" checked onchange={() => {updateState({activeTabIndex: 0})}}/>
					<label for="tab0">Alerts</label>
					<input type="radio" name="tabset" id="tab1" aria-controls="activities" onchange={() => {updateState({activeTabIndex: 1})}}/>
					<label for="tab1">Activities</label>
					<input type="radio" name="tabset" id="tab2" aria-controls="tags" onchange={() => {updateState({activeTabIndex: 2})}}/>
					<label for="tab2">Tags</label>
					<input type="radio" name="tabset" id="tab3" aria-controls="additional" onchange={() => {updateState({activeTabIndex: 3})}}/>
					<label for="tab3">Additional</label>
					<input type="radio" name="tabset" id="tab4" aria-controls="changes" onchange={() => {updateState({activeTabIndex: 4})}}/>
					<label for="tab4">Changes</label>
				</div>
			</div>
			<div id="info-cards">
				{state.properties.focusedRecord.map((record) => {
					let color = 'low';
					switch (record.severity.value) {
						case "5": color = 'low';
						break;
						case "4": color = 'info';
						break;
						case "3": color = 'warning';
						break;
						case "2": color = 'high';
						break;
						case "1": color = 'critical';
						break;
					}
					return (
						<div className="info-card">
							<div className="card-header">
								<div className="record-link" onclick={() => {dispatch("RECORD_LINK#CLICKED", {value: record._row_data.uniqueValue})}}>{record._row_data.displayValue}</div>
								<div className="right"><now-highlighted-value label={record.severity.displayValue} color={color} variant="secondary"/></div>
								<div className="">{record.group_source.displayValue}</div>
								<div className="right">{record.sys_updated_on.displayValue}</div>
							</div>
							{state.activeTabIndex == 0 && (
								<div className="card-body">
									<p><span className="key">Configuration Item:</span> <span className="">{record.cmdb_ci.displayValue}</span></p>
									<p><span className="key">Source:</span> <span className="">{record.source.displayValue}</span></p>
									<p><span className="key">Type:</span> <span className="">{record.type.displayValue}</span></p>
									<p><span className="key">Node:</span> <span className="">{record.node.displayValue}</span></p>
									<p><span className="key">Incident:</span> <span className="">{record.incident.displayValue}</span></p>
									<p><span className="key">Description:</span> <span className="">{record.description.displayValue}</span></p>
								</div>
							)}
							{state.activeTabIndex == 1 && (
								<div className="card-body">
									{record.work_notes.map((note) =>
										<p><span className="key">Work Note:</span> <now-rich-text html={note.value}/></p>
									)}
								</div>
							)}
							{state.activeTabIndex == 2 && (
								<div className="card-body">
									<p><span className="key">Tags:</span> Coming Soon...</p>
								</div>
							)}
							{state.activeTabIndex == 3 && (
								<div className="card-body overflow">
									{record.additional_info.displayValue != '' && (
										<div>
											<p><span className="key">Additional Info:</span></p>
											<pre className="">{JSON.stringify(JSON.parse(record.additional_info.displayValue), null, 2)}</pre>
										</div>
									)}
								</div>
							)}
							{state.activeTabIndex == 4 && (
								<div className="card-body">
									<p><span className="key">Changes:</span> Coming Soon...</p>
								</div>
							)}
						</div>
					)
				})}
				{state.properties.focusedChildRecords.map((record) => {
					let color = 'low';
					switch (record.severity.value) {
						case "5": color = 'low';
						break;
						case "4": color = 'info';
						break;
						case "3": color = 'warning';
						break;
						case "2": color = 'high';
						break;
						case "1": color = 'critical';
						break;
					}
					return (
						<div className="info-card">
							<div className="card-header">
								<div className="record-link" onclick={() => {dispatch("RECORD_LINK#CLICKED", {value: record._row_data.uniqueValue})}}>{record._row_data.displayValue}</div>
								<div className="right"><now-highlighted-value label={record.severity.displayValue} color={color} variant="secondary"/></div>
								<div className="">{record.group_source.displayValue}</div>
								<div className="right">{record.sys_updated_on.displayValue}</div>
							</div>
							{state.activeTabIndex == 0 && (
								<div className="card-body">
									<p><span className="key">Configuration Item:</span> <span className="">{record.cmdb_ci.displayValue}</span></p>
									<p><span className="key">Source:</span> <span className="">{record.source.displayValue}</span></p>
									<p><span className="key">Type:</span> <span className="">{record.type.displayValue}</span></p>
									<p><span className="key">Node:</span> <span className="">{record.node.displayValue}</span></p>
									<p><span className="key">Incident:</span> <span className="">{record.incident.displayValue}</span></p>
									<p><span className="key">Description:</span> <span className="">{record.description.displayValue}</span></p>
								</div>
							)}
							{state.activeTabIndex == 1 && (
								<div className="card-body"></div>
							)}
							{state.activeTabIndex == 2 && (
								<div className="card-body">
									<p><span className="key">Tags:</span> Coming Soon...</p>
								</div>
							)}
							{state.activeTabIndex == 3 && (
								<div className="card-body overflow">
									{record.additional_info.displayValue != '' && (
										<div>
											<p><span className="key">Additional Info:</span></p>
											<pre className="">{JSON.stringify(JSON.parse(record.additional_info.displayValue), null, 2)}</pre>
										</div>
									)}
								</div>
							)}
							{state.activeTabIndex == 4 && (
								<div className="card-body">
									<p><span className="key">Changes:</span> Coming Soon...</p>
								</div>
							)}
						</div>
					)
				})}
			</div>
		</div>
	);
};

createCustomElement('snc-alert-email-info', {
	renderer: {type: snabbdom},
	view,
	styles,
	actionHandlers: {
		[COMPONENT_PROPERTY_CHANGED]: (coeffects) => {
			const { dispatch, action } = coeffects;
			let sysparam = "name=em_alert^element_idIN";
			for (let i = 0; i < action.payload.value.length; i++) {
				sysparam += action.payload.value[i]._row_data.uniqueValue + ",";
			}
			if (sysparam.charAt(sysparam.length - 1) == ",") {
				sysparam = sysparam.substring(0, sysparam.length - 1);
			}
			dispatch('FETCH_WORK_NOTES', {
					sysparm_query: sysparam
			});
		},
		'FETCH_WORK_NOTES': createHttpEffect('api/now/table/sys_journal_field', {
			method: 'GET',
			queryParams: ['sysparm_query'],
			successActionType: 'FETCH_WORK_NOTES_SUCCESS'
		}),
		'FETCH_WORK_NOTES_SUCCESS': (coeffects) => {
			const { action, state, updateProperties, updateState } = coeffects;
			const { result } = action.payload;
			for(let i = 0; i < result.length; i++) {
				let matchIndex = state.properties.focusedRecord.findIndex((field) => field._row_data.uniqueValue == result[i].element_id);
				if (matchIndex > -1) {
					let match = state.properties.focusedRecord[matchIndex];
					if (match.work_notes) {
						match.work_notes.push(result[i]);
					} else {
						match.work_notes = [result[i]];
					}
					let updatedFocusedRecord = state.properties.focusedRecord;
					updatedFocusedRecord[matchIndex] = match;
					updateProperties({focusedRecord: updatedFocusedRecord});
					updateState({dummyStateChange: !state.dummyStateChange});
				}
			}
		}
	},
	properties: {
		focusedChildRecords: {
			default: []
		},
		focusedRecord: {
			default: []
		}
	},
	setInitialState() {
		return {
			activeTabIndex: 0,
			dummyStateChange: false
		}
	}
});
