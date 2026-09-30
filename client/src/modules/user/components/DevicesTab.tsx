import type React from "react";
import { useState } from "react";
import {
  Smartphone,
  Laptop,
  Tablet,
  ShieldCheck,
  CheckCircle2,
  Trash2,
} from "lucide-react";
import type { RememberedDevice, CurrentDevice } from "../types";

interface DevicesTabProps {
  isDarkMode: boolean;
}

export const DevicesTab: React.FC<DevicesTabProps> = ({ isDarkMode }) => {
  const currentDevice: CurrentDevice = {
    name: "desktop",
    lastActive: "26/9/2026",
  };

  const [rememberedDevices, setRememberedDevices] = useState<
    RememberedDevice[]
  >([
    {
      id: "dev-windows",
      name: "Windows PC · Chrome",
      registeredAt: "Ghi nhận từ 25/9/2026",
      type: "desktop",
    },
  ]);

  const [remainingDeviceChanges, setRemainingDeviceChanges] = useState(2);
  const [deviceToDelete, setDeviceToDelete] = useState<string | null>(null);
  const [deviceNotice, setDeviceNotice] = useState("");

  const desktopCount = rememberedDevices.filter(
    (d) => d.type === "desktop",
  ).length;
  const mobileCount = rememberedDevices.filter(
    (d) => d.type === "mobile",
  ).length;
  const tabletCount = rememberedDevices.filter(
    (d) => d.type === "tablet",
  ).length;

  const handleRequestDeleteDevice = (id: string) => {
    setDeviceToDelete(id);
  };

  const handleConfirmDeleteDevice = () => {
    if (!deviceToDelete) return;
    if (remainingDeviceChanges <= 0) {
      setDeviceNotice("Bạn đã dùng hết số lượt đổi thiết bị cho phép (0/2).");
      setDeviceToDelete(null);
      setTimeout(() => setDeviceNotice(""), 3500);
      return;
    }
    setRememberedDevices((prev) => prev.filter((d) => d.id !== deviceToDelete));
    setRemainingDeviceChanges((prev) => Math.max(0, prev - 1));
    setDeviceNotice(
      `Đã xoá thiết bị thành công! Bạn còn ${remainingDeviceChanges - 1}/2 lượt đổi thiết bị.`,
    );
    setDeviceToDelete(null);
    setTimeout(() => setDeviceNotice(""), 3500);
  };

  return (
    <>
      <div
        className={`p-6 sm:p-8 rounded-3xl border transition-all ${
          isDarkMode
            ? "bg-[#0b1329]/90 border-slate-800 text-slate-100 shadow-xl"
            : "bg-white border-slate-200 text-slate-900 shadow-sm"
        }`}
      >
        {/* PHẦN 1: THIẾT BỊ ĐĂNG NHẬP */}
        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white mb-1">
            Thiết bị đăng nhập
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Quản lý các thiết bị đã đăng nhập
          </p>
        </div>

        {/* THẺ THIẾT BỊ HIỆN TẠI (desktop) */}
        <div
          className={`p-4 rounded-2xl border transition-all mb-8 flex items-center gap-4 ${
            isDarkMode
              ? "bg-[#0e1628]/80 border-slate-800"
              : "bg-slate-50 border-slate-200"
          }`}
        >
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${
              isDarkMode
                ? "bg-slate-800/60 border-slate-700/60 text-slate-300"
                : "bg-white border-slate-300 text-slate-700"
            }`}
          >
            <Smartphone size={22} className="stroke-[1.75]" />
          </div>
          <div>
            <div className="font-bold text-sm sm:text-base text-white">
              {currentDevice.name}
            </div>
            <div className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Lần cuối: {currentDevice.lastActive}
            </div>
          </div>
        </div>

        {/* PHẦN 2: THIẾT BỊ ĐÃ GHI NHỚ */}
        <div className="mb-4">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white">
              Thiết bị đã ghi nhớ
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800/90 text-cyan-400 border border-slate-700/70">
              {rememberedDevices.length}/3
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Tối đa 3 thiết bị trọn đời (mỗi loại tối đa 2). Nhiều trình duyệt
            hoặc tab trên cùng một máy chỉ tính là 1 thiết bị.
          </p>
        </div>

        {/* 3 KHỐI HẠN MỨC: Máy tính (1/2), Điện thoại (0/2), Máy tính bảng (0/2) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-4">
          {/* 1. Máy tính */}
          <div
            className={`p-4 rounded-2xl border text-center flex flex-col items-center justify-center transition-all ${
              isDarkMode
                ? "bg-[#0e1628]/40 border-slate-800"
                : "bg-slate-50 border-slate-200"
            }`}
          >
            <Laptop size={22} className="text-slate-400 mb-2 stroke-[1.75]" />
            <div className="text-xs text-slate-400 font-medium">Máy tính</div>
            <div className="text-base sm:text-lg font-bold text-white mt-1">
              {desktopCount}/2
            </div>
          </div>

          {/* 2. Điện thoại */}
          <div
            className={`p-4 rounded-2xl border text-center flex flex-col items-center justify-center transition-all ${
              isDarkMode
                ? "bg-[#0e1628]/40 border-slate-800"
                : "bg-slate-50 border-slate-200"
            }`}
          >
            <Smartphone
              size={22}
              className="text-slate-400 mb-2 stroke-[1.75]"
            />
            <div className="text-xs text-slate-400 font-medium">Điện thoại</div>
            <div className="text-base sm:text-lg font-bold text-white mt-1">
              {mobileCount}/2
            </div>
          </div>

          {/* 3. Máy tính bảng */}
          <div
            className={`p-4 rounded-2xl border text-center flex flex-col items-center justify-center transition-all ${
              isDarkMode
                ? "bg-[#0e1628]/40 border-slate-800"
                : "bg-slate-50 border-slate-200"
            }`}
          >
            <Tablet size={22} className="text-slate-400 mb-2 stroke-[1.75]" />
            <div className="text-xs text-slate-400 font-medium">
              Máy tính bảng
            </div>
            <div className="text-base sm:text-lg font-bold text-white mt-1">
              {tabletCount}/2
            </div>
          </div>
        </div>

        {/* BANNER THÔNG BÁO CHÍNH SÁCH BẢO MẬT & ĐỔI THIẾT BỊ */}
        <div
          className={`p-3.5 sm:p-4 rounded-xl border flex items-center gap-3 mb-4 ${
            isDarkMode
              ? "bg-[#0e1628]/60 border-slate-800 text-slate-300"
              : "bg-slate-50 border-slate-200 text-slate-700"
          }`}
        >
          <ShieldCheck size={20} className="text-slate-400 shrink-0" />
          <p className="text-xs sm:text-sm leading-relaxed">
            Để tránh tình trạng chia sẻ tài khoản, bạn chỉ được phép xoá thiết
            bị cũ và thay thiết bị mới{" "}
            <strong className="text-white font-bold">tối đa 2 lần</strong>. Bạn
            còn{" "}
            <strong className="text-white font-bold">
              {remainingDeviceChanges}/2
            </strong>{" "}
            lượt đổi thiết bị.
          </p>
        </div>

        {/* THÔNG BÁO TRẠNG THÁI (NẾU CÓ) */}
        {deviceNotice && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold animate-slide-up flex items-center gap-2">
            <CheckCircle2 size={16} className="shrink-0" />
            <span>{deviceNotice}</span>
          </div>
        )}

        {/* DANH SÁCH THIẾT BỊ ĐÃ GHI NHỚ */}
        <div className="space-y-3">
          {rememberedDevices.map((device) => (
            <div
              key={device.id}
              className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                isDarkMode
                  ? "bg-[#0e1628]/80 border-slate-800"
                  : "bg-white border-slate-200"
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${
                    isDarkMode
                      ? "bg-slate-800/60 border-slate-700/60 text-slate-300"
                      : "bg-slate-100 border-slate-200 text-slate-700"
                  }`}
                >
                  {device.type === "desktop" ? (
                    <Laptop size={22} className="stroke-[1.75]" />
                  ) : device.type === "tablet" ? (
                    <Tablet size={22} className="stroke-[1.75]" />
                  ) : (
                    <Smartphone size={22} className="stroke-[1.75]" />
                  )}
                </div>
                <div>
                  <div className="font-bold text-sm sm:text-base text-white">
                    {device.name}
                  </div>
                  <div className="text-xs sm:text-sm text-slate-400 mt-0.5">
                    {device.registeredAt}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleRequestDeleteDevice(device.id)}
                className="inline-flex items-center gap-1.5 text-rose-500 hover:text-rose-400 text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
              >
                <Trash2 size={16} />
                <span>Xoá thiết bị</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Modal xác nhận xoá thiết bị */}
      {deviceToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-fade-in">
          <div
            className={`w-full max-w-md p-6 rounded-3xl border shadow-2xl transition-all ${
              isDarkMode
                ? "bg-[#0b1329] border-slate-800 text-white"
                : "bg-white border-slate-200 text-slate-900"
            }`}
          >
            <div className="w-12 h-12 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-4">
              <Trash2 size={24} />
            </div>

            <h3 className="text-lg font-bold mb-2">Xác nhận xoá thiết bị</h3>
            <p className="text-xs sm:text-sm text-slate-400 mb-6 leading-relaxed">
              Bạn có chắc chắn muốn xoá thiết bị này khỏi danh sách đã ghi nhớ?
              Thao tác này sẽ trừ{" "}
              <strong className="text-rose-400 font-bold">
                1 lượt đổi thiết bị
              </strong>{" "}
              (bạn sẽ còn{" "}
              <strong className="text-white">
                {Math.max(0, remainingDeviceChanges - 1)}/2
              </strong>{" "}
              lượt).
            </p>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeviceToDelete(null)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold border transition-all cursor-pointer ${
                  isDarkMode
                    ? "border-slate-700 text-slate-300 hover:bg-slate-800"
                    : "border-slate-300 text-slate-700 hover:bg-slate-100"
                }`}
              >
                Huỷ bỏ
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteDevice}
                className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/30 transition-all cursor-pointer"
              >
                Xác nhận xoá
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
