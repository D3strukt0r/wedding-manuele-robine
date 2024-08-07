interface Props {
  points: { key: string; text: JSX.Element }[];
}
export default function Timeline({
  points,
}: Props) {
  return (
    <>
      <div className="lg:hidden">
        <ol className="relative border-s border-gray-200 dark:border-gray-700">
          {points.map((point) => (
            <li key={point.key} className="mb-10 ms-6">
              <span className="absolute flex items-center justify-center w-6 h-6 bg-white rounded-full -start-3 ring-2 ring-white ring-offset-2 ring-offset-app-gray-dark" />
              {point.text}
            </li>
          ))}
        </ol>
      </div>
      <div className="hidden lg:block">
        <ol className="items-start sm:flex">
          {points.map((point, index) => (
            <li key={point.key} className="relative mb-6 sm:mb-0 flex-1">
              <div className="flex items-center">
                <div className="z-10 flex items-center justify-center w-6 h-6 bg-white rounded-full ring-white ring-2 ring-offset-4 ring-offset-app-gray-dark shrink-0" />
                {index !== points.length - 1 && (
                  <div className="hidden sm:flex w-full bg-gray-200 h-0.5 dark:bg-gray-700" />
                )}
              </div>
              <div className="mt-3 sm:pe-8">{point.text}</div>
            </li>
          ))}
        </ol>
      </div>
    </>
  );
}
