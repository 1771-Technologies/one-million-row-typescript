import { Logo1771 } from "./logos/1771-logo";
import { LyteNyteLogo } from "./logos/lytenyte-logo";
import { ThemeToggle } from "./theme-toggle";

export function Header() {
  return (
    <header className="flex w-full flex-1 justify-between items-center">
      <div className="flex-1">
        <Logo1771 width={200} />
      </div>
      <div className="flex justify-center flex-1">
        <LyteNyteLogo width={120} />
      </div>
      <div className="flex-1 flex justify-end">
        <ThemeToggle />
      </div>
    </header>
  );
}
