export default function PostCard({post}){

  return(
  
  <div className="bg-[#121212] border border-[#1E293B] rounded-xl p-5">
  
  <div className="flex items-center gap-3 mb-3">
  
  <div className="w-10 h-10 rounded-full bg-cyan-500 flex items-center justify-center font-bold">
  {post.username.charAt(0).toUpperCase()}
  </div>
  
  <p className="font-semibold">
  {post.username}
  </p>
  
  </div>
  
  <p className="text-gray-200 mb-3">
  {post.content}
  </p>
  
  <div className="flex gap-6 text-gray-400">
  
  <span>❤️ {post.likes}</span>
  
  <span>💬 {post.comments}</span>
  
  </div>
  
  </div>
  
  )
  }