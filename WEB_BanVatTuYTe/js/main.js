document.addEventListener("DOMContentLoaded", () => {

    //==========================Danh mục Sản phẩm tiêu biểu=========================
    // IDs cho danh mục tiêu biểu sẽ tương ứng với số ảnh (1 đến 20)
    const mincategoryImage = 1;
    const maxcategoryImage = 20;

    // Mảng tên danh mục (có thể nhiều hơn số ảnh, các tên vượt quá sẽ không được dùng trong loop ảnh 1-20)
    const categoryNames = [
        "Hồi sức & phòng mổ", "Thiết bị xét nghiệm", "Thăm dò chức năng", "Máy đo huyết áp",
        "Giường bệnh", "Tủ đầu giường bệnh", "Xe lăn", "Nhiệt kế điện tử", "Máy trợ thính",
        "Máy đo huyết áp điện tử", "Máy kích dung, hút dịch", "Kim luồn, khóa ba chạc",
        "Kim châm cứu", "Găng tay y tế", "Ống sonde, dây dẫn", "Hóa chất, sinh phẩm",
        "Test nhanh", "Dung dịch xịt mũi", "Dược phẩm", "Lòng ấp cho trẻ sơ sinh",
        "Dụng cụ trị liệu", "Bộ truyền giảm đau"
    ];

    // Gọi hàm renderProducts_SPTB để render danh mục, làm cho chúng có thể click được
    renderProducts_SPTB(".product-category", categoryNames, mincategoryImage, maxcategoryImage);


    //======================================== Sản phẩm Bán chạy & Nổi bật ===================================================
    // Định nghĩa lại các mảng sản phẩm bán chạy/nổi bật VỚI THUỘC TÍNH 'id'
    // Các ID này cần khớp với ID của sản phẩm tương ứng trong file data.js của bạn
    const featuredProducts = [
         // Các sản phẩm từ ảnh anh23.png đến anh34.png
         { id: 23, name: "Máy điện tim 12 kênh Bionet Cardio Q50", originalPrice: "90.000.000 ₫", discountedPrice: "81.000.000 ₫", discount: "10%"},
         { id: 24, name: "Máy monitor theo dõi bệnh nhân Bionet Brio X50", originalPrice: "87.000.000 ₫", discountedPrice: "78.300.000 ₫", discount: "10%"},
         { id: 25, name: "Máy đo huyết áp điện tử bắp tay Humed HM-A9", originalPrice: "890.000 ₫", discountedPrice: "712.000 ₫", discount: "20%"},
         { id: 26, name: "Máy điện tim 12 kênh Bionet Cardio Q70", originalPrice: "102.000.000 ₫", discountedPrice: "91.800.000 ₫", discount: "10%"},
         { id: 27, name: "Máy monitor theo dõi bệnh nhân Bionet Brio X70", originalPrice: "99.000.000 ₫", discountedPrice: "89.100.000 ₫", discount: "10%"},
         { id: 28, name: "Máy thở không xâm lấn cao cấp 3 in 1 Mekics HFT700", originalPrice: "175.000.000 ₫", discountedPrice: "140.000.000 ₫", discount: "20%"},
         { id: 29, name: "Máy monitor theo dõi bệnh nhân Bionet Brio X30", originalPrice: "75.000.000 ₫", discountedPrice: "67.500.000 ₫", discount: "10%"},
         { id: 30, name: "Máy xét nghiệm huyết học tự động 3 thành phần Rayto RT-7600", originalPrice: "135.000.000 ₫", discountedPrice: "128.250.000 ₫", discount: "5%"},
         { id: 31, name: "Máy huyết áp để bàn chuyên dụng cho bệnh viện Accuniq BP500", originalPrice: "65.000.000 ₫", discountedPrice: "52.000.000 ₫", discount: "20%"},
         { id: 32, name: "Máy đo độ bão hòa oxy máu cao cấp Medel OXYGEN PO01", originalPrice: "1.150.000 ₫", discountedPrice: "920.000 ₫", discount: "20%"},
         { id: 33, name: "Máy thở oxy dòng cao HFNC hiện đại Mekics HFT500", originalPrice: "135.000.000 ₫", discountedPrice: "108.000.000 ₫", discount: "20%"},
         { id: 34, name: "Máy sinh hóa máu tự động Rayto Chemray 420", originalPrice: "495.000.000 ₫", discountedPrice: "470.250.000 ₫", discount: "5%"}
     ];

     const featuredProducts_NB = [
         // Các sản phẩm từ ảnh anh35.png đến anh44.png
         { id: 35, name: "Máy đo đường huyết Accu-Chek Instant", originalPrice: "1.200.000 ₫", discountedPrice: "960.000 ₫", discount: "20%"},
         { id: 36, name: "Máy đo đường huyết Accu-Chek Performa", originalPrice: "1.300.000 ₫", discountedPrice: "1.040.000 ₫", discount: "20%"},
         { id: 37, name: "Máy đo đường huyết Accu-Chek Active", originalPrice: "1.100.000 ₫", discountedPrice: "880.000 ₫", discount: "20%"},
         { id: 38, name: "Máy đo đường huyết Glucometer Elite", originalPrice: "1.500.000 ₫", discountedPrice: "1.200.000 ₫", discount: "20%"},
         { id: 39, name: "Máy đo đường huyết Glucometer WaveSense Jazz", originalPrice: "1.600.000 ₫", discountedPrice: "1.280.000 ₫", discount: "20%"},
         { id: 40, name: "Máy đo đường huyết Glucometer WaveSense Keynote", originalPrice: "1.700.000 ₫", discountedPrice: "1.360.000 ₫", discount: "20%"},
         { id: 41, name: "Máy đo đường huyết Glucometer WaveSense Presto", originalPrice: "1.800.000 ₫", discountedPrice: "1.440.000 ₫", discount: "20%"},
         { id: 42, name: "Máy đo đường huyết Glucometer WaveSense Optium Exa", originalPrice: "1.900.000 ₫", discountedPrice: "1.520.000 ₫", discount: "20%"},
         { id: 43, name: "Máy đo đường huyết Glucometer WaveSense Optium Xceed", originalPrice: "2.000.000 ₫", discountedPrice: "1.600.000 ₫", discount: "20%"},
         { id: 44, name: "Máy đo đường huyết Glucometer WaveSense Optium Xceed Plus", originalPrice: "2.100.000 ₫", discountedPrice: "1.680.000 ₫", discount: "20%"}
     ];

     // Dải số ảnh tương ứng cho mỗi mảng sản phẩm
     const featuredProducts_BC_ImageRange = { min: 23, max: 34 };
     const featuredProducts_NB_ImageRange = { min: 35, max: 44 };

     // Gọi hàm renderProducts_BC để render sản phẩm bán chạy và nổi bật, làm cho chúng có thể click được
     renderProducts_BC(".product-featured", featuredProducts, featuredProducts_BC_ImageRange);
     renderProducts_BC(".product-featured-NB", featuredProducts_NB, featuredProducts_NB_ImageRange);


    // Gọi hàm để kích hoạt hiệu ứng cuộn ngang cho container danh mục
    enableScroll(".product-category");


    //=======================================================================================================
});

//================ Hàm hiển thị Danh mục Tiêu biểu (Updated for clickability) ==================
// containerCategory: Selector cho container div (e.g., ".product-category")
// categoryNamesArray: Mảng tên danh mục
// minImageIndex: Số ảnh bắt đầu cho danh mục này (e.g., 1)
// maxImageIndex: Số ảnh kết thúc cho danh mục này (e.g., 20)
function renderProducts_SPTB(containerCategory, categoryNamesArray, minImageIndex, maxImageIndex) {
    const productCategory = document.querySelector(containerCategory);
    if (!productCategory) {
        console.error(`Container cho danh mục không tìm thấy: ${containerCategory}`);
        return;
    }

    const fragment = document.createDocumentFragment();

    // Lặp dựa trên dải số ảnh (từ 1 đến 20)
    for (let i = minImageIndex; i <= maxImageIndex; i++) {
        const imgSrc = `../../img/Products/anh${i}.png`;
        // Ánh xạ số ảnh 'i' đến index tương ứng trong mảng tên danh mục (bắt đầu từ 0)
        const categoryNameIndex = i - minImageIndex;
        // Lấy tên danh mục, sử dụng tên fallback nếu index vượt quá giới hạn của mảng tên
        const name = categoryNameIndex < categoryNamesArray.length ? categoryNamesArray[categoryNameIndex] : `Danh mục ${i}`;
        const categoryId = i; // Sử dụng số ảnh 'i' làm ID cho danh mục (từ 1 đến 20)


        const categoryItem = document.createElement("div");
        categoryItem.className = "category-item";
        // Thêm thuộc tính data-category-id để lưu trữ ID danh mục
        categoryItem.dataset.categoryId = categoryId;
        categoryItem.style.cursor = 'pointer'; // Thêm style cursor để người dùng biết là click được

        categoryItem.innerHTML = `
            <img src="${imgSrc}" alt="${name}">
            <p>${name}</p>
        `;
        fragment.appendChild(categoryItem);
    }

    productCategory.appendChild(fragment);

    // --- Thêm lắng nghe sự kiện click cho các mục Danh mục ---
    productCategory.querySelectorAll('.category-item').forEach(item => {
        item.addEventListener('click', function() {
            // Lấy ID danh mục từ thuộc tính data-category-id
            const categoryId = this.dataset.categoryId;

            if (categoryId) {
                // Chuyển hướng đến trang danh sách sản phẩm, lọc theo ID danh mục
                // Giả định trang danh sách sản phẩm của bạn là products.html và sử dụng tham số 'category_id'
                window.location.href = `../products/index.html?category_id=${categoryId}`;
            } else {
                console.warn('Clicked category item is missing data-category-id attribute.', this);
            }
        });
    });
}

//================ Hàm hiển thị sản phẩm Bán chạy/Nổi bật (Updated for clickability) ==================
// containerSelector: Selector cho container div (e.g., ".product-featured")
// productsArray: Mảng các đối tượng sản phẩm bao gồm thuộc tính 'id'
// imageRange: Đối tượng { min: number, max: number } ánh xạ index của mảng sản phẩm đến số ảnh
function renderProducts_BC(containerSelector, productsArray, imageRange) {
    const container = document.querySelector(containerSelector);
    if (!container) {
         console.error(`Container cho sản phẩm không tìm thấy: ${containerSelector}`);
        return;
    }

    const fragment = document.createDocumentFragment();

    productsArray.forEach((product, index) => {
        // Tính số ảnh dựa trên vị trí sản phẩm trong mảng và dải ảnh được chỉ định
        const imageIndex = imageRange.min + index;
         // Kiểm tra xem số ảnh có nằm trong dải hợp lệ không
        if (imageIndex > imageRange.max) {
             console.warn(`Image index ${imageIndex} calculated for product at index ${index} exceeds max image index ${imageRange.max}. Skipping.`);
             return; // Bỏ qua nếu số ảnh vượt quá dải cho phép
        }
        const imgSrc = `../../img/Products/anh${imageIndex}.png`;


        // Đảm bảo đối tượng sản phẩm có ID để tạo link đến trang chi tiết
        if (typeof product.id === 'undefined') {
             console.warn(`Product at index ${index} in ${containerSelector} is missing an 'id'. Cannot create link.`);
             return; // Bỏ qua sản phẩm nếu thiếu ID
        }


        const productItem = document.createElement("div");
        productItem.className = "product-item";
        // Thêm thuộc tính data-product-id để lưu trữ ID sản phẩm
        productItem.dataset.productId = product.id; // Lưu ID sản phẩm thực tế
        productItem.style.cursor = 'pointer'; // Thêm style cursor


        productItem.innerHTML = `
            ${product.discount ? `<div class="discount-percent">${product.discount}</div>` : ''} <img src="${imgSrc}" alt="${product.name}">
            <h2>${product.name}</h2>
            ${product.originalPrice ? `<h3><del>${product.originalPrice}</del></h3>` : ''} <h3 class="price">${product.discountedPrice || product.price || product.originalPrice}</h3> ${product.status ? `<div class="status">${product.status}</div>` : ''} `;

        fragment.appendChild(productItem);
    });

    container.appendChild(fragment);

    // --- Thêm lắng nghe sự kiện click cho các mục Sản phẩm trong container này ---
    container.querySelectorAll('.product-item').forEach(item => {
        item.addEventListener('click', function() {
            // Lấy ID sản phẩm từ thuộc tính data-product-id
            const productId = this.dataset.productId;

            if (productId) {
                // Chuyển hướng đến trang chi tiết sản phẩm với ID sản phẩm
                // Giả định trang chi tiết sản phẩm của bạn là product-detail.html
                window.location.href = `../product-detail/index.html?id=${productId}`;
            } else {
                console.warn('Clicked product item is missing data-product-id attribute.', this);
            }
        });
    });
}


//================ Hiệu ứng cuộn ngang ==================
function enableScroll(containerSelector) {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    let isDown = false;
    let startX;
    let scrollLeft;

    container.addEventListener("mousedown", (e) => {
        isDown = true;
        container.classList.add("active");
        startX = e.pageX - container.offsetLeft;
        scrollLeft = container.scrollLeft;
    });

    container.addEventListener("mouseleave", () => {
        isDown = false;
        container.classList.remove("active");
    });

    container.addEventListener("mouseup", () => {
        isDown = false;
        container.classList.remove("active");
    });

    container.addEventListener("mousemove", (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - container.offsetLeft;
        const walk = (x - startX) * 2;
        container.scrollLeft = scrollLeft - walk;
    });
}