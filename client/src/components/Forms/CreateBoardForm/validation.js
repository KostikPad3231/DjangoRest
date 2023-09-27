import * as Yup from 'yup';

export const BoardSchema = Yup.object().shape({
    title: Yup.string().required("Name is required!"),
    description: Yup.string().required("Description is required!"),
});