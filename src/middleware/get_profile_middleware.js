
const { Profile } = require('./../model');

const getProfile = async (req, res, next) => {
  try {
    const profile = await Profile.findOne({
      where: {
        id: req.get('profile_id')
      }
    });

    if (!profile) return res.status(401).end();
    req.profile = profile;
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ error: 'Invalid user' });
  }
};

module.exports = getProfile;
