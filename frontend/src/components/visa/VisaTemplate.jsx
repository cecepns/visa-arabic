import { QRCodeSVG } from 'qrcode.react';
import Barcode from 'react-barcode';
import kingdomLogo from '../../assets/kingdom.png';
import visaKsaLogo from '../../assets/visa-ksa.png';
import checkDivider from '../../assets/check.png';
import { getImageUrl, getVisaQrUrl } from '../../utils/helpers';
import {
  formatVisaDate,
  getNationalityBilingual,
  getVisaTypeBilingual,
  getDurationLabel,
  digitsOnly,
  getVisaBarcodeValue,
  getApplicationBarcodeValue,
  generateMRZ,
} from '../../utils/visaDocument';
import { VISA_PAGE_WIDTH_PX, VISA_PAGE_MIN_HEIGHT_PX } from '../../utils/visaLayout';

const VISA_ROW_BORDER = 'border-b border-[#5c4d7a]';
const VISA_TABLE_GRID = 'grid grid-cols-[1fr_minmax(280px,2.2fr)_1fr] items-center';

function CheckDivider() {
  return (
    <div className="py-3 select-none w-full" aria-hidden>
      <img
        src={checkDivider}
        alt=""
        className="block w-full h-[18px] object-cover object-center"
      />
    </div>
  );
}

function TopFieldRow({ labelEn, labelAr, value }) {
  return (
    <div className={`${VISA_TABLE_GRID} border-b border-gray-400 py-2 text-[13px]`}>
      <span className="font-arabic text-right text-gray-800 pr-2" dir="rtl">
        {labelAr}
      </span>
      <span className="text-center font-semibold text-gray-900 px-2">{value}</span>
      <span className="text-left text-gray-800 pl-2">{labelEn}</span>
    </div>
  );
}

function VisaTableRow({ labelEn, labelAr, center, barcode = false }) {
  return (
    <div className={`${VISA_TABLE_GRID} ${VISA_ROW_BORDER} ${barcode ? 'py-4' : 'py-3'} text-[12px] text-gray-800`}>
      <span className="font-arabic text-right pr-3 self-center" dir="rtl">
        {labelAr}
      </span>
      {barcode ? (
        <div className="flex justify-center px-2 self-center">{center}</div>
      ) : (
        <span className="text-center px-3 text-[13px] font-bold text-gray-900 self-center">{center}</span>
      )}
      <span className="text-left pl-3 self-center">{labelEn}</span>
    </div>
  );
}

function VisaBarcodeCenter({ value, displayText }) {
  const encoded = String(value || '0');
  const shown = displayText ?? encoded;

  return (
    <div className="visa-barcode-block flex flex-col items-center w-[300px] max-w-full">
      <Barcode
        value={encoded}
        format="CODE128"
        width={2.4}
        height={52}
        displayValue={false}
        margin={0}
        background="transparent"
        lineColor="#000000"
      />
      <span className="font-mono text-[11px] font-normal text-gray-900 mt-2 tracking-[0.2em]">
        {shown}
      </span>
    </div>
  );
}

export default function VisaTemplate({ visa }) {
  if (!visa) return null;

  const photoUrl = getImageUrl(visa.profile_photo);
  const qrUrl = getVisaQrUrl(visa);
  const mrzLines = generateMRZ(visa);
  const DEFAULT_PLACE_OF_ISSUE = 'Saudi Digital Embassy - السفارة السعودية الرقمية';
  const placeOfIssue = visa.place_of_issue || DEFAULT_PLACE_OF_ISSUE;
  const serviceProvider = visa.sponsor_name || 'Ministry of Foreign Affairs - وزارة الخارجية';
  const borderNo = visa.border_no ?? String(visa.id ?? 0);
  const localService =
    visa.local_service ||
    digitsOnly(visa.application_number).slice(-12) ||
    digitsOnly(visa.visa_number);
  const visaBarcodeValue = getVisaBarcodeValue(visa);
  const applicationBarcodeValue = getApplicationBarcodeValue(visa);

  return (
    <div
      id="visa-print-area"
      className="visa-document relative bg-white text-gray-900 mx-auto shadow-2xl"
      style={{
        width: VISA_PAGE_WIDTH_PX,
        minHeight: VISA_PAGE_MIN_HEIGHT_PX,
        fontFamily: "'Cairo', 'Noto Sans Arabic', 'Arial', sans-serif",
      }}
    >
      {/* Watermark emblem */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden>
        <div className="opacity-[0.06] select-none text-center">
          <div className="text-[140px] leading-none">🇸🇦</div>
          <p className="font-arabic text-4xl font-bold mt-2 text-gray-800" dir="rtl">
            المملكة العربية السعودية
          </p>
        </div>
      </div>

      <div className="relative px-6 py-5">
        {/* Header logos */}
        <header className="flex items-start justify-between mb-5 pb-4 border-b border-gray-300">
          <div className="flex items-start flex-shrink-0">
            <img
              src={visaKsaLogo}
              alt="KSA Visa eVisa"
              className="h-[72px] w-auto max-w-[240px] object-contain object-left"
            />
          </div>
          <div className="flex justify-end items-start flex-shrink-0">
            <img
              src={kingdomLogo}
              alt="Kingdom of Saudi Arabia"
              className="h-[72px] w-auto max-w-[200px] object-contain object-right"
            />
          </div>
        </header>

        {/* Photo + top fields */}
        <section className="flex gap-5 mb-2">
          <div className="flex-shrink-0 w-[130px] h-[165px] border-2 border-gray-500 bg-gray-50 overflow-hidden">
            {photoUrl ? (
              <img src={photoUrl} alt="" className="w-full h-full object-cover" crossOrigin="anonymous" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs text-center p-2 font-arabic">
                صورة شخصية
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <TopFieldRow labelEn="Visa No." labelAr="رقم التأشيرة" value={visa.visa_number} />
            <TopFieldRow labelEn="Valid from" labelAr="صالحة من" value={formatVisaDate(visa.issue_date)} />
            <TopFieldRow labelEn="Valid until" labelAr="صالحة حتى" value={formatVisaDate(visa.expiry_date)} />
            <TopFieldRow labelEn="Duration of Stay" labelAr="مدة الإقامة" value={getDurationLabel(visa)} />
            <TopFieldRow labelEn="Passport No." labelAr="رقم الجواز" value={visa.passport_number} />
          </div>
        </section>

        <CheckDivider />

        {/* Place of issue → Application No. (unified table) */}
        <section className="border-t border-[#5c4d7a]">
          <VisaTableRow labelEn="Place of issue" labelAr="مصدر التأشيرة" center={placeOfIssue} />
          <VisaTableRow labelEn="Name" labelAr="الاسم" center={visa.full_name?.toUpperCase()} />
          <VisaTableRow labelEn="Nationality" labelAr="الجنسية" center={getNationalityBilingual(visa.nationality)} />
          <VisaTableRow labelEn="Type Of Visa" labelAr="نوع التأشيرة" center={getVisaTypeBilingual(visa.visa_type)} />
          <VisaTableRow labelEn="Service Provider" labelAr="شركة تقديم الخدمات" center={serviceProvider} />
          <VisaTableRow labelEn="Border No" labelAr="رقم الحدود" center={borderNo} />
          <VisaTableRow labelEn="Local Service" labelAr="الخدمة الميدانية" center={localService} />
          <VisaTableRow
            labelEn="Visa No."
            labelAr="رقم التأشيرة"
            barcode
            center={<VisaBarcodeCenter value={visaBarcodeValue} displayText={visaBarcodeValue} />}
          />
          <VisaTableRow
            labelEn="Application No."
            labelAr="رقم الطلب"
            barcode
            center={
              <VisaBarcodeCenter
                value={applicationBarcodeValue}
                displayText={applicationBarcodeValue}
              />
            }
          />
        </section>

        <CheckDivider />

        {/* QR footer */}
        <footer className="flex items-center justify-center gap-8 py-6">
          <p className="text-[11px] text-gray-700 max-w-[120px] text-right leading-snug">
            For Visa Inquiry
            <br />
            Please scan QR code
          </p>
          <div className="flex-shrink-0 p-2 border border-gray-300 bg-white">
            <QRCodeSVG value={qrUrl} size={100} level="H" />
          </div>
          <p className="text-[11px] text-gray-700 max-w-[120px] text-left leading-snug font-arabic" dir="rtl">
            للإستعلام عن التأشيرة
            <br />
            يرجى مسح رمز الاستجابة السريعة
          </p>
        </footer>

        {/* MRZ */}
        <div className="mt-2 px-3 py-3 font-mono text-[11px] leading-relaxed tracking-wider text-gray-900 text-center">
          {mrzLines.map((line) => (
            <p key={line} className="whitespace-pre overflow-hidden">
              {line}
            </p>
          ))}
        </div>

        {/* Page meta */}
        <div className="flex justify-between items-center mt-4 pt-2 border-t border-gray-200 text-[9px] text-gray-500">
          <span>https://visa.mofa.gov.sa/Home/PrintVisa</span>
          <span>
            {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' })},{' '}
            {new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })} — Page 1 of 1
          </span>
        </div>
      </div>
    </div>
  );
}
