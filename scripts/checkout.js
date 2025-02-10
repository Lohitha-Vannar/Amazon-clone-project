// these are called as named exports
import {cart, removeFromCart} from '../products-data/cart.js';
import {products} from '../products-data/products.js';
import {formatCurrency} from './utiles/money.js';
import {hello} from 'https://unpkg.com/supersimpledev@1.0.1/hello.esm.js';
//the below line is a short cut for an  import statement and is called as "Default Export"
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';
import {deliveryOptions} from '../products-data/deliveryOptions.js';
hello();


const today = dayjs();
const deliveryDate = today.add(7, 'days');
console.log(deliveryDate.format('dddd, MMMM D'));



let cartSummaryHTML = '';
cart.forEach((cartItem) => {
  const productId = cartItem.productId;
  //console.log(cartItem);
  //console.log(productId);

  let matchingProduct;

  products.forEach((product) => {
    if(product.id === productId) {
      matchingProduct = product;
    }
  });

  //console.log(matchingProduct);

  cartSummaryHTML += `
  <div class="cart-item-container 
    js-cart-item-container-${matchingProduct.id}">
    <div class="delivery-date">
      Delivery date: Tuesday, June 21
    </div>

    <div class="cart-item-details-grid">
      <img class="product-image"
        src="${matchingProduct.image}">

      <div class="cart-item-details">
        <div class="product-name">
         ${matchingProduct.name}
        </div>
        <div class="product-price">
          $${formatCurrency(matchingProduct.priceCents)}
        </div>
        <div class="product-quantity">
          <span>
            Quantity: <span class="quantity-label">${cartItem.quantity}</span>
          </span>
          <span class="update-quantity-link link-primary">
            Update
          </span>
          <span class="delete-quantity-link  js-delete-link link-primary" data-product-id="${matchingProduct.id}">
            Delete
          </span>
        </div>
      </div>

      <div class="delivery-options">
        <div class="delivery-options-title">
          Choose a delivery option:
        </div>
        ${deliveryOptionHTML(matchingProduct)}
      </div>
    </div>
  </div>
  `;
});

function deliveryOptionHTML(matchingProduct) {
  let html = '';


   deliveryOptions.forEach((deliveryOption) => {
      const today = dayjs();
      const deliveryDate = today.add(
        deliveryOption.deliveryDays,
        'days'
      );
      const dateString = deliveryDate.format('dddd, MMMM D');
      
      const priceString = deliveryOption.priceCents === 0
        ? 'FREE'
        : `$${formatCurrency(deliveryOption.priceCents)} -`;

      
      html += `
        <div class="delivery-option">
            <input type="radio"
              class="delivery-option-input"
              name="delivery-option-${matchingProduct.id}">
            <div>
              <div class="delivery-option-date">
                ${dateString}
              </div>
              <div class="delivery-option-price">
                ${priceString} - Shipping
              </div>
            </div>
        </div> 
      `
    }); 
    return html;
}

//console.log(cartSummaryHTML);

document.querySelector('.js-cart-summary').innerHTML = cartSummaryHTML;

document.querySelectorAll('.js-delete-link')
  .forEach((link) => {
    link.addEventListener('click', () => {
       //console.log('delete');
       const productId = link.dataset.productId;
       //console.log(productId);
       removeFromCart(productId);
       //console.log(cart);

       const container = document.querySelector(`.js-cart-item-container-${productId}`);
       //console.log(container);
       container.remove();
    });
});