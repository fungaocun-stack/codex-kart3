import Link from "next/link";
export function Footer() {
  return <footer className="border-t border-white/10 bg-black px-5 py-12 text-white/60">
    <div className="mx-auto grid max-w-[1500px] gap-8 md:grid-cols-3">
      <div><div className="text-xl font-black tracking-[.2em] text-white"><span className="text-race">V</span>ORTKART</div><p className="mt-3 max-w-sm text-sm">Karting culture, performance machines and complete track solutions.</p></div>
      <div className="grid gap-2 text-sm"><Link href="/products">Products</Link><Link href="/projects">Racing Stories</Link><Link href="/contact">Build Your Track</Link></div>
      <div className="text-sm md:text-right">BORN FOR RACING<br/>© {new Date().getFullYear()} VORTKART</div>
    </div>
  </footer>;
}
