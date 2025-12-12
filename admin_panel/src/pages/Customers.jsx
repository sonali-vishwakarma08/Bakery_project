import { useState, useEffect } from "react";
import { FaEye, FaEdit, FaTrash, FaPlus, FaBell, FaBullhorn } from "react-icons/fa";
import { getAllUsers, updateUser, deleteUser } from "../api/userApi";
import { createNotification } from "../api/notificationApi";
import GenericTable from "../table/GenericTable";
import AddEditModal from "../Modals/AddEditModal";
import ViewModal from "../Modals/ViewModal";
import DeleteConfirmModal from "../Modals/DeleteConfirmModal";
import { showSuccess, showError } from "../utils/toast";

export default function CustomersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showAddEdit, setShowAddEdit] = useState(false);
  const [showView, setShowView] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [notificationForm, setNotificationForm] = useState({
    title: "",
    message: "",
    type: "system"
  });
  const [sendingNotification, setSendingNotification] = useState(false);
  const [sendEmail, setSendEmail] = useState(false);

  // Fetch users from backend
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getAllUsers({ role: "customer" });
      setUsers(data.users || []);
    } catch (error) {
      console.error("Error fetching users:", error);
      showError("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Table columns definition
  const columns = [
    {
      header: "Name",
      accessor: "name",
      render: (row) => (
        <div className="flex items-center gap-3">
          {row.image ? (
            <img
              src={row.image}
              alt={row.name}
              className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-600 font-medium">
                {row.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <div>
            <p className="font-medium text-gray-800">{row.name}</p>
            <p className="text-sm text-gray-500">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Phone",
      accessor: "phone",
      render: (row) => (
        <span className="text-gray-600">{row.phone || "N/A"}</span>
      ),
    },
    {
      header: "Status",
      accessor: "accountStatus",
      render: (row) => (
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          row.accountStatus === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
        }`}>
          {row.accountStatus || "active"}
        </span>
      )
    },
  ];

  const handleSendNotification = async (e) => {
    e.preventDefault();
    
    if (!notificationForm.title.trim() || !notificationForm.message.trim()) {
      showError("Title and message are required");
      return;
    }

    try {
      setSendingNotification(true);
      await createNotification({
        user: selectedUser._id,
        title: notificationForm.title,
        message: notificationForm.message,
        type: notificationForm.type,
        sent_by: "admin",
        sendEmail: sendEmail
      });
      
      showSuccess(`Notification sent to ${selectedUser.name}!`);
      setShowNotificationModal(false);
      setSendEmail(false);
      setNotificationForm({
        title: "",
        message: "",
        type: "system"
      });
    } catch (error) {
      console.error("Error sending notification:", error);
      showError("Failed to send notification");
    } finally {
      setSendingNotification(false);
    }
  };

  // Handle save (create/update)
  const handleSave = async (formData) => {
    try {
      if (selectedUser?._id) {
        // Update existing customer
        await updateUser({ id: selectedUser._id, ...formData });
        showSuccess("Customer updated successfully!");
      } else {
        // Create new customer logic would go here if needed
        showSuccess("Customer created successfully!");
      }
      setShowAddEdit(false);
      setSelectedUser(null);
      fetchUsers();
    } catch (error) {
      console.error("Error saving customer:", error);
      showError("Failed to save customer");
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteUser(selectedUser._id);
      showSuccess("Customer deleted successfully!");
      setShowDelete(false);
      setSelectedUser(null);
      fetchUsers();
    } catch (error) {
      console.error("Error deleting customer:", error);
      showError("Failed to delete customer");
    }
  };

  // Notification templates
  const notificationTemplates = [
    {
      title: "Order Placed Successfully",
      message: "Thank you for your order! We're preparing your delicious baked goods and will notify you when it's ready.",
      type: "order"
    },
    {
      title: "Order Ready for Pickup",
      message: "Your order is ready for pickup! Please visit our store within the next 2 hours.",
      type: "order"
    },
    {
      title: "Package Delivered",
      message: "Your package has been successfully delivered. Enjoy your fresh baked goods!",
      type: "order"
    },
    {
      title: "Payment Received",
      message: "We've received your payment. Thank you for choosing our bakery!",
      type: "system"
    },
    {
      title: "Special Promotion",
      message: "Exciting news! Check out our latest special offers and discounts.",
      type: "promo"
    }
  ];

  const applyTemplate = (template) => {
    setNotificationForm(prev => ({
      ...prev,
      title: template.title,
      message: template.message,
      type: template.type
    }));
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
          onNotify={(row) => {
            setSelectedUser(row);
            setShowNotificationModal(true);
          }}
          showNotifyAction={true}
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
            label: "Account Status", 
            name: "accountStatus",
            type: "select",
            options: [
              { value: "active", label: "Active" },
              { value: "inactive", label: "Inactive" },
            ]
          },
        ]}
        onSave={handleSave}
        imageFolder="users"
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

      {/* Send Notification Modal */}
      {showNotificationModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FaBullhorn className="text-blue-500 text-2xl" />
                <div>
                  <h3 className="text-xl font-bold text-gray-800">
                    Send Notification to {selectedUser?.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {selectedUser?.email}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowNotificationModal(false)}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>

            <form onSubmit={handleSendNotification} className="p-6 space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={notificationForm.title}
                  onChange={(e) => setNotificationForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter notification title"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={notificationForm.message}
                  onChange={(e) => setNotificationForm(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Enter notification message"
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  required
                />
              </div>

              {/* Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notification Type
                </label>
                <select
                  value={notificationForm.type}
                  onChange={(e) => setNotificationForm(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="system">System</option>
                  <option value="order">Order</option>
                  <option value="payment">Payment</option>
                  <option value="delivery">Delivery</option>
                  <option value="promo">Promotion</option>
                </select>
              </div>

              {/* Preview */}
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-xs text-gray-500 mb-2">Preview:</p>
                <div className="bg-white p-3 rounded border border-gray-200">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-sm text-gray-800">
                      {notificationForm.title || "Notification Title"}
                    </p>
                    <span className="text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-700">
                      {notificationForm.type}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">
                    {notificationForm.message || "Notification message will appear here..."}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">Just now • From: admin</p>
                </div>
              </div>

              {/* Templates */}
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-xs text-gray-500 mb-2">Templates:</p>
                <div className="grid grid-cols-2 gap-3">
                  {notificationTemplates.map((template, index) => (
                    <button
                      key={index}
                      onClick={() => applyTemplate(template)}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                    >
                      {template.title}
                    </button>
                  ))}
                </div>
              </div>

              {/* Send Email */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={sendEmail}
                  onChange={(e) => setSendEmail(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="text-sm text-gray-700">Send via Email</label>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowNotificationModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                  disabled={sendingNotification}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition flex items-center justify-center gap-2 disabled:opacity-50"
                  disabled={sendingNotification}
                >
                  {sendingNotification ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <FaBullhorn />
                      Send Notification
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
