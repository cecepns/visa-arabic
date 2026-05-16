/** A4 at 96dpi — fixed desktop layout width for visa document */
export const VISA_PAGE_WIDTH_PX = 794;
export const VISA_PAGE_MIN_HEIGHT_PX = 1123;

export function getVisaPreviewScale(viewportWidth, padding = 32) {
  const available = Math.max(280, viewportWidth - padding);
  return Math.min(1, available / VISA_PAGE_WIDTH_PX);
}

export function prepareVisaElementForCapture(element) {
  const scaler = element.closest('.visa-preview-scaler');
  const frame = element.closest('.visa-preview-frame');
  const saved = {
    scaler,
    frame,
    transform: scaler?.style.transform ?? '',
    scalerWidth: scaler?.style.width ?? '',
    frameWidth: frame?.style.width ?? '',
    frameHeight: frame?.style.height ?? '',
  };

  if (scaler) {
    scaler.style.transform = 'none';
    scaler.style.width = `${VISA_PAGE_WIDTH_PX}px`;
  }
  if (frame) {
    frame.style.width = `${VISA_PAGE_WIDTH_PX}px`;
    frame.style.height = 'auto';
  }

  return saved;
}

export function restoreVisaElementAfterCapture(saved) {
  if (!saved) return;
  const { scaler, frame, transform, scalerWidth, frameWidth, frameHeight } = saved;
  if (scaler) {
    scaler.style.transform = transform;
    scaler.style.width = scalerWidth;
  }
  if (frame) {
    frame.style.width = frameWidth;
    frame.style.height = frameHeight;
  }
}
