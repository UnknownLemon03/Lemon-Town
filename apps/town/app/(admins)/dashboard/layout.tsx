import { LogOut } from "@/backend/Auth";
import NavPath from "@/components/NavPath";
import Image from "next/image";
import Link from "next/link";



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    const links = [
        {name:"Manage Rooms",icon:"/rooms.png",path:"/dashboard/rooms"},
        {name:"Manage Rooms Users",icon:"/rooms.png",path:"/dashboard/manage"},
        {name:"Accounts",icon:"/user.png",path:"/dashboard/users"},
        {name:"Maps",icon:"/map.png",path:"/dashboard/maps"},
    ]
  return (
   
      <div className="p-20 box-content relative">
        

        <button data-drawer-target="default-sidebar" data-drawer-toggle="default-sidebar" aria-controls="default-sidebar" type="button" className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
        <span className="sr-only">Open sidebar</span>
        <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <path clipRule="evenodd" fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
        </svg>
        </button>

        <aside id="default-sidebar" className="fixed top-0 left-0 z-40 w-72 h-screen transition-transform -translate-x-full sm:translate-x-0" aria-label="Sidebar">
        <div className="h-full px-3 py-4 overflow-y-auto bg-blue-600 ">
        <a href="https://flowbite.com/" className="flex items-center ps-2.5 mb-5">
         <img src="https://flowbite.com/docs/images/logo.svg" className="h-6 me-3 sm:h-7" alt="Flowbite Logo" />
         <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">Flowbite</span>
        </a>
            <ul className="space-y-2 font-medium">
                {links.map((e,i) => (
                    <li key={i} >  
                        <Link href={e.path} className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                        <Image
                            src={e.icon}
                            alt={e.name}
                            width={50}  
                            height={50} 
                            className="transition duration-75 group-hover:text-gray-900 dark:group-hover:text-white"
                        />
                            <span className="ms-3">{e.name}</span>
                        </Link>
                    </li>
                ))}
                <li  >  
                    <button onClick={LogOut}  className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                    <Image
                        src={"/logout.png"}
                        alt={"Logout"}
                        width={50}  
                        height={50} 
                        className="transition duration-75 group-hover:text-gray-900 dark:group-hover:text-white"
                    />
                        <span className="ms-3">Logout</span>
                    </button>
                </li>
            </ul>
        </div>
        </aside>

        <div className="p-2 sm:ml-64">
        <NavPath/>
        <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700">
            {children}
        </div>
        </div>

      </div>
  );
}
