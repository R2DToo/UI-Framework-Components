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

	const renderOptions = () => {
		return state.optionsArray.map((category, index) =>
			<li class={{showMenu: index == state.expandedCategory}}>
				<div className="icon-link" onclick={() => {dispatch("UPDATE_EXPANDED_CATEGORY", {index: index})}}>
					<div className="link_text">
						<svg attrs={{xmlns: "http://www.w3.org/2000/svg", height: "24px", width: "24px", viewBox: "0 0 24 24", 'enable-background': "new 0 0 24 24"}}><g><rect attr-fill="none" attr-height="24" attr-width="24"/></g><g><path attr-d="M11,21h-1l1-7H7.5c-0.88,0-0.33-0.75-0.31-0.78C8.48,10.94,10.42,7.54,13.01,3h1l-1,7h3.51c0.4,0,0.62,0.19,0.4,0.66 C12.97,17.55,11,21,11,21z"/></g></svg>
						<span className="link_name">{category.categoryTitle}</span>
					</div>
					<svg attrs={{class: "arrow", xmlns: "http://www.w3.org/2000/svg", height: "24px", width: "24px", viewBox: "0 0 24 24"}}><path attr-d="M24 24H0V0h24v24z" attr-fill="none" attr-opacity=".87"/><path attr-d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6-1.41-1.41z"/></svg>
				</div>
				<ul className="sub-menu">
					<li><div className="link_name">{category.categoryTitle}</div></li>
					{category.listOptions.map((list, listIndex) =>
						<li><div className="link_text" onclick={() => {dispatch("LIST_OPTION_CLICKED", {categoryIndex: index, listIndex: listIndex})}}>{list.title}</div></li>
					)}
				</ul>
			</li>
		)
	};

	return (
		<div class={{sidebar: true, close: false}}>
			<div className="logo-details">
				<svg attrs={{xmlns: "http://www.w3.org/2000/svg", height: "24px", width: "24px", viewBox: "0 0 24 24", 'enable-background': "new 0 0 24 24"}}><g><rect attr-fill="none" attr-height="24" attr-width="24"/></g><g><path attr-d="M11,21h-1l1-7H7.5c-0.88,0-0.33-0.75-0.31-0.78C8.48,10.94,10.42,7.54,13.01,3h1l-1,7h3.51c0.4,0,0.62,0.19,0.4,0.66 C12.97,17.55,11,21,11,21z"/></g></svg>
				<span className="logo_name">AIOps</span>
			</div>
			<ul className="nav-links">
				{renderOptions()}
				{/* <li>
					<a href="#">
						<svg attrs={{xmlns: "http://www.w3.org/2000/svg", height: "24px", width: "24px", viewBox: "0 0 24 24", 'enable-background': "new 0 0 24 24"}}><g><rect attr-fill="none" attr-height="24" attr-width="24"/></g><g><path attr-d="M11,21h-1l1-7H7.5c-0.88,0-0.33-0.75-0.31-0.78C8.48,10.94,10.42,7.54,13.01,3h1l-1,7h3.51c0.4,0,0.62,0.19,0.4,0.66 C12.97,17.55,11,21,11,21z"/></g></svg>
						<span className="link_name">Dashboard</span>
					</a>
					<ul className="sub-menu blank">
						<li><a className="link_name" href="#">Dashboard</a></li>
					</ul>
				</li> */}
				{/* <li>
					<div className="icon-link">
						<a href="#">
							<svg attrs={{xmlns: "http://www.w3.org/2000/svg", height: "24px", width: "24px", viewBox: "0 0 24 24", 'enable-background': "new 0 0 24 24"}}><g><rect attr-fill="none" attr-height="24" attr-width="24"/></g><g><path attr-d="M11,21h-1l1-7H7.5c-0.88,0-0.33-0.75-0.31-0.78C8.48,10.94,10.42,7.54,13.01,3h1l-1,7h3.51c0.4,0,0.62,0.19,0.4,0.66 C12.97,17.55,11,21,11,21z"/></g></svg>
							<span className="link_name">Category</span>
						</a>
						<svg attrs={{class: "arrow", xmlns: "http://www.w3.org/2000/svg", height: "24px", width: "24px", viewBox: "0 0 24 24"}}><path attr-d="M24 24H0V0h24v24z" attr-fill="none" attr-opacity=".87"/><path attr-d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6-1.41-1.41z"/></svg>
					</div>
					<ul className="sub-menu">
						<li><a className="link_name" href="#">Category</a></li>
						<li><a href="#">HTML & CSS</a></li>
						<li><a href="#">JavaScript</a></li>
						<li><a href="#">PHP & MySQL</a></li>
					</ul>
				</li> */}
			</ul>
			<div className="profile-details">
				<div className="profile-content">
					<now-avatar
						className="logo"
						size="md"
						user-name={state.properties.currentUser.fullName}
						image-src={state.properties.currentUser.avatar}
						presence={state.properties.currentUser.presence}
					/>
				</div>
				<div className="name-job">
					<div className="profile_name">{state.properties.currentUser.fullName}</div>
				</div>
			</div>
  	</div>
	);
};

createCustomElement('snc-alert-email-sidebar', {
	renderer: {type: snabbdom},
	view,
	styles,
	properties: {
		paramListValue: {
			default: ""
		},
		currentUser: {
			default: {
				fullName: "Unknown",
				presence: "offline",
			}
		},
		menuConfigurationId: {
			default: '4691d65c87ed411007570d0d0ebb3529'
		}
	},
	setInitialState() {
		return {
			// optionsArray schema: [{"categoryTitle":"Alert","categoryId":123,"listOptions":[],"myListOptions":[]}]
			optionsArray: [],
			expandedCategory: -1
		}
	},
	actionHandlers: {
		[COMPONENT_BOOTSTRAPPED]: (coeffects) => {
			const {state, dispatch} = coeffects;
			console.log("snc-alert-email-sidebar COMPONENT_BOOTSTRAPPED state: ", state);
			dispatch('FETCH_LIST_CATEGORIES', {
				table: 'sys_ux_list_category',
				sysparm_query: `configuration=${state.properties.menuConfigurationId}^active=true^ORDERBYorder`,
				sysparm_fields: 'title,sys_id',
				sysparm_display_value: 'true'
			});
		},
		[COMPONENT_PROPERTY_CHANGED]:(coeffects) => {
			const {state, dispatch, action} = coeffects;
			console.log("snc-alert-email-sidebar COMPONENT_PROPERTY_CHANGED: ", action.payload.name);
			console.log("sidebar payload: ", action.payload);
			if (action.payload.name == "menuConfigurationId") {
				dispatch('FETCH_LIST_CATEGORIES', {
					table: 'sys_ux_list_category',
					sysparm_query: `configuration=${action.payload.value}^active=true^ORDERBYorder`,
					sysparm_fields: 'title,sys_id',
					sysparm_display_value: 'true'
				});
			}
		},
		[COMPONENT_ERROR_THROWN]: (coeffects) => {
			console.log("%cERROR_THROWN: %o", "color:red", coeffects.action.payload);
		},
		'UPDATE_EXPANDED_CATEGORY': (coeffects) => {
			const {action, updateState, state} = coeffects;
			if (state.expandedCategory == action.payload.index) {
				updateState({expandedCategory: -1});
			} else {
				updateState({expandedCategory: action.payload.index});
			}
		},
		'LIST_OPTION_CLICKED': (coeffects) => {
			const {action, updateState, state, dispatch} = coeffects;
			dispatch("UPDATE_PAGE#PARAMETER", {params: {list: state.optionsArray[action.payload.categoryIndex].listOptions[action.payload.listIndex].sys_id}});
		},
		'FETCH_LIST_CATEGORIES': createHttpEffect('/api/now/table/:table', {
			batch: false,
			cacheable: true,
			method: 'GET',
			pathParams: ['table'],
			queryParams: ['sysparm_query', 'sysparm_fields', 'sysparm_display_value'],
			successActionType: 'FETCH_LIST_CATEGORIES_SUCCESS',
		}),
		'FETCH_LIST_CATEGORIES_SUCCESS': (coeffects) => {
			const {action, updateState, state, dispatch} = coeffects;
			console.log('FETCH_LIST_CATEGORIES_SUCCESS payload: ', action.payload);
			if (action.payload && action.payload.result) {
				let newListOptions = [];
				action.payload.result.forEach(result => {
					newListOptions.push({categoryTitle: result.title, categoryId: result.sys_id, listOptions: [], myListOptions: []});
				});
				updateState({optionsArray: newListOptions});
				if (newListOptions.length > 0) {
					let categoryIDs = newListOptions.map(result => result.categoryId);
					console.log("FETCH_LIST_OPTIONS sysparm: ", `categoryIN${categoryIDs.toString()}^configuration=${state.properties.menuConfigurationId}^active=true^ORDERBYorder`);
					dispatch('FETCH_LIST_OPTIONS', {
						table: 'sys_ux_list',
						sysparm_query: `categoryIN${categoryIDs.toString()}^configuration=${state.properties.menuConfigurationId}^active=true^ORDERBYorder`,
						sysparm_fields: 'columns,condition,table,title,category,sys_id',
						sysparm_display_value: 'false'
					});
				}
			}
		},
		'FETCH_LIST_OPTIONS': createHttpEffect('/api/now/table/:table', {
			batch: false,
			cacheable: true,
			method: 'GET',
			pathParams: ['table'],
			queryParams: ['sysparm_query', 'sysparm_fields', 'sysparm_display_value'],
			successActionType: 'FETCH_LIST_OPTIONS_SUCCESS',
		}),
		'FETCH_LIST_OPTIONS_SUCCESS': (coeffects) => {
			const { action, updateState, state } = coeffects;
			console.log('FETCH_LIST_OPTIONS_SUCCESS payload: ', action.payload);
			if (action.payload && action.payload.result) {
				let updatedOptionsArray = state.optionsArray;
				updatedOptionsArray.forEach(category => {
					let matchingResults = action.payload.result.filter(result => result.category.value == category.categoryId);
					matchingResults.forEach(result => {
						category.listOptions.push(result);
					});
				});
				updateState({optionsArray: updatedOptionsArray});
			}
		},
	}
});
