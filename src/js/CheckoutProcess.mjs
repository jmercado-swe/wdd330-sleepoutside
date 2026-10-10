import { getLocalStorage } from './utils.mjs';
import ExternalServices from './ExternalServices.mjs';

const services = new ExternalServices();

// turns the form fields into an object like { fname: "John", zip: "83440" }
function formDataToJSON(formElement) {
    const formData = new FormData(formElement);
    const convertedJSON = {};
    formData.forEach((value, key) => {
        convertedJSON[key] = value;
    });
    return convertedJSON;
}

// takes the items currently stored in the cart (localStorage)
// and returns them in the simpler form the server wants
function packageItems(items) {
    return items.map((item) => ({
        id: item.Id,
        name: item.Name,
        price: item.FinalPrice,
        quantity: 1,
    }));
}

export default class CheckoutProcess {
    constructor(key, outputSelector) {
        this.key = key;
        this.outputSelector = outputSelector;
        this.list = [];
        this.itemTotal = 0;
        this.shipping = 0;
        this.tax = 0;
        this.orderTotal = 0;
    }

    init() {
        this.list = getLocalStorage(this.key) || [];
        this.calculateItemSubTotal();
    }

    // runs when the page loads
    calculateItemSubTotal() {
        this.itemTotal = this.list.reduce((sum, item) => sum + item.FinalPrice, 0);

        document.querySelector(`${this.outputSelector} #num-items`).textContent =
            this.list.length;
        document.querySelector(`${this.outputSelector} #subtotal`).textContent =
            `$${this.itemTotal.toFixed(2)}`;
    }

    // runs after the zip code is filled in
    calculateOrderTotal() {
        // 6% sales tax
        this.tax = this.itemTotal * 0.06;

        // $10 for the first item + $2 for each additional item
        if (this.list.length > 0) {
            this.shipping = 10 + (this.list.length - 1) * 2;
        } else {
            this.shipping = 0;
        }

        this.orderTotal = this.itemTotal + this.tax + this.shipping;
        this.displayOrderTotals();
    }

    displayOrderTotals() {
        document.querySelector(`${this.outputSelector} #tax`).textContent =
            `$${this.tax.toFixed(2)}`;
        document.querySelector(`${this.outputSelector} #shipping`).textContent =
            `$${this.shipping.toFixed(2)}`;
        document.querySelector(`${this.outputSelector} #orderTotal`).textContent =
            `$${this.orderTotal.toFixed(2)}`;
    }

    async checkout(form) {
        // make sure the totals are calculated even if the zip field was never left
        this.calculateOrderTotal();

        const order = formDataToJSON(form);
        order.orderDate = new Date().toISOString();
        order.orderTotal = this.orderTotal.toFixed(2);
        order.tax = this.tax.toFixed(2);
        order.shipping = this.shipping;
        order.items = packageItems(this.list);

        try {
            const response = await services.checkout(order);
            console.log(response);
        } catch (err) {
            console.log(err);
        }
    }
}