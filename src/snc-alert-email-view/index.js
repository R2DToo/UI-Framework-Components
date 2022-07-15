import {createCustomElement} from '@servicenow/ui-core';
import snabbdom from '@servicenow/ui-renderer-snabbdom';
import styles from './styles.scss';
import '../snc-alert-email-sidebar';
import '../snc-alert-email-message-list';
import '../snc-alert-email-preview';

const view = (state, {updateState}) => {
	console.log('alert email view state: ', state);

	return (
		<div id="snc-alert-email-view">
			<snc-alert-email-sidebar
				currentUser={state.properties.currentUser}
				paramListValue={state.properties.paramListValue}
				defaultListId={state.properties.defaultListId}
				excludedMenuCategories={state.properties.excludedMenuCategories}
				uibRefresh={state.properties.uibRefresh}
			/>
			<snc-alert-email-message-list
				class={{showingInfo: state.showInfo}}
				showInfo={state.showInfo}
				tableName={state.properties.tableName}
				paramSysparmValue={state.properties.paramSysparmValue}
				tableLimit={state.properties.tableLimit}
				page={state.properties.page}
				currentUser={state.properties.currentUser}
				actionArray={state.properties.actionArray}
				paramListValue={state.properties.paramListValue}
				defaultListId={state.properties.defaultListId}
			/>
			{state.showInfo && (
				<snc-alert-email-preview
					focusedRecordNumber={state.focusedRecordNumber}
					actionArray={state.properties.actionArray}
					currentUser={state.properties.currentUser}
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
		paramSysparmValue: {
			default: ''
		},
		tableLimit: {
			default: 0
		},
		page: {
			default: 0
		},
		actionArray: {
			default: []
		},
		paramListValue: {
			default: ''
		},
		defaultListId: {
			default: '7443faee47574550d0bc5c62e36d4319'
		},
		excludedMenuCategories: {
			default: []
		},
		uibRefresh: {
			default: false
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
		'UPDATE_PAGE#PARAMETER': ({action,dispatch}) => {
			logEvent("UPDATE_PAGE#PARAMETER", action.payload);
			dispatch("UPDATE_PAGE_PARAMETER", action.payload);
		},
		'DEFINE_TAG#NORMALIZATION': ({action,dispatch}) => {
			logEvent("DEFINE_TAG#NORMALIZATION", action.payload);
			dispatch("DEFINE_TAG_NORMALIZATION", action.payload);
		},
		'SHOW_MESSAGE#MODAL': ({action,dispatch}) => {
			logEvent("SHOW_MESSAGE#MODAL", action.payload);
			dispatch("SHOW_MESSAGE_MODAL", action.payload);
		},
		'CREATE_MY_WORKSPACE_LIST#MODAL': ({action,dispatch}) => {
			logEvent("CREATE_MY_WORKSPACE_LIST#MODAL", action.payload);
			dispatch("CREATE_MY_WORKSPACE_LIST_MODAL", action.payload);
		},
		'OPEN_CONTEXTUAL#LOG_VIEWER': ({action,dispatch}) => {
			logEvent("OPEN_CONTEXTUAL#LOG_VIEWER", action.payload);
			dispatch("OPEN_CONTEXTUAL_LOG_VIEWER", action.payload);
		},
		'METRIC_EXPLORER_LINK#CLICKED': ({action,dispatch}) => {
			logEvent("METRIC_EXPLORER_LINK#CLICKED", action.payload);
			dispatch("METRIC_EXPLORER_LINK_CLICKED", action.payload);
		}
	},
	setInitialState() {
		return {
			showInfo: false,
			isInfoMounted: false,
			focusedRecordNumber: "Alert0000000",
		}
	}
});