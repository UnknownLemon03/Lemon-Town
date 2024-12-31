'use client'
import Image from "next/image";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

export default function NotFound() {
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
  const [count,setCount] = useState(5);
  let id:any;
  useEffect(()=>{
    id = setTimeout(()=>{
      if(count == 0){
          return redirect("/")
      }else{
        setCount(e=>e-1);
      }

    },980)
    return()=>{
      clearTimeout(id);
    }
  },[count])

  return (
    <>
      <div className=" relative background-main flex justify-center flex-col items-center px-32 ">
          <Image src={"/notfound.png"} height={500} width={500} alt={"not-found"}/>
          <span className="text-gray-100">You will be redirected to home page in {count} sec...</span>
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
