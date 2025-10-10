import GenericTable from "../table/GenericTable";

export default function SubCategory() {
  const columns = [
    { header: "Subcategory ID", accessor: "id" },
    { header: "Subcategory Name", accessor: "name" },
    { header: "Parent Category", accessor: "category" },
    { header: "Description", accessor: "description" },
  ];

  const data = [
    { id: 1, name: "Chocolate Cakes", category: "Cakes", description: "Rich chocolate layered cakes" },
    { id: 2, name: "Cheesecakes", category: "Cakes", description: "Creamy cheesecakes with fruit toppings" },
    { id: 3, name: "Cupcakes", category: "Pastries", description: "Mini cakes in paper cups" },
  ];

  return (
    <div className="p-1">
      <div className="bg-white rounded-lg shadow p-3">
      <GenericTable title="Subcategories" columns={columns} data={data} />
    </div>
    </div>
  );
}
