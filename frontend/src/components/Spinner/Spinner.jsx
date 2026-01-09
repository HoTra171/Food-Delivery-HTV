import './Spinner.css'

const Spinner = ({ size = 'medium', message = 'Đang tải...' }) => {
  return (
    <div className="spinner-container">
      <div className={`spinner ${size}`}></div>
      {message && <p className="spinner-message">{message}</p>}
    </div>
  )
}

export default Spinner
