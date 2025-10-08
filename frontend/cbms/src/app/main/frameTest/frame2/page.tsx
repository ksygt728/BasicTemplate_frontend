import BasicTableView from "@/components/common/table/BasicTableView";
import SplitFrame from "@/components/layout/frame/SplitFrame";
import Image from "next/image";

export default function Frame2() {
  return (
    <SplitFrame
      leftContent={<BasicTableView />}
      rightContent={<BasicTableView />}
    />
  );
}
