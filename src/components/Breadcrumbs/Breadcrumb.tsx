import Link from "next/link";

interface BreadcrumbItem {
  name: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

const Breadcrumb = ({ items }: BreadcrumbProps) => {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <h2 className="text-[26px] font-bold leading-[30px] text-dark dark:text-white">
        {items[items.length - 1].name}
      </h2>

      <nav>
        <ol className="flex items-center gap-2">
          {items.map((item, index) => (
            <li key={index}>
              {item.href ? (
                <>
                  <Link className="font-medium" href={item.href}>
                    {item.name}
                  </Link>
                  {index < items.length - 1 && <span>  /</span>}
                </>
              ) : (
                <span className="font-medium text-primary">{item.name}</span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
};

export default Breadcrumb;
