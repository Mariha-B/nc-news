const { fetchTopics } = require("../models/topics.model");

exports.getTopics = (req, res, next) => {
    const { endpoint } = req.params;
    console.log(endpoint);
  fetchTopics(endpoint)
    .then((topics) => {
        console.log(topics);
      res.status(200).send({topics});
    })
    .catch(next);
};
