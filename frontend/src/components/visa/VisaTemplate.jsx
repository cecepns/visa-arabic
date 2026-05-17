import { QRCodeSVG } from 'qrcode.react';
import Barcode from 'react-barcode';
import kingdomLogo from '../../assets/kingdom.png';
import visaKsaLogo from '../../assets/visa-ksa.png';
import checkDivider from '../../assets/check.png';
import watermarkImg from '../../assets/watermark.jpeg';
import { getImageUrl, getVisaQrUrl } from '../../utils/helpers';
import {
  formatVisaDate,
  getNationalityBilingual,
  getVisaTypeBilingual,
  getDurationLabel,
  getHajjSeasonLabel,
  digitsOnly,
  getVisaBarcodeValue,
  getApplicationBarcodeValue,
  generateMRZ,
} from '../../utils/visaDocument';
import { VISA_PAGE_WIDTH_PX, VISA_PAGE_MIN_HEIGHT_PX } from '../../utils/visaLayout';

const VISA_ROW_BORDER = 'border-b border-gray-400';
const VISA_TABLE_GRID = 'grid grid-cols-[1fr_minmax(280px,2.2fr)_1fr] items-center';
const PHOTO_WIDTH = 'w-[130px]';
const VISA_LABEL = 'text-[12px] font-semibold text-gray-800 leading-snug';
const VISA_VALUE = 'text-[14px] font-bold text-gray-950 leading-tight';
const VISA_FONT_EN = "'Arial', 'Helvetica Neue', Helvetica, sans-serif";

function CheckDivider({ besidePhoto = false }) {
  const img = (
    <img
      src={checkDivider}
      alt=""
      className={`block h-[28px] object-contain object-center ${
        besidePhoto ? 'w-full' : 'w-[88%] max-w-[640px]'
      }`}
    />
  );

  if (besidePhoto) {
    return (
      <div className="flex gap-5 select-none" aria-hidden>
        <div className={`flex-shrink-0 ${PHOTO_WIDTH}`} />
        <div className="flex-1 min-w-0 py-3">{img}</div>
      </div>
    );
  }

  return (
    <div className="py-3 select-none w-full flex justify-center" aria-hidden>
      {img}
    </div>
  );
}

function TopFieldRow({ labelEn, labelAr, value }) {
  return (
    <div className={`${VISA_TABLE_GRID} border-b border-gray-400 py-[7px]`}>
      <span className={`${VISA_LABEL} font-arabic text-right pr-2`} dir="rtl">
        {labelAr}
      </span>
      <span className={`${VISA_VALUE} text-center px-2`}>{value}</span>
      <span className={`${VISA_LABEL} text-left pl-2`}>{labelEn}</span>
    </div>
  );
}

function VisaTableRow({ labelEn, labelAr, center, barcode = false }) {
  return (
    <div className={`${VISA_TABLE_GRID} ${VISA_ROW_BORDER} ${barcode ? 'py-2' : 'py-[9px]'}`}>
      <span className={`${VISA_LABEL} font-arabic text-right pr-3 self-center`} dir="rtl">
        {labelAr}
      </span>
      {barcode ? (
        <div className="flex justify-center px-2 self-center">{center}</div>
      ) : (
        <span className={`${VISA_VALUE} text-center px-3 self-center`}>{center}</span>
      )}
      <span className={`${VISA_LABEL} text-left pl-3 self-center`}>{labelEn}</span>
    </div>
  );
}

function VisaBarcodeCenter({ value, displayText }) {
  const encoded = String(value || '0');
  const shown = displayText ?? encoded;

  return (
    <div className="visa-barcode-block flex flex-col items-center w-[220px] max-w-full">
      <Barcode
        value={encoded}
        format="CODE128"
        width={1.4}
        height={28}
        displayValue={false}
        margin={0}
        background="transparent"
        lineColor="#000000"
      />
      <span
        className="text-[12px] font-bold text-gray-950 mt-1 tracking-[0.12em]"
        style={{ fontFamily: VISA_FONT_EN }}
      >
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
  const hajjSeasonValue = visa.visa_type === 'Hajj' ? getHajjSeasonLabel() : null;

  return (
    <div
      id="visa-print-area"
      className="visa-document relative bg-white text-gray-900 mx-auto shadow-2xl"
      style={{
        width: VISA_PAGE_WIDTH_PX,
        minHeight: VISA_PAGE_MIN_HEIGHT_PX,
        fontFamily: VISA_FONT_EN,
        colorScheme: 'light',
        backgroundColor: '#ffffff',
      }}
    >
      <div className="visa-watermark absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden" aria-hidden>
        <img src={watermarkImg} alt="" className="visa-watermark-emblem" />
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
          <div className={`flex-shrink-0 ${PHOTO_WIDTH} h-[165px] border-2 border-gray-500 bg-gray-50 overflow-hidden`}>
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
            <TopFieldRow
              labelEn="Valid until"
              labelAr="صالحة حتى"
              value={hajjSeasonValue ?? formatVisaDate(visa.expiry_date)}
            />
            <TopFieldRow
              labelEn="Duration of Stay"
              labelAr="مدة الإقامة"
              value={getDurationLabel(visa)}
            />
            <TopFieldRow labelEn="Passport No." labelAr="رقم الجواز" value={visa.passport_number} />
          </div>
        </section>

        <CheckDivider besidePhoto />

        {/* Place of issue → Application No. (unified table) */}
        <section className="border-t border-gray-400">
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
          <p className={`${VISA_LABEL} max-w-[120px] text-right`}>
            For Visa Inquiry
            <br />
            Please scan QR code
          </p>
          <div className="flex-shrink-0 p-2 border border-gray-300 bg-white">
            <QRCodeSVG value={qrUrl} size={100} level="H" />
          </div>
          <p className={`${VISA_LABEL} font-arabic max-w-[120px] text-left`} dir="rtl">
            للإستعلام عن التأشيرة
            <br />
            يرجى مسح رمز الاستجابة السريعة
          </p>
        </footer>

        {/* MRZ */}
        <div
          className="mt-2 px-3 py-3 text-[11px] leading-relaxed tracking-wider text-gray-950 text-center font-bold"
          style={{ fontFamily: "'Courier New', Courier, monospace" }}
        >
          {mrzLines.map((line) => (
            <p key={line} className="whitespace-pre overflow-hidden">
              {line}
            </p>
          ))}
        </div>

        {/* Page meta */}
        <div className="flex justify-between items-center mt-4 pt-2 border-t border-gray-200 text-[9px] font-normal text-gray-500">
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
