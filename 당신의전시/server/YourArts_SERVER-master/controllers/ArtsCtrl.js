'use strict';

const artsModel = require('../models/ArtsModel');


/******
 * 전시 검색
 * @param req
 * @param res
 * @param next
 * @returns {Promise.<*>}
 */
exports.search = async(req, res, next) => {
  let result = [];
  let data = '';

  try {


    const searchData = req.params.search;

    data = await artsModel.search(searchData);

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

/*****
 * 진행 전시 조회
 * @param req
 * @param res
 * @param next
 * @returns {Promise.<*>}
 */

exports.doingList = async(req, res, next) => {
  let result = [];
  let data = '';
  try {


    data = await artsModel.list();


  } catch (error) {
    return next(error);
  }

  for(let i = 0 ; i<data.length; i++) {
    // 시작 +, 종료 - => 진행중
    if ((data[i].start_date > 0) && (data[i].end_date < 0 )) {
      data[i].flag = 'doing';
      result.push(data[i]);
    }
  }

  return res.r(result);
};


/*****
 * 지난 전시 조회
 * @param req
 * @param res
 * @param next
 * @returns {Promise.<*>}
 */
exports.doneList = async(req,res,next) => {
  let result = [];
  let data = '';
  try {

    data = await artsModel.list();

  } catch (error) {
    return next(error);
  }

  for(let i = 0 ; i<data.length; i++) {

    // 시작 +, 종료 + => 종료
    if ((data[i].start_date) > 0 && (data[i].end_date > 0)) {
      data[i].flag = 'done';
      result.push(data[i]);
    }
  }
  return res.r(result);
};


/*****
 * 예정 전시 조회
 * @param req
 * @param res
 * @param next
 * @returns {Promise.<*>}
 */
exports.todoList = async(req,res,next) => {
  let result = [];
  let data = '';
  try {
    data = await artsModel.list();

  } catch (error) {
    return next(error);
  }

  for(let i = 0 ; i<data.length; i++) {
    // 시작 -, 종료 - => 예정
    if ((data[i].start_date < 0) && (data[i].end_date < 0)){
      data[i].flag = 'todo';
      result.push(data[i]);
    }
  }
  return res.r(result);

};


exports.exDetail= async(req, res, next) => {
  let result = '';

  try{
    const data = {
      exIdx: req.params.art_idx,
      userIdx: req.user_idx,
    };

    result = await artsModel.exDetail(data);
  } catch (error){
    return next(error);
  }

  return res.r(result);

};

// exports.exDetail = async(req, res, next) => {
//
//   let temp = '';
//
//   try {
//     const data = {
//       exIdx: req.params.idx,
//       userIdx: 1
//     };
//
//     temp = await artsModel.exDetail(data);
//
//     console.log(temp);
//   }catch (error) {
//     return next(error);
//   }
//
//   temp[0][0].images = [];
//
//   temp[1].forEach((imgObj) => {
//
//     temp[0][0].images.push({
//       index: imgObj.work_idx,
//       url: imgObj.work_image
//     });
//   });
//
//
//   const result = temp[0][0];
//
//
//   return res.r(result);
//
// };

exports.workDetail = async(req, res, next) => {
  let result = '';

  try{
    const data = {
      idx: req.params.work_idx,
    };

    result = await artsModel.workDetail(data);

  } catch (error) {
    return next(error);
  }


  return res.r(result)
};
