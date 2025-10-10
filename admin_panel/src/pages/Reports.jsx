import GenericTable from "../table/GenericTable";

export default function ReportsPage() {
  const columns = [
    { header: "Report ID", accessor: "id" },
    { header: "Type", accessor: "type" },
    { header: "Generated On", accessor: "date" },
  ];

  const data = [
    { id: 1, type: "Sales Summary", date: "2025-10-10" },
    { id: 2, type: "Customer Activity", date: "2025-10-08" },
  ];

  return (
   <div className="p-1">
      <div className="bg-white rounded-lg shadow p-3">
        <GenericTable
          title="Reports"
          columns={columns}
          data={data}
          onView={(row) => alert(`Viewing ${row.type}`)}
          onEdit={(row) => alert(`Editing ${row.type}`)}
          onDelete={(row) => alert(`Deleting ${row.type}`)}
        />
      </div>
    </div>
  );
}
