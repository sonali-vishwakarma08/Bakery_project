import GenericTable from "../table/GenericTable";

export default function PromocodePage() {
  const columns = [
    { header: "Code", accessor: "code" },
    { header: "Discount", accessor: "discount" },
    { header: "Status", accessor: "status" },
    { header: "Expiry", accessor: "expiry" },
  ];

  const data = [
    { code: "SAVE10", discount: "10%", status: "Active", expiry: "2025-12-31" },
    { code: "WELCOME5", discount: "5%", status: "Expired", expiry: "2024-06-30" },
  ];

  return (
    <div className="p-1">
      <div className="bg-white rounded-lg shadow p-3">
        <GenericTable
          title="Promocodes"
          columns={columns}
          data={data}
          onView={(row) => alert(`Viewing ${row.code}`)}
          onEdit={(row) => alert(`Editing ${row.code}`)}
          onDelete={(row) => alert(`Deleting ${row.code}`)}
        />
      </div>
    </div>
  );
}
