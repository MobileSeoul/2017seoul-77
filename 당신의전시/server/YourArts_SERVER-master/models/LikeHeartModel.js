'use strict';

const mysql = require('mysql');
const DBConfig = require('./../config/DBConfig');
const pool = mysql.createPool(DBConfig);
const transactionWrapper = require('./TransactionWrapper');

/*******************
 * like
 * @param  likeData = {user_idx, exhibition_idx, like_count}
 * @returns {Promise}
 ********************/
exports.like = (likeData) => {
  return new Promise((resolve, reject) => {
    transactionWrapper.getConnection(pool)
      .then(transactionWrapper.beginTransaction)
      .then((context) => {
        return new Promise((resolve, reject) => {

          const sql = "INSERT INTO YOURARTS.like set ?"; //평점을 평점테이블에 추가

          context.conn.query(sql, likeData, (err, rows) => {
            if (err) {
              context.error = err;
              reject(context)
            } else {
              if (rows.affectedRows === 1) { // 쓰기 시도 성공
                context.result = rows;
                resolve(context)
              } else {
                context.error = new Error("Like Post error");
                reject(context);
              }
            }
          })
        });
      })
      .then((context) => {
        return new Promise((resolve, reject) => {

          const sql =
            `
                   UPDATE YOURARTS.exhibition
                   SET exhibition_count = exhibition_count + 1,
  	                   exhibition_sum = exhibition_sum + ?
                   WHERE exhibition_idx = ?;
                   `;
          context.conn.query(sql, [likeData.like_count, likeData.exhibition_idx], (err, rows) => {
            if (err) {
              context.error = err;
              reject(context)
            } else {
              if (rows.affectedRows === 1) {
                resolve(context);
              } else {
                context.error = new Error("'Exhibition Update Error");
                reject(context);
              }
            }
          })
        })
      })
      .then((context) => {
        return new Promise((resolve, reject) => {

          const sql = "SELECT * FROM YOURARTS.like " +
            "WHERE user_idx=? AND exhibition_idx=?";

          context.conn.query(sql, [likeData.user_idx, likeData.exhibition_idx], (err, rows) => {
            if (err) {
              context.error = err;
              reject(context)
            } else {
              context.result = rows[0];
              resolve(context)
            }
          })

        });
      })
      .then(transactionWrapper.commitTransaction)
      .then((context) => {
        context.conn.release();
        resolve(context.result);
      })
      .catch((context) => {
        context.conn.rollback(() => {
          context.conn.release();
          reject(context.error);
        })
      })
  });
};


/*******************
 * likeEdit
 * @param  likeEditData = {user_idx, exhibition_idx, like_before_count, like_after_count}
 * @returns {Promise}
 ********************/
exports.likeEdit = (likeEditData) => {
  return new Promise((resolve, reject) => {
    transactionWrapper.getConnection(pool)
      .then(transactionWrapper.beginTransaction)
      .then((context) => {
        return new Promise((resolve, reject) => {

          const sql =
            `
            UPDATE YOURARTS.like
            SET like_count = ?
            WHERE user_idx=? AND exhibition_idx=?;
            `;

          context.conn.query(sql, [likeEditData.like_after_count, likeEditData.user_idx, likeEditData.exhibition_idx], (err, rows) => {
            if (err) {
              context.error = err;
              reject(context)
            } else {
              if (rows.affectedRows === 1) { // 수정 성공
                context.result = rows;
                resolve(context)
              } else {
                context.error = new Error("Like Put error");
                reject(context);
              }
            }
          })
        });
      })
      .then((context) => {
        return new Promise((resolve, reject) => {
          if (likeEditData.like_after_count === 0) {
            if (likeEditData.like_before_count !== 0) {
              //count 1 감소, sum 에서 원래값 감소
              const sql =
                `
                UPDATE YOURARTS.exhibition
                  SET exhibition_count = exhibition_count - ?,
                      exhibition_sum = exhibition_sum - ?
                WHERE exhibition_idx = ?;
                `;

              context.conn.query(sql, [1, likeEditData.like_before_count, likeEditData.exhibition_idx], (err, rows) => {
                if (err) {
                  context.error = err;
                  reject(context)
                } else {
                  if (rows.affectedRows === 1) {
                    resolve(context);
                  } else {
                    context.error = new Error("Exhibition Update Error");
                    reject(context);
                  }
                }
              })
            }
          } else {
            if (likeEditData.like_before_count === 0) {
              //count +1, sum + 새로운값
              const sql =
                `
                    UPDATE YOURARTS.exhibition
                    SET exhibition_count = exhibition_count + 1,
                    exhibition_sum = exhibition_sum + ?
                    WHERE exhibition_idx = ?;
                    `;

              context.conn.query(sql, [likeEditData.like_after_count, likeEditData.exhibition_idx], (err, rows) => {
                if (err) {
                  context.error = err;
                  reject(context)
                } else {
                  if (rows.affectedRows === 1) {
                    resolve(context);
                  } else {
                    context.error = new Error("Exhibition Update Error");
                    reject(context);
                  }
                }
              })
            } else {
              //sum - 원래값 + 새로운값
              const sql =
                `
                UPDATE YOURARTS.exhibition
                SET exhibition_sum = exhibition_sum - ? + ?
                WHERE exhibition_idx = ?;
                `;

              context.conn.query(sql, [likeEditData.like_before_count, likeEditData.like_after_count, likeEditData.exhibition_idx], (err, rows) => {
                if (err) {
                  context.error = err;
                  reject(context)
                } else {
                  if (rows.affectedRows === 1) {
                    resolve(context);
                  } else {
                    context.error = new Error("Exhibition Update Error");
                    reject(context);
                  }
                }
              })
            }
          }
        })
      })
      .then((context) => {
        return new Promise((resolve, reject) => {

          const sql = "SELECT * FROM YOURARTS.like " +
            "WHERE user_idx=? AND exhibition_idx=?";

          context.conn.query(sql, [likeEditData.user_idx, likeEditData.exhibition_idx], (err, rows) => {
            if (err) {
              context.error = err;
              reject(context)
            } else {
              context.result = rows[0];
              resolve(context)
            }
          })
        });
      })
      .then(transactionWrapper.commitTransaction)
      .then((context) => {
        context.conn.release();
        resolve(context.result);
      })
      .catch((context) => {
        context.conn.rollback(() => {
          context.conn.release();
          reject(context.error);
        })
      })
  });
};


/*******************
 * heart
 * @param  heartData = {user_idx, exhibition_idx}
 * @returns {Promise}
 ********************/
exports.heart = (heartData) => {
  return new Promise((resolve, reject) => {
      const sql = "SELECT heart_used FROM heart " +
        "WHERE user_idx=? AND exhibition_idx=?";

      pool.query(sql, [heartData.user_idx, heartData.exhibition_idx], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          if (rows.length !== 0) {
            reject(1406);
          } else {
            resolve(null);
          }
        }
      });
    }
  ).then(() => {
      return new Promise((resolve, reject) => {
        const sql =
          "INSERT INTO heart(user_idx, exhibition_idx, heart_used) " +
          "VALUES (?,?,1) ";

        pool.query(sql, [heartData.user_idx, heartData.exhibition_idx], (err, rows) => {
          if (err) {
            reject(err);
          } else {
            if (rows.affectedRows === 1) {
              resolve(heartData);
            } else {
              const _err = new Error("Heart Post error");
              reject(_err);
            }
          }
        });
      });
    }
  ).then((result) => {
      return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM heart " +
          "WHERE user_idx=? AND exhibition_idx=?";

        pool.query(sql, [heartData.user_idx, heartData.exhibition_idx], (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        });
      });
    }
  );
};


/*******************
 * heartEdit
 * @param  heartData = {user_idx, exhibition_idx}
 * @returns {Promise}
 ********************/
exports.heartEdit = (heartData) => {
  return new Promise((resolve, reject) => {
      const sql = "SELECT heart_used FROM heart " +
        "WHERE user_idx=? AND exhibition_idx=?";

      pool.query(sql, [heartData.user_idx, heartData.exhibition_idx], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          if (rows.length !== 0) {
            resolve(null);
          } else {
            reject(1407);
          }
        }
      });
  }
).then((result) => {
      return new Promise((resolve, reject) => {

        const sql =
          `
         UPDATE heart
         SET heart_used = heart_used * -1
         WHERE user_idx=? AND exhibition_idx=?;
         `;

        pool.query(sql, [heartData.user_idx, heartData.exhibition_idx], (err, rows) => {
          if (err) {
            reject(err);
          } else {
            if (rows.affectedRows === 1) {
              resolve(heartData);
            } else {
              const _err = new Error("Heart Edit error");
              reject(_err);
            }
          }
        });
      });
    }
  ).then((result) => {
      return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM heart " +
          "WHERE user_idx=? AND exhibition_idx=?";

        pool.query(sql, [heartData.user_idx, heartData.exhibition_idx], (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        });
      });
    }
  );
};
