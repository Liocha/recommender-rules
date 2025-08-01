import React, { useState } from 'react';
import presets from '../mocks/recommenderRules.json';

export default function PresetSelector({ onSelect }) {
  const [selectedKey, setSelectedKey] = useState('');

  const handleChange = (e) => {
    const key = e.target.value;
    setSelectedKey(key);
    if (key && presets[key]) {
      onSelect(presets[key]);
    }
  };

  return (
    <div className="card shadow-sm" >
      <div className="card-body p-3">
        <h6 className="card-title mb-2 text-muted">Готовые пресеты</h6>

        <label htmlFor="presetSelect" className="form-label small mb-1">
          Выбрать пресет:
        </label>
        <select
          id="presetSelect"
          className="form-select form-select-sm"
          value={selectedKey}
          onChange={handleChange}
        >
          <option value="">-- Выберите пресет --</option>
          {Object.keys(presets).map((key) => (
            <option key={key} value={key}>
              {key}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
