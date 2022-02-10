import axiosInstance from "./axios.instance";


export const getForms = () => {
  return (
    axiosInstance
      .get('form/'))
}
