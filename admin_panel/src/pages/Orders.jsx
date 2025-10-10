import { useState } from "react";
import GenericTable from "../table/GenericTable";
import AddEditModal from "../Modals/AddEditModal";
import ViewModal from "../Modals/ViewModal";
import DeleteConfirmModal from "../Modals/DeleteConfirmModal";

export default function OrdersPage() {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showAddEdit, setShowAddEdit] = useState(false);
  const [showView, setShowView] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const columns = [
    { header: "Order ID", accessor: "id" },
    { header: "Customer Name", accessor: "customer" },
    { header: "Total", accessor: "total" },
    { header: "Status", accessor: "status" },
    { header: "Date", accessor: "date" },
  ];

  const data = [
    { id: 1, customer: "Alice", total: "$25.00", status: "Delivered", date: "2025-10-10" },
    { id: 2, customer: "Bob", total: "$42.50", status: "Pending", date: "2025-10-09" },
  ];

  return (
      <div className="p-1">
      <div className="bg-white rounded-lg shadow p-3">
      <GenericTable
        title="Orders"
        columns={columns}
        data={data}
        onView={(row) => {
          setSelectedOrder(row);
          setShowView(true);
        }}
        onEdit={(row) => {
          setSelectedOrder(row);
          setShowAddEdit(true);
        }}
        onDelete={(row) => {
          setSelectedOrder(row);
          setShowDelete(true);
        }}
      />

      {/* ✅ Modals */}
      <AddEditModal
        isOpen={showAddEdit}
        onClose={() => setShowAddEdit(false)}
        title={selectedOrder ? "Edit Order" : "Add Order"}
        data={selectedOrder}
        fields={[
          { label: "Customer Name", name: "customer", required: true },
          { label: "Total", name: "total", required: true },
          { label: "Status", name: "status" },
          { label: "Date", name: "date", type: "date" },
        ]}
        onSave={(formData) => console.log("Saved:", formData)}
      />

      <ViewModal
        isOpen={showView}
        onClose={() => setShowView(false)}
        title="View Order"
        data={selectedOrder || {}}
      />

      <DeleteConfirmModal
        isOpen={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={() => console.log("Deleted:", selectedOrder)}
        itemName={`Order #${selectedOrder?.id}`}
      />
      </div>
    </div>
  );
}
