import { QRCodeSVG } from 'qrcode.react';

const QRCodeDisplay = ({ value, size = 80 }) => {
  return (
    <div className="flex-shrink-0">
      <QRCodeSVG
        value={value || 'N/A'}
        size={size}
        level="M"
        includeMargin={false}
      />
    </div>
  );
};

export default QRCodeDisplay;
