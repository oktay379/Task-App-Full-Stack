import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import CreateTask from './CreateTask';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { IoClose } from 'react-icons/io5';

const Home = () => {

  const navigate = useNavigate();
  const location = useLocation();
  const searchTask = location.state?.task;

  const downloadFile = (fileUrl) => {
    axios({
      url: fileUrl,
      method: 'GET',
      responseType: 'blob',
    }).then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileUrl.substring(fileUrl.lastIndexOf('/') + 1));
      document.body.appendChild(link);
      link.click();
    });
  };

  const [tasks, setTasks] = useState([]);
  const [selectedTag, setSelectedTag] = useState('');

  axios.defaults.withCredentials = true;
  useEffect(() => {
    axios.get('http://localhost:3000/tasks/user-todos')
      .then(res => {
        setTasks(res.data);
      })
      .catch(err => console.log(err));
  }, []);

  useEffect(() => {
    if (selectedTag) {
      axios.get(`http://localhost:3000/tasks/tags/${selectedTag}`)
        .then(res => setTasks(res.data))
        .catch(err => console.log(err));
    } else {
      axios.get('http://localhost:3000/tasks/user-todos')
        .then(res => setTasks(res.data))
        .catch(err => console.log(err));
    }
  }, [selectedTag]);

  const handleCheckboxChange = (taskId) => {
    axios.put(`http://localhost:3000/tasks/toggle-complete/${taskId}`)
      .then(res => {
        setTasks(prevTasks => prevTasks.map(task => task._id === taskId ? { ...task, complete: !task.complete } : task));
        toast('Status Updated', {
          icon: '👏',
        });
      })
      .catch(err => console.log(err));
  };

  const handleDelete = (taskId) => {
    axios.delete(`http://localhost:3000/tasks/delete-todo/${taskId}`)
      .then(res => {
        setTasks(prevTasks => prevTasks.filter(task => task._id !== taskId));
        toast('Task Deleted', {
          icon: '🗑️',
        });
      })
      .catch(err => console.log(err));
  };

  const handleSearchAgain = () => {
    navigate("/", { state: { task: null } });
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
        
      <h1 className="text-3xl font-bold text-center">Create Task</h1>

      <div className="flex items-stretch justify-center my-10 gap-5">
      {searchTask && (
        <div className="bg-white shadow-lg rounded-lg">
          <div className='flex justify-between items-center px-4 py-2 border-b border-gray-200'>
            <h3 className="text-lg font-bold">Search Result: {searchTask.title}</h3>
            <button
              onClick={handleSearchAgain}
              className="text-gray-500 hover:text-gray-800"
            >
              <IoClose size={24} />
            </button>
          </div>
          <div className="p-4">
            <p className="text-gray-700">{searchTask.desc}</p>
            <div className="text-gray-500 text-sm mb-2">
              <p><span className="font-semibold">Tag:</span> {searchTask.tags}</p>
              <p><span className="font-semibold">Complete:</span> {searchTask.complete ? "Yes" : "No"}</p>
              <p><span className="font-semibold">Created At:</span> {new Date(searchTask.createdAt).toLocaleDateString()}</p>
            </div>
            {searchTask.file && (
              <img
                src={`http://localhost:3000/Images/${searchTask.file}`}
                alt={searchTask.file}
                className="rounded-md object-cover w-full"
              />
            )}
          </div>
        </div>
      )}
      <CreateTask />
      </div>


      <h1 className="text-3xl font-bold text-center mb-8">My Tasks</h1>
      
      <div className="max-w-xl mx-auto flex justify-around">
        <button
          className={`px-4 py-2 rounded-md text-white ${selectedTag === '' ? 'bg-orange-600' : 'bg-orange-400 hover:bg-orange-500'}`}
          onClick={() => setSelectedTag('')}
        >
          All
        </button>
        <button
          className={`px-4 py-2 rounded-md text-white ${selectedTag === 'work' ? 'bg-blue-600' : 'bg-blue-400 hover:bg-blue-500'}`}
          onClick={() => setSelectedTag('work')}
        >
          Work
        </button>
        <button
          className={`px-4 py-2 rounded-md text-white ${selectedTag === 'school' ? 'bg-green-600' : 'bg-green-400 hover:bg-green-500'}`}
          onClick={() => setSelectedTag('school')}
        >
          School
        </button>
        <button
          className={`px-4 py-2 rounded-md text-white ${selectedTag === 'sports' ? 'bg-yellow-600' : 'bg-yellow-400 hover:bg-yellow-500'}`}
          onClick={() => setSelectedTag('sports')}
        >
          Sports
        </button>
        <button
          className={`px-4 py-2 rounded-md text-white ${selectedTag === 'other' ? 'bg-red-600' : 'bg-red-400 hover:bg-red-500'}`}
          onClick={() => setSelectedTag('other')}
        >
          Other
        </button>
      </div>


      <div className="max-w-7xl mx-auto mt-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task) => (
            <div key={task._id} className="bg-white shadow-md rounded-lg p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold mb-2">{task.title}</h2>
                <input
                  type="checkbox"
                  checked={task.complete}
                  onChange={() => handleCheckboxChange(task._id)}
                  className="form-checkbox h-5 w-5 text-indigo-600"
                />
              </div>
              <p className="text-gray-700 mb-4">{task.desc}</p>
              <div className="text-gray-500 text-sm">
                <p className='font-bold'>Tag: {task.tags}</p>
                <p className='font-bold'>Complete: {task.complete ? "Yes" : "No"}</p>
                <p className='font-bold'>Created At: {new Date(task.createdAt).toLocaleDateString()}</p>
              </div>
  
              {task.file && (
                <div className="mt-4 w-full rounded-md">
                  {task.file.endsWith(".jpg") || task.file.endsWith(".jpeg") || task.file.endsWith(".png")|| task.file.endsWith(".webp") ? (
                    <img src={`http://localhost:3000/Images/${task.file}`} alt={task.title} className="w-full h-60 object-cover rounded-md" />
                  ) : ( <>
                    <img src="https://media.istockphoto.com/id/1467772236/vector/vector-flat-icon-no-task.jpg?s=170667a&w=0&k=20&c=VUYM9H6QkuiBz7mSV8uPz7fYpXSkW41ssIxBx1MQNi8=" alt={task.title} className="w-full h-60 object-cover rounded-md" />
                    <button
                      onClick={() => downloadFile(`http://localhost:3000/Images/${task.file}`)}
                      className="block w-full py-2 px-4 border border-gray-300 rounded-md text-center text-blue-600 hover:bg-gray-200"
                    >
                      Download File
                    </button>
                    </>
                  )}
                </div>
              )}

              <div className="flex space-x-4 mt-3">
                <Link
                  to={`/edit/${task._id}`}
                  className="bg-white text-blue-600 px-4 py-2 rounded-md hover:bg-gray-200"
                >
                  Edit Task
                </Link>
                <button
                  onClick={() => handleDelete(task._id)}
                  className="bg-white text-red-500 px-4 py-2 rounded-md hover:bg-gray-200"
                >
                  Delete Task
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
