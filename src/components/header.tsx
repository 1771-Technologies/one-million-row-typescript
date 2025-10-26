import { Logo1771 } from "./logos/1771-logo";
import { LyteNyteLogo } from "./logos/lytenyte-logo";
import { ThemeToggle } from "./theme-toggle";

export function Header() {
  return (
    <header className="flex w-full flex-1 justify-between items-center">
      <a href="https://www.1771technologies.com/" className="flex-1">
        <span className="sr-only">1771 Technologies home page</span>
        <Logo1771 width={200} />
      </a>
      <a
        href="https://www.1771technologies.com/docs/server-data-loading-overview"
        className="flex justify-center flex-1"
      >
        <span className="sr-only">
          1771 Technologies server data loading documentation
        </span>
        <LyteNyteLogo width={120} />
      </a>
      <div className="flex-1 flex justify-end">
        <ThemeToggle />
      </div>
    </header>
  );
}
