
document.addEventListener('DOMContentLoaded', function () {

  // Lấy tham chiếu đến các phần tử form và input
  const registrationForm = document.getElementById('registrationForm'); // Lấy form theo ID
  const fullnameInput = document.getElementById('fullname');
  const emailInput = document.getElementById('email'); // Sẽ sử dụng email làm tên đăng nhập duy nhất
  const passwordInput = document.getElementById('password');
  const confirmPasswordInput = document.getElementById('confirm-password');
  const showPasswordCheckbox = document.getElementById('showPassword'); // Checkbox hiện mật khẩu
  const registrationMessageDiv = document.getElementById('registration-message'); // Div hiển thị thông báo

  // --- Kiểm tra sự tồn tại của các hàm helper từ auth.js ---
  // Đảm bảo auth.js đã được nhúng và chạy trước script này
  if (typeof getRegisteredUsers !== 'function' || typeof saveRegisteredUsers !== 'function') {
    console.error("Lỗi: Các hàm helper quản lý người dùng (getRegisteredUsers, saveRegisteredUsers) không tìm thấy. Hãy đảm bảo file auth.js được nhúng đúng cách và trước script này.");
    // Hiển thị thông báo lỗi nghiêm trọng trên giao diện
    showMessage('Lỗi hệ thống: Không thể thực hiện đăng ký. Vui lòng thử lại sau.', 'alert-danger');
    if (registrationForm) registrationForm.style.display = 'none'; // Ẩn form nếu hệ thống lỗi
    return; // Dừng script nếu thiếu thành phần cốt lõi
  }


  // --- Lắng nghe sự kiện submit form đăng ký ---
  if (registrationForm) { // Chỉ thêm listener nếu form tồn tại
    registrationForm.addEventListener('submit', function (event) {
      event.preventDefault(); // Ngăn chặn form submit truyền thống (tải lại trang)

      // Lấy giá trị từ các input, loại bỏ khoảng trắng ở đầu/cuối cho tên và email
      const fullname = fullnameInput ? fullnameInput.value.trim() : '';
      const email = emailInput ? emailInput.value.trim() : ''; // Email sẽ là tên đăng nhập
      const password = passwordInput ? passwordInput.value : ''; // Không trim mật khẩu
      const confirmPassword = confirmPasswordInput ? confirmPasswordInput.value : ''; // Không trim


      // --- Kiểm tra thông tin nhập vào ---
      // Kiểm tra tất cả các trường bắt buộc
      if (!fullname || !email || !password || !confirmPassword) {
        showMessage('Vui lòng điền đầy đủ tất cả các trường bắt buộc.', 'alert-warning');
        // Thêm class 'is-invalid' của Bootstrap để highlight các trường trống
        if (fullnameInput) fullnameInput.classList.toggle('is-invalid', !fullname);
        if (emailInput) emailInput.classList.toggle('is-invalid', !email);
        if (passwordInput) passwordInput.classList.toggle('is-invalid', !password);
        if (confirmPasswordInput) confirmPasswordInput.classList.toggle('is-invalid', !confirmPassword);
        return; // Dừng xử lý nếu thiếu thông tin
      } else {
        // Xóa class 'is-invalid' nếu tất cả các trường đều có dữ liệu
        if (fullnameInput) fullnameInput.classList.remove('is-invalid');
        if (emailInput) emailInput.classList.remove('is-invalid');
        if (passwordInput) passwordInput.classList.remove('is-invalid');
        if (confirmPasswordInput) confirmPasswordInput.classList.remove('is-invalid');
      }

      // --- Kiểm tra mật khẩu và nhập lại mật khẩu có khớp không ---
      if (password !== confirmPassword) {
        showMessage('Mật khẩu và Nhập lại mật khẩu không khớp nhau. Vui lòng kiểm tra lại.', 'alert-warning');
        // Đánh dấu cả hai trường mật khẩu là invalid
        if (passwordInput) passwordInput.classList.add('is-invalid');
        if (confirmPasswordInput) confirmPasswordInput.classList.add('is-invalid');
        // Tùy chọn: Xóa trắng hai trường mật khẩu để người dùng nhập lại
        if (passwordInput) passwordInput.value = '';
        if (confirmPasswordInput) confirmPasswordInput.value = '';
        return; // Dừng xử lý nếu không khớp
      } else {
        // Xóa class invalid nếu mật khẩu khớp
        if (passwordInput) passwordInput.classList.remove('is-invalid');
        if (confirmPasswordInput) confirmPasswordInput.classList.remove('is-invalid');
      }


      // --- Lấy danh sách người dùng đã đăng ký từ localStorage ---
      const registeredUsers = getRegisteredUsers(); // Sử dụng hàm helper từ auth.js để lấy mảng người dùng hiện tại

      // --- Kiểm tra Email (sử dụng làm tên đăng nhập duy nhất) đã tồn tại chưa ---
      // Dùng phương thức .some() để kiểm tra xem có bất kỳ người dùng nào trong mảng
      // mà username (được lưu bằng email) trùng với email người dùng vừa nhập không.
      const userExists = registeredUsers.some(user => user.username === email);

      if (userExists) {
        // Email/Tên đăng nhập đã tồn tại trong hệ thống
        showMessage(`Địa chỉ Email "${email}" đã được sử dụng cho tài khoản khác. Vui lòng sử dụng Email khác hoặc <a href="login.html">đăng nhập</a> nếu bạn đã có tài khoản.`, 'alert-danger');
        // Tùy chọn: Xóa mật khẩu và đánh dấu trường email
        if (passwordInput) passwordInput.value = '';
        if (confirmPasswordInput) confirmPasswordInput.value = '';
        if (emailInput) emailInput.classList.add('is-invalid'); // Highlight trường email
      } else {
        // Email/Tên đăng nhập chưa tồn tại, tiến hành thêm người dùng mới
        // LƯU Ý QUAN TRỌNG VỀ BẢO MẬT: Lưu mật khẩu dạng KHÔNG MÃ HÓA trong localStorage là RẤT KHÔNG AN TOÀN.
        // Trong ứng dụng thực tế, BẮT BUỘC phải mã hóa mật khẩu trước khi lưu và xử lý trên máy chủ.
        // Đây chỉ là cách làm đơn giản cho mục đích demo client-side.
        registeredUsers.push({
          username: email, // Lưu email làm tên đăng nhập để dùng khi đăng nhập
          password: password, // Lưu mật khẩu (không mã hóa trong ví dụ này)
          fullname: fullname // Lưu cả họ tên
          // Bạn có thể thêm các thông tin khác ở đây nếu form có
        });

        // --- Lưu danh sách người dùng đã cập nhật vào localStorage ---
        try {
          saveRegisteredUsers(registeredUsers); // Sử dụng hàm helper từ auth.js để lưu mảng mới

          // --- Hiển thị thông báo đăng ký thành công ---
          showMessage('Đăng ký tài khoản thành công! Bạn có thể <a href="login.html">đăng nhập ngay bây giờ</a>.', 'alert-success');

          // Optional: Xóa trắng form sau khi đăng ký thành công
          if (registrationForm) registrationForm.reset();
          // Xóa bất kỳ class validation nào còn sót lại
          if (fullnameInput) fullnameInput.classList.remove('is-invalid');
          if (emailInput) emailInput.classList.remove('is-invalid');
          if (passwordInput) passwordInput.classList.remove('is-invalid');
          if (confirmPasswordInput) confirmPasswordInput.classList.remove('is-invalid');


          // Optional: Tự động chuyển hướng sang trang đăng nhập sau vài giây
          // setTimeout(() => {
          //     window.location.href = 'login.html';
          // }, 3000); // Chuyển hướng sau 3 giây

        } catch (e) {
          console.error("Lỗi khi lưu thông tin đăng ký vào localStorage:", e);
          showMessage('Lỗi khi lưu thông tin đăng ký. Vui lòng thử lại.', 'alert-danger');
        }
      }
    });
  } else {
    console.error("Phần tử form đăng ký (#registrationForm) không tìm thấy trên trang.");
    showMessage('Lỗi hệ thống: Form đăng ký không tìm thấy.', 'alert-danger');
  }

  // --- Hàm helper hiển thị thông báo ---
  // Hàm này được định nghĩa bên trong DOMContentLoaded để sử dụng biến registrationMessageDiv
  function showMessage(message, className) {
    if (registrationMessageDiv) { // Kiểm tra lại biến message div
      registrationMessageDiv.innerHTML = message; // Dùng innerHTML để hiển thị link trong thông báo
      // Xóa các class alert cũ và thêm class mới (dùng cho Bootstrap alert styling)
      // Ví dụ: 'alert alert-success', 'alert alert-danger', 'alert alert-warning'
      registrationMessageDiv.className = 'alert ' + className;
      registrationMessageDiv.style.display = 'block';
    }
  }

  // --- Chức năng hiện/ẩn mật khẩu cho cả hai trường mật khẩu ---
  // Áp dụng cho cả input password và confirm password
  if (showPasswordCheckbox && passwordInput && confirmPasswordInput) {
    showPasswordCheckbox.addEventListener('change', function () {
      const type = this.checked ? 'text' : 'password';
      if (passwordInput) passwordInput.setAttribute('type', type);
      if (confirmPasswordInput) confirmPasswordInput.setAttribute('type', type); // Áp dụng cho cả nhập lại mật khẩu
    });
  } else {
    // Log cảnh báo nếu không tìm thấy các phần tử cần thiết cho chức năng này
    // console.warn("Không tìm thấy checkbox hiện mật khẩu hoặc input mật khẩu.");
  }

  // Optional: Kiểm tra xem đã đăng nhập chưa khi vào trang đăng ký
  // Nếu đã đăng nhập, chuyển hướng đi nơi khác (để tránh đăng ký lại)
  const loggedInUser = getLoggedInUser(); // Sử dụng hàm helper từ auth.js
  if (loggedInUser) {
    showMessage(`Bạn đã đăng nhập với tên: ${loggedInUser.username}. Không cần đăng ký tài khoản mới. Đang chuyển hướng về trang chủ...`, 'alert-info');
    // Ẩn form đăng ký
    if (registrationForm) registrationForm.style.display = 'none';
    // Chuyển hướng sau 3 giây
    setTimeout(() => {
      window.location.href = 'index.html'; // Chuyển hướng về trang chủ
    }, 3000);
    // Có thể ẩn thêm link Đăng nhập/Đăng ký trong header nếu auth.js chưa kịp chạy
    // Tuy nhiên, auth.js nên chạy ngay đầu trang để xử lý header
  }


});
