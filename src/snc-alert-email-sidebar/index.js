import {createCustomElement} from '@servicenow/ui-core';
import snabbdom from '@servicenow/ui-renderer-snabbdom';
import styles from './styles.scss';
import '@servicenow/now-icon';
import '@servicenow/now-avatar';

const view = (state, {updateState}) => {
	console.log('snc-alert-email-sidebar state: ', state);

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
						<li className="active"><a href="#">Active</a></li>
						<li><a href="#">Unhandled</a></li>
						<li><a href="#">Maintenance</a></li>
						<li><a href="#">Resolved</a></li>
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
		}
	}
});
