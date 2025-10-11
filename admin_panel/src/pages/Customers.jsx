import { useState, useEffect } from "react";
import GenericTable from "../table/GenericTable";
import AddEditModal from "../Modals/AddEditModal";
import ViewModal from "../Modals/ViewModal";
import DeleteConfirmModal from "../Modals/DeleteConfirmModal";
import { getAllUsers, createUser, updateUser, deleteUser } from "../api/userApi";
import { showSuccess, showError } from "../utils/toast";

export default function CustomersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showAddEdit, setShowAddEdit] = useState(false);
  const [showView, setShowView] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  // Fetch users from backend
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getAllUsers({ role: "customer" });
      setUsers(data || []);
    } catch (err) {
      console.error("Failed to load users:", err);
      showError(err.message || "Failed to fetch customers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const columns = [
    {
      header: "Profile",
      accessor: "profile_image",
      render: (row) =>
        row.profile_image ? (
          <img
            src={row.profile_image.startsWith('http') ? row.profile_image : `http://localhost:5000/uploads/users/${row.profile_image}`}
            alt={row.name}
            className="w-10 h-10 object-cover rounded-full"
          />
        ) : (
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 text-xs font-semibold">
            {row.name?.charAt(0).toUpperCase()}
          </div>
        ),
    },
    { header: "Customer ID", accessor: "_id", render: (row) => `#${row._id?.slice(-6)}` },
    { header: "Name", accessor: "name" },
    { header: "Email", accessor: "email" },
    { header: "Phone", accessor: "phone" },
    { 
      header: "Status", 
      accessor: "status",
      render: (row) => (
        <span className={`px-2 py-1 rounded text-xs ${
          row.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
        }`}>
          {row.status || "active"}
        </span>
      )
    },
  ];

  // Handle save (create/update)
  const handleSave = async (formData) => {
    try {
      if (selectedUser?._id) {
        // Update existing customer
        await updateUser({ id: selectedUser._id, ...formData });
        showSuccess("Customer updated successfully!");
      } else {
        // Create new customer
        await createUser({ ...formData, role: "customer" });
        showSuccess("Customer created successfully!");
      }
      setShowAddEdit(false);
      setSelectedUser(null);
      fetchUsers();
    } catch (err) {
      showError(err.message || "Failed to save customer");
    }
  };

  // Handle delete
  const handleDeleteConfirm = async () => {
    try {
      if (selectedUser?._id) {
        await deleteUser(selectedUser._id);
        showSuccess("Customer deleted successfully!");
        setShowDelete(false);
        fetchUsers();
      }
    } catch (err) {
      showError(err.message || "Failed to delete customer");
    }
  };

  return (
     <div className="p-1">
      <div className="bg-white rounded-lg shadow p-3">
        <GenericTable
          title="Customers"
          columns={columns}
          data={users}
          loading={loading}
          onAdd={() => {
            setSelectedUser(null);
            setShowAddEdit(true);
          }}
          onView={(row) => {
            setSelectedUser(row);
            setShowView(true);
          }}
          onEdit={(row) => {
            setSelectedUser(row);
            setShowAddEdit(true);
          }}
          onDelete={(row) => {
            setSelectedUser(row);
            setShowDelete(true);
          }}
        />
      </div>

      {/* ✅ Modals */}
      <AddEditModal
        isOpen={showAddEdit}
        onClose={() => {
          setShowAddEdit(false);
          setSelectedUser(null);
        }}
        title={selectedUser ? "Edit Customer" : "Add Customer"}
        data={selectedUser}
        fields={[
          { label: "Name", name: "name", type: "text", required: true },
          { label: "Email", name: "email", type: "email", required: true },
          { label: "Password", name: "password", type: "password", required: !selectedUser },
          { label: "Phone", name: "phone", type: "text" },
          { label: "Address", name: "address", type: "textarea" },
          { 
            label: "Status", 
            name: "status",
            type: "select",
            options: [
              { value: "active", label: "Active" },
              { value: "inactive", label: "Inactive" },
            ]
          },
        ]}
        onSave={handleSave}
      />

      <ViewModal
        isOpen={showView}
        onClose={() => {
          setShowView(false);
          setSelectedUser(null);
        }}
        title="Customer Details"
        data={selectedUser || {}}
      />

      <DeleteConfirmModal
        isOpen={showDelete}
        onClose={() => {
          setShowDelete(false);
          setSelectedUser(null);
        }}
        onConfirm={handleDeleteConfirm}
        itemName={selectedUser?.name}
      />
    </div>
  );
}
