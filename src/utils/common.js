import jwt from 'jsonwebtoken'
import {mongo} from 'mongoose'
import path from 'path'
import fs from 'fs'
import mime from 'mime'
import cloudinary from 'cloudinary'
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
})
export const getFormattedDate = (date) => {
  let year = date.getFullYear();

  let month = (1 + date.getMonth()).toString();
  month = month.length > 1 ? month : '0' + month;

  let day = date.getDate().toString();
  day = day.length > 1 ? day : '0' + day;

  let hour = date.getHours().toString();
  hour = hour.length > 1 ? hour : '0' + hour;

  let minutes = date.getMinutes().toString();
  minutes = minutes.length > 1 ? minutes : '0' + minutes;

  let second = date.getSeconds().toString();
  second = second.length > 1 ? second : '0' + second;
  return `${month}/${day}/${year} ${hour}:${minutes}:${second}`;
}
export const genJWT = (payload, secretKey, expireTime) => {
  return jwt.sign(payload, secretKey, { expiresIn: expireTime })
}
export const convertToBase64URI = (fileName) => {
  let filePath = path.join('./public/images', fileName);
  let fileMime = mime.getType(filePath);
  let data = fs.readFileSync(filePath);
  let dataBase64 = `data:${fileMime};base64`
  let imgBase64 = `${dataBase64},${data.toString('base64')}`;
  return imgBase64;
}
export const uploadImage = async (base64Uri, option = {}) => {
  const result = await cloudinary.v2.uploader.upload(base64Uri, option);
  return result.secure_url;
}
export const convertPostTime = (dateTime) => {
  const currentDateTime = new Date();
  const h = currentDateTime - dateTime;
  const postTimeMin = Math.floor(h/60000);
  if(postTimeMin < 2){
    return `Just now`
  }
  else if(postTimeMin >= 2 && postTimeMin <60){
    return `${postTimeMin} mins`
  }
  else if(postTimeMin>=60 && postTimeMin < 60*24){
    const postTimeHour = Math.floor(postTimeMin/60);
    if(postTimeHour == 1){
      return '1 hour'
    }
    return `${postTimeHour} hours`
  }
  else if(postTimeMin >= 60*24 && postTimeMin < 60*24*2){
    return `1 day`
  }
  else{
    const date = new Date(dateTime);
    return date.toDateString();
  }
}
export const convertStringToBuffer = (str,unc) => {
  const buferData = new Buffer(str,unc);
  return buferData;
}
export const convertBufferToString = (strBuffer,unc) => {
  const str = strBuffer.toString(unc);
  return str;
}
export const getChatChanelID = (from,to) => {
  const _idForm = mongo.ObjectId(from); 
  const _idTo = mongo.ObjectId(to);
  let chanelID = `${from}-${to}`
  if(_idForm <= _idTo){
    chanelID = `${to}-${from}`
  }
  return chanelID;
}
export const  delCharCode = (text) => {
  text = text.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
  text = text.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
  text = text.replace(/ì|í|ị|ỉ|ĩ/g, "i");
  text = text.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
  text = text.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
  text = text.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
  text = text.replace(/đ/g, "d");
  text = text.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
  text = text.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
  text = text.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
  text = text.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
  text = text.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
  text = text.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
  text = text.replace(/Đ/g, "D");
  return text;
}