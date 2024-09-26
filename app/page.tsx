import { Link } from "@nextui-org/link";
import { Snippet } from "@nextui-org/snippet";
import { Code } from "@nextui-org/code";
import { button as buttonStyles } from "@nextui-org/theme";
import { MdOutlinePets } from "react-icons/md";
import { siteConfig } from "@/config/site";
import { FaUserDoctor } from "react-icons/fa6";
import { title, subtitle } from "@/components/primitives";
import { GithubIcon } from "@/components/icons";

export default function Home() {
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="inline-block max-w-xl text-center justify-center">
        <span className={title()}>Your&nbsp;</span>
        <span className={title({ color: "violet" })}>Pet's&nbsp;</span>
        <br />
        <span className={title()}>health, at your fingertips.</span>
      </div>

      <div className="flex gap-4 mt-3">
        <Link
          isExternal={false}
          className={buttonStyles({
            radius: "full",
            variant: "bordered",
          })}
          href="/doctors"
        >
          <FaUserDoctor />
          Doctors
        </Link>

        <Link
          isExternal={false}
          className={buttonStyles({ variant: "bordered", radius: "full" })}
          href="/pets"
        >
          {/* <GithubIcon size={20} /> */}
          <MdOutlinePets size={20} />
          Pets Owner
        </Link>
      </div>

      <div className="mt-8" p-2>
        {/* <Snippet hideCopyButton hideSymbol variant="solid"> */}

        <p>
          <span>
            {/* <span className={title()}>Pet's&nbsp;</span> */}
            Track your pet's vaccination schedule and receive reminders
          </span>
        </p>
        {/* </Snippet> */}
      </div>
    </section>
  );
}
