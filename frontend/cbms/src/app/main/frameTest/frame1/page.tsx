import BasicTableView from "@/components/common/table/BasicTableView";
import BasicFrame from "@/components/layout/frame/BasicFrame";
import Image from "next/image";

export default function Frame1() {
  return <BasicFrame children={<BasicTableView />} />;
}
