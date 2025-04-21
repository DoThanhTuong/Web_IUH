document.addEventListener('DOMContentLoaded', function () {

  // Function to format price
  function formatPrice(price) {
      const numericPrice = typeof price === 'string' ? parseFloat(price.replace(/[^0-9.-]+/g, "")) : price;
      if (isNaN(numericPrice)) {
          return price;
      }
      return numericPrice.toLocaleString('vi-VN') + ' ₫';
  }

  // Make sure the products array is loaded globally from ../js/data.js
  if (typeof products === 'undefined' || !Array.isArray(products)) {
      console.error('Error: products array not found or is not an array. Make sure data.js is loaded correctly.');
      // You might want to display a prominent error message on the page
      const errorContainerElement = document.getElementById('error-message');
       if (errorContainerElement) {
           errorContainerElement.textContent = 'Lỗi tải dữ liệu sản phẩm. Vui lòng thử lại sau.';
           errorContainerElement.style.display = 'block';
       }
      const productCardElement = document.querySelector('.card.product-card');
       if(productCardElement) productCardElement.style.display = 'none';

      return; // Stop script execution if products data is missing
  }


  // Get product ID from URL query parameter
  const urlParams = new URLSearchParams(window.location.search);
  // Use 0 as a default if id is not found or not a valid number
  const productId = parseInt(urlParams.get('id')) || 0;

  // Find the product in the products array
  const product = products.find(p => p.id === productId);

  // Get references to product display elements
  const productCardElement = document.querySelector('.card.product-card'); // Or the main container holding details
  const errorContainerElement = document.getElementById('error-message'); // Element to show if product is not found

  const productImageElement = document.getElementById('product-image');
  const productNameElement = document.getElementById('product-name');
  const productBrandElement = document.getElementById('product-brand');
  const productPriceElement = document.getElementById('product-price');
  const productCategoryElement = document.getElementById('product-category');
  const productUnitElement = document.getElementById('product-unit');
  const productPackagingElement = document.getElementById('product-packaging');
  const productModelElement = document.getElementById('product-model');
  const productOriginElement = document.getElementById('product-origin');
  const productDescriptionElement = document.getElementById('product-description');

  // Get references to the modal elements (for "Đặt hàng" function)
  // Assuming you have a Bootstrap modal with ID 'orderModal' and elements inside it
  const orderModalElement = document.getElementById('orderModal');
  let orderModal;
  if (orderModalElement) {
      // Use Bootstrap 5 Modal API
      orderModal = new bootstrap.Modal(orderModalElement);
  }

  const modalProductName = document.getElementById('modal-product-name');
  const modalProductId = document.getElementById('modal-product-id'); // Assuming this is a hidden input in modal
  const modalProductPricePerUnit = document.getElementById('modal-product-price-per-unit');
  const modalTotalPrice = document.getElementById('modal-total-price');
  const productQuantityInput = document.getElementById('productQuantity'); // Quantity input on the detail page and used in modal
  const confirmOrderBtn = document.getElementById('confirmOrderBtn'); // Confirm button inside modal
  const orderButton = document.getElementById('orderButton'); // Button on the detail page to open modal

  // Get reference to the "Thêm vào giỏ hàng" button (assuming it exists)
  const addToCartButton = document.getElementById('addToCartButton');


  if (product) {
      // Product found, update page title and display details

      // Update page title
      document.title = product.name + " - Chi tiết sản phẩm";

      // Update product image
      if (productImageElement) {
          productImageElement.src = product.img;
          productImageElement.alt = product.name;
      }

      // Update product details
      if (productNameElement) productNameElement.textContent = product.name;
      if (productBrandElement) productBrandElement.textContent = product.brand;
      if (productPriceElement) productPriceElement.textContent = formatPrice(product.price);
      if (productCategoryElement && product.category) productCategoryElement.textContent = product.category;
      if (productUnitElement && product.unit) productUnitElement.textContent = product.unit;
      if (productPackagingElement && product.packaging) productPackagingElement.textContent = product.packaging;
      if (productModelElement && product.model) productModelElement.textContent = product.model;
      if (productOriginElement && product.origin) productOriginElement.textContent = product.origin;


      // Update description
      if (productDescriptionElement) {
          if (product.description) {
              productDescriptionElement.textContent = product.description;
          } else {
              productDescriptionElement.textContent = "Đang cập nhật mô tả.";
          }
      }

      // Hide error message and show product card (or detail container)
      if (errorContainerElement) errorContainerElement.style.display = 'none';
      // Assuming productCardElement or similar is your main product detail view container
      if (productCardElement) productCardElement.style.display = ''; // Show the element


      // --- Add to Cart Logic (using localStorage) ---

      // Add event listener to the "Thêm vào giỏ hàng" button
      if (addToCartButton && productQuantityInput) { // Ensure both button and quantity input exist
          addToCartButton.addEventListener('click', function () {
              const quantity = parseInt(productQuantityInput.value); // Get quantity from the shared input

              if (isNaN(quantity) || quantity <= 0) {
                  alert('Vui lòng nhập số lượng hợp lệ.');
                  return;
              }

              // Get existing cart from localStorage or initialize an empty array
              const cart = JSON.parse(localStorage.getItem('cart')) || [];

              // Check if the product is already in the cart
              const existingProductIndex = cart.findIndex(item => item.id === product.id);

              if (existingProductIndex > -1) {
                  // Product exists, update quantity
                  cart[existingProductIndex].quantity += quantity;
              } else {
                  // Product does not exist, add it
                  // Store necessary details for the cart page display
                  cart.push({
                      id: product.id,
                      name: product.name,
                      price: product.price, // Store original price (number)
                      quantity: quantity,
                      img: product.img // Store image path
                      // Add other details if you want to display them in the cart page (e.g., unit, brand)
                  });
              }

              // Save updated cart back to localStorage
              localStorage.setItem('cart', JSON.stringify(cart));

              // Provide user feedback
              alert(`${quantity} sản phẩm "${product.name}" đã được thêm vào giỏ hàng!`);

              // Optional: Update a cart counter in the header here if you have one.

              // Optional: Redirect to cart page after adding
              // window.location.href = 'cart.html'; // Uncomment if you want to redirect
          });
      }


      // --- Modal Logic ("Đặt hàng") ---

      // Add event listener to the "Đặt hàng" button on the detail page
      if (orderButton && orderModalElement && productQuantityInput && modalProductName && modalProductId && modalProductPricePerUnit && modalTotalPrice) {
           orderButton.addEventListener('click', function () {
              // Populate modal with product info from the current detail page product
              if (modalProductName) modalProductName.textContent = product.name;
              if (modalProductId) modalProductId.value = product.id; // Store ID in a hidden input if needed
              const unitPrice = product.price; // Use the original price number
              if (modalProductPricePerUnit) modalProductPricePerUnit.textContent = formatPrice(unitPrice);

              // Calculate and display initial total price based on current quantity input value on the page
              const initialQuantity = parseInt(productQuantityInput.value) || 1; // Default to 1 if input is empty/invalid
              productQuantityInput.value = initialQuantity; // Ensure modal input matches page input
              const initialTotal = unitPrice * initialQuantity;
              if (modalTotalPrice) modalTotalPrice.textContent = formatPrice(initialTotal);

              // Show the modal
              orderModal.show(); // Use Bootstrap 5 show method
          });
      } else {
          // Log warnings if essential order/modal elements are missing
          if(!orderButton) console.warn("Order button (#orderButton) not found on detail page!");
          if(!orderModalElement) console.warn("Order modal element (#orderModal) not found!");
           // ... check other modal elements if needed
      }


      // Add event listener for quantity input change inside the modal
      // This uses the SAME quantity input on the page, referenced as productQuantityInput
      if (productQuantityInput && modalProductPricePerUnit && modalTotalPrice) {
           productQuantityInput.addEventListener('input', function () {
              const quantity = parseInt(this.value) || 0; // Get quantity, default to 0 if invalid
              const unitPriceText = modalProductPricePerUnit.textContent;

              // Parse the price string to a number (handle potential thousand separators and decimal)
              const unitPrice = parseFloat(unitPriceText.replace(/[^0-9,.]/g, "").replace(/\./g, '').replace(',', '.'));

              const total = unitPrice * quantity;
              if (modalTotalPrice) modalTotalPrice.textContent = formatPrice(total); // Format the calculated total
          });
      } else {
          // Log warnings if essential elements for modal quantity calculation are missing
          // if(!productQuantityInput) console.warn("Product quantity input (#productQuantity) not found!");
          // if(!modalProductPricePerUnit) console.warn("Modal unit price element (#modal-product-price-per-unit) not found!");
          // if(!modalTotalPrice) console.warn("Modal total price element (#modal-total-price) not found!");
      }


      // Add event listener for the "Thanh toán" button inside the modal (Confirm Order)
      if (confirmOrderBtn && orderModal) { // Ensure button and modal instance exist
          confirmOrderBtn.addEventListener('click', function () {
              // Collect customer info from the modal form inputs
              const customerNameInput = document.getElementById('customerName');
              const customerPhoneInput = document.getElementById('customerPhone');
              const customerAddressInput = document.getElementById('customerAddress');

              const customerName = customerNameInput ? customerNameInput.value.trim() : '';
              const customerPhone = customerPhoneInput ? customerPhoneInput.value.trim() : '';
              const customerAddress = customerAddressInput ? customerAddressInput.value.trim() : '';

              // Use the quantity from the modal's quantity input
              const quantity = parseInt(document.getElementById('productQuantity').value) || 0;

              // Get the product details. 'product' variable is already available from the page load logic.
              const orderedProduct = product;

              // Basic validation
              if (!customerName || !customerPhone || !customerAddress || quantity <= 0 || !orderedProduct) {
                  alert('Vui lòng điền đầy đủ thông tin liên hệ và số lượng hợp lệ.');
                  // Add validation highlighting
                  if(customerNameInput) customerNameInput.classList.toggle('is-invalid', !customerName);
                  if(customerPhoneInput) customerPhoneInput.classList.toggle('is-invalid', !customerPhone);
                  if(customerAddressInput) customerAddressInput.classList.toggle('is-invalid', !customerAddress);
                  // Quantity/product validation is handled by the alert
                  return; // Stop if validation fails
              } else {
                  // Remove validation highlighting if successful
                  if(customerNameInput) customerNameInput.classList.remove('is-invalid');
                  if(customerPhoneInput) customerPhoneInput.classList.remove('is-invalid');
                  if(customerAddressInput) customerAddressInput.classList.remove('is-invalid');
              }


              // Compile order details for THIS single product order
              const orderItems = [{
                  id: orderedProduct.id,
                  name: orderedProduct.name,
                  price: orderedProduct.price, // Unit price (number)
                  quantity: quantity,
                  subtotal: orderedProduct.price * quantity // Subtotal (number)
              }];

              const finalOrderTotal = orderItems[0].subtotal; // Total for this single item order


              // --- Create Order Object ---
              const order = {
                  timestamp: new Date().toISOString(), // Standard format for date/time
                  customerInfo: { // Save customer info at time of order
                      name: customerName,
                      phone: customerPhone,
                      address: customerAddress
                  },
                  items: orderItems, // Array containing just the one item being ordered
                  totalAmount: finalOrderTotal // Total for this single item order
              };

              // --- Save Order to History in localStorage ---
              try {
                  const history = JSON.parse(localStorage.getItem('purchaseHistory')) || [];
                  history.push(order); // Add the new order object to the history array
                  localStorage.setItem('purchaseHistory', JSON.stringify(history)); // Save the updated history array

                  console.log('Đơn hàng đã được lưu vào lịch sử (từ trang chi tiết):', order);

                  // --- Success Feedback & Close Modal ---
                  alert('Đặt hàng thành công! Chúng tôi sẽ liên hệ với bạn sớm nhất.');
                  orderModal.hide(); // Close the modal

                  // Optional: Clear the order form fields after successful order
                   if (customerNameInput) customerNameInput.value = '';
                   if (customerPhoneInput) customerPhoneInput.value = '';
                   if (customerAddressInput) customerAddressInput.value = '';
                   // Quantity input value is often reset by modal hide/show

                   // In a real application, you might redirect to cart/history page or show a persistent success message
                   // window.location.href = 'cart.html'; // Example redirect to cart page

              } catch (e) {
                  console.error("Failed to save order history to localStorage:", e);
                  alert("Lỗi: Không thể lưu lịch sử đặt hàng. Vui lòng thử lại hoặc kiểm tra cài đặt trình duyệt.");
                  // Don't hide modal on localStorage error
              }

              // --- Send Order Data to Backend (Placeholder) ---
              // If you have a backend API to handle orders, this is where you would send the 'order' object.
              // Example using fetch (commented out):
              /*
              fetch('/api/place-single-order', { // Replace with your actual backend URL
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json',
                      // Add any necessary authentication headers
                  },
                  body: JSON.stringify(order) // Send the compiled order object
              })
              .then(response => response.json())
              .then(data => {
                  console.log('Backend order response:', data);
                  if (data.success) {
                      // If backend confirms success, then save to local history (if needed) and show success message/redirect
                      // Note: If backend saves history, you might not need to save it locally here.
                      // This depends on your architecture. For client-side history, save locally AFTER confirmed by backend if possible.

                       const history = JSON.parse(localStorage.getItem('purchaseHistory')) || [];
                       history.push(order); // Add the new order to history (assuming backend doesn't return the full history)
                       localStorage.setItem('purchaseHistory', JSON.stringify(history));

                      alert('Đặt hàng thành công! Mã đơn hàng của bạn là: ' + (data.orderId || ''));
                      orderModal.hide();
                      // Redirect or show persistent success message (e.g., to cart.html or a dedicated order confirmation page)
                      // window.location.href = 'cart.html'; // Example redirect
                  } else {
                      alert('Lỗi đặt hàng từ máy chủ: ' + (data.message || 'Vui lòng thử lại.'));
                  }
              })
              .catch((error) => {
                  console.error('Error sending order to backend:', error);
                  alert('Lỗi kết nối máy chủ. Vui lòng thử lại sau.');
              });
              */

          });
      } else {
          // Log warnings if essential modal confirmation elements are missing
          if (!confirmOrderBtn) console.warn("Confirm order button (#confirmOrderBtn) not found!");
          if (!orderModalElement) console.warn("Order modal element (#orderModal) not found!");
      }


  } else {
      // Product not found - hide product card and display error message
      document.title = "Sản phẩm không tìm thấy";
      if (productCardElement) productCardElement.style.display = 'none';
      if (errorContainerElement) errorContainerElement.style.display = 'block';

      // Hide order button and add to cart button if product not found
      const orderButtonElement = document.getElementById('orderButton'); // Get button reference here
      const addToCartButtonElement = document.getElementById('addToCartButton'); // Get button reference here
      const productQuantityInputElement = document.getElementById('productQuantity'); // Get input reference here

      if (orderButtonElement) orderButtonElement.style.display = 'none';
      if (addToCartButtonElement) addToCartButtonElement.style.display = 'none';
      // Hide quantity input too
      if (productQuantityInputElement) productQuantityInputElement.style.display = 'none';
      const quantityLabel = document.querySelector('label[for="productQuantity"]');
      if (quantityLabel) quantityLabel.style.display = 'none';
  }
});