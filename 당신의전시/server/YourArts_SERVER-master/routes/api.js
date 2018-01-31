'use strict';

const authCtrl = require('../controllers/AuthCtrl');
const userCtrl = require('../controllers/UserCtrl');
const artsCtrl = require('../controllers/ArtsCtrl');
const collectionCtrl = require('../controllers/CollectionCtrl');
const imageCtrl = require('../controllers/ImageCtrl');
const mypageCtrl = require('../controllers/MypageCtrl');

const likeHeartCtrl = require('../controllers/LikeHeartCtrl');


module.exports = (router) => {

  // USER
  router.route('/users/register')
    .post(userCtrl.register);

  router.route('/users/fb/register')
    .post(userCtrl.fbRegister);

  router.route('/users/login')
   .post(userCtrl.login);
  router.route('/users/fb/login')
    .post(userCtrl.fbLogin);

  router.route('/users')
    .put(authCtrl.auth, userCtrl.edit)
    .delete(authCtrl.auth, userCtrl.delUser);
  router.route('/users/find/id')
    .post(userCtrl.findID);
  router.route('/users/find/pw')
    .post(userCtrl.findPW);
  router.route('/users/confirm/pw')
    .post(userCtrl.confirmPW);
  router.route('/users/edit/pw')
    .post(userCtrl.editPW);



  // ARTS
  router.route('/arts/doing')
    .get(artsCtrl.doingList);
  router.route('/arts/done')
    .get(artsCtrl.doneList);
  router.route('/arts/todo')
    .get(artsCtrl.todoList);
  router.route('/search/:search')
    .get(artsCtrl.search);

  router.route('/arts/:art_idx')
    .get(authCtrl.auth, artsCtrl.exDetail);



  router.route('/works/:work_idx')
    .get(artsCtrl.workDetail);

  //like, Heart
  router.route('/like')
    .post(authCtrl.auth, likeHeartCtrl.like)
    .put(authCtrl.auth, likeHeartCtrl.likeEdit);

  router.route('/heart')
    .post(authCtrl.auth, likeHeartCtrl.heart)
    .put(authCtrl.auth, likeHeartCtrl.heartEdit);



  // COLLECTIONS
  router.route('/collections')
    .get(authCtrl.auth, collectionCtrl.userCollection)
    .post(authCtrl.auth, imageCtrl.uploadSingle, collectionCtrl.collectionPost);


  router.route('/collections/:collection_idx')
    .get(authCtrl.auth, collectionCtrl.detailCollection)
    .delete(authCtrl.auth, collectionCtrl.delCollection)
    .put(authCtrl.auth, collectionCtrl.editCollection);


  //MYPAGE
  router.route('/watch')
    .get(authCtrl.auth, mypageCtrl.watch);
  router.route('/wish')
    .get(authCtrl.auth, mypageCtrl.wish);


  return router;
};
