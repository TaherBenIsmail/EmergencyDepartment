import Link from "next/link";

export function Logo({ sticky = false }: { sticky?: boolean }) {
  return (
    <div className="relative h-8 max-w-[10.847rem]">
      <Link
        href="/"
        className={`header-logo block w-full ${sticky ? "py-5 lg:py-2" : "py-8"}`}
      >
        <div
          dangerouslySetInnerHTML={{
            __html: `
              <svg width="138" height="27" viewBox="0 0 138 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                <text x="0" y="20" font-family="Segoe UI, sans-serif" font-size="20" font-weight="bold" fill="#0F172A">
                  AI <tspan fill="#10B981">Doctor</tspan>
                </text>
                <circle cx="125" cy="13.5" r="5" fill="#10B981" />
                <path d="M122 13.5h6" stroke="white" stroke-width="2" stroke-linecap="round"/>
                <path d="M125 10.5v6" stroke="white" stroke-width="2" stroke-linecap="round"/>
              </svg>
            `,
          }}
        />
      </Link>
    </div>
  );
}
