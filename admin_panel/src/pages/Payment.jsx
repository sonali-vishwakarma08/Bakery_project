import GenericTable from "../table/GenericTable";

export default function PaymentsPage() {
  const columns = [
    { header: "Payment ID", accessor: "id" },
    { header: "Order ID", accessor: "orderId" },
    { header: "Amount", accessor: "amount" },
    { header: "Status", accessor: "status" },
    { header: "Date", accessor: "date" },
  ];

  const data = [
    { id: 101, orderId: "ORD-001", amount: "$25", status: "Success", date: "2025-10-10" },
    { id: 102, orderId: "ORD-002", amount: "$42", status: "Failed", date: "2025-10-09" },
  ];

  return (
 <div className="p-1">
      <div className="bg-white rounded-lg shadow p-3">
        <GenericTable
          title="Payments"
          columns={columns}
          data={data}
          onView={(row) => alert(`Viewing payment ${row.id}`)}
          onEdit={(row) => alert(`Editing payment ${row.id}`)}
          onDelete={(row) => alert(`Deleting payment ${row.id}`)}
        />
      </div>
    </div>
  );
}
