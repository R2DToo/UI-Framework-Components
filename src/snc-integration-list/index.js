import {createCustomElement, actionTypes} from '@servicenow/ui-core';
const {COMPONENT_ERROR_THROWN,COMPONENT_PROPERTY_CHANGED,COMPONENT_BOOTSTRAPPED} = actionTypes;
import snabbdom from '@servicenow/ui-renderer-snabbdom';
import {createHttpEffect} from '@servicenow/ui-effect-http';
import styles from './styles.scss';
import '../snc-integration-card';

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
	{key: 'gcp', value: googleSVG},
	{key: 'grafana', value: grafanaSVG},
	{key: 'hpom', value: microfocusSVG},
	{key: 'hyperic', value: vmwareSVG},
	{key: 'ibm', value: ibmSVG},
	{key: 'icinga', value: icingaSVG},
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
	{key: 'solarwinds', value: solarwindsSVG},
	{key: 'splunk', value: splunkSVG},
	{key: 'sumologic', value: sumologicSVG},
	{key: 'vcenter', value: vmwareSVG},
	{key: 'vrealize', value: vmwareSVG},
	{key: 'zabbix', value: zabbixSVG},
	{key: 'generic events', value: webhookSVG},
];

const view = (state, {updateState, dispatch}) => {
	console.log('snc-integration-list state: ', state);

	const activeCards = () => {
		let cards = state.searchValue == '' ? state.integrationCards : state.searchMatchingCards;
		if (cards.length == 0) {
			return <section></section>
		} else {
			let activeIntegrations = cards.filter((card) => card.active == "true");
			return <section>
				<div className="sticky">
					<h1 className="divider">Active Integrations</h1>
				</div>
				<div className="card-grid">
					{activeIntegrations.map((integrationCard) =>
						<snc-integration-card
							svgIcon={integrationCard.svgIcon}
							name={integrationCard.name}
							active={integrationCard.active}
							link={integrationCard.link}
							type={integrationCard.type}
							description={integrationCard.description}
							count={integrationCard.count}
						/>
					)}
				</div>
			</section>
		}
	}

	const inactiveCards = () => {
		let cards = state.searchValue == '' ? state.integrationCards : state.searchMatchingCards;
		if (cards.length == 0) {
			return <section></section>
		} else {
			let inactiveIntegrations = cards.filter((card) => card.active == "false");
			return <section>
				<div className="sticky">
					<h1 className="divider">Inactive Integrations</h1>
				</div>
				<div className="card-grid">
					{inactiveIntegrations.map((integrationCard) =>
						<snc-integration-card
							svgIcon={integrationCard.svgIcon}
							name={integrationCard.name}
							active={integrationCard.active}
							link={integrationCard.link}
							type={integrationCard.type}
							description={integrationCard.description}
							count={integrationCard.count}
						/>
					)}
				</div>
			</section>
		}
	};

	const contextMenuOptionClicked = (event, option) => {
		//event.stopPropagation();
		console.log("contextMenuOptionClicked: ", option);
		switch (option) {
			case 'new_push_connector':
				dispatch("EXTERNAL_LINK_CLICKED", {value: `/now/nav/ui/classic/params/target/sn_em_connector_listener.do`});
				break;
			case 'new_pull_connector':
				dispatch("EXTERNAL_LINK_CLICKED", {value: `/now/nav/ui/classic/params/target/em_connector_definition.do`});
				break;
			default: break;
		}
	};

	return (
		<div id="integration-container">
			{/* <div className="search-container">
				<input className="search-input" type="text" id="search" placeholder="Enter Integration Name" autocomplete="off" oninput={(e) => {dispatch("SEARCH_INPUTED", {value: e.target.value})}}/>
				<label className="search-label" for="search">
					<svg attrs={{xmlns: "http://www.w3.org/2000/svg", height: "24px", width: "24px", viewBox: "0 0 24 24"}}><path attr-d="M0 0h24v24H0V0z" attr-fill="none"/><path attr-d="M15.5 14h-.79l-.28-.27c1.2-1.4 1.82-3.31 1.48-5.34-.47-2.78-2.79-5-5.59-5.34-4.23-.52-7.79 3.04-7.27 7.27.34 2.8 2.56 5.12 5.34 5.59 2.03.34 3.94-.28 5.34-1.48l.27.28v.79l4.25 4.25c.41.41 1.08.41 1.49 0 .41-.41.41-1.08 0-1.49L15.5 14zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
				</label>
			</div> */}
			<section>
				<div className="sticky">
					<form className="search-container">
						<input type="text" id="search-bar" placeholder="Looking for a specific integration?" oninput={(e) => {dispatch("SEARCH_INPUTED", {value: e.target.value})}}/>
						<svg attrs={{class: "search-icon", xmlns: "http://www.w3.org/2000/svg", height: "24px", width: "24px", viewBox: "0 0 24 24"}}><path attr-d="M0 0h24v24H0V0z" attr-fill="none"/><path attr-d="M15.5 14h-.79l-.28-.27c1.2-1.4 1.82-3.31 1.48-5.34-.47-2.78-2.79-5-5.59-5.34-4.23-.52-7.79 3.04-7.27 7.27.34 2.8 2.56 5.12 5.34 5.59 2.03.34 3.94-.28 5.34-1.48l.27.28v.79l4.25 4.25c.41.41 1.08.41 1.49 0 .41-.41.41-1.08 0-1.49L15.5 14zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
					</form>
				</div>
			</section>
			{activeCards()}
			{inactiveCards()}
			<div class={{'context-menu-container': true, visible: state.showContextMenu}} style={{top: state.contextMenuTop, left: state.contextMenuLeft}}>
				<div className="context-menu">
					<ul className="context-menu-list">
						<li className="context-menu-item"><button className="context-menu-button" onclick={(e) => {contextMenuOptionClicked(e, 'new_push_connector')}}><svg attrs={{class: "context-menu-icon",xmlns: "http://www.w3.org/2000/svg", height: "24px", width: "24px", viewBox: "0 0 24 24"}}><path attr-d="M0 0h24v24H0V0z" attr-fill="none"/><path attr-d="M12 7c-.55 0-1 .45-1 1v3H8c-.55 0-1 .45-1 1s.45 1 1 1h3v3c0 .55.45 1 1 1s1-.45 1-1v-3h3c.55 0 1-.45 1-1s-.45-1-1-1h-3V8c0-.55-.45-1-1-1zm0-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg>New Webhook Connector</button></li>
						<li className="context-menu-item"><button className="context-menu-button" onclick={(e) => {contextMenuOptionClicked(e, 'new_pull_connector')}}><svg attrs={{class: "context-menu-icon",xmlns: "http://www.w3.org/2000/svg", height: "24px", width: "24px", viewBox: "0 0 24 24"}}><path attr-d="M0 0h24v24H0V0z" attr-fill="none"/><path attr-d="M12 7c-.55 0-1 .45-1 1v3H8c-.55 0-1 .45-1 1s.45 1 1 1h3v3c0 .55.45 1 1 1s1-.45 1-1v-3h3c.55 0 1-.45 1-1s-.45-1-1-1h-3V8c0-.55-.45-1-1-1zm0-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg>New Pull Connector</button></li>
						{/* <li className="context-menu-item"><button className="context-menu-button"><svg attrs={{class: "context-menu-icon",xmlns: "http://www.w3.org/2000/svg", height: "24px", width: "24px", viewBox: "0 0 24 24"}}><path attr-d="M0 0h24v24H0V0z" attr-fill="none"/><path attr-d="M11 15h2v-3h3v-2h-3V7h-2v3H8v2h3zM21 3H3c-1.11 0-2 .89-2 2v12c0 1.1.89 2 2 2h5v2h8v-2h5c1.1 0 2-.9 2-2V5c0-1.11-.9-2-2-2zm0 14H3V5h18v12z"/></svg>Share</button></li> */}
					</ul>
				</div>
			</div>
		</div>
	);
};

const findMatchingIcon = (name) => {
	let icon = webhookSVG;
	let match = INTEGRATION_ICONS.find((integration_icon) => name.toLowerCase().includes(integration_icon.key));
	if (match) {
		icon = match.value;
	}
	return icon;
}

const sortIntegrationCards = (a, b) => {
	if ( a.name.toLowerCase() < b.name.toLowerCase() ){
    return -1;
  }
  if ( a.name.toLowerCase() > b.name.toLowerCase() ){
    return 1;
  }
  return 0;
}

const cleanNames = (name) => {
	name = name.replace(/Push Connector/i, "");
	if (!name.toLowerCase().includes("logic")) {
		name = name.replace(/monitor/i, "");
	}
	name = name.replace(/SGO-/i, "");
	return name;
}

createCustomElement('snc-integration-list', {
	renderer: {type: snabbdom},
	view,
	styles,
	setInitialState({host, properties}) {
		return {
			integrationCards: [],
			searchMatchingCards: [],
			dummyStateChange: false,
			instanceName: '',
			searchValue: '',
			showContextMenu: false,
			contextMenuLeft: "0px",
			contextMenuTop: "0px",
		};
	},
	actionHandlers: {
		[COMPONENT_ERROR_THROWN]: (coeffects) => {
			console.log("%cERROR_THROWN: %o", "color:red", coeffects.action.payload);
		},
		[COMPONENT_BOOTSTRAPPED]: (coeffects) => {
			const { dispatch } = coeffects;
			// dispatch('FETCH_INSTANCE_NAME', {
			// 	table: 'sys_properties',
			// 	sysparm_query: 'name=instance_name',
			// 	sysparm_fields: 'value',
			// 	sysparm_display_value: 'true'
			// });
			dispatch('FETCH_PUSH_CONNECTORS', {
				table: 'sn_em_connector_listener',
				sysparm_query: 'type=1^ORDERBYname',
				sysparm_fields: 'name,active,source,sys_id',
				sysparm_display_value: 'true'
			});
		},
		'FETCH_INSTANCE_NAME': createHttpEffect('/api/now/table/:table', {
			batch: false,
			method: 'GET',
			pathParams: ['table'],
			queryParams: ['sysparm_query', 'sysparm_fields', 'sysparm_display_value'],
			successActionType: 'FETCH_INSTANCE_NAME_SUCCESS'
		}),
		'FETCH_INSTANCE_NAME_SUCCESS': (coeffects) => {
			const { dispatch, updateState, action } = coeffects;
			console.log("FETCH_INSTANCE_NAME_SUCCESS payload: ", action.payload);
			if (action.payload && action.payload.result) {
				updateState({instanceName: action.payload.result[0].value});
			}
			dispatch('FETCH_PUSH_CONNECTORS', {
				table: 'sn_em_connector_listener',
				sysparm_query: 'type=1^ORDERBYname',
				sysparm_fields: 'name,active,source,sys_id',
				sysparm_display_value: 'true'
			});
		},
		'FETCH_PUSH_CONNECTORS': createHttpEffect('/api/now/table/:table', {
			batch: false,
			method: 'GET',
			pathParams: ['table'],
			queryParams: ['sysparm_query', 'sysparm_fields', 'sysparm_display_value'],
			successActionType: 'FETCH_PUSH_CONNECTORS_SUCCESS'
		}),
		'FETCH_PUSH_CONNECTORS_SUCCESS': (coeffects) => {
			const { dispatch, updateState, action, state } = coeffects;
			console.log("FETCH_PUSH_CONNECTORS_SUCCESS payload: ", action.payload);
			if (action.payload && action.payload.result) {
				let newIntegrationCards = [];
				action.payload.result.map((result) => {
					result.svgIcon = findMatchingIcon(result.name);
					result.name = cleanNames(result.name);
					result.type = "Webhook";
					result.description = "https://<INSTANCE_NAME>.service-now.com/api/sn_em_connector/em/inbound_event?source=" + result.source;
					result.link = "/now/nav/ui/classic/params/target/sn_em_connector_listener.do%3Fsys_id%3D" + result.sys_id;
					result.count = 0;
					newIntegrationCards.push(result);
				});
				newIntegrationCards.sort(sortIntegrationCards);
				updateState({integrationCards: newIntegrationCards});
			}
			dispatch('FETCH_PULL_CONNECTORS', {
				table: 'em_connector_definition',
				sysparm_query: 'ORDERBYname',
				sysparm_fields: 'name,sys_id',
				sysparm_display_value: 'true'
			});
		},
		'FETCH_PULL_CONNECTORS': createHttpEffect('/api/now/table/:table', {
			batch: false,
			method: 'GET',
			pathParams: ['table'],
			queryParams: ['sysparm_query', 'sysparm_fields', 'sysparm_display_value'],
			successActionType: 'FETCH_PULL_CONNECTORS_SUCCESS'
		}),
		'FETCH_PULL_CONNECTORS_SUCCESS': (coeffects) => {
			const { state, updateState, action, dispatch } = coeffects;
			console.log("FETCH_PULL_CONNECTORS_SUCCESS payload: ", action.payload);
			if (action.payload && action.payload.result) {
				let newIntegrationCards = state.integrationCards;
				action.payload.result.map((result) => {
					result.svgIcon = findMatchingIcon(result.name);
					result.name = cleanNames(result.name);
					result.type = "PULL";
					result.active = "false";
					result.description = "";
					result.link = "/now/nav/ui/classic/params/target/em_connector_definition.do%3Fsys_id%3D" + result.sys_id;
					result.count = 0;
					if (result.name.substring(result.name.length - 3) == "_V2") {
						console.log("V2 Found");
						let v1_index = newIntegrationCards.findIndex((integrationCard) => integrationCard.name == result.name.substring(0, result.name.length - 3));
						if (v1_index > -1) {
							newIntegrationCards.splice(v1_index, 1, result);
						} else {
							newIntegrationCards.push(result);
						}
					} else {
						newIntegrationCards.push(result);
					}
				});

				let pullConnectorCards = newIntegrationCards.filter((integrationCard) => integrationCard.type == "PULL");
				let pullConnectorArray = pullConnectorCards.map((pullConnect) => pullConnect.sys_id);
				dispatch('FETCH_ACTIVE_PULL_CONNECTORS', {
					table: 'em_connector_instance',
					sysparm_query: "connector_definitionIN" + pullConnectorArray.toString(),
					sysparm_fields: 'connector_definition,active,name,last_status,last_run_time,host',
					sysparm_display_value: 'all'
				});

				newIntegrationCards.sort(sortIntegrationCards);
				updateState({integrationCards: newIntegrationCards, dummyStateChange: !state.dummyStateChange});
			}
		},
		'FETCH_ACTIVE_PULL_CONNECTORS': createHttpEffect('/api/now/table/:table', {
			batch: false,
			method: 'GET',
			pathParams: ['table'],
			queryParams: ['sysparm_query', 'sysparm_fields', 'sysparm_display_value'],
			successActionType: 'FETCH_ACTIVE_PULL_CONNECTORS_SUCCESS'
		}),
		'FETCH_ACTIVE_PULL_CONNECTORS_SUCCESS': (coeffects) => {
			const { state, updateState, action } = coeffects;
			console.log("FETCH_ACTIVE_PULL_CONNECTORS_SUCCESS payload: ", action.payload);
			if (action.payload && action.payload.result) {
				let updatedCards = state.integrationCards;
				// If there are multiple instances on one pull definition then only the last active result is used. Should be updated to work with any amount
				action.payload.result.forEach((result) => {
					let matchIndex = updatedCards.findIndex((card) => card.sys_id == result.connector_definition.value);
					if (matchIndex > -1) {
						updatedCards[matchIndex].count += 1;
						updatedCards[matchIndex].active = result.active.display_value;
						updatedCards[matchIndex].description += `${result.name.display_value} - ${result.last_status.display_value} on ${result.last_run_time.display_value} HostIP: ${result.host.display_value}\n`;
					}
				});
				updateState({integrationCards: updatedCards, dummyStateChange: !state.dummyStateChange});
			}
		},
		'SEARCH_INPUTED': (coeffects) => {
			const { state, updateState, action } = coeffects;
			console.log("SEARCH_INPUTED payload: ", action.payload);
			let searchValue = action.payload.value.trim();
			updateState({searchValue: searchValue});
			if (searchValue.length > 0) {
				let newSearchedCards = state.integrationCards.filter((integrationCard) => integrationCard.name.toLowerCase().includes(searchValue.toLowerCase()));
				updateState({searchMatchingCards: newSearchedCards});
			}
		}
	},
	eventHandlers: [
		{
			events: ['contextmenu'],
			effect({state, updateState, action: {payload: {event}}}) {
				event.preventDefault();
				console.log(event.path);
				console.log("contextmenu");
				console.log(event);
				if (state.showContextMenu == false) {
					updateState({showContextMenu: true, contextMenuLeft: event.clientX + "px", contextMenuTop: event.offsetY + "px"});
				} else {
					updateState({showContextMenu: false, contextMenuLeft: "0px", contextMenuTop: "0px"});
				}
			}
		}
	]
});
