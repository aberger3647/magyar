type PageTitleProps = {
  title: string;
};
export const PageTitle = ({ title }: PageTitleProps) => {
  return (
    <h1 className="ba-h1 my-4 mb-6 text-balance">{title}</h1>
  );
};
