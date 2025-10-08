import Link from "next/link";
import Image from "next/image";

export default function MainLogo() {
  return (
    <Link href="/main">
      <Image
        className="w-auto h-7 sm:h-8"
        src="https://merakiui.com/images/logo.svg"
        alt=""
        width={120}
        height={32}
      />
    </Link>
  );
}
