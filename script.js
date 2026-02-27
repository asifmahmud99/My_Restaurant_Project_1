// ───── La Maison — Cart Logic ─────

const cart = [];

// DOM references
const cartItemsEl = document.getElementById('cart-items');
const cartEmptyEl = document.getElementById('cart-empty');
const cartFooterEl = document.getElementById('cart-footer');
const cartTotalEl = document.getElementById('cart-total');
const placeOrderBtn = document.getElementById('place-order-btn');
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

// ── Mobile menu toggle ──
mobileMenuBtn.addEventListener('click', () => {
  mobileMenu.classList.toggle('hidden');
});

// Close mobile menu on link click
mobileMenu.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    mobileMenu.classList.add('hidden');
  });
});

// ── Add to Cart ──
document.querySelectorAll('.add-to-cart').forEach((btn) => {
  btn.addEventListener('click', () => {
    const name = btn.dataset.name;
    const price = parseFloat(btn.dataset.price);

    const existing = cart.find((item) => item.name === name);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({ name, price, qty: 1 });
    }

    renderCart();
    showToast(`${name} added to cart`);
    // document.querySelector('nav a[href="#cart"]').innerText = `Cart (${cart.length})`;
  });
});

// ── Render Cart ──
function renderCart() {
  if (cart.length === 0) {
    cartEmptyEl.classList.remove('hidden');
    cartItemsEl.classList.add('hidden');
    cartFooterEl.classList.add('hidden');
    return;
  }

  cartEmptyEl.classList.add('hidden');
  cartItemsEl.classList.remove('hidden');
  cartFooterEl.classList.remove('hidden');

  cartItemsEl.innerHTML = cart
    .map(
      (item, index) => `
    <div class="cart-item flex items-center justify-between bg-darker/50 rounded-xl px-5 py-4 border border-white/5">
      <div>
        <p class="font-semibold">${item.name}</p>
        <p class="text-gray-400 text-sm">$${item.price.toFixed(2)} each</p>
      </div>
      <div class="flex items-center gap-3">
        <button onclick="updateQty(${index}, -1)"
          class="w-8 h-8 flex items-center justify-center rounded-full border border-white/10 text-gray-300 hover:border-brand hover:text-brand transition">
          −
        </button>
        <span class="w-6 text-center font-medium">${item.qty}</span>
        <button onclick="updateQty(${index}, 1)"
          class="w-8 h-8 flex items-center justify-center rounded-full border border-white/10 text-gray-300 hover:border-brand hover:text-brand transition">
          +
        </button>
        <button onclick="removeItem(${index})"
          class="ml-2 text-gray-500 hover:text-red-400 transition" title="Remove item">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>`
    )
    .join('');

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  cartTotalEl.textContent = `$${total.toFixed(2)}`;
}

// ── Update Quantity ──
function updateQty(index, delta) {
  cart[index].qty += delta;
  if (cart[index].qty <= 0) {
    cart.splice(index, 1);
  }
  renderCart();
}

// ── Remove Item ──
function removeItem(index) {
  const name = cart[index].name;
  cart.splice(index, 1);
  renderCart();
  showToast(`${name} removed`);
}

// ── Place Order ──
placeOrderBtn.addEventListener('click', () => {
  if (cart.length === 0) return;

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  showToast(`Order placed! Total: $${total.toFixed(2)} 🎉`);
  cart.length = 0;
  renderCart();
});

// ── Toast Notification ──
function showToast(message) {
  // Remove any existing toast
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => toast.remove(), 2500);
}

// ── Navbar background on scroll ──
window.addEventListener('scroll', () => {
  const nav = document.querySelector('nav');
  if (window.scrollY > 50) {
    nav.classList.add('shadow-lg');
  } else {
    nav.classList.remove('shadow-lg');
  }
});
