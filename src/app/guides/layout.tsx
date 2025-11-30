import ExitIntentPopup from "@/components/ExitIntentPopup";

export default function GuidesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <ExitIntentPopup isGuides={true} />
    </>
  );
}