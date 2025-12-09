import { Modal, Button, Typography } from "antd";

const { Text } = Typography;

export default function DeleteConfirmModal({ isOpen, onClose, onConfirm, itemName }) {
  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      centered
      width={500} // slightly bigger modal
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button
          key="delete"
          type="primary"
          style={{
            backgroundColor: "#dc143c", // dark red
            borderColor: "#8B0000",
            fontWeight: 500,
          }}
          onClick={() => {
            onConfirm();
            onClose();
          }}
        >
          Delete
        </Button>,
      ]}
      title="Delete Confirmation"
    >
      <div style={{ textAlign: "center", padding: "10px 0" }}>
        <Text style={{ fontSize: 16 }}>
          Are you sure you want to delete{" "}
          <Text strong>{itemName}</Text>?
        </Text>
      </div>
    </Modal>
  );
}
