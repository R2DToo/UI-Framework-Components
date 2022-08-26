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
		return state.optionsArray.map((category, index) => {
			let categoryActive = false;
			if (state.properties.paramListValue == "") {
				categoryActive = category.listOptions.findIndex((listOption) => state.properties.defaultListId == listOption.sys_id) > -1;
			} else {
				categoryActive = category.listOptions.findIndex((listOption) => state.properties.paramListValue == listOption.sys_id) > -1;
			}
			return <li class={{showMenu: index == state.expandedCategory, 'active': categoryActive}}>
				<div className="icon-link" onclick={() => {dispatch("UPDATE_EXPANDED_CATEGORY", {index: index})}}>
					<div className="link_text">
						<now-rich-text html={category.icon}></now-rich-text>
						{/* <svg attrs={{xmlns: "http://www.w3.org/2000/svg", height: "24px", width: "24px", viewBox: "0 0 24 24", 'enable-background': "new 0 0 24 24"}}><g><rect attr-fill="none" attr-height="24" attr-width="24"/></g><g><path attr-d="M11,21h-1l1-7H7.5c-0.88,0-0.33-0.75-0.31-0.78C8.48,10.94,10.42,7.54,13.01,3h1l-1,7h3.51c0.4,0,0.62,0.19,0.4,0.66 C12.97,17.55,11,21,11,21z"/></g></svg> */}
						<span className="link_name">{category.categoryTitle}</span>
					</div>
					<svg attrs={{class: "arrow", xmlns: "http://www.w3.org/2000/svg", height: "24px", width: "24px", viewBox: "0 0 24 24"}}><path attr-d="M24 24H0V0h24v24z" attr-fill="none" attr-opacity=".87"/><path attr-d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6-1.41-1.41z"/></svg>
				</div>
				<ul className="sub-menu">
					<li><div className="link_name">{category.categoryTitle}</div></li>
					{category.listOptions.map((list, listIndex) => {
						let listActive = false;
						if (state.properties.paramListValue == "") {
							listActive = state.properties.defaultListId == list.sys_id;
						} else {
							listActive = state.properties.paramListValue == list.sys_id;
						}
						return <li class={{'active': listActive}}>
							<div className="link_text" onclick={() => {dispatch("LIST_OPTION_CLICKED", {categoryIndex: index, listIndex: listIndex})}}>
								<div>{list.title}</div>
								{category.categoryId == "0" && <svg onclick={(e) => {e.stopPropagation(); dispatch("DELETE_MY_LIST", {sys_id: list.sys_id});}} attrs={{class: "delete-list-icon", xmlns: "http://www.w3.org/2000/svg", height: "24px", width: "24px"}}><path attr-d="M6.4 18.65 5.35 17.6 10.95 12 5.35 6.4 6.4 5.35 12 10.95 17.6 5.35 18.65 6.4 13.05 12 18.65 17.6 17.6 18.65 12 13.05Z"/></svg>}
							</div>
						</li>
					})}
				</ul>
			</li>
		})
	};

	return (
		<div class={{sidebar: true, close: false}}>
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
					<div className="profile_name"></div>
				</div>
			</div>
			<ul className="nav-links">
				{renderOptions()}
			</ul>
  	</div>
	);
};

const findTempIcon = (categoryTitle) => {
	var icon = '';
	if (categoryTitle == "Alerts") {
		icon = '<svg xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M2.5 10Q2.5 7.9 3.363 6.037Q4.225 4.175 5.775 2.8L6.85 3.85Q5.5 5.025 4.75 6.612Q4 8.2 4 10ZM20 10Q20 8.2 19.25 6.612Q18.5 5.025 17.15 3.85L18.225 2.8Q19.775 4.175 20.638 6.037Q21.5 7.9 21.5 10ZM4.25 18.875V17.375H6.25V10.125Q6.25 8.125 7.5 6.537Q8.75 4.95 10.75 4.5V3.8Q10.75 3.275 11.113 2.912Q11.475 2.55 12 2.55Q12.525 2.55 12.887 2.912Q13.25 3.275 13.25 3.8V4.5Q15.25 4.95 16.5 6.537Q17.75 8.125 17.75 10.125V17.375H19.75V18.875ZM12 11.625Q12 11.625 12 11.625Q12 11.625 12 11.625Q12 11.625 12 11.625Q12 11.625 12 11.625ZM12 21.8Q11.25 21.8 10.725 21.275Q10.2 20.75 10.2 20H13.8Q13.8 20.75 13.275 21.275Q12.75 21.8 12 21.8ZM7.75 17.375H16.25V10.125Q16.25 8.35 15 7.112Q13.75 5.875 12 5.875Q10.25 5.875 9 7.112Q7.75 8.35 7.75 10.125Z"/></svg>';
	} else if (categoryTitle == "Alert Clustering") {
		icon = '<svg xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M6 7.625Q5.325 7.625 4.85 7.15Q4.375 6.675 4.375 6Q4.375 5.325 4.85 4.85Q5.325 4.375 6 4.375Q6.675 4.375 7.15 4.85Q7.625 5.325 7.625 6Q7.625 6.675 7.15 7.15Q6.675 7.625 6 7.625ZM6 19.625Q5.325 19.625 4.85 19.15Q4.375 18.675 4.375 18Q4.375 17.325 4.85 16.85Q5.325 16.375 6 16.375Q6.125 16.375 6.238 16.387Q6.35 16.4 6.45 16.45L10.45 12.45Q10.325 12.05 10.425 11.612Q10.525 11.175 10.85 10.85Q11.175 10.525 11.613 10.425Q12.05 10.325 12.45 10.45L16.45 6.45Q16.425 6.325 16.4 6.225Q16.375 6.125 16.375 6Q16.375 5.325 16.85 4.85Q17.325 4.375 18 4.375Q18.675 4.375 19.15 4.85Q19.625 5.325 19.625 6Q19.625 6.675 19.15 7.15Q18.675 7.625 18 7.625Q17.875 7.625 17.775 7.6Q17.675 7.575 17.55 7.55L13.55 11.525Q13.675 11.95 13.575 12.387Q13.475 12.825 13.15 13.15Q12.8 13.5 12.363 13.587Q11.925 13.675 11.525 13.55L7.825 17.225L7.85 17.25H10.6Q10.8 16.85 11.175 16.613Q11.55 16.375 12 16.375Q12.475 16.375 12.85 16.613Q13.225 16.85 13.45 17.25H16.55Q16.775 16.85 17.175 16.613Q17.575 16.375 18 16.375Q18.675 16.375 19.15 16.85Q19.625 17.325 19.625 18Q19.625 18.675 19.15 19.15Q18.675 19.625 18 19.625Q17.575 19.625 17.175 19.375Q16.775 19.125 16.55 18.75H13.45Q13.225 19.125 12.838 19.375Q12.45 19.625 12 19.625Q11.55 19.625 11.175 19.375Q10.8 19.125 10.6 18.75H7.4Q7.2 19.125 6.838 19.375Q6.475 19.625 6 19.625ZM12 7.625Q11.325 7.625 10.85 7.15Q10.375 6.675 10.375 6Q10.375 5.325 10.85 4.85Q11.325 4.375 12 4.375Q12.675 4.375 13.15 4.85Q13.625 5.325 13.625 6Q13.625 6.675 13.15 7.15Q12.675 7.625 12 7.625ZM6 13.625Q5.325 13.625 4.85 13.15Q4.375 12.675 4.375 12Q4.375 11.325 4.85 10.85Q5.325 10.375 6 10.375Q6.675 10.375 7.15 10.85Q7.625 11.325 7.625 12Q7.625 12.675 7.15 13.15Q6.675 13.625 6 13.625ZM18 13.625Q17.325 13.625 16.85 13.15Q16.375 12.675 16.375 12Q16.375 11.325 16.85 10.85Q17.325 10.375 18 10.375Q18.675 10.375 19.15 10.85Q19.625 11.325 19.625 12Q19.625 12.675 19.15 13.15Q18.675 13.625 18 13.625Z"/></svg>';
	} else if (categoryTitle == "Administration") {
		icon = '<svg xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M12 21.475Q8.75 20.6 6.625 17.663Q4.5 14.725 4.5 11.1V5.35L12 2.55L19.5 5.35V11Q19.15 10.875 18.763 10.762Q18.375 10.65 18 10.575V6.4L12 4.15L6 6.4V11.1Q6 12.425 6.375 13.688Q6.75 14.95 7.413 16.062Q8.075 17.175 8.988 18.05Q9.9 18.925 10.975 19.45L11 19.425Q11.2 19.975 11.513 20.475Q11.825 20.975 12.225 21.4Q12.175 21.425 12.125 21.438Q12.075 21.45 12 21.475ZM17 17Q17.625 17 18.062 16.562Q18.5 16.125 18.5 15.5Q18.5 14.875 18.062 14.438Q17.625 14 17 14Q16.375 14 15.938 14.438Q15.5 14.875 15.5 15.5Q15.5 16.125 15.938 16.562Q16.375 17 17 17ZM17 20Q17.775 20 18.425 19.637Q19.075 19.275 19.475 18.675Q18.925 18.35 18.3 18.175Q17.675 18 17 18Q16.325 18 15.7 18.175Q15.075 18.35 14.525 18.675Q14.925 19.275 15.575 19.637Q16.225 20 17 20ZM17 21.5Q15.125 21.5 13.812 20.188Q12.5 18.875 12.5 17Q12.5 15.125 13.812 13.812Q15.125 12.5 17 12.5Q18.875 12.5 20.188 13.812Q21.5 15.125 21.5 17Q21.5 18.875 20.188 20.188Q18.875 21.5 17 21.5ZM12 11.8Q12 11.8 12 11.8Q12 11.8 12 11.8Q12 11.8 12 11.8Q12 11.8 12 11.8Q12 11.8 12 11.8Q12 11.8 12 11.8Q12 11.8 12 11.8Q12 11.8 12 11.8Q12 11.8 12 11.8Q12 11.8 12 11.8Z"/></svg>';
	} else if (categoryTitle == "My Lists") {
		icon = '<svg xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M12.025 2.075Q13.6 2.075 15.125 2.462Q16.65 2.85 18.05 3.575Q18.275 3.675 18.3 3.837Q18.325 4 18.275 4.175Q18.2 4.325 18.038 4.4Q17.875 4.475 17.675 4.375Q16.375 3.675 14.938 3.312Q13.5 2.95 12.025 2.95Q10.55 2.95 9.138 3.312Q7.725 3.675 6.425 4.375Q6.275 4.475 6.113 4.425Q5.95 4.375 5.85 4.2Q5.775 4.025 5.812 3.875Q5.85 3.725 6 3.625Q7.4 2.875 8.925 2.475Q10.45 2.075 12.025 2.075ZM12 4.525Q14.65 4.525 16.988 5.662Q19.325 6.8 20.9 8.95Q21.05 9.125 21 9.287Q20.95 9.45 20.8 9.55Q20.65 9.675 20.475 9.662Q20.3 9.65 20.175 9.45Q18.775 7.5 16.613 6.45Q14.45 5.4 12 5.4Q9.575 5.4 7.438 6.45Q5.3 7.5 3.9 9.45Q3.75 9.65 3.575 9.675Q3.4 9.7 3.25 9.575Q3.125 9.475 3.075 9.312Q3.025 9.15 3.175 9Q4.725 6.875 7.05 5.7Q9.375 4.525 12 4.525ZM12.025 9.3Q14.325 9.3 15.975 10.85Q17.625 12.4 17.625 14.65Q17.625 14.85 17.513 14.975Q17.4 15.1 17.2 15.1Q17.025 15.1 16.888 14.975Q16.75 14.85 16.75 14.65Q16.75 12.75 15.35 11.475Q13.95 10.2 12.025 10.2Q10.1 10.2 8.713 11.475Q7.325 12.75 7.325 14.65Q7.325 16.7 8.037 18.112Q8.75 19.525 10.1 20.975Q10.25 21.125 10.238 21.3Q10.225 21.475 10.1 21.6Q9.975 21.725 9.8 21.725Q9.625 21.725 9.475 21.6Q8.025 20.075 7.238 18.45Q6.45 16.825 6.45 14.65Q6.45 12.4 8.088 10.85Q9.725 9.3 12.025 9.3ZM12 14.2Q12.175 14.2 12.3 14.337Q12.425 14.475 12.425 14.65Q12.425 16.55 13.788 17.775Q15.15 19 17 19Q17.2 19 17.475 18.975Q17.75 18.95 18.025 18.9Q18.225 18.85 18.35 18.95Q18.475 19.05 18.525 19.225Q18.575 19.425 18.462 19.55Q18.35 19.675 18.175 19.725Q17.8 19.825 17.475 19.85Q17.15 19.875 17 19.875Q14.8 19.875 13.175 18.387Q11.55 16.9 11.55 14.65Q11.55 14.475 11.675 14.337Q11.8 14.2 12 14.2ZM12.025 11.75Q13.275 11.75 14.15 12.587Q15.025 13.425 15.025 14.65Q15.025 15.5 15.675 16.075Q16.325 16.65 17.175 16.65Q18.05 16.65 18.675 16.075Q19.3 15.5 19.3 14.65Q19.3 11.725 17.15 9.738Q15 7.75 12.025 7.75Q9.05 7.75 6.913 9.738Q4.775 11.725 4.775 14.625Q4.775 15.25 4.888 16.15Q5 17.05 5.425 18.25Q5.5 18.45 5.425 18.6Q5.35 18.75 5.175 18.825Q5 18.9 4.838 18.825Q4.675 18.75 4.6 18.575Q4.225 17.55 4.05 16.6Q3.875 15.65 3.875 14.65Q3.875 11.35 6.275 9.113Q8.675 6.875 12 6.875Q15.35 6.875 17.763 9.113Q20.175 11.35 20.175 14.65Q20.175 15.875 19.312 16.7Q18.45 17.525 17.2 17.525Q15.95 17.525 15.05 16.7Q14.15 15.875 14.15 14.65Q14.15 13.8 13.525 13.225Q12.9 12.65 12.025 12.65Q11.15 12.65 10.512 13.225Q9.875 13.8 9.875 14.65Q9.875 17.1 11.338 18.738Q12.8 20.375 15.075 21.05Q15.275 21.125 15.35 21.275Q15.425 21.425 15.375 21.6Q15.325 21.75 15.188 21.863Q15.05 21.975 14.85 21.925Q12.275 21.25 10.637 19.337Q9 17.425 9 14.65Q9 13.425 9.887 12.587Q10.775 11.75 12.025 11.75Z"/></svg>';
	}
	return icon;
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
		workspaceId: {
			default: '9ffb1ca697cf8190ada0b9cfe153af18'
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
	setInitialState() {
		return {
			// optionsArray schema: [{"categoryTitle":"Alert","categoryId":123,"listOptions":[]}]
			optionsArray: [],
			expandedCategory: 0,
			dummyStateChange: false
		}
	},
	actionHandlers: {
		[COMPONENT_BOOTSTRAPPED]: (coeffects) => {
			const {state, dispatch} = coeffects;
			console.log("snc-alert-email-sidebar COMPONENT_BOOTSTRAPPED state: ", state);
			dispatch('FETCH_LIST_CATEGORIES', {
				table: 'sys_aw_list_category',
				sysparm_query: `workspace=${state.properties.workspaceId}^sys_idNOT IN${state.properties.excludedMenuCategories.toString()}^active=true^ORDERBYorder`,
				sysparm_fields: 'title,sys_id',
				sysparm_display_value: 'true'
			});
		},
		[COMPONENT_PROPERTY_CHANGED]:(coeffects) => {
			const {state, dispatch, action} = coeffects;
			console.log("snc-alert-email-sidebar COMPONENT_PROPERTY_CHANGED: ", action.payload.name);
			console.log("sidebar payload: ", action.payload);
			if (action.payload.name == "uibRefresh") {
				dispatch('FETCH_LIST_CATEGORIES', {
					table: 'sys_aw_list_category',
					sysparm_query: `workspace=${state.properties.workspaceId}^sys_idNOT IN${state.properties.excludedMenuCategories.toString()}^active=true^ORDERBYorder`,
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
			console.log("LIST_OPTION_CLICKED payload: ", action.payload);

			if (state.optionsArray[action.payload.categoryIndex].listOptions[action.payload.listIndex].u_link == "") {
				dispatch("UPDATE_PAGE#PARAMETER", {params: {list: state.optionsArray[action.payload.categoryIndex].listOptions[action.payload.listIndex].sys_id}});
			} else {
				if (state.optionsArray[action.payload.categoryIndex].listOptions[action.payload.listIndex].u_link) {
					dispatch("RECORD_LINK_CMDB_CI#CLICKED", {value: state.optionsArray[action.payload.categoryIndex].listOptions[action.payload.listIndex].u_link});
				} else {
					dispatch("UPDATE_PAGE#PARAMETER", {params: {list: state.optionsArray[action.payload.categoryIndex].listOptions[action.payload.listIndex].sys_id}});
				}
			}
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
					newListOptions.push({categoryTitle: result.title, categoryId: result.sys_id, listOptions: [], icon: findTempIcon(result.title)});
				});
				updateState({optionsArray: newListOptions});
				if (newListOptions.length > 0) {
					let categoryIDs = newListOptions.map(result => result.categoryId);
					console.log("FETCH_LIST_OPTIONS sysparm: ", `categoryIN${categoryIDs.toString()}^workspace=${state.properties.workspaceId}^active=true^ORDERBYorder`);
					dispatch('FETCH_LIST_OPTIONS', {
						table: 'sys_aw_list',
						sysparm_query: `categoryIN${categoryIDs.toString()}^workspace=${state.properties.workspaceId}^active=true^ORDERBYorder`,
						sysparm_fields: 'columns,condition,table,title,category,sys_id,u_link',
						sysparm_display_value: 'false'
					});
				}
				dispatch('FETCH_MY_LIST_OPTIONS', {
					table: 'sys_aw_my_list',
					sysparm_query: `sys_created_by=${state.properties.currentUser.userName}^active=true^ORDERBYorder`,
					sysparm_fields: 'columns,condition,table,title,sys_id',
					sysparm_display_value: 'false'
				});
			}
		},
		'FETCH_LIST_OPTIONS': createHttpEffect('/api/now/table/:table', {
			batch: true,
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
				updatedOptionsArray.forEach((category, categoryIndex) => {
					let matchingResults = action.payload.result.filter(result => result.category.value == category.categoryId);
					matchingResults.forEach(result => {
						category.listOptions.push(result);

						if (state.properties.paramListValue == "") {
							if (result.sys_id == state.properties.defaultListId) {
								updateState({expandedCategory: categoryIndex});
							}
						} else if (result.sys_id == state.properties.paramListValue) {
							updateState({expandedCategory: categoryIndex});
						}
					});
				});
				updateState({optionsArray: updatedOptionsArray});
			}
		},
		'FETCH_MY_LIST_OPTIONS': createHttpEffect('/api/now/table/:table', {
			batch: true,
			cacheable: true,
			method: 'GET',
			pathParams: ['table'],
			queryParams: ['sysparm_query', 'sysparm_fields', 'sysparm_display_value'],
			successActionType: 'FETCH_MY_LIST_OPTIONS_SUCCESS',
		}),
		'FETCH_MY_LIST_OPTIONS_SUCCESS': (coeffects) => {
			const { action, state, updateState } = coeffects;
			console.log("FETCH_MY_LIST_OPTIONS_SUCCESS payload: ", action.payload);
			if (action.payload && action.payload.result) {
				let updatedOptionsArray = state.optionsArray;
				let myListCategory = {categoryTitle: "My Lists", categoryId: "0", listOptions: [], icon: findTempIcon("My Lists")};
				action.payload.result.forEach((result) => {
					myListCategory.listOptions.push(result);

					if (state.properties.paramListValue == "") {
						if (result.sys_id == state.properties.defaultListId) {
							updateState({expandedCategory: updatedOptionsArray.length});
						}
					} else if (result.sys_id == state.properties.paramListValue) {
						updateState({expandedCategory: updatedOptionsArray.length});
					}
				});
				updatedOptionsArray.push(myListCategory);
				updateState({optionsArray: updatedOptionsArray, dummyStateChange: !state.dummyStateChange});
			}
		},
		'DELETE_MY_LIST': createHttpEffect('/api/now/table/sys_aw_my_list/:sys_id', {
			batch: false,
			cacheable: false,
			method: 'DELETE',
			pathParams: ['sys_id'],
			successActionType: "DELETE_MY_LIST_SUCCESS",
		}),
		'DELETE_MY_LIST_SUCCESS': (coeffects) => {
			const { action, state, updateState, dispatch } = coeffects;
			console.log("DELETE_MY_LIST_SUCCESS payload: ", action.payload);

			let updatedOptionsArray = state.optionsArray;
			let myListCategoryIndex = updatedOptionsArray.findIndex((categoryObj) => categoryObj.categoryId == "0");
			if (myListCategoryIndex > -1) {
				updatedOptionsArray.splice(myListCategoryIndex, 1);
			}
			updateState({optionsArray: updatedOptionsArray, dummyStateChange: !state.dummyStateChange});
			dispatch('FETCH_MY_LIST_OPTIONS', {
				table: 'sys_aw_my_list',
				sysparm_query: `sys_created_by=${state.properties.currentUser.userName}^active=true^ORDERBYorder`,
				sysparm_fields: 'columns,condition,table,title,sys_id',
				sysparm_display_value: 'false'
			});
		}
	}
});
