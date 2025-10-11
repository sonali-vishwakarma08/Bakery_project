import { useState } from "react";
import GenericTable from "../table/GenericTable";
import AddEditModal from "../Modals/AddEditModal";
import ViewModal from "../Modals/ViewModal";
import DeleteConfirmModal from "../Modals/DeleteConfirmModal";
import { showSuccess } from "../utils/toast";

export default function FeedbackPage() {
  const [feedbacks, setFeedbacks] = useState([
    { id: 1, customer: "Alice", message: "Loved the cake!", rating: 5, status: "Active" },
    { id: 2, customer: "Bob", message: "Could improve delivery speed", rating: 3, status: "Active" },
  ]);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [showAddEdit, setShowAddEdit] = useState(false);
  const [showView, setShowView] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const columns = [
    { header: "Feedback ID", accessor: "id" },
    { header: "Customer", accessor: "customer" },
    { header: "Message", accessor: "message" },
    { 
      header: "Rating", 
      accessor: "rating",
      render: (row) => (
        <span className="font-semibold text-yellow-600">
          {"⭐".repeat(row.rating)}
        </span>
      )
    },
    { 
      header: "Status", 
      accessor: "status",
      render: (row) => (
        <span className={`px-2 py-1 rounded text-xs ${
          row.status === "Active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
        }`}>
          {row.status}
        </span>
      )
    },
  ];

  const fields = [
    { label: "Customer Name", name: "customer", type: "text", required: true },
    { label: "Message", name: "message", type: "textarea", required: true },
    { 
      label: "Rating", 
      name: "rating", 
      type: "select",
      required: true,
      options: [
        { value: 1, label: "1 Star" },
        { value: 2, label: "2 Stars" },
        { value: 3, label: "3 Stars" },
        { value: 4, label: "4 Stars" },
        { value: 5, label: "5 Stars" },
      ]
    },
    { 
      label: "Status", 
      name: "status", 
      type: "select",
      required: true,
      options: [
        { value: "Active", label: "Active" },
        { value: "Inactive", label: "Inactive" },
      ]
    },
  ];

  // Handle save (create/update)
  const handleSave = (formData) => {
    if (selectedFeedback?.id) {
      // Update existing feedback
      setFeedbacks(feedbacks.map(f => 
        f.id === selectedFeedback.id ? { ...f, ...formData } : f
      ));
      showSuccess("Feedback updated successfully!");
    } else {
      // Add new feedback
      const newFeedback = {
        id: feedbacks.length + 1,
        ...formData,
      };
      setFeedbacks([...feedbacks, newFeedback]);
      showSuccess("Feedback added successfully!");
    }
    setShowAddEdit(false);
    setSelectedFeedback(null);
  };

  // Handle delete
  const handleDeleteConfirm = () => {
    setFeedbacks(feedbacks.filter(f => f.id !== selectedFeedback.id));
    showSuccess("Feedback deleted successfully!");
    setShowDelete(false);
    setSelectedFeedback(null);
  };

  return (
     <div className="p-1">
      <div className="bg-white rounded-lg shadow p-3">
        <GenericTable
          title="Feedback"
          columns={columns}
          data={feedbacks}
          onAdd={() => {
            setSelectedFeedback(null);
            setShowAddEdit(true);
          }}
          onView={(row) => {
            setSelectedFeedback(row);
            setShowView(true);
          }}
          onEdit={(row) => {
            setSelectedFeedback(row);
            setShowAddEdit(true);
          }}
          onDelete={(row) => {
            setSelectedFeedback(row);
            setShowDelete(true);
          }}
        />
      </div>

      {/* ✅ Add/Edit Modal */}
      <AddEditModal
        isOpen={showAddEdit}
        onClose={() => {
          setShowAddEdit(false);
          setSelectedFeedback(null);
        }}
        title={selectedFeedback ? "Edit Feedback" : "Add Feedback"}
        data={selectedFeedback}
        fields={fields}
        onSave={handleSave}
      />

      {/* ✅ View Modal */}
      <ViewModal
        isOpen={showView}
        onClose={() => {
          setShowView(false);
          setSelectedFeedback(null);
        }}
        title="Feedback Details"
        data={selectedFeedback || {}}
      />

      {/* ✅ Delete Modal */}
      <DeleteConfirmModal
        isOpen={showDelete}
        onClose={() => {
          setShowDelete(false);
          setSelectedFeedback(null);
        }}
        onConfirm={handleDeleteConfirm}
        itemName={`Feedback from ${selectedFeedback?.customer}`}
      />
    </div>
  );
}
