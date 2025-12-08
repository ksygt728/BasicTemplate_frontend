import { AdvancedTable } from "@/components/common/themed/AdvancedTable";
import type { AdvancedTableColumn } from "@/components/common/themed/AdvancedTable";
import SplitFrame from "@/components/layout/frame/SplitFrame";
import Image from "next/image";

export default function Frame2() {
  const columns: AdvancedTableColumn[] = [
    { key: "id", label: "ID", sortable: true, width: 80 },
    { key: "name", label: "Name", sortable: true, width: 150 },
    { key: "email", label: "Email", sortable: true, width: 200 },
    { key: "status", label: "Status", sortable: true, width: 100 },
  ];

  const data = [
    { id: 1, name: "John Doe", email: "john@example.com", status: "Active" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", status: "Active" },
  ];

  return (
    <SplitFrame
      leftContent={
        <AdvancedTable
          columns={columns}
          data={data}
          title="Left Table"
          enableRowSelection
          enablePagination
        />
      }
      rightContent={
        <AdvancedTable
          columns={columns}
          data={data}
          title="Right Table"
          enableRowSelection
          enablePagination
        />
      }
    />
  );
}
