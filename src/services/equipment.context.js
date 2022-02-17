import axiosInstance from "./axios.instance";

export const getEquipment = () => {
  return (
    axiosInstance
      .get('equipment/'))
}
export const checkEquipment = (id) => {
  return (
    axiosInstance
      .get('equipment/' + id + '/')
  )
}
export const activeEquipment = (id) => {
  return (
    axiosInstance
      .put('equipment/' + id + '/', {
        is_active: true
      })
  )
}
export const disableEquipment = (id) => {
  return (
    axiosInstance
      .put('equipment/' + id + '/', {
        is_active: false
      })
  )
}