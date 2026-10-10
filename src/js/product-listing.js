import ExternalServices from './ExternalServices.mjs';
import ProductList from './ProductList.mjs';
import { loadHeaderFooter, getParam } from './utils.mjs';

loadHeaderFooter();

const category = getParam('category');
document.querySelector('.products h2').textContent =
  `Top Products: ${category}`;
const dataSource = new ExternalServices();
const listElement = document.querySelector('.product-list');
const myList = new ProductList(category, dataSource, listElement);
myList.init();

document.querySelector('#sort').addEventListener('change', (event) => {
  myList.sort(event.target.value);
});