export const signUp = async (req, res) => {
    try {
       console.log("here")
    } catch (e) {
        return res.status(200).json({ errorcode: 5, status: false, msg: e.message, data: null });
    }
}