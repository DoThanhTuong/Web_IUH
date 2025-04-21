// auth.js

document.addEventListener('DOMContentLoaded', function() {

    // Lấy tham chiếu đến các phần tử link Đăng nhập, Đăng ký, Đăng xuất trên header
    // Đảm bảo các thẻ <li> chứa các link này có ID tương ứng
    const loginLinkElement = document.getElementById('login-link');
    const registerLinkElement = document.getElementById('register-link');
    const logoutLinkElement = document.getElementById('logout-link');
    // Optional: Placeholder cho tên đăng nhập nếu bạn thêm vào HTML header
    // const welcomeMessageElement = document.getElementById('welcome-message');


    // --- Hàm cập nhật hiển thị Header dựa trên trạng thái đăng nhập ---
    function updateAuthHeader() {
        const loggedInUser = localStorage.getItem('loggedInUser');
    
        if (loggedInUser) {
            // Người dùng đã đăng nhập: Ẩn Đăng nhập/Đăng ký, Hiện Đăng xuất
            if (loginLinkElement) loginLinkElement.style.display = 'none';
            if (registerLinkElement) registerLinkElement.style.display = 'none';
            if (logoutLinkElement) logoutLinkElement.style.display = 'list-item'; // Hoặc 'block'
            // KHÔNG có dòng nào ẩn giỏ hàng ở đây
        } else {
            // Người dùng chưa đăng nhập: Hiện Đăng nhập/Đăng ký, Ẩn Đăng xuất
            if (loginLinkElement) loginLinkElement.style.display = 'list-item'; // Hoặc 'block'
            if (registerLinkElement) registerLinkElement.style.display = 'list-item'; // Hoặc 'block'
            if (logoutLinkElement) logoutLinkElement.style.display = 'none';
             // KHÔNG có dòng nào ẩn giỏ hàng ở đây
        }
    }
    // --- Lắng nghe sự kiện click vào link "Đăng xuất" ---
    if (logoutLinkElement) { // Chỉ thêm listener nếu link Đăng xuất tồn tại
        logoutLinkElement.addEventListener('click', function(event) {
            event.preventDefault(); // Ngăn chặn hành động mặc định của link (không chuyển hướng)

            // Xóa trạng thái đăng nhập khỏi localStorage
            localStorage.removeItem('loggedInUser'); // Xóa key lưu trạng thái đăng nhập

            // Cập nhật lại hiển thị header (sẽ hiện Đăng nhập/Đăng ký, ẩn Đăng xuất)
            updateAuthHeader();

            // Optional: Chuyển hướng người dùng về trang chủ hoặc trang đăng nhập sau khi đăng xuất
            // Điều này giúp đảm bảo trạng thái UI đồng bộ trên toàn bộ trang
             window.location.href = 'index.html'; // Chuyển hướng về trang chủ
        });
    }

    // --- Cập nhật hiển thị Header khi trang vừa tải xong ---
    // Gọi hàm này ngay khi DOM được parse hoàn toàn để setup UI ban đầu
    updateAuthHeader();

});

// --- Các hàm Helper được định nghĩa TOÀN CỤC (trên đối tượng window)
// để các script khác (login.js, register.js) có thể gọi được ---
// LƯU Ý QUAN TRỌNG VỀ BẢO MẬT: Việc lưu trữ thông tin người dùng, đặc biệt là mật khẩu,
// trực tiếp trong localStorage và xử lý logic nhạy cảm client-side là RẤT KHÔNG AN TOÀN.
// Đây chỉ là giải pháp đơn giản cho mục đích học tập/demo.
// Ứng dụng thực tế phải xử lý việc này trên máy chủ.

// Hàm lấy danh sách người dùng đã đăng ký từ localStorage
// Dữ liệu được lưu dưới key 'registeredUsers' dưới dạng JSON string của một mảng [{username: '...', password: '...'}, ...]
window.getRegisteredUsers = function() {
    const users = localStorage.getItem('registeredUsers');
    try {
        // Phân tích chuỗi JSON thành mảng. Trả về mảng rỗng nếu không có dữ liệu hoặc lỗi.
        return users ? JSON.parse(users) : [];
    } catch (e) {
        console.error("Lỗi khi đọc dữ liệu người dùng đăng ký từ localStorage:", e);
        // Tùy chọn: Xóa dữ liệu lỗi nếu bị corrupted
        // localStorage.removeItem('registeredUsers');
        return []; // Trả về mảng rỗng để tránh lỗi khi xử lý tiếp
    }
};

// Hàm lưu danh sách người dùng đã đăng ký vào localStorage
// Nhận vào một mảng các đối tượng người dùng
window.saveRegisteredUsers = function(usersArray) {
    try {
        // Chuyển mảng đối tượng thành chuỗi JSON và lưu vào localStorage
        localStorage.setItem('registeredUsers', JSON.stringify(usersArray));
    } catch (e) {
        console.error("Lỗi khi lưu dữ liệu người dùng đăng ký vào localStorage:", e);
        alert("Lỗi: Không thể lưu dữ liệu người dùng đăng ký. Vui lòng kiểm tra cài đặt trình duyệt.");
    }
};

// Hàm lưu thông tin người dùng vừa đăng nhập thành công vào localStorage
// Nhận vào một đối tượng user (ví dụ: { username: '...' })
// Dữ liệu được lưu dưới key 'loggedInUser'
window.setLoggedInUser = function(userData) {
     // Lưu thông tin user đăng nhập (dưới dạng JSON string)
     // Chỉ nên lưu thông tin KHÔNG NHẠY CẢM ở đây (như username), KHÔNG lưu mật khẩu.
     try {
        localStorage.setItem('loggedInUser', JSON.stringify(userData));
         // Sau khi set trạng thái login, thường trang sẽ redirect hoặc reload,
         // khi đó DOMContentLoaded của auth.js sẽ chạy và update header.
         // Nếu không redirect/reload, bạn cần gọi updateAuthHeader() trực tiếp sau khi set.
     } catch (e) {
         console.error("Lỗi khi lưu trạng thái đăng nhập vào localStorage:", e);
         alert("Lỗi: Không thể lưu trạng thái đăng nhập. Vui lòng thử lại.");
     }
};

// Hàm lấy thông tin người dùng đang đăng nhập từ localStorage
// Trả về đối tượng user hoặc null nếu chưa đăng nhập/lỗi
window.getLoggedInUser = function() {
     const user = localStorage.getItem('loggedInUser');
     try {
        // Phân tích chuỗi JSON thành đối tượng user. Trả về null nếu không có dữ liệu hoặc lỗi.
        return user ? JSON.parse(user) : null;
     } catch (e) {
         console.error("Lỗi khi đọc trạng thái đăng nhập từ localStorage:", e);
         localStorage.removeItem('loggedInUser'); // Xóa dữ liệu lỗi
         return null; // Trả về null
     }
};
