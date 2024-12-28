import React from 'react'
import toast, { Toast } from 'react-hot-toast';

export default function AskPermission({ name, message , onAccept,onReject,cancelTimeout }: { name: string, message: string,onAccept:()=>any,cancelTimeout:()=>any,onReject:()=>any }) {
   
  toast.custom((t: Toast) => {
    return (
    <div
      className={`${
        t.visible ? 'animate-enter' : 'animate-leave'
      } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
    >
      <div className="flex-1 w-0 p-4">
        <div className="flex items-start">
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-gray-900">
              {name}
            </p>
            <p className="mt-1 text-sm text-gray-500">
              {message}
            </p>
          </div>
        </div>
      </div>
      <div className="flex border-l border-gray-200">
        <button
          onClick={() => {toast.dismiss(t.id);onAccept();cancelTimeout()}} 
          className="w-full border border-transparent rounded-none rounded-l-lg p-4 flex items-center justify-center text-sm font-medium text-green-600 hover:text-green-500"
        >
          Join 
        </button>
      </div>
      <div className="flex border-l border-gray-200">
        <button
          onClick={() =>{ toast.dismiss(t.id);onReject();cancelTimeout()}} 
          className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-red-600 hover:text-red-500 "
        >
          Ignore
        </button>
      </div>
    </div>
  )}, {
    duration: 10000,  // This sets the toast duration to 10 seconds
  });
}
