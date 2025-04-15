document.addEventListener("DOMContentLoaded", () => {
//==========================Danh mục Sản phẩm tiêu biểu=========================
   
    const categoryNames = [
        "Hồi sức & phòng mổ",
        "Thiết bị xét nghiệm",
        "Thăm dò chức năng",
        "Máy đo huyết áp",
        "Giường bệnh",
        "Tủ đầu giường bệnh",
        "Xe lăn",
        "Nhiệt kế điện tử",
        "Máy trợ thính",
        "Máy đo huyết áp điện tử",
        "Máy kích dung, hút dịch",
        "Kim luồn, khóa ba chạc",
        "Kim châm cứu",
        "Găng tay y tế",
        "Ống sonde, dây dẫn",
        "Hóa chất, sinh phẩm",
        "Test nhanh",
        "Dung dịch xịt mũi",
        "Dược phẩm",
        "Lòng ấp cho trẻ sơ sinh",
        "Dụng cụ trị liệu",
    ];

renderProducts_SPTB(".product-category", categoryNames);

    //======================================== bán chạy===================================================
    // Sản phẩm tiêu biểu
    // Gọi hàm renderProducts để render sản phẩm tiêu biểu

    const featuredProducts = [
        {
            img: "../img/BanChay/anh1.jpeg",
            name: "Máy điện tim 12 kênh Bionet Cardio Q50",
            originalPrice: "90.000.000 ₫",
            discountedPrice: "81.000.000 ₫",
            discount: "10%",
            
        },
        {
            img: "../img/BanChay/anh2.png",
            name: "Máy monitor theo dõi bệnh nhân Bionet Brio X50",
            originalPrice: "87.000.000 ₫",
            discountedPrice: "78.300.000 ₫",
            discount: "10%",
            
        },
        {
            img: "../img/BanChay/anh3.jpeg",
            name: "Máy đo huyết áp điện tử bắp tay Humed HM-A9",
            originalPrice: "890.000 ₫",
            discountedPrice: "712.000 ₫",
            discount: "20%",
        
        },
        {
            img: "../img/BanChay/anh4.webp",
            name: "Máy điện tim 12 kênh Bionet Cardio Q70",
            originalPrice: "102.000.000 ₫",
            discountedPrice: "91.800.000 ₫",
            discount: "10%",
        
        },
        {
            img: "../img/BanChay/anh5.jpeg",
            name: "Máy monitor theo dõi bệnh nhân Bionet Brio X70",
            originalPrice: "99.000.000 ₫",
            discountedPrice: "89.100.000 ₫",
            discount: "10%",
        
         },
         
        {
            img: "../img/BanChay/anh6.png",
            name: "Máy thở không xâm lấn cao cấp 3 in 1 Mekics HFT700",
            originalPrice: "175.000.000 ₫",
            discountedPrice: "140.000.000 ₫",
            discount: "20%",
        
        },
        {
            img: "../img/BanChay/anh7.png",
            name: "Máy monitor theo dõi bệnh nhân Bionet Brio X30",
            originalPrice: "75.000.000 ₫",
            discountedPrice: "67.500.000 ₫",
            discount: "10%",
        
        },
        {
            img: "../img/BanChay/anh8.jpeg",
            name: "Máy xét nghiệm huyết học tự động 3 thành phần Rayto RT-7600",
            originalPrice: "135.000.000 ₫",
            discountedPrice: "128.250.000 ₫",
            discount: "5%",
        
        },
        {
            img: "../img/BanChay/anh9.png",
            name: "Máy huyết áp để bàn chuyên dụng cho bệnh viện Accuniq BP500",
            originalPrice: "65.000.000 ₫",
            discountedPrice: "52.000.000 ₫",
            discount: "20%",
        
        },
        {
            img: "../img/BanChay/anh10.jpeg",
            name: "Máy đo độ bão hòa oxy máu cao cấp Medel OXYGEN PO01",
            originalPrice: "1.150.000 ₫",
            discountedPrice: "920.000 ₫",
            discount: "20%",
        
        },
        {
            img: "../img/BanChay/anh11.png",
            name: "Máy thở oxy dòng cao HFNC hiện đại Mekics HFT500",
            originalPrice: "135.000.000 ₫",
            discountedPrice: "108.000.000 ₫",
            discount: "20%",
        
        },
        {
            img: "../img/BanChay/anh12.jpeg",
            name: "Máy sinh hóa máu tự động Rayto Chemray 420",
            originalPrice: "495.000.000 ₫",
            discountedPrice: "470.250.000 ₫",
            discount: "5%",
        
        }

    ];

    const featuredProducts_NB = [
        {
            img: "../img/SanPhamNoiBat/anh1.png",
            name: "Máy đo đường huyết Accu-Chek Instant",
            originalPrice: "1.200.000 ₫",
            discountedPrice: "960.000 ₫",
            discount: "20%",
        
        },
        {
            img: "../img/SanPhamNoiBat/anh2.png",
            name: "Máy đo đường huyết Accu-Chek Performa",
            originalPrice: "1.300.000 ₫",
            discountedPrice: "1.040.000 ₫",
            discount: "20%",
        
        },
        {
            img: "../img/SanPhamNoiBat/anh3.png",
            name: "Máy đo đường huyết Accu-Chek Active",
            originalPrice: "1.100.000 ₫",
            discountedPrice: "880.000 ₫",
            discount: "20%",
        
        },
        {
            img: "../img/SanPhamNoiBat/anh4.png",
            name: "Máy đo đường huyết Glucometer Elite",
            originalPrice: "1.500.000 ₫",
            discountedPrice: "1.200.000 ₫",
            discount: "20%",
        
        },
        {
            img: "../img/SanPhamNoiBat/anh5.png",
            name: "Máy đo đường huyết Glucometer WaveSense Jazz",
            originalPrice: "1.600.000 ₫",
            discountedPrice: "1.280.000 ₫",
            discount: "20%",
        
        },
        {
            img: "../img/SanPhamNoiBat/anh6.png",
            name: "Máy đo đường huyết Glucometer WaveSense Keynote",
            originalPrice: "1.700.000 ₫",
            discountedPrice: "1.360.000 ₫",
            discount: "20%",
        
        },
        {
            img: "../img/SanPhamNoiBat/anh7.png",
            name: "Máy đo đường huyết Glucometer WaveSense Presto",
            originalPrice: "1.800.000 ₫",
            discountedPrice: "1.440.000 ₫",
            discount: "20%",
        
        },
        {
            img: "../img/SanPhamNoiBat/anh8.png",
            name: "Máy đo đường huyết Glucometer WaveSense Optium Exa",
            originalPrice: "1.900.000 ₫",
            discountedPrice: "1.520.000 ₫",
            discount: "20%",
        
        },
        {
            img: "../img/SanPhamNoiBat/anh9.png",
            name: "Máy đo đường huyết Glucometer WaveSense Optium Xceed",
            originalPrice: "2.000.000 ₫",
            discountedPrice: "1.600.000 ₫",
            discount: "20%",
        
        },
        {
            img: "../img/SanPhamNoiBat/anh10.png",
            name: "Máy đo đường huyết Glucometer WaveSense Optium Xceed Plus",
            originalPrice: "2.100.000 ₫",
            discountedPrice: "1.680.000 ₫",
            discount: "20%",
        
        }

    ];

    
    // Gọi hàm
renderProducts_BC(".product-featured", featuredProducts);
renderProducts_BC(".product-featured-NB", featuredProducts);
// Gọi hàm để kích hoạt hiệu ứng cuộn cho sản phẩm tiêu biểu
enableScroll(".product-category");
    
//=======================================================================================================
});
// Hàm render sản phẩm tiêu biểu
function renderProducts_SPTB(containerCategory, products) {
    const productCategory = document.querySelector(containerCategory);
    if (!productCategory) return;

    const totalImages = 21; // 👈 Bạn chỉ cần chỉnh số ảnh ở đây
    const fragment = document.createDocumentFragment();

    for (let i = 1; i <= totalImages; i++) {
        const imgSrc = `../img/DanhMucTieuBieu/anh${i}.png`;
        const name = products[i - 1] || `Danh mục ${i}`; // 👈 Nếu không có tên thì đặt mặc định

        const categoryItem = document.createElement("div");
        categoryItem.className = "category-item";
        categoryItem.innerHTML = `
            <img src="${imgSrc}" alt="${name}">
            <p>${name}</p>
        `;
        fragment.appendChild(categoryItem);
    }

    productCategory.appendChild(fragment);
}

// Hàm render sản phẩm bán chạy
function renderProducts_BC(containerSelector, products) {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    const fragment = document.createDocumentFragment();

    products.forEach(product => {
        const productItem = document.createElement("div");
        productItem.className = "product-item";

        productItem.innerHTML = `
            <div class="discount-percent">${product.discount}</div>
            <img src="${product.img}" alt="${product.name}">
            <h2>${product.name}</h2>
            <h3><del>${product.originalPrice}</del></h3>
            <h3 class="price">${product.discountedPrice}</h3>
            <div class="status">Đã mở bán</div>
        `;

        fragment.appendChild(productItem);
    });

    container.appendChild(fragment);
}
//hiệu ứng cuộn cho sản phẩm tiêu biểu
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
        const walk = (x - startX) * 2; // Tăng tốc độ cuộn
        container.scrollLeft = scrollLeft - walk;
    });
   




}

