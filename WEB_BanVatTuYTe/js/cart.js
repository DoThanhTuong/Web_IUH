
document.addEventListener('DOMContentLoaded', function () {

    // Function to format price (should be consistent across pages)
    function formatPrice(price) {
        const numericPrice = typeof price === 'string' ? parseFloat(price.replace(/[^0-9.-]+/g, "")) : price;
        if (isNaN(numericPrice)) {
            return price;
        }
        return numericPrice.toLocaleString('vi-VN') + ' ₫';
    }

    // Ensure products array is available globally from data.js
    if (typeof products === 'undefined' || !Array.isArray(products)) {
        console.error('Error: products array not found or is not an array. Make sure data.js is loaded correctly and defines a global "products" array.');
        const cartItemsContainer = document.querySelector('.cart___row');
        if (cartItemsContainer) {
            cartItemsContainer.innerHTML = '<p class="col-12 alert alert-danger">Lỗi tải dữ liệu sản phẩm. Vui lòng thử lại sau.</p>';
        }
        return; // Stop script execution if products data is missing
    }


    // --- Get References to Page Elements ---
    const cartItemsContainer = document.querySelector('.cart___row'); // Container for current cart display
    // The page total element is dynamically created within renderCart

    // Elements for Order History section
    const orderHistorySection = document.getElementById('order-history-section');
    const orderHistoryContainer = document.getElementById('order-history-container');
    const noHistoryMessage = document.getElementById('no-history-message');
    const historyTableWrapper = document.getElementById('history-table-wrapper');


    // --- Get References to Modal Elements ---
    const checkoutModalElement = document.getElementById('checkoutModal'); // The modal div
    const modalCartItemsSummary = document.getElementById('modal-cart-items-summary'); // Div to list items in modal
    const modalOrderTotal = document.getElementById('modal-order-total'); // Span for total in modal
    const confirmOrderModalBtn = document.getElementById('confirmOrderModalBtn'); // Button inside modal
    // Get customer info inputs inside the modal when needed in the confirm listener

    // --- Function to Render the Current Cart Items on the Page ---
    function renderCart() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];

        if (!cartItemsContainer) { console.error("Cart container element (.cart___row) not found!"); return; }
        cartItemsContainer.innerHTML = ''; // Clear previous content


        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="col-12 text-center alert alert-info">Giỏ hàng của bạn trống.</p>';
            return; // Stop if cart is empty
        }

        // Create table structure for cart items
        cartItemsContainer.innerHTML = `
                <div class="col-12">
                    <table class="table table-bordered table-striped">
                        <thead>
                            <tr>
                                <th scope="col">Sản phẩm</th>
                                <th scope="col">Tên sản phẩm</th>
                                <th scope="col">Giá</th>
                                <th scope="col">Số lượng</th>
                                <th scope="col">Thành tiền</th>
                                <th scope="col">Xóa</th> <!-- For remove button -->
                                <th scope="col">Đặt Hàng</th> <!-- New column for 'Đặt hàng' button -->
                            </tr>
                        </thead>
                        <tbody id="cart-table-body">
                            <!-- Cart items will be rendered here -->
                        </tbody>
                    </table>
                    <!-- Total row outside the table but within the container -->
                    <div class="row justify-content-end">
                        <div class="col-md-auto text-right">
                            <h4>Tổng tiền: <span id="cart-page-total">${formatPrice(0)}</span></h4> <!-- Unique ID for page total -->
                        </div>
                    </div>
                     <!-- Checkout button (full cart) - dynamically added -->
                     <div class="row justify-content-end mt-3">
                          <div class="col-md-auto text-right">
                              <button class="btn btn-success btn-lg" id="proceedToCheckoutBtn">Tiến hành đặt hàng toàn bộ giỏ</button> <!-- Updated text -->
                          </div>
                      </div>
                 </div>
             `;

        const cartTableBody = document.getElementById('cart-table-body');
        const cartPageTotalElement = document.getElementById('cart-page-total'); // Get the page total element

        let total = 0; // Calculate total for the page display

        cart.forEach(item => {
            const productDetail = products.find(p => p.id === item.id);

            if (productDetail) {
                const itemSubtotal = productDetail.price * item.quantity;
                total += itemSubtotal;

                const cartItemHtml = `
                         <tr data-product-id="${item.id}">
                             <td><img src="${productDetail.img}" alt="${productDetail.name}" class="img-fluid" style="max-width: 50px; height: auto;"></td>
                             <td>${productDetail.name}</td>
                             <td>${formatPrice(productDetail.price)}</td>
                             <td>
                                 <input type="number" class="form-control form-control-sm item-quantity" value="${item.quantity}" min="1" data-product-id="${item.id}" style="width: 70px;">
                             </td>
                             <td class="item-subtotal-cell">${formatPrice(itemSubtotal)}</td> <!-- Added class -->
                             <td>
                                 <button class="btn btn-danger btn-sm remove-item" data-product-id="${item.id}">
                                     <i class="fas fa-trash"></i>
                                 </button>
                             </td>
                              <td>
                                  <button class="btn btn-sm btn-outline-primary order-single-item" data-product-id="${item.id}">Đặt hàng</button> <!-- New button -->
                              </td>
                         </tr>
                     `;
                if (cartTableBody) cartTableBody.innerHTML += cartItemHtml;
            } else {
                console.warn(`Product with ID ${item.id} found in cart but not in data.js. This item will not be displayed.`);
            }
        });

        // Update the page total price display
        if (cartPageTotalElement) cartPageTotalElement.textContent = formatPrice(total);

        // Add event listeners to the dynamically created elements
        addCartEventListeners();
    }

    // --- Function to Render Order History ---
    function renderOrderHistory() {
        const history = JSON.parse(localStorage.getItem('purchaseHistory')) || [];

        if (!orderHistoryContainer || !noHistoryMessage || !historyTableWrapper) {
            console.error("Order history elements not found!");
            return;
        }

        // Clear previous display
        historyTableWrapper.innerHTML = '';
        noHistoryMessage.style.display = 'none';
        if (orderHistorySection) orderHistorySection.style.display = 'block'; // Ensure history section is visible


        if (history.length === 0) {
            noHistoryMessage.style.display = 'block'; // Show "No history" message
            return; // Nothing to render
        }

        // Sort history by date (most recent first)
        history.sort((a, b) => {
            const dateA = new Date(a.timestamp);
            const dateB = new Date(b.timestamp);
            return dateB - dateA; // Descending order (newest first)
        });


        // Create the history table structure
        const historyTableHtml = `
                 <table class="table table-bordered table-striped table-hover">
                     <thead>
                         <tr>
                             <th scope="col">Thời gian đặt</th>
                             <th scope="col">Thông tin khách hàng</th>
                             <th scope="col">Sản phẩm</th>
                             <th scope="col">Tổng tiền</th>
                              <th scope="col"></th> <!-- New column for delete button -->
                         </tr>
                     </thead>
                     <tbody id="history-table-body">
                         <!-- History rows will go here -->
                     </tbody>
                 </table>
             `;

        historyTableWrapper.innerHTML = historyTableHtml;
        const historyTableBody = document.getElementById('history-table-body');

        history.forEach(order => {
            const orderDate = order.timestamp ? new Date(order.timestamp).toLocaleString('vi-VN') : 'N/A';

            const itemSummary = (order.items && order.items.length > 0) ?
                order.items.map(item => `${item.name} (x${item.quantity})`).join(', ')
                : 'Không có sản phẩm';

            const orderRowHtml = `
                     <tr data-timestamp="${order.timestamp}"> <!-- Add timestamp as data attribute -->
                         <td>${orderDate}</td>
                         <td>
                             ${order.customerInfo ? `<strong>Tên: ${order.customerInfo.name}</strong><br><strong>SĐT:</strong> ${order.customerInfo.phone || ''}<br><strong>Địa chỉ:</strong> ${order.customerInfo.address || ''}` : 'Thông tin khách hàng không đầy đủ'}
                         </td>
                         <td>${itemSummary}</td>
                         <td><strong>${formatPrice(order.totalAmount || 0)}</strong></td>
                          <td>
                              <button class="btn btn-danger btn-sm remove-order" data-timestamp="${order.timestamp}">
                                  <i class="fas fa-trash"></i> Xóa
                              </button>
                          </td>
                     </tr>
                 `;
            if (historyTableBody) historyTableBody.innerHTML += orderRowHtml;
        });

        // Add event listeners for history buttons
        addHistoryEventListeners();
    }


    // --- Function to Add Event Listeners for Cart Items and Checkout Button ---
    function addCartEventListeners() {
        // Event listeners for quantity inputs (change and input)
        document.querySelectorAll('.item-quantity').forEach(input => {
            input.addEventListener('change', function () { /* ... updateCartItemQuantity ... */
                const productId = parseInt(this.dataset.productId);
                const newQuantity = parseInt(this.value);
                if (isNaN(newQuantity) || newQuantity <= 0) {
                    alert('Số lượng không hợp lệ. Vui lòng nhập số lượng lớn hơn 0.');
                    const cart = JSON.parse(localStorage.getItem('cart')) || [];
                    const item = cart.find(item => item.id === productId);
                    this.value = item ? item.quantity : 1;
                    return;
                }
                updateCartItemQuantity(productId, newQuantity);
            });

            input.addEventListener('input', function () { /* ... real-time subtotal update ... */
                const productId = parseInt(this.dataset.productId);
                const productDetail = products.find(p => p.id === productId);
                const quantity = parseInt(this.value) || 0;
                if (productDetail) {
                    const itemSubtotal = productDetail.price * quantity;
                    const subtotalCell = this.closest('tr').querySelector('.item-subtotal-cell');
                    if (subtotalCell) {
                        subtotalCell.textContent = formatPrice(itemSubtotal);
                    }
                }
            });
        });

        // Event listeners for remove buttons
        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', function () {
                const productId = parseInt(this.dataset.productId);
                if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?')) {
                    removeFromCart(productId);
                }
            });
        });

        // --- Event listener for the "Tiến hành đặt hàng toàn bộ giỏ" button (on the page) ---
        const proceedToCheckoutBtn = document.getElementById('proceedToCheckoutBtn');
        if (proceedToCheckoutBtn && checkoutModalElement && modalCartItemsSummary && modalOrderTotal) {
            proceedToCheckoutBtn.addEventListener('click', function () {
                const cart = JSON.parse(localStorage.getItem('cart')) || [];

                if (cart.length === 0) {
                    alert('Giỏ hàng trống, không thể đặt hàng.');
                    return;
                }

                // Set context to full cart order
                currentOrderContext = 'cart';

                // Populate the modal's cart item summary with ALL items
                modalCartItemsSummary.innerHTML = '';
                let currentModalTotal = 0;
                if (cart.length > 0) {
                    const itemsListHtml = cart.map(item => {
                        const productDetail = products.find(p => p.id === item.id);
                        if (productDetail) {
                            const itemSubtotal = productDetail.price * item.quantity;
                            currentModalTotal += itemSubtotal; // Calculate total for modal
                            return `
                                    <p><strong>${productDetail.name}</strong> x ${item.quantity} (${formatPrice(itemSubtotal)})</p>
                                `;
                        }
                        return '';
                    }).join('');
                    modalCartItemsSummary.innerHTML = itemsListHtml;
                }

                // Populate the modal's total amount
                if (modalOrderTotal) {
                    modalOrderTotal.textContent = formatPrice(currentModalTotal);
                }

                // Show the checkout modal using jQuery/Bootstrap 4 API
                $('#checkoutModal').modal('show');
            });
        } else {
            // Log warnings if essential elements are missing after render
            if (cartItemsContainer && cartItemsContainer.querySelector('#proceedToCheckoutBtn')) {
                if (!checkoutModalElement) console.warn("Checkout modal element (#checkoutModal) not found!");
                if (!modalCartItemsSummary) console.warn("Modal cart items summary element (#modal-cart-items-summary) not found!");
                if (!modalOrderTotal) console.warn("Modal order total element (#modal-order-total) not found!");
            }
        }

        // --- Event listener for the "Đặt hàng" button for each item ---
        document.querySelectorAll('.order-single-item').forEach(button => {
            button.addEventListener('click', function () {
                const productId = parseInt(this.dataset.productId);
                const cart = JSON.parse(localStorage.getItem('cart')) || [];
                const itemToOrder = cart.find(item => item.id === productId); // Find the item in the current cart

                if (!itemToOrder) {
                    alert('Sản phẩm không có trong giỏ hàng!'); // Should not happen if button is rendered correctly
                    return;
                }

                const productDetail = products.find(p => p.id === productId);

                if (!productDetail) {
                    alert('Không tìm thấy thông tin chi tiết sản phẩm.');
                    return;
                }

                // Set context to single item order
                currentOrderContext = { type: 'item', productId: productId };

                // Populate the modal's cart item summary with ONLY this item
                modalCartItemsSummary.innerHTML = '';
                const itemSubtotal = productDetail.price * itemToOrder.quantity; // Use quantity from cart
                const itemHtml = `
                         <p><strong>${productDetail.name}</strong> x ${itemToOrder.quantity} (${formatPrice(itemSubtotal)})</p>
                     `;
                modalCartItemsSummary.innerHTML = itemHtml;

                // The modal total is just the subtotal of this item
                if (modalOrderTotal) {
                    modalOrderTotal.textContent = formatPrice(itemSubtotal);
                }

                // Show the checkout modal
                $('#checkoutModal').modal('show');
            });
        });


    }

    // --- Function to Add Event Listeners for History Buttons ---
    function addHistoryEventListeners() {
        // Event listeners for remove order buttons
        document.querySelectorAll('.remove-order').forEach(button => {
            button.addEventListener('click', function () {
                // Get the timestamp string from the data attribute
                const orderTimestamp = this.dataset.timestamp;

                if (confirm('Bạn có chắc chắn muốn xóa đơn hàng này khỏi lịch sử?')) {
                    let history = JSON.parse(localStorage.getItem('purchaseHistory')) || [];
                    // Filter out the order with the matching timestamp
                    history = history.filter(order => order.timestamp !== orderTimestamp);
                    localStorage.setItem('purchaseHistory', JSON.stringify(history)); // Save updated history
                    renderOrderHistory(); // Re-render the history display
                }
            });
        });
    }


    // --- Function to Update Item Quantity in localStorage and Re-render Cart ---
    function updateCartItemQuantity(productId, newQuantity) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const itemIndex = cart.findIndex(item => item.id === productId);

        if (itemIndex > -1) {
            cart[itemIndex].quantity = Math.max(1, newQuantity); // Ensure quantity doesn't go below 1
            localStorage.setItem('cart', JSON.stringify(cart));
            renderCart(); // Re-render the cart to update subtotals and total
            // History doesn't change when cart quantity changes
        }
    }

    // --- Function to Remove Item from localStorage and Re-render Cart ---
    function removeFromCart(productId) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart = cart.filter(item => item.id !== productId); // Filter out the item
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart(); // Re-render the cart
        // History doesn't change when item is removed from cart
    }


    // --- Event listener for the "Xác nhận đặt hàng" button inside the modal ---
    if (confirmOrderModalBtn) {
        confirmOrderModalBtn.addEventListener('click', function () {
            // Collect customer info
            const customerNameInput = document.getElementById('customerName');
            const customerPhoneInput = document.getElementById('customerPhone');
            const customerAddressInput = document.getElementById('customerAddress');

            const customerName = customerNameInput ? customerNameInput.value.trim() : '';
            const customerPhone = customerPhoneInput ? customerPhoneInput.value.trim() : '';
            const customerAddress = customerAddressInput ? customerAddressInput.value.trim() : '';

            // Basic validation
            if (!customerName || !customerPhone || !customerAddress) {
                alert('Vui lòng điền đầy đủ thông tin: Họ và tên, Số điện thoại, Địa chỉ.');
                // Add validation highlighting
                if (customerNameInput) customerNameInput.classList.toggle('is-invalid', !customerName);
                if (customerPhoneInput) customerPhoneInput.classList.toggle('is-invalid', !customerPhone);
                if (customerAddressInput) customerAddressInput.classList.toggle('is-invalid', !customerAddress);
                return;
            } else {
                // Remove validation highlighting
                customerNameInput.classList.remove('is-invalid');
                customerPhoneInput.classList.remove('is-invalid');
                customerAddressInput.classList.remove('is-invalid');
            }

            let itemsToOrder = []; // Items that will be part of this order
            let orderTotal = 0;    // Total for this specific order
            let cartToKeep = [];   // Items remaining in cart after this order (for single item order)

            // --- Determine Order Items Based on Context ---
            if (currentOrderContext === 'cart') {
                // Ordering the whole cart
                const fullCart = JSON.parse(localStorage.getItem('cart')) || [];
                itemsToOrder = fullCart.map(item => {
                    const productDetail = products.find(p => p.id === item.id);
                    if (productDetail) { // Ensure product exists
                        orderTotal += productDetail.price * item.quantity;
                        return {
                            id: item.id,
                            name: productDetail.name,
                            price: productDetail.price,
                            quantity: item.quantity,
                            subtotal: productDetail.price * item.quantity
                        };
                    }
                    return null; // Skip invalid items
                }).filter(item => item !== null); // Filter out nulls


                if (itemsToOrder.length === 0) {
                    alert('Giỏ hàng trống hoặc không có sản phẩm hợp lệ để đặt hàng.');
                    $('#checkoutModal').modal('hide');
                    renderCart(); // Re-render page cart display
                    renderOrderHistory();
                    return;
                }

                // After ordering, the entire cart is removed
                cartToKeep = []; // Empty array
                localStorage.removeItem('cart'); // Explicitly remove
                console.log('Processing full cart order.');

            } else if (currentOrderContext.type === 'item' && currentOrderContext.productId) {
                // Ordering a single item
                const productIdToOrder = currentOrderContext.productId;
                const fullCart = JSON.parse(localStorage.getItem('cart')) || [];
                const itemBeingOrdered = fullCart.find(item => item.id === productIdToOrder);

                if (!itemBeingOrdered) {
                    alert('Sản phẩm không tìm thấy trong giỏ hàng để đặt.');
                    $('#checkoutModal').modal('hide');
                    renderCart(); // Re-render page cart display
                    renderOrderHistory();
                    return;
                }

                const productDetail = products.find(p => p.id === productIdToOrder);

                if (!productDetail) {
                    alert('Thông tin chi tiết sản phẩm đặt hàng không hợp lệ.');
                    $('#checkoutModal').modal('hide');
                    renderCart(); // Re-render page cart display
                    renderOrderHistory();
                    return;
                }

                // The items for this order is just the single item
                itemsToOrder = [{
                    id: itemBeingOrdered.id,
                    name: productDetail.name,
                    price: productDetail.price,
                    quantity: itemBeingOrdered.quantity,
                    subtotal: productDetail.price * itemBeingOrdered.quantity
                }];
                orderTotal = itemsToOrder[0].subtotal; // Total is just the subtotal

                // After ordering, remove ONLY this item from the cart
                cartToKeep = fullCart.filter(item => item.id !== productIdToOrder);
                localStorage.setItem('cart', JSON.stringify(cartToKeep)); // Save the remaining items back

                console.log(`Processing single item order for product ID: ${productIdToOrder}`);

            } else {
                // Should not happen with correct context setting
                console.error("Invalid order context:", currentOrderContext);
                alert('Đã xảy ra lỗi không xác định. Vui lòng thử lại.');
                $('#checkoutModal').modal('hide');
                return;
            }

            // --- Create and Save Order to History ---
            const order = {
                timestamp: new Date().toISOString(), // Standard format for date/time
                customerInfo: { // Save customer info at time of order
                    name: customerName,
                    phone: customerPhone,
                    address: customerAddress
                },
                items: itemsToOrder, // Save the compiled list of items for THIS order
                totalAmount: orderTotal // Save the calculated total for THIS order
            };

            const history = JSON.parse(localStorage.getItem('purchaseHistory')) || [];
            history.push(order); // Add the new order to history
            localStorage.setItem('purchaseHistory', JSON.stringify(history)); // Save updated history

            console.log('Đơn hàng đã được lưu vào lịch sử:', order);


            // --- Send Order Data to Backend ---
            // PLACEHOLDER: Implement your fetch() or XMLHttpRequest call here
            // e.g., fetch('/api/orders', { method: 'POST', body: JSON.stringify(order), headers: { 'Content-Type': 'application/json' } }).then(...)


            // --- Give Feedback and Re-render ---
            alert('Đặt hàng thành công! Cảm ơn bạn đã mua hàng. Chúng tôi sẽ liên hệ với bạn sớm nhất.');

            // Reset context
            currentOrderContext = 'cart';

            // Close the modal
            $('#checkoutModal').modal('hide');

            // Re-render BOTH cart (to show updated state) and history
            renderCart();
            renderOrderHistory();

        });
    } else {
        console.warn("Confirm order modal button (#confirmOrderModalBtn) not found!");
    }

    // --- Initial Render When Page Loads ---
    renderCart(); // Render the current cart
    renderOrderHistory(); // Render the order history

});

