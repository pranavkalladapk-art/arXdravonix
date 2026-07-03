export default function SceneFallback() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-bg">
      <div className="absolute left-1/2 top-1/2 h-[70%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[100px]" />
      <div className="blueprint-grid absolute inset-0 opacity-30" />
    </div>
  );
}
