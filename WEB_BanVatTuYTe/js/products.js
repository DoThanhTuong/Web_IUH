document.addEventListener("DOMContentLoaded", () => {





 // Function to format price
      function formatPrice(price) {
          // Ensure price is a number before formatting
          const numericPrice = typeof price === 'string' ? parseFloat(price.replace(/[^0-9.-]+/g,"")) : price;
          if (isNaN(numericPrice)) {
            return price; // Return original value if not a valid number
          }
          return numericPrice.toLocaleString('vi-VN') + ' ₫';
      }

 // Render products
 function renderProducts(filteredProducts) {
  const container = document.getElementById('product-list-container');
  container.innerHTML = '';

  if (filteredProducts.length === 0) {
   container.innerHTML = '<div class="col-12"><p>Không tìm thấy sản phẩm nào trong danh mục này.</p></div>';
   return;
  }

      filteredProducts.forEach((product) => {
    const detailPageUrl = `../product-detail/index.html?id=${product.id}`;
        const productHtml = `
            <div class="product-item w-[205px]">
                <div class="card h-100 product-card">
                    <a href="${detailPageUrl}" class="product-img-link">
                        <img src="${product.img}" class="product-img" alt="${product.name}">
                    </a>
                    <div class="card-body">
                        <h5 class="product-title"><a href="${detailPageUrl}">${product.name}</a></h5>
                        <p class="product-price">${formatPrice(product.price)}</p>
                        <p class="product-brand">${product.brand}</p>
                    </div>
                </div>
            </div>
        `;
        container.innerHTML += productHtml;
  });
 }

     // Function to filter products based on current filters (Category, Price, Brand)
     function applyFilters() {
          let filteredProducts = products;

          // 1. Filter by Category
          let activeCategory = 'Tất cả sản phẩm';
          document.querySelectorAll('.category-list a').forEach(link => {
              if (link.classList.contains('active')) {
                  let categoryName = link.textContent.trim();
                  const countSpan = link.querySelector('.count');
                   if(countSpan) {
                      categoryName = link.textContent.replace(countSpan.textContent, '').trim();
                   } else {
                      categoryName = link.textContent.trim();
                   }
                  activeCategory = categoryName;
              }
          });

          if (activeCategory === 'Thiết bị y tế') {
              const subCategories = [
                  "Thiết bị y tế gia đình",
                  "Thiết bị Y tế Bệnh viện",
                  "Vật tư y tế cơ bản",
                  "Vật tư y tế chuyên khoa"
              ];
              filteredProducts = filteredProducts.filter(product => subCategories.includes(product.category));
          } else if (activeCategory !== 'Tất cả sản phẩm') {
               filteredProducts = filteredProducts.filter(product => product.category === activeCategory);
          }
          // If activeCategory is 'Tất cả sản phẩm', filteredProducts remains the full list

          // 2. Filter by Price Range
          const priceRangeSlider = document.getElementById('priceRange');
          const selectedPrice = parseInt(priceRangeSlider.value);
          filteredProducts = filteredProducts.filter(product => product.price <= selectedPrice);


          // 3. Filter by Brand
          const selectedBrands = [];
          document.querySelectorAll('.brand-list input[type="checkbox"]').forEach(checkbox => {
              if (checkbox.checked) {
                  // Get the brand name from the label associated with the checkbox
                  const label = checkbox.nextElementSibling; // Assuming label is next sibling
                  if (label) {
                      // Extract only the brand name before the country/info (e.g., "Humassis")
                      const fullText = label.textContent.trim();
                      const brandName = fullText.split(' - ')[0]; // Split by ' - ' and take the first part
                      selectedBrands.push(brandName);
                  }
              }
          });

          if (selectedBrands.length > 0) {
              filteredProducts = filteredProducts.filter(product => selectedBrands.includes(product.brand));
          }
          // If no brands are selected, this filter step is skipped, showing products from any brand


          // Render the filtered products
          renderProducts(filteredProducts);
      }


 // Function to format price
      function formatPrice(price) {
          // Ensure price is a number before formatting
          const numericPrice = typeof price === 'string' ? parseFloat(price.replace(/[^0-9.-]+/g,"")) : price;
          if (isNaN(numericPrice)) {
            return price; // Return original value if not a valid number
          }
          return numericPrice.toLocaleString('vi-VN') + ' ₫';
      }
      // Add event listeners to category links
      document.querySelectorAll('.category-list a').forEach(link => {
          link.addEventListener('click', function(event) {
              event.preventDefault();

              // Remove 'active' class from all category links
              document.querySelectorAll('.category-list a').forEach(catLink => {
                  catLink.classList.remove('active');
              });

              // Add 'active' class to the clicked link
              this.classList.add('active');

              // Reset brand checkboxes and price slider when category changes
              document.querySelectorAll('.brand-list input[type="checkbox"]').forEach(checkbox => {
                  checkbox.checked = false;
              });
              const priceRangeSlider = document.getElementById('priceRange');
              priceRangeSlider.value = priceRangeSlider.max;
              document.getElementById('price-range-value').textContent = formatPrice(parseInt(priceRangeSlider.max));


              // Apply filters
              applyFilters();
          });
      });

      // Event listener for Price Range Slider
      const priceRangeSlider = document.getElementById('priceRange');
      const priceRangeValueSpan = document.getElementById('price-range-value');

      // Initialize displayed price value on page load
      priceRangeValueSpan.textContent = formatPrice(parseInt(priceRangeSlider.value));

      priceRangeSlider.addEventListener('input', function() {
          const selectedPrice = parseInt(this.value);
          priceRangeValueSpan.textContent = formatPrice(selectedPrice);
          // Apply filters
          applyFilters();
      });

      // Event listeners for Brand Checkboxes
      document.querySelectorAll('.brand-list input[type="checkbox"]').forEach(checkbox => {
          checkbox.addEventListener('change', function() {
              // Apply filters
              applyFilters();
          });
      });

      // Function to calculate and display product counts per category
      function displayCategoryCounts() {
          const categoryCounts = {};

          // Initialize counts for all categories and subcategories in the HTML structure
          document.querySelectorAll('.category-list a').forEach(link => {
               let categoryName = link.textContent.trim();
               const countSpan = link.querySelector('.count');
                 if(countSpan) {
                    categoryName = link.textContent.replace(countSpan.textContent, '').trim();
                 } else {
                    categoryName = link.textContent.trim();
                 }
              categoryCounts[categoryName] = 0;
          });


          // Count products for each category
          products.forEach(product => {
              if (categoryCounts.hasOwnProperty(product.category)) {
                  categoryCounts[product.category]++;
              }
              // Also count for the parent "Thiết bị y tế" category
              if (["Thiết bị y tế gia đình", "Thiết bị Y tế Bệnh viện", "Vật tư y tế cơ bản", "Vật tư y tế chuyên khoa"].includes(product.category)) {
                  if (categoryCounts.hasOwnProperty('Thiết bị y tế')) {
                       categoryCounts['Thiết bị y tế']++;
                  } else {
                       categoryCounts['Thiết bị y tế'] = 1; 
                  }
              }
          });

          document.querySelectorAll('.category-list a').forEach(link => {
              let categoryName = link.textContent.trim();
               const countSpan = link.querySelector('.count');
                 if(countSpan) {
                    categoryName = link.textContent.replace(countSpan.textContent, '').trim();
                 } else {
                    categoryName = link.textContent.trim();
                 }

              if (categoryCounts.hasOwnProperty(categoryName)) {
                  const countElement = link.querySelector('.count');
                  if (countElement) {
                      countElement.textContent = `(${categoryCounts[categoryName]})`;
                  }
              }
          });
      }

      displayCategoryCounts();

      applyFilters();

    });
