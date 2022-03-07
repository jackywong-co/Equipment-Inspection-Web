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
  const config = { headers: { 'Content-Type': 'multipart/form-data' } }
  let formData = new FormData();
  formData.append('is_active', 'true')
  return (
    axiosInstance
      .put('answer/' + id + '/', formData, config)
  )
}

export const disableAnswer = (id) => {
  const config = { headers: { 'Content-Type': 'multipart/form-data' } }
  let formData = new FormData();
  formData.append('is_active', 'false')
  return (
    axiosInstance
      .put('answer/' + id + '/', formData, config)
  )
}
export const createAnswer = (answer_text, form, created_by, question, image) => {

  console.log({
    "answer_text": answer_text,
    "form": form,
    "created_by": created_by,
    "question": question,
    "image": image
  })

  const config = { headers: { 'Content-Type': 'multipart/form-data' } }
  let formData = new FormData();
  formData.append('answer_text', answer_text === undefined ? "" : answer_text);
  formData.append('form', form.form_id);
  formData.append('created_by', created_by.id);
  formData.append('question', question.id);
  if (image) {
    formData.append('image', image);
  }

  return (

    axiosInstance
      .post('answer/', formData, config)
  )
}
// export const updateAnswer = (id, question_text,) => {
//   return (
//     axiosInstance
//       .put('answer/' + id + '/', {
//         question_text: question_text
//       })
//   )
// }
export const deleteAnswer = (id) => {
  return (
    axiosInstance
      .delete('answer/' + id + '/')
  )
}