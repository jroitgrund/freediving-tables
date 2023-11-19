export default function Container({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex h-[667px] w-[375px] bg-black p-10 text-white">
      {children}
    </div>
  );
}
