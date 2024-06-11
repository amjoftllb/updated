import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { allUser } from "../store/allUser.action.js";
import Button from "../utils/Button.jsx";
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { firestore } from '../firebase.js';

function AllUsers() {
  const dispatch = useDispatch();
  const { user, error } = useSelector((state) => state.example);
  console.log("user : ", user);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    dispatch(allUser());
    fetchUsersFromFirestore();
  }, []);

  const fetchUsersFromFirestore = async () => {
    try {
      const usersCollection = collection(firestore, 'users');
      const querySnapshot = await getDocs(usersCollection);

      const usersData = [];
      querySnapshot.forEach((doc) => {
        usersData.push({ id: doc.id, ...doc.data() });
      });

      setUsers(usersData);
    } catch (error) {
      console.error('Error fetching users: ', error);
    }
  };

  function handleButtonClick(email) {
    const deleteUser = async () => {
      try {
        const usersCollection = collection(firestore, 'users');
        const querySnapshot = await getDocs(usersCollection);

        let userId;
        querySnapshot.forEach((doc) => {
          if (doc.data().email === email) {
            userId = doc.id;
          }
        });

        if (userId) {
          const userDocRef = doc(firestore, 'users', userId);
          await deleteDoc(userDocRef);

          // Update the user list without reloading the page
          setUsers(users.filter(user => user.email !== email));
        } else {
          console.log('User not found');
        }
      } catch (error) {
        console.log(error);
      }
    };
    deleteUser();
  }

  return (
    <div className="bg-slate-400 md:min-h-screen flex items-center justify-center">
      <div className="bg-white bg-opacity-50 rounded-lg shadow-lg px-40 py-6">
        <ul className="m-4 grid grid-cols-1 gap-7 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {users.map((user) => (
            <li key={user.email}>
              <div className="rounded-xl bg-white p-4 shadow-lg">
                <img
                  src={`${user.avatar}`}
                  alt={`${user.firstName}`}
                  className="mx-auto mb-4 rounded-full object-cover object-center h-32 w-32"
                />
                <h2 className="text-xl text-center m-2">{user.firstName} {user.lastName}</h2>
                <div className="mb-2 text-black font-semibold text-center text-green-500">User ID: {user.email}</div>
                <div>Gender: {user.gender}</div>
                <div>Birth Date: {new Date(user.birthDate).toLocaleDateString()}</div>
                <div>Hobbies: {user.hobbies.join(', ')}</div>
                <Button type="button" className="mt-4" onClick={() => handleButtonClick(user.email)}>Delete</Button>
              </div>
              <br />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default AllUsers;
