import axiosInstance from "./axios.instance";


export const getUsers = () => {
  return (
    axiosInstance
      .get('user/'))
}

export const disableUser = (id) => {
  return (
    axiosInstance
      .put('user/' + id + '/', {
        is_active: false
      })
  )
}
export const createUser = (username, password, is_staff) => {
  return (
    axiosInstance
      .put('register/', {
        username: username,
        password: password,
        is_staff: is_staff
      })
  )
}