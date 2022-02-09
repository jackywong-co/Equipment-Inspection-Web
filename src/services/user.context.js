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