import axiosInstance from "./axios.instance";


export const getRooms = () => {
  return (
    axiosInstance
      .get('room/'))
}

export const checkRoom = (id) => {
  return (
    axiosInstance
      .get('room/' + id + '/')
  )
}

export const activeRoom = (id) => {
  return (
    axiosInstance
      .put('room/' + id + '/', {
        is_active: true
      })
  )
}

export const disableRoom = (id) => {
  return (
    axiosInstance
      .put('room/' + id + '/', {
        is_active: false
      })
  )
}
export const createRoom = (room_name, location) => {
  return (
    axiosInstance
      .post('room/', {
        room_name: room_name,
        location: location
      })
  )
}
export const updateRoom = (id, room_name, location) => {
  return (
    axiosInstance
      .put('room/' + id + '/', {
        room_name: room_name,
        location: location
      })
  )
}
export const deleteRoom = (id) => {
  return (
    axiosInstance
      .delete('room/' + id + '/')
  )
}