type PageTitleProps = {
  title: string;
};
export const PageTitle = ({ title }: PageTitleProps) => {
  return (
    <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance">
      {title}
    </h1>
  );
};
