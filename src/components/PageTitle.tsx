type PageTitleProps = {
  title: string;
};
export const PageTitle = ({ title }: PageTitleProps) => {
  return (
    <h1 className="my-4 mb-6 text-center text-3xl leading-tight text-balance md:text-6xl">
      {title}
    </h1>
  );
};
