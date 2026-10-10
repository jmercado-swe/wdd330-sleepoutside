import { renderListWithTemplate } from './utils.mjs';

function productCardTemplate(product) {
    // a product is discounted when it sells for less than the suggested retail price
    const isDiscounted = product.FinalPrice < product.SuggestedRetailPrice;

    let discountBadge = '';
    let retailPrice = '';

    if (isDiscounted) {
        const discountPercent = Math.round(
            (1 - product.FinalPrice / product.SuggestedRetailPrice) * 100,
        );
        discountBadge = `<p class="discount-badge">${discountPercent}% OFF</p>`;
        retailPrice = `<s class="retail-price">$${product.SuggestedRetailPrice}</s>`;
    }

    return `<li class="product-card">
    <a href="/product_pages/index.html?product=${product.Id}">
      ${discountBadge}
      <img src="${product.Images.PrimaryMedium}" alt="Image of ${product.NameWithoutBrand}" />
      <h3 class="card__brand">${product.Brand.Name}</h3>
      <h2 class="card__name">${product.NameWithoutBrand}</h2>
      <p class="product-card__price">$${product.FinalPrice} ${retailPrice}</p>
    </a>
  </li>`;
}

export default class ProductList {
    constructor(category, dataSource, listElement) {
        this.category = category;
        this.dataSource = dataSource;
        this.listElement = listElement;
        this.list = [];
    }

    async init() {
        this.list = await this.dataSource.getData(this.category);
        this.renderList(this.list);
    }

    sort(sortBy) {
        if (sortBy === 'name') {
            this.list.sort((a, b) => a.NameWithoutBrand.localeCompare(b.NameWithoutBrand));
        } else if (sortBy === 'price') {
            this.list.sort((a, b) => a.FinalPrice - b.FinalPrice);
        }
        this.renderList(this.list);
    }

    renderList(list) {
        renderListWithTemplate(productCardTemplate, this.listElement, list, 'afterbegin', true);
    }
}