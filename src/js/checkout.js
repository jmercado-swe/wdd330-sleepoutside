import { loadHeaderFooter } from './utils.mjs';
import CheckoutProcess from './CheckoutProcess.mjs';

loadHeaderFooter();

const order = new CheckoutProcess('so-cart', '.checkout-summary');
order.init();

// calculate tax, shipping and order total after the zip code is filled in
document
    .querySelector('#zip')
    .addEventListener('blur', order.calculateOrderTotal.bind(order));

// send the order when the form is submitted
document.forms['checkout'].addEventListener('submit', (event) => {
    event.preventDefault();
    order.checkout(event.target);
});