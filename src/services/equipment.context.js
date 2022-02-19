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
      .post('equipment/', {
        equipment_name: equipment_name,
        equipment_code: equipment_code,
        room: room
      })
  )
}
export const updateEquipment = (id, equipment_name, equipment_code, room_id) => {
  return (
    axiosInstance
      .put('equipment/' + id + '/', {
        equipment_name: equipment_name,
        equipment_code: equipment_code,
        room_id: room_id
      })
  )
}
export const deleteEquipment = (id) => {
  return (
    axiosInstance
      .delete('equipment/' + id + '/')
  )
}