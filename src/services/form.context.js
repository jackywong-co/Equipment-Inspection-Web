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
export const createForm = (form_name, created_by, equipments, questions) => {
  let equipment_id_list = []
  for (let x in equipments){
    equipment_id_list.push(equipments[x].equipment_id)
  }
  
  let question_id_list = []
  for (let x in questions){
    question_id_list.push(questions[x].id)
  }
  return (
    axiosInstance
      .post('form/', {
        form_name: form_name,
        created_by: created_by.id,
        equipments: equipment_id_list,
        questions: question_id_list
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