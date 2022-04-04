import {createCustomElement} from '@servicenow/ui-core';
import snabbdom from '@servicenow/ui-renderer-snabbdom';
import styles from './styles.scss';
import '../snc-alert-email-sidebar';
import '../snc-alert-email-message-list';
import '../snc-alert-email-preview';

import {DEFAULT_TABLE_DATA} from '../constants';

const view = (state, {updateState}) => {
	console.log('alert email view state: ', state);

	return (
		<div id="snc-alert-email-view">
			<snc-alert-email-sidebar currentUser={state.properties.currentUser} menuOptions={state.properties.menuOptions} externalSysparam={state.properties.externalSysparam}/>
			<snc-alert-email-message-list
				class={{showingInfo: state.showInfo}}
				showInfo={state.showInfo}
				tableName={state.properties.tableName}
				listSysparam={state.properties.listSysparam}
				externalSysparam={state.properties.externalSysparam}
				tableColumns={state.properties.tableColumns}
				tableLimit={state.properties.tableLimit}
				page={state.properties.page}
				currentUser={state.properties.currentUser}
			/>
			{state.showInfo && (
				<snc-alert-email-preview
					focusedRecordNumber={state.focusedRecordNumber}
					className={state.isInfoMounted ? "mounted" : "unmounted"}
					onanimationend={() => {
						if (!state.isInfoMounted) updateState({showInfo: false});
					}}
				/>
			)}
		</div>
	);
};

const logEvent = (incomingActionName, payload) => {
	console.log("%c" + incomingActionName + " action handler", "color:cyan;font-size:20px;");
	console.log("%cEvent Payload: %o", "color:cyan;font-size:20px;", payload);
}

createCustomElement('snc-alert-email-view', {
	renderer: {type: snabbdom},
	view,
	styles,
	properties: {
		currentUser: {
			default: {
				fullName: "Unknown",
				presence: "offline",
			}
		},
		tableName: {
			default: ''
		},
		listSysparam: {
			default: ''
		},
		externalSysparam: {
			default: ''
		},
		tableColumns: {
			default: []
		},
		tableLimit: {
			default: 0
		},
		page: {
			default: 0
		},
		menuOptions: {
			default: []
		}
	},
	actionHandlers: {
		'TABLE_ROW#CLICKED': ({action, dispatch, updateState, state}) => {
			updateState({focusedRecordNumber: action.payload.value});
			if (!state.isInfoMounted) {
				let newShowInfo = state.showInfo;
				if (!state.showInfo) {
					newShowInfo = true;
				}
				updateState({showInfo: newShowInfo, isInfoMounted: !state.isInfoMounted});
			}
			logEvent("TABLE_ROW#CLICKED", action.payload);
		},
		'CLOSE_INFO_BUTTON#CLICKED': ({updateState, state}) => {
			let newShowInfo = state.showInfo;
			if (!state.showInfo) {
				newShowInfo = true;
			}
			updateState({showInfo: newShowInfo, isInfoMounted: !state.isInfoMounted});
		},
		'RECORD_LINK#CLICKED': ({action, dispatch}) => {
			logEvent("RECORD_LINK#CLICKED", action.payload);
			dispatch("RECORD_LINK_CLICKED", action.payload);
		},
		'RECORD_SUB_LINK#CLICKED': ({action, dispatch}) => {
			logEvent("RECORD_SUB_LINK#CLICKED", action.payload);
			dispatch("RECORD_SUB_LINK_CLICKED", action.payload);
		},
		'OPEN_TIMELINE_BUTTON#CLICKED': ({action, dispatch}) => {
			logEvent("OPEN_TIMELINE_BUTTON#CLICKED", action.payload);
			dispatch("OPEN_TIMELINE_BUTTON_CLICKED", action.payload);
		},
		'RECORD_LINK_CMDB_CI#CLICKED': ({action, dispatch}) => {
			logEvent("RECORD_LINK_CMDB_CI#CLICKED", action.payload);
			dispatch("RECORD_LINK_CMDB_CI_CLICKED", action.payload);
		},
		'TABLE_RECORD_COUNT#UPDATED': ({action, dispatch}) => {
			logEvent("TABLE_RECORD_COUNT#UPDATED", action.payload);
			dispatch("TABLE_RECORD_COUNT_UPDATED", action.payload);
		},
		'MENU_ITEM_CLICKED': ({action, properties, updateProperties}) => {
			logEvent("MENU_ITEM_CLICKED", action.payload);
			updateProperties({listSysparam: action.payload.value});
		},
		// 'TABLE_ACTION_BAR_CLOSE#CLICKED': ({action, dispatch}) => {
		// 	logEvent("TABLE_ACTION_BAR_CLOSE#CLICKED", action.payload);
		// 	dispatch("TABLE_ACTION_BAR_CLOSE_CLICKED", action.payload);
		// },
		// 'TABLE_ACTION_BAR_ACKNOWLEDGE#CLICKED': ({action, dispatch}) => {
		// 	logEvent("TABLE_ACTION_BAR_ACKNOWLEDGE#CLICKED", action.payload);
		// 	dispatch("TABLE_ACTION_BAR_ACKNOWLEDGE_CLICKED", action.payload);
		// },
		'TABLE_ACTION_BAR_BUTTON#CLICKED': ({action, dispatch}) => {
			logEvent("TABLE_ACTION_BAR_BUTTON#CLICKED", action.payload);
			dispatch("TABLE_ACTION_BAR_BUTTON_CLICKED", action.payload);
		},
		'TABLE_FILTER#UPDATED': ({action, dispatch}) => {
			logEvent("TABLE_FILTER#UPDATED", action.payload);
			dispatch("TABLE_FILTER_UPDATED", action.payload);
		},
	},
	setInitialState() {
		return {
			showInfo: false,
			isInfoMounted: false,
			focusedRecordNumber: "Alert0000000"
		}
	}
});