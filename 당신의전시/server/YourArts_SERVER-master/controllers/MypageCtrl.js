'use strict';

const mypageModel = require('../models/MypageModel');
const config = require('../config/config');
const resMsg = require('../errors.json');

/******
 * watch 조회
 * @param req
 */
exports.watch = async(req, res, next) => {
  let result = [];
  let data = '';
  try {
    const watchData = req.user_idx;
    data = await mypageModel.watch(watchData);
  } catch(error) {
    return next(error);
  }

  //TODO 모듈화 하기
  for(let i =0;i<data.length;i++){
    if ((data[i].start_date < 0) && (data[i].end_date < 0)){
      data[i].flag = 'todo';
      result.push(data[i]);
    } else if ((data[i].start_date > 0) && (data[i].end_date < 0 )) {
      data[i].flag = 'doing';
      result.push(data[i]);
    } else if ((data[i].start_date) > 0 && (data[i].end_date > 0)) {
      data[i].flag = 'done';
      result.push(data[i]);
    }
  }

  return res.r(result);

};

/******
 * wish 조회
 * @param req
 */

 exports.wish = async(req, res, next) => {
   let result = [];
   let data = '';
   try {
     const wishData = req.user_idx;
     data = await mypageModel.wish(wishData);
   } catch(error) {
     return next(error);
   }

   for(let i =0;i<data.length;i++){
     if ((data[i].start_date < 0) && (data[i].end_date < 0)){
       data[i].flag = 'todo';
       result.push(data[i]);
     } else if ((data[i].start_date > 0) && (data[i].end_date < 0 )) {
       data[i].flag = 'doing';
       result.push(data[i]);
     } else if ((data[i].start_date) > 0 && (data[i].end_date > 0)) {
       data[i].flag = 'done';
       result.push(data[i]);
     }
   }

   return res.r(result);
 };
