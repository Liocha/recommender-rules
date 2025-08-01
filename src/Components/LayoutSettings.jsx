import React from 'react';

export default function LayoutSettings({ config, onChange }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    const isNumeric = ['nodesep', 'ranksep', 'marginx', 'marginy'].includes(name);
    onChange({
      ...config,
      [name]: isNumeric ? parseInt(value) : value,
    });
  };

  const isDagre = config.layoutAlgorithm === 'dagre';

  return (
    <div className="card shadow-sm">
      <div className="card-body p-3">
        <h6 className="card-title mb-2 text-muted">Настройки графа</h6>

        {/* Алгоритм расположения */}
        <div className="mb-2">
          <label className="form-label small mb-1">Алгоритм расположения</label>
          <select
            name="layoutAlgorithm"
            value={config.layoutAlgorithm}
            onChange={handleChange}
            className="form-select form-select-sm"
          >
            <option value="dagre">Dagre (авто)</option>
            <option value="custom">Кастомный</option>
          </select>
        </div>

        {isDagre && (
          <>
            <div className="mb-2">
              <label className="form-label small mb-1">Направление (rankdir)</label>
              <select
                name="rankdir"
                value={config.rankdir}
                onChange={handleChange}
                className="form-select form-select-sm"
              >
                <option value="TB">Сверху вниз (TB)</option>
                <option value="BT">Снизу вверх (BT)</option>
                <option value="LR">Слева направо (LR)</option>
                <option value="RL">Справа налево (RL)</option>
              </select>
            </div>

            <div className="mb-2">
              <label className="form-label small mb-1">Выравнивание (align)</label>
              <select
                name="align"
                value={config.align || ''}
                onChange={handleChange}
                className="form-select form-select-sm"
              >
                <option value="">(не указано)</option>
                <option value="UL">UL (верх-лево)</option>
                <option value="UR">UR (верх-право)</option>
                <option value="DL">DL (низ-лево)</option>
                <option value="DR">DR (низ-право)</option>
              </select>
            </div>

            <div className="mb-2">
              <label className="form-label small mb-1">Алгоритм ранжирования (ranker)</label>
              <select
                name="ranker"
                value={config.ranker || 'network-simplex'}
                onChange={handleChange}
                className="form-select form-select-sm"
              >
                <option value="network-simplex">Network Simplex</option>
                <option value="tight-tree">Tight Tree</option>
                <option value="longest-path">Longest Path</option>
              </select>
            </div>

            <div className="mb-2">
              <label className="form-label small mb-1">Отступ между нодами (nodesep)</label>
              <input
                type="number"
                name="nodesep"
                value={config.nodesep}
                onChange={handleChange}
                className="form-control form-control-sm"
              />
            </div>

            <div className="mb-2">
              <label className="form-label small mb-1">Отступ между уровнями (ranksep)</label>
              <input
                type="number"
                name="ranksep"
                value={config.ranksep}
                onChange={handleChange}
                className="form-control form-control-sm"
              />
            </div>

            <div className="mb-2">
              <label className="form-label small mb-1">Горизонтальный отступ графа (marginx)</label>
              <input
                type="number"
                name="marginx"
                value={config.marginx}
                onChange={handleChange}
                className="form-control form-control-sm"
              />
            </div>

            <div>
              <label className="form-label small mb-1">Вертикальный отступ графа (marginy)</label>
              <input
                type="number"
                name="marginy"
                value={config.marginy}
                onChange={handleChange}
                className="form-control form-control-sm"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
