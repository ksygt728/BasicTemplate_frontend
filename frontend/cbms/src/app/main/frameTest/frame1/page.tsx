import { AdvancedTable } from "@/components/common/themed/AdvancedTable";
import type { AdvancedTableColumn } from "@/components/common/themed/AdvancedTable";
import BasicFrame from "@/components/layout/frame/BasicFrame";
import Image from "next/image";

export default function Frame1() {
  const columns: AdvancedTableColumn[] = [
    { key: "id", label: "ID", sortable: true, width: 80 },
    { key: "name", label: "Name", sortable: true, width: 150 },
    { key: "email", label: "Email", sortable: true, width: 200 },
    { key: "status", label: "Status", sortable: true, width: 100 },
  ];

  const data = [
    { id: 1, name: "John Doe", email: "john@example.com", status: "Active" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", status: "Active" },
    {
      id: 3,
      name: "Bob Johnson",
      email: "bob@example.com",
      status: "Inactive",
    },
  ];

  return (
    <BasicFrame>
      <AdvancedTable
        columns={columns}
        data={data}
        title="Frame 1 Table"
        enableRowSelection
        enablePagination
      />
    </BasicFrame>
  );
}
