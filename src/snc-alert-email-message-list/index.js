import {createCustomElement, actionTypes} from '@servicenow/ui-core';
const { COMPONENT_PROPERTY_CHANGED, COMPONENT_BOOTSTRAPPED, COMPONENT_ERROR_THROWN} = actionTypes;
import {createHttpEffect} from '@servicenow/ui-effect-http';
import snabbdom from '@servicenow/ui-renderer-snabbdom';
import styles from './styles.scss';
import '@servicenow/now-icon';
import '@servicenow/now-highlighted-value';
import '@servicenow/now-avatar';
import '@servicenow/now-rich-text';
import '@servicenow/now-typeahead';
// import _ from 'lodash';
import {DEFAULT_TABLE_DATA, TAG_COLORS} from '../constants';

const view = (state, {updateState, dispatch}) => {
	console.log('snc-alert-email-message-list state: ', state);

	const fireEvent = (event_name, value) => {
		console.log("%cFiring Event: " + event_name, "color:blue;font-size:20px;");
		console.log("%cEvent Payload: %o", "color:blue;font-size:20px;", value);
		if (event_name == "TABLE_ROW#CLICKED") {
			updateState({showingNumber: value});
		} else if (event_name == "TABLE_ACTION_BAR_BUTTON#CLICKED") {
			dispatch('REFRESH_MAIN_QUERY', {force: true});
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

	const toggleAllSelect = () => {
		let updatedSelectedRecords = state.selectedRecords;
		let updatedTableData = state.tableData;
		updatedTableData.forEach((row) => {
			row.selected = !state.allSelectChecked;
			if (!updatedSelectedRecords.includes(row.sys_id.value)) {
				updatedSelectedRecords.push(row.sys_id.value);
			}
		});
		updateState({allSelectChecked: !state.allSelectChecked, tableData: updatedTableData, selectedRecords: updatedSelectedRecords});
	}

	const tableHeaders = () => {
		return state.tableOrder.map((key, index) => {
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
							{key}<br/>
							<input type="checkbox" className="mail-checkbox" checked={state.allSelectChecked} onchange={() => {toggleAllSelect()}}/>
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
	}

	const tableData = () => {
		return state.tableData.map((row, index) => {
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
		})
	}

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
			case 'set_to_maintenance': fireEvent('TABLE_ACTION_BAR_BUTTON#CLICKED', {selectedRecords: [state.contextMenuRecord], table: state.properties.tableName, updateQuery: "maintenance=true"});
			break;
			case 'ci_details':
				if (contextRecord) {
					dispatch("RECORD_LINK_CMDB_CI#CLICKED", {value: `/now/cmdb/record/${contextRecord['cmdb_ci.sys_class_name'].value}/${contextRecord.cmdb_ci.value}`});
				}
				break;
			case 'ci_dependency_view':
				if (contextRecord) {
					dispatch("RECORD_LINK_CMDB_CI#CLICKED", {value: `/now/nav/ui/classic/params/target/%24ngbsm.do%3Fid%3D${contextRecord.cmdb_ci.value}`});
				}
				break;
			// case 'event_timeline': fireEvent();
			// break;"/$ngbsm.do?id=" + service.value
			default: break;
		}
	};

	const addNewFilter = (chosenValue) => {
		console.log(chosenValue);
		let updatedFilters = state.filters;
		updatedFilters.push({
			showInputs: false,
			showResults: {operator: false, value: false},
			inputs: {
				and_or: {label: 'AND', value: '^'},
				column: chosenValue,
				operator: {label: '', value: ''},
				value: {label: '', value: ''}
			},
			results: {
				operator: [],
				value: []
			}
		});
		updateState({showAddFilter: false, showAddFilterResults: false, filters: updatedFilters});
	}

	const parseFiltersToSysparm = (filters) => {
		let encodedSysparm = '';
		encodedSysparm += state.properties.listSysparam;
		filters.map((filter) => {
			encodedSysparm += `${filter.inputs.and_or.value}${filter.inputs.column.value}${filter.inputs.operator.value}${filter.inputs.value.value}`;
		});
		encodedSysparm += sortingArrayToString(state.sortingArray);
		return encodedSysparm;
	}

	const setFilterOperator = (index, chosenValue) => {
		if (chosenValue.value && chosenValue.value.trim() != "") {
			let updatedFilters = state.filters;
			updatedFilters[index].inputs.operator = chosenValue;
			updatedFilters[index].showResults.operator = false;
			if (updatedFilters[index].inputs.value.value != ""
				|| updatedFilters[index].inputs.operator.value == "ISEMPTY"
				|| updatedFilters[index].inputs.operator.value == "ISNOTEMPTY") {
				fireEvent('TABLE_FILTER#UPDATED', parseFiltersToSysparm(updatedFilters));
				fireEvent('REFRESH_MAIN_QUERY', {force: true});
			}
			updateState({filters: updatedFilters, dummyStateChange: !state.dummyStateChange});
		}
	}

	const setFilterValue = (index, chosenValue) => {
		if (chosenValue.value && chosenValue.value.trim() != "") {
			let updatedFilters = state.filters;
			updatedFilters[index].inputs.value = chosenValue;
			updatedFilters[index].showResults.value = false;
			if (updatedFilters[index].inputs.operator.value != "") {
				fireEvent('TABLE_FILTER#UPDATED', parseFiltersToSysparm(updatedFilters));
				fireEvent('REFRESH_MAIN_QUERY', {force: true});
			}
			updateState({filters: updatedFilters, dummyStateChange: !state.dummyStateChange});
		}
	}

	const updateFilterAnd_Or = (index) => {
		let updatedFilters = state.filters;
		if (updatedFilters[index].inputs.and_or.label == "AND") {
			updatedFilters[index].inputs.and_or = {label: 'OR', value: '^OR'};
		} else {
			updatedFilters[index].inputs.and_or = {label: 'AND', value: '^'};
		}
		updateState({filters: updatedFilters, dummyStateChange: !state.dummyStateChange});
		fireEvent('TABLE_FILTER#UPDATED', parseFiltersToSysparm(updatedFilters));
		fireEvent('REFRESH_MAIN_QUERY', {force: true});
	}

	return (
		<div id="snc-alert-email-message-list">
			<main id="main">
				<div className="header">
					<div className="table-title">
						<h1>
							Active Alerts (<span className="primary-color">{state.totalCount}</span>)
						</h1>
					</div>
					<div className="filter-container">
						<div className="filter">
							<svg onclick={() => {fireEvent('TOGGLE_ADD_FILTER')}} attrs={{class: "filter-icon", xmlns: "http://www.w3.org/2000/svg", height: "30px", width: "30px", viewBox: "0 0 24 24"}}><path attr-d="M0 0h24v24H0V0z" attr-fill="none"/><path attr-d="M15.5 14h-.79l-.28-.27c1.2-1.4 1.82-3.31 1.48-5.34-.47-2.78-2.79-5-5.59-5.34-4.23-.52-7.79 3.04-7.27 7.27.34 2.8 2.56 5.12 5.34 5.59 2.03.34 3.94-.28 5.34-1.48l.27.28v.79l4.25 4.25c.41.41 1.08.41 1.49 0 .41-.41.41-1.08 0-1.49L15.5 14zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
							{/* <svg onclick={() => {fireEvent('TOGGLE_ADD_FILTER')}} attrs={{class: "filter-icon", xmlns: "http://www.w3.org/2000/svg", height: "30px", width: "30px", viewBox: "0 0 24 24", 'enable-background': "new 0 0 24 24"}}><g><path attr-d="M0,0h24v24H0V0z" attr-fill="none"/></g><g><path attr-d="M7,9H2V7h5V9z M7,12H2v2h5V12z M20.59,19l-3.83-3.83C15.96,15.69,15.02,16,14,16c-2.76,0-5-2.24-5-5s2.24-5,5-5s5,2.24,5,5 c0,1.02-0.31,1.96-0.83,2.75L22,17.59L20.59,19z M17,11c0-1.65-1.35-3-3-3s-3,1.35-3,3s1.35,3,3,3S17,12.65,17,11z M2,19h10v-2H2 V19z"/></g></svg> */}
							{state.showAddFilter && <div className="add-filter">
								<input
									type="text"
									onkeyup={(e) => {fireEvent('ADD_FILTER_KEYDOWN', {event: e, value: e.target.value})}}
									onfocus={(e) => {fireEvent('ADD_FILTER_FOCUS', e.target.value)}}
									className="filter-input"
									placeholder="Enter alert field"
								/>
								{state.showAddFilterResults && state.addFilterResults.length > 0 && <ul className="filter-results">
									{state.addFilterResults.map((result, i) => <li
										id={`filter-result-${i}`}
										className={`filter-result`}
										role="option"
										onclick={() => {addNewFilter(result)}}
									>{result.label}</li>)}
								</ul>}
							</div>}
						</div>

						{state.filters.map((filter, index) =>
							<div className={"filter index-" + index}>
								{index > 0 && <div className={"and-or-button " + filter.inputs.and_or.label} onclick={() => {updateFilterAnd_Or(index)}}>
									{filter.inputs.and_or.label}
								</div>}
								<div className="filter-icon-container">
									<span className="filter-icon-label">{filter.inputs.column.label}</span>
									<svg onclick={() => {fireEvent('TOGGLE_SHOW_FILTER_INPUTS', {index: index})}} attrs={{class: "filter-icon", xmlns: "http://www.w3.org/2000/svg", height: "30px", width: "30px", viewBox: "0 0 24 24", 'enable-background': "new 0 0 24 24"}}><g><rect attr-fill="none" attr-height="30" attr-width="30"/></g><g><g><path attr-d="M18.19,12.44l-3.24-1.62c1.29-1,2.12-2.56,2.12-4.32c0-3.03-2.47-5.5-5.5-5.5s-5.5,2.47-5.5,5.5c0,2.13,1.22,3.98,3,4.89 v3.26c-2.15-0.46-2.02-0.44-2.26-0.44c-0.53,0-1.03,0.21-1.41,0.59L4,16.22l5.09,5.09C9.52,21.75,10.12,22,10.74,22h6.3 c0.98,0,1.81-0.7,1.97-1.67l0.8-4.71C20.03,14.32,19.38,13.04,18.19,12.44z M17.84,15.29L17.04,20h-6.3 c-0.09,0-0.17-0.04-0.24-0.1l-3.68-3.68l4.25,0.89V6.5c0-0.28,0.22-0.5,0.5-0.5c0.28,0,0.5,0.22,0.5,0.5v6h1.76l3.46,1.73 C17.69,14.43,17.91,14.86,17.84,15.29z M8.07,6.5c0-1.93,1.57-3.5,3.5-3.5s3.5,1.57,3.5,3.5c0,0.95-0.38,1.81-1,2.44V6.5 c0-1.38-1.12-2.5-2.5-2.5c-1.38,0-2.5,1.12-2.5,2.5v2.44C8.45,8.31,8.07,7.45,8.07,6.5z"/></g></g></svg>
									{/* <svg onclick={() => {fireEvent('TOGGLE_SHOW_FILTER_INPUTS', {index: index})}} attrs={{class: "filter-icon", xmlns: "http://www.w3.org/2000/svg", height: "30px", width: "30px", viewBox: "0 0 24 24"}}><path attr-d="M0 0h24v24H0V0z" attr-fill="none"/><path attr-d="M12 7c-.55 0-1 .45-1 1v3H8c-.55 0-1 .45-1 1s.45 1 1 1h3v3c0 .55.45 1 1 1s1-.45 1-1v-3h3c.55 0 1-.45 1-1s-.45-1-1-1h-3V8c0-.55-.45-1-1-1zm0-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg> */}
									{/* <svg onclick={() => {fireEvent('TOGGLE_SHOW_FILTER_INPUTS', {index: index})}} attrs={{class: "filter-icon", xmlns: "http://www.w3.org/2000/svg", height: "30px", width: "30px", viewBox: "0 0 24 24", 'enable-background': "new 0 0 24 24"}}><g><path attr-d="M0,0h24v24H0V0z" attr-fill="none"/></g><g><path attr-d="M7,9H2V7h5V9z M7,12H2v2h5V12z M20.59,19l-3.83-3.83C15.96,15.69,15.02,16,14,16c-2.76,0-5-2.24-5-5s2.24-5,5-5s5,2.24,5,5 c0,1.02-0.31,1.96-0.83,2.75L22,17.59L20.59,19z M17,11c0-1.65-1.35-3-3-3s-3,1.35-3,3s1.35,3,3,3S17,12.65,17,11z M2,19h10v-2H2 V19z"/></g></svg> */}
								</div>
								{filter.showInputs && <div className="filter-inputs">
									<div className="filter-inputs-operator">
										<input
											type="text"
											value={filter.inputs.operator.label}
											onkeyup={(e) => {fireEvent('FILTER_KEYDOWN', {event: e, value: e.target.value, operator: true, index: index})}}
											onfocus={(e) => {fireEvent('FILTER_FOCUS', {value: e.target.value, operator: true, index: index})}}
											className="filter-input operator"
										/>
										{filter.showResults.operator && filter.results.operator.length > 0 && <ul className="filter-results operator">
											{filter.results.operator.map((result, i) => <li
												id={`filter-result-${i}`}
												className={`filter-result operator`}
												role="option"
												onclick={() => {setFilterOperator(index, result)}}
											>{result.label}</li>)}
										</ul>}
									</div>

									<div className="filter-inputs-value">
										<input
											type="text"
											value={filter.inputs.value.label}
											onkeyup={(e) => {fireEvent('FILTER_KEYDOWN', {event: e, value: e.target.value, operator: false, index: index})}}
											onfocus={(e) => {fireEvent('FILTER_FOCUS', {value: e.target.value, operator: false, index: index})}}
											onblur={(e) => {setFilterValue(index, {label: e.target.value, value: e.target.value})}}
											className="filter-input"
										/>
										{filter.showResults.value && filter.results.value.length > 0 && <ul className="filter-results">
											{filter.results.value.map((result, i) => <li
												id={`filter-result-${i}`}
												className={`filter-result`}
												role="option"
												onclick={() => {setFilterValue(index, result)}}
											>{result.label}</li>)}
										</ul>}
									</div>
								</div>}
								<svg onclick={() => {fireEvent('REMOVE_FILTER', {index: index})}} attrs={{class: "filter-icon", xmlns: "http://www.w3.org/2000/svg", height: "30px", width: "30px", viewBox: "0 0 24 24"}}><path d="M0 0h24v24H0V0z" fill="none"/><path attr-d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM8 9h8v10H8V9zm7.5-5l-1-1h-5l-1 1H5v2h14V4h-3.5z"/></svg>
								{/* <svg onclick={() => {fireEvent('REMOVE_FILTER', {index: index})}} attrs={{class: "filter-icon", xmlns: "http://www.w3.org/2000/svg", height: "30px", width: "30px", viewBox: "0 0 24 24"}}><path attr-d="M0 0h24v24H0V0z" attr-fill="none"/><path attr-d="M13.89 8.7L12 10.59 10.11 8.7c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41L10.59 12 8.7 13.89c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0L12 13.41l1.89 1.89c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L13.41 12l1.89-1.89c.39-.39.39-1.02 0-1.41-.39-.38-1.03-.38-1.41 0zM12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg> */}
							</div>
						)}
						{/* <svg attrs={{xmlns: "http://www.w3.org/2000/svg", height: "30px", width: "30px", viewBox: "0 0 24 24", fill: "#6e6e6e"}} style={{margin: "0 6px"}}><path attr-d="M0 0h24v24H0V0z" attr-fill="none"/><path attr-d="M11 15h2v-3h3v-2h-3V7h-2v3H8v2h3zM21 3H3c-1.11 0-2 .89-2 2v12c0 1.1.89 2 2 2h5v2h8v-2h5c1.1 0 2-.9 2-2V5c0-1.11-.9-2-2-2zm0 14H3V5h18v12z"/></svg> */}
						<svg attrs={{xmlns: "http://www.w3.org/2000/svg", height: "30px", width: "30px", viewBox: "0 0 24 24", fill: "#6e6e6e", 'enable-background': "new 0 0 24 24"}}><g><rect attr-fill="none" attr-height="30" attr-width="30"/></g><g><path attr-d="M21,12.4V7l-4-4H5C3.89,3,3,3.9,3,5v14c0,1.1,0.89,2,2,2h7.4l2-2H5V5h11.17L19,7.83v6.57L21,12.4z M15,15 c0,1.66-1.34,3-3,3s-3-1.34-3-3s1.34-3,3-3S15,13.34,15,15z M6,6h9v4H6V6z M19.99,16.25l1.77,1.77L16.77,23H15v-1.77L19.99,16.25z M23.25,16.51l-0.85,0.85l-1.77-1.77l0.85-0.85c0.2-0.2,0.51-0.2,0.71,0l1.06,1.06C23.45,16,23.45,16.32,23.25,16.51z"/></g></svg>
					</div>
					<div className="action-bar">
						<ul>
							<li title="Set to Maintenance" onclick={() => {fireEvent('TABLE_ACTION_BAR_BUTTON#CLICKED', {selectedRecords: state.selectedRecords, table: state.properties.tableName, updateQuery: "maintenance=true"})}}>
								<svg attrs={{class: "g-icon", xmlns: "http://www.w3.org/2000/svg", height: "24px", width: "24px", viewBox: "0 0 24 24", "enable-background": "new 0 0 24 24"}}><g><rect attr-fill="none" attr-height="24" attr-width="24"/></g><g><g><path attr-d="M12,2C6.48,2,2,6.48,2,12c0,5.52,4.48,10,10,10s10-4.48,10-10 C22,6.48,17.52,2,12,2z M12,20c-4.41,0-8-3.59-8-8c0-4.41,3.59-8,8-8s8,3.59,8,8C20,16.41,16.41,20,12,20z" attr-fill-rule="evenodd"/><path attr-d="M13.49,11.38c0.43-1.22,0.17-2.64-0.81-3.62c-1.11-1.11-2.79-1.3-4.1-0.59 l2.35,2.35l-1.41,1.41L7.17,8.58c-0.71,1.32-0.52,2.99,0.59,4.1c0.98,0.98,2.4,1.24,3.62,0.81l3.41,3.41c0.2,0.2,0.51,0.2,0.71,0 l1.4-1.4c0.2-0.2,0.2-0.51,0-0.71L13.49,11.38z" attr-fill-rule="evenodd"/></g></g></svg>
							</li>
							<li title="Close" onclick={() => {fireEvent('TABLE_ACTION_BAR_BUTTON#CLICKED', {selectedRecords: state.selectedRecords, table: state.properties.tableName, updateQuery: "state=Closed"})}}>
								<svg attrs={{class: "g-icon red-color", xmlns: "http://www.w3.org/2000/svg", height: "24px", width: "24px", viewBox: "0 0 24 24"}}><path attr-d="M0 0h24v24H0V0z" attr-fill="none" attr-opacity=".87"/><path attr-d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.59-13L12 10.59 8.41 7 7 8.41 10.59 12 7 15.59 8.41 17 12 13.41 15.59 17 17 15.59 13.41 12 17 8.41z"/></svg>
							</li>
							<li title="Acknowledge" onclick={() => {fireEvent('TABLE_ACTION_BAR_BUTTON#CLICKED', {selectedRecords: state.selectedRecords, table: state.properties.tableName, updateQuery: "acknowledged=true^assigned_to=" + state.properties.currentUser.sys_id})}}>
								<svg attrs={{class: "g-icon", xmlns: "http://www.w3.org/2000/svg", height: "24px", width: "24px", viewBox: "0 0 24 24"}}><path attr-d="M0 0h24v24H0V0z" attr-fill="none" attr-opacity=".87"/><path attr-d="M21 8h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2c0-1.1-.9-2-2-2zm0 4l-3 7H9V9l4.34-4.34L12.23 10H21v2zM1 9h4v12H1z"/></svg>
							</li>
						</ul>
					</div>
				</div>
				{state.tableData.length > 0 && <div className="table-wrapper">
					<table className="table table-inbox">
						<tbody>
							<tr>
								{tableHeaders()}
							</tr>
							{tableData()}
						</tbody>
					</table>
				</div>}
				{state.tableData.length == 0 && <div className="list2_empty-state-list">
					<div className="list-flavin"></div>
					No records to display
				</div>}
			</main>
			<div class={{'context-menu': true, visible: state.showContextMenu}} style={{top: state.contextMenuTop, left: state.contextMenuLeft}}>
				<div className="context-option" onclick={(e) => {contextMenuOptionClicked(e, 'acknowledge')}}>
					Acknowledge
				</div>
				<div className="context-option" onclick={(e) => {contextMenuOptionClicked(e, 'close')}}>
					Close
				</div>
				<div className="context-option" onclick={(e) => {contextMenuOptionClicked(e, 'set_to_maintenance')}}>
					Set to Maintenance
				</div>
				<hr></hr>
				<div className="context-option" onclick={(e) => {contextMenuOptionClicked(e, 'ci_details')}}>
					CI Details
				</div>
				<div className="context-option" onclick={(e) => {contextMenuOptionClicked(e, 'ci_dependency_view')}}>
					CI Dependency View
				</div>
				<hr></hr>
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
		},
		listSysparam: {
			default: ''
		},
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
			selectedRecords: [],
			typeaheadColumnOptions: [],//[{label: 'Configuration Item', value: 'cmdb_ci'}]
			operatorOptions: [
				{label: 'starts with', value: 'STARTSWITH', types: ["String", "Reference", "Choice"]},
				{label: 'ends with', value: 'ENDSWITH', types: ["String", "Reference", "Choice"]},
				{label: 'contains', value: 'LIKE', types: ["String", "Reference", "Choice"]},
				{label: 'does not contain', value: 'NOTLIKE', types: ["String", "Reference", "Choice"]},
				{label: 'is', value: '=', types: ["String", "Reference", "Choice", "Integer", "True/False"]},
				{label: 'is not', value: '!=', types: ["String", "Reference", "Choice", "Integer", "True/False"]},
				{label: 'is empty', value: 'ISEMPTY', types: ["String", "Reference", "Choice", "Date/Time", "Integer", "True/False"]},
				{label: 'is not empty', value: 'ISNOTEMPTY', types: ["String", "Reference", "Choice", "Date/Time", "Integer", "True/False"]},
				{label: 'is anything', value: 'ANYTHING', types: ["String", "Reference", "Choice", "Date/Time", "Integer", "True/False"]},
				{label: 'is empty string', value: 'EMPTYSTRING', types: ["String", "Reference"]},
				{label: 'less than or is', value: '<=', types: ["String", "Choice", "Integer"]},
				{label: 'greater than or is', value: '>=', types: ["String", "Choice", "Integer"]},
				{label: 'between', value: 'BETWEEN', types: ["String", "Choice", "Date/Time", "Integer"]},
				{label: 'is same', value: 'SAMEAS', types: ["String", "Reference", "Choice", "Date/Time", "Integer", "True/False"]},
				{label: 'is different', value: 'NSAMEAS', types: ["String", "Reference", "Choice", "Date/Time", "Integer", "True/False"]},
				{label: 'is one of', value: 'IN', types: ["Choice"]},
				{label: 'is not one of', value: 'NOT IN', types: ["Choice"]},
				{label: 'less than', value: '<', types: ["Choice", "Integer"]},
				{label: 'greater than', value: '>', types: ["Choice", "Integer"]},
				{label: 'on', value: 'ON', types: ["Date/Time"]},
				{label: 'not on', value: 'NOTON', types: ["Date/Time"]},
				{label: 'before', value: '<', types: ["Date/Time"]},
				{label: 'at or before', value: '<=', types: ["Date/Time"]},
				{label: 'after', value: '>', types: ["Date/Time"]},
				{label: 'at or after', value: '>=', types: ["Date/Time"]},

			],
			showAddFilter: false,
			showAddFilterResults: false,
			addFilterInput: "",
			addFilterResults: [],
			filters: [],
			isMainQueryRunning: false,
			allSelectChecked: false,
			checkExternalSysparm: true,
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
			if (action.payload.name != "showInfo" && action.payload.name != "currentUser" && action.payload.name != "listSysparam") {
				dispatch('REFRESH_MAIN_QUERY');
			} else if (action.payload.name == "tableName") {
				let labelSysparm = `name=${state.properties.tableName}^elementISNOTEMPTY`;
				console.log("labelSysparm: ", labelSysparm);
				dispatch('FETCH_ALL_TABLE_COLUMNS', {
					table: 'sys_dictionary',
					sysparm_query: labelSysparm,
					sysparm_fields: 'element,column_label,name',
					sysparm_display_value: 'true'
				});
			} else if (action.payload.name == "listSysparam") {
				let encodedSysparm = '';
				encodedSysparm += action.payload.value;
				//encodedSysparm += state.properties.externalSysparam;
				state.filters.map((filter) => {
					encodedSysparm += `${filter.inputs.and_or.value}${filter.inputs.column.value}${filter.inputs.operator.value}${filter.inputs.value.value}`;
				});
				encodedSysparm += sortingArrayToString(state.sortingArray);
				dispatch('TABLE_FILTER#UPDATED', {value: encodedSysparm});
				dispatch('REFRESH_MAIN_QUERY', {force: true});
			}
		},
		[COMPONENT_BOOTSTRAPPED]: (coeffects) => {
			const { state, dispatch, updateState } = coeffects;
			console.log("COMPONENT_BOOTSTRAPPED");

			//dispatch('REFRESH_MAIN_QUERY');

			let labelSysparm = `name=${state.properties.tableName}^elementISNOTEMPTY`;
			console.log("labelSysparm: ", labelSysparm);
			dispatch('FETCH_ALL_TABLE_COLUMNS', {
				table: 'sys_dictionary',
				sysparm_query: labelSysparm,
				sysparm_fields: 'element,column_label,internal_type',
				sysparm_display_value: 'true'
			});
		},
		'QUERY_ERROR': (coeffects) => {
			const { updateState, action } = coeffects;
			console.log('%cQUERY_ERROR: %o', 'color:green;font-size:12px;', action.payload);
			updateState({isMainQueryRunning: false});
		},
		'REFRESH_MAIN_QUERY': (coeffects) => {
			const { state, dispatch, updateState, action } = coeffects;
			let isForced = false;
			if (action.payload) {
				isForced = action.payload.force;
			}
			console.log("isForced: ", isForced);
			if (state.isMainQueryRunning == false || isForced == true) {
				updateState({isMainQueryRunning: true});
				console.log('%cREFRESH_MAIN_QUERY', 'color:green;font-size:12px;');
				console.log('%cState: %o', 'color:green;font-size:12px;', state);

				let encodedSysparm = '';
				if (state.checkExternalSysparm == true && state.properties.externalSysparam) {
					updateState({checkExternalSysparm: false});
					encodedSysparm = state.properties.externalSysparam;

					let tempSysparm = encodedSysparm.replace(state.properties.listSysparam, "");
					if (tempSysparm.includes("^ORDERBY")) {
						let orderBySysparm = tempSysparm.substring(tempSysparm.indexOf("^ORDERBY"));
						let orderSysparmArray = orderBySysparm.split("^");
						orderSysparmArray.splice(0, 1);

						let updatedSortingArray = [];
						orderSysparmArray.forEach((orderBy) => {
							orderBy = orderBy.substring(7);
							let asc = true;
							if (orderBy.includes("DESC")) {
								asc = false;
								orderBy = orderBy.substring(4);
							}
							updatedSortingArray.push({field: orderBy, asc: asc});
						});
						updateState({sortingArray: updatedSortingArray});
						tempSysparm = tempSysparm.substring(0, tempSysparm.indexOf("^ORDERBY"));
					}
					console.log("tempSysparm: ", tempSysparm);
					let updatedFilters = [];
					if (tempSysparm.length > 0) {
						let urlFilters = tempSysparm.split(/(?=\^)/g);
						console.log("urlFilters: ", urlFilters);
						urlFilters.forEach((urlFilter) => {
							let and_or = {label: 'AND', value: '^'}
							if (urlFilter.substring(0, 3) == "^OR") {
								and_or = {label: 'OR', value: '^OR'}
								urlFilter = urlFilter.substring(3);
							} else {
								urlFilter = urlFilter.substring(1);
							}
							let operatorOption = state.operatorOptions.find((option) => urlFilter.includes(option.value));
							let operatorIndex = urlFilter.indexOf(operatorOption.value);
							let columnSection = urlFilter.substring(0, operatorIndex);
							urlFilter = urlFilter.substring(operatorIndex);
							let valueSection = urlFilter.replace(operatorOption.value, "");
							updatedFilters.push({
								showInputs: false,
								showResults: {operator: false, value: false},
								inputs: {
									and_or: and_or,
									column: {label: columnSection, value: columnSection},
									operator: operatorOption,
									value: {label: valueSection, value: valueSection}
								},
								results: {
									operator: [],
									value: []
								}
							});
						});
					}

					updateState({filters: updatedFilters});
				} else {
					encodedSysparm += state.properties.listSysparam;
					//encodedSysparm += state.properties.externalSysparam;
					state.filters.map((filter) => {
						encodedSysparm += `${filter.inputs.and_or.value}${filter.inputs.column.value}${filter.inputs.operator.value}${filter.inputs.value.value}`;
					});
					encodedSysparm += sortingArrayToString(state.sortingArray);
				}

				console.log("refresh sysparam: ", encodedSysparm);
				dispatch('FETCH_MAIN_TABLE', {
					table: state.properties.tableName,
					sysparm_query: encodedSysparm,
					sysparm_fields: state.properties.tableColumns.toString(),
					sysparm_display_value: 'all',
					sysparm_limit: parseInt(state.properties.tableLimit),
					sysparm_offset: parseInt(state.properties.tableLimit) * parseInt(state.properties.page)
				});
				if (state.autoRefreshActive == false) {
					setInterval(dispatch, 60000, "REFRESH_MAIN_QUERY");
					updateState({autoRefreshActive: true});
				}
			} else {
				console.log('%cMainQueryRunning currently. ignoring all requests until query is not running anymore', 'color:orange;font-size:12px;');
			}
		},
		'FETCH_MAIN_TABLE': createHttpEffect('/api/now/table/:table', {
			batch: false,
			method: 'GET',
			pathParams: ['table'],
			queryParams: ['sysparm_query', 'sysparm_fields', 'sysparm_display_value', 'sysparm_limit', 'sysparm_offset'],
			successActionType: 'FETCH_MAIN_TABLE_SUCCESS',
			errorActionType: 'QUERY_ERROR'
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
			updateState({tableData: result, totalCount: parseInt(action.meta.responseHeaders['x-total-count']), isMainQueryRunning: result.length == 0 ? false : true});
			dispatch('START_FETCH_COLUMN_LABELS');
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
			successActionType: 'FETCH_APP_SERVICES_SUCCESS',
			errorActionType: 'QUERY_ERROR'
		}),
		'FETCH_APP_SERVICES_SUCCESS': (coeffects) => {
			const { action, state, updateState, dispatch } = coeffects;
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

			if (action.payload.result.length > 0) {
				let updatedTableOrder = state.tableOrder;
				if (!updatedTableOrder.includes("application_service")) {
					updatedTableOrder.splice(7, 0, "application_service");
				}
				updateState({tableData: updatedTableData, tableOrder: updatedTableOrder});
				dispatch('FETCH_APP_SERVICE_IMPACT', {
					sysparm_query: impactSysparm + appServiceArray.toString(),
					sysparm_fields: "business_service,severity"
				});
			}else {
				dispatch('START_FETCH_SECONDARY_ALERTS');
			}
		},
		'FETCH_APP_SERVICE_IMPACT': createHttpEffect('api/now/table/em_impact_status', {
			method: 'GET',
			queryParams: ['sysparm_query', 'sysparm_fields'],
			successActionType: 'FETCH_APP_SERVICE_IMPACT_SUCCESS',
			errorActionType: 'QUERY_ERROR'
		}),
		'FETCH_APP_SERVICE_IMPACT_SUCCESS': (coeffects) => {
			const { action, state, updateState, dispatch } = coeffects;
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
			updateState({tableData: updatedTableData});
			dispatch('START_FETCH_SECONDARY_ALERTS');
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
			let encodedSysparm = state.properties.listSysparam;
			//encodedSysparm += state.properties.externalSysparam;
			state.filters.map((filter) => {
				encodedSysparm += `${filter.inputs.and_or.value}${filter.inputs.column.value}${filter.inputs.operator.value}${filter.inputs.value.value}`;
			});
			encodedSysparm += sortingArrayToString(updatedSorting);
			dispatch('TABLE_FILTER#UPDATED', {value: encodedSysparm});
			dispatch('REFRESH_MAIN_QUERY', {force: true});
		},
		'START_FETCH_COLUMN_LABELS': (coeffects) => {
			const { state, dispatch } = coeffects;
			if (state.tableData.length > 0) {
				let columns = Object.keys(state.tableData[0]);
				let labelSysparm = `name=${state.properties.tableName}^elementIN${columns.toString()}`;
				dispatch('FETCH_COLUMN_LABELS', {
					table: 'sys_dictionary',
					sysparm_query: labelSysparm,
					sysparm_fields: 'element,column_label',
					sysparm_display_value: 'true'
				});
			}
		},
		'FETCH_COLUMN_LABELS': createHttpEffect('/api/now/table/:table', {
			method: 'GET',
			pathParams: ['table'],
			queryParams: ['sysparm_query', 'sysparm_fields', 'sysparm_display_value'],
			successActionType: 'FETCH_COLUMN_LABELS_SUCCESS',
			errorActionType: 'QUERY_ERROR'
		}),
		'FETCH_COLUMN_LABELS_SUCCESS': (coeffects) => {
			const { action, updateState, state, dispatch } = coeffects;
			let updatedTableData = state.tableData;
			updatedTableData.forEach((tableRow) => {
				action.payload.result.forEach((result) => {
					tableRow[result.element].label = result.column_label;
				});
			});
			updateState({tableData: updatedTableData, dummyStateChange: !state.dummyStateChange});
			dispatch('START_FETCH_ASSIGNED_TO_AVATARS');
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
			successActionType: 'FETCH_SECONDARY_ALERTS_SUCCESS',
			errorActionType: 'QUERY_ERROR'
		}),
		'FETCH_SECONDARY_ALERTS_SUCCESS': (coeffects) => {
			const { action, updateState, state, dispatch } = coeffects;
			if (action.payload.result.length > 0) {
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
				updateState({tableData: updatedTableData, tableOrder: updatedTableOrder});
			}
			dispatch('START_FETCH_TAGS');
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
			successActionType: 'FETCH_ASSIGNED_TO_AVATARS_SUCCESS',
			errorActionType: 'QUERY_ERROR'
		}),
		'FETCH_ASSIGNED_TO_AVATARS_SUCCESS': (coeffects) => {
			const { action, state, dispatch, updateState } = coeffects;
			const { result } = action.payload;
			let updatedTableData = state.tableData;
			updatedTableData.forEach((tableRow) => {
				let matchingResult = result.find((field) => field.sys_id == tableRow.assigned_to.value);
				if (matchingResult) {
					tableRow.assigned_to.avatar = matchingResult.avatar + ".iix?t=small";
				}
			});
			updateState({tableData: updatedTableData});
			dispatch('START_FETCH_APP_SERVICES');
		},
		'START_FETCH_TAGS': (coeffects) => {
			const { dispatch, state, updateState } = coeffects;
			let ciArray = [];
			let sysparm = "configuration_itemIN"
			state.tableData.forEach((tableRow) => {
				if (tableRow.cmdb_ci.value != "") {
					ciArray.push(tableRow.cmdb_ci.value);
				}
			});
			if (ciArray.length > 0) {
				dispatch('FETCH_TAGS', {
					table: 'cmdb_key_value',
					sysparm_query: sysparm + ciArray.toString() + "^ORDERBYkey",
					sysparm_fields: 'configuration_item,key,value',
					sysparm_display_value: 'all'
				});
			} else {
				updateState({dummyStateChange: !state.dummyStateChange, isMainQueryRunning: false});
			}
		},
		'FETCH_TAGS': createHttpEffect('/api/now/table/:table', {
			method: 'GET',
			pathParams: ['table'],
			queryParams: ['sysparm_query', 'sysparm_fields', 'sysparm_display_value'],
			successActionType: 'FETCH_TAGS_SUCCESS',
			errorActionType: 'QUERY_ERROR'
		}),
		'FETCH_TAGS_SUCCESS': (coeffects) => {
			const { dispatch, state, updateState, action } = coeffects;
			console.log('FETCH_TAGS_SUCCESS');
			console.log("payload: ", action.payload);
			let updatedTableData = state.tableData;
			updatedTableData.forEach((tableRow) => {
				if (!tableRow.tags) {
					tableRow.tags = [];
				}
				action.payload.result.map((result) => {
					if (result.configuration_item.value == tableRow.cmdb_ci.value && tableRow.tags.filter((tag) => tag.key == result.key.display_value && tag.value == result.value.display_value).length == 0) {
						tableRow.tags.push({key: result.key.display_value, value: result.value.display_value});
					}
				});
			});
			let updatedTableOrder = state.tableOrder;
			if (!updatedTableOrder.includes("tags")) {
				updatedTableOrder.splice(updatedTableOrder.length - 1, 0, "tags");
			}
			updateState({tableData: updatedTableData, tableOrder: updatedTableOrder, dummyStateChange: !state.dummyStateChange, isMainQueryRunning: false});
		},
		'FETCH_ALL_TABLE_COLUMNS': createHttpEffect('/api/now/table/:table', {
			batch: false,
			method: 'GET',
			pathParams: ['table'],
			queryParams: ['sysparm_query', 'sysparm_fields', 'sysparm_display_value'],
			successActionType: 'FETCH_ALL_TABLE_COLUMNS_SUCCESS'
		}),
		'FETCH_ALL_TABLE_COLUMNS_SUCCESS': (coeffects) => {
			const { action, state, updateState, dispatch } = coeffects;
			console.log('FETCH_ALL_TABLE_COLUMNS_SUCCESS');
			console.log("payload: ", action.payload);
			var newtypeaheadColumnOptions = action.payload.result.map((result) => {return {label: result.column_label, value: result.element, type: result.internal_type.display_value, choices: result.internal_type.display_value == "True/False" ? [{label: "True", value: "true"},{label: "False", value: "false"}] : []}});
			console.log("newtypeaheadColumnOptions: ", newtypeaheadColumnOptions);
			updateState({typeaheadColumnOptions: newtypeaheadColumnOptions});
			dispatch('FETCH_CHOICES', {
				table: 'sys_choice',
				sysparm_query: `name=${state.properties.tableName}^language=en^ORDERBYelement^ORDERBYsequence`,
				sysparm_fields: 'element,label,value',
				sysparm_display_value: 'true'
			});
		},
		'FETCH_CHOICES': createHttpEffect('/api/now/table/:table', {
			batch: false,
			method: 'GET',
			pathParams: ['table'],
			queryParams: ['sysparm_query', 'sysparm_fields', 'sysparm_display_value'],
			successActionType: 'FETCH_CHOICES_SUCCESS'
		}),
		'FETCH_CHOICES_SUCCESS': (coeffects) => {
			const { action, state, updateState } = coeffects;
			console.log('FETCH_CHOICES_SUCCESS');
			console.log('payload: ', action.payload);
			let updatedTypeaheadOptions = state.typeaheadColumnOptions;
			action.payload.result.forEach((result) => {
				let matchIndex = updatedTypeaheadOptions.findIndex((typeaheadOption) => typeaheadOption.value == result.element);
				if (matchIndex > -1) {
					updatedTypeaheadOptions[matchIndex].choices.push({label: result.label, value: result.value});
				}
			});
			updateState({typeaheadColumnOptions: updatedTypeaheadOptions, dummyStateChange: !state.dummyStateChange});
		},
		'TOGGLE_ADD_FILTER': (coeffects) => {
			const {state, updateState} = coeffects;
			updateState({showAddFilter: !state.showAddFilter, showAddFilterResults: false});
		},
		'TOGGLE_SHOW_FILTER_INPUTS': (coeffects) => {
			const {state, updateState, action} = coeffects;
			console.log("TOGGLE_SHOW_FILTER_INPUTS");
			console.log("payload: ", action.payload);
			let updatedFilters = state.filters;
			console.log("state.filters: ", state.filters);
			updatedFilters[action.payload.value.index].showInputs = !updatedFilters[action.payload.value.index].showInputs;
			updatedFilters[action.payload.value.index].showResults.operator = false;
			updatedFilters[action.payload.value.index].showResults.value = false;
			updateState({filters: updatedFilters, dummyStateChange: !state.dummyStateChange});
		},
		'ADD_FILTER_KEYDOWN': (coeffects) => {
			const {dispatch, action} = coeffects;
			const { event, value } = action.payload.value;
			console.log("ADD_FILTER_KEYDOWN: ", event.key);
			switch (event.key) {
				case 'ArrowUp':
				case 'ArrowDown':
				case 'Escape':
				case 'Enter':
					event.preventDefault();
					return
				default:
					dispatch('UPDATE_ADD_FILTER_RESULTS', {value: value});
			}
		},
		'UPDATE_ADD_FILTER_RESULTS': (coeffects) => {
			const {action, state, updateState} = coeffects;
			const searchInput = action.payload.value;
			console.log("UPDATE_ADD_FILTER_RESULTS searchInput: ", searchInput);
			if (searchInput.length > 0) {
				let results = state.typeaheadColumnOptions.filter((column) => column.label.toLowerCase().includes(searchInput.toLowerCase()) || column.value.toLowerCase().includes(searchInput.toLowerCase()));
				console.log("results: ", results);
				updateState({addFilterResults: results, showAddFilterResults: true});
			} else {
				updateState({addFilterResults: [], showAddFilterResults: false});
			}
		},
		'ADD_FILTER_FOCUS': (coeffects) => {
			const {action, dispatch} = coeffects;
			dispatch('UPDATE_ADD_FILTER_RESULTS', {value: action.payload.value});
		},
		'FILTER_FOCUS': (coeffects) => {
			const {action, dispatch} = coeffects;
			const { value, operator, index } = action.payload.value;
			operator ? dispatch('UPDATE_FILTER_OPERATOR_RESULTS', {value: value, index: index}) : dispatch('UPDATE_FILTER_RESULTS', {value: value, index: index});
		},
		'FILTER_KEYDOWN': (coeffects) => {
			const {dispatch, action} = coeffects;
			const { event, value, operator, index } = action.payload.value;
			console.log("FILTER_KEYDOWN: ", event.key);
			switch (event.key) {
				case 'ArrowUp':
				case 'ArrowDown':
				case 'Escape':
				case 'Enter':
					event.preventDefault();
					return
				default:
					operator ? dispatch('UPDATE_FILTER_OPERATOR_RESULTS', {value: value, index: index}) : dispatch('UPDATE_FILTER_RESULTS', {value: value, index: index});
			}
		},
		'UPDATE_FILTER_OPERATOR_RESULTS': (coeffects) => {
			const {action, state, updateState} = coeffects;
			const searchInput = action.payload.value;
			let results = state.operatorOptions.filter((operatorOption) =>
				operatorOption.types.includes(state.filters[action.payload.index].inputs.column.type)
				&& (operatorOption.label.toLowerCase().includes(searchInput.toLowerCase()) || operatorOption.value.toLowerCase().includes(searchInput.toLowerCase()))
			);
			if (searchInput.trim().length == 0) {
				results = state.operatorOptions.filter((operatorOption) =>
					operatorOption.types.includes(state.filters[action.payload.index].inputs.column.type));
			}
			let updatedFilters = state.filters;
			updatedFilters[action.payload.index].results.operator = results;
			updatedFilters[action.payload.index].showResults.operator = true;
			updatedFilters[action.payload.index].showResults.value = false;
			updateState({filters: updatedFilters, dummyStateChange: !state.dummyStateChange});
		},
		'UPDATE_FILTER_RESULTS': (coeffects) => {
			const {action, state, updateState} = coeffects;
			const searchInput = action.payload.value;
			const index = action.payload.index;
			// let options = state.typeaheadColumnOptions.find((columnOption) => columnOption.value == state.filters[index].inputs.column.value || columnOption.label == state.filters[index].inputs.column.label);
			// console.log("options: ", options.choices);
			let results = [];
			if (state.filters[index].inputs.column.choices.length > 0) {
				results = state.filters[index].inputs.column.choices.filter((choice) => choice.value.toLowerCase().includes(searchInput.toLowerCase()) || choice.value.toLowerCase().includes(searchInput.toLowerCase()));
			}
			let updatedFilters = state.filters;
			updatedFilters[index].results.value = results;
			updatedFilters[index].showResults.value = true;
			updatedFilters[index].showResults.operator = false;
			updateState({filters: updatedFilters, dummyStateChange: !state.dummyStateChange});
		},
		'REMOVE_FILTER': (coeffects) => {
			const {action, state, updateState, dispatch} = coeffects;
			const index = action.payload.value.index;
			console.log("index: ", index);
			let updatedFilters = state.filters;
			updatedFilters.splice(index, 1);
			updateState({filters: updatedFilters, dummyStateChange: !state.dummyStateChange});

			let encodedSysparm = '';
			encodedSysparm += state.properties.listSysparam;
			//encodedSysparm += state.properties.externalSysparam;
			updatedFilters.map((filter) => {
				encodedSysparm += `${filter.inputs.and_or.value}${filter.inputs.column.value}${filter.inputs.operator.value}${filter.inputs.value.value}`;
			});
			encodedSysparm += sortingArrayToString(state.sortingArray);
			dispatch('TABLE_FILTER#UPDATED', {value: encodedSysparm});
			dispatch('REFRESH_MAIN_QUERY', {force: true});
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
					} catch (e) {}
					console.log('%cclickedRecordSysID: %o', 'color:green;font-size:12px;', clickedRecordSysID);
					updateState({showContextMenu: true, contextMenuLeft: event.clientX + "px", contextMenuTop: event.offsetY + "px", contextMenuRecord: clickedRecordSysID});
				} else {
					updateState({showContextMenu: false, contextMenuLeft: "0px", contextMenuTop: "0px", contextMenuRecord: clickedRecordSysID});
				}
			}
		},
		{
			events: ['click'],
			effect({dispatch, state, updateState, action: {payload: {event}}}) {
				updateState({showContextMenu: false, contextMenuLeft: "0px", contextMenuTop: "0px"});
				console.log(event.path);
				if (event.path.some((clickPath) => clickPath.className && clickPath.className.includes("add-filter")) == false) {

					console.log("hide add filter results");
					updateState({showAddFilterResults: false});
				}

				let clickedFilter = event.path.find((clickPath) => clickPath.className && clickPath.className.includes("filter index-"));
				if (!clickedFilter) {
					let updatedFilters = state.filters;
					updatedFilters.forEach((filter) => {
						filter.showResults.operator = false;
						filter.showResults.value = false;
					});
					updateState({filters: updatedFilters, dummyStateChange: !state.dummyStateChange});
				}
			},
		}
	]
});
