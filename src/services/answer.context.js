import axiosInstance from "./axios.instance";


export const getAnswers = () => {
  return (
    axiosInstance
      .get('answer/'))
}

export const checkAnswer = (id) => {
  return (
    axiosInstance
      .get('answer/' + id + '/')
  )
}

export const activeAnswer = (id) => {
  return (
    axiosInstance
      .put('answer/' + id + '/', {
        is_active: true
      })
  )
}

export const disableAnswer = (id) => {
  return (
    axiosInstance
      .put('answer/' + id + '/', {
        is_active: false
      })
  )
}
export const createAnswer = (question_text) => {
  return (
    axiosInstance
      .post('answer/', {
        question_text: question_text
      })
  )
}
export const updateAnswer = (id, question_text,) => {
  return (
    axiosInstance
      .put('answer/' + id + '/', {
        question_text: question_text
      })
  )
}
export const deleteAnswer = (id) => {
  return (
    axiosInstance
      .delete('answer/' + id + '/')
  )
}