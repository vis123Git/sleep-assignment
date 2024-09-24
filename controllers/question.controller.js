const { find_one_question, save_new_question } = require("../services/questions.services");

exports.add_question = async function (req, res) {
        try {
          const { text, type , options, order} = req.body;
          if (!text) return res.status(400).json({ status: false, message: "Question text is required!" });
          if (!type) return res.status(400).json({ status: false, message: "Question type is required!" });
          if (!options || Array.isArray(options) || options?.length) return res.status(400).json({ status: false, message: "Options are required!" });
          if (!order || isNaN(order)) return res.status(400).json({ status: false, message: "Order is required!" });
      
          const get_same_order = await find_one_question({ order });
          if (get_same_order) return res.status(400).json({ status: false, message: "Question order can not be same!!" });

          const add_que = await save_new_question({ text : text.trim(), type, options, order });
          if (!add_que) return res.status(400).json({ status: false, message: "Unable to add question!!" });
      
          return res.status(200).json({ status: true, data: add_que, message: "Question added successfull!" });
        } catch (error) {
          console.log("error===", error);
          return res.status(400).json({ status: false, message: "Something went wrong!" });
        }
      };