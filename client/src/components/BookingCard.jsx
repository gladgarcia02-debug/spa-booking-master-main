function BookingCard({ booking, onStatusChange, updatingId }) {
  const isUpdating = updatingId === booking.id;

  return (
    <tr>
      <td>{booking.customer_name}</td>
      <td>{booking.service_name}</td>
      <td>{booking.booking_date}</td>
      <td>{booking.booking_time}</td>
      <td>
        <span className={`status status-${booking.status}`}>{booking.status}</span>
      </td>
      <td className="actions-cell">
        <button
          className="btn btn-small btn-confirm"
          disabled={isUpdating || booking.status === 'confirmed'}
          onClick={() => onStatusChange(booking.id, 'confirmed')}
        >
          Confirm
        </button>
        <button
          className="btn btn-small btn-complete"
          disabled={isUpdating || booking.status === 'completed'}
          onClick={() => onStatusChange(booking.id, 'completed')}
        >
          Complete
        </button>
        <button
          className="btn btn-small btn-danger"
          disabled={isUpdating || booking.status === 'cancelled'}
          onClick={() => onStatusChange(booking.id, 'cancelled')}
        >
          Cancel
        </button>
      </td>
    </tr>
  );
}

export default BookingCard;