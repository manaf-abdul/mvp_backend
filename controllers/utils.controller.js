import { gets3signedUrl } from "../services/aws.service.js";

export const getSignedUrl = async (req, res) => {
  const key = req.query?.key;
  if(!key) return res.status(400).json({message: "key is required"})
  const signedUrl = await gets3signedUrl(key);
  if (signedUrl) {
    return res
      .status(200)
      .json({ signedUrl });
  }
  return res.status(500).json({message: "INTERNAL SERVER ERROR"})
};
