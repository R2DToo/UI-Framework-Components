import {createCustomElement, actionTypes} from '@servicenow/ui-core';
const {COMPONENT_PROPERTY_CHANGED,COMPONENT_ERROR_THROWN,COMPONENT_BOOTSTRAPPED} = actionTypes;
import {createHttpEffect} from '@servicenow/ui-effect-http';
import snabbdom, {dangerouslyCreateElementFromString} from '@servicenow/ui-renderer-snabbdom';
import styles from './styles.scss';
import '@servicenow/now-icon';
import '@servicenow/now-highlighted-value';
import '@servicenow/now-rich-text';
import '@servicenow/now-avatar';

const view = (state, {updateState, dispatch}) => {
	console.log('snc-alert-email-preview state: ', state);

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
				if (childEventCount == 0) {
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
				{userNotes.length > 0 && <div className="work-notes-header">Collaboration</div>}
				{userNotes.map((note) =>
					<div className="work-note">
						<p>
							<now-avatar className="" size="sm" user-name={note.sys_created_by.display_value} image-src={note.sys_created_by.avatar}/> <now-rich-text html={note.value.display_value}/>
							<br/><now-rich-text className="g-icon" html='<svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 20 20" height="18px" viewBox="0 0 20 20" width="18px"><g><rect fill="none" height="20" width="20"/></g><g><g><path d="M8.5,8.53v3.24c0,0.18,0.09,0.34,0.24,0.43l2.52,1.51c0.23,0.14,0.52,0.06,0.66-0.16l0,0c0.14-0.23,0.06-0.53-0.16-0.66 L9.5,11.55V8.53c0-0.26-0.21-0.48-0.48-0.48H8.98C8.71,8.05,8.5,8.26,8.5,8.53z"/><path d="M13.9,10c0.07,0.32,0.1,0.66,0.1,1c0,2.76-2.24,5-5,5s-5-2.24-5-5s2.24-5,5-5c0.71,0,1.39,0.15,2,0.42V5.35 C10.37,5.13,9.7,5,9,5c-3.31,0-6,2.69-6,6s2.69,6,6,6s6-2.69,6-6c0-0.34-0.04-0.67-0.09-1H13.9z"/><path d="M15,6V4.5C15,4.22,14.78,4,14.5,4h0C14.22,4,14,4.22,14,4.5V6h0h-1.5C12.22,6,12,6.22,12,6.5v0C12,6.78,12.22,7,12.5,7H14 v1.5C14,8.78,14.22,9,14.5,9h0C14.78,9,15,8.78,15,8.5V7v0h1.5C16.78,7,17,6.78,17,6.5v0C17,6.22,16.78,6,16.5,6H15z"/></g></g></svg>'/> {dangerouslyCreateElementFromString(note.sys_created_on.display_value)}
						</p>
					</div>
				)}
				{systemNotes.length > 0 && <div className="work-notes-header">System</div>}
				{systemNotes.map((note) =>
					<div className="work-note">
						<p>
							<now-avatar className="" size="sm" user-name={note.sys_created_by.display_value} image-src={note.sys_created_by.avatar}/> <now-rich-text html={note.value.display_value}/>
							<br/><now-rich-text className="g-icon" html='<svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 20 20" height="18px" viewBox="0 0 20 20" width="18px"><g><rect fill="none" height="20" width="20"/></g><g><g><path d="M8.5,8.53v3.24c0,0.18,0.09,0.34,0.24,0.43l2.52,1.51c0.23,0.14,0.52,0.06,0.66-0.16l0,0c0.14-0.23,0.06-0.53-0.16-0.66 L9.5,11.55V8.53c0-0.26-0.21-0.48-0.48-0.48H8.98C8.71,8.05,8.5,8.26,8.5,8.53z"/><path d="M13.9,10c0.07,0.32,0.1,0.66,0.1,1c0,2.76-2.24,5-5,5s-5-2.24-5-5s2.24-5,5-5c0.71,0,1.39,0.15,2,0.42V5.35 C10.37,5.13,9.7,5,9,5c-3.31,0-6,2.69-6,6s2.69,6,6,6s6-2.69,6-6c0-0.34-0.04-0.67-0.09-1H13.9z"/><path d="M15,6V4.5C15,4.22,14.78,4,14.5,4h0C14.22,4,14,4.22,14,4.5V6h0h-1.5C12.22,6,12,6.22,12,6.5v0C12,6.78,12.22,7,12.5,7H14 v1.5C14,8.78,14.22,9,14.5,9h0C14.78,9,15,8.78,15,8.5V7v0h1.5C16.78,7,17,6.78,17,6.5v0C17,6.22,16.78,6,16.5,6H15z"/></g></g></svg>'/> {dangerouslyCreateElementFromString(note.sys_created_on.display_value)}
						</p>
					</div>
				)}
			</div>
		)
	};

	return (
		<div id="info-container">
			<div id="info-header">
				<div>
					<h1><now-rich-text title="Close Preview" className="g-icon primary-color" onclick={() => {dispatch("CLOSE_INFO_BUTTON#CLICKED")}} html='<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px"><path d="M0 0h24v24H0V0zm0 0h24v24H0V0zm0 0h24v24H0V0zm0 0h24v24H0V0z" fill="none"/><path d="M12 6c3.79 0 7.17 2.13 8.82 5.5-.59 1.22-1.42 2.27-2.41 3.12l1.41 1.41c1.39-1.23 2.49-2.77 3.18-4.53C21.27 7.11 17 4 12 4c-1.27 0-2.49.2-3.64.57l1.65 1.65C10.66 6.09 11.32 6 12 6zm-1.07 1.14L13 9.21c.57.25 1.03.71 1.28 1.28l2.07 2.07c.08-.34.14-.7.14-1.07C16.5 9.01 14.48 7 12 7c-.37 0-.72.05-1.07.14zM2.01 3.87l2.68 2.68C3.06 7.83 1.77 9.53 1 11.5 2.73 15.89 7 19 12 19c1.52 0 2.98-.29 4.32-.82l3.42 3.42 1.41-1.41L3.42 2.45 2.01 3.87zm7.5 7.5l2.61 2.61c-.04.01-.08.02-.12.02-1.38 0-2.5-1.12-2.5-2.5 0-.05.01-.08.01-.13zm-3.4-3.4l1.75 1.75c-.23.55-.36 1.15-.36 1.78 0 2.48 2.02 4.5 4.5 4.5.63 0 1.23-.13 1.77-.36l.98.98c-.88.24-1.8.38-2.75.38-3.79 0-7.17-2.13-8.82-5.5.7-1.43 1.72-2.61 2.93-3.53z"/></svg>'/> 360&#176; View</h1>
					<div className="inline-header">Secondary Alerts <div className="circle-tag">{state.secondaryRecords.length}</div></div>
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
					{state.parentRecord.map((record) => {
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
								{state.activeTabIndex == 0 && (
									<div className="card-body alerts">
										<p className="description"><now-rich-text className="g-icon" html='<svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 0 24 24" width="18px"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M13 17H5c-.55 0-1 .45-1 1s.45 1 1 1h8c.55 0 1-.45 1-1s-.45-1-1-1zm6-8H5c-.55 0-1 .45-1 1s.45 1 1 1h14c.55 0 1-.45 1-1s-.45-1-1-1zM5 15h14c.55 0 1-.45 1-1s-.45-1-1-1H5c-.55 0-1 .45-1 1s.45 1 1 1zM4 6c0 .55.45 1 1 1h14c.55 0 1-.45 1-1s-.45-1-1-1H5c-.55 0-1 .45-1 1z"/></svg>' /> <span className="">{record.description.display_value}</span></p>
										<div className="column-left">
											<p onclick={() => {dispatch("RECORD_LINK_CMDB_CI#CLICKED", {value: `/now/cmdb/record/${record['cmdb_ci.sys_class_name'].value}/${record.cmdb_ci.value}`})}}><span className="key">CI:</span> <span className="underline-record-link">{record.cmdb_ci.display_value}</span></p>
											<p><span className="key">Group:</span> <span className="">{record.group_source.display_value}</span></p>
											<p><span className="key">Type:</span> <span className="">{record.type.display_value}</span></p>
											<p><span className="key">Incident:</span> <span class={{'record-link': record.incident.value != ""}} onclick={() => {dispatch("RECORD_SUB_LINK#CLICKED", {table: 'em_alert', sys_id: record.sys_id.value, subrecord_table: 'task', subrecord_sys_id: record.incident.value})}}>{record.incident.display_value}</span></p>
											<p><span className="key">Node:</span> <span className="">{record.node.display_value}</span></p>
											<p><span className="key">Created:</span> <span className="">{record.sys_created_on.display_value}</span></p>
											<p><span className="key">Event Count:</span> <div className="circle-tag">{record.event_count.display_value}</div></p>
										</div>
										<div className="column-right">
											<p><span className="key">CI Class:</span> <span className="">{record['cmdb_ci.sys_class_name'].display_value}</span></p>
											<p><span className="key">State:</span> <span class={{green: record.state.display_value == "Open"}}>{record.state.display_value}</span></p>
											<p><span className="key">Resource:</span> <span className="">{record.resource.display_value}</span></p>
											<p><span className="key">Ticket Assignment Group:</span> <span className="">{record['incident.assignment_group'].display_value}</span></p>
											<p><span className="key">Assigned To:</span> <span className="">{record.assigned_to.display_value}</span></p>
											<p><span className="key">Updated:</span> <span className="">{record.sys_updated_on.display_value}</span></p>
											<p><span className="key">Acknowledged:</span> <span className="">{record.acknowledged.display_value}</span></p>
										</div>
										<div className="full-width">
											<p><span className="key">Message Key:</span> <span className="">{record.message_key.display_value}</span></p>
										</div>
									</div>
								)}
								{state.activeTabIndex == 1 && (
									<div className="card-body">
										<p className="description"><now-rich-text className="g-icon" html='<svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 0 24 24" width="18px"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M13 17H5c-.55 0-1 .45-1 1s.45 1 1 1h8c.55 0 1-.45 1-1s-.45-1-1-1zm6-8H5c-.55 0-1 .45-1 1s.45 1 1 1h14c.55 0 1-.45 1-1s-.45-1-1-1zM5 15h14c.55 0 1-.45 1-1s-.45-1-1-1H5c-.55 0-1 .45-1 1s.45 1 1 1zM4 6c0 .55.45 1 1 1h14c.55 0 1-.45 1-1s-.45-1-1-1H5c-.55 0-1 .45-1 1z"/></svg>' /> <span className="">{record.description.display_value}</span></p>
										<p><span className="key">Work Notes:</span> <span className=""></span></p>
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
										<div className="tags">
											<div>{record.cmdb_ci.display_value + " (Tags)"}&nbsp;</div>
											{record.tags && record.tags.length > 0 ? record.tags.map((tag) =>
												<div className="broker-tag"><span className="tag-key">{tag.key}:</span> {tag.value}</div>
											):
												<div className="broker-tag"><span className="tag-key">No Tags</span></div>
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
								{state.activeTabIndex == 4 && (
									<div className="card-body">
										<p className="description"><now-rich-text className="g-icon" html='<svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 0 24 24" width="18px"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M13 17H5c-.55 0-1 .45-1 1s.45 1 1 1h8c.55 0 1-.45 1-1s-.45-1-1-1zm6-8H5c-.55 0-1 .45-1 1s.45 1 1 1h14c.55 0 1-.45 1-1s-.45-1-1-1zM5 15h14c.55 0 1-.45 1-1s-.45-1-1-1H5c-.55 0-1 .45-1 1s.45 1 1 1zM4 6c0 .55.45 1 1 1h14c.55 0 1-.45 1-1s-.45-1-1-1H5c-.55 0-1 .45-1 1z"/></svg>' /> <span className="">{record.description.display_value}</span></p>
										<p><span className="key">Changes:</span> Coming Soon...</p>
									</div>
								)}
							</li>
						)
					})}
					{state.secondaryRecords.map((record) => {
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
								{state.activeTabIndex == 0 && (
									<div className="card-body alerts">
										<p className="description"><now-rich-text className="g-icon" html='<svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 0 24 24" width="18px"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M13 17H5c-.55 0-1 .45-1 1s.45 1 1 1h8c.55 0 1-.45 1-1s-.45-1-1-1zm6-8H5c-.55 0-1 .45-1 1s.45 1 1 1h14c.55 0 1-.45 1-1s-.45-1-1-1zM5 15h14c.55 0 1-.45 1-1s-.45-1-1-1H5c-.55 0-1 .45-1 1s.45 1 1 1zM4 6c0 .55.45 1 1 1h14c.55 0 1-.45 1-1s-.45-1-1-1H5c-.55 0-1 .45-1 1z"/></svg>' /> <span className="">{record.description.display_value}</span></p>
										<div className="column-left">
											<p onclick={() => {dispatch("RECORD_LINK_CMDB_CI#CLICKED", {value: `/now/cmdb/record/${record['cmdb_ci.sys_class_name'].value}/${record.cmdb_ci.value}`})}}><span className="key">CI:</span> <span className="underline-record-link">{record.cmdb_ci.display_value}</span></p>
											<p><span className="key">Group:</span> <span className="">{record.group_source.display_value}</span></p>
											<p><span className="key">Type:</span> <span className="">{record.type.display_value}</span></p>
											<p><span className="key">Incident:</span> <span class={{'record-link': record.incident.value != ""}} onclick={() => {dispatch("RECORD_SUB_LINK#CLICKED", {table: 'em_alert', sys_id: record.sys_id.value, subrecord_table: 'task', subrecord_sys_id: record.incident.value})}}>{record.incident.display_value}</span></p>
											<p><span className="key">Node:</span> <span className="">{record.node.display_value}</span></p>
											<p><span className="key">Created:</span> <span className="">{record.sys_created_on.display_value}</span></p>
											<p><span className="key">Event Count:</span> <div className="circle-tag">{record.event_count.display_value}</div></p>
										</div>
										<div className="column-right">
											<p><span className="key">CI Class:</span> <span className="">{record['cmdb_ci.sys_class_name'].display_value}</span></p>
											<p><span className="key">State:</span> <span class={{green: record.state.display_value == "Open"}}>{record.state.display_value}</span></p>
											<p><span className="key">Resource:</span> <span className="">{record.resource.display_value}</span></p>
											<p><span className="key">Ticket Assignment Group:</span> <span className="">{record['incident.assignment_group'].display_value}</span></p>
											<p><span className="key">Assigned To:</span> <span className="">{record.assigned_to.display_value}</span></p>
											<p><span className="key">Updated:</span> <span className="">{record.sys_updated_on.display_value}</span></p>
											<p><span className="key">Acknowledged:</span> <span className="">{record.acknowledged.display_value}</span></p>
										</div>
										<div className="full-width">
											<p><span className="key">Message Key:</span> <span className="">{record.message_key.display_value}</span></p>
										</div>
									</div>
								)}
								{state.activeTabIndex == 1 && (
									<div className="card-body">
										<p className="description"><now-rich-text className="g-icon" html='<svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 0 24 24" width="18px"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M13 17H5c-.55 0-1 .45-1 1s.45 1 1 1h8c.55 0 1-.45 1-1s-.45-1-1-1zm6-8H5c-.55 0-1 .45-1 1s.45 1 1 1h14c.55 0 1-.45 1-1s-.45-1-1-1zM5 15h14c.55 0 1-.45 1-1s-.45-1-1-1H5c-.55 0-1 .45-1 1s.45 1 1 1zM4 6c0 .55.45 1 1 1h14c.55 0 1-.45 1-1s-.45-1-1-1H5c-.55 0-1 .45-1 1z"/></svg>' /> <span className="">{record.description.display_value}</span></p>
										<p><span className="key">Work Notes:</span> <span className=""></span></p>
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
										<div className="tags">
											<div>{record.cmdb_ci.display_value + " (Tags)"}&nbsp;</div>
											{record.tags && record.tags.length > 0 ? record.tags.map((tag) =>
												<div className="broker-tag"><span className="tag-key">{tag.key}:</span> {tag.value}</div>
											):
												<div className="broker-tag"><span className="tag-key">No Tags</span></div>
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
								{state.activeTabIndex == 4 && (
									<div className="card-body">
										<p className="description"><now-rich-text className="g-icon" html='<svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 0 24 24" width="18px"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M13 17H5c-.55 0-1 .45-1 1s.45 1 1 1h8c.55 0 1-.45 1-1s-.45-1-1-1zm6-8H5c-.55 0-1 .45-1 1s.45 1 1 1h14c.55 0 1-.45 1-1s-.45-1-1-1zM5 15h14c.55 0 1-.45 1-1s-.45-1-1-1H5c-.55 0-1 .45-1 1s.45 1 1 1zM4 6c0 .55.45 1 1 1h14c.55 0 1-.45 1-1s-.45-1-1-1H5c-.55 0-1 .45-1 1z"/></svg>' /> <span className="">{record.description.display_value}</span></p>
										<p><span className="key">Changes:</span> Coming Soon...</p>
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

const refreshMainQuery = (state, dispatch) => {
	console.log("refreshMainQuery");
	console.log("state: ", state);
	dispatch('FETCH_PARENT_RECORD', {
		table: 'em_alert',
		sysparm_query: 'number=' + state.properties.focusedRecordNumber,
		sysparm_fields: 'number,sys_id,parent,cmdb_ci,description,severity,sys_updated_on,source,group_source,type,additional_info,node,incident,incident.assignment_group,state,resource,assignment_group,message_key,cmdb_ci.sys_class_name,sys_created_on,initial_remote_time,event_count,assigned_to,acknowledged',
		sysparm_display_value: 'all'
	});
}

createCustomElement('snc-alert-email-preview', {
	renderer: {type: snabbdom},
	view,
	styles,
	actionHandlers: {
		[COMPONENT_PROPERTY_CHANGED]: (coeffects) => {
			const { dispatch, action, state } = coeffects;
			console.log('COMPONENT_PROPERTY_CHANGED payload: ', action.payload);
			refreshMainQuery(state, dispatch);
		},
		[COMPONENT_BOOTSTRAPPED]: (coeffects) => {
			const { state, dispatch } = coeffects;
			console.log("COMPONENT_BOOTSTRAPPED");
			refreshMainQuery(state, dispatch);
		},
		'FETCH_PARENT_RECORD': createHttpEffect('/api/now/table/:table', {
			batch: false,
			method: 'GET',
			pathParams: ['table'],
			queryParams: ['sysparm_query', 'sysparm_fields', 'sysparm_display_value'],
			successActionType: 'FETCH_PARENT_RECORD_SUCCESS'
		}),
		'FETCH_PARENT_RECORD_SUCCESS': (coeffects) => {
			const { action, state, dispatch, updateState } = coeffects;
			console.log('%cFETCH_PARENT_RECORD_SUCCESS', 'color:green');
			console.log("%cpayload: %o", 'color:green', action.payload);
			updateState({parentRecord: action.payload.result});
			dispatch('FETCH_CHILD_RECORD', {
				table: 'em_alert',
				sysparm_query: 'parent.number=' + state.properties.focusedRecordNumber,
				sysparm_fields: 'number,sys_id,parent,cmdb_ci,description,severity,sys_updated_on,source,group_source,type,additional_info,node,incident,incident.assignment_group,state,resource,assignment_group,message_key,cmdb_ci.sys_class_name,sys_created_on,initial_remote_time,event_count,assigned_to,acknowledged',
				sysparm_display_value: 'all'
			});
		},
		'FETCH_CHILD_RECORD': createHttpEffect('/api/now/table/:table', {
			batch: false,
			method: 'GET',
			pathParams: ['table'],
			queryParams: ['sysparm_query', 'sysparm_fields', 'sysparm_display_value'],
			successActionType: 'FETCH_CHILD_RECORD_SUCCESS'
		}),
		'FETCH_CHILD_RECORD_SUCCESS': (coeffects) => {
			const { action, state, dispatch, updateState } = coeffects;
			console.log('%cFETCH_CHILD_RECORD_SUCCESS', 'color:green');
			console.log("%cpayload: %o", 'color:green', action.payload);
			updateState({secondaryRecords: action.payload.result});
			dispatch('START_FETCH_WORK_NOTES');
			dispatch('START_FETCH_KEYS');
		},
		'START_FETCH_WORK_NOTES': (coeffects) => {
			const { state, dispatch } = coeffects;
			let recordIDs = [];
			let sysparm = "name=em_alert^element_idIN";
			state.parentRecord.forEach((record) => {
				recordIDs.push(record.sys_id.value);
			});
			state.secondaryRecords.forEach((record) => {
				recordIDs.push(record.sys_id.value);
			});
			dispatch('FETCH_WORK_NOTES', {
				table: 'sys_journal_field',
				sysparm_query: sysparm + recordIDs.toString() + "^ORDERBYDESCsys_created_on",
				sysparm_fields: 'sys_created_on,value,element_id,sys_created_by',
				sysparm_display_value: 'all'
			});
		},
		'FETCH_WORK_NOTES': createHttpEffect('/api/now/table/:table', {
			batch: false,
			method: 'GET',
			pathParams: ['table'],
			queryParams: ['sysparm_query', 'sysparm_fields', 'sysparm_display_value'],
			successActionType: 'FETCH_WORK_NOTES_SUCCESS'
		}),
		'FETCH_WORK_NOTES_SUCCESS': (coeffects) => {
			const { action, state, updateProperties, updateState, dispatch } = coeffects;
			console.log('FETCH_WORK_NOTES_SUCCESS');
			console.log("result: ", action.payload.result);
			let updatedParentRecord = state.parentRecord;
			let updatedSecondaryRecords = state.secondaryRecords;
			action.payload.result.forEach((result) => {
				result.value.display_value = result.value.display_value.replaceAll("[code]","");
				result.value.display_value = result.value.display_value.replaceAll("[/code]","");
				result.value.value = result.value.value.replaceAll("[code]","");
				result.value.value = result.value.value.replaceAll("[/code]","");
				let parentMatchIndex = updatedParentRecord.findIndex((record) => record.sys_id.value == result.element_id.value);
				if (parentMatchIndex > -1) {
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
		'START_FETCH_KEYS': (coeffects) => {
			const { state, dispatch } = coeffects;
			let ciArray = [];
			let sysparm = "configuration_itemIN";
			state.parentRecord.forEach((record) => {
				if (record.cmdb_ci.value != "") {
					ciArray.push(record.cmdb_ci.value);
				}
			});
			state.secondaryRecords.forEach((record) => {
				if (record.cmdb_ci.value != "") {
					ciArray.push(record.cmdb_ci.value);
				}
			});
			dispatch('FETCH_KEYS', {
				table: 'cmdb_key_value',
				sysparm_query: sysparm + ciArray.toString() + "^ORDERBYkey",
				sysparm_fields: 'configuration_item,key,value',
				sysparm_display_value: 'all'
			});
		},
		'FETCH_KEYS': createHttpEffect('/api/now/table/:table', {
			batch: false,
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
						parentRecord.tags.push({key: result.key.display_value, value: result.value.display_value});
					}
				});
				updatedSecondaryRecords.forEach((secondaryRecord) => {
					if (!secondaryRecord.tags) {
						secondaryRecord.tags = [];
					}
					if (secondaryRecord.cmdb_ci.value == result.configuration_item.value) {
						secondaryRecord.tags.push({key: result.key.display_value, value: result.value.display_value});
					}
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
				sysparm_fields: 'user_name,avatar',
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
								parentWorkNote.sys_created_by.avatar = result.avatar.display_value;
							}
						});
					}
				});
				updatedSecondaryRecords.forEach((secondaryRow) => {
					if (secondaryRow.work_notes) {
						secondaryRow.work_notes.forEach((secondaryWorkNote) => {
							if (result.user_name.value == secondaryWorkNote.sys_created_by.value) {
								secondaryWorkNote.sys_created_by.avatar = result.avatar.display_value;
							}
						});
					}
				});
			});
			updateState({parentRecord: updatedParentRecord, secondaryRecords: updatedSecondaryRecords, dummyStateChange: !state.dummyStateChange});
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
			secondaryRecords: []
		}
	}
});

//How to properly render an svg
{/* <svg attrs={{xmlns: "http://www.w3.org/2000/svg", height: "18px", width: "18px", viewBox: "0 0 24 24", class: "g-icon"}}><path attr-d="M0 0h24v24H0V0z" attr-fill="none"/><path attr-d="M13 17H5c-.55 0-1 .45-1 1s.45 1 1 1h8c.55 0 1-.45 1-1s-.45-1-1-1zm6-8H5c-.55 0-1 .45-1 1s.45 1 1 1h14c.55 0 1-.45 1-1s-.45-1-1-1zM5 15h14c.55 0 1-.45 1-1s-.45-1-1-1H5c-.55 0-1 .45-1 1s.45 1 1 1zM4 6c0 .55.45 1 1 1h14c.55 0 1-.45 1-1s-.45-1-1-1H5c-.55 0-1 .45-1 1z"/></svg> */}