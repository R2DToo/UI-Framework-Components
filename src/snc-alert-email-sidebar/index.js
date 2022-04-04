import {createCustomElement, actionTypes} from '@servicenow/ui-core';
const {COMPONENT_ERROR_THROWN,COMPONENT_PROPERTY_CHANGED,COMPONENT_BOOTSTRAPPED} = actionTypes;
import snabbdom from '@servicenow/ui-renderer-snabbdom';
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
					<span className="primary-color">AIOps</span>
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
		externalSysparam: {
			default: ""
		}
	},
	setInitialState() {
		return {
			activeItem: 0,
			checkExternalSysparam: true,
		}
	},
	actionHandlers: {
		[COMPONENT_BOOTSTRAPPED]: (coeffects) => {
			const {state, updateState} = coeffects;
			console.log("COMPONENT_BOOTSTRAPPED state: ", state);
			// if (state.checkExternalSysparam == true && state.properties.externalSysparam) {
			// 	console.log("menuOptions: ", state.properties.menuOptions);
			// 	let newActiveItem = state.properties.menuOptions.findIndex((menuOption) => state.properties.externalSysparam.includes(menuOption.sysparm));
			// 	updateState({checkExternalSysparam: false, activeItem: newActiveItem});
			// }
		},
		[COMPONENT_PROPERTY_CHANGED]:(coeffects) => {
			const {state, dispatch, action, updateState} = coeffects;
			console.log("COMPONENT_PROPERTY_CHANGED: ", action.payload.name);
			console.log("payload: ", action.payload);
			if (action.payload.name == "menuOptions" && action.payload.previousValue.length == 0) {
				if (state.checkExternalSysparam == true && state.properties.externalSysparam) {
					let newActiveItem = action.payload.value.findIndex((menuOption) => state.properties.externalSysparam.includes(menuOption.sysparm));
					dispatch('MENU_ITEM_CLICKED', {value: action.payload.value[newActiveItem].sysparm});
					updateState({checkExternalSysparam: false, activeItem: newActiveItem});
				} else {
					dispatch('MENU_ITEM_CLICKED', {value: action.payload.value[0].sysparm});
				}
			}
		},
		[COMPONENT_ERROR_THROWN]: (coeffects) => {
			console.log("%cERROR_THROWN: %o", "color:red", coeffects.action.payload);
		},
		'MENU_ITEM#CLICKED': (coeffects) => {
			const {state, action, dispatch, updateState} = coeffects;
			updateState({activeItem: action.payload.value});
			dispatch('MENU_ITEM_CLICKED', {value: state.properties.menuOptions[action.payload.value].sysparm});
		}
	}
});
