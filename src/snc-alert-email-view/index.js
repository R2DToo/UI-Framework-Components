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
			<div className=""></div>
			<snc-alert-email-sidebar currentUser={state.properties.currentUser}></snc-alert-email-sidebar>
			<snc-alert-email-message-list class={{showingInfo: state.showInfo}} tableData={state.properties.tableData} totalCount={state.properties.totalCount} showInfo={state.showInfo}></snc-alert-email-message-list>
			{state.showInfo && (
				<snc-alert-email-preview
					focusedChildRecords={state.properties.focusedChildRecords}
					focusedRecord={state.properties.focusedRecord}
					className={state.isInfoMounted ? "mounted" : "unmounted"}
					onanimationend={() => {
						if (!state.isInfoMounted) updateState({showInfo: false});
					}}
				/>
			)}
		</div>
	);
};

createCustomElement('snc-alert-email-view', {
	renderer: {type: snabbdom},
	view,
	styles,
	properties: {
		tableData: {
			default: DEFAULT_TABLE_DATA
		},
		focusedChildRecords: {
			default: []
		},
		focusedRecord: {
			default: []
		},
		totalCount: {
			default: 0
		},
		currentUser: {
			default: {
				fullName: "Unknown",
				presence: "offline",
			}
		}
	},
	actionHandlers: {
		'TABLE_HEADER#CLICKED': ({action, dispatch}) => {
			console.log("%cTABLE_HEADER#CLICKED action handler", "color:cyan;font-size:20px;");
			console.log("%cEvent Payload: %o", "color:cyan;font-size:20px;", action.payload);
			dispatch("TABLE_HEADER_CLICKED", action.payload);
		},
		'TABLE_ROW#CLICKED': ({action, dispatch, updateState, state}) => {
			if (!state.isInfoMounted) {
				let newShowInfo = state.showInfo;
				if (!state.showInfo) {
					newShowInfo = true;
				}
				updateState({showInfo: newShowInfo, isInfoMounted: !state.isInfoMounted});
			}
			console.log("%cTABLE_ROW#CLICKED action handler", "color:cyan;font-size:20px;");
			console.log("%cEvent Payload: %o", "color:cyan;font-size:20px;", action.payload);
			dispatch("TABLE_ROW_CLICKED", action.payload);
		},
		'TABLE_HEADER#DROPPED': ({action, dispatch}) => {
			console.log("%cTABLE_HEADER#DROPPED action handler", "color:cyan;font-size:20px;");
			console.log("%cEvent Payload: %o", "color:cyan;font-size:20px;", action.payload);
			dispatch("TABLE_HEADER_DROPPED", action.payload);
		},
		'CLOSE_INFO_BUTTON#CLICKED': ({updateState, state}) => {
			let newShowInfo = state.showInfo;
			if (!state.showInfo) {
				newShowInfo = true;
			}
			updateState({showInfo: newShowInfo, isInfoMounted: !state.isInfoMounted});
		},
		'RECORD_LINK#CLICKED': ({action, dispatch}) => {
			console.log("%cRECORD_LINK#CLICKED action handler", "color:cyan;font-size:20px;");
			console.log("%cEvent Payload: %o", "color:cyan;font-size:20px;", action.payload);
			dispatch("RECORD_LINK_CLICKED", action.payload);
		}
	},
	setInitialState() {
		return {
			showInfo: false,
			isInfoMounted: false,
		}
	}
});