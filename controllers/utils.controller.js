import { gets3signedUrl } from "../services/aws.service";

export const getSignedUrl = async (req, res) => {
  const key = req.params.key;
  const signedUrl = await gets3signedUrl(key);
  if (signedUrl) {
    return res
      .status(200)
      .json({ signedUrl });

  }
  return res.status(500).json({message: "INTERNAL SERVER ERROR"})
};