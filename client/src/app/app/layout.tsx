

export default function AppLayout({children}: {children: React.ReactNode}) {

  return (
    <div className="flex flex-row">
      <div className="h-screen w-16 bg-white dark:bg-slate-800" style={{marginLeft: "64px"}}></div>
      <div className="">{children}</div>
    </div>
  )
}