const dbConnection = require("../db/dbconfig");
const { StatusCodes } = require("http-status-codes");
async function postAnswer(req, res) {
  // res.send("answer")
  const { questionId, answer } = req.body;
  // no need to check question id becouse it will be avaliable with the question so we
  // will check only answer
  if (!answer) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "please provide answer" });
  }
  try {
    await dbConnection.query(
      "INSERT INTO answers(questionId,answer,userId) VALUES(?,?,?)",
      [questionId, answer, req.user.userId]
    );

    return res
      .status(StatusCodes.CREATED)
      .json({ msg: "Answer posted successfully" });
  } catch (error) {
    console.log(error.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "An unexpected error occurred." });
  }
}
//Solomon
async function getAnswer (req, res) {
  console.log("object");
  const questionId = req.params.questionId;
  console.log(questionId);
  try {
    const [answer] = await dbConnection.query(
      `SELECT 
        q.questionId, q.answer, q.answerId, q.userId, q.created_at, u.userName, u.firstName, u.lastName FROM answers AS q JOIN users AS u ON q.userId = u.userId WHERE q.questionId = ?`,  
      [questionId]
    );
    if (!answer || answer.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "No answers found for this question.",
      });
    }
    return res.status(StatusCodes.OK).json(answer);
  } catch (error) {
    console.error(error.message);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Something went wrong, try again later!",
    });
  }
};

module.exports = { postAnswer, getAnswer };
