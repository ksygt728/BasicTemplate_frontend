import BasicTableView from "@/components/common/table/BasicTableView";
import BasicFrame from "@/components/layout/frame/BasicFrame";
import TripleSplitFrame from "@/components/layout/frame/TripleSplitFrame";
import Image from "next/image";

export default function Frame3() {
  return (
    <TripleSplitFrame
      leftContent={<BasicTableView />}
      rightTopContent={<BasicTableView />}
      rightBottomContent={<BasicTableView />}
    />
  );
}
