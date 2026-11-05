// TROQUE PELO SEU NÚMERO: Brasil + DDD + número, sem espaços ou símbolos.
const WHATSAPP_NUMBER = "5500000000000";
const cart = [];
const count = document.getElementById("cart-count");
const backdrop = document.getElementById("cart-backdrop");
const itemsBox = document.getElementById("cart-items");
const totalBox = document.getElementById("cart-total");

function money(value) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
function renderCart() {
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  count.textContent = totalItems;
  totalBox.textContent = money(total);
  if (!cart.length) {
    itemsBox.innerHTML = '<p class="empty">Seu carrinho está vazio.</p>';
    return;
  }
  itemsBox.innerHTML = cart.map((item, index) => `
    <div class="cart-row">
      <div><b>${item.name}</b><small>${money(item.price)} cada</small></div>
      <div class="qty">
        <button data-action="minus" data-index="${index}">−</button>
        <b>${item.qty}</b>
        <button data-action="plus" data-index="${index}">+</button>
      </div>
    </div>`).join("");
}
document.querySelectorAll(".add").forEach(button => {
  button.addEventListener("click", () => {
    const name = button.dataset.name;
    const price = Number(button.dataset.price);
    const found = cart.find(item => item.name === name);
    if (found) found.qty++;
    else cart.push({ name, price, qty: 1 });
    renderCart();
    button.textContent = "✓ Adicionado";
    setTimeout(() => button.textContent = "🛒 Adicionar", 900);
  });
});
itemsBox.addEventListener("click", event => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;
  const item = cart[Number(button.dataset.index)];
  if (button.dataset.action === "plus") item.qty++;
  if (button.dataset.action === "minus") item.qty--;
  if (item.qty <= 0) cart.splice(Number(button.dataset.index), 1);
  renderCart();
});
document.getElementById("open-cart").addEventListener("click", () => backdrop.classList.add("show"));
document.getElementById("close-cart").addEventListener("click", () => backdrop.classList.remove("show"));
backdrop.addEventListener("click", event => {
  if (event.target === backdrop) backdrop.classList.remove("show");
});
function sendOrder() {
  if (WHATSAPP_NUMBER === "5500000000000") {
    alert("Antes de usar, coloque o WhatsApp real no arquivo script.js.");
    return;
  }
  if (!cart.length) {
    alert("Adicione pelo menos um produto ao carrinho.");
    return;
  }
  const lines = cart.map(item => `${item.qty}x ${item.name} — ${money(item.price * item.qty)}`);
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const message = encodeURIComponent(`Olá, Parceiros Burguês! Quero fazer este pedido:\n\n${lines.join("\n")}\n\nTotal dos produtos: ${money(total)}\n\nPode confirmar a disponibilidade e a taxa de entrega?`);
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, "_blank");
}
document.getElementById("checkout").addEventListener("click", () => {
  if (!cart.length) backdrop.classList.add("show");
  else sendOrder();
});
document.getElementById("cart-checkout").addEventListener("click", sendOrder);
renderCart();
