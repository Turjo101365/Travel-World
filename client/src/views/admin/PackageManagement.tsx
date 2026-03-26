import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Spinner, Card } from 'react-bootstrap';
import ApiClient from '../../api';
import toast from 'react-hot-toast';

const PackageManagement: React.FC = () => {
  const [packages, setPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentPackage, setCurrentPackage] = useState<any>(null);

  const fetchPackages = async () => {
    setLoading(true);
    const api = new ApiClient();
    const data = await api.getAdminPackages();
    setPackages(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const payload = Object.fromEntries(formData.entries());

    const api = new ApiClient();
    try {
      if (currentPackage?.id) {
        await api.updatePackage(currentPackage.id, payload);
        toast.success('Package updated!');
      } else {
        await api.createPackage(payload);
        toast.success('Package created!');
      }
      setShowModal(false);
      fetchPackages();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error saving package');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this package?')) return;
    const api = new ApiClient();
    try {
      await api.deletePackage(id);
      toast.success('Deleted successfully');
      fetchPackages();
    } catch {
      toast.error('Error deleting package');
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Tour Packages</h2>
        <Button variant="primary" onClick={() => { setCurrentPackage(null); setShowModal(true); }}>
          + Add New Package
        </Button>
      </div>

      <Card className="border-0 shadow-sm">
        <Card.Body className="p-0">
          {loading ? <div className="text-center p-5"><Spinner animation="border" /></div> : (
            <Table responsive striped hover className="mb-0">
              <thead className="table-light">
                <tr>
                  <th className="px-4 py-3">ID</th>
                  <th className="py-3">Title</th>
                  <th className="py-3">Price</th>
                  <th className="py-3">Duration</th>
                  <th className="py-3">Location</th>
                  <th className="py-3">Max Participants</th>
                  <th className="px-4 py-3 text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {packages.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center p-4 text-muted">No tour packages found. Create one above.</td>
                  </tr>
                )}
                {packages.map((pkg) => (
                  <tr key={pkg.id}>
                    <td className="px-4 align-middle">{pkg.id}</td>
                    <td className="align-middle fw-medium">{pkg.title}</td>
                    <td className="align-middle">${pkg.price}</td>
                    <td className="align-middle">{pkg.duration} days</td>
                    <td className="align-middle">{pkg.location}</td>
                    <td className="align-middle">{pkg.max_participants}</td>
                    <td className="px-4 align-middle text-end">
                      <Button variant="outline-primary" size="sm" className="me-2" onClick={() => { setCurrentPackage(pkg); setShowModal(true); }}>Edit</Button>
                      <Button variant="outline-danger" size="sm" onClick={() => handleDelete(pkg.id)}>Delete</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Form onSubmit={handleSave}>
          <Modal.Header closeButton>
            <Modal.Title>{currentPackage ? 'Edit Package' : 'Create New Package'}</Modal.Title>
          </Modal.Header>
          <Modal.Body className="p-4">
            <div className="row">
              <div className="col-md-6 mb-3">
                <Form.Label>Title</Form.Label>
                <Form.Control name="title" required defaultValue={currentPackage?.title} placeholder="e.g. 5 Days in Paris" />
              </div>
              <div className="col-md-6 mb-3">
                <Form.Label>Price ($)</Form.Label>
                <Form.Control type="number" step="0.01" name="price" required defaultValue={currentPackage?.price} placeholder="e.g. 199.99" />
              </div>
              <div className="col-md-12 mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control as="textarea" rows={3} name="description" required defaultValue={currentPackage?.description} placeholder="Describe the tour..." />
              </div>
              <div className="col-md-4 mb-3">
                <Form.Label>Duration (Days)</Form.Label>
                <Form.Control type="number" name="duration" required defaultValue={currentPackage?.duration} placeholder="e.g. 5" />
              </div>
              <div className="col-md-4 mb-3">
                <Form.Label>Location</Form.Label>
                <Form.Control name="location" required defaultValue={currentPackage?.location} placeholder="e.g. Paris, France" />
              </div>
              <div className="col-md-4 mb-3">
                <Form.Label>Max Participants</Form.Label>
                <Form.Control type="number" name="max_participants" required defaultValue={currentPackage?.max_participants} placeholder="e.g. 15" />
              </div>
              <div className="col-md-12 mb-3">
                <Form.Label>Image URL (Optional)</Form.Label>
                <Form.Control name="image_url" defaultValue={currentPackage?.image_url} placeholder="https://example.com/image.jpg" />
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button variant="primary" type="submit">Save Package</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default PackageManagement;
