import { useState, useEffect } from "react";
import userAPI from "../api/UserAPI";

const useUser = () => {
  const [users, setUsers] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all users
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await userAPI.getAll();
      setUsers(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch profile
  const fetchProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await userAPI.getProfile();
      setProfile(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // CRUD operations
  const createUser = async (user) => {
    setLoading(true);
    setError(null);
    try {
      const data = await userAPI.create(user);
      await fetchUsers();
      return data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (id, user) => {
    setLoading(true);
    setError(null);
    try {
      const data = await userAPI.update(id, user);
      await fetchUsers();
      return data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const data = await userAPI.delete(id);
      await fetchUsers();
      return data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const banUser = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const data = await userAPI.ban(id);
      await fetchUsers();
      return data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const activateUser = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const data = await userAPI.activate(id);
      await fetchUsers();
      return data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const editProfile = async (data) => {
    setLoading(true);
    setError(null);
    try {
      const res = await userAPI.editProfile(data);
      await fetchProfile();
      return res;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    profile,
    loading,
    error,
    fetchUsers,
    fetchProfile,
    createUser,
    updateUser,
    deleteUser,
    banUser,
    activateUser,
    editProfile,
  };
};

export default useUser;