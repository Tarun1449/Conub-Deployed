import React from 'react'

const Message = (   ) => {
  return (
    <>
        <div class="flex items-start gap-2.5">
        <div class="flex flex-col w-full max-w-[320px] leading-1.5 p-4 border-gray-200 bg-gray-100 rounded-e-xl rounded-es-xl dark:bg-gray-700">
            <div class="flex items-center space-x-2 rtl:space-x-reverse">
                <span class="text-sm font-normal text-gray-500 dark:text-gray-400">11:46</span>
            </div>
            <p class="text-sm font-normal py-2.5 text-gray-900 dark:text-white">
                {Message}
            </p>
            {/* <span class="text-sm font-normal text-gray-500 dark:text-gray-400">Delivered</span> */}
        </div>        
        </div>

    </>
  )
}

export default Message