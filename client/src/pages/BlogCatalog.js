import { useState, useEffect, useContext } from 'react';
import UserView from '../components/UserView';
import AdminView from '../components/AdminView';
import UserContext from '../UserContext';

export default function BlogCatalog({ searchQuery }) {
  const { user } = useContext(UserContext);
  const [blogs, setBlogs] = useState([]);

  // Fetch blogs from the API
  const fetchData = () => {
    let fetchUrl = user.isAdmin === true 
      ? `http://localhost:4000/blogs/all`
      : `http://localhost:4000/blogs/active`;

    fetch(fetchUrl, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(res => res.json())
    .then(data => setBlogs(data));
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  // Filter blogs based on search query
  const filteredBlogs = blogs.filter(blog => 
    blog.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    (user.isAdmin === true)
      ? <AdminView blogData={filteredBlogs} fetchData={fetchData} />
      : <UserView blogData={filteredBlogs} />
  );
}
