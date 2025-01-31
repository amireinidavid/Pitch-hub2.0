"use client";

import { Button } from "@/components/ui/button";
import Modal from "./ui/modal";

const UserDetailsModal = ({ user, onClose }) => {
  return (
    <Modal isOpen={true} onClose={onClose}>
      <Modal.Header>
        <h2 className="text-lg font-bold">User Details</h2>
      </Modal.Header>
      <Modal.Body>
        <div className="space-y-4">
          <p>
            <strong>Name:</strong> {user.name}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Role:</strong> {user.role}
          </p>
          <p>
            <strong>Status:</strong> {user.active ? "Active" : "Inactive"}
          </p>
          {/* Add more user details as needed */}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onClose}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UserDetailsModal;
