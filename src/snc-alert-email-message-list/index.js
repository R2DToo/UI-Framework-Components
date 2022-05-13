import {createCustomElement, actionTypes} from '@servicenow/ui-core';
const { COMPONENT_PROPERTY_CHANGED, COMPONENT_BOOTSTRAPPED, COMPONENT_ERROR_THROWN} = actionTypes;
import {createHttpEffect} from '@servicenow/ui-effect-http';
import snabbdom from '@servicenow/ui-renderer-snabbdom';
import styles from './styles.scss';
import '@servicenow/now-icon';
import '@servicenow/now-highlighted-value';
import '@servicenow/now-avatar';
import '@servicenow/now-rich-text';

import {isEqual} from 'lodash';

import amazonSVG from '../images/amazon-web-services-icon.svg';
import appDynamicsSVG from '../images/AppDynamics.svg';
import azureSVG from '../images/microsoft-azure-icon.svg';
import bmcSVG from '../images/bmc-software-icon.svg';
import ciscoSVG from '../images/cisco-ar21.svg';
import datadogSVG from '../images/datadog_new.svg';
import dynatraceSVG from '../images/dynatrace-icon.svg';
import emailSVG from '../images/email.svg';
import googleSVG from '../images/google-cloud-platform.svg';
import grafanaSVG from '../images/grafana-icon.svg';
import vmwareSVG from '../images/vmware_v7.svg';
import ibmSVG from '../images/ibm-icon.svg';
import icingaSVG from '../images/icinga.svg';
import genericcodeSVG from '../images/generic-code.svg';
import lightstepSVG from '../images/Lightstepv2.svg';
import logicmonitorSVG from '../images/logicmonitor-icon.svg';
import nagiosSVG from '../images/nagios.svg';
import newrelicSVG from '../images/new-relic-icon.svg';
import oracleSVG from '../images/oracle-icon.svg';
import op5SVG from '../images/op5.svg';
import prometheusSVG from '../images/prometheus-icon.svg';
import microfocusSVG from '../images/microfocus_1.svg';
import pagerdutySVG from '../images/pagerduty.svg';
import prtgSVG from '../images/prtg.svg';
import sapSVG from '../images/sap-icon.svg';
import splunkSVG from '../images/splunk_v6.svg';
import microsoftSVG from '../images/microsoft-icon.svg';
import solarwindsSVG from '../images/solarwinds-icon.svg';
import sumologicSVG from '../images/sumo-logic-icon.svg';
import zabbixSVG from '../images/zabbix-icon.svg';
import opsviewSVG from '../images/Opsview.svg';
import webhookSVG from '../images/webhook.svg';
import catchpointSVG from '../images/catchpoint_new.svg';
import servicenowSVG from '../images/servicenow_new.svg';
export const INTEGRATION_ICONS = [
	{key: 'aws', value: amazonSVG},
	{key: 'appdynamics', value: appDynamicsSVG},
	{key: 'azure', value: azureSVG},
	{key: 'bmc', value: bmcSVG},
	{key: 'catchpoint', value: catchpointSVG},
	{key: 'datadog', value: datadogSVG},
	{key: 'dynatrace', value: dynatraceSVG},
	{key: 'eif', value: ibmSVG},
	{key: 'email', value: emailSVG},
	{key: 'google', value: googleSVG},
	{key: 'group alert', value: servicenowSVG},
	{key: 'gcp', value: googleSVG},
	{key: 'grafana', value: grafanaSVG},
	{key: 'hpom', value: microfocusSVG},
	{key: 'hyperic', value: vmwareSVG},
	{key: 'ibm', value: ibmSVG},
	{key: 'icinga', value: icingaSVG},
	{key: 'itom', value: servicenowSVG},
	{key: 'lightstep', value: lightstepSVG},
	{key: 'logic monitor', value: logicmonitorSVG},
	{key: 'logicmonitor', value: logicmonitorSVG},
	{key: 'nagios', value: nagiosSVG},
	{key: 'new relic', value: newrelicSVG},
	{key: 'nnmi', value: microfocusSVG},
	{key: 'obm', value: microfocusSVG},
	{key: 'oem', value: oracleSVG},
	{key: 'omi', value: microfocusSVG},
	{key: 'op5', value: op5SVG},
	{key: 'opsview', value: opsviewSVG},
	{key: 'oracle', value: oracleSVG},
	{key: 'pagerduty', value: pagerdutySVG},
	{key: 'prometheus', value: prometheusSVG},
	{key: 'prtg', value: prtgSVG},
	{key: 'thousandeyes', value: ciscoSVG},
	{key: 'sap', value: sapSVG},
	{key: 'scom', value: microsoftSVG},
	{key: 'self', value: servicenowSVG},
	{key: 'solarwinds', value: solarwindsSVG},
	{key: 'splunk', value: splunkSVG},
	{key: 'sumologic', value: sumologicSVG},
	{key: 'vcenter', value: vmwareSVG},
	{key: 'vrealize', value: vmwareSVG},
	{key: 'zabbix', value: zabbixSVG},
	{key: 'generic events', value: webhookSVG},
];

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
		let updatedSelectedRecordIndexes = state.selectedRecordIndexes;
		if (!updatedSelectedRecordIndexes.includes(tableDataIndex)) {
			updatedSelectedRecordIndexes.push(tableDataIndex);
		} else {
			updatedSelectedRecordIndexes.splice(updatedSelectedRecordIndexes.indexOf(tableDataIndex), 1);
		}
		if (!updatedSelectedRecords.includes(sys_id)) {
			updatedSelectedRecords.push(sys_id);
			updatedTableData[tableDataIndex].selected = true;
		} else {
			updatedSelectedRecords.splice(updatedSelectedRecords.indexOf(sys_id), 1);
			updatedTableData[tableDataIndex].selected = false;
		}
		updateState({selectedRecords: updatedSelectedRecords, selectedRecordIndexes: updatedSelectedRecordIndexes, tableData: updatedTableData, dummyStateChange: !state.dummyStateChange});
	};

	const toggleAllSelect = () => {
		let updatedSelectedRecords = state.selectedRecords;
		let updatedSelectedRecordIndexes = state.selectedRecordIndexes;
		let updatedTableData = state.tableData;
		updatedTableData.forEach((row, index) => {
			row.selected = !state.allSelectChecked;
			if (!updatedSelectedRecords.includes(row.sys_id.value)) {
				updatedSelectedRecords.push(row.sys_id.value);
			}
			if (!updatedSelectedRecordIndexes.includes(index)) {
				updatedSelectedRecordIndexes.push(index);
			}
		});
		updateState({allSelectChecked: !state.allSelectChecked, tableData: updatedTableData, selectedRecords: updatedSelectedRecords, selectedRecordIndexes: updatedSelectedRecordIndexes});
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
					case "itom_tags": label = "ITOM Tags";
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

	const shortNumFormat = (num) => {
		let returnValue = '';
		num = parseInt(num);
		if (num > 999 && num < 1000000) {
			returnValue = (num/1000).toFixed(1) + 'K'; // convert to K for number from > 1000 < 1 million
		} else if (num > 1000000) {
			returnValue = (num/1000000).toFixed(1) + 'M'; // convert to M for number from > 1 million
		} else if (num <= 999) {
			returnValue = num; // if value < 1000, nothing to do
		}
		console.log("shortNumFormat: ", returnValue);
		return returnValue;
	};

	const tableData = () => {
		return state.tableData.map((row, index) => {
			return (
				<tr id={"sys_id-" + row.sys_id.value} onclick={() => fireEvent("TABLE_ROW#CLICKED", row.number.display_value)} class={{active: state.properties.showInfo && state.showingNumber == row.number.display_value}}>
					{state.tableOrder.map((key) => {
						if (row[key]) {
							if (key == "severity" || key == "sn_priority_group") {
								return <td>{row[key].display_value && <now-highlighted-value label={row[key].display_value} color={getSeverityColor(row[key].value)} variant="secondary"/>}</td>
							} else if (key == "sys_updated_on" || key == "sys_created_on") {
								return <td className="view-message">{makeRelativeTime(row[key].display_value)}</td>
							} else if (key == "number") {
								return <td className="view-message record-link">{row[key].display_value}</td>
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
								return <td className="description break-message">{row[key].display_value}</td>
							} else if (key == "application_service") {
								let services = [];
								row[key].forEach(service => {
									if (services.findIndex((serviceArray) => serviceArray.display_value == service.display_value) == -1) {
										services.push({display_value: service.display_value, value: service.value, impact: service.impact});
									}
								});
								var serviceTags = services.map((service, i) => {
									let url = "/$ngbsm.do?id=" + service.value;
									return <div className={"tag " + getSeverityColor(service.impact)} onclick={(e) => {e.stopPropagation(); dispatch("RECORD_LINK_CMDB_CI#CLICKED", {value: url});}}>{service.display_value}</div>
								});
								return <td className="tags">{serviceTags}</td>
							} else if (key == "secondary_alerts") {
								return <td className="tags">
									{row[key].display_value != "0" && <div className="circle-tags">
										<div className={"circle-tag"}>{row[key].display_value}</div>
									</div>}
								</td>
							} else if (key == "cmdb_ci") {
								let url = `/now/cmdb/record/${row['cmdb_ci.sys_class_name'].value}/${row[key].value}`;
								return <td className="view-message">
									{row[key].value ?
										<span className="underline-record-link" onclick={(e) => {e.stopPropagation(); dispatch("RECORD_LINK_CMDB_CI#CLICKED", {value: url});}}>{row[key].display_value}</span>
										: row[key].display_value
									}
								</td>
							} else if (key == "incident") {
								return <td className="view-message">
									{row[key].value ?
										<span className="underline-record-link" onclick={(e) => {e.stopPropagation(); dispatch("RECORD_LINK#CLICKED", {table: 'task', sys_id: row[key].value});}}>{row[key].display_value}</span>
										: row[key].display_value
									}
								</td>
							} else if (key == "itom_tags") {
								return <td className="broker-tags-container">
									<div className="broker-tags">
										{row[key].map((tag, index) =>
											<div className="broker-tag" id={`tagindex-${index}`}><span className="tag-key">{tag.key}:</span> {tag.value}</div>
										)}
									</div>
								</td>
							} else if (key == "alert_filter") {
								return <td className="description break-message">{row[key].display_value}</td>
							} else if (key == "name") {
								let url = '/now/nav/ui/classic/params/target/' + state.properties.tableName + '.do%3Fsys_id%3D' + row.sys_id.value;
								return <td className="name-message break-message"><span className="underline-record-link" onclick={(e) => {e.stopPropagation(); dispatch("RECORD_LINK_CMDB_CI#CLICKED", {value: url});}}>{row[key].display_value}</span></td>
							} else if (key == "alert_correlation_rule") {
								return <td className="name-message">{row[key].display_value}</td>
							} else if (key == "node") {
								return <td className="name-message break-message force-center">{row[key].display_value}</td>
							} else if (key == "source_icon") {
								return <td className="view-message"><img className="table-image" src={row[key].value}/></td>
							} else if (key == "incident.priority") {
								return <td className="view-message"><span class={{"text-red": row[key].value == "1"}}>{row[key].display_value}</span></td>
							} else if (key == "u_tbac_reasoning") {
								return <td className="name-message primary-color force-center">{row[key].display_value}</td>
							} else if (key == "prc") {
								return <td className="name-message force-center">{row[key].display_value}</td>
							} else if (key == "u_repeated_alerts") {
								return <td className="tags">
									<div className="circle-tags">
										<div className={"circle-tag secondary"}>{shortNumFormat(row[key].value)}</div>
									</div>
								</td>
							} else {
								return <td className="view-message">{row[key].display_value}</td>
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

	const contextMenuOptionClicked = (event, option, isAction = false) => {
		//event.stopPropagation();
		console.log("contextMenuOptionClicked: ", option);
		console.log("contextMenuRecordIndex: ", state.contextMenuRecordIndex);
		let contextRecord = state.tableData[state.contextMenuRecordIndex];


		if (state.properties.actionArray && isAction == true) {
			let matchingAction = state.properties.actionArray.find((action) => action.label == option);
			if (matchingAction) {
				if (matchingAction.label == "Tag Normalization") {
					dispatch("DEFINE_TAG#NORMALIZATION", {value: replaceActionQueryVariables(matchingAction.updateQuery, true)});
				} else if (matchingAction.isUpdate) {
					fireEvent('TABLE_ACTION_BAR_BUTTON#CLICKED', {selectedRecords: [contextRecord.sys_id.value], table: state.properties.tableName, updateQuery: matchingAction.updateQuery, isUpdate: matchingAction.isUpdate});
				} else if (matchingAction.isLink) {
					dispatch("RECORD_LINK_CMDB_CI#CLICKED", {value: replaceActionQueryVariables(matchingAction.updateQuery, true)});
				}
			}
		} else {
			switch (option) {
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
				case 'alert_tbac':
					// if (contextRecord) {
					// 	dispatch("RECORD_LINK_CMDB_CI#CLICKED", {value: `/now/cmdb/record/${contextRecord['cmdb_ci.sys_class_name'].value}/${contextRecord.cmdb_ci.value}`});
					// }
					break;
				case 'interactive_analysis':
					var sysparm = "";
					if (state.properties.paramListValue) {
						let matchingMenuOption = state.properties.menuOptions.find((menuOption) => menuOption.name.toLowerCase() == state.properties.paramListValue.toLowerCase());
						if (matchingMenuOption) {
							sysparm = matchingMenuOption.listValue;
						}
					} else {
						sysparm = state.properties.menuOptions[0].listValue;
					}
					sysparm += parseFiltersToSysparm(state.filters);
					dispatch("RECORD_LINK_CMDB_CI#CLICKED", {value: `/$interactive_analysis.do?sysparm_field=source&sysparm_table=${state.properties.tableName}&sysparm_from_list=true&sysparm_query=${sysparm}&sysparm_list_view=`});
					break;
				case 'same_ci':
					if (contextRecord) {
						//Add new filter, cmdb_ci=contextRecord
						let updatedFilters = state.filters;
						updatedFilters.push({
							showInputs: false,
							showResults: {operator: false, value: false},
							inputs: {
								and_or: {label: 'AND', value: '^'},
								column: {label: 'Configuration Item', value: 'cmdb_ci'},
								operator: {label: contextRecord.cmdb_ci.value ? 'is' : 'is empty', value: contextRecord.cmdb_ci.value ? '=' : 'ISEMPTY'},
								value: {label: contextRecord.cmdb_ci.display_value, value: contextRecord.cmdb_ci.value}
							},
							results: {
								operator: [],
								value: []
							}
						});
						updateState({filters: updatedFilters});
						dispatch('UPDATE_PAGE#PARAMETER', {params: {sysparm: parseFiltersToSysparm(updatedFilters)}});
						fireEvent('REFRESH_MAIN_QUERY', {force: true});
					}
					break;
				case 'same_node':
					if (contextRecord) {
						//Add new filter, cmdb_ci=contextRecord
						let updatedFilters = state.filters;
						updatedFilters.push({
							showInputs: false,
							showResults: {operator: false, value: false},
							inputs: {
								and_or: {label: 'AND', value: '^'},
								column: {label: 'Node', value: 'node'},
								operator: {label: contextRecord.node.value ? 'is' : 'is empty', value: contextRecord.node.value ? '=' : 'ISEMPTY'},
								value: {label: contextRecord.node.display_value, value: contextRecord.node.value}
							},
							results: {
								operator: [],
								value: []
							}
						});
						updateState({filters: updatedFilters});
						dispatch('UPDATE_PAGE#PARAMETER', {params: {sysparm: parseFiltersToSysparm(updatedFilters)}});
						fireEvent('REFRESH_MAIN_QUERY', {force: true});
					}
					break;
				case 'same_ag':
					if (contextRecord) {
						//Add new filter, cmdb_ci=contextRecord
						let updatedFilters = state.filters;
						updatedFilters.push({
							showInputs: false,
							showResults: {operator: false, value: false},
							inputs: {
								and_or: {label: 'AND', value: '^'},
								column: {label: 'Assignment Group', value: 'assignment_group'},
								operator: {label: contextRecord.assignment_group.value ? 'is' : 'is empty', value: contextRecord.assignment_group.value ? '=' : 'ISEMPTY'},
								value: {label: contextRecord.assignment_group.display_value, value: contextRecord.assignment_group.value}
							},
							results: {
								operator: [],
								value: []
							}
						});
						updateState({filters: updatedFilters});
						dispatch('UPDATE_PAGE#PARAMETER', {params: {sysparm: parseFiltersToSysparm(updatedFilters)}});
						fireEvent('REFRESH_MAIN_QUERY', {force: true});
					}
					break;
				case 'same_group':
					if (contextRecord) {
						//Add new filter, cmdb_ci=contextRecord
						let updatedFilters = state.filters;
						updatedFilters.push({
							showInputs: false,
							showResults: {operator: false, value: false},
							inputs: {
								and_or: {label: 'AND', value: '^'},
								column: {label: 'Group', value: 'group_source'},
								operator: {label: contextRecord.group_source.value ? 'is' : 'is empty', value: contextRecord.group_source.value ? '=' : 'ISEMPTY'},
								value: {label: contextRecord.group_source.display_value, value: contextRecord.group_source.value}
							},
							results: {
								operator: [],
								value: []
							}
						});
						updateState({filters: updatedFilters});
						dispatch('UPDATE_PAGE#PARAMETER', {params: {sysparm: parseFiltersToSysparm(updatedFilters)}});
						fireEvent('REFRESH_MAIN_QUERY', {force: true});
					}
					break;
				case 'same_tag':
					if (state.contextMenuTag.key && state.contextMenuTag.value) {
						//Add new filter, cmdb_ci=contextRecord
						let updatedFilters = state.filters;
						updatedFilters.push({
							showInputs: false,
							showResults: {operator: false, value: false},
							inputs: {
								and_or: {label: 'AND', value: '^'},
								column: {label: 'ITOM Tags', value: 'u_itom_tags'},
								operator: {label: "contains", value: "LIKE"},
								value: {label: `"${state.contextMenuTag.key}": "${state.contextMenuTag.value}"`, value: `"${state.contextMenuTag.key}": "${state.contextMenuTag.value}"`}
							},
							results: {
								operator: [],
								value: []
							}
						});
						updateState({filters: updatedFilters});
						dispatch('UPDATE_PAGE#PARAMETER', {params: {sysparm: parseFiltersToSysparm(updatedFilters)}});
						fireEvent('REFRESH_MAIN_QUERY', {force: true});
					}
					break;
				// case 'event_timeline': fireEvent();
				// break;"/$ngbsm.do?id=" + service.value
				default: break;
			}
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
				dispatch('UPDATE_PAGE#PARAMETER', {params: {sysparm: parseFiltersToSysparm(updatedFilters)}});
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
				dispatch('UPDATE_PAGE#PARAMETER', {params: {sysparm: parseFiltersToSysparm(updatedFilters)}});
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
		dispatch('UPDATE_PAGE#PARAMETER', {params: {sysparm: parseFiltersToSysparm(updatedFilters)}});
		fireEvent('REFRESH_MAIN_QUERY', {force: true});
	}

	const replaceActionQueryVariables = (updateQuery, fromContextMenu = false) => {
		console.log("replaceActionQueryVariables");
		if (state.selectedRecordIndexes.length > 0 && fromContextMenu == false) {
			console.log("starting query: ", updateQuery);
			while (updateQuery.includes("<") && updateQuery.includes(">")) {
				let variableStartIndex = updateQuery.indexOf("<");
				let variableEndIndex = updateQuery.indexOf(">");
				let rawVariable = updateQuery.substring(variableStartIndex, variableEndIndex + 1);
				console.log("Raw Variable: ", rawVariable);
				let variable = rawVariable.slice(1, rawVariable.length - 1);
				console.log("Variable: ", variable);
				updateQuery = updateQuery.replace(rawVariable, state.tableData[state.selectedRecordIndexes[0]][variable].value);
				console.log("replaced query: ", updateQuery);
			}
		} else if (fromContextMenu == true) {
			let matchingTableRecord = state.tableData[state.contextMenuRecordIndex];
			if (matchingTableRecord) {
				console.log("starting query: ", updateQuery);
				while (updateQuery.includes("<") && updateQuery.includes(">")) {
					let variableStartIndex = updateQuery.indexOf("<");
					let variableEndIndex = updateQuery.indexOf(">");
					let rawVariable = updateQuery.substring(variableStartIndex, variableEndIndex + 1);
					console.log("Raw Variable: ", rawVariable);
					let variable = rawVariable.slice(1, rawVariable.length - 1);
					console.log("Variable: ", variable);
					updateQuery = updateQuery.replace(rawVariable, matchingTableRecord[variable].value);
					console.log("replaced query: ", updateQuery);
				}
			}
		}
		return updateQuery;
	}

	const getCSVLink = () => {
		let csvContent = 'data:text/csv;charset=utf-8,';
		// console.log("getCSVLink");
		// console.log("CSV state.tableData: ", state.tableData);
		for(let row = 0; row < state.tableData.length; row++) {
			// console.log("CSV row: ", row);
			let keysAmount = Object.keys(state.tableData[row]).length;
			let keysCounter = 0;

			if (row == 0) {
				for(let key in state.tableData[row]) {
					if (key != "selected" && key != "source_icon" && key != "additional_info") {
						csvContent += '"' + key + '"' + (keysCounter + 1 < keysAmount ? ',' : '\r\n');
					}
					keysCounter++;
				}
			}
			keysCounter = 0;
			for(let key in state.tableData[row]) {
				//console.log("CSV key: ", key);
				if (typeof state.tableData[row][key].display_value != "undefined") {
					if (state.tableData[row][key].display_value) {
						//console.log("CSV display_value: ", state.tableData[row][key].display_value);
						if (key == "additional_info") {
							//csvContent += state.tableData[row][key].display_value.replaceAll('"', '""').replaceAll('#', '/').replaceAll('{', '"{').replaceAll('}', '}"') + (keysCounter + 1 < keysAmount ? ',' : '\r\n');
						} else if (key == "u_itom_tags") {
							csvContent += '"' + state.tableData[row][key].display_value.replaceAll('"', '""').replaceAll('#', '/').replaceAll(/\n/g, '').replaceAll(/\t/g, '') + '"' + (keysCounter + 1 < keysAmount ? ',' : '\r\n');
						} else {
							csvContent += '"' + state.tableData[row][key].display_value.replaceAll('"', '""').replaceAll('#', '/').replaceAll(/\n/g, '').replaceAll(/\t/g, '') + '"' + (keysCounter + 1 < keysAmount ? ',' : '\r\n');
						}
					} else {
						csvContent += '""' + (keysCounter + 1 < keysAmount ? ',' : '\r\n');
					}
				} else {
					if (key == "application_service") {
						let array = [];
						state.tableData[row][key].forEach(app_service => {
							if (!array.includes(app_service.display_value)) {
								array.push(app_service.display_value);
							}
						});
						csvContent += '"[' + array.toString() + ']"' + (keysCounter + 1 < keysAmount ? ',' : '\r\n');
					} else if (key == "itom_tags") {
						let array = [];
						state.tableData[row][key].forEach(itom_tag => {
							array.push(`${itom_tag.key}: ${itom_tag.value}`);
						});
						csvContent += '"[' + array.toString() + ']"' + (keysCounter + 1 < keysAmount ? ',' : '\r\n');
					} else {
						if (key != "selected" && key != "source_icon") {
							csvContent += '"WIP"' + (keysCounter + 1 < keysAmount ? ',' : '\r\n');
						}
					}
				}
				keysCounter++;
			}
			keysCounter = 0;
		}
		// console.log("CSV Content: ", csvContent);
		return csvContent;
	}

	return (
		<div id="snc-alert-email-message-list">
			<main id="main">
				<div className="header">
					<div className="table-title">
						<h1>
							Count (<span className="primary-color">{state.totalCount.toLocaleString()}</span>)
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
							{state.properties.actionArray.map((action) =>
								<li title={action.label} onclick={() => {
									if (action.label == "Tag Normalization") {
										dispatch("DEFINE_TAG#NORMALIZATION", {value: replaceActionQueryVariables(action.updateQuery, false)});
									} else if (action.isUpdate) {
										fireEvent('TABLE_ACTION_BAR_BUTTON#CLICKED', {selectedRecords: state.selectedRecords, table: state.properties.tableName, updateQuery: replaceActionQueryVariables(action.updateQuery, false), isUpdate: action.isUpdate});
									} else if (action.isLink) {
										dispatch("RECORD_LINK_CMDB_CI#CLICKED", {value: replaceActionQueryVariables(action.updateQuery, false)})
									}
								}}>
									<now-rich-text className="g-icon" html={action.svgIcon}/>
								</li>
							)}

							<li title="Export CSV">
								<a href={getCSVLink()} download={`itom_${state.properties.tableName}_${Date.now()}.csv`}>
									<svg attrs={{class: "g-icon", xmlns: "http://www.w3.org/2000/svg", height: "24px", width: "24px", viewBox: "0 0 24 24", 'enable-background': "new 0 0 24 24"}}><g><rect attr-fill="none" attr-height="24" attr-width="24"/></g><g><path attr-d="M18,15v3H6v-3H4v3c0,1.1,0.9,2,2,2h12c1.1,0,2-0.9,2-2v-3H18z M17,11l-1.41-1.41L13,12.17V4h-2v8.17L8.41,9.59L7,11l5,5 L17,11z"/></g></svg>
								</a>
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
			<div class={{'context-menu-container': true, visible: state.showContextMenu}} style={{top: state.contextMenuTop, left: state.contextMenuLeft}} hook-insert={(vnode) => console.log('inserted', vnode.elm.offsetWidth)}>
				<div className="context-menu">
					<ul className="context-menu-list">
						{state.properties.actionArray.map((action) =>
							<li className="context-menu-item"><button className="context-menu-button" onclick={(e) => {contextMenuOptionClicked(e, action.label, true)}}><now-rich-text html={action.svgIcon} className="context-menu-icon"/>{action.label}</button></li>
						)}
						<li className="context-menu-item"><a className="context-menu-link" href={getCSVLink()} download={`itom_${state.properties.tableName}_${Date.now()}.csv`}><button className="context-menu-button"><svg attrs={{class: "context-menu-icon", xmlns: "http://www.w3.org/2000/svg", height: "24px", width: "24px", viewBox: "0 0 24 24", 'enable-background': "new 0 0 24 24"}}><g><rect attr-fill="none" attr-height="24" attr-width="24"/></g><g><path attr-d="M18,15v3H6v-3H4v3c0,1.1,0.9,2,2,2h12c1.1,0,2-0.9,2-2v-3H18z M17,11l-1.41-1.41L13,12.17V4h-2v8.17L8.41,9.59L7,11l5,5 L17,11z"/></g></svg>Export CSV</button></a></li>
						<li className="context-menu-item"><button className="context-menu-button" onclick={(e) => {contextMenuOptionClicked(e, "interactive_analysis")}}><svg attrs={{class: "context-menu-icon", xmlns: "http://www.w3.org/2000/svg", height: "24", width: "24"}}><path attr-d="M3 20Q2.175 20 1.588 19.413Q1 18.825 1 18Q1 17.175 1.588 16.587Q2.175 16 3 16Q3.15 16 3.263 16Q3.375 16 3.5 16.05L8.05 11.5Q8 11.375 8 11.262Q8 11.15 8 11Q8 10.175 8.588 9.587Q9.175 9 10 9Q10.825 9 11.413 9.587Q12 10.175 12 11Q12 11.05 11.95 11.5L14.5 14.05Q14.625 14 14.738 14Q14.85 14 15 14Q15.15 14 15.262 14Q15.375 14 15.5 14.05L19.05 10.5Q19 10.375 19 10.262Q19 10.15 19 10Q19 9.175 19.587 8.587Q20.175 8 21 8Q21.825 8 22.413 8.587Q23 9.175 23 10Q23 10.825 22.413 11.412Q21.825 12 21 12Q20.85 12 20.738 12Q20.625 12 20.5 11.95L16.95 15.5Q17 15.625 17 15.738Q17 15.85 17 16Q17 16.825 16.413 17.413Q15.825 18 15 18Q14.175 18 13.588 17.413Q13 16.825 13 16Q13 15.85 13 15.738Q13 15.625 13.05 15.5L10.5 12.95Q10.375 13 10.262 13Q10.15 13 10 13Q9.95 13 9.5 12.95L4.95 17.5Q5 17.625 5 17.738Q5 17.85 5 18Q5 18.825 4.412 19.413Q3.825 20 3 20ZM15 9 14.05 6.95 12 6 14.05 5.05 15 3 15.95 5.05 18 6 15.95 6.95ZM4 9.975 3.375 8.625 2.025 8 3.375 7.375 4 6.025 4.625 7.375 5.975 8 4.625 8.625Z"/></svg>Interactive Analysis</button></li>
						{state.properties.tableName == "em_alert" && <li className="context-menu-item"><button className="context-menu-button"><svg attrs={{class: "context-menu-icon", xmlns: "http://www.w3.org/2000/svg", height: "24px", width: "24px", viewBox: "0 0 24 24", 'enable-background': "new 0 0 24 24"}}><g><rect attr-fill="none" attr-height="24" attr-width="24"/></g><g><path attr-d="M11,21h-1l1-7H7.5c-0.88,0-0.33-0.75-0.31-0.78C8.48,10.94,10.42,7.54,13.01,3h1l-1,7h3.51c0.4,0,0.62,0.19,0.4,0.66 C12.97,17.55,11,21,11,21z"/></g></svg>Alert Playbooks<svg attrs={{class: "context-menu-icon",xmlns: "http://www.w3.org/2000/svg", height: "24px", width: "24px", viewBox: "0 0 24 24"}}><path attr-d="M0 0h24v24H0V0z" attr-fill="none"/><path attr-d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6-6-6z"/></svg></button>
							<ul className="context-menu-sub-list">
								{state.alertActions.map((alertAction) => {
									if (alertAction.type == "link") {
										return <li className="context-menu-item"><button className="context-menu-button" onclick={(e) => {dispatch("RECORD_LINK_CMDB_CI#CLICKED", {value: alertAction.value})}}><svg attrs={{class: "context-menu-icon", xmlns: "http://www.w3.org/2000/svg", height: "24px", width: "24px", viewBox: "0 0 24 24", 'enable-background': "new 0 0 24 24"}}><g><rect attr-fill="none" attr-height="24" attr-width="24"/></g><g><path attr-d="M11,21h-1l1-7H7.5c-0.88,0-0.33-0.75-0.31-0.78C8.48,10.94,10.42,7.54,13.01,3h1l-1,7h3.51c0.4,0,0.62,0.19,0.4,0.66 C12.97,17.55,11,21,11,21z"/></g></svg>{alertAction.display_value}</button></li>
									} else {
										return <li className="context-menu-item"><button className="context-menu-button" onclick={(e) => {dispatch("START_FLOW", {value: alertAction.value})}}><svg attrs={{class: "context-menu-icon", xmlns: "http://www.w3.org/2000/svg", height: "24px", width: "24px", viewBox: "0 0 24 24", 'enable-background': "new 0 0 24 24"}}><g><rect attr-fill="none" attr-height="24" attr-width="24"/></g><g><path attr-d="M11,21h-1l1-7H7.5c-0.88,0-0.33-0.75-0.31-0.78C8.48,10.94,10.42,7.54,13.01,3h1l-1,7h3.51c0.4,0,0.62,0.19,0.4,0.66 C12.97,17.55,11,21,11,21z"/></g></svg>{alertAction.display_value}</button></li>
									}
								}
								)}
								<li className="context-menu-item"><button className="context-menu-button" onclick={(e) => {contextMenuOptionClicked(e, 'ci_details')}}><svg attrs={{class: "context-menu-icon",xmlns: "http://www.w3.org/2000/svg", height: "24px", width: "24px", viewBox: "0 0 24 24"}}><path attr-d="M0 0h24v24H0V0z" attr-fill="none"/><path attr-d="M11 15h2v-3h3v-2h-3V7h-2v3H8v2h3zM21 3H3c-1.11 0-2 .89-2 2v12c0 1.1.89 2 2 2h5v2h8v-2h5c1.1 0 2-.9 2-2V5c0-1.11-.9-2-2-2zm0 14H3V5h18v12z"/></svg>CI Details</button></li>
								<li className="context-menu-item"><button className="context-menu-button" onclick={(e) => {contextMenuOptionClicked(e, 'ci_dependency_view')}}><svg attrs={{class: "context-menu-icon",xmlns: "http://www.w3.org/2000/svg", height: "24px", width: "24px", viewBox: "0 0 24 24", 'enable-background': "new 0 0 24 24"}}><g><rect attr-fill="none" attr-height="24" attr-width="24" attr-x="0"/></g><g><path attr-d="M11,18h6v-5h-2.25V9.25h-4V7H13V2H7v5h2.25v2.25h-4V13H3v5h6v-5H6.75v-2.25h6.5V13H11V18z M15.5,14.5v2h-3v-2H15.5z M8.5,5.5v-2h3v2H8.5z M7.5,14.5v2h-3v-2H7.5z"/></g></svg>CI Dependency View</button></li>
							</ul>
						</li>}
					</ul>
					{state.properties.tableName == "em_alert" && <ul className="context-menu-list">
						<li className="context-menu-item"><button className="context-menu-button"><svg attrs={{class: "context-menu-icon", xmlns: "http://www.w3.org/2000/svg", height: "24px", width: "24px", viewBox: "0 0 24 24"}}><path attr-d="M0 0h24v24H0V0z" attr-fill="none"/><path attr-d="M15.5 14h-.79l-.28-.27c1.2-1.4 1.82-3.31 1.48-5.34-.47-2.78-2.79-5-5.59-5.34-4.23-.52-7.79 3.04-7.27 7.27.34 2.8 2.56 5.12 5.34 5.59 2.03.34 3.94-.28 5.34-1.48l.27.28v.79l4.25 4.25c.41.41 1.08.41 1.49 0 .41-.41.41-1.08 0-1.49L15.5 14zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>Quick Search<svg attrs={{class: "context-menu-icon",xmlns: "http://www.w3.org/2000/svg", height: "24px", width: "24px", viewBox: "0 0 24 24"}}><path attr-d="M0 0h24v24H0V0z" attr-fill="none"/><path attr-d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6-6-6z"/></svg></button>
							<ul className="context-menu-sub-list">
								<li className="context-menu-item"><button className="context-menu-button" onclick={(e) => {contextMenuOptionClicked(e, 'same_ci')}}><svg attrs={{class: "context-menu-icon", xmlns: "http://www.w3.org/2000/svg", height: "24px", width: "24px", viewBox: "0 0 24 24", 'enable-background': "new 0 0 24 24"}}><g><rect attr-fill="none" atttr-height="24" attr-width="24"/></g><g><path attr-d="M11,21h-1l1-7H7.5c-0.88,0-0.33-0.75-0.31-0.78C8.48,10.94,10.42,7.54,13.01,3h1l-1,7h3.51c0.4,0,0.62,0.19,0.4,0.66 C12.97,17.55,11,21,11,21z"/></g></svg>Same CI</button></li>
								<li className="context-menu-item"><button className="context-menu-button" onclick={(e) => {contextMenuOptionClicked(e, 'same_node')}}><svg attrs={{class: "context-menu-icon", xmlns: "http://www.w3.org/2000/svg", height: "24px", width: "24px", viewBox: "0 0 24 24", 'enable-background': "new 0 0 24 24"}}><g><rect attr-fill="none" atttr-height="24" attr-width="24"/></g><g><path attr-d="M11,21h-1l1-7H7.5c-0.88,0-0.33-0.75-0.31-0.78C8.48,10.94,10.42,7.54,13.01,3h1l-1,7h3.51c0.4,0,0.62,0.19,0.4,0.66 C12.97,17.55,11,21,11,21z"/></g></svg>Same Node</button></li>
								<li className="context-menu-item"><button className="context-menu-button" onclick={(e) => {contextMenuOptionClicked(e, 'same_ag')}}><svg attrs={{class: "context-menu-icon", xmlns: "http://www.w3.org/2000/svg", height: "24px", width: "24px", viewBox: "0 0 24 24", 'enable-background': "new 0 0 24 24"}}><g><rect attr-fill="none" atttr-height="24" attr-width="24"/></g><g><path attr-d="M11,21h-1l1-7H7.5c-0.88,0-0.33-0.75-0.31-0.78C8.48,10.94,10.42,7.54,13.01,3h1l-1,7h3.51c0.4,0,0.62,0.19,0.4,0.66 C12.97,17.55,11,21,11,21z"/></g></svg>Same AG</button></li>
								<li className="context-menu-item"><button className="context-menu-button" onclick={(e) => {contextMenuOptionClicked(e, 'same_group')}}><svg attrs={{class: "context-menu-icon", xmlns: "http://www.w3.org/2000/svg", height: "24px", width: "24px", viewBox: "0 0 24 24", 'enable-background': "new 0 0 24 24"}}><g><rect attr-fill="none" atttr-height="24" attr-width="24"/></g><g><path attr-d="M11,21h-1l1-7H7.5c-0.88,0-0.33-0.75-0.31-0.78C8.48,10.94,10.42,7.54,13.01,3h1l-1,7h3.51c0.4,0,0.62,0.19,0.4,0.66 C12.97,17.55,11,21,11,21z"/></g></svg>Same Group</button></li>
								<li className="context-menu-item"><button className="context-menu-button" onclick={(e) => {contextMenuOptionClicked(e, 'same_tag')}}><svg attrs={{class: "context-menu-icon", xmlns: "http://www.w3.org/2000/svg", height: "24px", width: "24px", viewBox: "0 0 24 24"}}><path attr-d="M0 0h24v24H0V0z" attr-fill="none"/><path attr-d="M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58s1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41s-.23-1.06-.59-1.42zM13 20.01L4 11V4h7v-.01l9 9-7 7.02z"/><circle attr-cx="6.5" attr-cy="6.5" attr-r="1.5"/></svg>Same Tag</button></li>
							</ul>
						</li>
					</ul>}
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
		if (column == "_row_data" || column == "sys_id" || column == "cmdb_ci.sys_class_name" || column == "additional_info" || column == "u_itom_tags") {
			return;
		}
		if (!tableOrder.includes(column)) {
			tableOrder.push(column);
		}
	});
	tableData.forEach((tableRow) => {
		let fields = Object.keys(tableRow);
		for (let i = 0; i < fields.length; i++) {
			if (fields[i] == "_row_data" || fields[i] == "sys_id" || fields[i] == "cmdb_ci.sys_class_name" || fields[i] == "selected" || fields[i] == "additional_info" || fields[i] == "u_itom_tags") {
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

const sortTags = (a, b) => {
	let aKey = a.key.toLowerCase();
	let aPrefixIndex = aKey.indexOf("sn-");
	if (aPrefixIndex > -1) {
		aKey = aKey.substring(aPrefixIndex + 3);
	}
	let bKey = b.key.toLowerCase();
	let bPrefixIndex = bKey.indexOf("sn-");
	if (bPrefixIndex > -1) {
		bKey = bKey.substring(bPrefixIndex + 3);
	}

	if ( aKey < bKey ){
    return -1;
  }
  if ( aKey > bKey ){
    return 1;
  }
  return 0;
}

const findMatchingSourceIcon = (sourceValue) => {
	let icon = webhookSVG;
	let match = INTEGRATION_ICONS.find((integration_icon) => sourceValue.toLowerCase().includes(integration_icon.key));
	if (match) {
		icon = match.value;
	}
	return icon;
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
		actionArray: {
			default: []
		},
		paramListValue: {
			default: ''
		},
		menuOptions: {
			default: []
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
				},
				{
					field: "order",
					asc: true
				}
			], //format = [{field: "severity", asc: true}],
			showContextMenu: false,
			contextMenuLeft: "0px",
			contextMenuTop: "0px",
			contextMenuRecordIndex: 0,
			tableOrder: [],
			tableData: [],
			totalCount: 0,
			autoRefreshActive: false,
			selectedRecords: [],
			selectedRecordIndexes: [],
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
			lastTableData: [],
			contextMenuTag: {},
			alertActions: []
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
			if (action.payload.name != "showInfo" && action.payload.name != "currentUser") {
				if (action.payload.name == "menuOptions" || action.payload.name == "paramListValue") {
					console.log("list properties: ", state.properties);
				}
				dispatch('REFRESH_MAIN_QUERY', {force: action.payload.name == "paramListValue" || action.payload.name == "menuOptions"});
			} else if (action.payload.name == "tableName") {
				let labelSysparm = `name=${state.properties.tableName}^elementISNOTEMPTY`;
				console.log("labelSysparm: ", labelSysparm);
				dispatch('FETCH_ALL_TABLE_COLUMNS', {
					table: 'sys_dictionary',
					sysparm_query: labelSysparm,
					sysparm_fields: 'element,column_label,name',
					sysparm_display_value: 'true'
				});
			}
		},
		[COMPONENT_BOOTSTRAPPED]: (coeffects) => {
			const { state, dispatch, updateState } = coeffects;
			console.log("COMPONENT_BOOTSTRAPPED");

			let labelSysparm = `name=${state.properties.tableName}^elementISNOTEMPTY`;
			console.log("labelSysparm: ", labelSysparm);
			dispatch('FETCH_ALL_TABLE_COLUMNS', {
				table: 'sys_dictionary',
				sysparm_query: labelSysparm,
				sysparm_fields: 'element,column_label,internal_type',
				sysparm_display_value: 'true'
			});
			dispatch('REFRESH_MAIN_QUERY', {force: false});
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
			console.log("%cparamListValue: %o", "color: green;font-size:1.2em;", state.properties.paramListValue);
			console.log("isForced: ", isForced);
			if (state.isMainQueryRunning == false || isForced == true) {
				updateState({isMainQueryRunning: true});
				console.log('%cREFRESH_MAIN_QUERY', 'color:green;font-size:12px;');
				console.log('%cState: %o', 'color:green;font-size:12px;', state);

				let encodedSysparm = '';
				if (state.checkExternalSysparm == true && state.properties.externalSysparam) {
					updateState({checkExternalSysparm: false});

					if (state.properties.paramListValue) {
						let matchingMenuOption = state.properties.menuOptions.find((menuOption) => menuOption.name.toLowerCase() == state.properties.paramListValue.toLowerCase());
						if (matchingMenuOption) {
							encodedSysparm = matchingMenuOption.listValue;
						}
					} else {
						encodedSysparm = state.properties.menuOptions[0].listValue;
					}
					encodedSysparm += state.properties.externalSysparam;

					let tempSysparm = state.properties.externalSysparam;
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
					if (state.properties.paramListValue) {
						let matchingMenuOption = state.properties.menuOptions.find((menuOption) => menuOption.name.toLowerCase() == state.properties.paramListValue.toLowerCase());
						if (matchingMenuOption) {
							encodedSysparm += matchingMenuOption.listValue;
						}
					} else {
						encodedSysparm += state.properties.menuOptions[0].listValue;
					}
					state.filters.map((filter) => {
						encodedSysparm += `${filter.inputs.and_or.value}${filter.inputs.column.value}${filter.inputs.operator.value}${filter.inputs.value.value}`;
					});
					encodedSysparm += sortingArrayToString(state.sortingArray);
				}

				console.log("refresh sysparam: ", encodedSysparm);
				console.log("%cparamListValue: %o", "color: green;font-size:1.2em;", state.properties.paramListValue);
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
			errorActionType: 'QUERY_ERROR',
			cacheable: true
		}),
		'FETCH_MAIN_TABLE_SUCCESS': (coeffects) => {
			const { action, state, updateState, dispatch } = coeffects;
			const { result } = action.payload;
			console.log('%cFETCH_MAIN_TABLE_SUCCESS', 'color:green');
			console.log("%cpayload: %o", 'color:green', result);
			console.log("action: ", action);
			let updatedTableOrder = state.tableOrder;
			result.forEach((resultRow) => {
				if (state.selectedRecords.includes(resultRow.sys_id.value)) {
					resultRow.selected = true;
				} else {
					resultRow.selected = false;
				}

				if (resultRow.u_itom_tags) {
					resultRow.itom_tags = [];
					if (resultRow.u_itom_tags.value) {
						try {
							let itom_tags = JSON.parse(resultRow.u_itom_tags.value);
							let itom_tag_keys = Object.keys(itom_tags);
							itom_tag_keys.forEach((tag_key) => {
								resultRow.itom_tags.push({key: tag_key, value: itom_tags[tag_key]});
							});
						} catch (e) {

						}
						resultRow.itom_tags.sort(sortTags);
					}
					if (!updatedTableOrder.includes("itom_tags")) {
						updatedTableOrder.splice(9, 0, "itom_tags");
					}
				}
				if (resultRow.source) {
					resultRow.source_icon = {
						label: 'Source Icon',
						value: findMatchingSourceIcon(resultRow.source.display_value)
					};
					if (!updatedTableOrder.includes("source_icon")) {
						updatedTableOrder.splice(4, 0, "source_icon");
					}
				}
				if (resultRow.group_source) {
					if (resultRow.group_source.value == "2") {
						resultRow.group_source.display_value = "Tag-based";
					}
				}
			});

			dispatch('TABLE_RECORD_COUNT#UPDATED', {value: parseInt(action.meta.responseHeaders['x-total-count'])});
			updateState({tableData: result, tableOrder: updatedTableOrder, totalCount: parseInt(action.meta.responseHeaders['x-total-count']), isMainQueryRunning: result.length == 0 ? false : true});
			dispatch('START_FETCH_COLUMN_LABELS');
		},
		[COMPONENT_ERROR_THROWN]: (coeffects) => {
			console.log("%cERROR_THROWN: %o", "color:red", coeffects.action.payload);
		},
		'START_FETCH_APP_SERVICES': (coeffects) => {
			const { state, dispatch } = coeffects;
			let ciArray = [];
			state.tableData.forEach((row) => {
				if (row.cmdb_ci && row.cmdb_ci.value != "" && !ciArray.includes(row.cmdb_ci.value)) {
					ciArray.push(row.cmdb_ci.value);
				}
			});
			if (ciArray.length > 0) {
				let sysparm = "ci_idIN" + ciArray.toString();
				dispatch('FETCH_APP_SERVICES', {
					table: 'svc_ci_assoc',
					sysparm_query: sysparm,
					sysparm_fields: 'service_id,ci_id',
					sysparm_display_value: 'all'
				});
			} else {
				dispatch('START_FETCH_SECONDARY_ALERTS');
			}
		},
		'FETCH_APP_SERVICES': createHttpEffect('/api/now/table/:table', {
			method: 'GET',
			pathParams: ['table'],
			queryParams: ['sysparm_query', 'sysparm_fields', 'sysparm_display_value'],
			successActionType: 'FETCH_APP_SERVICES_SUCCESS',
			errorActionType: 'QUERY_ERROR',
			cacheable: true
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
					updatedTableOrder.splice(11, 0, "application_service");
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
			errorActionType: 'QUERY_ERROR',
			cacheable: true
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
			let encodedSysparm = "";
			state.filters.map((filter) => {
				encodedSysparm += `${filter.inputs.and_or.value}${filter.inputs.column.value}${filter.inputs.operator.value}${filter.inputs.value.value}`;
			});
			encodedSysparm += sortingArrayToString(updatedSorting);
			dispatch('UPDATE_PAGE#PARAMETER', {params: {sysparm: encodedSysparm}});
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
			errorActionType: 'QUERY_ERROR',
			cacheable: true
		}),
		'FETCH_COLUMN_LABELS_SUCCESS': (coeffects) => {
			const { action, updateState, state, dispatch } = coeffects;
			console.log("FETCH_COLUMN_LABELS_SUCCESS payload: ", action.payload);
			let updatedTableData = state.tableData;
			updatedTableData.forEach((tableRow) => {
				action.payload.result.forEach((result) => {
					tableRow[result.element].label = result.column_label;
				});
				if (tableRow['incident.priority']) {
					tableRow['incident.priority'].label = "Task Priority";
				}
				if (tableRow['incident.assignment_group']) {
					tableRow['incident.assignment_group'].label = "Task Assignment Group";
				}
				if (tableRow['sys_created_on']) {
					tableRow['sys_created_on'].label = "Created";
				}
				if (tableRow['sys_updated_on']) {
					tableRow['sys_updated_on'].label = "Updated";
				}
			});
			updateState({tableData: updatedTableData, dummyStateChange: !state.dummyStateChange});
			dispatch('START_FETCH_AVATARS');
		},
		'START_FETCH_SECONDARY_ALERTS': (coeffects) => {
			const { dispatch, state, updateState } = coeffects;
			let parentList = [];
			let secondarySysparm = "parentIN";
			state.tableData.forEach((tableRow) => {
				if (tableRow.group_source && tableRow.group_source.display_value != "None" && tableRow.group_source.display_value != "Secondary") {
					parentList.push(tableRow.sys_id.value);
				}
			});
			if (parentList.length > 0) {
				dispatch('FETCH_SECONDARY_ALERTS', {
					table: 'em_alert',
					sysparm_query: secondarySysparm + parentList.toString(),
					sysparm_count: 'true',
					sysparm_group_by: 'parent'
				});
			} else {
				//dispatch('START_FETCH_TAGS');
				//dispatch('START_FETCH_TAG_BASED_DEFINITION');
				dispatch("START_FETCH_PRC");
			}
		},
		'FETCH_SECONDARY_ALERTS': createHttpEffect('/api/now/stats/:table', {
			method: 'GET',
			pathParams: ['table'],
			queryParams: ['sysparm_query', 'sysparm_count', 'sysparm_group_by'],
			successActionType: 'FETCH_SECONDARY_ALERTS_SUCCESS',
			errorActionType: 'QUERY_ERROR',
			cacheable: true
		}),
		'FETCH_SECONDARY_ALERTS_SUCCESS': (coeffects) => {
			const { action, updateState, state, dispatch } = coeffects;
			console.log("FETCH_SECONDARY_ALERTS_SUCCESS payload: ", action.payload);
			let updatedTableData = state.tableData;
			let updatedTableOrder = state.tableOrder;
			if (action.payload.result.length > 0) {
				updatedTableData.forEach((tableRow) => {
					tableRow.secondary_alerts = {display_value: "0", value: "0", label: "Secondary Alerts"};
					let matchingResult = action.payload.result.find((result) => tableRow.sys_id.value == result.groupby_fields[0].value);
					if (matchingResult) {
						tableRow.secondary_alerts.display_value = matchingResult.stats.count;
						tableRow.secondary_alerts.value = matchingResult.stats.count;
					}
				});
				if (!updatedTableOrder.includes("secondary_alerts")) {
					updatedTableOrder.splice(8, 0, "secondary_alerts");
				}
			}
			if (isEqual(state.lastTableData, updatedTableData) == false) {
				updateState({tableData: updatedTableData, tableOrder: updatedTableOrder, isMainQueryRunning: false});
			}
			//dispatch('START_FETCH_TAG_BASED_DEFINITION');
			//dispatch('START_FETCH_TAGS');
			dispatch("START_FETCH_PRC");
		},
		'START_FETCH_TAG_BASED_DEFINITION': (coeffects) => {
			const { state, dispatch, updateState } = coeffects;
			let sysparm = "name=em_alert^element_idIN";
			let tagBasedAlerts = [];
			state.tableData.forEach((tableRow) => {
				if (tableRow.group_source && tableRow.group_source.value == '2') {
					tagBasedAlerts.push(tableRow.sys_id.value);
				}
			});
			if (tagBasedAlerts.length > 0) {
				dispatch('FETCH_TAG_BASED_DEFINITION', {
					table: 'sys_journal_field',
					sysparm_query: sysparm + tagBasedAlerts.toString() + "^ORDERBYDESCsys_created_on^ORDERBYelement_id",
					sysparm_fields: 'value,element_id',
					sysparm_display_value: 'false'
				});
			} else {
				dispatch("START_FETCH_PRC");
			}
		},
		'FETCH_TAG_BASED_DEFINITION': createHttpEffect('/api/now/table/:table', {
			method: 'GET',
			pathParams: ['table'],
			queryParams: ['sysparm_query', 'sysparm_fields', 'sysparm_display_value'],
			successActionType: 'FETCH_TAG_BASED_DEFINITION_SUCCESS',
			errorActionType: 'QUERY_ERROR',
			cacheable: true
		}),
		'FETCH_TAG_BASED_DEFINITION_SUCCESS': (coeffects) => {
			const { action, state, updateState, dispatch } = coeffects;
			console.log("FETCH_TAG_BASED_DEFINITION_SUCCESS payload: ", action.payload);
			let updatedTableData = state.tableData;
			if (action.payload && action.payload.result) {
				updatedTableData.forEach((tableRow) => {
					tableRow.tag_based_definition = {display_value: "", value: "", label: 'Tag-based Definition'};
					if (tableRow.group_source.value == "2") {
						action.payload.result.forEach((result) => {
							if (tableRow.tag_based_definition.display_value.length == 0 && tableRow.sys_id.value == result.element_id) {
								let method = result.value.match(/(?<=<a.*>\[Tag Based\]).*(?=<\/a>)/gi);
								if (method && method[0]) {
									tableRow.tag_based_definition.display_value = method[0];
									tableRow.tag_based_definition.value = method[0];
								}
							}
						});
					}
				});
				let updatedTableOrder = state.tableOrder;
				if (!updatedTableOrder.includes("tag_based_definition")) {
					updatedTableOrder.splice(10, 0, "tag_based_definition");
				}
				updateState({tableOrder: updatedTableOrder});
			}
			updateState({tableData: updatedTableData, dummyStateChange: !state.dummyStateChange});
			dispatch("START_FETCH_PRC");
		},
		'START_FETCH_PRC': (coeffects) => {
			const { state, dispatch, updateState } = coeffects;
			let nonSecondaryAlerts = [];
			state.tableData.filter(tableRow => tableRow.group_source && tableRow.group_source.value != "5").forEach(tableRow => {
				nonSecondaryAlerts.push(tableRow.sys_id.value);
			});
			console.log("PRC sysparm: ", 'parent_alert=' + nonSecondaryAlerts.toString());
			if (nonSecondaryAlerts.length > 0) {
				dispatch('FETCH_PRC', {
					table: 'em_root_cause',
					sysparm_query: 'parent_alertIN' + nonSecondaryAlerts.toString() + "^ORDERBYDESCsys_updated_on",
					sysparm_fields: 'root_cause_task,description,reasoning,parent_alert',
					sysparm_display_value: 'all'
				});
			} else {
				// console.log("%cCheck TableData isEqual: %o", "color:blue;font-size:12px;", isEqual(state.lastTableData, state.tableData));
				// console.log(state.lastTableData, "vs", state.tableData);
				updateState({lastTableData: state.tableData, isMainQueryRunning: false});
			}
		},
		'FETCH_PRC': createHttpEffect('/api/now/table/:table', {
			batch: false,
			method: 'GET',
			pathParams: ['table'],
			queryParams: ['sysparm_query', 'sysparm_fields', 'sysparm_display_value'],
			successActionType: 'FETCH_PRC_SUCCESS',
			errorActionType: 'QUERY_ERROR',
			cacheable: true
		}),
		'FETCH_PRC_SUCCESS': (coeffects) => {
			const { state, dispatch, updateState, action } = coeffects;
			console.log("FETCH_PRC_SUCCESS payload: ", action.payload);
			let updatedTableData = state.tableData;
			if (action.payload && action.payload.result) {
				updatedTableData.forEach(tableRow => {
					tableRow.prc = {display_value: "", value: "", label: "PRC"};
					action.payload.result.every(result => {
						if (result.parent_alert.value == tableRow.sys_id.value) {
							let value = "";
							if (result.root_cause_task.display_value) {
								value += result.root_cause_task.display_value + " -- ";
							}
							if (result.description.display_value) {
								value += result.description.display_value;
							}
							if (result.reasoning.display_value) {
								value += " -- " + result.reasoning.display_value;
							}
							tableRow.prc.display_value = value;
							tableRow.prc.value = value;
						}
						if (tableRow.prc.display_value && tableRow.prc.value) {
							return false;
						} else {
							return true;
						}
					});
				});
				// console.log("%cCheck TableData isEqual: %o", "color:blue;font-size:12px;", isEqual(state.lastTableData, state.tableData));
				// console.log(state.lastTableData, "vs", state.tableData);
				updateState({lastTableData: state.tableData, isMainQueryRunning: false, tableData: updatedTableData});
			}
		},
		'START_FETCH_AVATARS': (coeffects) => {
			const { dispatch, state } = coeffects;
			const avatarFields = ["assigned_to", "sys_created_by", "sys_updated_by"];
			let userArray = [];
			let avatarSysparm = "sys_idIN";
			state.tableData.forEach((tableRow) => {
				avatarFields.forEach((avatarField) => {
					if (tableRow[avatarField] && tableRow[avatarField].value != '' && !userArray.includes(tableRow[avatarField].value)) {
						userArray.push(tableRow[avatarField].value);
					}
				});
			});
			dispatch('FETCH_AVATARS', {
				sysparm_query: avatarSysparm + userArray.toString(),
				sysparm_fields: "sys_id,photo"
			});
		},
		'FETCH_AVATARS': createHttpEffect('api/now/table/sys_user', {
			method: 'GET',
			queryParams: ['sysparm_query', 'sysparm_fields'],
			successActionType: 'FETCH_AVATARS_SUCCESS',
			errorActionType: 'QUERY_ERROR',
			cacheable: true
		}),
		'FETCH_AVATARS_SUCCESS': (coeffects) => {
			const { action, state, dispatch, updateState } = coeffects;
			const avatarFields = ["assigned_to", "sys_created_by", "sys_updated_by"];
			console.log("FETCH_AVATARS_SUCCESS payload: ", action.payload);
			if (action.payload && action.payload.result) {
				let updatedTableData = state.tableData;
				action.payload.result.forEach((result) => {
					console.log("result: ", result);
					updatedTableData.forEach((tableRow) => {
						avatarFields.forEach((avatarField) => {
							if (tableRow[avatarField] && tableRow[avatarField].value == result.sys_id) {
								tableRow[avatarField].avatar = result.photo + ".iix";
							}
						})
					});
				});
				updateState({tableData: updatedTableData});
			}
			// updatedTableData.forEach((tableRow) => {
			// 	let matchingResult = result.find((field) => field.sys_id == tableRow.assigned_to.value);
			// 	if (matchingResult) {
			// 		tableRow.assigned_to.avatar = matchingResult.avatar + ".iix?t=small";
			// 	}
			// });

			dispatch('START_FETCH_APP_SERVICES');
		},
		// 'START_FETCH_TAGS': (coeffects) => {
		// 	const { dispatch, state, updateState } = coeffects;
		// 	let ciArray = [];
		// 	let sysparm = "configuration_itemIN"
		// 	state.tableData.forEach((tableRow) => {
		// 		if (tableRow.cmdb_ci && tableRow.cmdb_ci.value != "") {
		// 			ciArray.push(tableRow.cmdb_ci.value);
		// 		}
		// 	});
		// 	if (ciArray.length > 0) {
		// 		dispatch('FETCH_TAGS', {
		// 			table: 'cmdb_key_value',
		// 			sysparm_query: sysparm + ciArray.toString() + "^ORDERBYkey",
		// 			sysparm_fields: 'configuration_item,key,value',
		// 			sysparm_display_value: 'all'
		// 		});
		// 	} else {
		// 		updateState({dummyStateChange: !state.dummyStateChange, isMainQueryRunning: false});
		// 	}
		// },
		// 'FETCH_TAGS': createHttpEffect('/api/now/table/:table', {
		// 	method: 'GET',
		// 	pathParams: ['table'],
		// 	queryParams: ['sysparm_query', 'sysparm_fields', 'sysparm_display_value'],
		// 	successActionType: 'FETCH_TAGS_SUCCESS',
		// 	errorActionType: 'QUERY_ERROR',
		// 	cacheable: true
		// }),
		// 'FETCH_TAGS_SUCCESS': (coeffects) => {
		// 	const { dispatch, state, updateState, action } = coeffects;
		// 	console.log('FETCH_TAGS_SUCCESS');
		// 	console.log("payload: ", action.payload);
		// 	let updatedTableData = state.tableData;
		// 	updatedTableData.forEach((tableRow) => {
		// 		if (!tableRow.tags) {
		// 			tableRow.tags = [];
		// 		}
		// 		if (tableRow.additional_info && tableRow.additional_info.value) {
		// 			try {
		// 				let add_info = JSON.parse(tableRow.additional_info.value);
		// 				if (add_info.itom_tags) {
		// 					let itom_tag_keys = Object.keys(add_info.itom_tags);
		// 					itom_tag_keys.forEach((tag_key) => {
		// 						if (!tableRow.tags.find((tags) => tags.key == tag_key)) {
		// 							tableRow.tags.push({key: tag_key, value: add_info.itom_tags[tag_key]});
		// 						}
		// 					});
		// 				}
		// 			} catch (e) {

		// 			}
		// 		}
		// 		action.payload.result.map((result) => {
		// 			if (result.configuration_item.value == tableRow.cmdb_ci.value && tableRow.tags.filter((tag) => tag.key == result.key.display_value && tag.value == result.value.display_value).length == 0) {
		// 				tableRow.tags.push({key: result.key.display_value, value: result.value.display_value});
		// 			}
		// 		});
		// 		tableRow.tags.sort(sortTags);
		// 	});
		// 	let updatedTableOrder = state.tableOrder;
		// 	if (!updatedTableOrder.includes("tags")) {
		// 		updatedTableOrder.splice(updatedTableOrder.length - 1, 0, "tags");
		// 	}
		// 	updateState({tableData: updatedTableData, tableOrder: updatedTableOrder, dummyStateChange: !state.dummyStateChange, isMainQueryRunning: false});
		// },
		'FETCH_ALL_TABLE_COLUMNS': createHttpEffect('/api/now/table/:table', {
			batch: false,
			method: 'GET',
			pathParams: ['table'],
			queryParams: ['sysparm_query', 'sysparm_fields', 'sysparm_display_value'],
			successActionType: 'FETCH_ALL_TABLE_COLUMNS_SUCCESS',
			cacheable: true
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
			successActionType: 'FETCH_CHOICES_SUCCESS',
			cacheable: true
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
			updatedFilters.map((filter) => {
				encodedSysparm += `${filter.inputs.and_or.value}${filter.inputs.column.value}${filter.inputs.operator.value}${filter.inputs.value.value}`;
			});
			encodedSysparm += sortingArrayToString(state.sortingArray);
			dispatch('UPDATE_PAGE#PARAMETER', {params: {sysparm: encodedSysparm}});
			dispatch('REFRESH_MAIN_QUERY', {force: true});
		},
		'START_FETCH_ALERT_ACTIONS': (coeffects) => {
			const {action, dispatch} = coeffects;
			if (action.payload.value) {
				dispatch('FETCH_ALERT_ACTIONS', {
					retrieveLaunchApplications: true,
					retrieveRemediations: true,
					retrieveSubflows: true,
					alertId: action.payload.value
				});
			}
		},
		'FETCH_ALERT_ACTIONS': createHttpEffect('/api/now/em_actions/getManualActionsForAlert', {
			batch: false,
			method: 'GET',
			queryParams: ['retrieveLaunchApplications', 'retrieveRemediations', 'retrieveSubflows', 'alertId'],
			successActionType: 'FETCH_ALERT_ACTIONS_SUCCESS',
			cacheable: true
		}),
		'FETCH_ALERT_ACTIONS_SUCCESS': (coeffects) => {
			const {action, state, updateState} = coeffects;
			console.log("FETCH_ALERT_ACTIONS_SUCCESS payload: ", action.payload);
			if (action.payload && action.payload.result) {
				let newAlertActions = [];
				if (action.payload.result.toolsForAlert) {
					action.payload.result.toolsForAlert.forEach((alertActionEntry) => newAlertActions.push({display_value: alertActionEntry.displayName, value: alertActionEntry.url, type: "link"}));
				}
				if (action.payload.result.manualRemediationData) {
					action.payload.result.manualRemediationData.forEach((flowAction) => newAlertActions.push({display_value: flowAction.workflowName, value: flowAction, type: "flow"}));
				}
				updateState({alertActions: newAlertActions, dummyStateChange: !state.dummyStateChange});
			}
		},
		'START_FLOW': (coeffects) => {
			const { action, dispatch, state } = coeffects;
			console.log("START_FLOW: ", action.payload.value);
			dispatch('RUN_FLOW', {
				data: {
					subflow: action.payload.value.workflowId,
					inputs: {
						ah_alertgr: action.payload.value.alertSysId,
						ah_alertruleid: action.payload.value.rule,
						ah_alertrulename: action.payload.value.ruleName,
						//executionId: '',
						ah_userdisplayname: state.properties.currentUser.fullName,
						ah_username: state.properties.currentUser.userName
					}
				}
			});
		},
		'RUN_FLOW': createHttpEffect('/api/x_snc_optimiz_wo_0/workspaceflowcaller/start-subflow', {
			batch: false,
			method: 'POST',
			dataParam: 'data',
			successActionType: 'RUN_FLOW_SUCCESS',
			errorActionType: 'QUERY_ERROR',
			cacheable: true
		}),
		'RUN_FLOW_SUCCESS': (coeffects) => {
			const { action, dispatch } = coeffects;
			console.log("RUN_FLOW_SUCCESS payload: ", action.payload);
			if (action.payload && action.payload.result) {
				dispatch("SHOW_MESSAGE#MODAL", {header: 'Flow Action Outputs', content: JSON.stringify(action.payload.result)});
			}
		}
	},
	eventHandlers: [
		{
			events: ['contextmenu'],
			effect({state, updateState, dispatch, action: {payload: {event}}}) {
				event.preventDefault();
				console.log(event.path);
				console.log("contextmenu");
				console.log(event);
				let clickedRecordSysID = "0"
				let contextMenuTag = {};
				let contextMenuRecordIndex = 0;
				if (state.showContextMenu == false) {
					let clickedRecordElement = event.path.find((element) => element.id && element.id.includes("sys_id-"));
					console.log("clickedRecordElement: ", clickedRecordElement);
					if (clickedRecordElement) {
						clickedRecordSysID = clickedRecordElement.id.substring(clickedRecordElement.id.indexOf("-") + 1);
						if (state.properties.tableName == "em_alert") {
							dispatch("START_FETCH_ALERT_ACTIONS", {value: clickedRecordSysID});
						}
						let clickedRecordIndex = state.tableData.findIndex((tableRow) => tableRow.sys_id.value == clickedRecordSysID);
						if (clickedRecordIndex > -1) {
							contextMenuRecordIndex = clickedRecordIndex;

							let clickedTag = event.path.find((element) => element.id && element.id.includes("tagindex-"));
							if (clickedTag) {
								let clickedTagIndex = clickedTag.id.substring(clickedTag.id.indexOf("-") + 1);
								contextMenuTag = state.tableData[contextMenuRecordIndex].itom_tags[clickedTagIndex];
							}
						}
					}
					console.log('%cclickedRecordSysID: %o', 'color:green;font-size:12px;', clickedRecordSysID);
					console.log('%ccontextMenuRecordIndex: %o', 'color:green;font-size:12px;', contextMenuRecordIndex);

					// console.log("view innerWidth: ", event.view.innerWidth);
					// if ((event.view.innerWidth - event.clientX) > )

					updateState({showContextMenu: true, contextMenuLeft: event.x + "px", contextMenuTop: event.y - 140 + "px", contextMenuRecordIndex: contextMenuRecordIndex, contextMenuTag: contextMenuTag});
				} else {
					updateState({showContextMenu: false, contextMenuLeft: "0px", contextMenuTop: "0px", contextMenuRecordIndex: contextMenuRecordIndex, contextMenuTag: contextMenuTag});
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
