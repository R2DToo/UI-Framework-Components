import {createCustomElement, actionTypes} from '@servicenow/ui-core';
const {COMPONENT_PROPERTY_CHANGED,COMPONENT_ERROR_THROWN} = actionTypes;
import snabbdom from '@servicenow/ui-renderer-snabbdom';
import {createHttpEffect} from '@servicenow/ui-effect-http';
import styles from './styles.scss';

import {TAG_COLORS} from '../constants';

const view = (state, {updateState, dispatch}) => {
	console.log('snc-alert-email-timeline state: ', state);

	const fireEvent = (event_name, payload) => {
		dispatch(event_name, payload);
	}

	const getDifferenceInMinutes = (date1, date2) => {
		let differenceInMs = date2.getTime() - date1.getTime();
		return Math.floor((differenceInMs / 1000) / 60);
	}

	const monthIndexToString = (month) => {
		let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
		return months[month] || '';
	}

	var startTime = new Date(state.properties.parentRecord[0].initial_remote_time.display_value || state.properties.parentRecord[0].sys_created_on.display_value);
	startTime.setSeconds(0);
	console.log("startTime: ", startTime);
	var columnDateHeaders = new Date(state.properties.parentRecord[0].initial_remote_time.display_value || state.properties.parentRecord[0].sys_created_on.display_value);
	const numOfColumns = 30;

	const parentComponent = state.properties.parentRecord.map((record) => {
		const renderEvent = () => {
			let startPosition = 1;
			let endPosition = numOfColumns + 1;
			if (record.events && record.source.display_value != "Group Alert") {
				return record.events.map((event, i) => {
					let eventTime = new Date(event.time_of_event.display_value);
					console.log("parent eventTime: ", eventTime);
					startPosition = getDifferenceInMinutes(startTime, eventTime) + 1;
					console.log("parent startPosition: ", startPosition);
					if (record.events[i + 1]) {
						endPosition = getDifferenceInMinutes(startTime, new Date(record.events[i + 1].time_of_event.display_value)) + 1;
						if (endPosition > numOfColumns + 1) {
							endPosition = numOfColumns + 1;
						}
					} else {
						endPosition = numOfColumns + 1;
					}
					console.log("parent endPosition: ", endPosition);
					if (startPosition <= numOfColumns) {
						return (
							<li title={`Type: ${record.type.display_value} - Event Time: ${event.time_of_event.display_value}`} style={{gridColumn: `${startPosition}/${endPosition}`}}>
								<div className="pulsate left" style={{border: '3px solid ' + TAG_COLORS[event.severity.value? parseInt(event.severity.value) - 1 : 4]}}></div>
								<div className="dot" style={{backgroundColor: TAG_COLORS[event.severity.value? parseInt(event.severity.value) - 1 : 4]}}></div>
								<div className="bar-between-dot"></div>
								<div className="pulsate right" style={{border: '3px solid ' + TAG_COLORS[event.severity.value? parseInt(event.severity.value) - 1 : 4]}}></div>
								<div className="dot" style={{backgroundColor: TAG_COLORS[event.severity.value? parseInt(event.severity.value) - 1 : 4]}}></div>
							</li>
						)
					} else {
						return;
					}
				});
			} else {
				let eventTime = new Date(record.sys_created_on.display_value);
				startPosition = getDifferenceInMinutes(startTime, eventTime) + 1;
				endPosition = startPosition + 1;
				return (
					<li title={`Type: ${record.type.display_value} - Created Time: ${record.sys_created_on.display_value}`} style={{gridColumn: `${startPosition}/${endPosition}`}}>
						<div className="pulsate left" style={{border: '3px solid #757DE8'}}></div>
						<div className="dot" style={{backgroundColor: '#757DE8'}}></div>
						<div className="bar-between-dot"></div>
						<div className="pulsate right" style={{border: '3px solid #757DE8'}}></div>
						<div className="dot" style={{backgroundColor: '#757DE8'}}></div>
					</li>
				)
			}
		}
		return (
			<div className="gantt__row">
				<div className="gantt__row-first">
					<span className="record-link" title="Open Record" onclick={() => {fireEvent("RECORD_LINK_CLICKED", {value: record.sys_id.value})}}>{record.number.display_value}</span><br/>
					<span className="key">CI: </span><span className="value">{record.cmdb_ci.display_value}</span><br/>
					<span className="key">Type: </span><span className="value">{record.type.display_value}</span>
				</div>
				<ul className="gantt__row-bars" style={{gridTemplateColumns: `repeat(${numOfColumns}, 100px)`}}>
					{renderEvent()}
				</ul>
			</div>
		)
	});

	const childComponent = state.properties.childRecords.map((record) => {
		let startPosition = 1;
		let endPosition = numOfColumns + 1;
		return (
			<div className="gantt__row">
				<div className="gantt__row-first">
					<span className="record-link" title="Open Record" onclick={() => {fireEvent("RECORD_LINK_CLICKED", {value: record.number.display_value})}}>{record.number.display_value}</span><br/>
					<span className="key">CI: </span><span className="value">{record.cmdb_ci.display_value}</span><br/>
					<span className="key">Type: </span><span className="value">{record.type.display_value}</span>
				</div>
				<ul className="gantt__row-bars" style={{gridTemplateColumns: `repeat(${numOfColumns}, 100px)`}}>
					{record.events && record.events.map((event, i) => {
						let eventTime = new Date(event.time_of_event.display_value);
						startPosition = getDifferenceInMinutes(startTime, eventTime) + 1;
						if (record.events[i + 1]) {
							endPosition = getDifferenceInMinutes(startTime, new Date(record.events[i + 1].time_of_event.display_value)) + 1;
							if (endPosition > numOfColumns + 1) {
								endPosition = numOfColumns + 1;
							}
						} else {
							endPosition = numOfColumns + 1;
						}
						if (startPosition <= numOfColumns) {
							return (
								<li title={`Type: ${record.type.display_value} - Event Time: ${event.time_of_event.display_value}`} style={{gridColumn: `${startPosition}/${endPosition}`}}>
									<div className="dot" style={{backgroundColor: TAG_COLORS[event.severity.value? parseInt(event.severity.value) - 1 : 4]}}></div>
									<div className="bar-between-dot"></div>
									<div className="dot" style={{backgroundColor: TAG_COLORS[event.severity.value? parseInt(event.severity.value) - 1 : 4]}}></div>
								</li>
							)
						} else {
							return;
						}
					})}
				</ul>
			</div>
		)
	});

	return (
		<div id="snc-alert-email-timeline">
			<div className="wrapper">
				<div className="gantt">
					<div className="gantt__row gantt__row--months" style={{gridTemplateColumns: `150px repeat(${numOfColumns}, 100px)`}}>
						<div className="gantt__row-first">
							<span className="key small">Clustering:</span><br/>
							<span className="value big">{state.properties.parentRecord[0].group_source.display_value || ''}</span>
						</div>
						{[...Array(numOfColumns)].map((e, i) => {
							let month = monthIndexToString(columnDateHeaders.getMonth()); //0 - 11
							let day = columnDateHeaders.getDate(); //1 - 31
							let hour = columnDateHeaders.getHours(); //0 - 23
							let minutes = String(columnDateHeaders.getMinutes()).padStart(2, '0'); //0 - 59
							// Add day
							columnDateHeaders = new Date(columnDateHeaders.getTime() + 1*60000);
							return <span>{month} {day}<br/>{hour}:{minutes}</span>
						})}
					</div>
					<div className="gantt__row gantt__row--lines" style={{gridTemplateColumns: `150px repeat(${numOfColumns}, 100px)`}}>
						{[...Array(numOfColumns)].map((e, i) => (
							<span></span>
						))}
						<span></span>
					</div>
					{parentComponent}
					{childComponent}
				</div>
			</div>
		</div>
	);
};

createCustomElement('snc-alert-email-timeline', {
	renderer: {type: snabbdom},
	view,
	styles,
	properties: {
		parentRecord: {
			default: []
		},
		childRecords: {
			default: []
		}
	},
	setInitialState() {
		return {
			dummyStateChange: false,
		}
	},
	actionHandlers: {
		[COMPONENT_PROPERTY_CHANGED]: (coeffects) => {
			const { dispatch, action } = coeffects;
			console.log('COMPONENT_PROPERTY_CHANGED payload: ', action.payload);
			if (action.payload.previousValue == action.payload.value) {
				return;
			}
			if (action.payload.name == "parentRecord") {
				if (action.payload.value[0].source.display_value != "Group Alert") {
					let parentSysparam = 'alert=' + action.payload.value[0].sys_id.value + '^ORDERBYtime_of_event';
					console.log("parentSysparam: ", parentSysparam);
					dispatch('FETCH_PARENT_EVENTS', {
						sysparm_query: parentSysparam,
						sysparm_fields: "time_of_event,severity,alert",
						sysparm_display_value: 'all'
					});
				}
				let childSysparam = 'alert.parent=' + action.payload.value[0].sys_id.value + '^ORDERBYtime_of_event';
				console.log("childSysparam: ", childSysparam);
				dispatch('FETCH_CHILD_EVENTS', {
					sysparm_query: childSysparam,
					sysparm_fields: "time_of_event,severity,alert",
					sysparm_display_value: 'all'
				});
			}
		},
		'FETCH_PARENT_EVENTS': createHttpEffect('api/now/table/em_event', {
			method: 'GET',
			queryParams: ['sysparm_query', 'sysparm_fields', 'sysparm_display_value'],
			successActionType: 'FETCH_PARENT_EVENTS_SUCCESS'
		}),
		'FETCH_PARENT_EVENTS_SUCCESS': (coeffects) => {
			const { action, state, updateProperties, updateState } = coeffects;
			console.log('FETCH_PARENT_EVENTS_SUCCESS');
			const { result } = action.payload;
			console.log("payload: ", result);

			if (result.length > 0) {
				let updatedParent = state.properties.parentRecord;
				updatedParent[0].events = [];
				result.forEach((row) => {
					updatedParent[0].events.push(row);
				});
				updateProperties({parentRecord: updatedParent});
				updateState({dummyStateChange: !state.dummyStateChange});
			}
		},
		'FETCH_CHILD_EVENTS': createHttpEffect('api/now/table/em_event', {
			method: 'GET',
			queryParams: ['sysparm_query', 'sysparm_fields', 'sysparm_display_value'],
			successActionType: 'FETCH_CHILD_EVENTS_SUCCESS'
		}),
		'FETCH_CHILD_EVENTS_SUCCESS': (coeffects) => {
			const { action, state, updateProperties, updateState } = coeffects;
			console.log('FETCH_CHILD_EVENTS_SUCCESS');
			const { result } = action.payload;
			console.log("payload: ", result);
			if (result.length > 0) {
				let updatedChild = state.properties.childRecords;
				result.forEach((row) => {
					let matchIndex = updatedChild.findIndex((childRow) => childRow.sys_id.value == row.alert.value);
					if (matchIndex > -1) {
						updatedChild[matchIndex].events ?
						updatedChild[matchIndex].events.push(row) :
						updatedChild[matchIndex].events = [row];
					}
				});
				updateProperties({childRecords: updatedChild});
				updateState({dummyStateChange: !state.dummyStateChange});
			}
		},
		[COMPONENT_ERROR_THROWN]: (coeffects) => {
			console.log("%cERROR_THROWN: %o", "color:red", coeffects.action.payload);
		}
	}
});