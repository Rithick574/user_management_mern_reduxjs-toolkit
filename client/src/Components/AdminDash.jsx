import React, { useState, useEffect } from "react";
import AdminNavbar from "../Components/AdminNavbar";
import DeleteConfirmationModal from './DeleteConfirm'
import axios from "axios";
import { setUserData } from "../redux/features/userSlice";
import {
  isEmpty,
  isPasswordValid,
  isEmailValid,
} from "../../helper/validation";

export const AdminDash = () => {
  const [user, setUser] = useState([]);
  const [addopen, setAddOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [editerr, setEditerr] = useState(false);
  const [editerrdef, setEditerrdef] = useState("");
  const [open, setOpen] = useState(false);

  const [editname, setEditname] = useState({
    name: "",
    id: "",
    value: "",
  });
  const [error, setError] = useState({
    emailred: false,
    namered: false,
    passwordred: false,
    confirmpasswordred: false,
  });
  const [errordef, seterrordef] = useState({
    emailerr: "",
    nameerr: "",
    passworderr: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    Password: "",
  });
  const [deluser, setDelUser] = useState("");
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [delid, setDelid] = useState(null);

  const editvalue = (event) => {
    setEditname((previous) => ({
      ...previous,
      value: event.target.value,
    }));
  };

  const handleDelete=async(id)=>{
    const userToDelete = user.find((item) => item.id === id);
    setDelUser(userToDelete.name)
    setDeleteModalOpen(true);
    setDelid(id)
  }
  const handleConfirmDelete = () => {
    console.log("Deleting user with ID:", delid);
    setDeleteModalOpen(false);
    deletecred(delid)
  };

  const deletecred = (id) => {
    const userToDelete = user.find((item) => item.id == id);
    axios.delete('http://localhost:5000/admin/deleteuser', { data: { id: userToDelete._id } })
      .then(() => {
        axios.get('http://localhost:5000/admin/fetchusertoadmin')
          .then((response) => {
            const fetchedUsers = response.data.data;
            const usersWithId = fetchedUsers.map((user, index) => ({
              ...user,
              id: index + 1,
            }));

            setUser(usersWithId);
            setIsLoading(false);
            setDelUser("")
            setDeleteModalOpen(false);
            setDelid(null)
          })
          .catch((err) => {
            console.error("Error fetching users after deletion:", err);
            setIsLoading(false);
          });
      })
      .catch((error) => {
        console.error("Error deleting user:", error);
      });

  }

  useEffect(() => {
    axios
      .get("http://localhost:5000/admin/fetchusertoadmin")
      .then((response) => {
        const fetchedUsers = response.data.data;
        const usersWithId = fetchedUsers.map((user, index) => ({
          ...user,
          id: index + 1,
        }));

        setUser(usersWithId);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  }, []);

  return (
    <>
      <AdminNavbar users={user} setUser={setUser} setAddOpen={setAddOpen} />

      <div className="container mx-auto mt-8 p-2 max-w-2xl">
      <div className='flex justify-center items-center'>
        <h2 className="text-2xl font-bold mb-4">User Details</h2>
      </div>
      <br></br>
      <br></br>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <table className="min-w-full bg-white border border-gray-300">
          <thead className="bg-gray-200">
            {/* <tr>
              <th className="py-2 px-4 border-b">ID</th>
              <th className="py-2 px-4 border-b">Name</th>
              <th className="py-2 px-4 border-b">Email</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr> */}
          </thead>
          <tbody>
            {user.map((user) => (
              <tr key={user.id} className="hover:bg-gray-100">
                <td className="py-2 px-4 border-b">{user.id}</td>
                <td className="py-2 px-4 border-b">{user.name}</td>
                <td className="py-2 px-4 border-b">{user.email}</td>
                <td className="py-2 px-4 border-b">
                  <button className="mr-2 px-2 py-1 bg-blue-500 text-white rounded-lg">
                    Edit User
                  </button>
                  <button onClick={() => handleDelete(user.id)} className="px-2 py-1 bg-red-500 text-white rounded-lg">
                    Delete User
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>

    <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />

    </>
  );
};
