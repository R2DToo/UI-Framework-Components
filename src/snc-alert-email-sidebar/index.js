import {createCustomElement, actionTypes} from '@servicenow/ui-core';
const {COMPONENT_ERROR_THROWN,COMPONENT_PROPERTY_CHANGED,COMPONENT_BOOTSTRAPPED} = actionTypes;
import snabbdom from '@servicenow/ui-renderer-snabbdom';
import {createHttpEffect} from '@servicenow/ui-effect-http';
import styles from './styles.scss';
import '@servicenow/now-icon';
import '@servicenow/now-avatar';
import '@servicenow/now-rich-text';

const view = (state, {updateState, dispatch}) => {
	console.log('snc-alert-email-sidebar state: ', state);

	const menuListItems = state.properties.menuOptions.map((menuOption, i) => {
		if (menuOption.svgIcon) {
			return (
				<li class={{active: i == state.activeItem}} onclick={() => {dispatch('MENU_ITEM#CLICKED', {value: i})}}>
					<div className="menu-item"><now-rich-text className="g-icon" html={menuOption.svgIcon}/> {menuOption.label}</div>
				</li>
			);
		} else {
			return (
				<li class={{active: i == state.activeItem}} onclick={() => {dispatch('MENU_ITEM#CLICKED', {value: i})}}>
					<div className="menu-item">{menuOption.label}</div>
				</li>
			);
		}
	});

	return (
		<aside id="sidebar" className="nano">
			<div className="nano-content">
				<div className="logo-container">
					<now-avatar
						className="logo"
						size="md"
						user-name={state.properties.currentUser.fullName}
						image-src={state.properties.currentUser.avatar}
						presence={state.properties.currentUser.presence}
					/>
					{/* <span className="primary-color">AIOps</span> */}
				</div>
				<menu className="menu-segment">
					<ul>
						{menuListItems}
					</ul>
				</menu>
			</div>
		</aside>
	);
};

createCustomElement('snc-alert-email-sidebar', {
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
		menuOptions: {
			default: []
		},
		defaultMenuOptions: {
			default: []
		},
		externalSysparam: {
			default: ""
		},
		paramListValue: {
			default: ""
		}
	},
	setInitialState() {
		return {
			activeItem: 0
		}
	},
	actionHandlers: {
		[COMPONENT_BOOTSTRAPPED]: (coeffects) => {
			const {state, updateState, dispatch} = coeffects;
			console.log("snc-alert-email-sidebar COMPONENT_BOOTSTRAPPED state: ", state);
			if (state.properties.menuOptions.length > 0) {
				if (state.properties.paramListValue) {
					let selectedItem = state.properties.menuOptions.findIndex((menuOption) => menuOption.name.toLowerCase() == state.properties.paramListValue.toLowerCase());
					if (selectedItem > -1) {
						updateState({activeItem: selectedItem});
					}
				} else {
					dispatch("UPDATE_PAGE#PARAMETER", {params: {list: state.properties.menuOptions[state.activeItem].name}});
				}
			}
			dispatch('FETCH_DEFAULT_MENU_OPTIONS', {
				table: 'sys_aw_list',
				sysparm_query: `workspace=9ffb1ca697cf8190ada0b9cfe153af18^active=true^ORDERBYorder`,
				sysparm_fields: 'category,columns,condition,table,title',
				sysparm_display_value: 'true'
			});
		},
		[COMPONENT_PROPERTY_CHANGED]:(coeffects) => {
			const {state, dispatch, action, updateState} = coeffects;
			console.log("snc-alert-email-sidebar COMPONENT_PROPERTY_CHANGED: ", action.payload.name);
			console.log("sidebar payload: ", action.payload);
			if (action.payload.name == "menuOptions" && action.payload.previousValue.length == 0) {
				if (state.properties.paramListValue) {
					let selectedItem = action.payload.value.findIndex((menuOption) => menuOption.name.toLowerCase() == state.properties.paramListValue.toLowerCase());
					if (selectedItem > -1) {
						updateState({activeItem: selectedItem});
					}
				} else {
					dispatch("UPDATE_PAGE#PARAMETER", {params: {list: action.payload.value[state.activeItem].name}});
				}
			}
		},
		[COMPONENT_ERROR_THROWN]: (coeffects) => {
			console.log("%cERROR_THROWN: %o", "color:red", coeffects.action.payload);
		},
		'MENU_ITEM#CLICKED': (coeffects) => {
			const {state, action, dispatch, updateState} = coeffects;
			updateState({activeItem: action.payload.value});
			if (state.properties.menuOptions[action.payload.value].isLink) {
				dispatch("RECORD_LINK_CMDB_CI#CLICKED", {value: state.properties.menuOptions[action.payload.value].listValue});
			} else {
				dispatch("UPDATE_PAGE#PARAMETER", {params: {list: state.properties.menuOptions[action.payload.value].name}});
				//dispatch('MENU_ITEM_CLICKED', {value: state.properties.menuOptions[action.payload.value].listValue});
			}
		},
		'FETCH_DEFAULT_MENU_OPTIONS': createHttpEffect('/api/now/table/:table', {
			batch: false,
			method: 'GET',
			pathParams: ['table'],
			queryParams: ['sysparm_query', 'sysparm_fields', 'sysparm_display_value'],
			successActionType: 'FETCH_DEFAULT_MENU_OPTIONS_SUCCESS',
			cacheable: true
		}),
		'FETCH_DEFAULT_MENU_OPTIONS_SUCCESS': (coeffects) => {
			const {action, updateState} = coeffects;
			console.log('FETCH_DEFAULT_MENU_OPTIONS_SUCCESS payload: ', action.payload);
			if (action.payload && action.payload.result) {
				updateState({defaultMenuOptions: action.payload.result});
			}
		}
	}
});
