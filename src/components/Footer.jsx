import { Link } from "react-router-dom";

const iconClassName = "h-4 w-4 text-yellow-400";

const MapPinIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={iconClassName}>
    <path d="M12 21s-6-4.35-6-10a6 6 0 1 1 12 0c0 5.65-6 10-6 10Z" />
    <circle cx="12" cy="11" r="2.5" />
  </svg>
);

const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={iconClassName}>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.86 19.86 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.86 19.86 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.78.63 2.62a2 2 0 0 1-.45 2.11L8 9.91a16 16 0 0 0 6 6l1.46-1.29a2 2 0 0 1 2.11-.45c.84.3 1.72.51 2.62.63A2 2 0 0 1 22 16.92z" />
  </svg>
);

const MailIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={iconClassName}>
    <path d="M4 4h16v16H4z" />
    <path d="m4 7 8 6 8-6" />
  </svg>
);

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
    <path d="M13.5 22v-8h2.7l.4-3h-3.1V9.1c0-.9.3-1.6 1.7-1.6H17V4.8c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3V11H7.5v3h2.8v8h3.2Z" />
  </svg>
);

const YoutubeIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
    <path d="M21.6 7.2a2.9 2.9 0 0 0-2-2C17.8 4.7 12 4.7 12 4.7s-5.8 0-7.6.5a2.9 2.9 0 0 0-2 2A30.2 30.2 0 0 0 2 12a30.2 30.2 0 0 0 .4 4.8 2.9 2.9 0 0 0 2 2c1.8.5 7.6.5 7.6.5s5.8 0 7.6-.5a2.9 2.9 0 0 0 2-2A30.2 30.2 0 0 0 22 12a30.2 30.2 0 0 0-.4-4.8ZM10 15.5v-7l6 3.5-6 3.5Z" />
  </svg>
);

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
);

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
    <path d="M14.5 3c.4 1.8 1.5 3.1 3.5 3.3v2.6a6.7 6.7 0 0 1-3.4-1v5.4A5 5 0 1 1 9.7 8.4v2.7a2.4 2.4 0 1 0 1.9 2.3V3h2.9Z" />
  </svg>
);

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 border-t border-gray-800">
      {/* Phần nội dung chính */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Cột 1: Logo + giới thiệu */}
       <div>
          <h2 className="text-2xl font-extrabold uppercase tracking-tight text-white mb-4">
            CINE<span className="text-red-500">FLEX</span>
          </h2>
          <p className="text-sm leading-relaxed text-gray-400">
            Hệ thống đặt vé xem phim trực tuyến hàng đầu Việt Nam. Khám phá hàng
            trăm bộ phim hấp dẫn và đặt vé chỉ trong vài giây.
          </p>
        </div>

        {/* Cột 2: Liên kết nhanh */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">
            Liên kết nhanh
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/" className="hover:text-yellow-400 transition">
                Trang chủ
              </Link>
            </li>
            <li>
              <Link to="/movie" className="hover:text-yellow-400 transition">
                Phim
              </Link>
            </li>
            <li>
              <Link to="/cinema" className="hover:text-yellow-400 transition">
                Cụm rạp
              </Link>
            </li>
            <li>
              <Link to="/profile" className="hover:text-yellow-400 transition">
                Tài khoản
              </Link>
            </li>
          </ul>
        </div>

        {/* Cột 3: Liên hệ */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Liên hệ</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2">
              <MapPinIcon />
              123 Nguyễn Văn Cừ, Q.5, TP.HCM
            </li>
            <li className="flex items-center gap-2">
              <PhoneIcon />
              0123 456 789
            </li>
            <li className="flex items-center gap-2">
              <MailIcon />
              support@movieapp.vn
            </li>
          </ul>
        </div>

        {/* Cột 4: Mạng xã hội */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">
            Kết nối với chúng tôi
          </h3>
          <div className="flex gap-3">
            <a
              href="#"
              className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 hover:bg-yellow-400 hover:text-black transition"
            >
              <FacebookIcon />
            </a>
            <a
              href="#"
              className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 hover:bg-yellow-400 hover:text-black transition"
            >
              <YoutubeIcon />
            </a>
            <a
              href="#"
              className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 hover:bg-yellow-400 hover:text-black transition"
            >
              <InstagramIcon />
            </a>
            <a
              href="#"
              className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 hover:bg-yellow-400 hover:text-black transition"
            >
              <TikTokIcon />
            </a>
          </div>

          <p className="text-sm text-gray-400 mt-5">
            Đăng ký nhận tin mới nhất về phim hot!
          </p>
          <div className="flex mt-2">
            <input
              type="email"
              placeholder="Email của bạn"
              className="px-3 py-2 rounded-l-md bg-gray-800 text-sm text-white focus:outline-none w-full"
            />
            <button className="bg-red-600 hover:bg-red-700 text-white px-4 rounded-r-md text-sm transition">
              Gửi
            </button>
          </div>
        </div>
      </div>

      {/* Dòng bản quyền */}
      <div className="border-t border-gray-800 py-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()}{" "}
        <span className="font-semibold text-white">CINE</span><span className="font-semibold text-red-500">FLEX</span>. Bảo
        lưu mọi quyền.
      </div>
    </footer>
  );
};

export default Footer;

