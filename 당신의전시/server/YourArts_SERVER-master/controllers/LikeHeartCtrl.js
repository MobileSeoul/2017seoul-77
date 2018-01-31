'use strict';

const likeHeartModel = require('../models/LikeHeartModel');

/******
 * like작성
 * @param req
 * @param res
 * @param next
 * @returns {Promise.<*>}
 */
exports.like = async(req, res, next) => {

  let result = '';

  try {
    const likeData = {
      user_idx : req.user_idx,
      exhibition_idx : req.body.exhibition_idx,
      like_count : req.body.like_count
    };

    result = await likeHeartModel.like(likeData);

  } catch (error) {
    console.log(error);
    return next(error);
  }
  return res.r(result);
};

/******
 * like수정
 * @param req
 * @param res
 * @param next
 * @returns {Promise.<*>}
 */
exports.likeEdit = async(req, res, next) => {

  let result = '';

  try {
    const likeEditData = {
      user_idx : req.user_idx,
      exhibition_idx : req.body.exhibition_idx,
      like_before_count : req.body.like_before_count,
      like_after_count : req.body.like_after_count
    };

    result = await likeHeartModel.likeEdit(likeEditData);

  } catch (error) {
    console.log(error);
    return next(error);
  }
  return res.r(result);
};


/******
 * heart작성
 * @param req
 * @param res
 * @param next
 * @returns {Promise.<*>}
 */
exports.heart = async(req, res, next) => {

  let result = '';

  try {
    const heartData = {
      user_idx : req.user_idx,
      exhibition_idx : req.body.exhibition_idx
    };

    result = await likeHeartModel.heart(heartData);

  } catch (error) {
    console.log(error);
    return next(error);
  }
  return res.r(result);
};

exports.heartEdit = async(req, res, next) => {

  let result = '';

  try {
    const heartData = {
      user_idx : req.user_idx,
      exhibition_idx : req.body.exhibition_idx
    };

    result = await likeHeartModel.heartEdit(heartData);

  } catch (error) {
    console.log(error);
    return next(error);
  }
  return res.r(result);
};
