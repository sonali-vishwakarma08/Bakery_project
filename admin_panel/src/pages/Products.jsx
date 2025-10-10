import GenericTable from "../table/GenericTable";

export default function ProductsPage() {
  const columns = [
    { header: "Product ID", accessor: "id" },
    { header: "Product Name", accessor: "name" },
    { header: "Price", accessor: "price" },
    { header: "Stock", accessor: "stock" },
  ];

  const data = [
    { id: 101, name: "Chocolate Cake", price: "$15", stock: 12 },
    { id: 102, name: "Strawberry Tart", price: "$8", stock: 5 },
  ];

  return (
     <div className="p-1">
      <div className="bg-white rounded-lg shadow p-3">
        <GenericTable
          title="Products"
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
