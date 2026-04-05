import { useEffect, useState } from "react";
import api from "../api/axios";
import { Grid, Image as ImageIcon, AlignLeft, Heart, Repeat, UserPlus, UserMinus, FileText } from "lucide-react";

export default function Profile({ userId, openDirectMessage }) {
  const [profile,setProfile] = useState(null);
  const [activeTab, setActiveTab] = useState("all"); 
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editBio, setEditBio] = useState("");

  useEffect(()=>{
    const loadProfile = async()=>{
      let res;
      if(userId){
        res = await api.get(`/profile/${userId}`);
      }else{
        res = await api.get("/profile/me");
      }
      setProfile(res.data);
      if(!userId && res.data?.user) {
        setEditName(res.data.user.realName || "");
        setEditBio(res.data.user.bio || "");
      }
    };
    loadProfile();
  },[userId]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await api.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      const imageUrl = res.data.imageUrl;
      const updateRes = await api.put("/profile", { avatar: imageUrl });
      setProfile({ ...profile, user: updateRes.data });
    } catch (err) {
      console.error("Error uploading image", err);
    }
  };

  const saveProfile = async () => {
    try {
      const res = await api.put("/profile", { realName: editName, bio: editBio });
      setProfile({ ...profile, user: res.data });
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to update profile", err);
    }
  };

  // FOLLOW USER
  const followUser = async()=>{
    try {
      await api.post(`/follow/${profile.user._id}`);
      setProfile({
        ...profile,
        isFollowing:true,
        followersCount:profile.followersCount+1
      });
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to follow user");
    }
  };

  // UNFOLLOW USER
  const unfollowUser = async()=>{
    try {
      await api.delete(`/follow/${profile.user._id}`);
      setProfile({
        ...profile,
        isFollowing:false,
        followersCount:profile.followersCount-1
      });
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to unfollow user");
    }
  };

  if(!profile) return (
    <div className="flex justify-center items-center h-64">
      <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  const imagesOnly = profile.posts.filter((p) => p.image);
  const textOnly = profile.posts.filter((p) => !p.image);
  
  const displayPosts = activeTab === "all" ? profile.posts : activeTab === "images" ? imagesOnly : textOnly;

  return(
    <div className="max-w-4xl mx-auto text-white flex flex-col gap-8 pb-20">
      
      {/* PROFILE HEADER (GLASS CARD) */}
      <div className="glass-panel p-8 relative overflow-hidden">
        {/* Glow behind avatar */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-accentGlow blur-[60px] rounded-full pointer-events-none"></div>

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10 w-full">
          <label className={`w-28 h-28 sm:w-32 sm:h-32 bg-borderBase border-2 border-accent/50 rounded-full flex items-center justify-center text-4xl font-bold shrink-0 shadow-glow overflow-hidden ${!userId ? 'cursor-pointer hover:border-accent transition-colors' : ''}`}>
            {profile.user.avatar ? (
              <img src={profile.user.avatar} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              profile.user.username.charAt(0).toUpperCase()
            )}
            {!userId && (
              <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
            )}
          </label>

          <div className="flex-1 w-full min-w-0 pt-2 flex flex-col gap-5 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
              <div className="min-w-0">
                {isEditing ? (
                  <div className="flex flex-col gap-3 mb-4 max-w-sm">
                    <input 
                      type="text" 
                      className="glass-input py-2 px-3 text-sm" 
                      value={editName} 
                      onChange={e => setEditName(e.target.value)} 
                      placeholder="Your Name"
                    />
                    <textarea 
                      className="glass-input py-2 px-3 text-sm resize-none" 
                      value={editBio} 
                      onChange={e => setEditBio(e.target.value)} 
                      placeholder="Your Bio"
                      rows={2}
                    />
                    <div className="flex gap-2 mt-1">
                      <button onClick={saveProfile} className="btn-primary py-1.5 px-4 text-xs">Save</button>
                      <button onClick={() => setIsEditing(false)} className="btn-outline py-1.5 px-4 text-xs font-semibold">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h2 className="text-3xl font-extrabold flex flex-col sm:flex-row sm:items-baseline gap-2 mb-2">
                      <span className="truncate">{profile.user.realName}</span>
                      <span className="text-accent text-lg font-normal drop-shadow-[0_0_10px_rgba(6,182,212,0.4)] truncate">@{profile.user.username}</span>
                    </h2>
                    <p className="text-gray-300 max-w-md mx-auto sm:mx-0 truncate">
                      {profile.user.bio || "No bio yet."}
                    </p>
                  </>
                )}
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex shrink-0 flex-wrap justify-center sm:justify-start gap-3">
                {userId ? (
                  <>
                    <button
                      onClick={() => openDirectMessage && openDirectMessage(userId)}
                      className="px-5 py-2 rounded-xl bg-surface border border-accent/50 text-accent hover:bg-accent hover:text-black flex items-center gap-2 transition font-semibold text-sm"
                    >
                      Message
                    </button>
                    {profile.isFollowing ? (
                      <button
                        onClick={unfollowUser}
                        className="px-5 py-2 rounded-xl border border-gray-600 text-gray-300 flex items-center gap-2 hover:bg-white/5 transition text-sm"
                      >
                        <UserMinus size={16} />
                        Unfollow
                      </button>
                    ) : (
                      <button
                        onClick={followUser}
                        className="btn-primary py-2 px-5 flex items-center gap-2 text-sm"
                      >
                        <UserPlus size={16} />
                        Follow
                      </button>
                    )}
                  </>
                ) : (
                  !isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-5 py-2 rounded-xl bg-surface border border-white/20 text-white hover:bg-white/10 flex items-center gap-2 transition font-semibold text-sm"
                    >
                      Edit Profile
                    </button>
                  )
                )}
              </div>
            </div>

            <div className="flex justify-center sm:justify-start gap-6 text-gray-300 font-medium bg-black/20 p-4 rounded-xl w-max border border-white/5 mx-auto sm:mx-0">
              <div className="flex flex-col items-center">
                <span className="text-xl font-bold text-white">{profile.posts.length}</span>
                <span className="text-[10px] uppercase tracking-wider text-gray-500">Posts</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-xl font-bold text-white">{profile.followersCount}</span>
                <span className="text-[10px] uppercase tracking-wider text-gray-500">Followers</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-xl font-bold text-white">{profile.followingCount}</span>
                <span className="text-[10px] uppercase tracking-wider text-gray-500">Following</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TABS */}
      <div className="flex justify-center md:justify-start border-b border-borderBase px-2">
        <button 
          onClick={() => setActiveTab("all")}
          className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-all ${activeTab === 'all' ? 'border-accent text-accent' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
        >
          <Grid size={18} />
          All
        </button>
        <button 
          onClick={() => setActiveTab("images")}
          className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-all ${activeTab === 'images' ? 'border-accent text-accent' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
        >
          <ImageIcon size={18} />
          Images
        </button>
        <button 
          onClick={() => setActiveTab("text")}
          className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-all ${activeTab === 'text' ? 'border-accent text-accent' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
        >
          <AlignLeft size={18} />
          Text
        </button>
      </div>

      {/* POSTS RENDER */}
      {displayPosts.length === 0 ? (
        <div className="text-center py-20 text-gray-500 flex flex-col items-center gap-3">
          <FileText size={48} className="opacity-20" />
          <p>No posts to display in this category.</p>
        </div>
      ) : (
        <div className={activeTab === "images" || activeTab === "all" ? "grid grid-cols-2 md:grid-cols-3 gap-4" : "flex flex-col gap-4"}>
          {displayPosts.map(post => (
            activeTab === "text" || (!post.image && activeTab === "all") ? (
              // TWEET STYLE FOR TEXT POSTS
              <div key={post._id} className="glass-panel p-5 transition-all duration-300 hover:shadow-glow hover:-translate-y-1">
                <p className="text-gray-200 text-lg leading-relaxed mb-4">{post.content}</p>
                <div className="flex gap-6 text-gray-500 text-sm">
                  <div className="flex items-center gap-2"><Heart size={16} /> {post.likes?.length || 0}</div>
                  <div className="flex items-center gap-2"><Repeat size={16} /> {post.shares || 0}</div>
                </div>
              </div>
            ) : (
              // GRID STYLE FOR IMAGE POSTS
              <div key={post._id} className="bg-black/20 border border-borderBase aspect-square rounded-2xl overflow-hidden relative group cursor-pointer shadow-lg hover:shadow-glow transition-all hover:-translate-y-1">
                {post.image ? (
                  <img src={post.image} className="w-full h-full object-cover" alt="Post" />
                ) : (
                  <div className="w-full h-full flex flex-col justify-between p-5 bg-gradient-to-br from-surface to-black text-white/80">
                    <p className="text-sm line-clamp-5 overflow-hidden">{post.content}</p>
                  </div>
                )}
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-8 text-white font-bold pointer-events-none">
                  <div className="flex flex-col items-center gap-2">
                    <Heart size={24} className={post.likes?.length > 0 ? "fill-pink-500 text-pink-500" : ""} />
                    <span>{post.likes?.length || 0}</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <Repeat size={24} className={post.shares > 0 ? "text-green-500" : ""} />
                    <span>{post.shares || 0}</span>
                  </div>
                </div>
              </div>
            )
          ))}
        </div>
      )}

    </div>
  );
}