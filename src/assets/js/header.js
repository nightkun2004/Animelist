const menuToggle = document.getElementById('menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');

menuToggle.addEventListener('click', () => {
  mobileMenu.classList.toggle('hidden');
});

document.addEventListener('DOMContentLoaded', () => {
  // ฟังก์ชันตรวจสอบสถานะการเชื่อมต่อ
  function checkConnection() {
    if (navigator.onLine) {
      console.log('ออนไลน์');
      // showNotification('คุณออนไลน์อยู่ตอนนี้', 'online');
    } else {
      console.log('ออฟไลน์');
      showNotification('คุณออฟไลน์ กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ตของคุณ', 'offline');
    }
  }

  // ฟังก์ชันแสดงการแจ้งเตือนและเปลี่ยนสีข้อความตามสถานะ
  function showNotification(message, status) {
    const notificationElement = document.getElementById('notification');
    notificationElement.textContent = message;

    if (status === 'offline') {
      notificationElement.classList.remove('bg-green-500', 'text-white');
      notificationElement.classList.add('bg-red-500', 'text-white');
    }

    // if (status === 'online') {
    //   notificationElement.classList.remove('bg-red-500', 'text-white');
    //   notificationElement.classList.add('bg-green-500', 'text-white');
    // }  

    notificationElement.classList.remove('hidden');

    // ซ่อนการแจ้งเตือนหลังจาก 5 วินาที
    setTimeout(function () {
      notificationElement.classList.add('hidden');
    }, 5000);
  }

  // ฟังเหตุการณ์การเชื่อมต่อออนไลน์/ออฟไลน์
  window.addEventListener('online', () => {
    checkConnection();
  });

  window.addEventListener('offline', () => {
    checkConnection();
  });

  // ตรวจสอบสถานะการเชื่อมต่อเมื่อโหลดหน้าเว็บ
  checkConnection();
});


// ฟังก์ชันสำหรับดึงค่าคุกกี้ตามชื่อ
function getCookie(name) {
  const nameEQ = `${name}=`;
  const cookies = document.cookie.split(';');
  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i];
    while (cookie.charAt(0) === ' ') cookie = cookie.substring(1);
    if (cookie.indexOf(nameEQ) === 0) return cookie.substring(nameEQ.length, cookie.length);
  }
  return null;
}

// ฟังก์ชันสำหรับตั้งคุกกี้
function setCookie(name, value, days) {
  const expires = new Date();
  expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000)); // วันหมดอายุ
  const expiresString = `expires=${expires.toUTCString()}`;
  document.cookie = `${name}=${value}; ${expiresString}; path=/; Secure; HttpOnly`;
}

// ฟังก์ชันสำหรับลบคุกกี้
function deleteCookie(name) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; Secure; HttpOnly`;
}


document.addEventListener('DOMContentLoaded', () => {
  const loginButtons = document.querySelectorAll('.loginButton');
  const loginPopup = document.getElementById('loginPopup');
  const closePopup = document.getElementById('closePopup');

  // ฟังก์ชันตรวจสอบการเข้าสู่ระบบ
  function isLoggedIn() {
    return !!getCookie('token');
  }

  // แสดงหรือซ่อนปุ่มเข้าสู่ระบบ
  if (isLoggedIn()) {
    loginButtons.forEach(button => button.classList.add('hidden'));
  } else {
    loginButtons.forEach(button => button.classList.remove('hidden'));
  }

  // เปิด popup เมื่อคลิกปุ่มเข้าสู่ระบบ
  loginButtons.forEach(button => {
    button.addEventListener('click', () => {
      loginPopup.classList.remove('hidden');
    });
  });

  // ปิด popup เมื่อคลิกปุ่มปิด
  closePopup.addEventListener('click', () => {
    loginPopup.classList.add('hidden');
  });

  // จัดการการส่งฟอร์มเข้าสู่ระบบ
  document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
      const response = await axios.post('https://ani-night.online/api/v2/login/auth', { email, password });
      const token = response.data.token;
      console.log(response.data)
      console.log("User", response.data.user)

      // เก็บ token ในคุกกี้พร้อมวันหมดอายุ 7 วัน
      setCookie('token', token, 7);

      alert('เข้าสู่ระบบสำเร็จ!');
      loginPopup.classList.add('hidden');
      loginButtons.forEach(button => button.classList.add('hidden'));
    } catch (error) {
      alert('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
    }
  });
});
