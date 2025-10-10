import GenericTable from "../table/GenericTable";

export default function CategoriesPage() {
  const columns = [
    { header: "Category ID", accessor: "id" },
    { header: "Category Name", accessor: "name" },
    { header: "Status", accessor: "status" },
  ];

  const data = [
    { id: 1, name: "Cakes", status: "Active" },
    { id: 2, name: "Pastries", status: "Inactive" },
  ];

  return (
     <div className="p-1">
      <div className="bg-white rounded-lg shadow p-3">
        <GenericTable
          title="Categories"
          columns={columns}
          data={data}
          onView={(row) => alert(`Viewing ${row.name}`)}
          onEdit={(row) => alert(`Editing ${row.name}`)}
          onDelete={(row) => alert(`Deleting ${row.name}`)}
        />
      </div>
    </div>
  );
}
