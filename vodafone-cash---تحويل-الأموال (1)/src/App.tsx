import React, { useState, useEffect } from 'react';
import { PhoneFrame } from './components/PhoneFrame';
import { SplashScreen } from './components/SplashScreen';
import { HomeScreen } from './components/HomeScreen';
import { VodafoneCashDashboard } from './components/VodafoneCashDashboard';
import { PinScreen } from './components/PinScreen';
import { TransferInputScreen } from './components/TransferInputScreen';
import { TransferConfirmScreen } from './components/TransferConfirmScreen';
import { TransferSuccessScreen } from './components/TransferSuccessScreen';
import { DepositScreen } from './components/DepositScreen';
import { DepositSuccessScreen } from './components/DepositSuccessScreen';
import { LoadingModal } from './components/LoadingModal';
import { AppScreen } from './types';
import { unlockAudio, playCashRegisterSound } from './utils/audio';
import { formatVodafoneCashDateTime, generateVodafoneCashRef } from './utils/dateFormatter';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('HOME');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('جاري التحميل');

  // Wallet State - Initialized to 12,859.45 EGP matching the screenshot
  const [balance, setBalance] = useState<number>(12859.45);
  const senderPhone = '01087163221';
  const [recipientPhone, setRecipientPhone] = useState('');
  const [transferAmount, setTransferAmount] = useState<number>(200);
  const fee = 0;

  // Deposit State
  const [lastDepositAmount, setLastDepositAmount] = useState<number>(500);
  const [lastDepositMethod, setLastDepositMethod] = useState<string>('كارت بنكي (ميزة / فيزا)');

  // Dynamic Real-Time Date & Reference Number for Transfers
  const [transactionDateTime, setTransactionDateTime] = useState<string>(() => formatVodafoneCashDateTime());
  const [referenceNumber, setReferenceNumber] = useState<string>(() => generateVodafoneCashRef());

  // Auto transition from splash to home screen like in video
  useEffect(() => {
    const splashTimer = setTimeout(() => {
      setShowSplash(false);
    }, 1100);
    return () => clearTimeout(splashTimer);
  }, []);

  // Pre-unlock audio on any first click in window
  useEffect(() => {
    const handleFirstTouch = () => {
      unlockAudio();
      window.removeEventListener('click', handleFirstTouch);
      window.removeEventListener('touchstart', handleFirstTouch);
    };
    window.addEventListener('click', handleFirstTouch);
    window.addEventListener('touchstart', handleFirstTouch);
    return () => {
      window.removeEventListener('click', handleFirstTouch);
      window.removeEventListener('touchstart', handleFirstTouch);
    };
  }, []);

  const getMaskedName = (phone: string) => {
    if (phone === '01036985270') {
      return 'Amr B*** Y**** R*****';
    }
    return 'Mohamed A*** H**** M*****';
  };

  const transitionWithLoading = (nextScreen: AppScreen, delayMs = 450, msg = 'جاري التحميل') => {
    setLoadingMessage(msg);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setCurrentScreen(nextScreen);
    }, delayMs);
  };

  const handleOpenVodafoneCash = () => {
    unlockAudio();
    transitionWithLoading('VODAFONE_CASH', 350);
  };

  const handleStartTransfer = () => {
    unlockAudio();
    transitionWithLoading('TRANSFER_INPUT', 400);
  };

  const handleStartDeposit = () => {
    unlockAudio();
    transitionWithLoading('DEPOSIT_INPUT', 400);
  };

  const handleDepositToWallet = (amount: number) => {
    setBalance((prev) => prev + amount);
    setLastDepositAmount(amount);
  };

  const handleConfirmDeposit = (amount: number, method: string) => {
    setBalance((prev) => prev + amount);
    setLastDepositAmount(amount);
    setLastDepositMethod(method);
    transitionWithLoading('DEPOSIT_SUCCESS', 600, 'جاري إيداع المبلغ في المحفظة...');
  };

  const handleInputProceed = (phone: string, amount: number) => {
    unlockAudio();
    setRecipientPhone(phone);
    setTransferAmount(amount);
    transitionWithLoading('TRANSFER_CONFIRM', 450);
  };

  const handleConfirmProceed = () => {
    unlockAudio();
    transitionWithLoading('TRANSFER_PIN', 400);
  };

  const handleAuthorizePinComplete = (_pin: string) => {
    // Generate fresh real-time timestamp and reference number at transfer moment
    setTransactionDateTime(formatVodafoneCashDateTime(new Date()));
    setReferenceNumber(generateVodafoneCashRef());

    // Deduct transferred amount from wallet balance so it stays accurate
    setBalance((prev) => Math.max(0, prev - transferAmount));

    // Immediately play the user's custom audio file right when transfer finishes!
    unlockAudio();
    playCashRegisterSound();

    // Transition directly to success screen with "تم الدفع"
    transitionWithLoading('TRANSFER_SUCCESS', 500, 'جاري الدفع...');
  };

  const handleDone = () => {
    // Return to Vodafone Cash hub to view updated wallet balance
    transitionWithLoading('VODAFONE_CASH', 350);
  };

  return (
    <PhoneFrame>
      {/* Loading Modal with spinning Vodafone speechmark */}
      <LoadingModal isOpen={isLoading} message={loadingMessage} />

      {/* Splash Screen */}
      {showSplash ? (
        <SplashScreen />
      ) : (
        <>
          {currentScreen === 'HOME' && (
            <HomeScreen
              balance={balance}
              onOpenVodafoneCash={handleOpenVodafoneCash}
              onStartTransfer={handleStartTransfer}
              onStartDeposit={handleStartDeposit}
            />
          )}

          {currentScreen === 'VODAFONE_CASH' && (
            <VodafoneCashDashboard
              balance={balance}
              onBack={() => transitionWithLoading('HOME', 300)}
              onStartTransfer={handleStartTransfer}
              onDepositSuccess={handleDepositToWallet}
            />
          )}

          {currentScreen === 'DEPOSIT_INPUT' && (
            <DepositScreen
              currentBalance={balance}
              onBack={() => transitionWithLoading('VODAFONE_CASH', 300)}
              onConfirmDeposit={handleConfirmDeposit}
            />
          )}

          {currentScreen === 'DEPOSIT_SUCCESS' && (
            <DepositSuccessScreen
              amount={lastDepositAmount}
              newBalance={balance}
              method={lastDepositMethod}
              onDone={handleDone}
              onGoToTransfer={handleStartTransfer}
            />
          )}

          {currentScreen === 'TRANSFER_INPUT' && (
            <TransferInputScreen
              defaultPhone={recipientPhone}
              defaultAmount={transferAmount}
              balance={balance}
              onBack={() => transitionWithLoading('VODAFONE_CASH', 300)}
              onProceed={handleInputProceed}
            />
          )}

          {currentScreen === 'TRANSFER_CONFIRM' && (
            <TransferConfirmScreen
              senderPhone={senderPhone}
              recipientPhone={recipientPhone}
              recipientName={getMaskedName(recipientPhone)}
              amount={transferAmount}
              fee={fee}
              onBack={() => transitionWithLoading('TRANSFER_INPUT', 300)}
              onConfirm={handleConfirmProceed}
            />
          )}

          {currentScreen === 'TRANSFER_PIN' && (
            <PinScreen
              onComplete={handleAuthorizePinComplete}
              title="ادخل رقم المحفظة السري"
              onBack={() => transitionWithLoading('TRANSFER_CONFIRM', 300)}
            />
          )}

          {currentScreen === 'TRANSFER_SUCCESS' && (
            <TransferSuccessScreen
              senderPhone={senderPhone}
              recipientPhone={recipientPhone}
              recipientName={getMaskedName(recipientPhone)}
              amount={transferAmount}
              fee={fee}
              dateTime={transactionDateTime}
              referenceNumber={referenceNumber}
              onDone={handleDone}
            />
          )}
        </>
      )}
    </PhoneFrame>
  );
}
