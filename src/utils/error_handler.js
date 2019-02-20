import {createError} from 'apollo-errors'

export const dataFormInvalid = createError('dataFormInvalid',{
    message: "dataFormInvalid"
});