import React from 'react'
import ReactDom from 'react-dom'

const MODAL_STYLES = {
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: 'rgb(34,34,34)',
  padding: '50px',
  zIndex: 1000,
  height: '90%',
  width: '90%',
  display: 'flex',
  flexDirection: 'column'
}

const OVERLAY_STYLES = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, .7)',
  zIndex: 1000
}

export default function Modal({ children, onClose }) {
  const target = document.getElementById('root') || document.body
  return ReactDom.createPortal(
    <>
      <div style={OVERLAY_STYLES} onClick={onClose} aria-hidden="true" />
      <div style={MODAL_STYLES} role="dialog" aria-modal="true" aria-label="Modal dialog">
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '-35px', marginBottom: '10px' }}>
          <button
            type="button"
            className="btn bg-danger text-white fs-4"
            aria-label="Close modal"
            title="Close modal"
            onClick={onClose}
          >
            &times;
          </button>
        </div>
        {children}
      </div>
    </>,
    target
  )
}
