import '../src/snc-table-component';
import '../src/snc-side-nav';
import '../src/snc-alert-email-view';
import '../src/snc-alert-email-timeline';

const el = document.createElement('DIV');
document.body.appendChild(el);

el.innerHTML = `
<snc-alert-email-timeline></snc-alert-email-timeline>
`;
