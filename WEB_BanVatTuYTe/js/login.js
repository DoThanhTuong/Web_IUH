
document.addEventListener('DOMContentLoaded', function () {

  // Lấy tham chiếu đến các phần tử form và input
  const loginForm = document.getElementById('loginForm'); // Chọn form theo ID
  const emailInput = document.getElementById('email'); // Input Tên đăng nhập/Email
  const passwordInput = document.getElementById('password'); // Input Mật khẩu
  const showPasswordCheckbox = document.getElementById('showPassword'); // Checkbox hiện mật khẩu
  let messageDiv = document.getElementById('login-message'); // Div hiển thị thông báo

  // --- Kiểm tra sự tồn tại của các hàm helper từ auth.js ---
  // Đảm bảo auth.js đã được nhúng và chạy trước script này
  if (typeof getRegisteredUsers !== 'function' || typeof setLoggedInUser !== 'function' || typeof getLoggedInUser !== 'function') {
    console.error("Lỗi: Các hàm helper quản lý người dùng (getRegisteredUsers, setLoggedInUser, getLoggedInUser) không tìm thấy. Hãy đảm bảo file auth.js được nhúng đúng cách và trước script này.");
    // Tạo message div nếu chưa có trong HTML để hiển thị lỗi hệ thống
    if (!messageDiv) {
      messageDiv = document.createElement('div');
      messageDiv.id = 'login-message';
      messageDiv.style.display = 'none';
      // Chèn div thông báo vào vị trí phù hợp (ví dụ: sau form)
      const formElement = document.getElementById('loginForm');
      if (formElement) {
        formElement.parentNode.insertBefore(messageDiv, formElement.nextSibling);
      } else {
        // Fallback nếu không tìm thấy form
        document.body.appendChild(messageDiv);
      }
    }
    showMessage('Lỗi hệ thống: Không thể thực hiện đăng nhập. Vui lòng thử lại sau.', 'alert-danger');
    if (loginForm) loginForm.style.display = 'none'; // Ẩn form nếu lỗi nghiêm trọng
    return; // Dừng script nếu thiếu thành phần cốt lõi
  }

  // --- Hàm helper hiển thị thông báo (định nghĩa lại để dùng messageDiv của trang này) ---
  function showMessage(message, className) {
    if (messageDiv) { // Kiểm tra lại biến messageDiv
      messageDiv.textContent = message;
      // Xóa các class alert cũ và thêm class mới (dùng cho Bootstrap alert styling)
      // Ví dụ: 'alert alert-success', 'alert alert-danger', 'alert alert-warning'
      messageDiv.className = 'alert ' + className;
      messageDiv.style.display = 'block';
    }
  }

  // --- Optional: Kiểm tra xem đã đăng nhập chưa khi vào trang login ---
  // Nếu đã đăng nhập, chuyển hướng đi nơi khác (để tránh vào lại trang login không cần thiết)
  const loggedInUser = getLoggedInUser(); // Sử dụng hàm helper từ auth.js để lấy thông tin user đang đăng nhập
  if (loggedInUser) {
    // Nếu có user đang đăng nhập, hiển thị thông báo và chuyển hướng
    showMessage(`Bạn đã đăng nhập với tên: ${loggedInUser.username}. Đang chuyển hướng về trang chủ...`, 'alert-info');
    // Ẩn form đăng nhập để người dùng không tương tác được
    if (loginForm) loginForm.style.display = 'none';
    // Chuyển hướng sau 2 giây về trang chủ (hoặc trang bạn muốn)
    setTimeout(() => {
      window.location.href = '../home/index.html'; // Chuyển hướng về trang chủ

    }, 2000);
    return; // Dừng xử lý tiếp của script login nếu đã đăng nhập
  }


  // --- Lắng nghe sự kiện submit form đăng nhập ---
  if (loginForm) { // Chỉ thêm listener nếu form tồn tại
    loginForm.addEventListener('submit', function (event) {
      event.preventDefault(); // Ngăn chặn form submit truyền thống (tải lại trang)

      const email = emailInput ? emailInput.value.trim() : ''; // Lấy giá trị email (sử dụng làm tên đăng nhập)
      const password = passwordInput ? passwordInput.value : ''; // Lấy giá trị mật khẩu (không trim)

      // --- Kiểm tra thông tin nhập vào ---
      // Kiểm tra các trường bắt buộc không được rỗng
      if (!email || !password) {
        showMessage('Vui lòng điền đầy đủ Tên đăng nhập (Email) và Mật khẩu.', 'alert-warning');
        // Optional: Add Bootstrap validation classes để highlight input
        if (emailInput) emailInput.classList.toggle('is-invalid', !email);
        if (passwordInput) passwordInput.classList.toggle('is-invalid', !password);
        return; // Dừng xử lý nếu thiếu thông tin
      } else {
        // Xóa class 'is-invalid' nếu các trường đã có dữ liệu
        if (emailInput) emailInput.classList.remove('is-invalid');
        if (passwordInput) passwordInput.classList.remove('is-invalid');
      }


      // --- Lấy danh sách người dùng đã đăng ký từ localStorage ---
      const registeredUsers = getRegisteredUsers(); // Sử dụng hàm helper từ auth.js

      // --- Tìm tài khoản khớp với thông tin người dùng nhập ---
      // Tìm trong mảng registeredUsers xem có đối tượng user nào mà
      // thuộc tính 'username' (được lưu bằng email đăng ký) khớp với email nhập
      // VÀ thuộc tính 'password' khớp với mật khẩu nhập.
      const foundUser = registeredUsers.find(user =>
        user.username === email && user.password === password
      );

      if (foundUser) {
        // --- Tìm thấy tài khoản khớp - Đăng nhập thành công ---
        // Lưu trạng thái đăng nhập vào localStorage (sử dụng hàm helper từ auth.js)
        // Chỉ nên lưu thông tin KHÔNG NHẠY CẢM của user đã đăng nhập (ví dụ: username). KHÔNG lưu mật khẩu.
        setLoggedInUser({ username: foundUser.username /*, có thể thêm id, fullname, ... nếu bạn lưu */ });

        showMessage('Đăng nhập thành công! Đang chuyển hướng...', 'alert-success');

        // Optional: Xóa trắng form đăng nhập
        if (loginForm) loginForm.reset();

        // --- Chuyển hướng người dùng ---
        // Chuyển hướng về trang chủ hoặc trang mong muốn sau khi đăng nhập
        setTimeout(() => {
          window.location.href = '../home/index.html'; // Chuyển hướng về trang chủ sau 1.5 giây
        }, 1500);

      } else {
        // --- Không tìm thấy tài khoản khớp - Đăng nhập thất bại ---
        showMessage('Tên đăng nhập hoặc mật khẩu không đúng. Vui lòng kiểm tra lại.', 'alert-danger');
        // Optional: Xóa mật khẩu đã nhập hoặc đánh dấu input bị lỗi
        if (passwordInput) passwordInput.value = ''; // Xóa mật khẩu
        if (emailInput) emailInput.classList.add('is-invalid'); // Đánh dấu trường email
        if (passwordInput) passwordInput.classList.add('is-invalid'); // Đánh dấu trường mật khẩu
      }
    });
  } else {
    console.error("Phần tử form đăng nhập (#loginForm) không tìm thấy trên trang.");
    // Hiển thị thông báo lỗi nếu form không tồn tại
    showMessage('Lỗi hệ thống: Form đăng nhập không tìm thấy.', 'alert-danger');
  }

  // --- Chức năng hiện/ẩn mật khẩu ---
  // Áp dụng cho input mật khẩu
  if (showPasswordCheckbox && passwordInput) {
    showPasswordCheckbox.addEventListener('change', function () {
      const type = this.checked ? 'text' : 'password';
      passwordInput.setAttribute('type', type);
    });
  } else {
    // Log cảnh báo nếu không tìm thấy các phần tử cần thiết
    // console.warn("Không tìm thấy checkbox hiện mật khẩu hoặc input mật khẩu.");
  }

});
