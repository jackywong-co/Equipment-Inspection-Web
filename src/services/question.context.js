import axiosInstance from "./axios.instance";


export const getQuestions = () => {
  return (
    axiosInstance
      .get('question/'))
}

export const checkQuestion = (id) => {
  return (
    axiosInstance
      .get('question/' + id + '/')
  )
}

export const activeQuestion = (id) => {
  return (
    axiosInstance
      .put('question/' + id + '/', {
        is_active: true
      })
  )
}

export const disableQuestion = (id) => {
  return (
    axiosInstance
      .put('question/' + id + '/', {
        is_active: false
      })
  )
}
export const createQuestion = (question_text) => {
  return (
    axiosInstance
      .post('question/', {
        question_text: question_text
      })
  )
}
export const updateQuestion = (id, question_text,) => {
  return (
    axiosInstance
      .put('question/' + id + '/', {
        question_text: question_text
      })
  )
}
export const deleteQuestion = (id) => {
  return (
    axiosInstance
      .delete('question/' + id + '/')
  )
}