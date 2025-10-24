// Simple site JS: product data, populate pages, and a tiny cart stored in localStorage
const products = [
  {id:1,title:'Classic Tote',price:120,desc:'Handcrafted leather tote — roomy and elegant.',img:'images/bag1.jpg'},
  {id:2,title:'Chic Shoulder Bag',price:95,desc:'Everyday shoulder bag with clean lines.',img:'images/bag2.jpg'},
  {id:3,title:'Mini Crossbody',price:78,desc:'Compact crossbody for essentials.',img:'images/bag3.jpg'},
  {id:4,title:'Evening Clutch',price:65,desc:'Sleek clutch for nights out.',img:'images/bag4.jpg'}
];

function el(q){return document.querySelector(q)}
function els(q){return document.querySelectorAll(q)}

function populate(selector, list){
  const container = document.getElementById(selector);
  if(!container) return;
  container.innerHTML = list.map(p=>`
    <div class="product-card">
      <img src="${p.img}" alt="${p.title}" />
      <h3>${p.title}</h3>
      <p>${p.desc}</p>
      <div class="price">$${p.price.toFixed(2)}</div>
      <button class="btn add" data-id="${p.id}">Add to Cart</button>
    </div>
  `).join('');
}

function initSite(){
  populate('featured-list', products.slice(0,3));
  populate('product-list', products);
  // Attach add to cart handlers
  document.body.addEventListener('click', (e)=>{
    if(e.target.matches('.add')){
      const id = Number(e.target.dataset.id);
      addToCart(id,1);
    }
  });

  // Product page add
  const addToCartProd = el('#addToCartProd');
  if(addToCartProd){
    addToCartProd.addEventListener('click', ()=>{
      const qty = Number(el('#qty').value || 1);
      // reading product on page (simple demo uses first product)
      addToCart(1, qty);
    });
  }

  // Cart toggle
  const toggle = el('#cartToggle') || el('#cartToggleShop') || el('#cartToggleProd');
  if(toggle) toggle.addEventListener('click', ()=> toggleCart());

  // contact form
  const contactForm = el('#contactForm');
  if(contactForm){
    contactForm.addEventListener('submit', (ev)=>{
      ev.preventDefault();
      alert('Thanks! Your message was received (demo).');
      contactForm.reset();
    });
  }

  // update counts
  renderCartCount();
}

function getCart(){
  return JSON.parse(localStorage.getItem('luxe_cart')||'[]');
}
function saveCart(cart){
  localStorage.setItem('luxe_cart', JSON.stringify(cart));
  renderCartCount();
  renderCartPanel();
}

function addToCart(id, qty){
  const cart = getCart();
  const found = cart.find(i=>i.id===id);
  if(found) found.qty += qty;
  else cart.push({id,qty});
  saveCart(cart);
  alert('Added to cart');
}

function renderCartCount(){
  const cart = getCart();
  const count = cart.reduce((s,i)=>s+i.qty,0);
  const els = [el('#cart-count'), el('#cart-count-shop'), el('#cart-count-prod')];
  els.forEach(x=>{ if(x) x.textContent = count });
}

function renderCartPanel(){
  const cart = getCart();
  const itemsEl = el('#cartItems') || el('#cartItemsShop');
  const totalEl = el('#cartTotal') || el('#cartTotalShop');
  if(!itemsEl) return;
  if(cart.length===0){
    itemsEl.innerHTML = '<p>Your cart is empty.</p>';
    totalEl.textContent = '$0.00';
    return;
  }
  let html = '';
  let total = 0;
  cart.forEach(ci=>{
    const p = products.find(x=>x.id===ci.id);
    const sub = p.price * ci.qty;
    total += sub;
    html += `<div style="margin-bottom:10px"><strong>${p.title}</strong><div>${ci.qty} × $${p.price.toFixed(2)} = $${sub.toFixed(2)}</div></div>`;
  });
  itemsEl.innerHTML = html;
  totalEl.textContent = '$' + total.toFixed(2);
}

function toggleCart(){
  const panel = el('#cartPanel') || el('#cartPanelShop') || el('#cartPanelProd');
  if(!panel) return;
  if(panel.style.display === 'block') panel.style.display = 'none';
  else {
    panel.style.display = 'block';
    renderCartPanel();
  }
}

document.addEventListener('DOMContentLoaded', initSite);
