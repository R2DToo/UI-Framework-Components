import {createCustomElement} from '@servicenow/ui-core';
import snabbdom from '@servicenow/ui-renderer-snabbdom';
import styles from './styles.scss';
import '@servicenow/now-icon';

const view = (state, {updateState}) => {
	console.log('side-nav state: ', state);

	const navElements = state.properties.navigationOptions.map((item) => {
		if (item.heading) {
			return <li className="menu-heading">{item.heading}</li>
		} else {
			return <li>
				<a data-toggle="tab" href={item.link}>
					{item.icon && <now-icon icon={item.icon} size="lg"></now-icon>}
					{item.label}
				</a>
			</li>
		}
	});

	return (
		<div className="side-nav">
			<div className="left">
				<ul>
					{navElements}
				</ul>
			</div>
		</div>
	);
};

createCustomElement('snc-side-nav', {
	renderer: {type: snabbdom},
	view,
	styles,
	properties: {
		navigationOptions: {
			default: [
				{heading: 'Heading 1'},
				{label: 'Overview', link: '#overview'},
				{label: 'Landing', link: '#landing'},
				{label: 'Projects', link: '#projects'}
			]
		}
	}
});
