export function Progress({ value=0, label }) {
  return (
    <div className="progressBlock">
      <div className="progressHead"><span>{label}</span><b>{value}%</b></div>
      <div className="progressTrack"><i style={{ width: `${Math.max(0, Math.min(100, value))}%` }} /></div>
    </div>
  );
}
