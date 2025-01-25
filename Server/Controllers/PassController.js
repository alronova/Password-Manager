require("dotenv").config();
const bcrypt = require('bcrypt');
const CryptoJS = require("crypto-js");
const UserModel = require("../Models/User");

const getCredential = async (req, res) => {
      const { userId } = req.body;
      const user = await UserModel.findById(userId, { creds: 1, _id: 0 });
      res.status(200).json(user);
    };

const saveCredential = async (req, res) => {
  try {
    const { userId, id, website, mail, encKey, password } = req.body;
    await UserModel.findByIdAndUpdate(
      userId,
      { $push: { creds: { id, website, mail, encKey, password } } },
      { new: true }
    );
    res.status(200).json({
      message: "Password saved successfully",
      success: true,
    });
  } catch (err) {
    console.log("Error in saving password", err);
    res.status(500).json({
      message: "Internal server errror",
      success: false,
    });
  }
};

const findCredential = async (req, res) => {
  try {
    const { userId, credId } = req.body;

    const result = await UserModel.findOne(
      {_id:  userId, "creds._id": credId},
      { "creds.$": 1, _id: 0 } );

    res.status(200).json({
      message: "Credential updated successfully",
      success: true,
      updatedUser: result.creds[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

const deleteCredential = async (req, res) => {
  try {
    const { userId, credId } = req.body;
    console.log(userId, credId)
    const result = await UserModel.findByIdAndUpdate(
      userId,
      { $pull: { creds: { _id: credId } } }, // Remove by unique ID instead
      { new: true }
    );

    if (!result) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    res.status(200).json({
      message: "Credential deleted successfully",
      success: true,
      updatedUser: result,
    });
  } catch (error) {
    console.error("Delete credential error:", error);
    res.status(500).json({
      message: "Failed to delete credential",
      success: false,
    });
  }
};

const decryptedPassword = async (encryptedPassword) => {
    const bytes = CryptoJS.AES.decrypt(encryptedPassword, process.env.SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
}

const decryptCredential = async (req, res) => {
  const { userId, pass, credId } = req.body;
  const user = await UserModel.findOne(
    { _id: userId, "creds._id": credId },
    { "creds.$": 1, _id: 0, password: 1 } );
  
  const isPassEqual = await bcrypt.compare(pass, user.password);
  if(isPassEqual){
    const decKey = await decryptedPassword(user.creds[0].encKey);
    res.status(200).json({ success: isPassEqual, decKey, website: user.creds[0].website });
  }
  else{
    res.status(403).json({ success: false });
  }
};

module.exports = {
  getCredential,
  saveCredential,
  findCredential,
  deleteCredential,
  decryptCredential,
};