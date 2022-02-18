import {createCustomElement, actionTypes} from '@servicenow/ui-core';
const { COMPONENT_PROPERTY_CHANGED} = actionTypes;
import {createHttpEffect} from '@servicenow/ui-effect-http';
import snabbdom from '@servicenow/ui-renderer-snabbdom';
import styles from './styles.scss';
import '@servicenow/now-icon';
import '@servicenow/now-highlighted-value';
import '@servicenow/now-avatar';

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

	var fieldOrder = ["Select"];
	fieldOrder = fieldOrder.concat(Object.keys(state.properties.tableData[0]));
	fieldOrder.splice(fieldOrder.indexOf("_row_data"), 1);
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
		console.log('fieldOrder: ', fieldOrder);
		console.log('oIndex: ', oIndex);
		console.log('nIndex: ', nIndex);
		let newFieldOrder = fieldOrder;
		let movingField = newFieldOrder.splice(oIndex, 1);
		newFieldOrder.splice(nIndex, 0, movingField[0]);
		newFieldOrder.splice(0, 1);
		fireEvent("TABLE_HEADER#DROPPED", newFieldOrder.toString());
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
			return `${hh} hr ${mm} min ${ss} sec ago`;
		} else {
			let dd = Math.floor(hh / 24);
			hh = hh % 24;
			return `${dd} d ${hh} hr ago`;
		}
	};

	const tableHeaders = fieldOrder.map((key, index) => {
		if (state.properties.tableData[0][key]) {
			let fieldObj = state.properties.tableData[0][key];
			let sortObj = state.sortingArray.find(obj => obj.field == key);
			return (
				<th
					draggable="true"
					className="table-header"
					onclick={() => fireEvent("TABLE_HEADER#CLICKED", key)}
					ondragover={e => allowDrop(e, index)}
					onmousedown={e => startDrag(e, index)}
					ondrop={e => drop(e, index)}
				>
					{fieldObj.label}
					{sortObj && (
						<div>
							<now-icon className="primary-color" icon={sortObj.asc ? "sort-ascending-outline" : "sort-descending-outline"} size="sm"/>
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
				{fieldOrder.map((key) => {
					if (row[key]) {
						if (key == "severity") {
							let color = 'low';
							switch (row[key].value) {
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
							return <td><now-highlighted-value label={row[key].displayValue} color={color} variant="secondary"/></td>
						} else if (key == "sn_priority_group") {
							let color = 'low';
							switch (row[key].value) {
								case "4": color = 'low';
								break;
								case "3": color = 'info';
								break;
								case "2": color = 'high';
								break;
								case "1": color = 'critical';
								break;
								default: color = 'low';
								break;
							}
							return <td><now-highlighted-value label={row[key].displayValue ? row[key].displayValue : "N/A"} color={color} variant="secondary"/></td>
						} else if (key == "sys_updated_on") {
							return <td className="view-message">{makeRelativeTime(row[key].displayValue)}</td>
						} else if (key == "number") {
							return <td className="view-message record-link" onclick={() => {dispatch("RECORD_LINK#CLICKED", {value: sys_id})}}>{row[key].displayValue ? row[key].displayValue : "N/A"}</td>
						} else if (key == "assigned_to") {
							return <td className="view-message">
								<now-avatar
									size="md"
									user-name={row[key].displayValue}
									image-src={row[key].avatar}
									//presence={state.properties.currentUser.presence}
								/>
							</td>
						} else {
							return <td className="view-message">{row[key].displayValue ? row[key].displayValue : "N/A"}</td>
						}
					} else {
						if (key == 'Select') {
							return <td><input type="checkbox" className="mail-checkbox"/></td>;
						}
					}
				})}
			</tr>
		)
	});

	return (
		<div id="snc-alert-email-message-list">
			<main id="main">
				<div className="overlay"></div>
				<header className="header">
					<h1 className="page-ciName">
						Active Alerts (<span className="primary-color">{state.properties.totalCount}</span>)
					</h1>
					<div className="action-bar">
						<ul>
							<li><now-icon className="icon circle-icon" icon="chevron-down-fill" size="sm"/></li>
							<li><now-icon className="icon circle-icon" icon="change-fill" size="sm"/></li>
							<li><now-icon className="icon circle-icon" icon="sync-fill" size="sm"/></li>
							<li><now-icon className="icon circle-icon" icon="reply-fill" size="sm"/></li>
							<li><now-icon className="icon circle-icon red" icon="trash-fill" size="sm"/></li>
							<li><now-icon className="icon circle-icon red" icon="flag-fill" size="sm"/></li>
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

createCustomElement('snc-alert-email-message-list', {
	renderer: {type: snabbdom},
	view,
	styles,
	properties: {
		tableData: {
			default: []
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
			sortingArray: [] //format = [{field: "severity", asc: true}]
		}
	},
	actionHandlers: {
		[COMPONENT_PROPERTY_CHANGED]: (coeffects) => {
			const { dispatch, action } = coeffects;
			let sysparam = "sys_idIN";
			console.log('COMPONENT_PROPERTY_CHANGED payload: ', action.payload);
			if (action.payload.name == "tableData") {
				for (let i = 0; i < action.payload.value.length; i++) {
					if (action.payload.value[i].assigned_to.value) {
						sysparam += action.payload.value[i].assigned_to.value + ",";
					}
				}
				if (sysparam.charAt(sysparam.length - 1) == ",") {
					sysparam = sysparam.substring(0, sysparam.length - 1);
				}
				console.log("sysparam: ", sysparam);
				dispatch('FETCH_ASSIGNED_TO_AVATARS', {
						sysparm_query: sysparam,
						sysparm_fields: "sys_id,avatar"
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
			for(let i = 0; i < result.length; i++) {
				let matchIndex = state.properties.tableData.findIndex((field) => field.assigned_to.value == result[i].sys_id);
				if (matchIndex > -1) {
					let match = state.properties.tableData[matchIndex];
					console.log("match: ", match);
					match.assigned_to.avatar = result[i].avatar + ".iix?t=small";
					let updatedTableData = state.properties.tableData;
					updatedTableData[matchIndex] = match;
					updateProperties({tableData: updatedTableData});
					updateState({dummyStateChange: !state.dummyStateChange});
				}
			}
		}
	}
});
