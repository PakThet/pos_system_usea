import Header from "./Header";
import Navbar from "./Navbar";


const AdminLayout = ({children}: {children: React.ReactNode}) => {

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
        <Header />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <aside className="fixed mt-[56px] inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
            <Navbar />
        </aside>
        <main className="flex-1 p-4 sm:px-6 sm:py-0">
        {children}
      </main>
      </div>
    </div>
  )
}

export default AdminLayout
