import React, { useEffect, useState } from 'react';
import { Form, Modal, Spinner, Table } from 'react-bootstrap';
import ApiClient, { TourPackageRecord } from '../../api';
import toast from 'react-hot-toast';

interface PackageFormValues {
  title: string;
  description: string;
  price: string;
  duration: string;
  location: string;
  max_participants: string;
  image_url: string;
}

const emptyForm: PackageFormValues = {
  title: '',
  description: '',
  price: '',
  duration: '',
  location: '',
  max_participants: '',
  image_url: '',
};

const toFormValues = (pkg: TourPackageRecord | null): PackageFormValues => ({
  title: pkg?.title || '',
  description: pkg?.description || '',
  price: pkg ? String(pkg.price) : '',
  duration: pkg ? String(pkg.duration) : '',
  location: pkg?.location || '',
  max_participants: pkg ? String(pkg.max_participants) : '',
  image_url: pkg?.image_url || '',
});

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
};

const PackageManagement: React.FC = () => {
  const [packages, setPackages] = useState<TourPackageRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [currentPackage, setCurrentPackage] = useState<TourPackageRecord | null>(null);
  const [formValues, setFormValues] = useState<PackageFormValues>(emptyForm);

  const fetchPackages = async () => {
    setLoading(true);
    const api = new ApiClient();
    const data = await api.getAdminPackages();
    setPackages(data);
    setLoading(false);
  };

  useEffect(() => {
    void fetchPackages();
  }, []);

  const resetEditorState = () => {
    setShowModal(false);
    setCurrentPackage(null);
    setFormValues(emptyForm);
  };

  const openCreateModal = () => {
    setCurrentPackage(null);
    setFormValues(emptyForm);
    setShowModal(true);
  };

  const openEditModal = (pkg: TourPackageRecord) => {
    setCurrentPackage(pkg);
    setFormValues(toFormValues(pkg));
    setShowModal(true);
  };

  const closeModal = () => {
    if (saving) {
      return;
    }

    resetEditorState();
  };

  const handleFieldChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFormValues((previous) => ({ ...previous, [name]: value }));
  };

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const payload = {
      title: formValues.title.trim(),
      description: formValues.description.trim(),
      price: Number(formValues.price),
      duration: Number(formValues.duration),
      location: formValues.location.trim(),
      max_participants: Number(formValues.max_participants),
      image_url: formValues.image_url.trim() || null,
    };

    if (
      !payload.title ||
      !payload.description ||
      !payload.location ||
      !Number.isFinite(payload.price) ||
      payload.price <= 0 ||
      !Number.isFinite(payload.duration) ||
      payload.duration <= 0 ||
      !Number.isFinite(payload.max_participants) ||
      payload.max_participants <= 0
    ) {
      toast.error('Please fill out all package fields with valid values.');
      return;
    }

    setSaving(true);

    const api = new ApiClient();

    try {
      if (currentPackage?.id) {
        await api.updatePackage(currentPackage.id, payload);
        toast.success('Package updated successfully.');
      } else {
        await api.createPackage(payload);
        toast.success('Package created successfully.');
      }

      resetEditorState();
      await fetchPackages();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error saving package.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this package?')) {
      return;
    }

    setDeletingId(id);
    const api = new ApiClient();

    try {
      await api.deletePackage(id);
      toast.success('Package deleted successfully.');
      await fetchPackages();
    } catch {
      toast.error('Error deleting package.');
    } finally {
      setDeletingId(null);
    }
  };

  const normalizedSearch = searchTerm.trim().toLowerCase();
  const filteredPackages = packages.filter((pkg) => {
    if (!normalizedSearch) {
      return true;
    }

    return [pkg.title, pkg.location, pkg.description]
      .join(' ')
      .toLowerCase()
      .includes(normalizedSearch);
  });

  const averagePrice =
    packages.length > 0
      ? Math.round(
          packages.reduce((sum, pkg) => sum + Number(pkg.price || 0), 0) / packages.length
        )
      : 0;
  const averageDuration =
    packages.length > 0
      ? (packages.reduce((sum, pkg) => sum + Number(pkg.duration || 0), 0) / packages.length).toFixed(1)
      : '0.0';
  const totalCapacity = packages.reduce(
    (sum, pkg) => sum + Number(pkg.max_participants || 0),
    0
  );

  return (
    <div className="d-grid gap-4">
      <div className="admin-toolbar">
        <div className="admin-toolbar-copy">
          <h2>Package management</h2>
          <p>
            Keep your tour catalog sharp with quick edits, better visibility, and a
            faster package creation flow.
          </p>
        </div>

        <div className="admin-toolbar-actions">
          <input
            type="search"
            className="admin-search"
            placeholder="Search packages by title, location, or details"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
          <button type="button" className="admin-primary-btn" onClick={openCreateModal}>
            Add new package
          </button>
        </div>
      </div>

      <section className="admin-mini-stats-grid">
        <article className="admin-surface">
          <p className="admin-stat-label">Packages live</p>
          <h3 className="admin-stat-value">{packages.length}</h3>
          <span className="admin-stat-meta">Tours currently in the catalog</span>
        </article>

        <article className="admin-surface">
          <p className="admin-stat-label">Average price</p>
          <h3 className="admin-stat-value">{formatCurrency(averagePrice)}</h3>
          <span className="admin-stat-meta">Typical package price point</span>
        </article>

        <article className="admin-surface">
          <p className="admin-stat-label">Seat capacity</p>
          <h3 className="admin-stat-value">{totalCapacity}</h3>
          <span className="admin-stat-meta">{averageDuration} days average trip length</span>
        </article>
      </section>

      <section className="admin-surface">
        <div className="admin-toolbar">
          <div className="admin-toolbar-copy">
            <h2>Tour inventory</h2>
            <p>
              {filteredPackages.length} package{filteredPackages.length === 1 ? '' : 's'}{' '}
              shown across your active catalog.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="admin-loading-state">
            <div>
              <Spinner animation="border" />
              <p className="mb-0">Loading package inventory...</p>
            </div>
          </div>
        ) : (
          <div className="admin-table-wrap">
            <Table responsive className="admin-table">
              <thead>
                <tr>
                  <th>Package</th>
                  <th>Location</th>
                  <th>Duration</th>
                  <th>Capacity</th>
                  <th>Price</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPackages.length === 0 && (
                  <tr>
                    <td colSpan={6}>
                      <div className="admin-empty-state">
                        <div>
                          <h3 className="admin-section-heading">No packages found</h3>
                          <p className="admin-section-subtitle">
                            Try a different search or create a brand new tour package.
                          </p>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}

                {filteredPackages.map((pkg) => (
                  <tr key={pkg.id}>
                    <td>
                      <div className="admin-package-cell">
                        <div className="admin-package-thumb">
                          {pkg.image_url ? (
                            <img src={pkg.image_url} alt={pkg.title} />
                          ) : (
                            <span>{pkg.title.slice(0, 2).toUpperCase()}</span>
                          )}
                        </div>
                        <div className="admin-package-copy">
                          <strong>{pkg.title}</strong>
                          <span>{pkg.description.slice(0, 92)}{pkg.description.length > 92 ? '...' : ''}</span>
                        </div>
                      </div>
                    </td>
                    <td>{pkg.location}</td>
                    <td>{pkg.duration} days</td>
                    <td>{pkg.max_participants} travelers</td>
                    <td>{formatCurrency(pkg.price)}</td>
                    <td className="text-end">
                      <div className="d-inline-flex gap-2">
                        <button
                          type="button"
                          className="admin-secondary-btn"
                          onClick={() => openEditModal(pkg)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="admin-secondary-btn"
                          onClick={() => handleDelete(pkg.id)}
                          disabled={deletingId === pkg.id}
                        >
                          {deletingId === pkg.id ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </section>

      <Modal show={showModal} onHide={closeModal} size="lg" centered className="admin-modal">
        <Form onSubmit={handleSave}>
          <Modal.Header closeButton>
            <Modal.Title>{currentPackage ? 'Edit package' : 'Create a new package'}</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <div className="row g-4">
              <div className="col-lg-7">
                <div className="row g-3">
                  <div className="col-12 admin-form-control">
                    <Form.Label>Package title</Form.Label>
                    <Form.Control
                      name="title"
                      required
                      value={formValues.title}
                      onChange={handleFieldChange}
                      placeholder="7 Days Across Bali"
                    />
                  </div>

                  <div className="col-12 admin-form-control">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={5}
                      name="description"
                      required
                      value={formValues.description}
                      onChange={handleFieldChange}
                      placeholder="Describe what makes this trip special."
                    />
                  </div>

                  <div className="col-md-6 admin-form-control">
                    <Form.Label>Price</Form.Label>
                    <Form.Control
                      type="number"
                      min="1"
                      step="0.01"
                      name="price"
                      required
                      value={formValues.price}
                      onChange={handleFieldChange}
                      placeholder="499"
                    />
                  </div>

                  <div className="col-md-6 admin-form-control">
                    <Form.Label>Duration in days</Form.Label>
                    <Form.Control
                      type="number"
                      min="1"
                      name="duration"
                      required
                      value={formValues.duration}
                      onChange={handleFieldChange}
                      placeholder="5"
                    />
                  </div>

                  <div className="col-md-6 admin-form-control">
                    <Form.Label>Location</Form.Label>
                    <Form.Control
                      name="location"
                      required
                      value={formValues.location}
                      onChange={handleFieldChange}
                      placeholder="Bali, Indonesia"
                    />
                  </div>

                  <div className="col-md-6 admin-form-control">
                    <Form.Label>Max participants</Form.Label>
                    <Form.Control
                      type="number"
                      min="1"
                      name="max_participants"
                      required
                      value={formValues.max_participants}
                      onChange={handleFieldChange}
                      placeholder="18"
                    />
                  </div>
                </div>
              </div>

              <div className="col-lg-5">
                <div className="admin-form-control">
                  <Form.Label>Image URL</Form.Label>
                  <Form.Control
                    name="image_url"
                    value={formValues.image_url}
                    onChange={handleFieldChange}
                    placeholder="https://example.com/package-cover.jpg"
                  />
                </div>

                <div className="admin-image-preview mt-3">
                  {formValues.image_url ? (
                    <img src={formValues.image_url} alt="Package preview" />
                  ) : (
                    <div className="text-center px-4">
                      <strong className="d-block mb-2">Live preview</strong>
                      <span>
                        Add an image URL to preview the package cover before saving.
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Modal.Body>

          <Modal.Footer>
            <button type="button" className="admin-secondary-btn" onClick={closeModal}>
              Cancel
            </button>
            <button type="submit" className="admin-primary-btn" disabled={saving}>
              {saving ? 'Saving...' : currentPackage ? 'Save changes' : 'Create package'}
            </button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default PackageManagement;
