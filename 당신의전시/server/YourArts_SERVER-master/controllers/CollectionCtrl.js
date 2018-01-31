'use strict';

const collectionModel = require('../models/CollectionModel');
const config = require('../config/config');
const resMsg = require('../errors.json');


/*******************
 * user의콜랙션조회
 ********************/
exports.userCollection = async(req, res, next) => {
  let result = '';
  try {
    const userIdxData = req.user_idx;

    result = await collectionModel.userCollection(userIdxData);

  } catch (error) {
    console.log(error);
    return next(error);
  }
  return res.r(result);
};

/*******************
 * 컬렉션작성
 ********************/
exports.collectionPost = async(req, res, next) => {
  let image;
  let result = '';
  if(!req.file){
    image = null;
  } else{
    image = req.file.location;
  }

  try {
    const collectionData = {
      user_idx: req.user_idx,
      exhibition_idx: req.body.exhibition_idx,
      collection_name: req.body.collection_name,
      collection_content : req.body.collection_content,
      collection_image: image
    };

    if (parseInt(collectionData.exhibition_idx) === 0) {
      // 등록된 전시가 없는경우
      result = await collectionModel.collectionPost2(collectionData)

    }else{ // 등록된 전시가 있는 경우
      result = await collectionModel.collectionPost(collectionData);
    }



  } catch (error) {
    console.log(error);
    return next(error);
  }
  return res.r(result);
};


/*******************
 * 컬렉션상세조회
 ********************/
exports.detailCollection = async(req, res, next) => {
  let result = '';
  try {
    const collectionIdxData = req.params.collection_idx;

    result = await collectionModel.detailCollection(collectionIdxData);
  } catch (error) {
    console.log(error);
    return next(error);
  }
  return res.r(result);
};

/*******************
 * 컬렉션수정
 ********************/
exports.editCollection = async(req, res, next) => {
  let result ='';
  try {
    const collectionEditData = {
      user_idx: req.user_idx,
      collection_idx : req.params.collection_idx,
      collection_content : req.body.collection_content
    };

    result = await collectionModel.editCollection(collectionEditData);

  } catch (error) {
    console.log(error);
    return next(error);
  }
  return res.r(result);
};

/*******************
 * 콜랙션삭제
 ********************/
exports.delCollection = async(req, res, next) => {
  let result ='';
  try {
    const data = {
      user_idx: req.user_idx,
      collection_idx: req.params.collection_idx,
    };

    result = await collectionModel.delCollection(data);

  } catch (error) {
    console.log(error);
    return next(error);
  }
  return res.r(result);
};
