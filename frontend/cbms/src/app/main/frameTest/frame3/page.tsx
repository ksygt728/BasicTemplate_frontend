import BasicTableView from "@/components/common/table/BasicTableView";
import BasicFrame from "@/components/layout/frame/BasicFrame";
import TripleSplitFrame from "@/components/layout/frame/TripleSplitFrame";
import Image from "next/image";

export default function Frame3() {
  const tableColumns = [
    { key: "id", label: "ID", sortable: true, width: 80 },
    { key: "company", label: "Company", sortable: true, width: 150 },
    { key: "domain", label: "Domain", sortable: true, width: 180 },
    { key: "status", label: "Status", sortable: true, width: 100 },
    { key: "category", label: "Category", sortable: true, width: 120 },
  ];

  return (
    <TripleSplitFrame
      leftContent={<BasicTableView columns={tableColumns} title="Left Table" />}
      rightTopContent={
        <BasicTableView columns={tableColumns} title="Right Top Table" />
      }
      rightBottomContent={
        <BasicTableView columns={tableColumns} title="Right Bottom Table" />
      }
    />
  );
}
