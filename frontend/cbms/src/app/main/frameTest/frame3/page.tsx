import { AdvancedTable } from "@/components/common/themed/AdvancedTable";
import type { AdvancedTableColumn } from "@/components/common/themed/AdvancedTable";
import BasicFrame from "@/components/layout/frame/BasicFrame";
import TripleSplitFrame from "@/components/layout/frame/TripleSplitFrame";
import Image from "next/image";

export default function Frame3() {
  const tableColumns: AdvancedTableColumn[] = [
    { key: "id", label: "ID", sortable: true, width: 80 },
    { key: "company", label: "Company", sortable: true, width: 150 },
    { key: "domain", label: "Domain", sortable: true, width: 180 },
    { key: "status", label: "Status", sortable: true, width: 100 },
    { key: "category", label: "Category", sortable: true, width: 120 },
  ];

  const data = [
    {
      id: 1,
      company: "Company A",
      domain: "companya.com",
      status: "Active",
      category: "Tech",
    },
    {
      id: 2,
      company: "Company B",
      domain: "companyb.com",
      status: "Active",
      category: "Finance",
    },
  ];

  return (
    <TripleSplitFrame
      leftContent={
        <AdvancedTable
          columns={tableColumns}
          data={data}
          title="Left Table"
          enableRowSelection
          enablePagination
        />
      }
      rightTopContent={
        <AdvancedTable
          columns={tableColumns}
          data={data}
          title="Right Top Table"
          enableRowSelection
          enablePagination
        />
      }
      rightBottomContent={
        <AdvancedTable
          columns={tableColumns}
          data={data}
          title="Right Bottom Table"
          enableRowSelection
          enablePagination
        />
      }
    />
  );
}
