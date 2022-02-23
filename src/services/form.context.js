import axiosInstance from "./axios.instance";

export const getForms = () => {
  return (
    axiosInstance
      .get('form/'))
}

export const checkForm = (id) => {
  return (
    axiosInstance
      .get('form/' + id + '/')
  )
}

export const activeForm = (id) => {
  return (
    axiosInstance
      .put('form/' + id + '/', {
        is_active: true
      })
  )
}

export const disableForm = (id) => {
  return (
    axiosInstance
      .put('form/' + id + '/', {
        is_active: false
      })
  )
}
export const createForm = (Form_name, location) => {
  return (
    axiosInstance
      .post('form/', {
        Form_name: Form_name,
        location: location
      })
  )
}
export const updateForm = (id, form_name, location) => {
  return (
    axiosInstance
      .put('form/' + id + '/', {
        form_name: form_name,
        location: location
      })
  )
}
export const deleteForm = (id) => {
  return (
    axiosInstance
      .delete('form/' + id + '/')
  )
}