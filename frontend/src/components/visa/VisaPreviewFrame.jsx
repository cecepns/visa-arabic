import { useEffect, useRef, useState } from 'react';
import {
  VISA_PAGE_WIDTH_PX,
  VISA_PAGE_MIN_HEIGHT_PX,
  getVisaPreviewScale,
} from '../../utils/visaLayout';

export default function VisaPreviewFrame({ children }) {
  const innerRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [contentHeight, setContentHeight] = useState(VISA_PAGE_MIN_HEIGHT_PX);

  useEffect(() => {
    const updateScale = () => {
      setScale(getVisaPreviewScale(window.innerWidth));
    };
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  useEffect(() => {
    const el = innerRef.current;
    if (!el) return;

    const measure = () => {
      setContentHeight(el.offsetHeight);
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [children, scale]);

  const frameWidth = VISA_PAGE_WIDTH_PX * scale;
  const frameHeight = contentHeight * scale;

  return (
    <div className="visa-preview-frame mx-auto" style={{ width: frameWidth, height: frameHeight }}>
      <div
        ref={innerRef}
        className="visa-preview-scaler"
        style={{
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          width: VISA_PAGE_WIDTH_PX,
        }}
      >
        {children}
      </div>
    </div>
  );
}
