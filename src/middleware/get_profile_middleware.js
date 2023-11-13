
const { Profile } = require('./../model');

const getProfile = async (req, res, next) => {
  try {
    const profile = await Profile.findOne({
      where: {
        id: req.get('profile_id') || 1
      }
    });

    if (!profile) return res.status(401).end();
    req.profile = profile;
    next();
  } catch (err) {
    console.error(err);
  }
};

module.exports = getProfile;
