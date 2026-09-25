import { useState } from 'react';

const EMPTY_FORM = { name: '', description: '', duration: '', price: '' };

const getInitialFormData = (editingService) =>
  editingService
    ? {
        name: editingService.name,
        description: editingService.description || '',
        duration: editingService.duration,
        price: editingService.price,
      }
    : EMPTY_FORM;

function ServiceForm({ editingService, onSubmit, onCancel, submitting }) {
  const [formData, setFormData] = useState(() => getInitialFormData(editingService));

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

    const handleSubmit = (e) => {
    e.preventDefault();

    const duration = Number(formData.duration);
    const price = Number(formData.price);

    if (duration <= 0) {
      alert('Duration must be greater than 0.');
      return;
    }
    if (price < 0) {
      alert('Price cannot be negative.');
      return;
    }

    onSubmit({
      ...formData,
      name: formData.name.trim(),
      description: formData.description.trim(),
      duration,
      price,
    });
  };
 
  return (
    <form onSubmit={handleSubmit} className="booking-form service-form">
      <h3>{editingService ? "Edit Service" : "Add New Service"}</h3>

      <label>
        Name
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Description
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
        />
      </label>

      <label>
        Duration (minutes)
        <input
          type="number"
          name="duration"
          min="1"
          value={formData.duration}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Price (₱)
        <input
          type="number"
          name="price"
          min="0"
          step="0.01"
          value={formData.price}
          onChange={handleChange}
          required
        />
      </label>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting
            ? "Saving..."
            : editingService
              ? "Update Service"
              : "Add Service"}
        </button>
        {editingService && (
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
          >
            Cancel Edit
          </button>
        )}
      </div>
    </form>
  );
}

export default ServiceForm;