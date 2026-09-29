// src/components/TitleBar.tsx

export function TitleBar() {
  const handleMinimize = () => window.electronAPI.minimize();
  const handleMaximize = () => window.electronAPI.maximize();
  const handleClose = () => window.electronAPI.close();

  return (
    <div className="titlebar">
      <div className="titlebar-buttons">
        <button className="titlebar-button close" type="button" onClick={handleClose} aria-label="Cerrar" title="Cerrar" />
        <button className="titlebar-button minimize" type="button" onClick={handleMinimize} aria-label="Minimizar" title="Minimizar" />
        <button className="titlebar-button maximize" type="button" onClick={handleMaximize} aria-label="Maximizar" title="Maximizar" />
      </div>
    </div>
  );
}