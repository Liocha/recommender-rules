import { useState } from 'react';

export const SettingsImportModal = ({ 
  isOpen, 
  onClose, 
  onImport, 
  initialValue = '' 
}) => {
  const [settingsInput, setSettingsInput] = useState(initialValue);
  const [error, setError] = useState(null);

  const handleSubmit = () => {
    try {
      const parsedSettings = JSON.parse(settingsInput);
      setError(null);
      onImport(parsedSettings);
    } catch (e) {
      setError(`Ошибка в формате настроек: ${e.message}`);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header bg-light">
            <h5 className="modal-title fw-semibold">Импорт настроек</h5>
            <button 
              type="button" 
              className="btn-close" 
              onClick={onClose}
              aria-label="Закрыть"
            />
          </div>
          
          <div className="modal-body">
            {error && (
              <div className="alert alert-danger d-flex align-items-center gap-2">
                <i className="bi bi-exclamation-triangle-fill" />
                <div>{error}</div>
              </div>
            )}

            <div className="mb-3">
              <label htmlFor="settingsInput" className="form-label small text-muted">
                Вставьте JSON-конфигурацию настроек:
              </label>
              <textarea
                id="settingsInput"
                className="form-control font-monospace"
                value={settingsInput}
                onChange={(e) => setSettingsInput(e.target.value)}
                rows={12}
                placeholder={`Пример:\n[{"type":"set_title","value":"Заголовок","component":"action"},{"type":"recently_viewed","filters":[],"component":"algorithm"}]`}
              />
            </div>
          </div>

          <div className="modal-footer border-top-0">
            <button 
              type="button" 
              className="btn btn-outline-secondary" 
              onClick={onClose}
            >
              Отменить
            </button>
            <button 
              type="button" 
              className="btn btn-primary" 
              onClick={handleSubmit}
              disabled={!settingsInput.trim()}
            >
              <i className="bi bi-upload me-2" />
              Импортировать
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};