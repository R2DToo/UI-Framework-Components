import {createCustomElement, actionTypes} from '@servicenow/ui-core';
const {COMPONENT_ERROR_THROWN} = actionTypes;
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
						{/* <li className="active"><a href="/"><now-rich-text className="g-icon" html=''/> Active</a></li>
						<li><a href="/"><now-rich-text className="g-icon" html=''/> My Stuff</a></li>
						<li><a href="/"><now-rich-text className="g-icon" html=''/> High Priority</a></li>
						<li><a href="/"><now-rich-text className="g-icon" html=''/> Unassigned</a></li>
						<li><a href="/"><now-rich-text className="g-icon" html=''/> Maintenance</a></li>
						<li><a href="/"><now-rich-text className="g-icon" html=''/> Resolved</a></li> */}
					</ul>
				</menu>
				{/* <div className="separator"></div>
				<div className="menu-segment">
					<ul className="labels">
						<li className="ciName">Labels</li>
						<li><a href="#">Tags <span className="ball pink"></span></a></li>
						<li><a href="#">Metrics <span className="ball green"></span></a></li>
						<li><a href="#">Logs <span className="ball blue"></span></a></li>
					</ul>
				</div> */}
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
		}
	},
	setInitialState() {
		return {
			activeItem: 0
		}
	},
	actionHandlers: {
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
