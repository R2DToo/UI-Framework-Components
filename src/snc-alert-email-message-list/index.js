import {createCustomElement, actionTypes} from '@servicenow/ui-core';
const { COMPONENT_PROPERTY_CHANGED, COMPONENT_BOOTSTRAPPED, COMPONENT_ERROR_THROWN} = actionTypes;
import {createHttpEffect} from '@servicenow/ui-effect-http';
import snabbdom from '@servicenow/ui-renderer-snabbdom';
import styles from './styles.scss';
import '@servicenow/now-icon';
import '@servicenow/now-highlighted-value';
import '@servicenow/now-avatar';
import '@servicenow/now-rich-text';
import _ from 'lodash';
import {DEFAULT_TABLE_DATA, TAG_COLORS} from '../constants';

const view = (state, {updateState, dispatch}) => {
	console.log('snc-alert-email-message-list state: ', state);

	if (state.tableData.length < 1) {
		return (
			<div className="list2_empty-state-list">
				<div className="list-flavin"></div>
				No records to display
			</div>
		)
	}

	const fireEvent = (event_name, value) => {
		console.log("%cFiring Event: " + event_name, "color:blue;font-size:20px;");
		console.log("%cEvent Payload: %o", "color:blue;font-size:20px;", value);
		if (event_name == "TABLE_ROW#CLICKED") {
			updateState({showingNumber: value});
		} else if (event_name == "TABLE_ACTION_BAR_BUTTON#CLICKED") {
			refreshMainQuery(state, dispatch, updateState);
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
		let newFieldOrder = state.tableOrder;
		let movingField = newFieldOrder.splice(oIndex, 1);
		newFieldOrder.splice(nIndex, 0, movingField[0]);
		updateState({fieldOrder: newFieldOrder});
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
	};

	const recordSelectionChanged = (sys_id, tableDataIndex) => {
		let updatedSelectedRecords = state.selectedRecords;
		let updatedTableData = state.tableData;
		if (!updatedSelectedRecords.includes(sys_id)) {
			updatedSelectedRecords.push(sys_id);
			updatedTableData[tableDataIndex].selected = true;
		} else {
			updatedSelectedRecords.splice(updatedSelectedRecords.indexOf(sys_id), 1);
			updatedTableData[tableDataIndex].selected = false;
		}
		updateState({selectedRecords: updatedSelectedRecords, tableData: updatedTableData, dummyStateChange: !state.dummyStateChange});
	};

	const tableHeaders = state.tableOrder.map((key, index) => {
		if (state.tableData[0][key]) {
			let fieldObj = state.tableData[0][key];
			let sortIndex = state.sortingArray.findIndex(obj => obj.field == key);
			let sortObj = state.sortingArray[sortIndex];
			let label = fieldObj.label;
			switch (key) {
				case "application_service": label = "Application Service";
				break;
				case "secondary_alerts": label = "Secondary Alerts";
				break;
				case "tags": label = "Tags";
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
			if (key == "Select") {
				return (
					<th className="table-header select">
						{key}
					</th>
				)
			} else {
				return (
					<th className="table-header">
						{key}
					</th>
				)
			}
		}
	})

	const tableData = state.tableData.map((row, index) => {
		return (
			<tr id={"sys_id-" + row.sys_id.value} onclick={() => fireEvent("TABLE_ROW#CLICKED", row.number.display_value)} class={{active: state.properties.showInfo && state.showingNumber == row.number.display_value}}>
				{state.tableOrder.map((key) => {
					if (row[key]) {
						if (key == "severity" || key == "sn_priority_group") {
							return <td><now-highlighted-value label={row[key].display_value ? row[key].display_value : "N/A"} color={getSeverityColor(row[key].value)} variant="secondary"/></td>
						} else if (key == "sys_updated_on") {
							return <td className="view-message">{makeRelativeTime(row[key].display_value)}</td>
						} else if (key == "number") {
							return <td className="view-message record-link" onclick={() => {dispatch("RECORD_LINK#CLICKED", {table: 'em_alert', sys_id: row.sys_id.value})}}>{row[key].display_value ? row[key].display_value : "N/A"}</td>
						} else if (key == "assigned_to") {
							return <td className="view-message">
								<now-avatar
									size="md"
									user-name={row[key].display_value}
									image-src={row[key].avatar}
									//presence={state.properties.currentUser.presence}
								/>
							</td>
						} else if (key == "description") {
							return <td className="description">{row[key].display_value ? row[key].display_value : "N/A"}</td>
						} else if (key == "application_service") {
							let services = [];
							row[key].forEach(service => {
								if (services.findIndex((serviceArray) => serviceArray.display_value == service.display_value) == -1) {
									services.push({display_value: service.display_value, value: service.value, impact: service.impact});
								}
							});
							var serviceTags = services.map((service, i) => {
								let url = "/$ngbsm.do?id=" + service.value;
								return <div className={"tag " + getSeverityColor(service.impact)} onclick={() => {dispatch("RECORD_LINK_CMDB_CI#CLICKED", {value: url})}}>{service.display_value}</div>
							});
							return <td className="tags">{serviceTags}</td>
						} else if (key == "secondary_alerts") {
							return <td className="tags">
								<div className="circle-tags">
									<div className={"circle-tag"}>{row[key]}</div>
								</div>
							</td>
						} else if (key == "cmdb_ci") {
							let url = `/now/cmdb/record/${row['cmdb_ci.sys_class_name'].value}/${row[key].value}`;
							return <td className="view-message" onclick={(e) => {e.stopPropagation()}}><span className="underline-record-link" onclick={() => {dispatch("RECORD_LINK_CMDB_CI#CLICKED", {value: url})}}>{row[key].display_value ? row[key].display_value : "N/A"}</span></td>
						} else if (key == "tags") {
							return <td className="broker-tags-container">
								<div className="broker-tags">
									{row[key].map((tag) =>
										<div className="broker-tag"><span className="tag-key">{tag.key}:</span> {tag.value}</div>
									)}
								</div>
							</td>
						} else {
							return <td className="view-message">{row[key].display_value ? row[key].display_value : "N/A"}</td>
						}
					} else {
						if (key == 'Select') {
							return <td className="no-padding" onclick={(e) => {e.stopPropagation()}}><input type="checkbox" className="mail-checkbox" checked={row.selected} onchange={() => {recordSelectionChanged(row.sys_id.value, index)}}/></td>;
						} else {
							return <td className="view-message"></td>
						}
					}
				})}
			</tr>
		)
	});

	const contextMenuOptionClicked = (event, option) => {
		//event.stopPropagation();
		console.log("contextMenuOptionClicked: ", option);
		console.log("contextMenuRecord: ", state.contextMenuRecord);
		let contextRecord = state.tableData.find((row) => row.sys_id.value == state.contextMenuRecord);
		switch (option) {
			case 'acknowledge': fireEvent('TABLE_ACTION_BAR_BUTTON#CLICKED', {selectedRecords: [state.contextMenuRecord], table: state.properties.tableName, updateQuery: "acknowledged=true^assigned_to=" + state.properties.currentUser.sys_id});
			break;
			case 'close': fireEvent('TABLE_ACTION_BAR_BUTTON#CLICKED', {selectedRecords: [state.contextMenuRecord], table: state.properties.tableName, updateQuery: "state=Closed"});
			break;
			case 'ci_details':
				if (contextRecord) {
					dispatch("RECORD_LINK_CMDB_CI#CLICKED", {value: `/now/cmdb/record/${contextRecord['cmdb_ci.sys_class_name'].value}/${contextRecord.cmdb_ci.value}`});
				}
				break;
			case 'ci_dependency_view':
				if (contextRecord) {
					dispatch("RECORD_LINK_CMDB_CI#CLICKED", {value: `/$ngbsm.do?id=${contextRecord.sys_id.value}`});
				}
				break;
			// case 'event_timeline': fireEvent();
			// break;"/$ngbsm.do?id=" + service.value
			default: break;
		}
	};

	return (
		<div id="snc-alert-email-message-list">
			<main id="main">
				<div className="overlay"></div>
				<header className="header">
					<h1 className="page-ciName">
						Active Alerts (<span className="primary-color">{state.totalCount}</span>)
					</h1>
					<div className="filter-container">

					</div>
					<div className="action-bar">
						<ul>
							<li title="Close" onclick={() => {fireEvent('TABLE_ACTION_BAR_BUTTON#CLICKED', {selectedRecords: state.selectedRecords, table: state.properties.tableName, updateQuery: "state=Closed"})}}><svg attrs={{class: "g-icon red-color", xmlns: "http://www.w3.org/2000/svg", height: "24px", width: "24px", viewBox: "0 0 24 24"}}><path attr-d="M0 0h24v24H0V0z" attr-fill="none" attr-opacity=".87"/><path attr-d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.59-13L12 10.59 8.41 7 7 8.41 10.59 12 7 15.59 8.41 17 12 13.41 15.59 17 17 15.59 13.41 12 17 8.41z"/></svg></li>
							<li title="Acknowledge" onclick={() => {fireEvent('TABLE_ACTION_BAR_BUTTON#CLICKED', {selectedRecords: state.selectedRecords, table: state.properties.tableName, updateQuery: "acknowledged=true^assigned_to=" + state.properties.currentUser.sys_id})}}><svg attrs={{class: "g-icon", xmlns: "http://www.w3.org/2000/svg", height: "24px", width: "24px", viewBox: "0 0 24 24"}}><path attr-d="M0 0h24v24H0V0z" attr-fill="none" attr-opacity=".87"/><path attr-d="M21 8h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2c0-1.1-.9-2-2-2zm0 4l-3 7H9V9l4.34-4.34L12.23 10H21v2zM1 9h4v12H1z"/></svg></li>
							{/* <li title="Export Data action"><now-rich-text className="g-icon" html='<svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24px" viewBox="0 0 24 24" width="24px"><g><rect fill="none" height="24" width="24"/></g><g><path d="M18,15v3H6v-3H4v3c0,1.1,0.9,2,2,2h12c1.1,0,2-0.9,2-2v-3H18z M17,11l-1.41-1.41L13,12.17V4h-2v8.17L8.41,9.59L7,11l5,5 L17,11z"/></g></svg>'/></li> */}
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
			<div class={{'context-menu': true, visible: state.showContextMenu}} style={{top: state.contextMenuTop, left: state.contextMenuLeft}}>
				<div className="context-option" onclick={(e) => {contextMenuOptionClicked(e, 'acknowledge')}}>
					Acknowledge
				</div>
				<div className="context-option" onclick={(e) => {contextMenuOptionClicked(e, 'close')}}>
					Close
				</div>
				<div className="context-option" onclick={(e) => {contextMenuOptionClicked(e, 'ci_details')}}>
					CI Details
				</div>
				<div className="context-option" onclick={(e) => {contextMenuOptionClicked(e, 'ci_dependency_view')}}>
					CI Dependency View
				</div>
				<div className="context-option" onclick={(e) => {contextMenuOptionClicked(e, 'event_timeline')}}>
					Event Timeline (WIP)
				</div>
			</div>
		</div>
	);
};

const removeLastComma = (string) => {
	if (string.charAt(string.length - 1) == ",") {
		string = string.substring(0, string.length - 1);
	}
	return string;
};

const transformTableOrder = (tableOrder, tableData, tableColumns) => {
	if (!tableOrder.includes("Select")) {
		tableOrder.push("Select");
	}
	tableColumns.forEach((column) => {
		if (column == "_row_data" || column == "sys_id" || column == "cmdb_ci.sys_class_name") {
			return;
		}
		if (!tableOrder.includes(column)) {
			tableOrder.push(column);
		}
	});
	tableData.forEach((tableRow) => {
		let fields = Object.keys(tableRow);
		for (let i = 0; i < fields.length; i++) {
			if (fields[i] == "_row_data" || fields[i] == "sys_id" || fields[i] == "cmdb_ci.sys_class_name" || fields[i] == "selected") {
				continue;
			}
			if (!tableOrder.includes(fields[i])) {
				tableOrder.push(fields[i]);
			}
		}
	});
	return tableOrder;
};

const sortingArrayToString = (sortingArray) => {
	let sortString = "";
	for (let i = 0; i < sortingArray.length; i++) {
		let orderObj = sortingArray[i];
		let orderStr = "^ORDERBY";
		if (orderObj.asc == false) {
				orderStr += "DESC";
		}
		sortString += orderStr + orderObj.field;
	}
	return sortString;
}

const refreshMainQuery = (state, dispatch, updateState) => {
	console.log("refreshMainQuery");
	console.log("state: ", state);
	let sysparam = state.properties.externalSysparam + sortingArrayToString(state.sortingArray);
	console.log("refresh sysparam: ", sysparam);
	dispatch('FETCH_MAIN_TABLE', {
		table: state.properties.tableName,
		sysparm_query: sysparam,
		sysparm_fields: state.properties.tableColumns.toString(),
		sysparm_display_value: 'all',
		sysparm_limit: parseInt(state.properties.tableLimit),
		sysparm_offset: parseInt(state.properties.tableLimit) * parseInt(state.properties.page)
	});
	if (state.autoRefreshActive == false) {
		setTimeout(() => {
			console.log('%cAuto Refresh', 'color:green;font-size:12px;');
			refreshMainQuery(state, dispatch, updateState);
		}, 60000
		);
		updateState({autoRefreshActive: true});
	}
}

createCustomElement('snc-alert-email-message-list', {
	renderer: {type: snabbdom},
	view,
	styles,
	properties: {
		showInfo: {
			default: false
		},
		tableName: {
			default: ''
		},
		externalSysparam: {
			default: ''
		},
		tableColumns: {
			default: [],
			deepCompare: true
		},
		tableLimit: {
			default: 0
		},
		page: {
			default: 0
		},
		currentUser: {
			default: {}
		}
	},
	setInitialState() {
		return {
			draggingColumnIndex: 0,
			showingNumber: "0",
			dummyStateChange: false,
			sortingArray: [
				{
					field: "number",
					asc: false
				}
			], //format = [{field: "severity", asc: true}],
			showContextMenu: false,
			contextMenuLeft: "0px",
			contextMenuTop: "0px",
			contextMenuRecord: "0",
			tableOrder: [],
			tableData: [],
			totalCount: 0,
			autoRefreshActive: false,
			selectedRecords: []
		}
	},
	transformState(state) {
		return {
			...state,
			tableOrder: transformTableOrder(state.tableOrder, state.tableData, state.properties.tableColumns)
		};
	},
	actionHandlers: {
		[COMPONENT_PROPERTY_CHANGED]: (coeffects) => {
			const { dispatch, action, state, updateState } = coeffects;
			console.log('COMPONENT_PROPERTY_CHANGED payload: ', action.payload);
			refreshMainQuery(state, dispatch, updateState);
		},
		[COMPONENT_BOOTSTRAPPED]: (coeffects) => {
			const { state, dispatch, updateState } = coeffects;
			console.log("COMPONENT_BOOTSTRAPPED");
			refreshMainQuery(state, dispatch, updateState);
		},
		'FETCH_MAIN_TABLE': createHttpEffect('/api/now/table/:table', {
			batch: false,
			method: 'GET',
			pathParams: ['table'],
			queryParams: ['sysparm_query', 'sysparm_fields', 'sysparm_display_value', 'sysparm_limit', 'sysparm_offset'],
			successActionType: 'FETCH_MAIN_TABLE_SUCCESS'
		}),
		'FETCH_MAIN_TABLE_SUCCESS': (coeffects) => {
			const { action, state, updateState, dispatch } = coeffects;
			const { result } = action.payload;
			console.log('%cFETCH_MAIN_TABLE_SUCCESS', 'color:green');
			console.log("%cpayload: %o", 'color:green', result);
			console.log("action: ", action);
			result.forEach((resultRow) => {
				if (state.selectedRecords.includes(resultRow.sys_id.value)) {
					resultRow.selected = true;
				} else {
					resultRow.selected = false;
				}
			});

			dispatch('TABLE_RECORD_COUNT#UPDATED', {value: parseInt(action.meta.responseHeaders['x-total-count'])});
			updateState({tableData: result, dummyStateChange: !state.dummyStateChange, totalCount: parseInt(action.meta.responseHeaders['x-total-count'])});
			dispatch('START_FETCH_COLUMN_LABELS');
			dispatch('START_FETCH_ASSIGNED_TO_AVATARS');
			dispatch('START_FETCH_APP_SERVICES');
			dispatch('START_FETCH_SECONDARY_ALERTS');
			dispatch('START_FETCH_TAGS');
		},
		[COMPONENT_ERROR_THROWN]: (coeffects) => {
			console.log("%cERROR_THROWN: %o", "color:red", coeffects.action.payload);
		},
		'START_FETCH_APP_SERVICES': (coeffects) => {
			const { state, dispatch } = coeffects;
			let ciArray = [];
			state.tableData.forEach((row) => {
				if (!ciArray.includes(row.cmdb_ci.value) && row.cmdb_ci.value != "") {
					ciArray.push(row.cmdb_ci.value);
				}
			});
			let sysparm = "ci_idIN" + ciArray.toString();
			dispatch('FETCH_APP_SERVICES', {
				table: 'svc_ci_assoc',
				sysparm_query: sysparm,
				sysparm_fields: 'service_id,ci_id',
				sysparm_display_value: 'all'
			});
		},
		'FETCH_APP_SERVICES': createHttpEffect('/api/now/table/:table', {
			method: 'GET',
			pathParams: ['table'],
			queryParams: ['sysparm_query', 'sysparm_fields', 'sysparm_display_value'],
			successActionType: 'FETCH_APP_SERVICES_SUCCESS'
		}),
		'FETCH_APP_SERVICES_SUCCESS': (coeffects) => {
			const { action, state, updateState, dispatch } = coeffects;
			console.log('FETCH_APP_SERVICES_SUCCESS');
			console.log('payload: ', action.payload);
			let updatedTableData = state.tableData;
			let impactSysparm = "business_service!=NULL^business_serviceSAMEASelement_id^vt_end>javascript:gs.endOfNextMonth()^business_serviceIN";
			let appServiceArray = [];
			action.payload.result.forEach((result) => {
				appServiceArray.push(result.service_id.value);
				updatedTableData.forEach((tableRow, i) => {
					if (!updatedTableData[i].application_service) {
						updatedTableData[i].application_service = [];
					}
					if (result.ci_id.value == tableRow.cmdb_ci.value && !updatedTableData[i].application_service.includes(result.service_id)) {
						updatedTableData[i].application_service.push(result.service_id);
					}
				});
			});
			let updatedTableOrder = state.tableOrder;
			if (!updatedTableOrder.includes("application_service")) {
				updatedTableOrder.splice(7, 0, "application_service");
			}
			updateState({tableData: updatedTableData, tableOrder: updatedTableOrder});
			dispatch('FETCH_APP_SERVICE_IMPACT', {
				sysparm_query: impactSysparm + appServiceArray.toString(),
				sysparm_fields: "business_service,severity"
			});
		},
		'FETCH_APP_SERVICE_IMPACT': createHttpEffect('api/now/table/em_impact_status', {
			method: 'GET',
			queryParams: ['sysparm_query', 'sysparm_fields'],
			successActionType: 'FETCH_APP_SERVICE_IMPACT_SUCCESS'
		}),
		'FETCH_APP_SERVICE_IMPACT_SUCCESS': (coeffects) => {
			const { action, state, updateState } = coeffects;
			console.log('FETCH_APP_SERVICE_IMPACT_SUCCESS');
			console.log("payload: ", action.payload);
			let updatedTableData = state.tableData;
			updatedTableData.forEach((tableRow, i) => {
				tableRow.application_service.forEach((app_service, j) => {
					action.payload.result.forEach((result) => {
						if (app_service.value == result.business_service.value) {
							updatedTableData[i].application_service[j].impact = result.severity;
						}
					});
				})
			});
			updateState({tableData: updatedTableData, dummyStateChange: !state.dummyStateChange});
		},
		'TABLE_HEADER#CLICKED': (coeffects) => {
			const { action, state, updateState, dispatch } = coeffects;
			if (action.payload.value == 'application_service' || action.payload.value == 'secondary_alerts') {
				return;
			}
			let sortingObjIndex = state.sortingArray.findIndex(obj => obj.field == action.payload.value);
			let updatedSorting = state.sortingArray;
			if (sortingObjIndex > -1) {
				if (updatedSorting[sortingObjIndex].asc == false) {
					updatedSorting.splice(sortingObjIndex, 1);
				} else {
					updatedSorting[sortingObjIndex].asc = false;
				}
			} else {
				updatedSorting.push({field: action.payload.value, asc: true});
			}
			updateState({sortingArray: updatedSorting, dummyStateChange: !state.dummyStateChange});
			refreshMainQuery(state, dispatch, updateState);
		},
		'START_FETCH_COLUMN_LABELS': (coeffects) => {
			const { state, dispatch } = coeffects;
			let columns = Object.keys(state.tableData[0]);
			let labelSysparm = `name=${state.properties.tableName}^elementIN${columns.toString()}`
			console.log("labelSysparm: ", labelSysparm);
			dispatch('FETCH_COLUMN_LABELS', {
				table: 'sys_dictionary',
				sysparm_query: labelSysparm,
				sysparm_fields: 'element,column_label',
				sysparm_display_value: 'true'
			});
		},
		'FETCH_COLUMN_LABELS': createHttpEffect('/api/now/table/:table', {
			method: 'GET',
			pathParams: ['table'],
			queryParams: ['sysparm_query', 'sysparm_fields', 'sysparm_display_value'],
			successActionType: 'FETCH_COLUMN_LABELS_SUCCESS'
		}),
		'FETCH_COLUMN_LABELS_SUCCESS': (coeffects) => {
			const { action, updateState, state } = coeffects;
			console.log('FETCH_COLUMN_LABELS_SUCCESS');
			console.log("payload: ", action.payload);
			let updatedTableData = state.tableData;
			updatedTableData.forEach((tableRow) => {
				action.payload.result.forEach((result) => {
					tableRow[result.element].label = result.column_label;
				});
			});
			updateState({tableData: updatedTableData});
		},
		'START_FETCH_SECONDARY_ALERTS': (coeffects) => {
			const { dispatch, state } = coeffects;
			let parentList = [];
			let secondarySysparm = "parentIN";
			state.tableData.forEach((tableRow) => {
				if (tableRow.group_source.display_value != "None" && tableRow.group_source.display_value != "Secondary") {
					parentList.push(tableRow.sys_id.value);
				}
			});
			dispatch('FETCH_SECONDARY_ALERTS', {
				table: 'em_alert',
				sysparm_query: secondarySysparm + parentList.toString(),
				sysparm_count: 'true',
				sysparm_group_by: 'parent'
			});
		},
		'FETCH_SECONDARY_ALERTS': createHttpEffect('/api/now/stats/:table', {
			method: 'GET',
			pathParams: ['table'],
			queryParams: ['sysparm_query', 'sysparm_count', 'sysparm_group_by'],
			successActionType: 'FETCH_SECONDARY_ALERTS_SUCCESS'
		}),
		'FETCH_SECONDARY_ALERTS_SUCCESS': (coeffects) => {
			const { action, updateState, state } = coeffects;
			console.log('FETCH_SECONDARY_ALERTS_SUCCESS');
			console.log("payload: ", action.payload);
			let updatedTableData = state.tableData;
			updatedTableData.forEach((tableRow) => {
				let matchingResult = action.payload.result.find((result) => tableRow.sys_id.value == result.groupby_fields[0].value);
				if (matchingResult) {
					tableRow.secondary_alerts = matchingResult.stats.count;
				} else {
					tableRow.secondary_alerts = '0';
				}
			});
			let updatedTableOrder = state.tableOrder;
			if (!updatedTableOrder.includes("secondary_alerts")) {
				updatedTableOrder.splice(7, 0, "secondary_alerts");
			}
			updateState({tableData: updatedTableData, tableOrder: updatedTableOrder, dummyStateChange: !state.dummyStateChange});
		},
		'START_FETCH_ASSIGNED_TO_AVATARS': (coeffects) => {
			const { dispatch, state } = coeffects;
			let assignedToArray = [];
			let assignedSysparm = "sys_idIN";
			state.tableData.forEach((tableRow) => {
				if (tableRow.assigned_to.value != '' && !assignedToArray.includes(tableRow.assigned_to.value)) {
					assignedToArray.push(tableRow.assigned_to.value);
				}
			});
			dispatch('FETCH_ASSIGNED_TO_AVATARS', {
				sysparm_query: assignedSysparm + assignedToArray.toString(),
				sysparm_fields: "sys_id,avatar"
			});
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
			let updatedTableData = state.tableData;
			updatedTableData.forEach((tableRow) => {
				let matchingResult = result.find((field) => field.sys_id == tableRow.assigned_to.value);
				if (matchingResult) {
					tableRow.assigned_to.avatar = matchingResult.avatar + ".iix?t=small";
				}
			});
			updateState({tableData: updatedTableData});
		},
		'START_FETCH_TAGS': (coeffects) => {
			const { dispatch, state } = coeffects;
			let ciArray = [];
			let sysparm = "configuration_itemIN"
			state.tableData.forEach((tableRow) => {
				if (tableRow.cmdb_ci.value != "") {
					ciArray.push(tableRow.cmdb_ci.value);
				}
			});
			dispatch('FETCH_TAGS', {
				table: 'cmdb_key_value',
				sysparm_query: sysparm + ciArray.toString() + "^ORDERBYkey",
				sysparm_fields: 'configuration_item,key,value',
				sysparm_display_value: 'all'
			});
		},
		'FETCH_TAGS': createHttpEffect('/api/now/table/:table', {
			method: 'GET',
			pathParams: ['table'],
			queryParams: ['sysparm_query', 'sysparm_fields', 'sysparm_display_value'],
			successActionType: 'FETCH_TAGS_SUCCESS'
		}),
		'FETCH_TAGS_SUCCESS': (coeffects) => {
			const { dispatch, state, updateState, action } = coeffects;
			let updatedTableData = state.tableData;
			updatedTableData.forEach((tableRow) => {
				if (!tableRow.tags) {
					tableRow.tags = [];
				}
				action.payload.result.map((result) => {
					if (result.configuration_item.value == tableRow.cmdb_ci.value ) {
						tableRow.tags.push({key: result.key.display_value, value: result.value.display_value});
					}
				});
			});
			let updatedTableOrder = state.tableOrder;
			if (!updatedTableOrder.includes("tags")) {
				updatedTableOrder.splice(updatedTableOrder.length - 1, 0, "tags");
			}
			updateState({tableData: updatedTableData, tableOrder: updatedTableOrder, dummyStateChange: !state.dummyStateChange});
		},
	},
	eventHandlers: [
		{
			events: ['contextmenu'],
			effect({state, updateState, action: {payload: {event}}}) {
				event.preventDefault();
				console.log("contextmenu");
				console.log(event);
				let clickedRecordSysID = "0"
				if (state.showContextMenu == false) {
					try {
						let clickedRecordElement = event.path.find((element) => element.id && element.id.includes("sys_id-"));
						console.log("clickedRecordElement: ", clickedRecordElement);
						clickedRecordSysID = clickedRecordElement.id.substring(clickedRecordElement.id.indexOf("-") + 1);
						// event.path.forEach((element) => {
						// 	if (element.id && element.id.includes("sys_id-")) {
						// 		console.log("found: ", element.id);
						// 		clickedRecordSysID = element.id;
						// 	}
						// })
						// console.log("clickedRecordSysID: ", clickedRecordSysID);
						// clickedRecordSysID = clickedRecordSysID.substring(clickedRecordSysID.indexOf("-") + 1);
					} catch (e) {}
					console.log('%cclickedRecordSysID: %o', 'color:green;font-size:12px;', clickedRecordSysID);
					updateState({showContextMenu: true, contextMenuLeft: event.clientX + "px", contextMenuTop: event.offsetY + "px", contextMenuRecord: clickedRecordSysID});
				} else {
					updateState({showContextMenu: false, contextMenuLeft: "0px", contextMenuTop: "0px", contextMenuRecord: clickedRecordSysID});
				}
			},
		},
		{
			events: ['click'],
			effect({dispatch, updateState, action: {payload: {event}}}) {
				updateState({showContextMenu: false, contextMenuLeft: "0px", contextMenuTop: "0px"});
			},
		}
	]
});
