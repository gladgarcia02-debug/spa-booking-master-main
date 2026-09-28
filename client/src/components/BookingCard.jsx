const formatTimeLabel = (time) => {
  if (!time) return "";

  const [hourString, minuteString] = time.split(":");
  const hour = Number(hourString);
  const minute = Number(minuteString);
  const suffix = hour >= 12 ? "PM" : "AM";
  const hour12 = (hour % 12 === 0 ? 12 : hour % 12).toString().padStart(2, "0");

  return `${hour12}:${String(minute).padStart(2, "0")} ${suffix}`;
};

function BookingCard({ booking, onStatusChange, updatingId }) {
  const isUpdating = updatingId === booking.id;

  return (
    <tr>
      <td>{booking.customer_name}</td>
      <td>{booking.service_name}</td>
      <td>{booking.booking_date}</td>
      <td>{formatTimeLabel(booking.booking_time)}</td>
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