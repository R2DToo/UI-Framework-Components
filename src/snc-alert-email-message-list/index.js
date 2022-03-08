import {createCustomElement, actionTypes} from '@servicenow/ui-core';
const { COMPONENT_PROPERTY_CHANGED} = actionTypes;
import {createHttpEffect} from '@servicenow/ui-effect-http';
import snabbdom from '@servicenow/ui-renderer-snabbdom';
import styles from './styles.scss';
import '@servicenow/now-icon';
import '@servicenow/now-highlighted-value';
import '@servicenow/now-avatar';
import '@servicenow/now-rich-text';

import {DEFAULT_TABLE_DATA, TAG_COLORS} from '../constants';

const view = (state, {updateState, dispatch}) => {
	console.log('snc-alert-email-message-list state: ', state);

	if (state.properties.tableData.length < 1) {
		return (
			<div className="list2_empty-state-list">
				<div className="list-flavin"></div>
				No records to display
			</div>
		)
	}

	// var fieldOrder = ["Select"];
	// fieldOrder = fieldOrder.concat(Object.keys(state.properties.tableData[0]));
	// fieldOrder.splice(fieldOrder.indexOf("_row_data"), 1);
	const fireEvent = (event_name, value) => {
		console.log("%cFiring Event: " + event_name, "color:blue;font-size:20px;");
		console.log("%cEvent Payload: %o", "color:blue;font-size:20px;", value);

		if (event_name == "TABLE_ROW#CLICKED") {
			updateState({showingNumber: value});
		}
		if (event_name == "TABLE_HEADER#CLICKED") {
			let sortingObjIndex = state.sortingArray.findIndex(obj => obj.field == value);
			if (sortingObjIndex > -1) {
				let updatedSorting = state.sortingArray;
				if (updatedSorting[sortingObjIndex].asc == false) {
					updatedSorting.splice(sortingObjIndex, 1);
				} else {
					updatedSorting[sortingObjIndex].asc = false;
				}
				value = updatedSorting;
				updateState({
					path: 'sortingArray',
					value: updatedSorting,
					operation: "set",
				});
				updateState({dummyStateChange: !state.dummyStateChange});
			} else {
				let updatedSorting = state.sortingArray;
				updatedSorting.push( {field: value, asc: true});
				value = updatedSorting;
				updateState({
					path: 'sortingArray',
					value: updatedSorting,
					operation: "set",
				});
				updateState({dummyStateChange: !state.dummyStateChange});
			}
		}
		dispatch(event_name, {
			value: value
		});
	};

	const allowDrop = (e, droppingColumnIndex) => {
		e.preventDefault();
	}

	const startDrag = (e, draggingColumnIndex) => {
		updateState({ draggingColumnIndex: draggingColumnIndex });
	}

	const drop = (e, index) => {
		e.preventDefault();
		if (state.draggingColumnIndex !== index) {
			reorganizeFields(state.draggingColumnIndex, index);
			updateState({ draggingColumnIndex: 0 });
		}
	}

	// oIndex = Index of the component user is dragging
	// nIndex = Index of the field the user dropped the component on
	const reorganizeFields = (oIndex, nIndex) => {
		console.log('fieldOrder: ', state.tableOrder);
		console.log('oIndex: ', oIndex);
		console.log('nIndex: ', nIndex);
		let newFieldOrder = state.tableOrder;
		let movingField = newFieldOrder.splice(oIndex, 1);
		newFieldOrder.splice(nIndex, 0, movingField[0]);
		updateState({fieldOrder: newFieldOrder});
		// fireEvent("TABLE_HEADER#DROPPED", newFieldOrder.toString());
	}

	const makeRelativeTime = (time) => {
		let currentTime = new Date();
		let fieldTime = new Date(time);

		let diff = fieldTime - currentTime;

		//Convert diff from ms to hh mm ss ms
		let msec = Math.abs(diff);
		let hh = Math.floor(msec / 1000 / 60 / 60);
		msec -= hh * 1000 * 60 * 60;
		let mm = Math.floor(msec / 1000 / 60);
		msec -= mm * 1000 * 60;
		let ss = Math.floor(msec / 1000);
		msec -= ss * 1000;
		if (hh < 24) {
			if (hh > 0) {
				return `${hh} hr ${mm} min ${ss} sec ago`;
			} else {
				return `${mm} min ${ss} sec ago`;
			}
		} else {
			let dd = Math.floor(hh / 24);
			hh = hh % 24;
			return `${dd} d ${hh} hr ago`;
		}
	};

	const getSeverityColor = (severityNumber) => {
		let color = 'positive';
		switch (parseInt(severityNumber)) {
			case 4: color = 'moderate';
			break;
			case 3: color = 'warning';
			break;
			case 2: color = 'high';
			break;
			case 1: color = 'critical';
			break;
			default: color = 'positive';
			break;
		}
		return color;
	}

	const tableHeaders = state.tableOrder.map((key, index) => {
		if (state.properties.tableData[0][key]) {
			let fieldObj = state.properties.tableData[0][key];
			let sortIndex = state.sortingArray.findIndex(obj => obj.field == key);
			let sortObj = state.sortingArray[sortIndex];
			let label = fieldObj.label;
			switch (key) {
				case "application_service": label = "Application Service";
				break;
				case "children": label = "Secondary Alerts";
				break;
			}
			return (
				<th
					draggable="true"
					className="table-header"
					onclick={() => fireEvent("TABLE_HEADER#CLICKED", key)}
					ondragover={e => allowDrop(e, index)}
					onmousedown={e => startDrag(e, index)}
					ondrop={e => drop(e, index)}
				>
					{label}
					{sortIndex > -1 && (
						<div>
							<now-icon className="primary-color" icon={sortObj.asc ? "sort-ascending-outline" : "sort-descending-outline"} size="sm"/> <span className="primary-color">{sortIndex + 1}</span>
						</div>
					)}
				</th>
			)
		} else {
			return (
				<th className="table-header">
					{key}
				</th>
			)
		}
	})

	const tableData = state.properties.tableData.map((row) => {
		let number = row._row_data.displayValue;
		let sys_id = row._row_data.uniqueValue;
		return (
			<tr onclick={() => fireEvent("TABLE_ROW#CLICKED", number)} class={{active: state.properties.showInfo && state.showingNumber == number}}>
				{state.tableOrder.map((key) => {
					if (row[key]) {
						if (key == "severity" || key == "sn_priority_group") {
							return <td><now-highlighted-value label={row[key].displayValue ? row[key].displayValue : "N/A"} color={getSeverityColor(row[key].value)} variant="secondary"/></td>
						} else if (key == "sys_updated_on") {
							return <td className="view-message">{makeRelativeTime(row[key].displayValue)}</td>
						} else if (key == "number") {
							return <td className="view-message record-link" onclick={() => {dispatch("RECORD_LINK#CLICKED", {table: 'em_alert', sys_id: sys_id})}}>{row[key].displayValue ? row[key].displayValue : "N/A"}</td>
						} else if (key == "assigned_to") {
							return <td className="view-message">
								<now-avatar
									size="md"
									user-name={row[key].displayValue}
									image-src={row[key].avatar}
									//presence={state.properties.currentUser.presence}
								/>
							</td>
						} else if (key == "description") {
							return <td className="description">{row[key].displayValue ? row[key].displayValue : "N/A"}</td>
						} else if (key == "application_service") {
							let services = [];
							row[key].forEach(service => {
								if (services.findIndex((serviceArray) => serviceArray.displayValue == service.displayValue) == -1) {
									services.push({displayValue: service.displayValue, impact: service.impact});
								}
							});

							var serviceTags = services.map((service, i) => {
								return <div className={"tag " + getSeverityColor(service.impact)}>{service.displayValue}</div>
							});
							return <td className="tags">{serviceTags}</td>
						} else if (key == "children") {
							return <td className="">
								<div className="circle-tags">
									<div className={"circle-tag"}>{row[key].length}</div>
								</div>
							</td>
						} else if (key == "cmdb_ci") {
							let url = `/now/cmdb/record/${row[key]._reference.sys_class_name.value}/${row[key].value}`;
							return <td className="view-message" onclick={() => {dispatch("RECORD_LINK_CMDB_CI#CLICKED", {value: url})}}>{row[key].displayValue ? row[key].displayValue : "N/A"}</td>
						} else {
							return <td className="view-message">{row[key].displayValue ? row[key].displayValue : "N/A"}</td>
						}
					} else {
						if (key == 'Select') {
							return <td className="no-padding"><input type="checkbox" className="mail-checkbox"/></td>;
						} else {
							return <td className="view-message">N/A</td>
						}
					}
				})}
			</tr>
		)
	});

	const toggleContextMenu = (showMenu, event) => {
		if (showMenu === true) {
			//event.preventDefault();
			updateState({showContextMenu: true});
		} else {
			if (state.showContextMenu) {
				updateState({showContextMenu: false});
			}
		}
	};

	return (
		<div id="snc-alert-email-message-list" oncontextmenu={(e) => {toggleContextMenu(true, e)}}>
			<main id="main">
				<div className="overlay"></div>
				<header className="header">
					<h1 className="page-ciName">
						Active Alerts (<span className="primary-color">{state.properties.totalCount}</span>)
					</h1>
					<div className="action-bar">
						<ul>
							<li title="Close action"><now-rich-text className="g-icon red-color" html='<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px"><path d="M0 0h24v24H0V0z" fill="none" opacity=".87"/><path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.59-13L12 10.59 8.41 7 7 8.41 10.59 12 7 15.59 8.41 17 12 13.41 15.59 17 17 15.59 13.41 12 17 8.41z"/></svg>'/></li>
							<li title="Acknowledge action"><now-rich-text className="g-icon" html='<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px"><path d="M0 0h24v24H0V0z" fill="none" opacity=".87"/><path d="M21 8h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2c0-1.1-.9-2-2-2zm0 4l-3 7H9V9l4.34-4.34L12.23 10H21v2zM1 9h4v12H1z"/></svg>'/></li>
							<li title="Export Data action"><now-rich-text className="g-icon" html='<svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24px" viewBox="0 0 24 24" width="24px"><g><rect fill="none" height="24" width="24"/></g><g><path d="M18,15v3H6v-3H4v3c0,1.1,0.9,2,2,2h12c1.1,0,2-0.9,2-2v-3H18z M17,11l-1.41-1.41L13,12.17V4h-2v8.17L8.41,9.59L7,11l5,5 L17,11z"/></g></svg>'/></li>
						</ul>
					</div>
					{/* <div className="search-box">
						<input placeholder="Search..."><now-icon icon="magnifying-glass-fill"/></input>
					</div> */}
				</header>
				<div className="table-wrapper">
					<table className="table table-inbox">
						<tbody>
							<tr>
								{tableHeaders}
							</tr>
							{tableData}
						</tbody>
					</table>
				</div>
			</main>
		</div>
	);
};

const removeLastComma = (string) => {
	if (string.charAt(string.length - 1) == ",") {
		string = string.substring(0, string.length - 1);
	}
	return string;
};

const transformTableOrder = (tableOrder, tableData) => {
	console.log("transformTableOrder");
	console.log("transformTableOrder start tableOrder: ", tableOrder);
	console.log("transformTableOrder start tableData: ", tableData);
	if (!tableOrder.includes("Select")) {
		tableOrder.push("Select");
	}
	tableData.forEach((tableRow) => {
		let fields = Object.keys(tableRow);
		for (let i = 0; i < fields.length; i++) {
			if (fields[i] == "_row_data") {
				continue;
			}
			if (!tableOrder.includes(fields[i])) {
				tableOrder.push(fields[i]);
			}
		}
	});
	console.log("transformTableOrder end tableOrder: ", tableOrder);
	console.log("transformTableOrder end tableData: ", tableData);
	return tableOrder;
};

createCustomElement('snc-alert-email-message-list', {
	renderer: {type: snabbdom},
	view,
	styles,
	properties: {
		tableData: {
			default: DEFAULT_TABLE_DATA
		},
		totalCount: {
			default: 0
		},
		showInfo: {
			default: false
		}
	},
	setInitialState() {
		return {
			draggingColumnIndex: 0,
			showingNumber: "0",
			dummyStateChange: false,
			sortingArray: [
				{
						"field": "number",
						"asc": false
				}
			], //format = [{field: "severity", asc: true}],
			showContextMenu: false,
			tableOrder: []
		}
	},
	transformState(state) {
		return {
			...state,
			tableOrder: transformTableOrder(state.tableOrder, state.properties.tableData)
		};
	},
	actionHandlers: {
		[COMPONENT_PROPERTY_CHANGED]: (coeffects) => {
			const { dispatch, action } = coeffects;
			console.log('COMPONENT_PROPERTY_CHANGED payload: ', action.payload);
			if (action.payload.name == "tableData") {
				// Fetch Avatars for assigned_to field
				let sysparam = "sys_idIN";
				let impactSysparam = "business_service!=NULL^business_serviceSAMEASelement_id^vt_end>javascript:gs.endOfNextMonth()^business_serviceIN";
				let childSysparam = "parentIN";
				for (let i = 0; i < action.payload.value.length; i++) {
					if (action.payload.value[i].assigned_to.value) {
						sysparam += action.payload.value[i].assigned_to.value + ",";
					}
					if (action.payload.value[i].application_service.length > 0) {
						action.payload.value[i].application_service.forEach((service) => {
							impactSysparam += service.value + ",";
						});
					}
					childSysparam += action.payload.value[i]._row_data.uniqueValue + ",";
				}
				sysparam = removeLastComma(sysparam);
				impactSysparam = removeLastComma(impactSysparam);
				childSysparam = removeLastComma(childSysparam);
				console.log("sysparam: ", sysparam);
				dispatch('FETCH_ASSIGNED_TO_AVATARS', {
					sysparm_query: sysparam,
					sysparm_fields: "sys_id,avatar"
				});
				// End avatars fetch
				// Fetch Impact for Application Services
				console.log("impactSysparam: ", impactSysparam);
				dispatch('FETCH_APP_SERVICE_IMPACT', {
					sysparm_query: impactSysparam,
					sysparm_fields: "business_service,severity"
				});
				// End impact fetch
				console.log("childSysparam: ", childSysparam);
				dispatch('FETCH_CHILD_ALERTS', {
					sysparm_query: childSysparam,
					sysparm_fields: "parent,severity",
					sysparm_display_value: 'all'
				});
			}
		},
		'FETCH_ASSIGNED_TO_AVATARS': createHttpEffect('api/now/table/sys_user', {
			method: 'GET',
			queryParams: ['sysparm_query', 'sysparm_fields'],
			successActionType: 'FETCH_ASSIGNED_TO_AVATARS_SUCCESS'
		}),
		'FETCH_ASSIGNED_TO_AVATARS_SUCCESS': (coeffects) => {
			const { action, state, updateProperties, updateState } = coeffects;
			const { result } = action.payload;
			console.log('FETCH_ASSIGNED_TO_AVATARS_SUCCESS');
			console.log("payload: ", result);
			for (let i = 0; i < state.properties.tableData.length; i++) {
				let matchingResultIndex = result.findIndex((field) => field.sys_id == state.properties.tableData[i].assigned_to.value);
				if (matchingResultIndex > -1) {
					let matchingResult = result[matchingResultIndex];
					let updatedTableData = state.properties.tableData;
					updatedTableData[i].assigned_to.avatar = matchingResult.avatar + ".iix?t=small";
					updateProperties({tableData: updatedTableData});
				}
			}
			updateState({dummyStateChange: !state.dummyStateChange});
		},
		'FETCH_APP_SERVICE_IMPACT': createHttpEffect('api/now/table/em_impact_status', {
			method: 'GET',
			queryParams: ['sysparm_query', 'sysparm_fields'],
			successActionType: 'FETCH_APP_SERVICE_IMPACT_SUCCESS'
		}),
		'FETCH_APP_SERVICE_IMPACT_SUCCESS': (coeffects) => {
			const { action, state, updateProperties, updateState } = coeffects;
			const { result } = action.payload;
			console.log('FETCH_APP_SERVICE_IMPACT_SUCCESS');
			console.log("payload: ", result);
			state.properties.tableData.forEach((record, i) => {
				// if (record.application_service.length == 0) {
				// 	continue;
				// 	//Skip records that dont contain an application service
				// }
				record.application_service.forEach((app_service, j) => {
					let resultIndex = result.findIndex((resultRecord) => resultRecord.business_service.value == app_service.value);
					if (resultIndex > -1) {
						let matchingResult = result[resultIndex];
						let updatedTableData = state.properties.tableData;
						updatedTableData[i].application_service[j].impact = matchingResult.severity;
						updateProperties({tableData: updatedTableData});
					}
				})
			});
			updateState({dummyStateChange: !state.dummyStateChange});
		},
		'FETCH_CHILD_ALERTS': createHttpEffect('api/now/table/em_alert', {
			method: 'GET',
			queryParams: ['sysparm_query', 'sysparm_fields', 'sysparm_display_value'],
			successActionType: 'FETCH_CHILD_ALERTS_SUCCESS'
		}),
		'FETCH_CHILD_ALERTS_SUCCESS': (coeffects) => {
			const { action, state, updateProperties, updateState } = coeffects;
			const { result } = action.payload;
			console.log('FETCH_CHILD_ALERTS_SUCCESS');
			console.log("payload: ", result);
			let updatedTableData = state.properties.tableData;
			state.properties.tableData.forEach((tableRecord, i) => {
				updatedTableData[i].children = [];
				result.forEach((resultRecord) => {
					if (tableRecord._row_data.uniqueValue == resultRecord.parent.value) {
						updatedTableData[i].children.push(resultRecord);
					}
				});
			});
			updateProperties({tableData: updatedTableData});
			updateState({dummyStateChange: !state.dummyStateChange});
		},
	}
});
