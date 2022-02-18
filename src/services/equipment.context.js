import axiosInstance from "./axios.instance";

export const getEquipments = () => {
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
export const createEquipment = (equipment_name, equipment_code, room) => {
  return (
    axiosInstance
      .post('register/', {
        equipment_name: equipment_name,
        equipment_code: equipment_code,
        room: room
      })
  )
}