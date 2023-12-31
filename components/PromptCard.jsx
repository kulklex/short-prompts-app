"use client"

import  { useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";


export default function PromptCard({post, handleEdit, handleDelete, handleTagClick}) {
  const { data: session } = useSession();
  const pathName = usePathname();
  const router = useRouter();
  
  const [copied, setCopied] = useState("")
  
  const handleProfileClick = () => {
    if (post?.creator?._id === session?.user.id) return router.push("/profile")
    router.push(`/profile/${post?.creator?._id}?name=${post?.creator?.username}`)
  }

  const handleCopy = () => {
    setCopied(post?.prompt);
    navigator.clipboard.writeText(post?.prompt);
    setTimeout(() => setCopied(false), 3000);
  };

  const arrangedTag = (tag) => {
    let tagData = tag.toString()
    let arrayTag = tagData.split(',')
    return arrayTag.map((tags) => (
      <p key={tags} className="font-inter flex flex-row space-x-1 text-sm blue_gradient cursor-pointer"
      onClick={() => handleTagClick && handleTagClick(tags)}
    >
      #{tags} 
    </p>
    ))
  }
  
  
  // onClick={router.push(`/prompts/${post?._id}`)}
  
  return (
    <div className="prompt_card">
      <div className="flex justify-between items-start gap-5">
        <div className="flex-1 flex justify-start items-center gap-3 cursor-pointer"
          onClick={handleProfileClick}
        >
          <Image 
            src={post?.creator?.image}
            alt="user-image"
            width={40}
            height={40}
            className="rounded-full object-contain"
          />

          <div className="flex flex-col">
            <h3 className='font-satoshi font-semibold text-gray-900'>
              {post?.creator?.username}
            </h3>
            <p className='font-inter text-sm text-gray-500'>
              {post?.creator?.email}
            </p>
          </div>
        </div>

        <div className="copy_btn" onClick={handleCopy}>
          <Image
            src={
              copied === post?.prompt
                ? "/icons/tick.svg"
                : "/icons/copy.svg"
            }
            alt={copied === post?.prompt ? "tick_icon" : "copy_icon"}
            width={12}
            height={12}
          />
        </div>
      </div>

      <div 
       className="my-4 font-satoshi text-sm text-gray-700"
      >
        {post?.prompt}
      </div>
      
      <div className="flex">
        {arrangedTag(post.tag)}
      </div>


      {session?.user.id === post?.creator?._id && pathName === "/profile" && (
        <div className='mt-5 flex-center gap-4 border-t border-gray-100 pt-3'>
          <p
            className='font-inter text-sm green_gradient cursor-pointer'
            onClick={handleEdit}
          >
            <Image src="./icons/edit.svg" alt="edit" className='font-inter text-sm green_gradient cursor-pointer' width={12} height={12} />
          </p>
          <p
            className='font-inter text-sm orange_gradient cursor-pointer'
            onClick={handleDelete}
          >
            Delete
          </p>
        </div>
      )}
    </div>
  )
}
