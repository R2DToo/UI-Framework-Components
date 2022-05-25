import {createCustomElement, actionTypes} from '@servicenow/ui-core';
const {COMPONENT_PROPERTY_CHANGED,COMPONENT_ERROR_THROWN,COMPONENT_BOOTSTRAPPED} = actionTypes;
import {createHttpEffect} from '@servicenow/ui-effect-http';
import snabbdom, {dangerouslyCreateElementFromString} from '@servicenow/ui-renderer-snabbdom';
import styles from './styles.scss';
import '@servicenow/now-icon';
import '@servicenow/now-highlighted-value';
import '@servicenow/now-rich-text';
import '@servicenow/now-avatar';

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
	{key: 'cisco', value: ciscoSVG},
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
	console.log('snc-alert-email-preview state: ', state);
	const ZOOM_LEVEL = '1.6'; // 1 = base level zoom

	const fireEvent = (event_name, value) => {
		console.log("%cFiring Event: " + event_name, "color:blue;font-size:20px;");
		console.log("%cEvent Payload: %o", "color:blue;font-size:20px;", value);
		dispatch(event_name, {
			value: value
		});
	};

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

	const calculateDial = (calculationIndex) => {
		let parentEventCount = 0;
		let childEventCount = 0;
		let parentRecordCount = 0;
		let childRecordCount = 0;
		let parentIncidentCount = 0;
		let childIncidentCount = 0;
		switch (calculationIndex) {
			case 0:
				state.parentRecord.forEach((record) => {
					if (record.source.display_value != "Group Alert") {
						parentEventCount += parseInt(record.event_count.value) || 0;
					}
				});
				state.secondaryRecords.forEach((record) => {
					childEventCount += parseInt(record.event_count.value) || 0;
				});
				if (childEventCount == 0 && state.parentRecord[0].group_source.value != 5 && state.parentRecord[0].group_source.value != 6) {
					return 0;
				}
				return Math.round((1 - (1/(parentEventCount + childEventCount))) * 100);
			case 1:
				if (state.secondaryRecords.length == 0) {
					return 0;
				}
				if (state.parentRecord.length > 0) {
					if (state.parentRecord[0].source.display_value != "Group Alert") {
						parentRecordCount = state.parentRecord.length;
					}
				}
				childRecordCount = state.secondaryRecords.length || 0;
				return Math.round((1 - (1/(parentRecordCount + childRecordCount))) * 100);
			case 2:
				if (state.parentRecord.length > 0) {
					if (state.parentRecord[0].source.display_value != "Group Alert") {
						parentRecordCount = state.parentRecord.length;
					}
				}
				childRecordCount = state.secondaryRecords.length || 0;
				state.parentRecord.forEach((record) => {
					if (record.source.display_value != "Group Alert") {
						parentIncidentCount += record.incident.value != "" ? 1 : 0;
					}
				});
				state.secondaryRecords.forEach((record) => {
					childIncidentCount += record.incident.value != "" ? 1 : 0;
				});
				return Math.round(((parentIncidentCount + childIncidentCount) / (parentRecordCount + childRecordCount)) * 100);
			default: return 0;
		}
	}

	const workNoteComponent = (work_notes) => {
		let systemNotes = work_notes.filter((work_note) => {
			return work_note.sys_created_by.value == "system" || work_note.sys_created_by.value == "admin";
		});
		let userNotes = work_notes.filter((work_note) => {
			return work_note.sys_created_by.value != "system" && work_note.sys_created_by.value != "admin";
		});
		console.log("system notes: ", systemNotes);
		console.log("user notes: ", userNotes);
		return (
			<div className="work-notes">
				{userNotes.length > 0 && <div className="work-notes-header"><svg attrs={{class: "g-icon", xmlns: "http://www.w3.org/2000/svg", height: "24px", width: "24px", viewBox: "0 0 24 24"}}><path attr-d="M0 0h24v24H0V0z" attr-fill="none"/><path attr-d="M15 4v7H5.17l-.59.59-.58.58V4h11m1-2H3c-.55 0-1 .45-1 1v14l4-4h10c.55 0 1-.45 1-1V3c0-.55-.45-1-1-1zm5 4h-2v9H6v2c0 .55.45 1 1 1h11l4 4V7c0-.55-.45-1-1-1z"/></svg>&nbsp;&nbsp;Collaboration</div>}
				{userNotes.map((note) =>
					<div className="work-note">
						<div className="work-note-content">
							<div>
								<now-avatar className="work-note-avatar" size="md" user-name={note.sys_created_by.display_value} image-src={note.sys_created_by.avatar}/>
							</div>
							<div className="work-note-text">
								<div className="work-note-header">
									<div className="work-note-relative-time">
										<svg attrs={{class: "g-icon", xmlns: "http://www.w3.org/2000/svg", height: "24px", width: "24px", viewBox: "0 0 24 24", 'enable-background': "new 0 0 24 24"}}><path attr-d="M0 0h24v24H0V0z" attr-fill="none"/><path attr-d="M14.31 2l.41 2.48C13.87 4.17 12.96 4 12 4c-.95 0-1.87.17-2.71.47L9.7 2h4.61m.41 17.52L14.31 22H9.7l-.41-2.47c.84.3 1.76.47 2.71.47.96 0 1.87-.17 2.72-.48M16 0H8l-.95 5.73C5.19 7.19 4 9.45 4 12s1.19 4.81 3.05 6.27L8 24h8l.96-5.73C18.81 16.81 20 14.54 20 12s-1.19-4.81-3.04-6.27L16 0zm-4 18c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z"/></svg>
										&nbsp;{makeRelativeTime(note.sys_created_on.display_value)}
									</div>
									<div>
										{note.sys_created_on.display_value}
									</div>
								</div>
								<now-rich-text html={note.value.display_value}/>
							</div>
						</div>
					</div>
				)}
				{systemNotes.length > 0 && <div className="work-notes-header"><svg attrs={{class: "g-icon", xmlns: "http://www.w3.org/2000/svg", height: "24px", width: "24px", viewBox: "0 0 24 24"}}><path attr-d="M0 0h24v24H0V0z" attr-fill="none"/><path attr-d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.61 5.64 5.36 8.04 2.35 8.36 0 10.9 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM19 18H6c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4h2c0-2.76-1.86-5.08-4.4-5.78C8.61 6.88 10.2 6 12 6c3.03 0 5.5 2.47 5.5 5.5v.5H19c1.65 0 3 1.35 3 3s-1.35 3-3 3z"/></svg>&nbsp;&nbsp;System</div>}
				{systemNotes.map((note) =>
					<div className="work-note">
						<div className="work-note-content">
							<div>
								<now-avatar className="work-note-avatar" size="md" user-name={note.sys_created_by.display_value} image-src={note.sys_created_by.avatar}/>
							</div>
							<div className="work-note-text">
								<div className="work-note-header">
									<div className="work-note-relative-time">
										<svg attrs={{class: "g-icon", xmlns: "http://www.w3.org/2000/svg", height: "24px", width: "24px", viewBox: "0 0 24 24", 'enable-background': "new 0 0 24 24"}}><path attr-d="M0 0h24v24H0V0z" attr-fill="none"/><path attr-d="M14.31 2l.41 2.48C13.87 4.17 12.96 4 12 4c-.95 0-1.87.17-2.71.47L9.7 2h4.61m.41 17.52L14.31 22H9.7l-.41-2.47c.84.3 1.76.47 2.71.47.96 0 1.87-.17 2.72-.48M16 0H8l-.95 5.73C5.19 7.19 4 9.45 4 12s1.19 4.81 3.05 6.27L8 24h8l.96-5.73C18.81 16.81 20 14.54 20 12s-1.19-4.81-3.04-6.27L16 0zm-4 18c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z"/></svg>
										&nbsp;{makeRelativeTime(note.sys_created_on.display_value)}
									</div>
									<div>
										{note.sys_created_on.display_value}
									</div>
								</div>
								<now-rich-text html={note.value.display_value}/>
							</div>
						</div>
					</div>
				)}
			</div>
		)
	};

	const imageZoomMouseOver = (index, isParent) => {
		console.log('imageZoomMouseOver');
		if (isParent) {
			let updatedParentRecord = state.parentRecord;
			updatedParentRecord[index].snapshotImage.scale = ZOOM_LEVEL;
			updateState({parentRecord: updatedParentRecord, dummyStateChange: !state.dummyStateChange});
		} else {
			let updatedSecondaryRecords = state.secondaryRecords;
			updatedSecondaryRecords[index].snapshotImage.scale = ZOOM_LEVEL;
			updateState({secondaryRecords: updatedSecondaryRecords, dummyStateChange: !state.dummyStateChange});
		}
	};

	const imageZoomMouseOut = (index, isParent) => {
		console.log('imageZoomMouseOut');
		if (isParent) {
			let updatedParentRecord = state.parentRecord;
			updatedParentRecord[index].snapshotImage.scale = 1;
			updateState({parentRecord: updatedParentRecord, dummyStateChange: !state.dummyStateChange});
		} else {
			let updatedSecondaryRecords = state.secondaryRecords;
			updatedSecondaryRecords[index].snapshotImage.scale = 1;
			updateState({secondaryRecords: updatedSecondaryRecords, dummyStateChange: !state.dummyStateChange});
		}
	};

	const imageZoomMouseMove = (event, index, isParent) => {
		console.log('imageZoomMouseMove event: ', event);
		//let imageElement = event.path[0];
		let imageWrapperElement = event.path[1];
		let rect = imageWrapperElement.getBoundingClientRect();
		if (isParent) {
			let updatedParentRecord = state.parentRecord;
			updatedParentRecord[index].snapshotImage.transform_origin = ((event.clientX - rect.left) / imageWrapperElement.offsetWidth) * 100 + '% ' + ((event.clientY - rect.top) / imageWrapperElement.offsetHeight) * 100 + '%';
			updateState({parentRecord: updatedParentRecord, dummyStateChange: !state.dummyStateChange});
		} else {
			let updatedSecondaryRecords = state.secondaryRecords;
			updatedSecondaryRecords[index].snapshotImage.transform_origin = ((event.clientX - rect.left) / imageWrapperElement.offsetWidth) * 100 + '% ' + ((event.clientY - rect.top) / imageWrapperElement.offsetHeight) * 100 + '%';
			updateState({secondaryRecords: updatedSecondaryRecords, dummyStateChange: !state.dummyStateChange});
		}
	};

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

	return (
		<div id="info-container">
			<div id="info-header">
				<div>
					<h1><now-rich-text title="Close Preview" className="g-icon primary-color" onclick={() => {dispatch("CLOSE_INFO_BUTTON#CLICKED")}} html='<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px"><path d="M0 0h24v24H0V0zm0 0h24v24H0V0zm0 0h24v24H0V0zm0 0h24v24H0V0z" fill="none"/><path d="M12 6c3.79 0 7.17 2.13 8.82 5.5-.59 1.22-1.42 2.27-2.41 3.12l1.41 1.41c1.39-1.23 2.49-2.77 3.18-4.53C21.27 7.11 17 4 12 4c-1.27 0-2.49.2-3.64.57l1.65 1.65C10.66 6.09 11.32 6 12 6zm-1.07 1.14L13 9.21c.57.25 1.03.71 1.28 1.28l2.07 2.07c.08-.34.14-.7.14-1.07C16.5 9.01 14.48 7 12 7c-.37 0-.72.05-1.07.14zM2.01 3.87l2.68 2.68C3.06 7.83 1.77 9.53 1 11.5 2.73 15.89 7 19 12 19c1.52 0 2.98-.29 4.32-.82l3.42 3.42 1.41-1.41L3.42 2.45 2.01 3.87zm7.5 7.5l2.61 2.61c-.04.01-.08.02-.12.02-1.38 0-2.5-1.12-2.5-2.5 0-.05.01-.08.01-.13zm-3.4-3.4l1.75 1.75c-.23.55-.36 1.15-.36 1.78 0 2.48 2.02 4.5 4.5 4.5.63 0 1.23-.13 1.77-.36l.98.98c-.88.24-1.8.38-2.75.38-3.79 0-7.17-2.13-8.82-5.5.7-1.43 1.72-2.61 2.93-3.53z"/></svg>'/> 360&#176; View</h1>
					<div className="inline-header">Secondary Alerts <div className="circle-tag big">{state.secondaryRecords.length}</div></div>
					{state.parentRecord[0] && <div className="inline-header-2">{state.parentRecord[0].u_tbac_reasoning.display_value}</div>}
					{state.parentRecord && state.parentRecord[0] && state.parentRecord[0].group_source && state.parentRecord[0].group_source.display_value && <div className="inline-header-2">{state.parentRecord[0].group_source.display_value}</div>}
				</div>
				<div id="right-side">
					<div className="dials-container">
						<div className="dial">
							<div title="Noise Reduction" className={`green progress-radial progress-${calculateDial(0)}`}><b></b></div>
							<div className="dial-description">NR</div>
						</div>
						<div className="dial">
							<div title="Alert Compression" className={`orange progress-radial progress-${calculateDial(1)}`}><b></b></div>
							<div className="dial-description">AC</div>
						</div>
						<div className="dial">
							<div title="Incident Reduction" className={`yellow progress-radial progress-${calculateDial(2)}`}><b></b></div>
							<div className="dial-description">IR</div>
						</div>
					</div>
					<now-rich-text title="Open Timeline" className="g-icon primary-color" onclick={() => {fireEvent("OPEN_TIMELINE_BUTTON#CLICKED", {parentRecord: state.parentRecord, secondaryRecords: state.secondaryRecords})}} html='<svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24px" viewBox="0 0 24 24" width="24px"><g><rect fill="none" height="24" width="24"/></g><g><g><rect height="2" width="6" x="6" y="15"/><rect height="2" width="6" x="12" y="7"/><rect height="2" width="6" x="9" y="11"/><path d="M19,3H5C3.9,3,3,3.9,3,5v14c0,1.1,0.9,2,2,2h14c1.1,0,2-0.9,2-2V5C21,3.9,20.1,3,19,3z M19,19H5V5h14V19z"/></g></g></svg>'/>
				</div>
			</div>
			<div id="cards-header">
				<div className="tabset">
					<input type="radio" name="tabset" id="tab0" aria-controls="alerts" checked onchange={() => {updateState({activeTabIndex: 0})}}/>
					<label for="tab0">Alerts</label>
					<input type="radio" name="tabset" id="tab1" aria-controls="activity" onchange={() => {updateState({activeTabIndex: 1})}}/>
					<label for="tab1">Activity</label>
					<input type="radio" name="tabset" id="tab4" aria-controls="prc" onchange={() => {updateState({activeTabIndex: 4})}}/>
					<label for="tab4">PRC</label>
					<input type="radio" name="tabset" id="tab2" aria-controls="tags" onchange={() => {updateState({activeTabIndex: 2})}}/>
					<label for="tab2">Tags</label>
					<input type="radio" name="tabset" id="tab3" aria-controls="additional" onchange={() => {updateState({activeTabIndex: 3})}}/>
					<label for="tab3">Additional</label>
				</div>
			</div>
			<div id="info-cards">
				<ul>
					{state.activeTabIndex == 4 && state.parentRecord[0] && state.parentRecord[0].prc && state.parentRecord[0].prc.map((prc) => {
						let record = state.parentRecord[0];
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
							<li className="info-card">
								<div className="card-header">
									<div className="record-link" title="Open Record" onclick={() => {dispatch("RECORD_LINK#CLICKED", {table: 'em_alert', sys_id: record.sys_id.value})}}>{record.number.display_value}</div>
									<div className="right"><now-rich-text className="g-icon" html='<svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="18px" viewBox="0 0 24 24" width="18px"><g><rect fill="none" height="24" width="24"/><path d="M20,6h-8l-2-2H4C2.9,4,2.01,4.9,2.01,6L2,18c0,1.1,0.9,2,2,2h16c1.1,0,2-0.9,2-2V8C22,6.9,21.1,6,20,6z M20,18L4,18V6h5.17 l2,2H20V18z M18,12H6v-2h12V12z M14,16H6v-2h8V16z"/></g></svg>'/> {record.source.display_value}</div>
									<div className=""><now-highlighted-value label={record.severity.display_value} color={color} variant="secondary"/></div>
									<div className="right"><now-rich-text className="g-icon" html='<svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="18px" viewBox="0 0 24 24" width="18px"><g><rect fill="none" height="24" width="24"/></g><g><g><path d="M11,8.75v3.68c0,0.35,0.19,0.68,0.49,0.86l3.12,1.85c0.36,0.21,0.82,0.09,1.03-0.26c0.21-0.36,0.1-0.82-0.26-1.03 l-2.87-1.71v-3.4C12.5,8.34,12.16,8,11.75,8S11,8.34,11,8.75z M21,9.5V4.21c0-0.45-0.54-0.67-0.85-0.35l-1.78,1.78 c-1.81-1.81-4.39-2.85-7.21-2.6c-4.19,0.38-7.64,3.75-8.1,7.94C2.46,16.4,6.69,21,12,21c4.59,0,8.38-3.44,8.93-7.88 c0.07-0.6-0.4-1.12-1-1.12c-0.5,0-0.92,0.37-0.98,0.86c-0.43,3.49-3.44,6.19-7.05,6.14c-3.71-0.05-6.84-3.18-6.9-6.9 C4.94,8.2,8.11,5,12,5c1.93,0,3.68,0.79,4.95,2.05l-2.09,2.09C14.54,9.46,14.76,10,15.21,10h5.29C20.78,10,21,9.78,21,9.5z"/></g></g></svg>'/> {makeRelativeTime(record.sys_updated_on.display_value)}</div>
								</div>
								<div className="card-body">
									<p className="description"><now-rich-text className="g-icon" html='<svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 0 24 24" width="18px"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M13 17H5c-.55 0-1 .45-1 1s.45 1 1 1h8c.55 0 1-.45 1-1s-.45-1-1-1zm6-8H5c-.55 0-1 .45-1 1s.45 1 1 1h14c.55 0 1-.45 1-1s-.45-1-1-1zM5 15h14c.55 0 1-.45 1-1s-.45-1-1-1H5c-.55 0-1 .45-1 1s.45 1 1 1zM4 6c0 .55.45 1 1 1h14c.55 0 1-.45 1-1s-.45-1-1-1H5c-.55 0-1 .45-1 1z"/></svg>' /> <span className="">{record.description.display_value}</span></p>
									<p className="prc-key-value">
										<svg attrs={{class: "g-icon", xmlns: "http://www.w3.org/2000/svg", height: "24px", width: "24px", viewBox: "0 0 24 24", 'enable-background': "new 0 0 24 24"}}><g><rect attr-fill="none" attr-height="24" attr-width="24"/></g><g><path attr-d="M14.5,2.5c0,1.5-1.5,6-1.5,6h-2c0,0-1.5-4.5-1.5-6C9.5,1.12,10.62,0,12,0S14.5,1.12,14.5,2.5z M12,10c-1.1,0-2,0.9-2,2 s0.9,2,2,2s2-0.9,2-2S13.1,10,12,10z M16.08,5.11c0.18-0.75,0.33-1.47,0.39-2.06C19.75,4.69,22,8.08,22,12c0,5.52-4.48,10-10,10 S2,17.52,2,12c0-3.92,2.25-7.31,5.53-8.95C7.6,3.64,7.74,4.37,7.92,5.11C5.58,6.51,4,9.07,4,12c0,4.42,3.58,8,8,8s8-3.58,8-8 C20,9.07,18.42,6.51,16.08,5.11z M18,12c0,3.31-2.69,6-6,6s-6-2.69-6-6c0-2,0.98-3.77,2.48-4.86c0.23,0.81,0.65,2.07,0.65,2.07 C8.43,9.93,8,10.92,8,12c0,2.21,1.79,4,4,4s4-1.79,4-4c0-1.08-0.43-2.07-1.13-2.79c0,0,0.41-1.22,0.65-2.07C17.02,8.23,18,10,18,12 z"/></g></svg>
										<span className="key">&nbsp;Score:&nbsp;&nbsp;</span><span className="circle-tag">{prc.score.display_value}</span>
									</p>
									<p className="prc-key-value">
										<svg attrs={{class: "g-icon", xmlns: "http://www.w3.org/2000/svg", height: "24px", width: "24px", viewBox: "0 0 24 24", 'enable-background': "new 0 0 24 24"}}><rect attr-fill="none" attr-height="24" attr-width="24" attr-y="0"/><path attr-d="M7,20h4c0,1.1-0.9,2-2,2S7,21.1,7,20z M5,19h8v-2H5V19z M16.5,9.5c0,3.82-2.66,5.86-3.77,6.5H5.27 C4.16,15.36,1.5,13.32,1.5,9.5C1.5,5.36,4.86,2,9,2S16.5,5.36,16.5,9.5z M14.5,9.5C14.5,6.47,12.03,4,9,4S3.5,6.47,3.5,9.5 c0,2.47,1.49,3.89,2.35,4.5h6.3C13.01,13.39,14.5,11.97,14.5,9.5z M21.37,7.37L20,8l1.37,0.63L22,10l0.63-1.37L24,8l-1.37-0.63L22,6 L21.37,7.37z M19,6l0.94-2.06L22,3l-2.06-0.94L19,0l-0.94,2.06L16,3l2.06,0.94L19,6z"/></svg>
										<span className="key">&nbsp;Type:&nbsp;&nbsp;</span><span>{prc.type.display_value}</span>
									</p>
									<p className="prc-key-value">
										<svg attrs={{class: "g-icon", xmlns: "http://www.w3.org/2000/svg", height: "24px", width: "24px", viewBox: "0 0 24 24"}}><path attr-d="M0 0h24v24H0V0z" attr-fill="none"/><path attr-d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3c-.46-4.17-3.77-7.48-7.94-7.94V1h-2v2.06C6.83 3.52 3.52 6.83 3.06 11H1v2h2.06c.46 4.17 3.77 7.48 7.94 7.94V23h2v-2.06c4.17-.46 7.48-3.77 7.94-7.94H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"/></svg>
										<span className="key">&nbsp;Root Cause Task:&nbsp;&nbsp;</span><span className="record-link" onclick={() => {dispatch("RECORD_LINK_CMDB_CI#CLICKED", {value: `/now/optimiz-workspace/record/em_alert/${record.sys_id.value}/sub/record/change_request/${prc.root_cause_task.value}`})}}>{prc.root_cause_task.display_value}</span>
									</p>
									<p className="prc-key-value">
										<svg attrs={{class: "g-icon", xmlns: "http://www.w3.org/2000/svg", height: "24px", width: "24px", viewBox: "0 0 24 24"}}><path attr-d="M0 0h24v24H0V0z" attr-fill="none"/><path attr-d="M8 16h8v2H8zm0-4h8v2H8zm6-10H6c-1.1 0-2 .9-2 2v16c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11z"/></svg>
										<span className="key">&nbsp;Description:&nbsp;&nbsp;</span><span>{prc.description.display_value}</span>
									</p>
									<p className="prc-key-value">
										<svg attrs={{class: "g-icon", xmlns: "http://www.w3.org/2000/svg", height: "24px", width: "24px", viewBox: "0 0 24 24", 'enable-background': "new 0 0 24 24"}}><g><rect attr-fill="none" attr-height="24" attr-width="24"/></g><g><g><path attr-d="M23,11.99l-2.44-2.79l0.34-3.69l-3.61-0.82L15.4,1.5L12,2.96L8.6,1.5L6.71,4.69L3.1,5.5L3.44,9.2L1,11.99l2.44,2.79 l-0.34,3.7l3.61,0.82L8.6,22.5l3.4-1.47l3.4,1.46l1.89-3.19l3.61-0.82l-0.34-3.69L23,11.99z M19.05,13.47l-0.56,0.65l0.08,0.85 l0.18,1.95l-1.9,0.43l-0.84,0.19l-0.44,0.74l-0.99,1.68l-1.78-0.77L12,18.85l-0.79,0.34l-1.78,0.77l-0.99-1.67l-0.44-0.74 l-0.84-0.19l-1.9-0.43l0.18-1.96l0.08-0.85l-0.56-0.65l-1.29-1.47l1.29-1.48l0.56-0.65L5.43,9.01L5.25,7.07l1.9-0.43l0.84-0.19 l0.44-0.74l0.99-1.68l1.78,0.77L12,5.14l0.79-0.34l1.78-0.77l0.99,1.68l0.44,0.74l0.84,0.19l1.9,0.43l-0.18,1.95l-0.08,0.85 l0.56,0.65l1.29,1.47L19.05,13.47z"/><polygon attr-points="10.09,13.75 7.77,11.42 6.29,12.91 10.09,16.72 17.43,9.36 15.95,7.87"/></g></g></svg>
										<span className="key">&nbsp;Reasoning:&nbsp;&nbsp;</span><span>{prc.reasoning.display_value}</span>
									</p>
								</div>
							</li>
						)
					})}
					{state.activeTabIndex != 4 && state.parentRecord.map((record, index) => {
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
							<li className="info-card">
								<div className="card-header">
									<div className="card-header-column">
										<div className="record-link" title="Open Record" onclick={() => {dispatch("RECORD_LINK#CLICKED", {table: 'em_alert', sys_id: record.sys_id.value})}}>{record.number.display_value}</div>
										<div className=""><now-highlighted-value label={record.severity.display_value} color={color} variant="secondary"/></div>
									</div>
									<img className="card-header-image" src={record.source_icon.value}/>
								</div>
								{/* <div className="card-header">
									<div className="record-link" title="Open Record" onclick={() => {dispatch("RECORD_LINK#CLICKED", {table: 'em_alert', sys_id: record.sys_id.value})}}>{record.number.display_value}</div>
									<div className="right"><now-rich-text className="g-icon" html='<svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="18px" viewBox="0 0 24 24" width="18px"><g><rect fill="none" height="24" width="24"/><path d="M20,6h-8l-2-2H4C2.9,4,2.01,4.9,2.01,6L2,18c0,1.1,0.9,2,2,2h16c1.1,0,2-0.9,2-2V8C22,6.9,21.1,6,20,6z M20,18L4,18V6h5.17 l2,2H20V18z M18,12H6v-2h12V12z M14,16H6v-2h8V16z"/></g></svg>'/> {record.source.display_value}</div>
									<div className=""><now-highlighted-value label={record.severity.display_value} color={color} variant="secondary"/></div>
									<div className="right"><now-rich-text className="g-icon" html='<svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="18px" viewBox="0 0 24 24" width="18px"><g><rect fill="none" height="24" width="24"/></g><g><g><path d="M11,8.75v3.68c0,0.35,0.19,0.68,0.49,0.86l3.12,1.85c0.36,0.21,0.82,0.09,1.03-0.26c0.21-0.36,0.1-0.82-0.26-1.03 l-2.87-1.71v-3.4C12.5,8.34,12.16,8,11.75,8S11,8.34,11,8.75z M21,9.5V4.21c0-0.45-0.54-0.67-0.85-0.35l-1.78,1.78 c-1.81-1.81-4.39-2.85-7.21-2.6c-4.19,0.38-7.64,3.75-8.1,7.94C2.46,16.4,6.69,21,12,21c4.59,0,8.38-3.44,8.93-7.88 c0.07-0.6-0.4-1.12-1-1.12c-0.5,0-0.92,0.37-0.98,0.86c-0.43,3.49-3.44,6.19-7.05,6.14c-3.71-0.05-6.84-3.18-6.9-6.9 C4.94,8.2,8.11,5,12,5c1.93,0,3.68,0.79,4.95,2.05l-2.09,2.09C14.54,9.46,14.76,10,15.21,10h5.29C20.78,10,21,9.78,21,9.5z"/></g></g></svg>'/> {makeRelativeTime(record.sys_updated_on.display_value)}</div>
								</div> */}
								{state.activeTabIndex == 0 && (
									<div className="card-body alerts">
										<p className="description"><now-rich-text className="g-icon" html='<svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 0 24 24" width="18px"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M13 17H5c-.55 0-1 .45-1 1s.45 1 1 1h8c.55 0 1-.45 1-1s-.45-1-1-1zm6-8H5c-.55 0-1 .45-1 1s.45 1 1 1h14c.55 0 1-.45 1-1s-.45-1-1-1zM5 15h14c.55 0 1-.45 1-1s-.45-1-1-1H5c-.55 0-1 .45-1 1s.45 1 1 1zM4 6c0 .55.45 1 1 1h14c.55 0 1-.45 1-1s-.45-1-1-1H5c-.55 0-1 .45-1 1z"/></svg>' /> <span className="">{record.description.display_value}</span></p>
										<div className="card-row">
											<div className="card-column">
												<p><span className="key">Source: </span> <span className="">{record.source.display_value}</span></p>
												<p onclick={() => {dispatch("RECORD_LINK_CMDB_CI#CLICKED", {value: `/now/cmdb/record/${record['cmdb_ci.sys_class_name'].value}/${record.cmdb_ci.value}`})}}><span className="key">CI:</span> <span className="underline-record-link">{record.cmdb_ci.display_value}</span></p>
												<p><span className="key">Group:</span> <span className="">{record.group_source.display_value}</span></p>
												<p><span className="key">Type:</span> <span className="">{record.type.display_value}</span></p>
												<p><span className="key">Incident:</span> <span class={{'record-link': record.incident.value != ""}} onclick={() => {dispatch("RECORD_SUB_LINK#CLICKED", {table: 'em_alert', sys_id: record.sys_id.value, subrecord_table: 'task', subrecord_sys_id: record.incident.value})}}>{record.incident.display_value}</span></p>
												<p><span className="key">Node:</span> <span className="">{record.node.display_value}</span></p>
												<p><span className="key">Created:</span> <span className="">{record.sys_created_on.display_value}</span></p>
												<p><span className="key">Event Count:</span> <div className="circle-tag">{record.event_count.display_value}</div></p>
												<p><span className="key">Message Key:</span> <span className="">{record.message_key.display_value}</span></p>
											</div>
											<div className="card-column">
												<p><span className="key">Updated:</span> <span className="">{makeRelativeTime(record.sys_updated_on.display_value)}</span></p>
												<p><span className="key">CI Class:</span> <span className="">{record['cmdb_ci.sys_class_name'].display_value}</span></p>
												<p><span className="key">State:</span> <span class={{green: record.state.display_value == "Open"}}>{record.state.display_value}</span></p>
												<p><span className="key">Resource:</span> <span className="">{record.resource.display_value}</span></p>
												<p><span className="key">Task AG:</span> <span className="">{record['incident.assignment_group'].display_value}</span></p>
												<p><span className="key">Assigned To:</span> <span className="">{record.assigned_to.display_value}</span></p>
												<p><span className="key">Updated:</span> <span className="">{record.sys_updated_on.display_value}</span></p>
												{/* onclick={() => {dispatch("RECORD_LINK_CMDB_CI#CLICKED", {value: record.u_repeated_alerts.url})}} */}
												<p className="align-items-center"><span className="key">Repeated Alerts:</span> <div className="circle-tag secondary" onclick={() => {dispatch("RECORD_LINK_CMDB_CI#CLICKED", {value: record.u_repeated_alerts.url})}}>{record.u_repeated_alerts ? shortNumFormat(record.u_repeated_alerts.value) : '0'}</div> <svg onclick={() => {dispatch("RECORD_LINK_CMDB_CI#CLICKED", {value: record.u_repeated_alerts.url})}} attrs={{class: "g-icon", xmlns: "http://www.w3.org/2000/svg", height: "24", width: "24"}}><path attr-d="M20.5 12.375V18.7Q20.5 19.45 19.975 19.975Q19.45 20.5 18.7 20.5H5.3Q4.55 20.5 4.025 19.975Q3.5 19.45 3.5 18.7V5.3Q3.5 4.55 4.025 4.025Q4.55 3.5 5.3 3.5H11.625V5H5.3Q5.2 5 5.1 5.1Q5 5.2 5 5.3V18.7Q5 18.8 5.1 18.9Q5.2 19 5.3 19H18.7Q18.8 19 18.9 18.9Q19 18.8 19 18.7V12.375ZM9.725 15.325 8.675 14.275 17.95 5H14V3.5H20.5V10H19V6.05Z"/></svg> <span className="">{record.temp_uniqueness.display_value}</span></p>
												<p><span className="key">Acknowledged:</span> <span className="">{record.acknowledged.display_value}</span></p>
											</div>
										</div>
										<div className="card-center">
											{record.snapshotImage && <div className="card-image-wrapper">
												<div
													className="card-image"
													style={{'background-image': `url(${record.snapshotImage.display_value})`, transform: `scale(${record.snapshotImage.scale})`, 'transform-origin': record.snapshotImage.transform_origin}}
													onmouseover={() => {imageZoomMouseOver(index, true)}}
													onmouseout={() => {imageZoomMouseOut(index, true)}}
													onmousemove={(e) => {imageZoomMouseMove(e, index, true)}}
												></div>
											</div>}
											{/* {record.snapshotImage && <img
												className="card-image"
												onmouseover={() => imageZoomMouseOver(index, true)}
												onmouseout={() => imageZoomMouseOut(index, true)}
												src={record.snapshotImage.display_value}
												style={{transform: `scale(${record.snapshotImage.scale})`}}
											></img>} */}
										</div>
									</div>
								)}
								{state.activeTabIndex == 1 && (
									<div className="card-body">
										<p className="description"><now-rich-text className="g-icon" html='<svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 0 24 24" width="18px"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M13 17H5c-.55 0-1 .45-1 1s.45 1 1 1h8c.55 0 1-.45 1-1s-.45-1-1-1zm6-8H5c-.55 0-1 .45-1 1s.45 1 1 1h14c.55 0 1-.45 1-1s-.45-1-1-1zM5 15h14c.55 0 1-.45 1-1s-.45-1-1-1H5c-.55 0-1 .45-1 1s.45 1 1 1zM4 6c0 .55.45 1 1 1h14c.55 0 1-.45 1-1s-.45-1-1-1H5c-.55 0-1 .45-1 1z"/></svg>' /> <span className="">{record.description.display_value}</span></p>
										{workNoteComponent(record.work_notes || [])}
										{/* {record.work_notes && record.work_notes.map((note) =>
											<p>
												<now-avatar className="" size="sm" user-name={note.sys_created_by.display_value} image-src={note.sys_created_by.avatar}/>
												<now-rich-text html={note.value.display_value}/>
												<br/><now-rich-text className="g-icon" html='<svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 20 20" height="18px" viewBox="0 0 20 20" width="18px"><g><rect fill="none" height="20" width="20"/></g><g><g><path d="M8.5,8.53v3.24c0,0.18,0.09,0.34,0.24,0.43l2.52,1.51c0.23,0.14,0.52,0.06,0.66-0.16l0,0c0.14-0.23,0.06-0.53-0.16-0.66 L9.5,11.55V8.53c0-0.26-0.21-0.48-0.48-0.48H8.98C8.71,8.05,8.5,8.26,8.5,8.53z"/><path d="M13.9,10c0.07,0.32,0.1,0.66,0.1,1c0,2.76-2.24,5-5,5s-5-2.24-5-5s2.24-5,5-5c0.71,0,1.39,0.15,2,0.42V5.35 C10.37,5.13,9.7,5,9,5c-3.31,0-6,2.69-6,6s2.69,6,6,6s6-2.69,6-6c0-0.34-0.04-0.67-0.09-1H13.9z"/><path d="M15,6V4.5C15,4.22,14.78,4,14.5,4h0C14.22,4,14,4.22,14,4.5V6h0h-1.5C12.22,6,12,6.22,12,6.5v0C12,6.78,12.22,7,12.5,7H14 v1.5C14,8.78,14.22,9,14.5,9h0C14.78,9,15,8.78,15,8.5V7v0h1.5C16.78,7,17,6.78,17,6.5v0C17,6.22,16.78,6,16.5,6H15z"/></g></g></svg>'/> {note.sys_created_on.display_value}
											</p>
										)} */}
									</div>
								)}
								{state.activeTabIndex == 2 && (
									<div className="card-body">
										<p className="description"><now-rich-text className="g-icon" html='<svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 0 24 24" width="18px"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M13 17H5c-.55 0-1 .45-1 1s.45 1 1 1h8c.55 0 1-.45 1-1s-.45-1-1-1zm6-8H5c-.55 0-1 .45-1 1s.45 1 1 1h14c.55 0 1-.45 1-1s-.45-1-1-1zM5 15h14c.55 0 1-.45 1-1s-.45-1-1-1H5c-.55 0-1 .45-1 1s.45 1 1 1zM4 6c0 .55.45 1 1 1h14c.55 0 1-.45 1-1s-.45-1-1-1H5c-.55 0-1 .45-1 1z"/></svg>' /> <span className="">{record.description.display_value}</span></p>
										<div className="tags-title">
											<svg attrs={{class: "g-icon", xmlns: "http://www.w3.org/2000/svg", height: "24px", width: "24px", viewBox: "0 0 24 24"}}><path attr-d="M0 0h24v24H0V0z" attr-fill="none"/><path attr-d="M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58s1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41s-.23-1.06-.59-1.42zM13 20.01L4 11V4h7v-.01l9 9-7 7.02z"/><circle attr-cx="6.5" attr-cy="6.5" attr-r="1.5"/></svg>
											&nbsp;&nbsp;Alert Tags (normalized):
										</div>
										<div className="tags">
											{record.tags && record.tags.length > 0 ? record.tags.filter((tag) => tag.type == "itom_tags").map((tag) =>
												<div className="broker-tag"><span className="tag-key">{tag.key}:</span> {tag.value}</div>
											):
												<div className="broker-tag"><span className="tag-key">No Tags</span></div>
											}
										</div>
										<div className="tags-title">
											<svg attrs={{class: "g-icon green", xmlns: "http://www.w3.org/2000/svg", height: "24px", width: "24px", viewBox: "0 0 24 24"}}><path attr-d="M0 0h24v24H0V0z" attr-fill="none"/><path attr-d="M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58s1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41s-.23-1.06-.59-1.42zM13 20.01L4 11V4h7v-.01l9 9-7 7.02z"/><circle attr-cx="6.5" attr-cy="6.5" attr-r="1.5"/></svg>
											&nbsp;&nbsp;CI Tags ({record.cmdb_ci.display_value}):
										</div>
										<div className="tags">
											{record.tags && record.tags.length > 0 ? record.tags.filter((tag) => tag.type == "ci").map((tag) =>
												<div className="broker-tag green"><span className="tag-key">{tag.key}:</span> {tag.value}</div>
											):
												<div className="broker-tag green"><span className="tag-key">No Tags</span></div>
											}
										</div>
									</div>
								)}
								{state.activeTabIndex == 3 && (
									<div className="card-body overflow">
										<p className="description"><now-rich-text className="g-icon" html='<svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 0 24 24" width="18px"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M13 17H5c-.55 0-1 .45-1 1s.45 1 1 1h8c.55 0 1-.45 1-1s-.45-1-1-1zm6-8H5c-.55 0-1 .45-1 1s.45 1 1 1h14c.55 0 1-.45 1-1s-.45-1-1-1zM5 15h14c.55 0 1-.45 1-1s-.45-1-1-1H5c-.55 0-1 .45-1 1s.45 1 1 1zM4 6c0 .55.45 1 1 1h14c.55 0 1-.45 1-1s-.45-1-1-1H5c-.55 0-1 .45-1 1z"/></svg>' /> <span className="">{record.description.display_value}</span></p>
										{record.additional_info.display_value != '' && (
											<div>
												<p><span className="key">Additional Info:</span></p>
												<pre className="">{JSON.stringify(JSON.parse(record.additional_info.display_value), null, 2)}</pre>
											</div>
										)}
									</div>
								)}
							</li>
						)
					})}
					{state.activeTabIndex != 4 && state.secondaryRecords.map((record, index) => {
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
							<li className="info-card">
								<div className="card-header">
									<div className="card-header-column">
										<div className="record-link" title="Open Record" onclick={() => {dispatch("RECORD_LINK#CLICKED", {table: 'em_alert', sys_id: record.sys_id.value})}}>{record.number.display_value}</div>
										<div className=""><now-highlighted-value label={record.severity.display_value} color={color} variant="secondary"/></div>
									</div>
									<img className="card-header-image" src={record.source_icon.value}/>
								</div>
								{/* <div className="card-header">
									<div className="record-link" title="Open Record" onclick={() => {dispatch("RECORD_LINK#CLICKED", {table: 'em_alert', sys_id: record.sys_id.value})}}>{record.number.display_value}</div>
									<div className="right"><now-rich-text className="g-icon" html='<svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="18px" viewBox="0 0 24 24" width="18px"><g><rect fill="none" height="24" width="24"/><path d="M20,6h-8l-2-2H4C2.9,4,2.01,4.9,2.01,6L2,18c0,1.1,0.9,2,2,2h16c1.1,0,2-0.9,2-2V8C22,6.9,21.1,6,20,6z M20,18L4,18V6h5.17 l2,2H20V18z M18,12H6v-2h12V12z M14,16H6v-2h8V16z"/></g></svg>'/> {record.source.display_value}</div>
									<div className=""><now-highlighted-value label={record.severity.display_value} color={color} variant="secondary"/></div>
									<div className="right"><now-rich-text className="g-icon" html='<svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="18px" viewBox="0 0 24 24" width="18px"><g><rect fill="none" height="24" width="24"/></g><g><g><path d="M11,8.75v3.68c0,0.35,0.19,0.68,0.49,0.86l3.12,1.85c0.36,0.21,0.82,0.09,1.03-0.26c0.21-0.36,0.1-0.82-0.26-1.03 l-2.87-1.71v-3.4C12.5,8.34,12.16,8,11.75,8S11,8.34,11,8.75z M21,9.5V4.21c0-0.45-0.54-0.67-0.85-0.35l-1.78,1.78 c-1.81-1.81-4.39-2.85-7.21-2.6c-4.19,0.38-7.64,3.75-8.1,7.94C2.46,16.4,6.69,21,12,21c4.59,0,8.38-3.44,8.93-7.88 c0.07-0.6-0.4-1.12-1-1.12c-0.5,0-0.92,0.37-0.98,0.86c-0.43,3.49-3.44,6.19-7.05,6.14c-3.71-0.05-6.84-3.18-6.9-6.9 C4.94,8.2,8.11,5,12,5c1.93,0,3.68,0.79,4.95,2.05l-2.09,2.09C14.54,9.46,14.76,10,15.21,10h5.29C20.78,10,21,9.78,21,9.5z"/></g></g></svg>'/> {makeRelativeTime(record.sys_updated_on.display_value)}</div>
								</div> */}
								{state.activeTabIndex == 0 && (
									<div className="card-body alerts">
										<p className="description"><now-rich-text className="g-icon" html='<svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 0 24 24" width="18px"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M13 17H5c-.55 0-1 .45-1 1s.45 1 1 1h8c.55 0 1-.45 1-1s-.45-1-1-1zm6-8H5c-.55 0-1 .45-1 1s.45 1 1 1h14c.55 0 1-.45 1-1s-.45-1-1-1zM5 15h14c.55 0 1-.45 1-1s-.45-1-1-1H5c-.55 0-1 .45-1 1s.45 1 1 1zM4 6c0 .55.45 1 1 1h14c.55 0 1-.45 1-1s-.45-1-1-1H5c-.55 0-1 .45-1 1z"/></svg>' /> <span className="">{record.description.display_value}</span></p>
										<div className="card-row">
											<div className="card-column">
												<p><span className="key">Source: </span> <span className="">{record.source.display_value}</span></p>
												<p onclick={() => {dispatch("RECORD_LINK_CMDB_CI#CLICKED", {value: `/now/cmdb/record/${record['cmdb_ci.sys_class_name'].value}/${record.cmdb_ci.value}`})}}><span className="key">CI:</span> <span className="underline-record-link">{record.cmdb_ci.display_value}</span></p>
												<p><span className="key">Group:</span> <span className="">{record.group_source.display_value}</span></p>
												<p><span className="key">Type:</span> <span className="">{record.type.display_value}</span></p>
												<p><span className="key">Incident:</span> <span class={{'record-link': record.incident.value != ""}} onclick={() => {dispatch("RECORD_SUB_LINK#CLICKED", {table: 'em_alert', sys_id: record.sys_id.value, subrecord_table: 'task', subrecord_sys_id: record.incident.value})}}>{record.incident.display_value}</span></p>
												<p><span className="key">Node:</span> <span className="">{record.node.display_value}</span></p>
												<p><span className="key">Created:</span> <span className="">{record.sys_created_on.display_value}</span></p>
												<p><span className="key">Event Count:</span> <div className="circle-tag">{record.event_count.display_value}</div></p>
												<p><span className="key">Message Key:</span> <span className="">{record.message_key.display_value}</span></p>
											</div>
											<div className="card-column">
												<p><span className="key">Updated:</span> <span className="">{makeRelativeTime(record.sys_updated_on.display_value)}</span></p>
												<p><span className="key">CI Class:</span> <span className="">{record['cmdb_ci.sys_class_name'].display_value}</span></p>
												<p><span className="key">State:</span> <span class={{green: record.state.display_value == "Open"}}>{record.state.display_value}</span></p>
												<p><span className="key">Resource:</span> <span className="">{record.resource.display_value}</span></p>
												<p><span className="key">Task AG:</span> <span className="">{record['incident.assignment_group'].display_value}</span></p>
												<p><span className="key">Assigned To:</span> <span className="">{record.assigned_to.display_value}</span></p>
												<p><span className="key">Updated:</span> <span className="">{record.sys_updated_on.display_value}</span></p>
												{/* onclick={() => {dispatch("RECORD_LINK_CMDB_CI#CLICKED", {value: record.u_repeated_alerts.url})}} */}
												<p className="align-items-center"><span className="key">Repeated Alerts:</span> <div className="circle-tag secondary" onclick={() => {dispatch("RECORD_LINK_CMDB_CI#CLICKED", {value: record.u_repeated_alerts.url})}}>{record.u_repeated_alerts ? shortNumFormat(record.u_repeated_alerts.value) : '0'}</div> <svg onclick={() => {dispatch("RECORD_LINK_CMDB_CI#CLICKED", {value: record.u_repeated_alerts.url})}} attrs={{class: "g-icon", xmlns: "http://www.w3.org/2000/svg", height: "24", width: "24"}}><path attr-d="M20.5 12.375V18.7Q20.5 19.45 19.975 19.975Q19.45 20.5 18.7 20.5H5.3Q4.55 20.5 4.025 19.975Q3.5 19.45 3.5 18.7V5.3Q3.5 4.55 4.025 4.025Q4.55 3.5 5.3 3.5H11.625V5H5.3Q5.2 5 5.1 5.1Q5 5.2 5 5.3V18.7Q5 18.8 5.1 18.9Q5.2 19 5.3 19H18.7Q18.8 19 18.9 18.9Q19 18.8 19 18.7V12.375ZM9.725 15.325 8.675 14.275 17.95 5H14V3.5H20.5V10H19V6.05Z"/></svg> <span className="">{record.temp_uniqueness.display_value}</span></p>
												<p><span className="key">Acknowledged:</span> <span className="">{record.acknowledged.display_value}</span></p>
											</div>
										</div>

										<div className="card-center">
											{record.snapshotImage && <div className="card-image-wrapper">
												<div
													className="card-image"
													style={{'background-image': `url(${record.snapshotImage.display_value})`, transform: `scale(${record.snapshotImage.scale})`, 'transform-origin': record.snapshotImage.transform_origin}}
													onmouseover={() => {imageZoomMouseOver(index, false)}}
													onmouseout={() => {imageZoomMouseOut(index, false)}}
													onmousemove={(e) => {imageZoomMouseMove(e, index, false)}}
												></div>
											</div>}
											{/* {record.snapshotImage && <img
												className="card-image"
												onmouseover={() => imageZoomMouseOver(index, false)}
												onmouseout={() => imageZoomMouseOut(index, false)}
												src={record.snapshotImage.display_value}
												style={{transform: `scale(${record.snapshotImage.scale})`}}
											></img>} */}
										</div>
									</div>
								)}
								{state.activeTabIndex == 1 && (
									<div className="card-body">
										<p className="description"><now-rich-text className="g-icon" html='<svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 0 24 24" width="18px"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M13 17H5c-.55 0-1 .45-1 1s.45 1 1 1h8c.55 0 1-.45 1-1s-.45-1-1-1zm6-8H5c-.55 0-1 .45-1 1s.45 1 1 1h14c.55 0 1-.45 1-1s-.45-1-1-1zM5 15h14c.55 0 1-.45 1-1s-.45-1-1-1H5c-.55 0-1 .45-1 1s.45 1 1 1zM4 6c0 .55.45 1 1 1h14c.55 0 1-.45 1-1s-.45-1-1-1H5c-.55 0-1 .45-1 1z"/></svg>' /> <span className="">{record.description.display_value}</span></p>
										{workNoteComponent(record.work_notes || [])}
										{/* {record.work_notes && record.work_notes.map((note) =>
											<p>
												<now-avatar className="" size="sm" user-name={note.sys_created_by.display_value} image-src={note.sys_created_by.avatar}/>
												<now-rich-text html={note.value.display_value}/>
												<br/><now-rich-text className="g-icon" html='<svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 20 20" height="18px" viewBox="0 0 20 20" width="18px"><g><rect fill="none" height="20" width="20"/></g><g><g><path d="M8.5,8.53v3.24c0,0.18,0.09,0.34,0.24,0.43l2.52,1.51c0.23,0.14,0.52,0.06,0.66-0.16l0,0c0.14-0.23,0.06-0.53-0.16-0.66 L9.5,11.55V8.53c0-0.26-0.21-0.48-0.48-0.48H8.98C8.71,8.05,8.5,8.26,8.5,8.53z"/><path d="M13.9,10c0.07,0.32,0.1,0.66,0.1,1c0,2.76-2.24,5-5,5s-5-2.24-5-5s2.24-5,5-5c0.71,0,1.39,0.15,2,0.42V5.35 C10.37,5.13,9.7,5,9,5c-3.31,0-6,2.69-6,6s2.69,6,6,6s6-2.69,6-6c0-0.34-0.04-0.67-0.09-1H13.9z"/><path d="M15,6V4.5C15,4.22,14.78,4,14.5,4h0C14.22,4,14,4.22,14,4.5V6h0h-1.5C12.22,6,12,6.22,12,6.5v0C12,6.78,12.22,7,12.5,7H14 v1.5C14,8.78,14.22,9,14.5,9h0C14.78,9,15,8.78,15,8.5V7v0h1.5C16.78,7,17,6.78,17,6.5v0C17,6.22,16.78,6,16.5,6H15z"/></g></g></svg>'/> {note.sys_created_on.display_value}
											</p>
										)} */}
									</div>
								)}
								{state.activeTabIndex == 2 && (
									<div className="card-body">
										<p className="description"><now-rich-text className="g-icon" html='<svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 0 24 24" width="18px"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M13 17H5c-.55 0-1 .45-1 1s.45 1 1 1h8c.55 0 1-.45 1-1s-.45-1-1-1zm6-8H5c-.55 0-1 .45-1 1s.45 1 1 1h14c.55 0 1-.45 1-1s-.45-1-1-1zM5 15h14c.55 0 1-.45 1-1s-.45-1-1-1H5c-.55 0-1 .45-1 1s.45 1 1 1zM4 6c0 .55.45 1 1 1h14c.55 0 1-.45 1-1s-.45-1-1-1H5c-.55 0-1 .45-1 1z"/></svg>' /> <span className="">{record.description.display_value}</span></p>
										<div className="tags-title">
											<svg attrs={{class: "g-icon", xmlns: "http://www.w3.org/2000/svg", height: "24px", width: "24px", viewBox: "0 0 24 24"}}><path attr-d="M0 0h24v24H0V0z" attr-fill="none"/><path attr-d="M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58s1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41s-.23-1.06-.59-1.42zM13 20.01L4 11V4h7v-.01l9 9-7 7.02z"/><circle attr-cx="6.5" attr-cy="6.5" attr-r="1.5"/></svg>
											&nbsp;&nbsp;Alert Tags (normalized):
										</div>
										<div className="tags">
											{record.tags && record.tags.length > 0 ? record.tags.filter((tag) => tag.type == "itom_tags").map((tag) =>
												<div className="broker-tag"><span className="tag-key">{tag.key}:</span> {tag.value}</div>
											):
												<div className="broker-tag"><span className="tag-key">No Tags</span></div>
											}
										</div>
										<div className="tags-title">
											<svg attrs={{class: "g-icon green", xmlns: "http://www.w3.org/2000/svg", height: "24px", width: "24px", viewBox: "0 0 24 24"}}><path attr-d="M0 0h24v24H0V0z" attr-fill="none"/><path attr-d="M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58s1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41s-.23-1.06-.59-1.42zM13 20.01L4 11V4h7v-.01l9 9-7 7.02z"/><circle attr-cx="6.5" attr-cy="6.5" attr-r="1.5"/></svg>
											&nbsp;&nbsp;CI Tags ({record.cmdb_ci.display_value}):
										</div>
										<div className="tags">
											{record.tags && record.tags.length > 0 ? record.tags.filter((tag) => tag.type == "ci").map((tag) =>
												<div className="broker-tag green"><span className="tag-key">{tag.key}:</span> {tag.value}</div>
											):
												<div className="broker-tag green"><span className="tag-key">No Tags</span></div>
											}
										</div>
									</div>
								)}
								{state.activeTabIndex == 3 && (
									<div className="card-body overflow">
										<p className="description"><now-rich-text className="g-icon" html='<svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 0 24 24" width="18px"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M13 17H5c-.55 0-1 .45-1 1s.45 1 1 1h8c.55 0 1-.45 1-1s-.45-1-1-1zm6-8H5c-.55 0-1 .45-1 1s.45 1 1 1h14c.55 0 1-.45 1-1s-.45-1-1-1zM5 15h14c.55 0 1-.45 1-1s-.45-1-1-1H5c-.55 0-1 .45-1 1s.45 1 1 1zM4 6c0 .55.45 1 1 1h14c.55 0 1-.45 1-1s-.45-1-1-1H5c-.55 0-1 .45-1 1z"/></svg>' /> <span className="">{record.description.display_value}</span></p>
										{record.additional_info.display_value != '' && (
											<div>
												<p><span className="key">Additional Info:</span></p>
												<pre className="">{JSON.stringify(JSON.parse(record.additional_info.display_value), null, 2)}</pre>
											</div>
										)}
									</div>
								)}
							</li>
						)
					})}
				</ul>
			</div>
		</div>
	);
};

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

createCustomElement('snc-alert-email-preview', {
	renderer: {type: snabbdom},
	view,
	styles,
	actionHandlers: {
		[COMPONENT_PROPERTY_CHANGED]: (coeffects) => {
			const { dispatch, action } = coeffects;
			console.log('COMPONENT_PROPERTY_CHANGED payload: ', action.payload);
			dispatch("REFRESH_MAIN_QUERY");
		},
		[COMPONENT_BOOTSTRAPPED]: (coeffects) => {
			const { dispatch } = coeffects;
			console.log("COMPONENT_BOOTSTRAPPED");
			dispatch("REFRESH_MAIN_QUERY");
		},
		'REFRESH_MAIN_QUERY': (coeffects) => {
			const { state, dispatch } = coeffects;
			console.log("REFRESH_MAIN_QUERY");
			console.log("state: ", state);
			dispatch('FETCH_PARENT_RECORD', {
				table: 'em_alert',
				sysparm_query: 'number=' + state.properties.focusedRecordNumber,
				sysparm_fields: 'number,sys_id,parent,cmdb_ci,description,severity,sys_updated_on,source,group_source,type,additional_info,node,incident,incident.assignment_group,state,resource,assignment_group,message_key,cmdb_ci.sys_class_name,sys_created_on,initial_remote_time,event_count,assigned_to,acknowledged,u_itom_tags,is_group_alert,u_tbac_reasoning,u_repeated_alerts',
				sysparm_display_value: 'all'
			});
			dispatch('FETCH_CHILD_RECORD', {
				table: 'em_alert',
				sysparm_query: 'parent.number=' + state.properties.focusedRecordNumber,
				sysparm_fields: 'number,sys_id,parent,cmdb_ci,description,severity,sys_updated_on,source,group_source,type,additional_info,node,incident,incident.assignment_group,state,resource,assignment_group,message_key,cmdb_ci.sys_class_name,sys_created_on,initial_remote_time,event_count,assigned_to,acknowledged,u_itom_tags,is_group_alert,u_tbac_reasoning,u_repeated_alerts',
				sysparm_display_value: 'all'
			});
		},
		'FETCH_PARENT_RECORD': createHttpEffect('/api/now/table/:table', {
			batch: true,
			cacheable: true,
			method: 'GET',
			pathParams: ['table'],
			queryParams: ['sysparm_query', 'sysparm_fields', 'sysparm_display_value'],
			successActionType: 'FETCH_PARENT_RECORD_SUCCESS'
		}),
		'FETCH_PARENT_RECORD_SUCCESS': (coeffects) => {
			const { action, state, dispatch, updateState } = coeffects;
			console.log('%cFETCH_PARENT_RECORD_SUCCESS', 'color:green');
			console.log("%cpayload: %o", 'color:green', action.payload);
			let newParentRecord = action.payload.result;
			if (newParentRecord[0] && newParentRecord[0].u_itom_tags && newParentRecord[0].u_itom_tags.value) {
				try {
					newParentRecord[0].tags = [];
					let itom_tags = JSON.parse(newParentRecord[0].u_itom_tags.value);
					let itom_tag_keys = Object.keys(itom_tags);
					itom_tag_keys.forEach((tag_key) => {
						newParentRecord[0].tags.push({key: tag_key, value: itom_tags[tag_key], type: "itom_tags"});
					});
					newParentRecord[0].tags.sort(sortTags);
				} catch (e) {}
			}
			if (newParentRecord[0] && newParentRecord[0].source) {
				newParentRecord[0].source_icon = {
					label: 'Source Icon',
					value: findMatchingSourceIcon(newParentRecord[0].source.display_value)
				};
			}
			//Temp Uniqueness column
			if (newParentRecord[0] && newParentRecord[0].u_repeated_alerts) {
				let uniquenessString = "Causal";
				if (newParentRecord[0].u_repeated_alerts.value != "") {
					let numOfRepeatedAlerts = parseInt(newParentRecord[0].u_repeated_alerts.value);
					if (numOfRepeatedAlerts <= 5) {
						uniquenessString = "Causal";
					} else if (numOfRepeatedAlerts <= 15) {
						uniquenessString = "Impacting";
					} else if (numOfRepeatedAlerts <= 30) {
						uniquenessString = "Related";
					} else {
						uniquenessString = "Noise";
					}
				}
				newParentRecord[0].temp_uniqueness = {display_value: uniquenessString, value: uniquenessString, label: "Uniqueness"};
			}
			updateState({parentRecord: newParentRecord});
			dispatch('START_FETCH_EXTRA_DATA');
		},
		'FETCH_CHILD_RECORD': createHttpEffect('/api/now/table/:table', {
			batch: true,
			cacheable: true,
			method: 'GET',
			pathParams: ['table'],
			queryParams: ['sysparm_query', 'sysparm_fields', 'sysparm_display_value'],
			successActionType: 'FETCH_CHILD_RECORD_SUCCESS'
		}),
		'FETCH_CHILD_RECORD_SUCCESS': (coeffects) => {
			const { action, state, dispatch, updateState } = coeffects;
			console.log('%cFETCH_CHILD_RECORD_SUCCESS', 'color:green');
			console.log("%cpayload: %o", 'color:green', action.payload);
			let newSecondaryRecords = [];
			if (action.payload && action.payload.result) {
				newSecondaryRecords = action.payload.result;
				newSecondaryRecords.map((secondaryRecord) => {
					if (secondaryRecord.u_itom_tags && secondaryRecord.u_itom_tags.value) {
						try {
							secondaryRecord.tags = [];
							let itom_tags = JSON.parse(secondaryRecord.u_itom_tags.value);
							let itom_tag_keys = Object.keys(itom_tags);
							itom_tag_keys.forEach((tag_key) => {
								if (!secondaryRecord.tags.find((tags) => tags.key == tag_key)) {
									secondaryRecord.tags.push({key: tag_key, value: itom_tags[tag_key], type: "itom_tags"});
								}
							});
							secondaryRecord.tags.sort(sortTags);
						} catch (e) {

						}
					}
					if (secondaryRecord.source) {
						secondaryRecord.source_icon = {
							label: 'Source Icon',
							value: findMatchingSourceIcon(secondaryRecord.source.display_value)
						};
					}
					//Temp Uniqueness column
					if (secondaryRecord.u_repeated_alerts) {
						let uniquenessString = "Causal";
						if (secondaryRecord.u_repeated_alerts.value != "") {
							let numOfRepeatedAlerts = parseInt(secondaryRecord.u_repeated_alerts.value);
							if (numOfRepeatedAlerts <= 5) {
								uniquenessString = "Causal";
							} else if (numOfRepeatedAlerts <= 15) {
								uniquenessString = "Impacting";
							} else if (numOfRepeatedAlerts <= 30) {
								uniquenessString = "Related";
							} else {
								uniquenessString = "Noise";
							}
						}
						secondaryRecord.temp_uniqueness = {display_value: uniquenessString, value: uniquenessString, label: "Uniqueness"};
					}
				});
			}
			updateState({secondaryRecords: newSecondaryRecords});
			// dispatch('START_FETCH_WORK_NOTES');
			// dispatch('START_FETCH_KEYS');
			// dispatch('START_FETCH_PRC');
		},
		'START_FETCH_EXTRA_DATA': (coeffects) => {
			const { state, dispatch, updateState } = coeffects;

			let updatedParentRecord = state.parentRecord;
			let updatedSecondaryRecords = state.secondaryRecords;
			if (updatedParentRecord[0] && updatedParentRecord[0].is_group_alert && updatedParentRecord[0].message_key && updatedParentRecord[0].u_repeated_alerts && updatedSecondaryRecords.length > 0) {
				let repeatedAlertsSysparm = '';
				if (updatedParentRecord[0].is_group_alert.value == 'true') {
					let baseRecord = updatedSecondaryRecords.find(secondaryRecord => secondaryRecord.sys_id.value == updatedParentRecord[0].message_key.value);

					console.log("baseRecord: ", baseRecord);
					if (baseRecord) {
						repeatedAlertsSysparm = "message_key=" + baseRecord.message_key.value + "^sys_id!=" + baseRecord.sys_id.value + "^sys_updated_on>=javascript:gs.beginningOfLast30Days()";
					}
				} else {
					repeatedAlertsSysparm = "message_key=" + updatedParentRecord[0].message_key.value + "^sys_id!=" + updatedParentRecord[0].sys_id.value + "^sys_updated_on>=javascript:gs.beginningOfLast30Days()";
				}
				updatedParentRecord[0].u_repeated_alerts.url = encodeURI(`/now/optimiz-workspace/home/params/list/49667e2647974550d0bc5c62e36d43a7/sysparm/${repeatedAlertsSysparm}`);
			}
			updatedSecondaryRecords.forEach((secondaryRecord) => {
				if (secondaryRecord.is_group_alert && secondaryRecord.message_key && secondaryRecord.u_repeated_alerts) {
					let repeatedAlertsSysparm = '';
					if (secondaryRecord.is_group_alert && secondaryRecord.message_key && secondaryRecord.message_key.value) {
						if (secondaryRecord.is_group_alert.value == 'false') {
							repeatedAlertsSysparm = "message_key=" + secondaryRecord.message_key.value + "^sys_id!=" + secondaryRecord.sys_id.value + "^sys_updated_on>=javascript:gs.beginningOfLast30Days()";
						}
					}
					secondaryRecord.u_repeated_alerts.url = encodeURI(`/now/optimiz-workspace/home/params/list/49667e2647974550d0bc5c62e36d43a7/sysparm/${repeatedAlertsSysparm}`);
				}
			});
			updateState({parentRecord: updatedParentRecord, secondaryRecords: updatedSecondaryRecords});


			let recordIDs = [];
			let ciArray = [];
			state.parentRecord.forEach((record) => {
				recordIDs.push(record.sys_id.value);
				if (record.cmdb_ci.value != "") {
					ciArray.push(record.cmdb_ci.value);
				}
				if (record.additional_info.value.includes("snapshot")) {
					dispatch('FETCH_DATADOG_SNAPSHOT', {
						retrieveLaunchApplications: true,
						retrieveRemediations: false,
						retrieveSubflows: false,
						alertId: record.sys_id.value
					});
				}

			});
			state.secondaryRecords.forEach((record) => {
				recordIDs.push(record.sys_id.value);
				if (record.cmdb_ci.value != "") {
					ciArray.push(record.cmdb_ci.value);
				}
				if (record.additional_info.value.includes("snapshot")) {
					dispatch('FETCH_DATADOG_SNAPSHOT', {
						retrieveLaunchApplications: true,
						retrieveRemediations: false,
						retrieveSubflows: false,
						alertId: record.sys_id.value
					});
				}
			});

			if (recordIDs.length > 0) {
				dispatch('FETCH_WORK_NOTES', {
					table: 'sys_journal_field',
					sysparm_query: "name=em_alert^element_idIN" + recordIDs.toString() + "^ORDERBYDESCsys_created_on",
					sysparm_fields: 'sys_created_on,value,element_id,sys_created_by',
					sysparm_display_value: 'all'
				});
			}

			if (ciArray.length > 0) {
				dispatch('FETCH_KEYS', {
					table: 'cmdb_key_value',
					sysparm_query: "configuration_itemIN" + ciArray.toString() + "^ORDERBYkey",
					sysparm_fields: 'configuration_item,key,value',
					sysparm_display_value: 'all'
				});
			}

			if (state.parentRecord.length > 0) {
				dispatch('FETCH_PRC', {
					table: 'em_root_cause',
					sysparm_query: 'parent_alert=' + state.parentRecord[0].sys_id.value + "^ORDERBYDESCsys_updated_on",
					sysparm_fields: 'root_cause_task,description,score,type,reasoning',
					sysparm_display_value: 'all'
				});
			}
		},
		'FETCH_WORK_NOTES': createHttpEffect('/api/now/table/:table', {
			batch: true,
			cacheable: true,
			method: 'GET',
			pathParams: ['table'],
			queryParams: ['sysparm_query', 'sysparm_fields', 'sysparm_display_value'],
			successActionType: 'FETCH_WORK_NOTES_SUCCESS'
		}),
		'FETCH_WORK_NOTES_SUCCESS': (coeffects) => {
			const { action, state, updateState, dispatch } = coeffects;
			console.log('FETCH_WORK_NOTES_SUCCESS');
			console.log("result: ", action.payload.result);
			let updatedParentRecord = state.parentRecord;
			let updatedSecondaryRecords = state.secondaryRecords;
			//let foundClusteringMethod = false;
			action.payload.result.forEach((result) => {
				result.value.display_value = "<style>a {color: rgba(119, 178, 123, 1);}</style>" + result.value.display_value.replaceAll("[code]","");
				result.value.display_value = result.value.display_value.replaceAll("[/code]","");
				result.value.value = "<style>a {color: rgba(119, 178, 123, 1);}</style>" + result.value.value.replaceAll("[code]","");
				result.value.value = result.value.value.replaceAll("[/code]","");
				if (result.sys_created_by.value == "system") {
					result.sys_created_by.avatar = servicenowSVG;
				}
				let parentMatchIndex = updatedParentRecord.findIndex((record) => record.sys_id.value == result.element_id.value);
				if (parentMatchIndex > -1) {
					// if (foundClusteringMethod == false) {
					// 	foundClusteringMethod = true;
					// 	let clusteringMethod = result.value.display_value.match(/(?<=<a.*>\[Tag Based\]).*(?=<\/a>)/gi);
					// 	updateState({tagClusteringMethod: clusteringMethod});
					// }
					if (updatedParentRecord[parentMatchIndex].work_notes) {
						updatedParentRecord[parentMatchIndex].work_notes.push(result);
					} else {
						updatedParentRecord[parentMatchIndex].work_notes = [result];
					}
				} else {
					let childMatchIndex = updatedSecondaryRecords.findIndex((record) => record.sys_id.value == result.element_id.value);
					if (childMatchIndex > -1) {
						if (updatedSecondaryRecords[childMatchIndex].work_notes) {
							updatedSecondaryRecords[childMatchIndex].work_notes.push(result);
						} else {
							updatedSecondaryRecords[childMatchIndex].work_notes = [result];
						}
					}
				}
			});
			updateState({parentRecord: updatedParentRecord, secondaryRecords: updatedSecondaryRecords, dummyStateChange: !state.dummyStateChange});
			dispatch('START_FETCH_WORK_NOTE_AVATARS', {value: action.payload.result});
		},
		'FETCH_KEYS': createHttpEffect('/api/now/table/:table', {
			batch: true,
			cacheable: true,
			method: 'GET',
			pathParams: ['table'],
			queryParams: ['sysparm_query', 'sysparm_fields', 'sysparm_display_value'],
			successActionType: 'FETCH_KEYS_SUCCESS'
		}),
		'FETCH_KEYS_SUCCESS': (coeffects) => {
			const { state, action, updateState } = coeffects;
			console.log('FETCH_KEYS_SUCCESS');
			console.log("payload: ", action.payload);
			let updatedParentRecord = state.parentRecord;
			let updatedSecondaryRecords = state.secondaryRecords;
			action.payload.result.forEach((result) => {
				updatedParentRecord.forEach((parentRecord) => {
					if (!parentRecord.tags) {
						parentRecord.tags = [];
					}
					if (parentRecord.cmdb_ci.value == result.configuration_item.value) {
						parentRecord.tags.push({key: result.key.display_value, value: result.value.display_value, type: "ci"});
					}
					parentRecord.tags.sort(sortTags);
				});
				updatedSecondaryRecords.forEach((secondaryRecord) => {
					if (!secondaryRecord.tags) {
						secondaryRecord.tags = [];
					}
					if (secondaryRecord.cmdb_ci.value == result.configuration_item.value) {
						secondaryRecord.tags.push({key: result.key.display_value, value: result.value.display_value, type: "ci"});
					}
					secondaryRecord.tags.sort(sortTags);
				});
			});
			updateState({parentRecord: updatedParentRecord, secondaryRecords: updatedSecondaryRecords, dummyStateChange: !state.dummyStateChange});
		},
		'START_FETCH_WORK_NOTE_AVATARS': (coeffects) => {
			const { dispatch, action } = coeffects;
			console.log('START_FETCH_WORK_NOTE_AVATARS');
			console.log('payload: ', action.payload);
			let sysparm = "user_nameIN";
			let createdByArray = [];
			action.payload.value.forEach((result) => {
				if (!createdByArray.includes(result.sys_created_by.value)) {
					createdByArray.push(result.sys_created_by.value);
				}
			});
			console.log("sysparm: ", sysparm + createdByArray.toString());
			dispatch('FETCH_WORK_NOTE_AVATARS', {
				table: 'sys_user',
				sysparm_query: sysparm + createdByArray.toString(),
				sysparm_fields: 'user_name,photo',
				sysparm_display_value: 'all'
			});
		},
		'FETCH_WORK_NOTE_AVATARS': createHttpEffect('/api/now/table/:table', {
			batch: false,
			method: 'GET',
			pathParams: ['table'],
			queryParams: ['sysparm_query', 'sysparm_fields', 'sysparm_display_value'],
			successActionType: 'FETCH_WORK_NOTE_AVATARS_SUCCESS'
		}),
		'FETCH_WORK_NOTE_AVATARS_SUCCESS': (coeffects) => {
			const { state, updateState, action } = coeffects;
			console.log("FETCH_WORK_NOTE_AVATARS_SUCCESS");
			console.log("payload: ", action.payload);
			let updatedParentRecord = state.parentRecord;
			let updatedSecondaryRecords = state.secondaryRecords;
			action.payload.result.forEach((result) => {
				updatedParentRecord.forEach((parentRow) => {
					if (parentRow.work_notes) {
						parentRow.work_notes.forEach((parentWorkNote) => {
							if (result.user_name.value == parentWorkNote.sys_created_by.value) {
								parentWorkNote.sys_created_by.avatar = result.photo.display_value;
							}
						});
					}
				});
				updatedSecondaryRecords.forEach((secondaryRow) => {
					if (secondaryRow.work_notes) {
						secondaryRow.work_notes.forEach((secondaryWorkNote) => {
							if (result.user_name.value == secondaryWorkNote.sys_created_by.value) {
								secondaryWorkNote.sys_created_by.avatar = result.photo.display_value;
							}
						});
					}
				});
			});
			updateState({parentRecord: updatedParentRecord, secondaryRecords: updatedSecondaryRecords, dummyStateChange: !state.dummyStateChange});
		},
		'FETCH_PRC': createHttpEffect('/api/now/table/:table', {
			batch: true,
			cacheable: true,
			method: 'GET',
			pathParams: ['table'],
			queryParams: ['sysparm_query', 'sysparm_fields', 'sysparm_display_value'],
			successActionType: 'FETCH_PRC_SUCCESS'
		}),
		'FETCH_PRC_SUCCESS': (coeffects) => {
			const { state, action, updateState } = coeffects;
			console.log("FETCH_PRC_SUCCESS payload: ", action.payload);
			if (action.payload && action.payload.result) {
				let updatedParentRecord = state.parentRecord;
				updatedParentRecord[0].prc = [];
				action.payload.result.forEach((result) => {
					updatedParentRecord[0].prc.push(result);
				});
				updateState({parentRecord: updatedParentRecord, dummyStateChange: !state.dummyStateChange});
			}
		},
		'FETCH_DATADOG_SNAPSHOT': createHttpEffect('/api/now/em_actions/getManualActionsForAlert', {
			batch: true,
			cacheable: true,
			method: 'GET',
			queryParams: ['retrieveLaunchApplications', 'retrieveRemediations', 'retrieveSubflows', 'alertId'],
			successActionType: 'FETCH_DATADOG_SNAPSHOT_SUCCESS'
		}),
		'FETCH_DATADOG_SNAPSHOT_SUCCESS': (coeffects) => {
			const {action, state, updateState} = coeffects;
			console.log("FETCH_DATADOG_SNAPSHOT_SUCCESS payload: ", action.payload);
			console.log("FETCH_DATADOG_SNAPSHOT_SUCCESS meta: ", action.meta.request.params.alertId);
			if (action.payload && action.payload.result && action.payload.result.toolsForAlert) {
				let updatedParentRecord = state.parentRecord;
				let matchingParentIndex = updatedParentRecord.findIndex(parent => parent.sys_id.value == action.meta.request.params.alertId);
				if (matchingParentIndex > -1) {
					let snapshot_action = action.payload.result.toolsForAlert.find(alert_tools => alert_tools.displayName == "Open Datadog Snapshot");
					if (snapshot_action) {
						updatedParentRecord[matchingParentIndex].snapshotImage = {display_value: snapshot_action.url, scale: '1', transform_origin: 'initial'};
						updateState({parentRecord: updatedParentRecord, dummyStateChange: !state.dummyStateChange});
					}
				} else {
					let updatedSecondaryRecords = state.secondaryRecords;
					let matchingSecondaryIndex = updatedSecondaryRecords.findIndex(secondary => secondary.sys_id.value == action.meta.request.params.alertId);
					if (matchingSecondaryIndex > -1) {
						let snapshot_action = action.payload.result.toolsForAlert.find(alert_tools => alert_tools.displayName == "Open Datadog Snapshot");
						if (snapshot_action) {
							updatedSecondaryRecords[matchingSecondaryIndex].snapshotImage = {display_value: snapshot_action.url, scale: '1', transform_origin: 'initial'};
							updateState({secondaryRecords: updatedSecondaryRecords, dummyStateChange: !state.dummyStateChange});
						}
					}
				}
			}
		},
		[COMPONENT_ERROR_THROWN]: (coeffects) => {
			console.log("%cERROR_THROWN: %o", "color:red", coeffects.action.payload);
		},
	},
	properties: {
		focusedRecordNumber: {
			default: 'Alert0000000'
		}
	},
	setInitialState() {
		return {
			activeTabIndex: 0,
			dummyStateChange: false,
			parentRecord: [],
			secondaryRecords: [],
			//tagClusteringMethod: '',
			//repeatedAlertsURL: '',
		}
	}
});

//How to properly render an svg
{/* <svg attrs={{xmlns: "http://www.w3.org/2000/svg", height: "18px", width: "18px", viewBox: "0 0 24 24", class: "g-icon"}}><path attr-d="M0 0h24v24H0V0z" attr-fill="none"/><path attr-d="M13 17H5c-.55 0-1 .45-1 1s.45 1 1 1h8c.55 0 1-.45 1-1s-.45-1-1-1zm6-8H5c-.55 0-1 .45-1 1s.45 1 1 1h14c.55 0 1-.45 1-1s-.45-1-1-1zM5 15h14c.55 0 1-.45 1-1s-.45-1-1-1H5c-.55 0-1 .45-1 1s.45 1 1 1zM4 6c0 .55.45 1 1 1h14c.55 0 1-.45 1-1s-.45-1-1-1H5c-.55 0-1 .45-1 1z"/></svg> */}