import {createCustomElement} from '@servicenow/ui-core';
import snabbdom from '@servicenow/ui-renderer-snabbdom';
import styles from './styles.scss';
import '@servicenow/now-input';

import {DEFAULT_TABLE_DATA} from '../constants';

const view = (state, {updateState}) => {
	console.log('state: ', state);
	const {properties} = state;
	if (state.originalTableData != properties.tableData) {
		var formattedTable = formatTableData(properties.tableData);
		updateState([{
			path: 'tableData',
			value: formattedTable,
			operation: 'set',
			shouldRender: true
		},{
			path: 'originalTableData',
			value: properties.tableData,
			operation: 'set',
			shouldRender: true
		}]);
	}

	const allowDrop = (e, droppingColumnIndex) => {
		e.preventDefault();
	}

	const startDrag = (e, draggingColumnIndex) => {
		// let x = e.clientX - e.target.offsetLeft;
		// let y = e.clientY - e.target.offsetTop;
		// console.log("x: ", x);
		// console.log("y: ", y);
		updateState({ columnDragging: true, draggingColumnIndex: draggingColumnIndex });
	}

	const drop = (e, index) => {
		console.log('drop');
		e.preventDefault();
		if (state.columnDragging && state.draggingColumnIndex !== index) {
			reorganizeFields(state.draggingColumnIndex, index);
			updateState({ columnDragging: false, draggingColumnIndex: 0 });
		}
	}

	// oIndex = Index of the component user is dragging
	// nIndex = Index of the field the user dropped the component on
	const reorganizeFields = (oIndex, nIndex) => {
		console.log('reorganizeFields');
		console.log('oIndex: ', oIndex);
		console.log('nIndex: ', nIndex);
		for (let i = 0; i < state.tableData.length; i++) {
			let row = state.tableData[i];
			let movingField = row.splice(oIndex, 1);
			row.splice(nIndex, 0, movingField[0]);
			//console.log('tableRow[' + i + ']: ', row);
			updateState({
				path: 'tableData[i]',
				value: row,
				operation: 'set',
				shouldRender: true
			});
		}
	}

	// Reads tableData and creates the table elements
	const tableHeadings = state.tableData[0].map((row, index) =>
		<th className="draggable" draggable="true" ondragover={e => allowDrop(e, index)} onmousedown={e => startDrag(e, index)} ondrop={e => drop(e, index)}>{row.label ? row.label : row.field}</th>
	);

	const tableData = state.tableData.map((row) => {
		return (
			<tr>
				{row.map((field) =>
					<td>{field.displayValue}</td>
				)}
			</tr>
		);
	});

	return (
		<div>
			<table id="table">
				<thead>
					<tr>
						{tableHeadings}
					</tr>
				</thead>
				<tbody>
					{tableData}
				</tbody>
			</table>
			<div id="override-container">
				{state.tableData[0].map((field, index) =>
					<now-input
						label={field.label ? field.label + ' override width' : field.field + ' Override width'}
						type="number"
						step={8}
						min={0}
						messages={[{status: "informational", icon: "circle-info-fill", content: "Optional"}]}
					/>
				)}
			</div>
		</div>
	);
};

const formatTableData = (tableData) => {
	var returnData = [];
	console.log('tableData: ', tableData);
	for (let i = 0; i < tableData.length; i++) {
		let keys = Object.keys(tableData[i]);
		if (keys[0] === "_row_data") {
			keys.shift();
		}
		let arr = [];
		keys.map((key) => {
			var obj = {field: key};
			Object.assign(obj, tableData[i][key]);
			arr.push(obj);
		});
		returnData.push(arr);
	}
	console.log('formattedTableData: ', returnData);
	return returnData;
}

createCustomElement('snc-table-component', {
	renderer: {type: snabbdom},
	view,
	styles,
	initialState: {
		columnDragging: false,
		draggingColumnIndex: 0,
		tableData: [],
		originalTableData: []
	},
	properties: {
		tableData: {
			default: DEFAULT_TABLE_DATA
		}
	}
});
