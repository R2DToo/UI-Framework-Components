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
					AIOps
				</div>
				<menu className="menu-segment">
					<ul>
						<li className="active"><a href="#">Alerts<span> (#)</span></a></li>
						<li><a href="#">Important</a></li>
						<li><a href="#">Anomalies</a></li>
						<li><a href="#">Analytics</a></li>
						<li><a href="#">Chatops</a></li>
					</ul>
				</menu>
				<div className="separator"></div>
				<div className="menu-segment">
					<ul className="labels">
						<li className="ciName">Labels</li>
						<li><a href="#">Tags <span className="ball pink"></span></a></li>
						<li><a href="#">Metrics <span className="ball green"></span></a></li>
						<li><a href="#">Logs <span className="ball blue"></span></a></li>
					</ul>
				</div>
				<div className="bottom-padding"></div>
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
