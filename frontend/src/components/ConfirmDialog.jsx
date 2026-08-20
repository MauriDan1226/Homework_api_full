import { useState } from 'react';

import Modal from './Modal';
import '../styles/confirm.css';

function ConfirmDialog({ isOpen, title, message, confirmLabel = 'Eliminar', onConfirm, onCancel }) {
  const [isWorking, setIsWorking] = useState(false);

  async function handleConfirm() {
    setIsWorking(true);
    try {
      await onConfirm();
    } finally {
      setIsWorking(false);
    }
  }

  return (
    <Modal title={title} isOpen={isOpen} onClose={onCancel} size="sm">
      <p className="confirm__message">{message}</p>

      <div className="confirm__actions">
        <button type="button" className="button button_ghost" onClick={onCancel} disabled={isWorking}>
          Cancelar
        </button>
        <button
          type="button"
          className="button button_danger"
          onClick={handleConfirm}
          disabled={isWorking}
        >
          {isWorking ? 'Eliminando...' : confirmLabel}
        </button>
      </div>
    </Modal>
  );
}

export default ConfirmDialog;
