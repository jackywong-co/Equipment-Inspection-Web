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
