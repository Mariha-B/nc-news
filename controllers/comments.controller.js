const { removeComment } = require("../models/comments.model");

exports.deleteComment = (req, res, next) => {
    const { comment_id } = req.params;
    removeComment(comment_id)
      .then((data) => {
          if(data.rowCount === 0){
            return Promise.reject({ status: 404, msg: "Not found" });
          }
        res.status(204).send();
      })
      .catch(next);
  };
  