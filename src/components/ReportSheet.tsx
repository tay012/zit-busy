import { useState } from 'react';
import type { BusyBand, Report } from '../types';
import { useReports } from '../contexts/ReportsContext';
import { useBodyLock } from '../hooks/useBodyLock';
import { REPORT_OPTIONS } from '../data/constants';
import { LABEL } from '../data/constants';

interface ReportSheetProps {
  targetName: string | null;
  onClose: () => void;
  onReported: () => void;
}

export default function ReportSheet({ targetName, onClose, onReported }: ReportSheetProps) {
  const { submitReport } = useReports();
  const [confirmed, setConfirmed] = useState<Report | null>(null);
  const [confirmedName, setConfirmedName] = useState("");
  const isOn = targetName !== null;

  useBodyLock(isOn);

  const handleReport = (level: BusyBand) => {
    if (!targetName) return;
    const r = submitReport(targetName, level);
    setConfirmedName(targetName);
    setConfirmed(r);
    onReported();
  };

  const handleClose = () => {
    setConfirmed(null);
    setConfirmedName("");
    onClose();
  };

  const handleScrimClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) handleClose();
  };

  return (
    <div
      className={`scrim ${isOn ? "on" : ""}`}
      role="dialog"
      aria-modal="true"
      onClick={handleScrimClick}
    >
      <div className="sheet">
        {confirmed ? (
          <>
            <h2>Thanks</h2>
            <p className="s">
              That updates {confirmedName} for everyone looking right now.
            </p>
            <div className="conf">
              Now showing{" "}
              <b style={{ color: `var(--${confirmed.level})` }}>
                {LABEL[confirmed.level]}
              </b>
              <div className="n">
                {confirmed.count}{" "}
                {confirmed.count === 1 ? "person has" : "people have"} said this
                in the last 45 minutes
              </div>
            </div>
            <button className="cancel" onClick={handleClose}>
              Close
            </button>
          </>
        ) : (
          <>
            <h2>How busy is it?</h2>
            <p className="s">
              At {targetName} — what does it look like right now?
            </p>
            <div className="ropts">
              {REPORT_OPTIONS.map(([k, t, dd]) => (
                <button key={k} onClick={() => handleReport(k)}>
                  <span className="dot" style={{ background: `var(--${k})` }} />
                  {t}
                  <small>{dd}</small>
                </button>
              ))}
            </div>
            <button className="cancel" onClick={handleClose}>
              Not right now
            </button>
          </>
        )}
      </div>
    </div>
  );
}
