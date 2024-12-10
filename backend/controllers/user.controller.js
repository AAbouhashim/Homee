import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";

export const getUserProfile = async (req, res) => {
  const {username} = req.params;

  try {
    const user = await User.findOne({username}).select("-password");
    if (!user) {
      return res.status(404).json({error: "User not found"});
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({error: error.message});
    console.log("Error at getUserProfile controller", error.message);
  }
};

export const followUnfollowUser = async (req, res) => { 
  try {
    const { id } = req.params;
    const userToModify = await User.findById(id);
    const currentUser = await User.findById(req.user._id);

    if(id === req.user._id.toString()){
      return res.status(400).json({error: "You cannot follow/ unfollow yourself"});
    }

    if(!userToModify || !currentUser){
      return res.status(404).json({error: "User not found"});
    }

    const isFollowing = currentUser.following.includes(id);

    if(isFollowing){
      // Unfollow User
      await currentUser.updateOne({$pull: {following: id}});
      await userToModify.updateOne({$pull: {followers: req.user._id}});
      //TODO: return the id of the user as a response
      res.status(200).json({message: "User unfollowed successfully"});
    } else{
      // Follow User
      await User.findByIdAndUpdate(id, {$push: {followers: req.user._id}});
      await User.findByIdAndUpdate(req.user._id, {$push: {following: id}});
      // Notify User
      const newNotification = Notification({
        type: "follow",
        from: req.user._id,
        to: userToModify._id
      });

      await newNotification.save();

      //TODO: return the id of the user as a response
      res.status(200).json({message: "User followed successfully"});
    }

  } catch (error) {
    res.status(500).json({error: error.message});
    console.log("Error at followUnfollowUser controller", error.message);
  }
};

export const getSuggestedUsers = async (req, res) => {
  try {
    const userId = req.user._id;

    const usersFollowedByMe = await User.findById(userId).select("following");

    const users = await User.aggregate([
      {
        $match:{
          _id: {$ne: userId}
        }
      },
      {$sample:{size:10}}
    ])
    
    const filteredUsers = users.filter(user=>!usersFollowedByMe.following.includes(user._id))
    const getSuggestedUsers = filteredUsers.slice(0,4)

    getSuggestedUsers.forEach(user=>user.password=null)

    res.status(200).json(getSuggestedUsers)
  } catch (error) {
    res.status(500).json({error: error.message});
    console.log("Error at getSuggestedUsers controller", error.message);
  }
}