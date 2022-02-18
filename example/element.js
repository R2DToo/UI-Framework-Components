import '../src/snc-table-component';
import '../src/snc-side-nav';
import '../src/snc-alert-email-view';

const el = document.createElement('DIV');
document.body.appendChild(el);

el.innerHTML = `
<snc-alert-email-view></snc-alert-email-view>
`;
