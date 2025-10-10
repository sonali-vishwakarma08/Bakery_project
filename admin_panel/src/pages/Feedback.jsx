import GenericTable from "../table/GenericTable";

export default function FeedbackPage() {
  const columns = [
    { header: "Feedback ID", accessor: "id" },
    { header: "Customer", accessor: "customer" },
    { header: "Message", accessor: "message" },
    { header: "Rating", accessor: "rating" },
  ];

  const data = [
    { id: 1, customer: "Alice", message: "Loved the cake!", rating: 5 },
    { id: 2, customer: "Bob", message: "Could improve delivery speed", rating: 3 },
  ];

  return (
     <div className="p-1">
      <div className="bg-white rounded-lg shadow p-3">
        <GenericTable
          title="Feedback"
          columns={columns}
          data={data}
          onView={(row) => alert(`Viewing feedback ${row.id}`)}
          onEdit={(row) => alert(`Editing feedback ${row.id}`)}
          onDelete={(row) => alert(`Deleting feedback ${row.id}`)}
        />
      </div>
    </div>
  );
}
