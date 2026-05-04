import { useState, useEffect } from 'react'
import axiosClient from './api/axiosClient'
import './App.css'

const samplePosts = [
  {
    _id: 'sample1',
    title: '✨ Welcome to We Meet Social!',
    content: 'Join our vibrant community of creators, artists, and innovators. Share your ideas, connect with like-minded people, and build meaningful relationships.',
    author: { username: 'admin' },
    createdAt: '2026-04-28T12:00:00Z',
    image_url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=300&fit=crop',
    tags: ['welcome', 'community'],
    like_count: 342,
    comment_count: 28,
  },
  {
    _id: 'sample2',
    title: '🎨 Design Inspiration: Minimal Aesthetic',
    content: 'Exploring the beauty of minimalism in modern design. Less is more! These clean, simple designs prove that elegance comes from simplicity.',
    author: { username: 'designer_pro' },
    createdAt: '2026-04-27T12:00:00Z',
    image_url: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&h=300&fit=crop',
    tags: ['design', 'inspiration', 'minimal'],
    like_count: 521,
    comment_count: 45,
  },
  {
    _id: 'sample3',
    title: '🌍 Travel Chronicles: Exploring Hidden Gems',
    content: 'Just returned from an amazing journey discovering hidden gems off the beaten path. Every corner holds a story waiting to be discovered!',
    author: { username: 'travel_buddy' },
    createdAt: '2026-04-26T12:00:00Z',
    image_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop',
    tags: ['travel', 'adventure', 'nature'],
    like_count: 789,
    comment_count: 67,
  },
  {
    _id: 'sample4',
    title: '📱 Tech Trends 2024: The Future is Now',
    content: 'Cutting-edge technology is reshaping how we interact with the world. AI, blockchain, and quantum computing are just the beginning!',
    author: { username: 'tech_innovator' },
    createdAt: '2026-04-25T12:00:00Z',
    image_url: 'https://i.pinimg.com/736x/8a/08/aa/8a08aa3f12b77a52c91a6a8cfecccf58.jpg',
    tags: ['tech', 'innovation', 'future'],
    like_count: 643,
    comment_count: 82,
  },

  {
    _id: 'sample5',
    title: '🍳 Culinary Delights: Mastering the Art of Cooking',
    content: 'Discover the secrets of culinary excellence with our expert tips and tricks. From technique to presentation, elevate your cooking skills to new heights!',
    author: { username: 'culinary_expert' },
    createdAt: '2026-04-24T12:00:00Z',
    image_url: 'https://i.pinimg.com/736x/55/a6/a2/55a6a27ab4c21174a4456a619dfebd22.jpg',
    tags: ['cooking', 'culinary', 'recipes'],
    like_count: 456,
    comment_count: 100,
  },

  {
    _id: 'sample6',
    title: '🎬 Movie Magic: Behind the Scenes of Filmmaking',
    content: 'Get an exclusive look at the magic behind your favorite films. From pre-production to post-production, discover the secrets that make movies come alive.',
    author: { username: 'funke Akindele' },
    createdAt: '2026-04-23T12:00:00Z',
    image_url: 'https://i.pinimg.com/736x/8e/44/cb/8e44cbe22717fbf23a7af51b12d12cba.jpg',
    tags: ['movies', 'entertainment', 'behind-the-scenes'],
    like_count: 678,
    comment_count: 100,
  },

  {
    _id:'sample7',
    title: 'career advice: Navigating the modern job market',
    content: 'In today’s rapidly changing job market, adaptability and continuous learning are key. Discover strategies for career growth and success in the modern workplace.',
    author: { username: 'career_guru' },
    createdAt: '2026-04-22T12:00:00Z',
    image_url: 'https://i.pinimg.com/736x/e2/47/50/e247507c01fb1c85c953a8398c171f48.jpg',
    tags: ['career', 'job market', 'advice'],
    like_count: 321,
    comment_count: 50,
  },

  {
    _id: 'sample8',
    title: 'alt school.ng: Empowering the Next Generation of Tech Talent',
    content: 'Alt School.ng is revolutionizing tech education in Nigeria with its innovative curriculum and hands-on approach. Discover how they are shaping the future of tech talent. <a href="https://www.altschoolafrica.com/" target="_blank" rel="noopener noreferrer">Click here to learn more about Alt School.ng</a>',
    author: { username: 'tech_educator' },
    createdAt: '2026-04-21T12:00:00Z',
    image_url: 'https://tse2.mm.bing.net/th/id/OIP.L9NbGD_clzer6EqmvHi_8wHaHa?rs=1&pid=ImgDetMain&o=7&rm=3',
    tags: ['education', 'tech', 'Nigeria'],
    like_count: 432,
    comment_count: 60,
  }

]
function App() {
  const [mode, setMode] = useState('auth')
  const [authMode, setAuthMode] = useState('login')
  const [page, setPage] = useState('feed')
  const [selectedPost, setSelectedPost] = useState(null)
  const [form, setForm] = useState({
    emailOrUsername: '',
    password: '',
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    birthday: '',
    gender: 'other',
  })
  const [profileForm, setProfileForm] = useState({
    bio: '',
    location: '',
    website: '',
    avatar: null,
  })
  const [postForm, setPostForm] = useState({ title: '', content: '', tags: '', image: null, file: null, imagePreview: null })
  const [user, setUser] = useState(null)
  const [feedPosts, setFeedPosts] = useState([])
  const [myPosts, setMyPosts] = useState([])
  const [users, setUsers] = useState([])
  const [following, setFollowing] = useState([])
  const [followers, setFollowers] = useState([])
  const [notifications, setNotifications] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [theme, setTheme] = useState('dark')

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme')
    if (storedTheme === 'light' || storedTheme === 'dark') {
      setTheme(storedTheme)
    }
  }, [])

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      loadInitialData()
    } else {
      // Check for shared post link
      const hash = window.location.hash
      if (hash.startsWith('#post/')) {
        const postId = hash.substring(6) // Remove '#post/'
        if (postId) {
          // Set mode to app and load the post after mount
          setTimeout(() => {
            setMode('app')
            setPage('post-detail')
            fetchPostDetail(postId)
          }, 0)
          return
        }
      }
      setMode('app')
      setPage('feed')
      loadPublicFeed()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  async function loadPublicFeed() {
    try {
      const response = await axiosClient.get('/posts')
      setFeedPosts(response.data.posts || [])
    } catch {
      setStatusMessage('Unable to load public feed.')
    }
  }

  async function loadInitialData() {
    try {
      const [profileResponse] = await Promise.all([axiosClient.get('/profile/profile')])
      const responseUser = profileResponse.data
      setUser(responseUser)
      setProfileForm((current) => ({
        ...current,
        bio: responseUser.bio || '',
        location: responseUser.location || '',
        website: responseUser.website || '',
      }))
      localStorage.setItem('user', JSON.stringify(responseUser))
      setMode('app')
      setPage('feed')
      await Promise.all([fetchFollowers(), fetchFollowing(), fetchNotifications()])
      loadFeed()
    } catch {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      setMode('auth')
      setMessage('Session expired. Please log in again.')
    }
  }

  const setStatusMessage = (text) => {
    setMessage(text)
    if (text) {
      setTimeout(() => setMessage(''), 4000)
    }
  }

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(nextTheme)
    localStorage.setItem('theme', nextTheme)
  }

  const readFileAsDataUrl = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handlePostChange = (event) => {
    const { name, value, files } = event.target
    if (name === 'image') {
      const imageFile = files?.[0] || null
      setPostForm((current) => {
        if (current.imagePreview) URL.revokeObjectURL(current.imagePreview)
        return {
          ...current,
          image: imageFile,
          imagePreview: imageFile ? URL.createObjectURL(imageFile) : null,
        }
      })
      return
    }
    if (name === 'file') {
      setPostForm((current) => ({ ...current, file: files?.[0] || null }))
      return
    }
    setPostForm((current) => ({ ...current, [name]: value }))
  }

  const removeImage = () => {
    setPostForm((current) => {
      if (current.imagePreview) URL.revokeObjectURL(current.imagePreview)
      return {
        ...current,
        image: null,
        imagePreview: null,
      }
    })
  }

  const handleProfileChange = (event) => {
    const { name, value } = event.target
    setProfileForm((current) => ({ ...current, [name]: value }))
  }

  const handleAvatarChange = (event) => {
    const avatarFile = event.target.files?.[0] || null
    setProfileForm((current) => ({ ...current, avatar: avatarFile }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const payload =
        authMode === 'login'
          ? {
              emailOrUsername: form.emailOrUsername,
              password: form.password,
            }
          : {
              first_name: form.first_name,
              last_name: form.last_name,
              username: form.username,
              email: form.email,
              password: form.password,
              birthday: form.birthday,
              gender: form.gender,
            }

      const response = await axiosClient.post(`/auth/${authMode}`, payload)
      const { token, user: responseUser } = response.data
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(responseUser))
      setUser(responseUser)
      setProfileForm((current) => ({
        ...current,
        bio: responseUser.bio || '',
        location: responseUser.location || '',
        website: responseUser.website || '',
      }))
      setMode('app')
      setPage('feed')
      setForm({
        emailOrUsername: '',
        password: '',
        first_name: '',
        last_name: '',
        username: '',
        email: '',
        birthday: '',
        gender: 'other',
      })
      loadFeed()
    } catch (error) {
      setMessage(error.response?.data?.error || 'Unable to submit. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    setFeedPosts([])
    setMyPosts([])
    setUsers([])
    setFollowing([])
    setFollowers([])
    setMode('app')
    setPage('feed')
    setAuthMode('login')
    setForm({
      emailOrUsername: '',
      password: '',
      first_name: '',
      last_name: '',
      username: '',
      email: '',
      birthday: '',
      gender: 'other',
    })
    loadPublicFeed()
  }

  const loadFeed = async () => {
    try {
      const response = await axiosClient.get('/posts/feed')
      setFeedPosts(response.data.posts || [])
    } catch {
      setStatusMessage('Unable to load feed.')
    }
  }

  const fetchMyPosts = async () => {
    try {
      const response = await axiosClient.get('/posts/my/posts')
      setMyPosts(response.data.posts || [])
    } catch {
      setStatusMessage('Unable to load your posts.')
    }
  }

  const fetchUsers = async () => {
    try {
      const response = await axiosClient.get('/users')
      setUsers(response.data || [])
    } catch {
      setStatusMessage('Unable to load users.')
    }
  }

  const fetchFollowing = async () => {
    try {
      const response = await axiosClient.get('/follows/following')
      setFollowing(response.data || [])
    } catch {
      setStatusMessage('Unable to load following list.')
    }
  }

  const fetchFollowers = async () => {
    try {
      const response = await axiosClient.get('/follows/followers')
      setFollowers(response.data || [])
    } catch {
      setStatusMessage('Unable to load followers list.')
    }
  }

  const fetchNotifications = async () => {
    try {
      const response = await axiosClient.get('/profile/notifications')
      const notificationList = response.data || []
      setNotifications(notificationList)
      const unreadFollowCount = notificationList.filter((note) => !note.read && note.type === 'follow').length
      if (unreadFollowCount > 0) {
        setStatusMessage(`You have ${unreadFollowCount} new follower${unreadFollowCount > 1 ? 's' : ''}.`)
      }
    } catch {
      setStatusMessage('Unable to load notifications.')
    }
  }

  async function fetchPostDetail(postId) {
    try {
      const response = await axiosClient.get(`/posts/${postId}`)
      setSelectedPost(response.data)
      setPage('post-detail')
    } catch {
      setStatusMessage('Unable to load post.')
    }
  }

  const handlePageChange = async (newPage) => {
    setPage(newPage)
    setMessage('')
    setSelectedPost(null)

    if (newPage === 'feed') {
      if (user) {
        loadFeed()
      } else {
        loadPublicFeed()
      }
    }
    if (newPage === 'create') {
      setPostForm({ title: '', content: '', tags: '', image: null, file: null })
    }
    if (newPage === 'my') {
      fetchMyPosts()
    }
    if (newPage === 'profile') {
      setProfileForm((current) => ({
        ...current,
        bio: user?.bio || '',
        location: user?.location || '',
        website: user?.website || '',
      }))
      fetchFollowers()
      fetchFollowing()
      fetchNotifications()
    }
    if (newPage === 'users') {
      fetchUsers()
      fetchFollowing()
    }
    if (newPage === 'following') {
      fetchFollowing()
    }
    if (newPage === 'followers') {
      fetchFollowers()
    }
  }

  const handleCreatePost = async (event) => {
    event.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const imageDataUrl = postForm.image ? await readFileAsDataUrl(postForm.image) : null
      const payload = {
        title: postForm.title,
        content: postForm.content,
        tags: postForm.tags ? postForm.tags.split(',').map((tag) => tag.trim()) : [],
        image: imageDataUrl,
        file: postForm.file ? postForm.file.name : null,
        state: 'published',
      }
      const response = await axiosClient.post('/posts', payload)
      const savedPost = response.data
      const newPost = {
        ...savedPost,
        author: savedPost.author || { username: user?.username, first_name: user?.first_name, last_name: user?.last_name },
        image_url: imageDataUrl || savedPost.image_url,
      }
      setFeedPosts((current) => [newPost, ...current])
      setPostForm({ title: '', content: '', tags: '', image: null, file: null, imagePreview: null })
      setStatusMessage('Post uploaded successfully.')
      fetchMyPosts()
      setPage('feed')
    } catch (error) {
      setMessage(error.response?.data?.error || 'Unable to upload post.')
    } finally {
      setLoading(false)
    }
  }

  const handleProfileSave = async (event) => {
    event.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const payload = {
        bio: profileForm.bio,
        location: profileForm.location,
        website: profileForm.website,
        avatar: profileForm.avatar ? profileForm.avatar.name : null,
      }
      const response = await axiosClient.put('/profile', payload)
      const updatedUser = response.data
      setUser(updatedUser)
      localStorage.setItem('user', JSON.stringify(updatedUser))
      setStatusMessage('Profile updated successfully.')
    } catch (error) {
      setMessage(error.response?.data?.error || 'Unable to save profile.')
    } finally {
      setLoading(false)
    }
  }

  const handlePublishPost = async (id) => {
    try {
      await axiosClient.put(`/posts/${id}/state`, { state: 'published' })
      setStatusMessage('Post published successfully.')
      fetchMyPosts()
      loadFeed()
      if (page === 'post-detail' && selectedPost?._id === id) {
        fetchPostDetail(id)
      }
    } catch (error) {
      setMessage(error.response?.data?.error || 'Unable to publish post.')
    }
  }

  const handleEditPost = async (post) => {
    const title = window.prompt('Edit title', post.title)
    if (title === null) return
    const content = window.prompt('Edit content', post.content)
    if (content === null) return

    try {
      await axiosClient.put(`/posts/${post._id}`, {
        title,
        content,
        tags: post.tags,
      })
      setStatusMessage('Post updated successfully.')
      fetchMyPosts()
      loadFeed()
      if (page === 'post-detail' && selectedPost?._id === post._id) {
        fetchPostDetail(post._id)
      }
    } catch (error) {
      setMessage(error.response?.data?.error || 'Unable to update post.')
    }
  }
  const handleDeletePost = async (id) => {
    if (!window.confirm('Delete this post?')) return
    try {
      await axiosClient.delete(`/posts/${id}`)
      setStatusMessage('Post deleted.')
      fetchMyPosts()
      loadFeed()
      if (page === 'post-detail' && selectedPost?._id === id) {
        handlePageChange('feed')
      }
    } catch (error) {
      setMessage(error.response?.data?.error || 'Unable to delete post.')
    }
  }

  const handleLike = async (post) => {
    try {
      await axiosClient.post(`/posts/${post._id}/like`)
      setStatusMessage('Post liked.')
      loadFeed()
      fetchMyPosts()
      if (page === 'post-detail' && selectedPost?._id === post._id) {
        fetchPostDetail(post._id)
      }
    } catch (error) {
      setMessage(error.response?.data?.error || 'Unable to like post.')
    }
  }

  const handleFollow = async (userId) => {
    try {
      await axiosClient.post(`/follows/${userId}`)
      setStatusMessage('Now following this user.')
      fetchFollowing()
      fetchNotifications()
    } catch (error) {
      setMessage(error.response?.data?.error || 'Unable to follow user.')
    }
  }

  const handleUnfollow = async (userId) => {
    try {
      await axiosClient.delete(`/follows/${userId}`)
      setStatusMessage('Unfollowed the user.')
      fetchFollowing()
      fetchFollowers()
    } catch (error) {
      setMessage(error.response?.data?.error || 'Unable to unfollow user.')
    }
  }

  const handleShare = async (post) => {
    const url = `${window.location.origin}${window.location.pathname}#post/${post._id}`
    try {
      await navigator.clipboard.writeText(url)
      setStatusMessage('Post link copied to clipboard.')
    } catch {
      setMessage('Unable to copy link. Please copy manually.')
    }
  }

  const filteredUsers = users.filter((entry) =>
    entry.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.last_name?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const isFollowing = (userId) => following.some((userItem) => userItem._id === userId)

  const renderPostCard = (post, isMyPost = false) => (
    <div key={post._id} className="post-card">
      <div className="post-header">
        <h3>{post.title}</h3>
        <small>
          By <strong>{post.author?.username}</strong> • {new Date(post.createdAt).toLocaleDateString()}
        </small>
      </div>
      
      <p dangerouslySetInnerHTML={{ __html: post.content }}></p>
      
      {post.image_url && (
        <div className="post-card-image">
          <img src={post.image_url} alt={post.title} />
        </div>
      )}
      
      <div className="tags">
        {post.tags?.map((tag) => <span key={tag} className="tag">#{tag}</span>)}
      </div>
      
      {post.file_name && (
        <div className="post-attachment">
          <strong>📎 File:</strong> {post.file_name}
        </div>
      )}
      
      <div className="post-actions">
        <span>❤️ {post.like_count || 0}</span>
        <span>💬 {post.comment_count || 0}</span>
        <button type="button" className="secondary-button" onClick={() => fetchPostDetail(post._id)}>
          View
        </button>
        <button type="button" className="secondary-button" onClick={() => handleShare(post)}>
          Share
        </button>
        <button type="button" className="secondary-button" onClick={() => handleLike(post)}>
          Like
        </button>
        {isMyPost && (
          <>
            <button type="button" className="secondary-button" onClick={() => handleEditPost(post)}>
              Edit
            </button>
            <button type="button" className="secondary-button" onClick={() => handleDeletePost(post._id)}>
              Delete
            </button>
            {post.state === 'draft' && (
              <button
                type="button"
                className="secondary-button"
                onClick={() => handlePublishPost(post._id)}
              >
                Publish
              </button>
            )}
          </>
        )}
      </div>
    </div>
  )

  return (
    <div className={`app-shell ${mode === 'app' ? `theme-${theme}` : ''}`}>
      {mode === 'auth' ? (
        <div className="auth-page">
          <section className="auth-side">
            <div className="auth-brand">
              <div className="brand-logo">
                <div className="logo-mark">WMS</div>
                <div>
                  <p className="brand-name">We Meet Social</p>
                  <span className="brand-tagline">Your community, beautifully connected.</span>
                </div>
              </div>
              <span className="eyebrow">Welcome to</span>
              <h1>We Meet Social</h1>
              <p>Connect with creators, build your network, and share your story in a beautiful, modern space.</p>
              <ul className="auth-highlights">
                <li>Fast, secure authentication</li>
                <li>Personalized feed and profile</li>
                <li>Follow people and stay inspired</li>
                <li>Share your ideas with the world</li>
                <li>News and trnding updates</li>
              </ul>
            </div>
          </section>

          <section className="auth-card-wrapper">
            <div className="card">
              <header className="app-title">
                <h2>{authMode === 'login' ? 'Welcome back' : 'Create your account'}</h2>
                <p>
                  {authMode === 'login'
                    ? 'Login to continue to your personalized social dashboard.'
                    : 'Start your journey with We Meet Social in just a few steps.'}
                </p>
              </header>

              <form className="auth-form" onSubmit={handleSubmit}>
            {authMode === 'login' ? (
              <>
                <label>
                  Email or Username
                  <input
                    name="emailOrUsername"
                    value={form.emailOrUsername}
                    onChange={handleChange}
                    required
                  />
                </label>
                <label>
                  Password
                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    required
                  />
                </label>
              </>
            ) : (
              <>
                <label>
                  Username
                  <input
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    required
                  />
                </label>
                <label>
                  Password
                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    required
                  />
                </label>
                <label>
                  First name
                  <input
                    name="first_name"
                    value={form.first_name}
                    onChange={handleChange}
                    required
                  />
                </label>
                <label>
                  Last name
                  <input
                    name="last_name"
                    value={form.last_name}
                    onChange={handleChange}
                    required
                  />
                </label>
                <label>
                  Email
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </label>
                <label>
                  Birthday
                  <input
                    type="date"
                    name="birthday"
                    value={form.birthday}
                    onChange={handleChange}
                  />
                </label>
                <label>
                  Gender
                  <select name="gender" value={form.gender} onChange={handleChange}>
                    <option value="other">Other</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </label>
              </>
            )}

            {message && <div className="message">{message}</div>}
            <div className="bottom-tabs">
              <button type="submit" className="action-button" disabled={loading}>
                {loading ? 'Please wait...' : authMode === 'login' ? 'Login' : 'Create account'}
              </button>
              <button
                type="button"
                className="secondary-button"
                onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
              >
                {authMode === 'login' ? 'Sign Up' : 'Back to Login'}
              </button>
            </div>
          </form>
        </div>
          </section>
        </div>
      ) : (
        <div className="feed">
          <header className="feed-header">
            <h1>We Meet Social</h1>
            <div className="user-info">
              <span>{user ? `Welcome, ${user.first_name}!` : 'Welcome, guest!'}</span>
              {user && (
                <button type="button" className="theme-toggle secondary-button" onClick={toggleTheme}>
                  {theme === 'dark' ? 'Light mode' : 'Dark mode'}
                </button>
              )}
              {user ? (
                <button type="button" className="logout-button" onClick={handleLogout}>
                  Logout
                </button>
              ) : (
                <button type="button" className="secondary-button" onClick={() => setMode('auth')}>
                  Login / Sign up
                </button>
              )}
            </div>
          </header>

          <div className="dashboard-nav">
            <button className={page === 'feed' ? 'active' : ''} onClick={() => handlePageChange('feed')}>
              Feed
            </button>
            {user && (
              <>
                <button className={page === 'create' ? 'active' : ''} onClick={() => handlePageChange('create')}>
                  Create Post
                </button>
                <button className={page === 'my' ? 'active' : ''} onClick={() => handlePageChange('my')}>
                  My Posts
                </button>
                <button className={page === 'profile' ? 'active' : ''} onClick={() => handlePageChange('profile')}>
                  Profile
                </button>
                <button className={page === 'users' ? 'active' : ''} onClick={() => handlePageChange('users')}>
                  Users
                </button>
                <button className={page === 'following' ? 'active' : ''} onClick={() => handlePageChange('following')}>
                  Following
                </button>
                <button className={page === 'followers' ? 'active' : ''} onClick={() => handlePageChange('followers')}>
                  Followers
                </button>
              </>
            )}
          </div>

          {message && <div className="message">{message}</div>}

          {page === 'feed' && (
            <div className="dashboard-content">
              <h2>Feed</h2>
              {!user && (
                <div className="guest-banner">
                  <p>
                    Browsing public posts. Login to create posts, follow users, and access your personalized feed.
                  </p>
                </div>
              )}
              {feedPosts.length === 0 ? (
                <div>
                  <p style={{ marginBottom: '24px', color: '#e2e8f0', textAlign: 'center' }}>
                    📌 No posts in your feed yet. Here are some sample posts to inspire you!
                  </p>
                  {samplePosts.map((post) => renderPostCard(post))}
                </div>
              ) : (
                feedPosts.map((post) => renderPostCard(post))
              )}
            </div>
          )}

          {page === 'create' && (
            <div className="dashboard-content">
              <h2>Create Post</h2>
              <form className="auth-form" onSubmit={handleCreatePost}>
                <label>
                  Title
                  <input name="title" value={postForm.title} onChange={handlePostChange} required />
                </label>
                <label>
                  Content
                  <textarea name="content" value={postForm.content} onChange={handlePostChange} required rows={6} />
                </label>
                <label>
                  Tags (comma separated)
                  <input name="tags" value={postForm.tags} onChange={handlePostChange} />
                </label>
                <label>
                  Post Image
                  <input type="file" name="image" accept="image/*" onChange={handlePostChange} />
                </label>
                {postForm.imagePreview && (
                  <div className="post-upload-preview">
                    <img src={postForm.imagePreview} alt="Post preview" />
                    <button type="button" className="remove-button" onClick={removeImage}>
                      Remove Image
                    </button>
                  </div>
                )}
                {postForm.image && (
                  <div className="upload-preview">
                    <strong>Image selected:</strong> {postForm.image.name}
                  </div>
                )}
                <label>
                  Attach File
                  <input type="file" name="file" onChange={handlePostChange} />
                </label>
                {postForm.file && (
                  <div className="upload-preview">
                    <strong>File selected:</strong> {postForm.file.name}
                  </div>
                )}
                <button type="submit" className="action-button" disabled={loading}>
                  {loading ? 'Uploading...' : 'Upload Post'}
                </button>
              </form>
            </div>
          )}

          {page === 'my' && (
            <div className="dashboard-content">
              <h2>My Posts</h2>
              {myPosts.length === 0 ? (
                <p>No posts yet. Create one to get started.</p>
              ) : (
                myPosts.map((post) => renderPostCard(post, true))
              )}
            </div>
          )}

          {page === 'profile' && (
            <div className="dashboard-content profile-page">
              <h2>Profile</h2>
              <div className="profile-card">
                <div className="profile-summary">
                  <div className="avatar-preview">
                    {profileForm.avatar ? (
                      <img src={URL.createObjectURL(profileForm.avatar)} alt="Avatar preview" />
                    ) : (
                      <span>{user?.first_name?.[0] || 'U'}</span>
                    )}
                  </div>
                  <div>
                    <h3>{user?.first_name} {user?.last_name}</h3>
                    <p className="profile-meta">@{user?.username}</p>
                    {user?.email && <p>{user.email}</p>}
                    <p>{user?.bio || 'Add a short bio to personalize your profile.'}</p>
                    
                    <div className="profile-stats">
                      <div className="stat-item">
                        <span className="stat-number">{following.length}</span>
                        <span className="stat-label">Following</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-number">{followers.length}</span>
                        <span className="stat-label">Followers</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-number">{myPosts.length}</span>
                        <span className="stat-label">Posts</span>
                      </div>
                    </div>

                    <div className="notification-panel">
                      <div className="notification-header">
                        <h3>Notifications</h3>
                        {notifications.filter((notification) => !notification.read).length > 0 && (
                          <span className="new-badge">
                            {notifications.filter((notification) => !notification.read).length} new
                          </span>
                        )}
                      </div>
                      {notifications.length === 0 ? (
                        <p>No notifications yet.</p>
                      ) : (
                        notifications.map((note) => (
                          <div key={note._id} className={`notification-item ${note.read ? 'read' : 'unread'}`}>
                            <strong>{note.from?.username}</strong>
                            <span>
                              {note.type === 'follow'
                                ? ' started following you.'
                                : ` sent a ${note.type} notification.`}
                            </span>
                            <small>{new Date(note.createdAt).toLocaleString()}</small>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                <form className="auth-form profile-form" onSubmit={handleProfileSave}>
                  <label>
                    Bio
                    <textarea
                      name="bio"
                      value={profileForm.bio}
                      onChange={handleProfileChange}
                      rows={4}
                    />
                  </label>
                  <label>
                    Location
                    <input
                      name="location"
                      value={profileForm.location}
                      onChange={handleProfileChange}
                    />
                  </label>
                  <label>
                    Website
                    <input
                      name="website"
                      value={profileForm.website}
                      onChange={handleProfileChange}
                      placeholder="https://"
                    />
                  </label>
                  <label>
                    Avatar image
                    <input
                      type="file"
                      accept="image/*"
                      name="avatar"
                      onChange={handleAvatarChange}
                    />
                  </label>
                  <button type="submit" className="action-button" disabled={loading}>
                    {loading ? 'Saving...' : 'Save Profile'}
                  </button>
                </form>
              </div>
            </div>
          )}

          {page === 'users' && (
            <div className="dashboard-content">
              <h2>Find Users</h2>
              <label>
                Search users
                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name or username"
                />
              </label>
              {filteredUsers.length === 0 ? (
                <p>No users found.</p>
              ) : (
                filteredUsers.map((item) => (
                  <div key={item._id} className="user-card">
                    <div>
                      <strong>{item.username}</strong>
                      <p>{item.first_name} {item.last_name}</p>
                    </div>
                    {item._id !== user?._id && (
                      isFollowing(item._id) ? (
                        <button className="secondary-button" onClick={() => handleUnfollow(item._id)}>
                          Unfollow
                        </button>
                      ) : (
                        <button className="secondary-button" onClick={() => handleFollow(item._id)}>
                          Follow
                        </button>
                      )
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {page === 'following' && (
            <div className="dashboard-content">
              <h2>Following</h2>
              {following.length === 0 ? (
                <p>You are not following anyone yet.</p>
              ) : (
                following.map((item) => (
                  <div key={item._id} className="user-card">
                    <div>
                      <strong>{item.username}</strong>
                      <p>{item.first_name} {item.last_name}</p>
                    </div>
                    <button className="secondary-button" onClick={() => handleUnfollow(item._id)}>
                      Unfollow
                    </button>
                  </div>
                ))
              )}
            </div>
          )}

          {page === 'followers' && (
            <div className="dashboard-content">
              <h2>Followers</h2>
              {followers.length === 0 ? (
                <p>No one is following you yet.</p>
              ) : (
                followers.map((item) => (
                  <div key={item._id} className="user-card">
                    <div>
                      <strong>{item.username}</strong>
                      <p>{item.first_name} {item.last_name}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {page === 'post-detail' && selectedPost && (
            <div className="dashboard-content">
              <button type="button" className="secondary-button" onClick={() => handlePageChange('feed')}>
                ← Back to Feed
              </button>
              <div className="post-detail">
                <h2>{selectedPost.title}</h2>
                <p className="post-content" dangerouslySetInnerHTML={{ __html: selectedPost.content }}></p>
                <div className="tags">{selectedPost.tags?.map((tag) => <span key={tag} className="tag">#{tag}</span>)}</div>
                {selectedPost.image_url && (
                  <div className="post-attachment">
                    <strong>Image:</strong> {selectedPost.image_url}
                  </div>
                )}
                {selectedPost.file_name && (
                  <div className="post-attachment">
                    <strong>File:</strong> {selectedPost.file_name}
                  </div>
                )}
                <small>
                  By {selectedPost.author?.username} • {new Date(selectedPost.createdAt).toLocaleDateString()}
                </small>
                <div className="post-actions">
                  <span>{selectedPost.like_count || 0} likes</span>
                  <span>{selectedPost.comment_count || 0} comments</span>
                  <button type="button" className="secondary-button" onClick={() => handleShare(selectedPost)}>
                    Share
                  </button>
                  <button type="button" className="secondary-button" onClick={() => handleLike(selectedPost)}>
                    Like
                  </button>
                  {selectedPost.author?._id === user?._id && (
                    <>
                      <button type="button" className="secondary-button" onClick={() => handleEditPost(selectedPost)}>
                        Edit
                      </button>
                      <button type="button" className="secondary-button" onClick={() => handleDeletePost(selectedPost._id)}>
                        Delete
                      </button>
                      {selectedPost.state === 'draft' && (
                        <button
                          type="button"
                          className="secondary-button"
                          onClick={() => handlePublishPost(selectedPost._id)}
                        >
                          Publish
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default App
