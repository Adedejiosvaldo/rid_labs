export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col   py-8 md:py-10">
      <div className="inline-block text-left ">{children}</div>
    </section>
  );
}
