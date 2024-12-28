'use server'
import { isLogin } from "@/backend/Auth";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  const stars = [
    {
        "top": "53.16460874284259%",
        "left": "50.408017379760395%"
    },
    {
        "top": "81.2875610328844%",
        "left": "25.864959654618392%"
    },
    {
        "top": "89.57397301587268%",
        "left": "87.26806007876158%"
    },
    {
        "top": "0.9408500162473965%",
        "left": "83.56218379419151%"
    },
    {
        "top": "5.41380468500714%",
        "left": "3.939578782062436%"
    },
    {
        "top": "21.837081767636988%",
        "left": "8.981504060819656%"
    },
    {
        "top": "5.5045745827235315%",
        "left": "65.62459166576886%"
    },
    {
        "top": "62.68441721627618%",
        "left": "14.872767104748696%"
    },
    {
        "top": "41.32620019955957%",
        "left": "58.46130673046008%"
    },
    {
        "top": "73.14981553385205%",
        "left": "78.99141185291516%"
    },
    {
        "top": "12.636784518899024%",
        "left": "46.86131019136142%"
    },
    {
        "top": "46.322251913676425%",
        "left": "87.87400580910973%"
    },
    {
        "top": "28.424487944872958%",
        "left": "76.04917784312634%"
    },
    {
        "top": "72.65504838808286%",
        "left": "33.78340216237874%"
    },
    {
        "top": "13.260362224767475%",
        "left": "23.535767747370496%"
    }
]
  const user =  await isLogin();
  console.log(stars)
  return (
    <>
      <div className=" relative background-main flex justify-start items-center px-32 ">
          <div className="px-14 -translate-y-24  ">
            <h2 className="text-5xl py-5  text-white font-extrabold">Your <span className="text-[#cad8ff]">Virtual Town</span></h2>
            <p className="text-white mb-5">
              brings the best of in-person collaboration to <br/>your distributed teams.
            </p>
          {/* <button type="button" className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">
              Explore
          </button> */}
          {user && <Link  href={"/dashboard"} type="button" className="text-white  bg-transparent   font-bold  pl-0 text-sm px-5 py-2.5 text-center me-2 mb-2">
              Dashboard
              <svg className="inline-block rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
            </svg>
          </Link>}
          {!user && <Link  href={"/login"} type="button" className="text-white  bg-transparent   font-bold  pl-0 text-sm px-5 py-2.5 text-center me-2 mb-2">
              Sign up / login
              <svg className="inline-block rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
            </svg>
          </Link>}
          
          </div>
          {stars.map((position, index) => (
        <img
          key={index}
          src={"https://cdn.prod.website-files.com/63c885e8fb810536398b658a/640642d487bb294c34df2050_Star%206.svg"}
          alt="Star"
          className="vibrate absolute w-2.5 h-2.5"
          style={{
            top: position.top,
            left: position.left,
          }}
        />
      ))}
      </div>
    </>
  );
}
