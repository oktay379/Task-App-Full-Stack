import React, { useContext, useState } from 'react';
import axios from 'axios';
import { userContext } from '../App';
import toast from 'react-hot-toast';

const Create = () => {
  const { user } = useContext(userContext);

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [file, setFile] = useState(null);
  const [tag, setTag] = useState("");
  const maxChars = 50;

  const handleChange = (e) => {
    const inputText = e.target.value;
    if (inputText.length <= maxChars) {
      setDesc(inputText);
    }
  };

  axios.defaults.withCredentials = true;
  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('desc', desc);
    formData.append('file', file);
    formData.append('tags', tag);

    axios.post("http://localhost:3000/tasks/create", formData)
      .then(res => {
        if (res.data.added) {
          console.log(res.data);
          window.location.reload();
        }
      })
      .catch(err => {
        toast.error("Incorrect Entry");
        console.log(err);
      });
  };

  return (
    <div className="bg-gray-100">
      <div className="flex justify-center">
        <div className="w-full max-w-2xl bg-white shadow-lg rounded-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <img className="w-12 h-12 rounded-full" src={user.file} alt="User Avatar" />
              </div>
              <div className="w-full">
                <input
                  type="text"
                  placeholder="Add a title"
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-200"
                />
              </div>
            </div>
            <textarea
              value={desc}
              name="desc"
              id="desc"
              cols="5"
              rows="3"
              onChange={handleChange}
              maxLength={maxChars}
              placeholder="Add a description"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-200"
            ></textarea>
            <div className="flex items-center space-x-4">
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-200"
                type="file"
                placeholder="Select File"
                onChange={(e) => setFile(e.target.files[0])}
              />
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-200"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
              >
                <option value="" disabled>Select Tag</option>
                <option value="work">Work</option>
                <option value="school">School</option>
                <option value="sports">Sports</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="flex items-center justify-center">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-400 focus:outline-none focus:ring focus:ring-indigo-200"
              >
                Post Task
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Create;
