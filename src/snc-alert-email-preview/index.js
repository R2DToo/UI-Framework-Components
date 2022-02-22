import {createCustomElement, actionTypes} from '@servicenow/ui-core';
const { COMPONENT_PROPERTY_CHANGED} = actionTypes;
import {createHttpEffect} from '@servicenow/ui-effect-http';
import snabbdom from '@servicenow/ui-renderer-snabbdom';
import styles from './styles.scss';
import '@servicenow/now-icon';
import '@servicenow/now-highlighted-value';
import '@servicenow/now-rich-text';

const view = (state, {updateState, dispatch}) => {
	console.log('snc-alert-email-preview state: ', state);

	return (
		<div id="info-container">
			<div id="info-header">
				<h1><now-rich-text className="g-icon" onclick={() => {dispatch("CLOSE_INFO_BUTTON#CLICKED")}} html='<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M13.89 8.7L12 10.59 10.11 8.7c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41L10.59 12 8.7 13.89c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0L12 13.41l1.89 1.89c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L13.41 12l1.89-1.89c.39-.39.39-1.02 0-1.41-.39-.38-1.03-.38-1.41 0zM12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg>'/>Total Clustered Alerts (<span className="primary-color">{state.properties.focusedChildRecords.length}</span>)</h1>
			</div>
			<div id="cards-header">
				<div className="tabset">
					<input type="radio" name="tabset" id="tab0" aria-controls="alerts" checked onchange={() => {updateState({activeTabIndex: 0})}}/>
					<label for="tab0">Alerts</label>
					<input type="radio" name="tabset" id="tab1" aria-controls="activity" onchange={() => {updateState({activeTabIndex: 1})}}/>
					<label for="tab1">Activity</label>
					<input type="radio" name="tabset" id="tab2" aria-controls="tags" onchange={() => {updateState({activeTabIndex: 2})}}/>
					<label for="tab2">Tags</label>
					<input type="radio" name="tabset" id="tab3" aria-controls="additional" onchange={() => {updateState({activeTabIndex: 3})}}/>
					<label for="tab3">Additional</label>
					<input type="radio" name="tabset" id="tab4" aria-controls="changes" onchange={() => {updateState({activeTabIndex: 4})}}/>
					<label for="tab4">Changes</label>
				</div>
			</div>
			<div id="info-cards">
				<ul>
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
							<li className="info-card">
								<div className="card-header">
									<div className="record-link" onclick={() => {dispatch("RECORD_LINK#CLICKED", {value: record._row_data.uniqueValue})}}>{record._row_data.displayValue}</div>
									<div className="right"><now-rich-text className="g-icon" html='<svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 0 24 24" width="18px"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M17.81 4.47c-.08 0-.16-.02-.23-.06C15.66 3.42 14 3 12.01 3c-1.98 0-3.86.47-5.57 1.41-.24.13-.54.04-.68-.2-.13-.24-.04-.55.2-.68C7.82 2.52 9.86 2 12.01 2c2.13 0 3.99.47 6.03 1.52.25.13.34.43.21.67-.09.18-.26.28-.44.28zM3.5 9.72c-.1 0-.2-.03-.29-.09-.23-.16-.28-.47-.12-.7.99-1.4 2.25-2.5 3.75-3.27C9.98 4.04 14 4.03 17.15 5.65c1.5.77 2.76 1.86 3.75 3.25.16.22.11.54-.12.7-.23.16-.54.11-.7-.12-.9-1.26-2.04-2.25-3.39-2.94-2.87-1.47-6.54-1.47-9.4.01-1.36.7-2.5 1.7-3.4 2.96-.08.14-.23.21-.39.21zm6.25 12.07c-.13 0-.26-.05-.35-.15-.87-.87-1.34-1.43-2.01-2.64-.69-1.23-1.05-2.73-1.05-4.34 0-2.97 2.54-5.39 5.66-5.39s5.66 2.42 5.66 5.39c0 .28-.22.5-.5.5s-.5-.22-.5-.5c0-2.42-2.09-4.39-4.66-4.39s-4.66 1.97-4.66 4.39c0 1.44.32 2.77.93 3.85.64 1.15 1.08 1.64 1.85 2.42.19.2.19.51 0 .71-.11.1-.24.15-.37.15zm7.17-1.85c-1.19 0-2.24-.3-3.1-.89-1.49-1.01-2.38-2.65-2.38-4.39 0-.28.22-.5.5-.5s.5.22.5.5c0 1.41.72 2.74 1.94 3.56.71.48 1.54.71 2.54.71.24 0 .64-.03 1.04-.1.27-.05.53.13.58.41.05.27-.13.53-.41.58-.57.11-1.07.12-1.21.12zM14.91 22c-.04 0-.09-.01-.13-.02-1.59-.44-2.63-1.03-3.72-2.1-1.4-1.39-2.17-3.24-2.17-5.22 0-1.62 1.38-2.94 3.08-2.94s3.08 1.32 3.08 2.94c0 1.07.93 1.94 2.08 1.94s2.08-.87 2.08-1.94c0-3.77-3.25-6.83-7.25-6.83-2.84 0-5.44 1.58-6.61 4.03-.39.81-.59 1.76-.59 2.8 0 .78.07 2.01.67 3.61.1.26-.03.55-.29.64-.26.1-.55-.04-.64-.29-.49-1.31-.73-2.61-.73-3.96 0-1.2.23-2.29.68-3.24 1.33-2.79 4.28-4.6 7.51-4.6 4.55 0 8.25 3.51 8.25 7.83 0 1.62-1.38 2.94-3.08 2.94s-3.08-1.32-3.08-2.94c0-1.07-.93-1.94-2.08-1.94s-2.08.87-2.08 1.94c0 1.71.66 3.31 1.87 4.51.95.94 1.86 1.46 3.27 1.85.27.07.42.35.35.61-.05.23-.26.38-.47.38z"/></svg>'/> {record.source.displayValue}</div>
									<div className=""><now-highlighted-value label={record.severity.displayValue} color={color} variant="secondary"/></div>
									<div className="right"><now-rich-text className="g-icon" html='<svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="18px" viewBox="0 0 24 24" width="18px"><g><rect fill="none" height="24" width="24"/></g><g><g><path d="M11,8.75v3.68c0,0.35,0.19,0.68,0.49,0.86l3.12,1.85c0.36,0.21,0.82,0.09,1.03-0.26c0.21-0.36,0.1-0.82-0.26-1.03 l-2.87-1.71v-3.4C12.5,8.34,12.16,8,11.75,8S11,8.34,11,8.75z M21,9.5V4.21c0-0.45-0.54-0.67-0.85-0.35l-1.78,1.78 c-1.81-1.81-4.39-2.85-7.21-2.6c-4.19,0.38-7.64,3.75-8.1,7.94C2.46,16.4,6.69,21,12,21c4.59,0,8.38-3.44,8.93-7.88 c0.07-0.6-0.4-1.12-1-1.12c-0.5,0-0.92,0.37-0.98,0.86c-0.43,3.49-3.44,6.19-7.05,6.14c-3.71-0.05-6.84-3.18-6.9-6.9 C4.94,8.2,8.11,5,12,5c1.93,0,3.68,0.79,4.95,2.05l-2.09,2.09C14.54,9.46,14.76,10,15.21,10h5.29C20.78,10,21,9.78,21,9.5z"/></g></g></svg>'/> {record.sys_updated_on.displayValue}</div>
								</div>
								{state.activeTabIndex == 0 && (
									<div className="card-body alerts">
										<p className="description"><now-rich-text className="g-icon" html='<svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 0 24 24" width="18px"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M14.59 2.59c-.38-.38-.89-.59-1.42-.59H6c-1.1 0-2 .9-2 2v16c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8.83c0-.53-.21-1.04-.59-1.41l-4.82-4.83zM15 18H9c-.55 0-1-.45-1-1s.45-1 1-1h6c.55 0 1 .45 1 1s-.45 1-1 1zm0-4H9c-.55 0-1-.45-1-1s.45-1 1-1h6c.55 0 1 .45 1 1s-.45 1-1 1zm-2-6V3.5L18.5 9H14c-.55 0-1-.45-1-1z"/></svg>' /> <span className="">{record.description.displayValue}</span></p>
										<div className="column">
											<p><span className="key">CI:</span> <span className="">{record.cmdb_ci.displayValue}</span></p>
											<p><span className="key">Group:</span> <span className="">{record.group_source.displayValue}</span></p>
											<p><span className="key">Type:</span> <span className="">{record.type.displayValue}</span></p>
											<p><span className="key">Incident:</span> <span className="">{record.incident.displayValue}</span></p>
											<p className="bottom"><span className="key">Node:</span> <span className="">{record.node.displayValue}</span></p>
										</div>
										<div className="column">
											<p><span className="key">CI Class:</span> <span className="">{record.cmdb_ci._reference.sys_class_name.displayValue}</span></p>
											<p><span className="key">State:</span> <span className="">{record.state.displayValue}</span></p>
											<p><span className="key">Resource:</span> <span className="">{record.resource.displayValue}</span></p>
											<p><span className="key">Assigned Team:</span> <span className="">{record.assignment_group.displayValue}</span></p>
											<p className="bottom"><span className="key">Message Key:</span> <span className="">{record.message_key.displayValue}</span></p>
										</div>
									</div>
								)}
								{state.activeTabIndex == 1 && (
									<div className="card-body">
										<p className="description"><now-rich-text className="g-icon" html='<svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 0 24 24" width="18px"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M14.59 2.59c-.38-.38-.89-.59-1.42-.59H6c-1.1 0-2 .9-2 2v16c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8.83c0-.53-.21-1.04-.59-1.41l-4.82-4.83zM15 18H9c-.55 0-1-.45-1-1s.45-1 1-1h6c.55 0 1 .45 1 1s-.45 1-1 1zm0-4H9c-.55 0-1-.45-1-1s.45-1 1-1h6c.55 0 1 .45 1 1s-.45 1-1 1zm-2-6V3.5L18.5 9H14c-.55 0-1-.45-1-1z"/></svg>' /> <span className="">{record.description.displayValue}</span></p>
										{record.work_notes.map((note) =>
											<p><now-rich-text className="g-icon" html='<svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="18px" viewBox="0 0 24 24" width="18px"><g><rect fill="none" height="24" width="24"/><path d="M18,3h-3.18C14.4,1.84,13.3,1,12,1S9.6,1.84,9.18,3H6C4.9,3,4,3.9,4,5v15c0,1.1,0.9,2,2,2h6.11 c-0.59-0.57-1.07-1.25-1.42-2H6V5h2v1c0,1.1,0.9,2,2,2h4c1.1,0,2-0.9,2-2V5h2v5.08c0.71,0.1,1.38,0.31,2,0.6V5C20,3.9,19.1,3,18,3z M12,5c-0.55,0-1-0.45-1-1c0-0.55,0.45-1,1-1c0.55,0,1,0.45,1,1C13,4.55,12.55,5,12,5z M17,12c-2.76,0-5,2.24-5,5s2.24,5,5,5 c2.76,0,5-2.24,5-5S19.76,12,17,12z M18.29,19l-1.65-1.65c-0.09-0.09-0.15-0.22-0.15-0.35l0-2.49c0-0.28,0.22-0.5,0.5-0.5h0 c0.28,0,0.5,0.22,0.5,0.5l0,2.29l1.5,1.5c0.2,0.2,0.2,0.51,0,0.71v0C18.8,19.2,18.49,19.2,18.29,19z"/></g></svg>'/> <span className="key">Work Note:</span> <now-rich-text html={note.value}/></p>
										)}
									</div>
								)}
								{state.activeTabIndex == 2 && (
									<div className="card-body">
										<p className="description"><now-rich-text className="g-icon" html='<svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 0 24 24" width="18px"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M14.59 2.59c-.38-.38-.89-.59-1.42-.59H6c-1.1 0-2 .9-2 2v16c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8.83c0-.53-.21-1.04-.59-1.41l-4.82-4.83zM15 18H9c-.55 0-1-.45-1-1s.45-1 1-1h6c.55 0 1 .45 1 1s-.45 1-1 1zm0-4H9c-.55 0-1-.45-1-1s.45-1 1-1h6c.55 0 1 .45 1 1s-.45 1-1 1zm-2-6V3.5L18.5 9H14c-.55 0-1-.45-1-1z"/></svg>' /> <span className="">{record.description.displayValue}</span></p>
										<p><span className="key">Tags:</span> Coming Soon...</p>
									</div>
								)}
								{state.activeTabIndex == 3 && (
									<div className="card-body overflow">
										<p className="description"><now-rich-text className="g-icon" html='<svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 0 24 24" width="18px"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M14.59 2.59c-.38-.38-.89-.59-1.42-.59H6c-1.1 0-2 .9-2 2v16c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8.83c0-.53-.21-1.04-.59-1.41l-4.82-4.83zM15 18H9c-.55 0-1-.45-1-1s.45-1 1-1h6c.55 0 1 .45 1 1s-.45 1-1 1zm0-4H9c-.55 0-1-.45-1-1s.45-1 1-1h6c.55 0 1 .45 1 1s-.45 1-1 1zm-2-6V3.5L18.5 9H14c-.55 0-1-.45-1-1z"/></svg>' /> <span className="">{record.description.displayValue}</span></p>
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
										<p className="description"><now-rich-text className="g-icon" html='<svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 0 24 24" width="18px"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M14.59 2.59c-.38-.38-.89-.59-1.42-.59H6c-1.1 0-2 .9-2 2v16c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8.83c0-.53-.21-1.04-.59-1.41l-4.82-4.83zM15 18H9c-.55 0-1-.45-1-1s.45-1 1-1h6c.55 0 1 .45 1 1s-.45 1-1 1zm0-4H9c-.55 0-1-.45-1-1s.45-1 1-1h6c.55 0 1 .45 1 1s-.45 1-1 1zm-2-6V3.5L18.5 9H14c-.55 0-1-.45-1-1z"/></svg>' /> <span className="">{record.description.displayValue}</span></p>
										<p><span className="key">Changes:</span> Coming Soon...</p>
									</div>
								)}
							</li>
						)
					})}
					{state.activeTabIndex != 1 && state.properties.focusedChildRecords.map((record) => {
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
									<div className="record-link" onclick={() => {dispatch("RECORD_LINK#CLICKED", {value: record._row_data.uniqueValue})}}>{record._row_data.displayValue}</div>
									<div className="right"><now-rich-text className="g-icon" html='<svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 0 24 24" width="18px"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M17.81 4.47c-.08 0-.16-.02-.23-.06C15.66 3.42 14 3 12.01 3c-1.98 0-3.86.47-5.57 1.41-.24.13-.54.04-.68-.2-.13-.24-.04-.55.2-.68C7.82 2.52 9.86 2 12.01 2c2.13 0 3.99.47 6.03 1.52.25.13.34.43.21.67-.09.18-.26.28-.44.28zM3.5 9.72c-.1 0-.2-.03-.29-.09-.23-.16-.28-.47-.12-.7.99-1.4 2.25-2.5 3.75-3.27C9.98 4.04 14 4.03 17.15 5.65c1.5.77 2.76 1.86 3.75 3.25.16.22.11.54-.12.7-.23.16-.54.11-.7-.12-.9-1.26-2.04-2.25-3.39-2.94-2.87-1.47-6.54-1.47-9.4.01-1.36.7-2.5 1.7-3.4 2.96-.08.14-.23.21-.39.21zm6.25 12.07c-.13 0-.26-.05-.35-.15-.87-.87-1.34-1.43-2.01-2.64-.69-1.23-1.05-2.73-1.05-4.34 0-2.97 2.54-5.39 5.66-5.39s5.66 2.42 5.66 5.39c0 .28-.22.5-.5.5s-.5-.22-.5-.5c0-2.42-2.09-4.39-4.66-4.39s-4.66 1.97-4.66 4.39c0 1.44.32 2.77.93 3.85.64 1.15 1.08 1.64 1.85 2.42.19.2.19.51 0 .71-.11.1-.24.15-.37.15zm7.17-1.85c-1.19 0-2.24-.3-3.1-.89-1.49-1.01-2.38-2.65-2.38-4.39 0-.28.22-.5.5-.5s.5.22.5.5c0 1.41.72 2.74 1.94 3.56.71.48 1.54.71 2.54.71.24 0 .64-.03 1.04-.1.27-.05.53.13.58.41.05.27-.13.53-.41.58-.57.11-1.07.12-1.21.12zM14.91 22c-.04 0-.09-.01-.13-.02-1.59-.44-2.63-1.03-3.72-2.1-1.4-1.39-2.17-3.24-2.17-5.22 0-1.62 1.38-2.94 3.08-2.94s3.08 1.32 3.08 2.94c0 1.07.93 1.94 2.08 1.94s2.08-.87 2.08-1.94c0-3.77-3.25-6.83-7.25-6.83-2.84 0-5.44 1.58-6.61 4.03-.39.81-.59 1.76-.59 2.8 0 .78.07 2.01.67 3.61.1.26-.03.55-.29.64-.26.1-.55-.04-.64-.29-.49-1.31-.73-2.61-.73-3.96 0-1.2.23-2.29.68-3.24 1.33-2.79 4.28-4.6 7.51-4.6 4.55 0 8.25 3.51 8.25 7.83 0 1.62-1.38 2.94-3.08 2.94s-3.08-1.32-3.08-2.94c0-1.07-.93-1.94-2.08-1.94s-2.08.87-2.08 1.94c0 1.71.66 3.31 1.87 4.51.95.94 1.86 1.46 3.27 1.85.27.07.42.35.35.61-.05.23-.26.38-.47.38z"/></svg>'/> {record.source.displayValue}</div>
									<div className=""><now-highlighted-value label={record.severity.displayValue} color={color} variant="secondary"/></div>
									<div className="right"><now-rich-text className="g-icon" html='<svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="18px" viewBox="0 0 24 24" width="18px"><g><rect fill="none" height="24" width="24"/></g><g><g><path d="M11,8.75v3.68c0,0.35,0.19,0.68,0.49,0.86l3.12,1.85c0.36,0.21,0.82,0.09,1.03-0.26c0.21-0.36,0.1-0.82-0.26-1.03 l-2.87-1.71v-3.4C12.5,8.34,12.16,8,11.75,8S11,8.34,11,8.75z M21,9.5V4.21c0-0.45-0.54-0.67-0.85-0.35l-1.78,1.78 c-1.81-1.81-4.39-2.85-7.21-2.6c-4.19,0.38-7.64,3.75-8.1,7.94C2.46,16.4,6.69,21,12,21c4.59,0,8.38-3.44,8.93-7.88 c0.07-0.6-0.4-1.12-1-1.12c-0.5,0-0.92,0.37-0.98,0.86c-0.43,3.49-3.44,6.19-7.05,6.14c-3.71-0.05-6.84-3.18-6.9-6.9 C4.94,8.2,8.11,5,12,5c1.93,0,3.68,0.79,4.95,2.05l-2.09,2.09C14.54,9.46,14.76,10,15.21,10h5.29C20.78,10,21,9.78,21,9.5z"/></g></g></svg>'/> {record.sys_updated_on.displayValue}</div>
								</div>
								{state.activeTabIndex == 0 && (
									<div className="card-body alerts">
										<p className="description"><now-rich-text className="g-icon" html='<svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 0 24 24" width="18px"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M14.59 2.59c-.38-.38-.89-.59-1.42-.59H6c-1.1 0-2 .9-2 2v16c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8.83c0-.53-.21-1.04-.59-1.41l-4.82-4.83zM15 18H9c-.55 0-1-.45-1-1s.45-1 1-1h6c.55 0 1 .45 1 1s-.45 1-1 1zm0-4H9c-.55 0-1-.45-1-1s.45-1 1-1h6c.55 0 1 .45 1 1s-.45 1-1 1zm-2-6V3.5L18.5 9H14c-.55 0-1-.45-1-1z"/></svg>' /> <span className="">{record.description.displayValue}</span></p>
										<div className="column">
											<p><span className="key">CI:</span> <span className="">{record.cmdb_ci.displayValue}</span></p>
											<p><span className="key">Group:</span> <span className="">{record.group_source.displayValue}</span></p>
											<p><span className="key">Type:</span> <span className="">{record.type.displayValue}</span></p>
											<p><span className="key">Incident:</span> <span className="">{record.incident.displayValue}</span></p>
											<p><span className="key">Node:</span> <span className="">{record.node.displayValue}</span></p>
										</div>
										<div className="column">
											<p><span className="key">CI Class:</span> <span className="">{record.cmdb_ci._reference.sys_class_name.displayValue}</span></p>
											<p><span className="key">State:</span> <span className="">{record.state.displayValue}</span></p>
											<p><span className="key">Resource:</span> <span className="">{record.resource.displayValue}</span></p>
											<p><span className="key">Assigned Team:</span> <span className="">{record.assignment_group.displayValue}</span></p>
											<p><span className="key">Message Key:</span> <span className="">{record.message_key.displayValue}</span></p>
										</div>
									</div>
								)}
								{state.activeTabIndex == 1 && (
									<div className="card-body">
										<p className="description"><now-rich-text className="g-icon" html='<svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 0 24 24" width="18px"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M14.59 2.59c-.38-.38-.89-.59-1.42-.59H6c-1.1 0-2 .9-2 2v16c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8.83c0-.53-.21-1.04-.59-1.41l-4.82-4.83zM15 18H9c-.55 0-1-.45-1-1s.45-1 1-1h6c.55 0 1 .45 1 1s-.45 1-1 1zm0-4H9c-.55 0-1-.45-1-1s.45-1 1-1h6c.55 0 1 .45 1 1s-.45 1-1 1zm-2-6V3.5L18.5 9H14c-.55 0-1-.45-1-1z"/></svg>' /> <span className="">{record.description.displayValue}</span></p>
									</div>
								)}
								{state.activeTabIndex == 2 && (
									<div className="card-body">
										<p className="description"><now-rich-text className="g-icon" html='<svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 0 24 24" width="18px"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M14.59 2.59c-.38-.38-.89-.59-1.42-.59H6c-1.1 0-2 .9-2 2v16c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8.83c0-.53-.21-1.04-.59-1.41l-4.82-4.83zM15 18H9c-.55 0-1-.45-1-1s.45-1 1-1h6c.55 0 1 .45 1 1s-.45 1-1 1zm0-4H9c-.55 0-1-.45-1-1s.45-1 1-1h6c.55 0 1 .45 1 1s-.45 1-1 1zm-2-6V3.5L18.5 9H14c-.55 0-1-.45-1-1z"/></svg>' /> <span className="">{record.description.displayValue}</span></p>
										<p><span className="key">Tags:</span> Coming Soon...</p>
									</div>
								)}
								{state.activeTabIndex == 3 && (
									<div className="card-body overflow">
										<p className="description"><now-rich-text className="g-icon" html='<svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 0 24 24" width="18px"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M14.59 2.59c-.38-.38-.89-.59-1.42-.59H6c-1.1 0-2 .9-2 2v16c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8.83c0-.53-.21-1.04-.59-1.41l-4.82-4.83zM15 18H9c-.55 0-1-.45-1-1s.45-1 1-1h6c.55 0 1 .45 1 1s-.45 1-1 1zm0-4H9c-.55 0-1-.45-1-1s.45-1 1-1h6c.55 0 1 .45 1 1s-.45 1-1 1zm-2-6V3.5L18.5 9H14c-.55 0-1-.45-1-1z"/></svg>' /> <span className="">{record.description.displayValue}</span></p>
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
										<p className="description"><now-rich-text className="g-icon" html='<svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 0 24 24" width="18px"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M14.59 2.59c-.38-.38-.89-.59-1.42-.59H6c-1.1 0-2 .9-2 2v16c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8.83c0-.53-.21-1.04-.59-1.41l-4.82-4.83zM15 18H9c-.55 0-1-.45-1-1s.45-1 1-1h6c.55 0 1 .45 1 1s-.45 1-1 1zm0-4H9c-.55 0-1-.45-1-1s.45-1 1-1h6c.55 0 1 .45 1 1s-.45 1-1 1zm-2-6V3.5L18.5 9H14c-.55 0-1-.45-1-1z"/></svg>' /> <span className="">{record.description.displayValue}</span></p>
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

createCustomElement('snc-alert-email-preview', {
	renderer: {type: snabbdom},
	view,
	styles,
	actionHandlers: {
		[COMPONENT_PROPERTY_CHANGED]: (coeffects) => {
			const { dispatch, action } = coeffects;
			if (action.payload.name == "focusedRecord") {
				let sysparam = "name=em_alert^element_idIN";
				for (let i = 0; i < action.payload.value.length; i++) {
					sysparam += action.payload.value[i]._row_data.uniqueValue + ",";
				}
				if (sysparam.charAt(sysparam.length - 1) == ",") {
					sysparam = sysparam.substring(0, sysparam.length - 1);
				}
				dispatch('FETCH_WORK_NOTES', {
						sysparm_query: sysparam,
						sysparm_fields: 'sys_created_on,value,element_id'
				});
			}
		},
		'FETCH_WORK_NOTES': createHttpEffect('api/now/table/sys_journal_field', {
			method: 'GET',
			queryParams: ['sysparm_query','sysparm_fields'],
			successActionType: 'FETCH_WORK_NOTES_SUCCESS'
		}),
		'FETCH_WORK_NOTES_SUCCESS': (coeffects) => {
			const { action, state, updateProperties, updateState } = coeffects;
			const { result } = action.payload;
			console.log("result: ", result);
			for(let i = 0; i < result.length; i++) {
				let matchIndex = state.properties.focusedRecord.findIndex((field) => field._row_data.uniqueValue == result[i].element_id);
				if (matchIndex > -1) {
					let match = state.properties.focusedRecord[matchIndex];
					result[i].value = result[i].value.replaceAll("[code]","");
					result[i].value = result[i].value.replaceAll("[/code]","");
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
