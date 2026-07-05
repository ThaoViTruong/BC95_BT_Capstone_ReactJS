import React from "react";
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaYoutube,
  FaInstagram,
  FaTiktok,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";

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
              <FaMapMarkerAlt className="text-yellow-400" />
              123 Nguyễn Văn Cừ, Q.5, TP.HCM
            </li>
            <li className="flex items-center gap-2">
              <FaPhoneAlt className="text-yellow-400" />
              0123 456 789
            </li>
            <li className="flex items-center gap-2">
              <FaEnvelope className="text-yellow-400" />
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
              <FaFacebookF />
            </a>
            <a
              href="#"
              className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 hover:bg-yellow-400 hover:text-black transition"
            >
              <FaYoutube />
            </a>
            <a
              href="#"
              className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 hover:bg-yellow-400 hover:text-black transition"
            >
              <FaInstagram />
            </a>
            <a
              href="#"
              className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 hover:bg-yellow-400 hover:text-black transition"
            >
              <FaTiktok />
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
        <span className="text-yellow-400 font-semibold">MovieApp</span>. All
        rights reserved. Made with ❤️ by CyberSoft Student.
      </div>
    </footer>
  );
};

export default Footer;
