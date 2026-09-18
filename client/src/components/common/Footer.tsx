import { GraduationCap, Globe, Play, FileText } from 'lucide-react';
import type { FooterGroup } from '../../types/homeTypes';

const footerGroups: FooterGroup[] = [
  {
    title: 'Luyện thi 4 Kỹ năng',
    links: [
      { label: 'Listening Lab (Part 1-4)', href: '/listening' },
      { label: 'Reading Analyzer (Part 5-7)', href: '/reading' },
      { label: 'Writing AI Grader', href: '/writing' },
      { label: 'Đề thi thử ETS 2026', href: '/exam' },
      { label: 'Báo cáo năng lực cá nhân', href: '/result' },
    ],
  },
  {
    title: 'Tài nguyên học tập',
    links: [
      { label: 'Kho 3,000+ từ vựng TOEIC', href: '/vocabulary' },
      { label: 'Tổng hợp ngữ pháp trọng tâm', href: '#courses' },
      { label: 'Bộ mẹo tránh bẫy đề thi', href: '#features' },
      { label: 'Kinh nghiệm bứt phá 850+', href: '#testimonials' },
      { label: 'Lịch thi TOEIC mới nhất', href: '#' },
    ],
  },
  {
    title: 'Hỗ trợ & Chính sách',
    links: [
      { label: 'Hướng dẫn sử dụng hệ thống', href: '#' },
      { label: 'Câu hỏi thường gặp (FAQ)', href: '#' },
      { label: 'Chính sách bảo mật', href: '#' },
      { label: 'Điều khoản sử dụng', href: '#' },
      { label: 'Liên hệ đội ngũ hỗ trợ', href: '#' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="pt-20 pb-12 border-t border-indigo-500/15 bg-[#060a17]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-16">
          {/* Cột thương hiệu & Giới thiệu (chiếm 2 cột) */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <a href="/" className="flex items-center gap-3 no-underline">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
                <GraduationCap size={22} className="text-white" />
              </div>
              <span className="text-xl font-black tracking-tight text-white">
                TOEIC<span className="text-indigo-400">Master</span>
              </span>
            </a>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Nền tảng luyện thi TOEIC ứng dụng trí tuệ nhân tạo hàng đầu. Giúp
              người học tối ưu hóa thời gian, nắm chắc ngữ pháp, từ vựng và tự
              tin đạt mục tiêu chứng chỉ quốc tế.
            </p>
            <div className="flex items-center gap-3 pt-2">
              {[Globe, Play, FileText].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-lg bg-slate-900 border border-indigo-500/15 flex items-center justify-center text-slate-400 hover:text-white hover:border-indigo-500/40 hover:bg-indigo-500/10 transition-all"
                  aria-label="Social Link"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Các nhóm liên kết điều hướng */}
          {footerGroups.map((group) => (
            <div key={group.title} className="flex flex-col gap-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                {group.title}
              </h3>
              <ul className="flex flex-col gap-2.5">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-slate-400 hover:text-indigo-300 transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Dòng bản quyền & Chính sách dưới cùng */}
        <div className="border-t border-slate-800/80 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 TOEIC Master System. Bản quyền thuộc về TOEIC Master.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-slate-400 transition-colors">
              Chính sách bảo mật
            </a>
            <a href="#" className="hover:text-slate-400 transition-colors">
              Điều khoản dịch vụ
            </a>
            <a href="#" className="hover:text-slate-400 transition-colors">
              Liên hệ
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
export default Footer;
