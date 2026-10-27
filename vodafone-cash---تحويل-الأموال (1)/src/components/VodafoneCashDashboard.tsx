import React, { useState, useEffect } from 'react';
import {
  ChevronRight,
  ChevronLeft,
  Gift,
  QrCode,
  Receipt,
  Star,
  ArrowLeftRight,
  Plus,
  CreditCard,
  Building2,
  CheckCircle2,
  X,
  Sparkles,
  Smartphone,
  Wallet,
  ShieldCheck,
  History,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { playCashRegisterSound, playKeypadTick, unlockAudio } from '../utils/audio';

interface VodafoneCashDashboardProps {
  balance: number;
  onBack: () => void;
  onStartTransfer: () => void;
  onDepositSuccess: (amount: number) => void;
}

export const VodafoneCashDashboard: React.FC<VodafoneCashDashboardProps> = ({
  balance,
  onBack,
  onStartTransfer,
  onDepositSuccess,
}) => {
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [depositAmount, setDepositAmount] = useState<number | ''>(500);
  const [selectedMethod, setSelectedMethod] = useState<'card' | 'atm' | 'fawry'>('card');
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [currentTime, setCurrentTime] = useState('7:25');

  // Real time clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setCurrentTime(`${hours % 12 || 12}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleDepositSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const amt = typeof depositAmount === 'number' ? depositAmount : 0;
    if (amt <= 0) return;

    unlockAudio();
    playCashRegisterSound();
    onDepositSuccess(amt);
    setShowDepositModal(false);

    setToastMessage(`تم إيداع ${amt.toLocaleString()} جنيه في محفظتك بنجاح!`);
    setShowSuccessToast(true);
    setTimeout(() => {
      setShowSuccessToast(false);
    }, 4000);
  };

  const handleQuickPreset = (amt: number) => {
    playKeypadTick();
    setDepositAmount(amt);
  };

  const formattedBalance = balance.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <div className="flex flex-col h-full w-full bg-[#f2f3f7] text-gray-900 select-none overflow-y-auto no-scrollbar relative" dir="rtl">
      {/* Toast Notification for instant balance updates */}
      <AnimatePresence>
        {showSuccessToast && (
          <motion.div
            initial={{ opacity: 0, y: -40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.95 }}
            className="fixed top-3 inset-x-4 z-50 max-w-md mx-auto bg-emerald-600 text-white p-3.5 rounded-2xl shadow-xl flex items-center justify-between"
          >
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-200 shrink-0" />
              <p className="text-xs font-bold">{toastMessage}</p>
            </div>
            <button
              type="button"
              onClick={() => setShowSuccessToast(false)}
              className="text-white/80 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Black Header Section (Exact replica of screenshot) */}
      <div className="bg-black text-white shrink-0 pt-2 pb-4 px-4 shadow-sm">
        {/* Status bar mini indicators */}
        <div className="flex items-center justify-between text-[11px] font-semibold text-gray-300 pb-2 px-1">
          {/* Right in RTL: Clock */}
          <span className="font-mono">{currentTime}</span>

          {/* Left in RTL: 5G & Battery */}
          <div className="flex items-center gap-1.5 font-mono">
            <span>٣٤%</span>
            <span className="text-[10px] bg-neutral-800 px-1 rounded">5G</span>
            {/* Battery graphic */}
            <div className="w-5 h-2.5 rounded-sm border border-white/60 p-0.5 flex items-center">
              <div className="w-2/3 h-full bg-white rounded-2xs"></div>
            </div>
          </div>
        </div>

        {/* Title & Navigation Row */}
        <div className="flex items-center justify-between pt-1">
          {/* Left (Gift Icon with Red Badge "1") */}
          <button
            type="button"
            className="relative p-1.5 text-white hover:text-red-300 transition-colors"
            title="الهدايا"
          >
            <Gift className="w-6 h-6 stroke-[1.8]" />
            <span className="absolute top-0 right-0 w-4 h-4 bg-[#e60000] text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-black">
              1
            </span>
          </button>

          {/* Center Title */}
          <h1 className="text-lg font-black tracking-tight text-white">
            فودافون كاش
          </h1>

          {/* Right (Back arrow in RTL) */}
          <button
            type="button"
            onClick={onBack}
            className="p-1.5 text-white hover:text-red-300 transition-colors"
            title="رجوع"
          >
            <ChevronRight className="w-6 h-6 stroke-[2.2]" />
          </button>
        </div>
      </div>

      {/* Main Body Container */}
      <div className="p-3.5 space-y-3 flex-1 pb-16">
        {/* CARD 1: Wallet Balance & Cashback Card (Matching screenshot) */}
        <div className="bg-white rounded-3xl p-4 border border-gray-200/70 shadow-xs relative overflow-hidden">
          {/* Top Half: Balance & Cashback */}
          <div className="flex items-center justify-between gap-3">
            {/* Right: Wallet Balance */}
            <div className="space-y-1">
              <span className="text-xs font-semibold text-gray-500 block">
                لديك في محفظتك
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-black text-[#e60000] tracking-tight font-mono">
                  {formattedBalance}
                </span>
                <span className="text-sm font-bold text-[#e60000]">جنيه</span>
              </div>
            </div>

            {/* Left: Cashback Pill Card */}
            <div className="bg-[#f2f3f7] rounded-2xl p-2.5 px-3 min-w-[105px] border border-gray-200/50 flex flex-col items-center justify-center">
              <span className="text-[11px] font-bold text-gray-700">كاش باك</span>
              <div className="flex items-center gap-1.5 mt-1">
                {/* Gold coins icon */}
                <div className="relative flex items-center justify-center">
                  <div className="w-4 h-4 rounded-full bg-amber-400 border border-amber-500 flex items-center justify-center shadow-xs">
                    <span className="text-[9px] font-black text-amber-900">+</span>
                  </div>
                </div>
                <span className="text-xs font-extrabold text-gray-800">
                  ٠.٠٠ جنيه
                </span>
              </div>
            </div>
          </div>

          {/* Horizontal Divider */}
          <div className="border-t border-gray-100 my-3.5"></div>

          {/* Bottom Half: Transaction History & QR Code */}
          <div className="grid grid-cols-2 divide-x divide-x-reverse divide-gray-100">
            {/* Action 1: Transaction History */}
            <button
              type="button"
              onClick={() => {
                playKeypadTick();
                setToastMessage('تاريخ المعاملات: جاهز ومحدث');
                setShowSuccessToast(true);
              }}
              className="flex items-center justify-center gap-2 py-1 text-gray-800 hover:text-[#e60000] transition-colors"
            >
              <Receipt className="w-4 h-4 text-gray-600" />
              <span className="text-xs font-bold">تاريخ المعاملات</span>
            </button>

            {/* Action 2: QR Code */}
            <button
              type="button"
              onClick={() => {
                playKeypadTick();
                setToastMessage('كود الـ QR جاهز للمسح');
                setShowSuccessToast(true);
              }}
              className="flex items-center justify-center gap-2 py-1 text-gray-800 hover:text-[#e60000] transition-colors"
            >
              <QrCode className="w-4 h-4 text-gray-600" />
              <span className="text-xs font-bold">كود الـ QR</span>
              <span className="bg-[#e60000] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full leading-none">
                جديد
              </span>
            </button>
          </div>
        </div>

        {/* CARD 2: Due Bills Card (Matching screenshot) */}
        <div className="bg-white rounded-2xl p-3.5 px-4 border border-gray-200/70 shadow-xs flex items-center justify-between">
          {/* Right: Title with star */}
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
            <span className="text-xs font-bold text-gray-900">
              الفواتير المستحقة
            </span>
          </div>

          {/* Left: No bills message with chevron */}
          <div className="flex items-center gap-1 text-xs text-gray-500 font-medium">
            <span>لا يوجد فواتير مستحقة</span>
            <ChevronLeft className="w-4 h-4 text-gray-400" />
          </div>
        </div>

        {/* CARD 3: Main Services Action Grid (Matching screenshot + requested Deposit) */}
        <div className="bg-white rounded-3xl p-4 border border-gray-200/70 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-1">
            <span className="text-xs font-extrabold text-gray-700">
              خدمات المحفظة السريعة
            </span>
            <span className="text-[11px] text-gray-400 font-medium">
              اختر الخدمة المطلوبة
            </span>
          </div>

          {/* Grid of Action Circles */}
          <div className="grid grid-cols-4 gap-2 pt-1 text-center">
            {/* 1. Transfer Money (تحويل أموال) - First in screenshot */}
            <div
              onClick={() => {
                unlockAudio();
                onStartTransfer();
              }}
              className="flex flex-col items-center cursor-pointer group active:scale-95 transition-transform"
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-b from-[#f8f9fa] to-[#e9ecef] border border-gray-200 shadow-sm flex items-center justify-center group-hover:border-red-400 transition-colors">
                <div className="w-9 h-9 rounded-full bg-white shadow-xs flex items-center justify-center">
                  <ArrowLeftRight className="w-5 h-5 text-[#e60000] stroke-[2.5]" />
                </div>
              </div>
              <div className="mt-2 text-xs font-bold text-gray-900 leading-tight">
                <span>تحويل</span>
                <span className="block text-gray-800">أموال</span>
              </div>
            </div>

            {/* 2. Deposit (إيداع أموال) - Explicitly requested by user */}
            <div
              onClick={() => {
                unlockAudio();
                playKeypadTick();
                setShowDepositModal(true);
              }}
              className="flex flex-col items-center cursor-pointer group active:scale-95 transition-transform"
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-b from-[#fff1f2] to-[#ffe4e6] border-2 border-red-300 shadow-sm flex items-center justify-center group-hover:border-[#e60000] transition-colors relative">
                <div className="w-9 h-9 rounded-full bg-[#e60000] text-white shadow-xs flex items-center justify-center">
                  <Plus className="w-6 h-6 stroke-[3]" />
                </div>
                {/* Instant deposit badge */}
                <span className="absolute -top-1 -right-1 bg-emerald-600 text-white text-[8px] font-bold px-1 rounded-full shadow-xs">
                  إضافة
                </span>
              </div>
              <div className="mt-2 text-xs font-bold text-gray-900 leading-tight">
                <span className="text-[#e60000]">إيداع</span>
                <span className="block text-[#e60000]">أموال</span>
              </div>
            </div>

            {/* 3. Recharge (شحن الرصيد) - In screenshot */}
            <div
              onClick={() => {
                unlockAudio();
                playKeypadTick();
                setShowDepositModal(true);
              }}
              className="flex flex-col items-center cursor-pointer group active:scale-95 transition-transform"
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-b from-[#f8f9fa] to-[#e9ecef] border border-gray-200 shadow-sm flex items-center justify-center group-hover:border-red-400 transition-colors">
                <div className="w-9 h-9 rounded-full bg-white shadow-xs flex items-center justify-center">
                  <Smartphone className="w-5 h-5 text-gray-800" />
                </div>
              </div>
              <div className="mt-2 text-xs font-bold text-gray-900 leading-tight">
                <span>شحن</span>
                <span className="block text-gray-800">الرصيد</span>
              </div>
            </div>

            {/* 4. Renew Flex (تجديد فليكس) - In screenshot */}
            <div
              onClick={() => {
                unlockAudio();
                playKeypadTick();
                setToastMessage('جاري التحقق من باقة فليكس 80...');
                setShowSuccessToast(true);
              }}
              className="flex flex-col items-center cursor-pointer group active:scale-95 transition-transform"
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-b from-[#f8f9fa] to-[#e9ecef] border border-gray-200 shadow-sm flex items-center justify-center group-hover:border-red-400 transition-colors">
                <div className="text-[#e60000] font-black text-sm tracking-tight">
                  فليكس
                </div>
              </div>
              <div className="mt-2 text-xs font-bold text-gray-900 leading-tight">
                <span>تجديد</span>
                <span className="block text-gray-800">فليكس</span>
              </div>
            </div>
          </div>

          {/* Second Row of Extra Services */}
          <div className="grid grid-cols-4 gap-2 pt-2 text-center border-t border-gray-100">
            {/* ATM Withdrawal */}
            <div
              onClick={() => {
                playKeypadTick();
                setToastMessage('كود السحب من الـ ATM: 849201');
                setShowSuccessToast(true);
              }}
              className="flex flex-col items-center cursor-pointer group active:scale-95 transition-transform"
            >
              <div className="w-13 h-13 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-center group-hover:bg-red-50 transition-colors">
                <Building2 className="w-5 h-5 text-gray-700" />
              </div>
              <span className="mt-1 text-[11px] font-semibold text-gray-700">سحب ATM</span>
            </div>

            {/* Online Virtual Card */}
            <div
              onClick={() => {
                playKeypadTick();
                setToastMessage('كارت الشراء أونلاين جاهز للإصدار');
                setShowSuccessToast(true);
              }}
              className="flex flex-col items-center cursor-pointer group active:scale-95 transition-transform"
            >
              <div className="w-13 h-13 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-center group-hover:bg-red-50 transition-colors">
                <CreditCard className="w-5 h-5 text-gray-700" />
              </div>
              <span className="mt-1 text-[11px] font-semibold text-gray-700">كارت أونلاين</span>
            </div>

            {/* Pay Bills */}
            <div
              onClick={() => {
                playKeypadTick();
                setToastMessage('دفع فواتير الكهرباء والمياه والغاز متاح');
                setShowSuccessToast(true);
              }}
              className="flex flex-col items-center cursor-pointer group active:scale-95 transition-transform"
            >
              <div className="w-13 h-13 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-center group-hover:bg-red-50 transition-colors">
                <Receipt className="w-5 h-5 text-gray-700" />
              </div>
              <span className="mt-1 text-[11px] font-semibold text-gray-700">دفع فواتير</span>
            </div>

            {/* Donations */}
            <div
              onClick={() => {
                playKeypadTick();
                setToastMessage('التبرعات للمؤسسات الخيرية');
                setShowSuccessToast(true);
              }}
              className="flex flex-col items-center cursor-pointer group active:scale-95 transition-transform"
            >
              <div className="w-13 h-13 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-center group-hover:bg-red-50 transition-colors">
                <Sparkles className="w-5 h-5 text-amber-600" />
              </div>
              <span className="mt-1 text-[11px] font-semibold text-gray-700">تبرعات</span>
            </div>
          </div>
        </div>

        {/* Quick Deposit Banner */}
        <div
          onClick={() => {
            unlockAudio();
            playKeypadTick();
            setShowDepositModal(true);
          }}
          className="bg-gradient-to-r from-red-600 to-[#cc0000] text-white rounded-2xl p-3.5 shadow-md flex items-center justify-between cursor-pointer hover:opacity-95 active:scale-[0.99] transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold">عايز تزود رصيدك؟</h3>
              <p className="text-[11px] text-red-100">
                دوس هنا واكتب أي مبلغ علشان يتضاف فوراً في محفظتك
              </p>
            </div>
          </div>
          <div className="bg-white text-[#e60000] text-xs font-bold px-3 py-1.5 rounded-xl shadow-xs">
            إيداع +
          </div>
        </div>
      </div>

      {/* Interactive Deposit Modal (Allows typing ANY amount to add to balance) */}
      <AnimatePresence>
        {showDepositModal && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4">
            <motion.div
              initial={{ y: '100%', opacity: 0.5 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
              dir="rtl"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-red-50 text-[#e60000] flex items-center justify-center">
                    <Plus className="w-5 h-5 stroke-[2.5]" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900">
                      إيداع في المحفظة
                    </h3>
                    <p className="text-[11px] text-gray-500">
                      المبلغ هيتضاف تلقائي في رصيدك
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowDepositModal(false)}
                  className="p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Amount Input with Native Keyboard */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700">
                  اكتب المبلغ اللي عايز تضيفه:
                </label>
                <div className="flex items-center border-2 border-[#e60000] rounded-2xl px-3 py-2 bg-red-50/20">
                  <input
                    type="number"
                    inputMode="numeric"
                    value={depositAmount}
                    onChange={(e) => {
                      const v = e.target.value;
                      setDepositAmount(v === '' ? '' : Math.max(0, Number(v)));
                    }}
                    placeholder="0"
                    autoFocus
                    className="w-full text-3xl font-black text-gray-900 bg-transparent focus:outline-none font-mono"
                  />
                  <span className="text-base font-bold text-gray-500 shrink-0">
                    جنيه مصري
                  </span>
                </div>
              </div>

              {/* Quick Preset Buttons */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-semibold text-gray-500">
                  مبالغ سريعة:
                </span>
                <div className="grid grid-cols-4 gap-2">
                  {[100, 500, 1000, 5000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => handleQuickPreset(amt)}
                      className={`py-2 px-1 rounded-xl text-xs font-bold transition-all ${
                        depositAmount === amt
                          ? 'bg-[#e60000] text-white shadow-xs'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                      }`}
                    >
                      +{amt} ج.م
                    </button>
                  ))}
                </div>
              </div>

              {/* Deposit Method Selection */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[11px] font-semibold text-gray-500">
                  طريقة الإيداع:
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedMethod('card')}
                    className={`p-2 rounded-xl border text-center text-xs font-bold transition-all ${
                      selectedMethod === 'card'
                        ? 'border-[#e60000] bg-red-50 text-[#e60000]'
                        : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    كارت بنكي (ميزة)
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedMethod('atm')}
                    className={`p-2 rounded-xl border text-center text-xs font-bold transition-all ${
                      selectedMethod === 'atm'
                        ? 'border-[#e60000] bg-red-50 text-[#e60000]'
                        : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    ماكينة ATM
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedMethod('fawry')}
                    className={`p-2 rounded-xl border text-center text-xs font-bold transition-all ${
                      selectedMethod === 'fawry'
                        ? 'border-[#e60000] bg-red-50 text-[#e60000]'
                        : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    فوري / أمان
                  </button>
                </div>
              </div>

              {/* Projected Balance preview */}
              <div className="bg-gray-50 rounded-2xl p-3 border border-gray-200 flex items-center justify-between text-xs">
                <span className="text-gray-600 font-semibold">
                  الرصيد بعد الإيداع:
                </span>
                <span className="font-black text-[#e60000] text-sm font-mono">
                  {(
                    balance + (typeof depositAmount === 'number' ? depositAmount : 0)
                  ).toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}{' '}
                  جنيه
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleDepositSubmit}
                  disabled={typeof depositAmount !== 'number' || depositAmount <= 0}
                  className="flex-1 py-3.5 rounded-full bg-[#e60000] text-white text-sm font-bold shadow-md hover:bg-[#cc0000] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  إيداع وتحديث الرصيد الآن
                </button>
                <button
                  type="button"
                  onClick={() => setShowDepositModal(false)}
                  className="px-5 py-3.5 rounded-full border border-gray-300 text-gray-700 text-sm font-bold hover:bg-gray-100 transition-colors"
                >
                  إلغاء
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
